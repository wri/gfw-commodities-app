define([
	"dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
	"dijit/registry",
    "utils/NavListController"
], function (dom, query, domClass, domStyle, registry, NavListController) {
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

            var context = "about";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

		}

	};

});
