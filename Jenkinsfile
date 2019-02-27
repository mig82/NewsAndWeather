node ('kony-win') {
   stage('Preparation') {
       checkout([$class: 'GitSCM', branches: [[name: '*/develop']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'NewsAndWeather'],[$class: 'CleanBeforeCheckout']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins.swpsci06', url: 'ssh://git@tom.wincor-nixdorf.com:7999/gdger/ps-kony-test.git']]])
   }
   
   stage('Build') {
         bat '''
                set APPDATA=C:\\tmp\\AppData
                set USERPROFILE=C:\\tmp\\profile
                npm config set proxy http://proxy:81
                npm config set https-proxy http://proxy:81
                cd NewsAndWeather && npm install
                '''
         bat '''
                set JAVA_HOME=D:\\Java\\jdk1.8.0_192
                set TMP=C:\\tmp
                set TEMP=C:\\tmp
                set APPDATA=C:\\tmp\\AppData
                set USERPROFILE=C:\\tmp\\profile
                echo cd NewsAndWeather > out.cmd
                echo D:/nodejs/node.exe -v >> out.cmd
                echo D:/nodejs/node.exe build.js >> out.cmd
                echo echo done >> out.cmd
                cmd /c out.cmd  /RUNAS:Administrator
                '''
   }
   
}