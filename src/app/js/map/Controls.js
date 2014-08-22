define([
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-style",
	"map/LayerController"
], function (dom, dojoQuery, domClass, domStyle, LayerController) {
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

		}

	};

});