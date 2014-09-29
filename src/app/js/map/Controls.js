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

        createDialogBox: function (content) {
            require([
                "dijit/Dialog"
            ], function (Dialog){

                //remove select country
                var node = content.querySelector(".source_body")
                if(node.querySelector(".source_extended")) {
                    node.removeChild(node.querySelector(".source_extended"))
                }

                //remove checkbox
                if(content.getElementsByTagName("input").length){
                    content.removeChild(content.getElementsByTagName("input")[0]);
                }

                var dialog = new Dialog({
                    title: "Layer Information",
                    style: "height: 700px; width: 600px; overflow: auto;"
                })
                dialog.setContent(content.innerHTML);
                dialog.show();
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

			timeSlider.setThumbCount(1);
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
      timeSlider.setThumbIndexes([labels.length - 1]);
      timeSlider.startup();
      	

    	timeSlider.on("time-extent-change", function (evt) {
    		// These values are not updated immediately, call requestAnimationFrame 
    		// to execute on the next available frame
    		var values;
    		requestAnimationFrame(function () {
    			values = [0, timeSlider.thumbIndexes[0]];
    			LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);
    		});
    	});

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