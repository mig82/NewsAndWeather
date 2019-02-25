node ('kony-win') {
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
       git branch: 'develop', url: 'ssh://git@tom.wincor-nixdorf.com:7999/gdger/ps-kony-test.git'
   }
   stage('Build') {
         bat '''
                npm install && D:/nodejs/node.exe build.js
                '''
   }
   
}