define([
    "dijit/registry",
    "utils/NavListController",
    "utils/Hasher",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-style",
], function (registry, NavListController, Hasher, dom, query, domClass, domStyle) {
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
            for(var i=0; i < divs.length; i += 1) {
                divs[i].onclick = function(){
                    if(this.checked){
                        Hasher.setHash("s", this.id);
                    } else {
                        Hasher.removeKey("s");
                    }
                    //need to close all other checked boxes
                    //so only one can be open at a time.
                    for(var j=0; j<divs.length; j++){
                        if(divs[j] !== this){
                            divs[j].checked = false;
                        }
                    }
                };
            }

			this.initializeCountryDropdowns();
		},

		initializeCountryDropdowns: function () {

			var dropdowns = document.getElementsByClassName('source_download_container');
			var options = document.getElementsByClassName('source_dropdown_body');

			if(dropdowns.length > 0){
				[].map.call(dropdowns, function(dropdown) {
					dropdown.onchange = function(){
						[].map.call(options, function(option){
							if(option.value !== "none"){
								option.className = 'source_dropdown_body';
							}
						});
						var selectedValue = dropdown.options[dropdown.selectedIndex].value;
						if(selectedValue !== "none"){
							var countryInfo = document.getElementById(selectedValue)
							countryInfo.className = countryInfo.className + " active";
						}
					}
				});
			}
		}

	};

});