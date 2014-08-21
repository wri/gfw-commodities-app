define([
	"map/config",
	"dojo/query",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/_base/array",
	"utils/Hasher"
], function (MapConfig, dojoQuery, topic, domClass, arrayUtils, Hasher) {

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
		// and not radio buttons, which is why it has it'w own function and cannot use updateDynamicLayer
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

		}

	};

});