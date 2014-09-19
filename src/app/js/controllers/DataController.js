define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "utils/NavListController",
    "utils/Hasher"
], function (dom, query, domClass, domStyle, registry, NavListController, Hasher) {
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

            var context = "data";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

            var divs = document.getElementsByTagName('input');
            for(var i=0; i < divs.length; i++) {
                divs[i].onclick = function(){
                    Hasher.setHash("s", this.id)
                    console.log(this);
                }
            }



		}

	};

});