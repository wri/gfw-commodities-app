define([
	"map/config",
	"dojo/query",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/_base/array",
	"utils/Hasher"
], function (MapConfig, dojoQuery, topic, domClass, arrayUtils, Hasher) {

	return {

		updateHash: function (queryForRemoval, newLayer) {

			var oldLayer;

			dojoQuery(queryForRemoval).forEach(function (node) {
				oldLayer = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
				Hasher.removeLayers(oldLayer);
				domClass.remove(node, 'active');
			});

			if (newLayer !== "none") {
				Hasher.toggleLayers(newLayer);
			}

		},

		toggleForestChangeLayers: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					queryClass = ".layer-list-item.forest-change", 
					layer = target.parentElement.dataset ? target.parentElement.dataset.layer : target.parentElement.getAttribute("data-layer");

			this.updateHash(queryClass, layer);
			domClass.add(target.parentElement, 'active');

			if (layer === "none") {
				return;
			}

			// this.updateTreeCoverLayer(target.id === 'treeCoverRadio');
			// this.updateFormaAlertsLayer(target.id === 'formaAlertsRadio');
			// this.updateActiveFiresLayer(target.id === 'activeFiresRadio');

		},

		toggleForestCoverLayers: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					queryClass = '.layer-list-item.forest-cover',
					layer = target.parentElement.dataset ? target.parentElement.dataset.layer : target.parentElement.getAttribute("data-layer");

			this.updateHash(queryClass, layer);
			domClass.add(target.parentElement, 'active');

			if (layer === "none") {
				return;
			}

		},

		updateTreeCoverLayer: function (visible) {


		},

		updateFormaAlertsLayer: function (visible) {

		},

		updateActiveFiresLayer: function (visible) {

		}

	};

});