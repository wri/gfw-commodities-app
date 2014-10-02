define([
	"dojo/dom",
	"dojo/query",
	"dojo/Deferred",
	"dojo/_base/fx",
	"dojo/_base/array",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/registry",
	"dojo/dom-construct",
	"map/config",
	"map/MapModel",
	"map/LayerController",
	"esri/request",
	"esri/TimeExtent",
  "esri/dijit/TimeSlider",
  "dijit/form/CheckBox",
  "dijit/layout/ContentPane",
  "dijit/layout/AccordionContainer"
], function (dom, dojoQuery, Deferred, Fx, arrayUtils, domClass, domStyle, registry, domConstruct, MapConfig, MapModel, LayerController, request, TimeExtent, TimeSlider, Checkbox, ContentPane, Accordion) {
	'use strict';

	return {

		toggleToolbox: function (layerConfig, operation) {
			if (layerConfig.id === 'CustomSuitability') {
				// Toggle This checkbox independent of other toolboxes
				var display = (operation === 'show' ? 'block' : 'none');
				domStyle.set(layerConfig.toolsNode, 'display', display);
				// Resize the Accordion and The JQuery Sliders so they look correct
				registry.byId('suitability-accordion').resize();
				this.resizeRangeSliders();
			} else {
				// Hide other tools, then show this node if operation is show
				this.hideAllToolboxes();
				if (operation === 'show') {
					domStyle.set(layerConfig.toolsNode, 'display', 'block');
				}
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
                "dijit/Dialog",
                "dojo/_base/lang"
            ], function (Dialog, Lang){

                var contentClone = Lang.clone(content);
                //remove select country
                var node = contentClone.querySelector(".source_body")
                if(node.querySelector(".source_extended")) {
                    node.removeChild(node.querySelector(".source_extended"));
                }
                if(node.querySelector(".source_download")){
                    node.removeChild(node.querySelector(".source_download"));
                }
                if(node.querySelector(".overview_title")){
                    node.querySelector(".source_summary").removeChild(node.querySelector(".overview_title"));
                }
                if(contentClone.querySelector(".source_header")){
                    contentClone.removeChild(contentClone.querySelector(".source_header"));
                }
                //remove checkbox
                if(contentClone.getElementsByTagName("input").length){
                    contentClone.removeChild(contentClone.getElementsByTagName("input")[0]);
                }

                var dialog = new Dialog({
                    title: content.querySelector(".source_title").innerHTML.toUpperCase(),
                    style: "height: 700px; width: 600px; overflow: auto;"
                })
                //for possible title
                //content.getElementsByClassName("source_title")[0].innerHTML
                dialog.setContent(contentClone.innerHTML);
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
		},

		generateSuitabilitySliders: function () {

			var accordion = new Accordion({}, "suitability-accordion"),
					self = this;

			accordion.addChild(new ContentPane({
				title: "Environmental"
			}, "environmental-criteria"));

			accordion.addChild(new ContentPane({
				title: "Crop"
			}, "crop-criteria"));

			accordion.startup();
			this.createCheckboxDijits();
			this.createRangeSliders();

			// Listen for the accordion to change, then resize the sliders
			accordion.watch('selectedChildWidget', function (name, oldVal, newVal) {
				self.resizeRangeSliders();
			});
		},

		createCheckboxDijits: function () {
			var checkbox;
			arrayUtils.forEach(MapConfig.checkboxItems, function (item) {
				checkbox = new Checkbox({
					name: item.name,
					value: item.value,
					checked: item.checked,
					onChange: function () {
						LayerController.updateCustomSuitabilityLayer(null, item.name);
					}
				}, item.node);
			});
		},

		createRangeSliders: function () {

			var sliderConfig = MapConfig.suitabilitySliderTooltips;

			// Peat Depth
			$("#peat-depth-slider").rangeSlider({
				defaultValues: {min: 0, max: 6},
				valueLabels: 'change',
				bounds: {min: 0, max: 6},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return sliderConfig.peat[val];
				}
			});

			$("#peat-depth-slider").addClass("singleValueSlider reverseSlider");
			$("#peat-depth-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'peat-depth-slider');
			});

			// Conservation Area Buffers
			$("#conservation-area-slider").rangeSlider({
				defaultValues: {min: 1000, max: 5000},
				valueLabels: 'change',
				bounds: {min: 500, max: 5000},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return val + " m";
				}
			});

			$("#conservation-area-slider").addClass("singleValueSlider");
			$("#conservation-area-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'conservation-area-slider');
			});

			// Water Resource Buffers
			$("#water-resource-slider").rangeSlider({
				defaultValues: {min: 100, max: 1000},
				valueLabels: 'change',
				bounds: {min: 50, max: 1000},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return val + " m";
				}
			});

			$("#water-resource-slider").addClass("singleValueSlider");
			$("#water-resource-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'water-resource-slider');
			});

			// Slope
			$("#slope-slider").rangeSlider({
				defaultValues: {min: 30, max: 80},
				valueLabels: 'change',
				bounds: {min: 0, max: 80},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return val + "%";
				}
			});

			$("#slope-slider").addClass("singleValueSlider reverseSlider");
			$("#slope-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'slope-slider');
			});

			// Elevation
			$("#elevation-slider").rangeSlider({
				defaultValues: {min: 1000, max: 5000},
				valueLabels: 'hide',
				bounds: {min: 0, max: 5000},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return val + "m";
				}
			});

			$("#elevation-slider").addClass("singleValueSlider reverseSlider");
			$("#elevation-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'elevation-slider');
			});

			// Rainfall
			$("#rainfall-slider").rangeSlider({
				defaultValues: {min: 1500, max: 7000},
				valueLabels: 'hide',
				bounds: {min: 1500, max: 7000},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return val + " " + sliderConfig.rainfall.label;
				}
			});

			$("#rainfall-slider").addClass("narrowTooltips");
			$("#rainfall-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(
					[data.values.min, data.values.max], 
					'rainfall-slider'
				);
			});

			// Soil Drainage
			$("#soil-drainage-slider").rangeSlider({
				defaultValues: {min: 2, max: 4},
				valueLabels: 'hide',
				bounds: {min: 1, max: 4},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return sliderConfig.drainage[val];
				}
			});

			$("#soil-drainage-slider").addClass("narrowTooltips");
			$("#soil-drainage-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(
					[data.values.min, data.values.max], 
					'soil-drainage-slider'
				);
			});

			// Soil Depth
			$("#soil-depth-slider").rangeSlider({
				defaultValues: {min: 4, max: 7},
				valueLabels: 'hide',
				bounds: {min: 1, max: 7},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return sliderConfig.depth[val];
				}
			});

			$("#soil-depth-slider").addClass("singleValueSlider narrowTooltips");
			$("#soil-depth-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(data.values.min, 'soil-depth-slider');
			});

			// Soil Acidity
			$("#soil-acid-slider").rangeSlider({
				defaultValues: {min: 1, max: 7},
				valueLabels: 'change',
				bounds: {min: 1, max: 8},
				step: 1,
				arrows: false,
				formatter: function (val) {
					return sliderConfig.acidity[val];
				}
			});

			$("#soil-acid-slider").addClass("narrowTooltips");
			$("#soil-acid-slider").bind('valuesChanged', function (e, data) {
				LayerController.updateCustomSuitabilityLayer(
					[data.values.min, data.values.max], 
					'soil-acid-slider'
				);
			});

		},

		resizeRangeSliders: function () {

			/* Do the Following for Each Slider
			 - Hide the labels 
			 - resize the slider
			 - reactivate the listeners
			*/ 
			$("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#water-resource-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#slope-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#elevation-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#rainfall-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
			$("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'hide');

			$("#peat-depth-slider").rangeSlider('resize');
			$("#conservation-area-slider").rangeSlider('resize');
			$("#water-resource-slider").rangeSlider('resize');
			$("#slope-slider").rangeSlider('resize');
			$("#elevation-slider").rangeSlider('resize');
			$("#rainfall-slider").rangeSlider('resize');
			$("#soil-drainage-slider").rangeSlider('resize');
			$("#soil-depth-slider").rangeSlider('resize');
			$("#soil-acid-slider").rangeSlider('resize');

			$("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#water-resource-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#slope-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#elevation-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#rainfall-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'change');
			$("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'change');

		}

	};

});