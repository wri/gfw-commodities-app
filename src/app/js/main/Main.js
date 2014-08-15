define([
	"main/config",
	"esri/config",
	"dojo/_base/array",
	// Load in Custom Modules to Aid in initializing the Application
	"utils/Hasher",
	"utils/Delegator",
	"controllers/ViewController",
	// Load Necessary Layout Widgets and Parser Here
	"dojox/mobile/parser",
  "dijit/layout/ContentPane",
  "dijit/layout/StackContainer"
], function (AppConfig, esriConfig, arrayUtils, Hasher, Delegator, ViewController, parser) {
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
			// Have the Delegator Start Listening, He will subscribe to all published events and delegate handlers
			Delegator.startListening();
			// Initialize View Controller, He controls loading views, this will initialize the header, footer, and get 
			// the Header to load the default view, if you need to change the view, do it through the header, he will propogate
			// the event to the ViewController
			ViewController.init(defaultViewToLoad);
		}

	};

});