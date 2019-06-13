//node ('kony-win') {
node{
	stage('Preparation') {
		cleanWs()
		checkout(
			[
				$class: 'GitSCM',
				branches: [[name: '*/develop']],
				doGenerateSubmoduleConfigurations: false,
				extensions: [[
					$class: 'RelativeTargetDirectory',
					relativeTargetDir: 'NewsAndWeather'
				],[
					$class: 'CleanBeforeCheckout'
				]],
				submoduleCfg: [],
				userRemoteConfigs: [[
					//credentialsId: 'jenkins.swpsci06',
					url: 'https://github.com/mig82/NewsAndWeather.git'
				]]
			]
		)
	}
		
	stage('Build') {
		dir("NewsAndWeather"){
			sh("""
				pwd
				ls -lA
				npm install
				node build.js
			""")
		}
	}
}
