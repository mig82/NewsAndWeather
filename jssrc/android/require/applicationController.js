define({
    AS_AppEvents_be321f0d17f149e29b3df2a8d032e4f5: function AS_AppEvents_be321f0d17f149e29b3df2a8d032e4f5(eventobject) {
        var self = this;
        debugger;
        var isFreshLaunch = kony.store.getItem("isFirstTime");
        kony.store.setItem("isFirstLaunch", true);
        /*if(isFreshLaunch!== undefined && isFreshLaunch== null && isFreshLaunch== "false"){

    return "frmNewsAndWeather";
}else{
  return "frmSplash";*/
        if (isFreshLaunch === undefined || isFreshLaunch == null) {
            //fresh launch
            kony.store.setItem("isFirstTime", false);
            return "frmSplash";
        } else {
            //second launch
            return "frmNewsAndWeather";
        }
    },
    appInit: function(params) {
        skinsInit();
        kony.mvc.registry.add("com.konycmpt.KnowledgeFramework1", "KnowledgeFramework1", "KnowledgeFramework1Controller");
        kony.application.registerMaster({
            "namespace": "com.konycmpt",
            "classname": "KnowledgeFramework1",
            "name": "com.konycmpt.KnowledgeFramework1"
        });
        kony.mvc.registry.add("com.konycmpt.SplashScreen", "SplashScreen", "SplashScreenController");
        kony.application.registerMaster({
            "namespace": "com.konycmpt",
            "classname": "SplashScreen",
            "name": "com.konycmpt.SplashScreen"
        });
        kony.mvc.registry.add("com.konymp.slidingmenu", "slidingmenu", "slidingmenuController");
        kony.application.registerMaster({
            "namespace": "com.konymp",
            "classname": "slidingmenu",
            "name": "com.konymp.slidingmenu"
        });
        kony.mvc.registry.add("com.konysa.socialSharing", "socialSharing", "socialSharingController");
        kony.application.registerMaster({
            "namespace": "com.konysa",
            "classname": "socialSharing",
            "name": "com.konysa.socialSharing"
        });
        kony.mvc.registry.add("CopyflxRow", "CopyflxRow", "CopyflxRowController");
        kony.mvc.registry.add("flexMainNews", "flexMainNews", "flexMainNewsController");
        kony.mvc.registry.add("flxFullSplashScreen", "flxFullSplashScreen", "flxFullSplashScreenController");
        kony.mvc.registry.add("flexAPIs", "flexAPIs", "flexAPIsController");
        kony.mvc.registry.add("flexNewsSelectionMain", "flexNewsSelectionMain", "flexNewsSelectionMainController");
        kony.mvc.registry.add("frmNewsAndWeather", "frmNewsAndWeather", "frmNewsAndWeatherController");
        kony.mvc.registry.add("frmNewsDetails", "frmNewsDetails", "frmNewsDetailsController");
        kony.mvc.registry.add("frmSplash", "frmSplash", "frmSplashController");
        kony.mvc.registry.add("KnowledgeFramework/frmFramework", "KnowledgeFramework/frmFramework", "KnowledgeFramework/frmFrameworkController");
        setAppBehaviors();
    },
    postAppInitCallBack: function(eventObj) {},
    appmenuseq: function() {
        new kony.mvc.Navigation("frmSplash").navigate();
    }
});