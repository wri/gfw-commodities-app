define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("aboutView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("aboutView");
			registry.byId("aboutView").set('content', template);

		}

	};

});