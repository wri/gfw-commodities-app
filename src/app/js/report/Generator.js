define([
	"esri/config",
	"dojo/Deferred",
	"dojo/dom-class",
	"dojo/_base/array",
	// Local Modules from report folder
	"report/config",
	"report/Fetcher"
], function (esriConfig, Deferred, domClass, arrayUtils, Config, Fetcher) {
	'use strict';

	window.report = {};

	return {

		init: function () {
			// Payload is passed as Global Payload object, grab and make sure its defined before doing anything else
			if (window.payload) {
				this.applyConfigurations();
				this.prepareForAnalysis();
			} else {
				// There was a problem getting the payload params from the last window
				// Notify the user here that the report will not load and show the correct warning
				alert("There was an erorr generating the report at this time.  Please make sure your pop-up blocker is disabled and try again.");
			}
		},

		applyConfigurations: function () {
			arrayUtils.forEach(Config.corsEnabledServers, function (server) {
				esriConfig.defaults.io.corsEnabledServers.push(server);
			});
		},

		prepareForAnalysis: function () {

			var features = window.payload.features;

			// First, if report.payload.features is an array, we need a single geometry to work with,
			if (Object.prototype.toString.call(features) === '[object Array]') {
				if (features.length === 1) {
					report.geometry = features[0].geometry;
				} else {
					report.geometry = features[0].geometry;
					arrayUtils.forEach(features, function (feature, index) {
						// Skip the first one, geometry alerady grabbed above
						if (index > 0) {
							arrayUtils.forEach(feature.geometry.rings, function (ring) {
								report.geometry.addRing(ring);
							});
						}
					});
				}
			} else {
				report.geometry = features.geometry;
			}

			// Next, set some properties that we can use to filter what kinds of queries we will be performing
			report.analyzeClearanceAlerts = window.payload.types.forma;
			report.analyzeTreeCoverLoss = window.payload.types.loss;
			report.analyzeSuitability = window.payload.types.suit;
			report.analyzeMillPoints = window.payload.types.risk;

			// Lastly, grab the datasets from the payload and store them in report so we know which 
			// datasets we will perform the above analyses on
			report.datasets = window.payload.datasets;

			// Now that we are ready, set the title, unhide the report, and begin the analysis
			this.setTitleAndShowReport(window.payload.title || "Testing");
			this.beginAnalysis();

		},

		setTitleAndShowReport: function (title) {
			// The report markup is hidden by default so they user does not see a flash of unstyled content
			// Remove the hidden class at this point and set the title
			document.getElementById("title").innerHTML = title;
			domClass.remove("report", "hidden");
		},

		beginAnalysis: function () {

			// Start process to fetch the area
			// Get a list of deferred functions to execute
			// split that list based on the size to managable chunks
			// execute each chunk synchronously so we dont overwhelm the server
			// in the deferred functions, call charting functions to render results
			// enable the print button after this so they can print out a nicely formatted packet

			Fetcher.getAreaFromGeometry(report.geometry);


		}

	};

});