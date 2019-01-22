/*
    currentgaversion = "8.0.0";
*/
var propParser = require('properties-parser');
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var headlessBuildProp = "HeadlessBuild.properties"
var headlessBuildPropPath = path.resolve(headlessBuildProp);
var buildProps = loadProperties(headlessBuildPropPath);
var spawn = require('child_process').spawn;
var os = require('os');

var projectName = readProp("project.name");

var projectLocation = __dirname;

var platforms = {
    "iphone": "iphone",
    "android": "android",
    "windowsphone8": "windowsphone8",
    "ipad": "ipad",
    "androidtablet": "androidtablet",
    "windowsphone81s": "windowsphone81s",
    "windowsphone10": "windowsphone10",
    spa: {
        "iphone": "iphone",
        "android": "android",
        "blackberry": "blackberry",
        "winphone": "winphone",
        "ipad": "ipad",
        "androidtablet": "androidtablet",
        "windowstablet": "windowstablet",
        hybrid: {
            "blackberry": "blackberry"
        }
    },
    "windows8.1": "windows8.1",
    "windows10": "windows10",
    "desktop_kiosk": "desktop_kiosk",
    "desktopweb": "desktopweb"
}

//list of plugin dependencies for build
const pluginList = function() {
    /**
     * Check whether a platform is selected for build.
     */
    function isBuildEnabled(platform) {
        return buildProps[platform] === 'true';
    }

    /**
     * find whether spa build is selected.
     */
    function isSpaBuildEnabled() {
        return Object.keys(platforms.spa).find(key => {
            if(key == 'hybrid') key += '.blackberry';
            return (buildProps['spa.'+key] === 'true');
        });
    }

    var plugins = {
        'com.pat.tool.keditor': 'Kony_Studio',
        'com.kony.thirdparty.jars': 'Third_Party_Jars_Plug-in',
        'com.kony.mobile.fabric.client.sdk': 'MobileFabric_Client_SDK'
    };

    if(os.platform() === 'darwin') {
        plugins['com.kony.studio.viz.core.mac64'] = 'Mac64_StudioViz_Core';
    } else {
        plugins['com.kony.studio.viz.core.win64'] = 'Win64_StudioViz_Core';
    }

    if(isBuildEnabled('iphone') || isBuildEnabled('ipad')) {
        plugins['com.kony.ios'] = 'iOS_Plugin';
    }

    if(isBuildEnabled('android')) {
        plugins['com.pat.android'] = 'Android';
    }

    if(isBuildEnabled('androidtablet')) {
        plugins['com.pat.tabrcandroid'] = 'Tablet_Android';
    }

    if(isBuildEnabled('desktopweb') || isSpaBuildEnabled()) {
        plugins['com.kony.cloudmiddleware'] = 'CloudMiddlewarePlugin';
        plugins['com.kony.cloudthirdparty'] = 'CloudThirdPartyPlugin';
        plugins['com.kony.spa'] = 'SPA';
        plugins['com.kony.desktopweb'] = 'Kony_Desktop_Web';
        plugins['com.kony.webcommons'] = 'Kony_Web_Commons';
    }

    if (os.platform() != 'darwin') {
        if (isBuildEnabled('windowsphone8') || isBuildEnabled('windowsphone81s')) {
            plugins['com.kony.windowsphone8'] = 'Windows_Phone_8_Plug-in';
        }

        if (isBuildEnabled('windowsphone10') || isBuildEnabled('windows10')) {
            plugins['com.kony.windows10'] = 'Windows_10_Plug-in';
        }

        if (isBuildEnabled('windows8.1')) {
            plugins['com.kony.windows8'] = 'Windows_8.1_Plug-in';
        }

        if (isBuildEnabled('desktop_kiosk')) {
            plugins['com.kony.windows'] = 'Windows_Desktop_Plug-in';
        }
    }
    return plugins;
}();

var config = {
    projectLocation: projectLocation,
    workspace:path.dirname(projectLocation),
    projectName:projectName,
    selectedPlatforms:readProp("selectedPlatforms"),
    pluginLocation:readProp("plugin.dir")
};

