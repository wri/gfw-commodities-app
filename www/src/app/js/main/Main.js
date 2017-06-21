define([
	"dojox/mobile/parser",
	"main/config",
	"esri/config",
	"dojo/_base/array",
	"dojo/has",
	// Load in Custom Modules to Aid in initializing the Application
	"utils/Hasher",
	"utils/Helper",
	"utils/Delegator",
	"controllers/ViewController",
	"esri/urlUtils",
	// Load Necessary Layout Widgets and Parser Here
  "dijit/layout/ContentPane",
  "dijit/layout/StackContainer"
], function (parser, AppConfig, esriConfig, arrayUtils, has, Hasher, Helper, Delegator, ViewController, urlUtils) {
	'use strict';
	return {

		init: function () {

			urlUtils.addProxyRule({
				urlPrefix: 'http://gfw.blueraster.io/arcgis/rest/services/protected_services/MapServer',
				proxyUrl: '/app/php/proxy.php'
			});
			urlUtils.addProxyRule({
				urlPrefix: 'gfw-staging.wri.org/arcgis/rest/services/cached/wdpa_protected_areas/MapServer',
				proxyUrl: '/app/php/proxy.php'
			});

			// Add Platform Specific Classes to the body tag
			var userAgent = navigator.userAgent;
			// Regex for pulling the version number out
			var regex = /\(.*?(\d+\.\d+).*?\)/;
			var versionNumber, match;

			if (userAgent.search('Windows NT') > -1) {
				match = regex.exec(userAgent);
				versionNumber = (match ? parseFloat(match[1]) : undefined);
				if (versionNumber >= 6.2) {
					document.body.className += ' windows_8';
				} else {
					document.body.className += ' windows_7';
				}
			}

			// This works but is not automatically scalable, where as above is, if it matches correctly
			// if (userAgent.search('NT 6.1') > -1) {
			// 	document.body.className += ' windows_7';
			// } else if ((userAgent.search('NT 6.2') > -1) || (userAgent.search('NT 6.3') > -1)) {
			// 	document.body.className += ' windows_8';
			// }

			// IE11 Detection Because dojo no longer wants to add ie class names to html since 1.9.2, thanks dojo
			if (has('trident')) {
				document.documentElement.className += ' dj_ie';
			}

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
