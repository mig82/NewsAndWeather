//startup.js file
var globalhttpheaders = {};
var appConfig = {
    appId: "NewsAndWeather",
    appName: "NewsAndWeather",
    appVersion: "1.0.0",
    platformVersion: null,
    serverIp: "192.168.56.1",
    serverPort: "80",
    secureServerPort: "443",
    isDebug: true,
    middlewareContext: "NewsAndWeather",
    isturlbase: "https://empselfservice1.konycloud.com/services",
    isMFApp: true,
    appKey: "d708a3c870bc7a7d8e69c1ec272674e5",
    appSecret: "79da3cc05fa200a27baf6a856f6219f5",
    serviceUrl: "https://100017816.auth.konycloud.com/appconfig",
    svcDoc: {
        "selflink": "https://100017816.auth.konycloud.com/appconfig",
        "identity_meta": {},
        "integsvc": {
            "ZWeatherForeCast": "https://empselfservice1.konycloud.com/services/ZWeatherForeCast",
            "ZNewsForCategory": "https://empselfservice1.konycloud.com/services/ZNewsForCategory",
            "News": "https://empselfservice1.konycloud.com/services/News",
            "ZLocalNewsNWeather": "https://empselfservice1.konycloud.com/services/ZLocalNewsNWeather",
            "ZCityWeather": "https://empselfservice1.konycloud.com/services/ZCityWeather",
            "ZLocalNews": "https://empselfservice1.konycloud.com/services/ZLocalNews"
        },
        "appId": "75822985-6cc2-4527-aa38-6b627f653e58",
        "identity_features": {
            "reporting_params_header_allowed": true
        },
        "name": "NewsNWeatherDemo",
        "reportingsvc": {
            "session": "https://empselfservice1.konycloud.com/services/IST",
            "custom": "https://empselfservice1.konycloud.com/services/CMS"
        },
        "baseId": "6a074535-94ec-4b27-8790-2f93f888e19a",
        "login": [{
            "alias": "userstore",
            "type": "basic",
            "prov": "userstore",
            "url": "https://100017816.auth.konycloud.com"
        }],
        "services_meta": {
            "ZWeatherForeCast": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/ZWeatherForeCast"
            },
            "ZNewsForCategory": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/ZNewsForCategory"
            },
            "News": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/News"
            },
            "ZLocalNewsNWeather": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/ZLocalNewsNWeather"
            },
            "ZCityWeather": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/ZCityWeather"
            },
            "ZLocalNews": {
                "type": "integsvc",
                "version": "1.0",
                "url": "https://empselfservice1.konycloud.com/services/ZLocalNews"
            }
        }
    },
    svcDocRefresh: false,
    svcDocRefreshTimeSecs: -1,
    eventTypes: ["FormEntry", "Error", "Crash"],
    url: "https://empselfservice1.konycloud.com/NewsAndWeather/MWServlet",
    secureurl: "https://empselfservice1.konycloud.com/NewsAndWeather/MWServlet"
};
sessionID = "";

function appInit(params) {
    skinsInit();
    kony.application.setCheckBoxSelectionImageAlignment(constants.CHECKBOX_SELECTION_IMAGE_ALIGNMENT_RIGHT);
    kony.application.setDefaultTextboxPadding(false);
    kony.application.setRespectImageSizeForImageWidgetAlignment(true);
    setAppBehaviors();
};

function setAppBehaviors() {
    kony.application.setApplicationBehaviors({
        applyMarginPaddingInBCGMode: false,
        adherePercentageStrictly: true,
        retainSpaceOnHide: true,
        isMVC: true,
        marginsIncludedInWidgetContainerWeight: true,
        APILevel: 8000
    })
};

function themeCallBack() {
    initializeGlobalVariables();
    applicationController = require("applicationController");
    callAppMenu();
    kony.application.setApplicationInitializationEvents({
        init: applicationController.appInit,
        appservice: applicationController.AS_AppEvents_be321f0d17f149e29b3df2a8d032e4f5,
        showstartupform: function() {
            var startForm = new kony.mvc.Navigation("frmSplash");
            startForm.navigate();
        }
    });
};

function loadResources() {
    globalhttpheaders = {};
    sdkInitConfig = {
        "appConfig": appConfig,
        "isMFApp": appConfig.isMFApp,
        "appKey": appConfig.appKey,
        "appSecret": appConfig.appSecret,
        "eventTypes": appConfig.eventTypes,
        "serviceUrl": appConfig.serviceUrl
    }
    kony.setupsdks(sdkInitConfig, onSuccessSDKCallBack, onSuccessSDKCallBack);
};

function onSuccessSDKCallBack() {
    kony.theme.setCurrentTheme("default", themeCallBack, themeCallBack);
}

function onSuccess(oldlocalname, newlocalename, info) {
    loadResources();
};

function onFailure(errorcode, errormsg, info) {
    loadResources();
};
kony.application.setApplicationMode(constants.APPLICATION_MODE_NATIVE);
//If default locale is specified. This is set even before any other app life cycle event is called.
kony.i18n.setDefaultLocaleAsync("en_US", onSuccess, onFailure, null);
// If you wish to debug Application Initialization events, now is the time to
// place breakpoints.
debugger;