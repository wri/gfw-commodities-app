define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("homeView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("homeView");
			registry.byId("homeView").set('content', template);

		}

	};

});