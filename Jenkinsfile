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
                echo set JAVA_HOME=D:\\Java\\jdk1.8.0_192 > out.cmd
                echo set TMP=C:\\tmp >> out.cmd
                echo set TEMP=C:\\tmp>> out.cmd
                echo set APPDATA=C:\\tmp\\AppData>> out.cmd
                echo set USERPROFILE=C:\\tmp\\profile>> out.cmd
                set >> out.cmd
                echo cd NewsAndWeather >> out.cmd
                echo D:/nodejs/node.exe -v >> out.cmd
                echo D:/nodejs/node.exe build.js >> out.cmd
                cmd /c out.cmd
                '''
   }
   
}