function BuildException(message, exitcode) {
    this.message = message;
    this.name = 'BuildException';
    this.exitcode = exitcode;
    console.log(message);
}

function validatingProp(propertyName) {
    if (config[propertyName] == null || config[propertyName] === "") {
        throw new BuildException("Set the " + propertyName +
            " in HeadlessBuild.properties", 50);
    }
    if (propertyName === "selectedPlatforms" && (config[propertyName]).length <= 0) {
        throw new BuildException(
            "At least one platform needs to be selected for build, in HeadlessBuild.properties",
            51);
    }
}

function getCleanFlag() {
    var arguments = process.argv.slice(2);
    for (var i in arguments) {
        var arg = arguments[i];
        if(arg === "-clean"){
            return true;
        }
    }
 }

function loadProperties(PropPath){
    var result = fs.readFileSync(PropPath);
    let props = propParser.parse(result);
    for(var key in props){
        if(typeof props[key] === 'string'){
            props[key] = props[key].trim();
        }
    }
    return props;
}

function readProp(propertyName){
    if(propertyName==="selectedPlatforms"){
        var platforms = getSelectedPlatforms(buildProps);
        return platforms;
    }
    else {
        var res = buildProps[propertyName];
        return res;
    }
}

function getSelectedPlatforms(props) {
    if (platforms && props) {
        var arrayOfSelectedPlatforms = filterSelectedPlats(platforms, props, '');
        if(props["universal.iphone"] !== undefined  && props["universal.iphone"] == 'true'){
            if(!(arrayOfSelectedPlatforms.indexOf("iphone") >= 0))
                arrayOfSelectedPlatforms.push("iphone");
            if(!(arrayOfSelectedPlatforms.indexOf("ipad") >= 0))
                arrayOfSelectedPlatforms.push("ipad");
        }
        if (os.platform() == 'darwin') {
            var windowsPlatforms = ["windowsphone8", "windowsphone81s",
                "windowsphone10", "windows8.1", "windows10", "desktop_kiosk"
            ];
            windowsPlatforms.forEach(function(winplatform) {
                var index = arrayOfSelectedPlatforms.indexOf(winplatform);
                if (index > -1) {
                    console.log(`Building of platform '${winplatform}' is not supported in mac`);
                    arrayOfSelectedPlatforms.splice(index, 1);
                }
            });
        }
        return arrayOfSelectedPlatforms;
    }
}

function filterSelectedPlats(platforms, properties, parent) {
    var selectedPlatforms = [];
    if (platforms && properties) {
        let platSel;
        let platName;
        for (let plat in platforms) {
            platName = platforms[plat];
            if (typeof platName === 'string') {
                platSel = properties[parent + platName];
                if (platSel && platSel.trim() == 'true') {
                    selectedPlatforms.push(parent + platName);
                }
            } else if (typeof platName === 'object') {
                let prefix = (parent ? (parent + ".") : '') + plat +
                    ".";
                selectedPlatforms = selectedPlatforms.concat(
                    filterSelectedPlats(platName,
                        properties, prefix));
            }
        }
    }
    return selectedPlatforms;
}

function extract(sourcePath, destinationPath) {
    if (!(fs.existsSync(destinationPath))) {
        fs.mkdirSync(destinationPath);
        console.log("---- Extracting ", path.basename(sourcePath),
            "\n\tto", destinationPath);
        try {
            var unzipper = new AdmZip(sourcePath);
            unzipper.extractAllTo(destinationPath, true);
            console.log("Done.");
        } catch (e) {
            console.log(e);
            throw new BuildException(
                "Failed to extract the plugins. This can happen if the machine is running low on memory. \n" + e,
                64);
        }
        
    }
}

