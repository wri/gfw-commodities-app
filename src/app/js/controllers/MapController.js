define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("mapView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("mapView");
			registry.byId("mapView").set('content', template);

		}

	};

});