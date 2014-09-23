define([
	"dojo/dom",
	"dojo/query",
	"dojo/Deferred",
	"dojo/_base/fx",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/registry",
	"dojo/dom-construct",
	"map/config",
	"map/MapModel",
	"map/LayerController",
	"esri/request",
	"esri/TimeExtent",
  "esri/dijit/TimeSlider"
], function (dom, dojoQuery, Deferred, Fx, domClass, domStyle, registry, domConstruct, MapConfig, MapModel, LayerController, request, TimeExtent, TimeSlider) {
	'use strict';

	return {

		toggleToolbox: function (layerConfig, operation) {
			// Hide other tools, then show this node if operation is show
			this.hideAllToolboxes();

			if (operation === 'show') {
				domStyle.set(layerConfig.toolsNode, 'display', 'block');
			}
		},

		hideAllToolboxes: function () {
			dojoQuery(".gfw .layer-controls-container .toolbox").forEach(function (node) {
				if (domStyle.get(node, 'display') === "block") {
					domStyle.set(node, 'display', 'none');
				}
			});
		},

		toggleFiresLayerOptions: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					filter = target.dataset ? target.dataset.filter : target.getAttribute('data-filter'),
					highConfidence;
			// Remove selected class from previous selection
			dojoQuery(".fires_toolbox .toolbox-list li").forEach(function (node) {
				domClass.remove(node, "selected");
			});
			// Add selected class to new selection
			domClass.add(target, "selected");

			// Get status of high confidence fires checkbox
			highConfidence = dom.byId("high-confidence").checked;
			
			LayerController.setFiresLayerDefinition(filter, highConfidence);
		},

		toggleFiresConfidenceLevel: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					highConfidence = target.checked,
					element,
					filter;

			// Find the currently active filter
			element = dojoQuery(".fires_toolbox .toolbox-list li.selected")[0];
			filter = element.dataset ? element.dataset.filter : element.getAttribute("data-filter");

			LayerController.setFiresLayerDefinition(filter, highConfidence);

		},

		// this function should also have the ability to handle string (dom node id's) to turn these on
		toggleOverlays: function (evt, nodeId) {
			if (evt) {
				domClass.toggle(evt.currentTarget, 'selected');
			} else if (nodeId) {
				// May Extend this to take an array so if 4 nodes need to be updated, I dont update the layer 4 times
				// instead, toggle all the classes and then update the layer, in this case, nodeId would be an array
				domClass.toggle(dom.byId(nodeId), 'selected');
			}

			LayerController.setOverlaysVisibleLayers();
		},

		generateTimeSliders: function () {
			this.buildFormaSlider();
			this.buildTreeCoverChangeSlider();
		},

		buildFormaSlider: function () {
			var incrementer = 0,
					baseYear = 13,
					labels = [],
					timeSlider,
					timeExtent,
					month;

			timeSlider = new TimeSlider({
				style: "width: 100%;",
				id: "formaSlider"
			}, dom.byId("formaAlertSlider"));

			timeExtent = new TimeExtent();

			timeSlider.setThumbCount(1);
			timeSlider.setThumbMovingRate(1500);
			timeSlider.setLoop(false); // Bug when true when it wraps around, it thinks its thumb
			// is still at the last index and does not know that its at 0 index

			domConstruct.destroy(registry.byId(timeSlider.nextBtn.id).domNode.parentNode);
      registry.byId(timeSlider.previousBtn.id).domNode.style.display = "none";
      registry.byId(timeSlider.playPauseBtn.id).domNode.style["vertical-align"] = "text-bottom";

      this.fetchFORMAAlertsLabels().then(function (res) {
      	if (res) {
      		for (var i = res.minValues[0], length = res.maxValues[0]; i <= length; i++) {
      			month = i % 12 === 0 ? 12 : i % 12;
      			labels.push(month + "-" + (baseYear + incrementer));
      			if (i % 12 === 0) { ++incrementer; }
      		}

      		timeExtent.startTime = new Date("1/1/2013 UTC");
      		timeExtent.endTime = new Date();
      		timeSlider.createTimeStopsByCount(timeExtent, res.maxValues[0]);
          timeSlider.setLabels(labels);
          timeSlider.setThumbIndexes([labels.length - 1]);
          timeSlider.startup();          
      	}

      	timeSlider.on("time-extent-change", function (evt) {
      		// These values are not updated immediately, call requestAnimationFrame 
      		// to execute on the next available frame

      		var values;
      		requestAnimationFrame(function () {
      			values = [0, timeSlider.thumbIndexes[0]];
      			LayerController.updateImageServiceRasterFunction(values, MapConfig.forma);
      		});
      	});

      });


		},

		buildTreeCoverChangeSlider: function () {
			// treeCoverLossSlider.baseYear & numYears
			var sliderConfig = MapConfig.treeCoverLossSlider,
					labels = [],
					timeSlider,
					timeExtent;

			timeSlider = new TimeSlider({
				style: "width: 100%;",
				id: "treeCoverSlider"
			}, dom.byId("treeCoverSlider"));

			timeExtent = new TimeExtent();

			timeSlider.setThumbCount(2);
			timeSlider.setThumbMovingRate(1500);
			timeSlider.setLoop(false); // Bug when true when it wraps around, it thinks its thumb
			// is still at the last index and does not know that its at 0 index

			domConstruct.destroy(registry.byId(timeSlider.nextBtn.id).domNode.parentNode);
      registry.byId(timeSlider.previousBtn.id).domNode.style.display = "none";
      registry.byId(timeSlider.playPauseBtn.id).domNode.style["vertical-align"] = "text-bottom";

      // Create Labels from Config file
      for (var i = 0, length = sliderConfig.numYears; i <= length; i++) {
      	labels.push('' + (sliderConfig.baseYear + i));
      }

  	  timeExtent.startTime = new Date("1/1/2013 UTC");
      timeExtent.endTime = new Date();
  	  timeSlider.createTimeStopsByCount(timeExtent, labels.length);
      timeSlider.setLabels(labels);
      //timeSlider.setThumbIndexes([0,labels.length - 1]);
      timeSlider.setThumbIndexes([0,labels.length]);
      timeSlider.startup();
      	
      	//timeSlider.playPauseBtn._onChangeActive = false;
      	timeSlider.on("play", function (evt) { 
      		var values;
      		console.log(timeSlider.domNode);
      		console.log(timeSlider);
      		
      		var value1 = timeSlider.thumbIndexes[0];
      		var value2 = timeSlider.thumbIndexes[1];
      		console.log("On initial Play, thumb 1 at: " + value1);
      		console.log("On initial Play, thumb 2 at: " + value2);

      		setTimeout(function () {
      			console.log("THAT FIRST DECREMENT!");
      			//timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],value2 - 1]);
      		},1500);

      		requestAnimationFrame(function () {
      			console.log("First inside the animation frame; t2: " + value2);
    			values = [0, timeSlider.thumbIndexes[0]];
    			//timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],value2-1]);
    			console.log("Right afterwards, after we set the indexes: " + timeSlider.thumbIndexes[1]);
    			var index = timeSlider.thumbIndexes[0];
    			if (timeSlider.thumbIndexes[1] == 12) {
    				timeSlider.setThumbIndexes([value1,value2 - 1]);
    			}
    			function timeout(i) {
    				//console.log(timeSlider.playing);
    				// If play button is active, have 2 thumbs, & freeze the 2nd. When it isn't have 1 thumb 
    				// & adjust the #ticks count it can run and their values, and fake a 2nd slider!
    				// Then, when the time slider is no longer playing, re-initialize it at the current location. 
    				//console.log("Thumb 1 at: " + timeSlider.thumbIndexes[0]);
				    console.log("Thumb 2 at: " + timeSlider.thumbIndexes[1]);
				    var thumbOne = timeSlider.thumbIndexes[0];
				    var thumbTwo = timeSlider.thumbIndexes[1];
				    // Here I want a small edge case that handles if the user just presses play 1st; thumb1 is
				    // at 0 & thumb2 is at 13. I want it to go down to one thumb, and play IMMEDIETELY with no
				    // timeOut, THEN enter the timeOut function per usual w/ 1 thumb at ..1? 0? Idk. This if
				    // statement should also remove the need for the 2nd part of the else if below. I think.
				    if ((timeSlider.thumbIndexes[0] == 0 && timeSlider.thumbIndexes[1] == 13) || timeSlider.thumbIndexes[1] == 12) {
				    	//console.log("Original state of slider case!");
				    	//timeSlider.thumbIndexes.splice(1,1);
			    		//timeSlider.setThumbCount(1);
			    		console.log("DID THE TWO THUMBS WORK");
			    		timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],(11)]);
			    		//timeSlider.play();
				    }

				    // First loop they both do, then neither, then just thumbIndexOne
				    setTimeout(function () {
				    	if (timeSlider.playing == true) {
				    		timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],(value2 - 1)]);
				    	} else {
				    		return;
				    	}
				    	
				    	if (timeSlider.thumbIndexes[0] == value2) {
				    		values = [0, timeSlider.thumbIndexes[0]];
				    		LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);
				    		timeSlider.pause();
				    		/*if (timeSlider.thumbCount == 1) {
				    			timeSlider.setThumbCount(2); 
				    			if (value2 == 12) {
				    				//timeSlider.setThumbIndexes([0,12]);
				    			} else if (value2 == 11) {
				    				//timeSlider.setThumbIndexes([0,11]);
				    			} else {
				    				timeSlider.setThumbIndexes([value2,value2]);
				    			}
				    		}*/
				    		return;
				    	} //else if (timeSlider.thumbIndexes[1] == 12) {
				    		//console.log("Here we set #indexes to 1 and just continue on");
				    		//timeSlider.thumbIndexes.splice(1,1);
				    		//console.log("Down to one thumb here!");
				    		//timeSlider.setThumbCount(1);
				    		//console.log(timeSlider);
				    		//console.log(timeSlider.playing);
				    		//console.log("ARE WE EVER GETTING HERE??!");
				    		//timeSlider.play();
				    	//} else {
				    		//FREEZE THUMB 2 IN PLACE & MAKE THUMB 1 STOP THERE
				    		//Maybe call the updateImageServiceRasterFunction below w/o any params? (if I have to)
				    		
				    	//}
				    	
				    	//console.log("Map Config:");
				    	//console.log(MapConfig);
				        values = [0, timeSlider.thumbIndexes[0]];
				        
				        LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);

				        console.log("Thumbs at: " + timeSlider.thumbIndexes[0] + " & " + timeSlider.thumbIndexes[1]);
				        i++;
				        console.log("i is: " + i);
				        /*if (timeSlider.thumbIndexes[0] == 12) {
				        	console.log("i is at 12 and we are finished!");
				        	timeSlider.setThumbCount(2);
			    			timeSlider.setThumbIndexes([0,13]);
			    			timeSlider.pause();
				            return;
				        }*/
				        //timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],(thumbTwo-1)]);
				        //timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],5]);
				        // Weird hitch one turn later where the first index doesn't increment...
				       
				        console.log('');
				        timeout(i);
				    }, 1500);
				}
				timeout(index);

    			//LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);
    		});
      	});
      	timeSlider.on("pause", function (evt) { console.log("PAUUUSE!") });
      	//timeSlider.on("previous", function (evt) { console.log("PREV!") });
      	//timeSlider.on("next", function (evt) { console.log("NEXTTT!") });

    	/*timeSlider.on("time-extent-change", function (evt) {
    		// These values are not updated immediately, call requestAnimationFrame 
    		// to execute on the next available frame
    		// if (play == active) {
    		// 	return;
    		// }
    		
    		var values;
    		var secondSliderStop;
    		//console.log(timeSlider.on("time-extent-change"));
    		

    		requestAnimationFrame(function () {
    			values = [0, timeSlider.thumbIndexes[0]];
    			//console.log(values);
    			var firstSliderCurrent = timeSlider.thumbIndexes[0];
    			if (timeSlider.thumbIndexes[1]) {
	    			var secondSliderCurrent = timeSlider.thumbIndexes[1];
    			};
	    		var difference = secondSliderCurrent - firstSliderCurrent;
	    		console.log("Years to run: " + difference);
    			//timeSlider.createTimeStopsByCount(timeExtent, (0));
    			console.log(timeSlider);
    			console.log(timeSlider._getSliderValue());
    			console.log(timeSlider._getSliderMinValue());
    			timeSlider._updateThumbIndexes([3,4]);


    			if (1 < secondSliderCurrent < 12) {
    				console.log("here it would freeze!");
    			};
    			secondSliderStop = secondSliderCurrent;
    			//console.log(timeSlider.getCurrentTimeExtent());
    			//timeSlider.setThumbIndexes([firstSliderCurrent,secondSliderCurrent]);
    			//timeSlider.setThumbIndexes([firstSliderCurrent, labels.length -1]);

    			//console.log("First thumb NOW at: " + firstSliderCurrent);
    			console.log(firstSliderCurrent);
    			console.log(secondSliderCurrent);
    			LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);
    		});
    	});*/

		},

		fetchFORMAAlertsLabels: function () {
			var deferred = new Deferred(),
					req;

			req = request({
				url: MapConfig.forma.url,
				content: {"f": "pjson"},
				handleAs: "json",
				callbackParamName: "callback"
			});

			req.then(function (res) {
				deferred.resolve(res);
			}, function (err) {
				console.error(err);
				deferred.resolve(false);
			});

			return deferred.promise;
		},

		toggleLegendContainer: function () {
			var node = dom.byId("legend-container"),
          height = node.offsetHeight === 280 ? 30 : 280;

      Fx.animateProperty({
        node: node,
        properties: {
            height: height
        },
        duration: 500,
        onEnd: function () {
        	if (height === 30) {
		        domClass.add("legend-title", "closed");
		      } else {
		        domClass.remove("legend-title", "closed");
		      }
        }
      }).play();
		}

	};

});