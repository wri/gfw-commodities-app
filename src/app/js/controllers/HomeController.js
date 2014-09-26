define([
	"dojo/dom",
	"dijit/registry",
	"dojo/_base/array"
], function (dom, registry, arrayUtil) {
	'use strict';

	    var o = {};
        var initialized = false;
        var viewName = "homeView";
        var viewObj = {
            viewId: "homeView",
            viewName: "home"
        };


        var stopAnimation = false;
        o.init = function() {
            var that = this;
            if (initialized) {
                //switch to this view
                //EventsController.switchToView(viewObj);

                //EventsController.startModeAnim();
                return;
            }

            require(["dojo/templates!/home.html"], function(html) {

                initialized = true;
                //otherwise load the view

                dom.byId(viewName).innerHTML = html;
                console.log(html);
                /*

                EventsController.switchToView(viewObj);


                HomeModel.applyBindings(viewName);

                //ANIMATE ONLY AFTER BINDING DONE


                EventsController.getPeats();*/
                /*{
                    resume: true
                }*/
                //console.log(html);

            });
        };


                var homeModeOptions =  [{
                    "html": "Fires occuring in peatland <br> in the last 7 days",
                    "eventName": "goToMap",
                    "display": false
                },
                {
                    "html": "<span>View the latest analysis</span>",
                    "eventName": "goToAnalysis",
                    "display": false
                }, {
                    "html": "<span>View the latest imagery</span>",
                    "eventName": "goToMap",
                    "display": false
                }, {
                    "html": "<span>Explore the map</span>",
                    "eventName": "goToMap",
                    "display": false
                },
                {
                    "html": "<span class='more-text'>Sign up for SMS and email fire alerts</span>",
                    "eventName": "subscribeToAlerts",
                    "display": false
                }
            	];


        o.startModeAnim = function(data) {
        	//console.log("Data:");
            //console.log(data);
            stopAnimation = false;

            var currentNodeId = 0; //start with last one

            var currentModeOption = function(id) {

                var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {
                	//console.log("HERE IS THE THING I AM LOOKING FOR:");
                	//console.log(hmOpt);
                	//console.log("AND ALSO:" + i);
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
                //HomeModel.vm.homeModeOptions([]);
                //console.log(mappedHomModeOptions);
                //HomeModel.vm.homeModeOptions(mappedHomModeOptions);
            };

            currentModeOption(currentNodeId);
            //console.log("HERE!");
            //console.log(currentModeOption(currentNodeId));


	require(["dojo/fx", "dojo/_base/fx", "dojo/query"], function(coreFx, baseFx, dojoQuery) {

	        var runAnimation = function(id) {
	            //console.log("animating " + id);
	            var itemsToAnimate = dojoQuery(".modeGroup");
	            //var itemsToAnimate = homeModeOptions;
	            //console.log("ITEMS TO ANIMATE:");
	            //console.log(itemsToAnimate);
	            var maxItems = itemsToAnimate.length;
	            //var maxItems = 5;
	            setTimeout(function() {
	            	//console.log(itemsToAnimate[id]);
	            }, 500);
	            

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
	                        //currentNodeId++;
	                        //console.log(currentNodeId);
	                        //console.log(nextNodeId);
	                        setTimeout(function() {
	                            currentModeOption(nextNodeId);
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
	                    duration: 500,
	                    delay: 2000//Time it takes the circle to slide left and dissipate
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
			o.startModeAnim(homeModeOptions);

		}

	};

});