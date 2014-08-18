define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("blogView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("blogView");
			registry.byId("blogView").set('content', template);

		}

	};

});