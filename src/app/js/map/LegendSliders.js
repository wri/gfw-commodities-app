define([
	"dojo/dom",
	"dojo/query",
	"dojo/_base/array",
	"dijit/registry",
	"dojo/dom-construct",
	"map/config",
	"map/MapModel",
	"map/LayerController",
  "dijit/form/HorizontalSlider"
], function (dom, dojoQuery, arrayUtils, registry, domConstruct, MapConfig, MapModel, LayerController, HorizontalSlider) {

	'use strict';

	return {

		/* 
			These Slider Containers Should Live in the Layer List 
			that Shows on Hover of Different Layer types 
		*/

		generateTransparencySliders: function () {
			// var sliders = [],
			// 		id;

			// Steps
			// 1. Get Active Layers Listing and Enough information to build sliders and handle results
			// 2. Get Current Opacity/Transparency for each layer so I can set the slider to the correct default value
			// 3. Destroy Previous Containers/Sliders to avoid registry issues with Dojo
			// 4. Pass of values and info to Layer Controller onChange to change transparency of certain layers

			// registry.byId("legend").layers.forEach(function (layer) {
			// 	if (layer.visible) {
			// 		if (layer.id.search('ActiveFires') > -1) {
			// 			sliders.push({
			// 				legendNode: 'legend_' + layer.id,
			// 				layerId: layer.id,
			// 				visibleLayer: [0,2],
			// 				currentOpacity: 100
			// 			});
			// 		} else {
			// 			layer.visibleLayers.forEach(function (layerNum) {
			// 				sliders.push({
			// 					legendNode: 'legend_' + layer.id,
			// 					layerId: layer.id,
			// 					visibleLayer: layerNum,
			// 					currentOpacity: 100
			// 				});
			// 			});
			// 		}
			// 	}
			// });

			// this.destroyPreviousWidgets(sliders);

			// sliders.forEach(function (slider) {
			// 	if (slider.layerId.search("ActiveFires") > -1) {
			// 		id = slider.legendNode;
			// 	} else {
			// 		id = slider.legendNode + '_' + slider.visibleLayer;
			// 	}
			// 	domConstruct.create('div', {
			// 		'id': id + '_slider',
			// 		'innerHTML': 'Hello'
			// 	}, id, 'last');
			// });

			// arrayUtils.forEach(sliders, function (slider) {
			// 	// Active Fires is a special Case as I dont need sliders for all visible layers
			// 	if (slider.rootNode.search("ActiveFires") > -1) {					
			// 		rootNode = dom.byId(slider.rootNode);
			// 		if (rootNode) {
			// 			domConstruct.create('div', {
			// 				'id': slider.legendNode + '_slider'
			// 			}, rootNode, 'last');
			// 		}
			// 	} else {
			// 		arrayUtils.forEach(slider.visibleLayers, function (layer) {
			// 			id = slider.rootNode + '_' + layer;
			// 			rootNode = dom.byId(id);
			// 			if (rootNode) {
			// 				domConstruct.create('div', {
			// 					'id': id + '_slider'
			// 				}, rootNode, 'last');
			// 			}
			// 		});
			// 	}
			// });

			//this.buildSliderWidgets(sliders);
		},

		// destroyPreviousWidgets: function (sliders) {
		// 	var domNode,
		// 			widget,
		// 			id;

		// 	sliders.forEach(function (slider) {
		// 		if (slider.layerId.search("ActiveFires") > -1) {
		// 			id = slider.legendNode + '_slider';
		// 		} else {
		// 			id = slider.legendNode + '_' + slider.visibleLayer + '_slider';
		// 		}
		// 		widget = dijit.byId(id);
		// 		if (widget) {
		// 			widget.destroy();
		// 		}
		// 		domNode = dom.byId(id);
		// 		if (domNode) {
		// 			domConstruct.destroy(domNode);
		// 		}
		// 	});
		// },

		// removePreviousSliderContainers: function (sliders) {
		// 	arrayUtils.forEach(sliders, function (slider) {
		// 		if (slider.rootNode.search("ActiveFires") > -1) {
		// 			domConstruct.destroy(slider.rootNode + "_slider");
		// 		} else {
		// 			arrayUtils.forEach(slider.visibleLayers, function (layer) {
		// 				domConstruct.destroy(slider.rootNode + '_' + layer + '_slider');
		// 			});	
		// 		}
		// 	});
		// },

		// buildSliderWidgets: function (sliders) {
		// 	var sliderId;
		// 	arrayUtils.forEach(sliders, function (slider) {
		// 		if (slider.rootNode.search("ActiveFires") > -1) {
		// 			sliderId = slider.rootNode + "_slider";
		// 			// Destroy slider if it exists
		// 			if (registry.byId(sliderId)) { registry.byId(sliderId).destroy(); }
		// 			new HorizontalSlider({
		// 				value: 100,
		// 				minimum: 0,
		// 				maximum: 100,
		// 				discreteValues: 100,
		// 				showButtons: false,
		// 				style: "width: 200px;",
		// 				intermediateChanges: false,
		// 				onChange: function (value) {
		// 					console.log(value, slider.rootNode, slider.visibleLayers);
		// 				}
		// 			}, sliderId).startup();
		// 		} else {
		// 			arrayUtils.forEach(slider.visibleLayers, function (layer) {
		// 				sliderId = slider.rootNode + '_' + layer + '_slider';
		// 				// Destroy slider if it exists
		// 				if (registry.byId(sliderId)) { registry.byId(sliderId).destroy(); }
		// 				new HorizontalSlider({							
		// 					value: 100,
		// 					minimum: 0,
		// 					maximum: 100,
		// 					discreteValues: 100,
		// 					showButtons: false,
		// 					style: "width: 200px;",
		// 					intermediateChanges: false,
		// 					onChange: function (value) {
		// 						console.log(value, slider.rootNode, slider.visibleLayers);
		// 					}
		// 				}, sliderId).startup();
		// 			});	
		// 		}
		// 	});
		// }

	};

});