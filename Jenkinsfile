node ('kony-win') {
   stage('Preparation') {
       cleanWs()
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
                set PATH=C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;D:\\nodejs\\;D:\\apache-ant-1.8.4\\bin;D:\\Git\\cmd;D:\\Java\\jdk1.8.0_192\\bin
                set
                cd NewsAndWeather
                D:/nodejs/node.exe -v
                D:/nodejs/node.exe build.js
                '''
   }
   
}