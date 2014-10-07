define([
	"dojo/dom",
	"dijit/registry",
	"dojo/_base/array",
	"models/HomeModel"
], function (dom, registry, arrayUtil, HomeModel) {
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

            stopAnimation = false;

            var currentNodeId = 0; //start with last one

            var currentModeOption = function(id) {
            	
            	var homeModeOptions = HomeModel.vm.homeModeOptions();
            	console.log(homeModeOptions);

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
                console.log(mappedHomModeOptions);
                HomeModel.vm.homeModeOptions(mappedHomModeOptions);

            };

            currentModeOption(currentNodeId);
            //console.log(currentNodeId);
            //console.log(currentModeOption(currentNodeId));


	require(["dojo/fx", "dojo/_base/fx", "dojo/query"], function(coreFx, baseFx, dojoQuery) {

	        var runAnimation = function(id) {
	            //console.log("animating " + id);
	            var itemsToAnimate = dojoQuery(".modeGroup");
	            
	            //var itemsToAnimate2 = homeModeOptions;
	            console.log("ITEMS TO ANIMATE:");

	            console.log(itemsToAnimate);
	            //console.log(itemsToAnimate2);
	            var maxItems = itemsToAnimate.length;
	            //console.log(dojoQuery(".modeGroup")[0]);
	            //var maxItems = 5;
	            // setTimeout(function() {
	            // 	console.log(itemsToAnimate[id]);
	            // }, 500);
	            

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
	                        currentNodeId++;
	                        //console.log(currentNodeId);
	                        //console.log(nextNodeId);
	                        setTimeout(function() {
	                            currentModeOption(nextNodeId);
	                            //console.log(nextNodeId);
	                            if (!stopAnimation) {
	                                setTimeout(function() {
	                                    runAnimation(nextNodeId);
	                                }, 1000);
	                                // add next circle after this timeout ends
	                                // getelementbyID w/ content
	                            }
	                        }, 500); //Time between animations when the circle just sits there
	                    },
	                    units: "px",
	                    duration: 1000, //Time it takes the circle to slide left and dissipate
	                    delay: 2000 // Time we wait to animate on Load
	                })
	                /*baseFx.animateProperty({
	                    node: itemsToAnimate[id + 1],
	                    properties: {
	                        opacity: {
	                            start: 0,
	                            end: 1
	                        }
	                    },
	                    duration: 500
	                })*/
	            ]);
	            /*aspect.before(anim, "beforeBegin", function() {
	                domStyle.set(container, "backgroundColor", "#eee");
	            });*/
	            anim.play();
	            //.play();
	        };
	        runAnimation(currentNodeId);
	    });

	};
	

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("homeView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("homeView");
			registry.byId("homeView").set('content', template);
			
			HomeModel.initialize("homeView");

			o.startModeAnim();

		}

	};

});