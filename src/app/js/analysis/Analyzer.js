define([
	"dojo/fx",
	"dojo/dom",
	"dojo/_base/fx",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-geometry",
	// My Modules
	"analysis/Query",
	"components/wizard/Wizard"
], function (coreFx, dom, Fx, domClass, domStyle, domGeom, AnalyzerQuery, Wizard) {
	'use strict';

	var wizard;

	return {

		toggleWizard: function () {
			var mapWidth = domGeom.position(dom.byId("map")).w,
					wizardContainer = dom.byId("wizard-container"),
					MAX_WIDTH = 700, 
					MIN_WIDTH = 450,
					halfMapWidth = mapWidth / 2,
					duration = 500,
					wizardAnimation,
					tabAnimation,
					mapAnimation,
					wizardWidth;

			wizardWidth = (halfMapWidth >= MIN_WIDTH && halfMapWidth <= MAX_WIDTH) ? halfMapWidth : 
										(halfMapWidth < MIN_WIDTH) ? MIN_WIDTH : MAX_WIDTH;

			if (domClass.contains(wizardContainer, "activated")) {
				domStyle.set('wizard', 'display', 'none');
				wizardWidth = 0;
			}

			domClass.toggle(wizardContainer, "activated");

			wizardAnimation = Fx.animateProperty({
				node: wizardContainer,
				properties: {
					width: wizardWidth
				},
				duration: duration
			});

			tabAnimation = Fx.animateProperty({
				node: dom.byId("wizard-tab"),
				properties: {
					// The - 30 is because the text is rotated and position needs to be offset
					left: (wizardWidth - 30)
				},
				duration: duration
			});

			mapAnimation = Fx.animateProperty({
				node: dom.byId("map-container"),
				properties: {
					left: wizardWidth
				},
				duration: duration,
				onEnd: function () {
					app.map.resize();
					if (wizardWidth > 0) {
						domStyle.set('wizard', 'display', 'block');
					}
				}
			});


			// If the Wizard has not been created yet, do so now
			// but wait for the container to become visible to do so,
			// Also, start fetching initial data that will be necessary for the UI's
			if (wizard === undefined) {
				AnalyzerQuery.getSetupData();
				setTimeout(function () {
					wizard = new Wizard({}, "wizard");
				}, duration);
			}

			coreFx.combine([
				wizardAnimation,
				tabAnimation,
				mapAnimation
			]).play();

		},

		/*
			Takes a evt with a graphic inside it as a parameter, sets the UI in the wizard to a specific step and selects the feature
		*/
		customFeatureClicked: function (evt) {
			if (evt.graphic) {
				// Set to Step 2, the parameter is index based so 0,1,2,3, 1 is the second step
				wizard._externalSetStep(1);
				// In this case, set the RefinedArea to the evt.graphic
				wizard._updateAnalysisArea(evt.graphic);
			}
		}

	};

});