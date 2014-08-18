define([
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("methodsView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("methodsView");
			registry.byId("methodsView").set('content', template);

		}

	};

});