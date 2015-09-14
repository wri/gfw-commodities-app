define([
	"dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
	"dijit/registry",
	"utils/Hasher",
    "utils/NavListController"
], function (dom, query, domClass, domStyle, registry, Hasher, NavListController) {
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

            Hasher.setHash("n", "videos");

            // debugger

            NavListController.loadNavControl(context);
            // if (newContext) {
            // 	NavListController.loadNavView(newContext);
            // } else {
            NavListController.loadNavView(context);
            // }


		}

	};

});
