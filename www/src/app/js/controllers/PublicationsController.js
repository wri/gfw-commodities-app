define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("publicationsView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("publicationsView");
			registry.byId("publicationsView").set('content', template);

		}

	};

});