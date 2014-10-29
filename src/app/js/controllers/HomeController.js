define([
    "dojo/dom",
    "dijit/registry",
    "dojo/_base/array",
    "models/HomeModel"
], function(dom, registry, arrayUtil, HomeModel) {
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
            //console.log(homeModeOptions);

            var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {

                //console.log(hmOpt);

                if (i === id) {
                    //alert(i);

                    hmOpt.display = true;


                    //console.log(hmOpt);
                } else {
                    hmOpt.display = false;
                    //console.log(hmOpt);
                }
                //console.log(hmOpt);
                return hmOpt;
            });
            HomeModel.vm.homeModeOptions([]);
            //console.log(mappedHomModeOptions);
            HomeModel.vm.homeModeOptions(mappedHomModeOptions);
        };

        currentModeOption(currentNodeId);
        //console.log(currentNodeId);
        //console.log(currentModeOption(currentNodeId));


        require(["dojo/fx", "dojo/_base/fx", "dojo/query"], function(coreFx, baseFx, dojoQuery) {

            var runAnimation = function(id) {
                //console.log("animating " + id);


                var itemsToAnimate = dojoQuery(".modeGroup");

                //console.log(itemsToAnimate);
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


                                    //console.log("Value of StopAnnimation is - " + stopAnimation);
                                    setTimeout(function() {
                                        //console.log(nextNodeId);
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
            //console.log(homeModeOptions);
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
            //o.startModeAnim();

        },

        handleModeClick: function(eventName) {
            //console.log(eventName);
            require(["controllers/Header"], function(Header) {
                //if (eventName == "goToMap") {
                Header.updateView("map", false, true);
                //} 
                /*else if (eventName == "goToAbout") {
                    Header.updateView("about", false, true);
                } else if (eventName == "goToAnalysis") {
                    Header.updateView("methods", false, true);
                } else if (eventName == "goToData") {
                    Header.updateView("data", false, true);
                }*/
            });

        },

        handleDotClick: function(obj) {
            o.stopModeAnim(obj);

            //o.startModeAnim(obj.id);
        }

    };

});