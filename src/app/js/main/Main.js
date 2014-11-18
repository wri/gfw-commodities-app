define([
	"dojox/mobile/parser",
	"main/config",
	"esri/config",
	"esri/urlUtils",
	"dojo/_base/array",
	// Load in Custom Modules to Aid in initializing the Application
	"utils/Hasher",
	"utils/Helper",
	"utils/Delegator",
	"controllers/ViewController",
	// Load Necessary Layout Widgets and Parser Here
  "dijit/layout/ContentPane",
  "dijit/layout/StackContainer"
], function (parser, AppConfig, esriConfig, urlUtils, arrayUtils, Hasher, Helper, Delegator, ViewController) {
	'use strict';
	return {

		init: function () {

			// Parse the initial Layout
			parser.parse();

			// Setup Appwide Global Object to Store Key Settings/Objects
			window.app = {};

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
			// Initilize the Hasher, will get view from url or set a default one and return the value
			var defaultViewToLoad = Hasher.init();
			// Have helper determine whether or not to add mobile class
			Helper.enableLayout();
			// Have the Delegator Start Listening, He will subscribe to all published events and delegate handlers
			Delegator.startListening();
			// Initialize View Controller, He controls loading views, this will initialize the header, footer, and get 
			// the Header to load the default view, if you need to change the view, do it through the header, he will propogate
			// the event to the ViewController
			ViewController.init(defaultViewToLoad);
		}

	};

});