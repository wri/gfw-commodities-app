define([
	"dojo/fx",
	"dojo/dom",
	"dojo/_base/fx",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-geometry",
	// My Modules
	"analysis/Query",
	"analysis/config",
	"components/wizard/Wizard"
], function (coreFx, dom, Fx, domClass, domStyle, domGeom, AnalyzerQuery, AnalyzerConfig, Wizard) {
	'use strict';

	var wizard;

	return {

		toggleWizard: function () {
			var mapWidth = domGeom.position(dom.byId("map")).w,
					wizardContainer = dom.byId("wizard-container"),
					MAX_WIDTH = 600, 
					MIN_WIDTH = 400,
					halfMapWidth = mapWidth / 2,
					orignalCenterPoint,
					duration = 500,
					wizardAnimation,
					tabAnimation,
					mapAnimation,
					wizardWidth;

			wizardWidth = (halfMapWidth >= MIN_WIDTH && halfMapWidth <= MAX_WIDTH) ? halfMapWidth : 
										(halfMapWidth < MIN_WIDTH) ? MIN_WIDTH : MAX_WIDTH;

			// Get original center point before animation and set it after animation complete
			orignalCenterPoint = app.map.extent.getCenter();

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
					//left: (wizardWidth - 30)
					opacity: (wizardWidth === 0) ? 1.0 : 0.0
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
					app.map.resize(true);
					app.map.centerAt(orignalCenterPoint);
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
				// Make the root selection the appropriate one, for Custom Area, it is option 1
				wizard._updateSelectedArea(AnalyzerConfig.stepOne.option1.id);
				// Set to Step 3, the parameter is index based so 0,1,2,3, 2 is the third step
				wizard._externalSetStep(2);
				// In this case, set the RefinedArea to the evt.graphic
				// Graphics will need a WRI_label field that will be used as a label in the UI
				wizard._updateAnalysisArea(evt.graphic);
			}
		}

	};

});