function copyFolders(sourcePath,destinationPath){
    var files = [];

    var targetFolder = path.join( destinationPath, path.basename( sourcePath ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }
    //copy
    if ( fs.lstatSync( sourcePath ).isDirectory() ) {
        files = fs.readdirSync( sourcePath );
        files.forEach( function ( file ) {
            var curSource = path.join( sourcePath, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolders( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function copyFileSync( source, target ) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function deleteFolder(folderpath){
    var deleteFolderRecursive = function(folderpath) {
        if( fs.existsSync(folderpath) ) {
            fs.readdirSync(folderpath).forEach(function(file,index){
                var curPath = path.resolve(folderpath ,file);
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            try{
                fs.rmdirSync(folderpath);
            }
            catch(err){
                if(err.code == 'ENOTEMPTY')
                    deleteFolderRecursive(folderpath);
            }
        }
    };
    deleteFolderRecursive(folderpath);
}

function extractPlugin(sourcePath, projectLocation){
    console.log("Extracting plugins...");
    var destinationPath = path.resolve(config.workspace, "bundles");
    if(!fs.existsSync(destinationPath)){
        console.log("bundles folder doesn't exits in workspace. extracting plugins in clean mode");
        fs.mkdirSync(destinationPath);
    }

    var versionMap = "";
    var pluginVersionFile = "pluginversions.properties",
        pluginVersionPath = path.resolve(destinationPath, pluginVersionFile);

    var files = fs.readdirSync(sourcePath);
    files.forEach(function(file, index){
        var fromPath = path.join(sourcePath, file);
        if(path.extname(fromPath)===(".jar")){
            var fileName = path.basename(fromPath,".jar");
            var pluginId = fileName.substring(0,fileName.indexOf('_'));
            var pluginVersion = fileName.substring(fileName.indexOf('_')+1);

            if(pluginList[pluginId]) {
                versionMap = versionMap.concat("\n",
                    pluginList[pluginId], "=", pluginVersion);
                var toPath = path.join(destinationPath, pluginId);
                extract(fromPath, toPath);
            }
        }
    });
    fs.writeFile(pluginVersionPath, versionMap, (err) => {
        if(err) throw err;
        console.log(pluginVersionFile + ' saved to bundles folder.');
    });
}

function prebuild(){
    if(projectName == null || projectName === "") {
        throw new BuildException("Set the project name in HeadlessBuild.properties", 50);
    }

    var clean = getCleanFlag();
    var projectLocation = config.projectLocation;
    var bundlesLocation = path.resolve(config.workspace,"bundles");
    var projectDir = path.basename(projectLocation);

    if(projectName !== projectDir) {
        throw new BuildException("ProjectName '" + projectName + "'" + " is not matching with project directory name '" + projectDir + "'", 50);               
    }

    validatingProp("selectedPlatforms");
    validatingProp("pluginLocation");

    if(clean){
        console.log("Cleaning the bundles folder...");
        deleteFolder(bundlesLocation);
        fs.mkdirSync(bundlesLocation);
    }

    extractPlugin(config.pluginLocation,projectLocation);

    var installedPlugins = fs.readdirSync(bundlesLocation);
    var missingPlugins = Object.keys(pluginList).filter(plugin => {
        return installedPlugins.indexOf(plugin) === -1;
    });

    if(missingPlugins.length){
        throw new BuildException("missing mandatory plugins: " + missingPlugins.join(', '), 52);
    }

    var ci_platform = os.platform() == 'darwin' ? 'mac64' : 'win64',
        studioViz_plugin = "com.kony.studio.viz.core.".concat(ci_platform);
    var konywebstudio = path.resolve(bundlesLocation, studioViz_plugin, "konywebstudio");
        buildLocation = path.resolve(konywebstudio, "kbuild", "BuildManager.js");
    var configString = JSON.stringify(config);

    var buildproc = spawn('node', [buildLocation, "console", config.workspace, "",
        "--NODE_APP_INSTANCE=vide", configString], {cwd:konywebstudio});

    buildproc.stdout.on('data' , function(data){
        console.log(data.toString());
    });
    buildproc.stderr.on('data' , function(data){
        console.log(data.toString());
    });
    buildproc.on('exit', (code) => {
        process.exit(code);
    });
}

try {
    prebuild();
} catch (e) {
    if (e instanceof BuildException) {
        process.exitCode = e.exitcode;
    } else {
        console.error(e);
        process.exitCode = 1;
    }
}
