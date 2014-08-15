define([
	"main/config",
	"esri/config",
	"dojo/_base/array",
	"knockout",
	// Load Necessary Layout Widgets and Parser Here
	"dojox/mobile/parser",
  "dijit/layout/ContentPane",
  "dijit/layout/StackContainer"
], function (AppConfig, esriConfig, arrayUtils, knockout, parser) {

	return {

		init: function () {

			// Parse the initial Layout
			parser.parse();

			// Call remaining setup functions first, then launch the app
			this.applyConfigurations();
			this.launchApp();
			
		},

		applyConfigurations: function () {

			arrayUtils.forEach(AppConfig.corsEnabledServers, function (server) {
				esriConfig.defaults.io.corsEnabledServers.push(server);
			});

		},

		launchApp: function () {
			
		}

	};

});