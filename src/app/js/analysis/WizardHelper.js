define([
	"dojo/fx",
	"dojo/dom",
	"dojo/_base/fx",
	"dojo/Deferred",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom-geometry",
	"dojo/_base/array",
	// My Modules
	"map/config",
	"utils/GeoHelper",
	"analysis/Query",
	"analysis/config",
	"components/wizard/Wizard",
], function (coreFx, dom, Fx, Deferred, domClass, domStyle, domGeom, arrayUtils, MapConfig, GeoHelper, AnalyzerQuery, AnalyzerConfig, Wizard) {
	'use strict';

	var wizard;

	return {

		toggleWizard: function () {
			var mapWidth = domGeom.position(dom.byId("map")).w,
					wizardContainer = dom.byId("wizard-container"),
					deferred = new Deferred(),
					MAX_WIDTH = 525, // 600 - Currently we are forcing the size to be 525 and not responsive
					MIN_WIDTH = 525, // 450
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
					deferred.resolve(true);
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

			if (wizardWidth === 0) {
				this.cleanupWizard();
			} else {
				this.showWizardRelatedLayers();
			}

			return deferred.promise;

		},

		/*
			Hides any wizard layers shown, leaves uploaded features and graphics visible
		*/
		cleanupWizard: function () {
			// Hide Wizard Related Layers
			app.map.getLayer(MapConfig.adminUnitsLayer.id).hide();
			app.map.getLayer(MapConfig.wizardGraphicsLayer.id).hide();
			app.map.getLayer(MapConfig.millPointsLayer.id).hide();
		},

		showWizardRelatedLayers: function () {
			app.map.getLayer(MapConfig.adminUnitsLayer.id).show();
			app.map.getLayer(MapConfig.wizardGraphicsLayer.id).show();
			app.map.getLayer(MapConfig.millPointsLayer.id).hide();
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
		},

		/*
			This will launch the wizard with some the first two steps already completed
		*/
		analyzeAreaFromPopup: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					label = target.dataset ? target.dataset.label : target.getAttribute('data-label'),
					type = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
					id = target.dataset ? target.dataset.id : target.getAttribute('data-id'),
					selectedArea = AnalyzerConfig.stepOne.option3.id,
					url = MapConfig.oilPerm.url,
					self = this,
					layer;
						
			// Get Graphic, and set the appropriate content
			switch (type) {
				case "Logging concession":
				layer = 10;
				break;
				case "Mining concession":
				layer = 26;
				break;
				case "Wood fiber plantation":
				layer = 28;
				break;
				case "Oil palm concession":
				layer = 32;
				break;
				case "RSPO Oil palm concession":
				layer = 27;
				break;
				case "AdminBoundary":
				selectedArea = AnalyzerConfig.stepOne.option2.id;
				url = MapConfig.adminUnitsLayer.url;
				layer = MapConfig.adminUnitsLayer.layerId;
				break;
				case "CertScheme":
				url = MapConfig.commercialEntitiesLayer.url;
				layer = MapConfig.commercialEntitiesLayer.layerId;
				break;
				case "CustomGraphic":
				selectedArea = AnalyzerConfig.stepOne.option1.id;
				break;
				case "MillPoint":
				selectedArea = AnalyzerConfig.stepOne.option5.id;
				break;
			}

			if (type === "CustomGraphic") {
				layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
				arrayUtils.some(layer.graphics, function (graphic) {
					if (graphic.attributes.WRI_ID === parseInt(id)) {
						if (!self.isOpen()) {
							self.toggleWizard().then(function () {
								setWizardProps(graphic);
							});
						} else {
							setWizardProps(graphic);
						}
						return true;
					}
					return false;
				});
			} else if (type === "MillPoint") {
				AnalyzerQuery.getMillByEntityId(id).then(function (feature) {
					feature.attributes.WRI_label = label;
					feature = GeoHelper.preparePointAsPolygon(feature);
					if (!self.isOpen()) {
						self.toggleWizard().then(function () {
							setWizardProps(feature);
						});
					} else {
						setWizardProps(feature);
					}
				});
			} else {
				AnalyzerQuery.getFeatureById(url + "/" + layer, id).then(function (feature) {
					feature.attributes.WRI_label = label;
					if (!self.isOpen()) {
						self.toggleWizard().then(function () {
							setWizardProps(feature);
						});
					} else {
						setWizardProps(feature);
					}
				});
			}

			function setWizardProps(feature) {
				// Make the root selection the appropriate one,
				// for Custom Graphics, it is option 1
				// for Admin Units, it is option 2 
				// for Concessions, it is option 3
				// for Certified Areas, it is option 4
				// for Mill Points, it is option 5
				// selectedArea set in switch statement above
				wizard._updateSelectedArea(selectedArea);
				// Set to Step 3, the parameter is index based like 0,1,2,3, 3 is the third step
				// because we inserted a introduction step that is now step 0
				wizard._externalSetStep(3);
				// In this case, set the RefinedArea to the evt.graphic
				// Graphics will need a WRI_label field that will be used as a label in the UI
				wizard._updateAnalysisArea(feature);
			}

			// Hide the info window
			app.map.infoWindow.hide();
		},

		addGraphicFromPopup: function () {

		},

		isOpen: function () {
			return domClass.contains("wizard-container", "activated");
		}

	};

});