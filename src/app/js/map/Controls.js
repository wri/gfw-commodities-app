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
			this.newTimeSlider();
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

					TimeSlider.prototype.onPlay = function() {
						alert("PLAY!");
					};

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
      	
      	timeSlider.on("play", function (evt) { 

      		var values;
      		//console.log(timeSlider.domNode);
      		console.log(timeSlider);
      		
      		var value1 = timeSlider.thumbIndexes[0];
      		var value2 = timeSlider.thumbIndexes[1];
      		//timeSlider.setThumbIndexes([value1,value2 - 1]);
      		console.log("On initial Play, thumb 1 at: " + value1);
      		console.log("On initial Play, thumb 2 at: " + value2);

      		/*setTimeout(function () {
      			console.log("THAT FIRST DECREMENT!");
      			//timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],value2 - 1]);
      		},1500);*/

      		requestAnimationFrame(function () {
      			console.log(timeSlider);
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
			    		
			    		timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],(11)]);
			    		//timeSlider.play();
				    }

				    // First loop they both do, then neither, then just thumbIndexOne
				    setTimeout(function () {
				    	if (timeSlider.playing == true) {

				    		timeSlider.setThumbIndexes([timeSlider.thumbIndexes[0],(value2 - 1)]);

				    	} else {
				    		timeSlider.thumbIndexes[1]++;
				    		console.log(timeSlider.thumbIndexes[1]);
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

		newTimeSlider: function() {

			$(".extra-controls #newSlider").click(function() {
				play();
			});

	        var $range = $(".js-range-slider"),
		    $from = $(".js-from"),
		    $to = $(".js-to"),
		    min = 2000,
		    max = 2012,
		    from = 2000,
		    to = 2012;
		    $(".layer-list-item.forest-change > ul > li").click(function() {
		   		console.log("***********");
		   		var $this = $(this); 
		   		ionCallback.call(this);
			});

			var ionCallback = function () { 
				$range.ionRangeSlider({
				    type: "double",
				    min: min,
				    max: max,
				    from: from,
				    to: to,
				    step: 1,
				    playing: false,
				    prettify: false,
				    //values: ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"],
				    //hasGrid: true,
				    onChange: function (data) {
				        from = data.fromNumber;
				        to = data.toNumber;
				        console.log(from + ", " + to);
				        updateValues();
				        $("#range").ionRangeSlider("update");
				        console.log("Inside update!");
				        console.log($range.playing);
				        if ($range.playing != true) {
					        var values3 = [from - 2000, to - 2000];
							console.log(values3);
							LayerController.updateImageServiceRasterFunction(values3, MapConfig.loss);
						}
				    },
				});
				$("#range").ionRangeSlider("update");
			};

			/*var years = ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"];
			var el = $.map(years, function(val, i) {
		      return "		" + val + "			";
		    });
		    $(".extra-controls").html(el.join(""));*/

			$from.on("change", function () {
			    from = $(this).prop("value");
			    if (from < min) {
			        from = min;
			    }
			    if (from > to) {
			        from = to;
			    }
			    updateValues();    
			    updateRange();
			});

			$to.on("change", function () {
			    to = $(this).prop("value");
			    if (to > max) {
			        to = max;
			    }
			    if (to < from) {
			        to = from;
			    }
			    updateValues();    
			    updateRange();
			});

			var updateRange = function () {
			    $range.ionRangeSlider("update", {
			        from: from,
			        to: to
			    });
			};

			var updateValues = function () {
			    $from.prop("value", from);
			    $to.prop("value", to);
			};


			function play() {
				
				console.log($range.playing);
				if ($range.playing == true) {
					console.log("Here we must stop");
					$range.playing = false;
					$("#newSlider").html("&#9658");
					return;
				}
				var initialDates = $range[0].value.split(';');
			    var thumbOne = initialDates[0];
			    var thumbTwo = initialDates[1];
			    var thumbOneInitial = thumbOne;
			    // Add css via JQuery here to show where slider started from
			    // Maybe get the css position of thumbOne.
			    // Then remove the css line's style on Pause or End  -->  $("").removeClass("");
			    /*$(".extra-controls").addClass("sliderStart");
			    $(".extra-controls").css("left",$(".irs-diapason").css( "left"));
			    $(".extra-controls").css("left", "+=65");
			    $("sliderStart").append("<p>2002</p>");*/
			    // Now we'll add the irs-dapson's initial left value to it!


			    console.log($( ".irs-diapason" ).css( "left"));
			    console.log($( ".irs-slider.from" ).css( "left"));
			    
			    /*$.each(document.styleSheets, function(sheetIndex, sheet) {
				    console.log("Looking at styleSheet[" + sheetIndex + "]:");
				    $.each(sheet.cssRules || sheet.rules, function(ruleIndex, rule) {
				        console.log("rule[" + ruleIndex + "]: " + rule.cssText);
				    });
				});*/

			    //var leftValue = $("irs-slider.from").css("left");
			    //console.log(leftValue);
			    //console.log($( .irs-slider.from ).css( "left" ));


			    console.log("Init: " + thumbOneInitial);
			    if (thumbOne == thumbTwo) {
					console.log("WE RETURNED IMMEDIETELY!");
					$range.playing = false;
					return;
				}

				$range.playing = true;
				$("#newSlider").html("&#x25A0");

			    //var values = [0,thumbOne-2000];
			    var values = [thumbOneInitial-2000,thumbOne-2000];
			    console.log("Values to be used: " + values[0] +" "+ values[1]);

			    var playing = $range.playing;
				var outer = setTimeout(function() {
					timeout(from,thumbOne,thumbTwo,values,thumbOneInitial); 
				}, 750);

				function timeout(from,thumbOne,thumbTwo,values,thumbOneInitial) {
					if ($range.playing == false) {
						return;
					}
					console.log("I'm using these..");
					console.log(values);
					LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);
		  			$range.ionRangeSlider("update", {
					    from: from + 1
					});
					var newDates = $range[0].value.split(';');
					var newThumbTwo = newDates[1];
					
					thumbOne++;
					//values = [0,thumbOne-2000];
					console.log("Start: " + thumbOneInitial);
					console.log("End: " + thumbOne);
					values = [thumbOneInitial-2000,thumbOne-2000];

					if (newThumbTwo > thumbTwo) {
						thumbTwo = newThumbTwo;
					}
					if (thumbOne == thumbTwo || thumbOne == newThumbTwo || thumbOne > newThumbTwo) {
						$("#newSlider").html("&#9658");
						$range.playing = false;
						console.log("Finito!");
						return;
					}
					from++;
					if ($range.playing == true) {
		  				setTimeout(function() { timeout(from,thumbOne,thumbTwo,values,thumbOneInitial); }, 750);
		  			}
				}
			}
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