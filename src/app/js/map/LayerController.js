define([
	"map/config",
	"dojo/dom",
	"dojo/query",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/_base/array",
	"utils/Hasher",
	"esri/layers/RasterFunction",
], function (MapConfig, dom, dojoQuery, topic, domClass, domStyle, arrayUtils, Hasher, RasterFunction) {

	return {

		// updateHash: function (queryForRemoval, newLayer) {

		// 	var oldLayer;

		// 	dojoQuery(queryForRemoval).forEach(function (node) {
		// 		oldLayer = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
		// 		Hasher.removeLayers(oldLayer);
		// 		domClass.remove(node, 'active');
		// 	});

		// 	if (newLayer !== "none") {
		// 		Hasher.toggleLayers(newLayer);
		// 	}

		// },

		// toggleForestChangeLayers: function (evt) {
		// 	var target = evt.target ? evt.target : evt.srcElement,
		// 			queryClass = ".layer-list-item.forest-change", 
		// 			layer = target.parentElement.dataset ? target.parentElement.dataset.layer : target.parentElement.getAttribute("data-layer");

		// 	this.updateHash(queryClass, layer);
		// 	domClass.add(target.parentElement, 'active');

		// 	if (layer === "none") {
		// 		return;
		// 	}

		// 	// this.updateTreeCoverLayer(target.id === 'treeCoverRadio');
		// 	// this.updateFormaAlertsLayer(target.id === 'formaAlertsRadio');
		// 	// this.updateActiveFiresLayer(target.id === 'activeFiresRadio');

		// },

		// toggleForestCoverLayers: function (evt) {
		// 	var target = evt.target ? evt.target : evt.srcElement,
		// 			queryClass = '.layer-list-item.forest-cover',
		// 			layer = target.parentElement.dataset ? target.parentElement.dataset.layer : target.parentElement.getAttribute("data-layer");

		// 	this.updateHash(queryClass, layer);
		// 	domClass.add(target.parentElement, 'active');

		// 	if (layer === "none") {
		// 		return;
		// 	}

		// },

		// updateTreeCoverLayer: function (visible) {


		// },

		// updateFormaAlertsLayer: function (visible) {

		// },

		// updateActiveFiresLayer: function (visible) {

		// }


		// Called From Delegator or internally, layerConfig is in the Map Config
		// This function should only show or hide layers
		toggleLayers: function (layerConfig) {
			var layer = app.map.getLayer(layerConfig.id);
			if (layer) {
				layer.setVisibility(!layer.visible);
			}
		},

		// Called From Delegator or internally, props is coming from a click event on the layer UI.
		// Can see the props in MapConfig.layerUI
		// This function should update dynamic layers but is called from checkboxes in the UI
		// and not radio buttons, which is why it has it's own function and cannot use updateDynamicLayer,
		// This queries other checkboxes in the same layer to find out which needs to be added to visible layers
		updateLayer: function (props) {
			var conf = MapConfig[props.key],
					layer = app.map.getLayer(conf.id),
					queryClass = props.filter,
					visibleLayers = [],
					itemLayer,
					itemConf;

			dojoQuery(".gfw .filter-list ." + queryClass).forEach(function (node) {
				itemLayer = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
				itemConf = MapConfig[itemLayer];
				if (itemConf) {
					if (itemConf.id === layer.id && domClass.contains(node, "active")) {
						visibleLayers.push(itemConf.layerId);
					}
				}
			});

			if (layer) {
				if (visibleLayers.length > 0) {
					layer.setVisibleLayers(visibleLayers);
					layer.show();
				} else {
					layer.hide();
				}
			}

		},
		// Called From Delegator or internally, layerConfig is in the Map Config
		// This function should only show layers

		showLayer: function (layerConfig) {
			var layer = app.map.getLayer(layerConfig.id);
			if (layerConfig.layerId) {
				this.updateDynamicLayer(layerConfig);
				return;
			}

			if (layerConfig.legendLayerId) {
				this.updateLegendInDynamicLayer();
			}

			if (layer) {
				if (!layer.visible) {
					layer.show();
				}
			}
		},

		// Called From Delegator or internally, layerConfig is in the Map Config
		// This function should only hide layers, helper for hiding children
		hideLayer: function (layerConfig) {
			var layer = app.map.getLayer(layerConfig.id);
			if (layer) {
				if (layer.visible) {
					layer.hide();
				}
			}
		},

		// Updates a dynamic layer controlled by a radio button so it simply changes the visible layers
		// to the one tied to the radio button, no need to have multiple sublayers turned on, if you do need 
		// that, look at updateLayer function instead or create a new one as that one is tied to the checkboxes
		updateDynamicLayer: function (layerConfig) {
			var layer = app.map.getLayer(layerConfig.id),
					visibleLayers = [];
			if (layer) {
				visibleLayers.push(layerConfig.layerId);
				layer.setVisibleLayers(visibleLayers);
				layer.show();
			}
		},

		updateLegendInDynamicLayer: function (layerConfig) {

		},

		setFiresLayerDefinition: function (filter, highConfidence) {
			var time = new Date(),
					layerDefs = [],
					visibleLayers,
					dateString,
					layer,
					where;

			layer = app.map.getLayer(MapConfig.fires.id);

			// 1*filter essentially casts as a number
			time.setDate(time.getDate() - (1 * filter));

			dateString = time.getFullYear() + "-" +
									 (time.getMonth() + 1) + "-" +
									 time.getDate() + " " + time.getHours() + ":" +
									 time.getMinutes() + ":" + time.getSeconds();

			// Set up Layer defs based on the filter value, if filter = 7, just set where to 1 = 1
			where = (filter !== "7" ? "ACQ_DATE > date '" + dateString + "'" : "1 = 1");
			for (var i = 0, length = MapConfig.fires.defaultLayers.length; i < length; i++) {
				layerDefs[i] = where;
			}

			if (layer) {
				// Set up and update Visible Layers if they need to be updated
				visibleLayers = (highConfidence ? [0,1] : [0,1,2,3]);
				if (layer.visibleLayers.length !== visibleLayers.length) {
					layer.setVisibleLayers(visibleLayers);
				}

				layer.setLayerDefinitions(layerDefs);

			}
		},

		setOverlaysVisibleLayers: function () {
			var visibleLayers = [],
					layer,
					key;

			// Layer Ids are in the config, the key to the config file is under the data-layer attribute of the elements
			dojoQuery(".gfw .overlays-container .overlays-checkbox.selected").forEach(function (node) {
				key = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
				visibleLayers.push(MapConfig[key].layerId);
			});

			layer = app.map.getLayer(MapConfig.overlays.id);
			if (layer) {
				if (visibleLayers.length === 0) { 
					visibleLayers.push(-1);
					layer.hide();
				} else {
					layer.show();
				}
				layer.setVisibleLayers(visibleLayers);
			}

		},

		updateImageServiceRasterFunction: function (values, layerConfig) {
			
			var layer = app.map.getLayer(layerConfig.id),
					rasterFunction,
					range;

			if (layer) {
				// Values in slider are from a 0 based index, the range starts at 1
				// so we need to shift the values by 1 to have correct range
				// Also the rule is [inclusive, exclusive], so if values are 3,3 use 3,3
				// if they are 3,4 then use 3,5
				range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
				rasterFunction = this.getSpecificRasterFunction(layerConfig.colormap, range);
				layer.setRenderingRule(rasterFunction);

			}


		},

		getSpecificRasterFunction: function (colormap, range) {
			return new RasterFunction({
				"rasterFunction": "Colormap",
				"rasterFunctionArguments": {
					"Colormap": colormap,
					"Raster": {
						"rasterFunction": "Remap",
						"rasterFunctionArguments": {
							"InputRanges": range,
							"OutputValues": [1],
							"AllowUnmatched": false
						}
					}
				},
				"variableName": "Raster"
			});
		}

	};

});