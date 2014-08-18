define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("dataView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("dataView");
			registry.byId("dataView").set('content', template);

		}

	};

});