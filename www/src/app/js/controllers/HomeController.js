define([
    "main/config",
    "dojo/dom",
    "dojo/cookie",
    "dijit/Dialog",
    "dijit/registry",
    "dojo/_base/array",
    "models/HomeModel"
], function(AppConfig, dom, cookie, Dialog, registry, arrayUtil, HomeModel) {
    'use strict';


    var o = {};
    var initialized = false;
    var viewName = "homeView";
    var viewObj = {
        viewId: "homeView",
        viewName: "home"
    };


    var stopAnimation = false;


    o.startModeAnim = function() {

        var currentNodeId = 0; //start with last one

        var currentModeOption = function(id) {

            var homeModeOptions = HomeModel.vm.homeModeOptions();
            var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {

                if (i === id) {
                    //alert(i);
                    hmOpt.display = true;
                } else {
                    hmOpt.display = false;
                }
                return hmOpt;
            });
            HomeModel.vm.homeModeOptions([]);
            HomeModel.vm.homeModeOptions(mappedHomModeOptions);
        };

        currentModeOption(currentNodeId);

        require(["dojo/fx", "dojo/_base/fx", "dojo/query"], function(coreFx, baseFx, dojoQuery) {

            var runAnimation = function(id) {

                var itemsToAnimate = dojoQuery(".modeGroup");
                var maxItems = itemsToAnimate.length;
                //var maxItems = 5;

                var anim = coreFx.chain([

                    baseFx.animateProperty({
                        node: itemsToAnimate[id],
                        properties: {
                            marginLeft: {
                                start: 0,
                                end: -350
                            },
                            opacity: {
                                start: 1,
                                end: 0
                            }
                        },
                        onEnd: function() {
                            var nextNodeId;
                            if (currentNodeId < maxItems - 1) {
                                nextNodeId = currentNodeId + 1;
                                currentNodeId++;
                            } else {
                                nextNodeId = 0;
                                currentNodeId = 0;
                            }

                            setTimeout(function() {
                                if (!stopAnimation) {
                                    currentModeOption(nextNodeId);
                                    setTimeout(function() {
                                        if (!stopAnimation) {
                                            runAnimation(nextNodeId);
                                        }

                                    }, 1000);
                                }
                            }, 250); //Time between animations but before the next circle appears
                        },
                        units: "px",
                        duration: 1000, //Time it takes the circle to slide left and dissipate
                        delay: 2000 // Time we wait to animate on Load
                    })

                ]);
                anim.play();
            };
            runAnimation(currentNodeId);
        });

    };

    o.stopModeAnim = function(data) {
        stopAnimation = true;

        if (data) {
            //o.startModeAnim(data.id);

            var currentNodeId = data.id;

            var homeModeOptions = HomeModel.vm.homeModeOptions();
            HomeModel.vm.homeModeOptions([]);

            var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {

                if (currentNodeId == i) {
                    hmOpt.display = true;
                } else {
                    hmOpt.display = false;
                }
                HomeModel.vm.homeModeOptions.push(hmOpt);
                return hmOpt;
            });
        }

    };

    // o.isInitialized = function() {
    //     return initialized;
    // };


    return {

        init: function(template) {

            if (initialized) {
                registry.byId("stackContainer").selectChild("homeView");
                return;
            }
            initialized = true;
            registry.byId("stackContainer").selectChild("homeView");
            registry.byId("homeView").set('content', template);

            HomeModel.initialize("homeView");
            o.startModeAnim();

            // GFW Requested to remove this feature
            // Commenting out for now in case it needs to be added back in
            // Show the Splash Info Window
            // this.showSplashScreen();

        },

        handleModeClick: function(eventName) {
            require(["controllers/Header"], function(Header) {
              console.log(eventName);
                if (eventName == "goToMap") {
                    Header.updateView("map", false, true);
                } else if (eventName == "goToWizard") {
                    Header.updateView("map-wizard", false, true);
                } else if (eventName == "goToAnalysis") {
                  Header.updateView("map-analysis", false, true);
                } else if (eventName == "goToSupplier") {
                  Header.updateView("map-supplier", false, true);
                } else if (eventName == "goToPalm") {
                    Header.updateView("map-palm", false, true);
                } else if (eventName == "goToFires") {
                    Header.updateView("fires", "true", true);
                } else if (eventName == "goToBlogs") {
                    Header.updateView("blog", "true", true);
                } else if (eventName == "goToZSL") {
                    Header.updateView("SPOTT", "true", true);
                }

            });

        },

        handleDotClick: function(obj) {
            o.stopModeAnim(obj);

            //o.startModeAnim(obj.id);
        },

        showSplashScreen: function () {
            // Dialog
            // Cookie
            var splashScreen = cookie("hideSplashScreen"),
                checkboxContent,
                dialog,
                value;

            if (!splashScreen) {
                checkboxContent = "<label><input id='hideSplashScreen' type='checkbox' />&nbsp;&nbsp;Don't ask me again.</label>";
                dialog = new Dialog({
                    id: 'splashDialog',
                    title: 'Welcome to GFW Commodities Analyzer',
                    style: 'width: 510px;',
                    content: AppConfig.homeDialog.html + checkboxContent
                });
                dialog.show();

                dialog.on('cancel', function () {
                    value = document.getElementById('hideSplashScreen').checked;
                    if (value) {
                        cookie("hideSplashScreen", value, {
                            expires: 31
                        });
                    }
                });
            }

        }

    };

});
