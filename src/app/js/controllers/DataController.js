define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry"
], function (dom, query, domClass, domStyle, registry) {
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

            query(".nav-item").forEach(function(node){
                //Add the a link function
                node.onclick = function (){
                    changeNavItem (node, "data");
                }

            });

            function changeNavItem (node, context) {
                query(".nav-subpage.selected ").forEach(function(selectedDiv){
                    domClass.remove(selectedDiv, "selected");
                    domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
                });

                //Add 'selected' css class to nav list
                domClass.add(node.children[0], "selected");

                //Displays corresponding information div
                domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");
            };
		}

	};

});