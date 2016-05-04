define([
	'dojo/fx',
	'dojo/dom',
	'dojo/_base/fx',
	'dojo/Deferred',
	'dojo/dom-class',
	'dojo/dom-style',
	'dojo/dom-geometry',
	'dojo/_base/array',
	'dojo/topic',
	// My Modules
	'map/config',
	'utils/Hasher',
	'utils/GeoHelper',
	'utils/AlertsHelper',
	'analysis/Query',
	'analysis/config',
	'analysis/WizardStore',
	'components/wizard/Wizard'
], function (coreFx, dom, Fx, Deferred, domClass, domStyle, domGeom, arrayUtils, topic, MapConfig, Hasher, GeoHelper, AlertsHelper, AnalyzerQuery, AnalyzerConfig, WizardStore, Wizard) {

	var wizard;
	var KEYS = AnalyzerConfig.STORE_KEYS;

	return {

		toggleWizard: function (skipIntro) {
			var mapWidth = domGeom.position(dom.byId('map')).w,
					wizardContainer = dom.byId('wizard-container'),
					deferred = new Deferred(),
					MAX_WIDTH = 460, // 600 - Currently we are forcing the size to be 525 and not responsive
					MIN_WIDTH = 460, // 450
					halfMapWidth = mapWidth / 2,
					orignalCenterPoint,
					duration = 500,
					wizardAnimation,
					tabAnimation,
					wizardWidth;

			wizardWidth = (halfMapWidth >= MIN_WIDTH && halfMapWidth <= MAX_WIDTH) ? halfMapWidth :
										(halfMapWidth < MIN_WIDTH) ? MIN_WIDTH : MAX_WIDTH;

			// Get original center point before animation and set it after animation complete
			orignalCenterPoint = app.map.extent.getCenter();

			if (domClass.contains(wizardContainer, 'activated')) {
				domStyle.set('wizard', 'display', 'none');
				wizardWidth = 0;
			}

			domClass.toggle(wizardContainer, 'activated');

			wizardAnimation = Fx.animateProperty({
				node: wizardContainer,
				properties: {
					width: wizardWidth
				},
				duration: duration
			});

			tabAnimation = Fx.animateProperty({
				node: dom.byId('wizard-tab'),
				properties: {
					// The - 30 is because the text is rotated and position needs to be offset
					//left: (wizardWidth - 30)
					opacity: (wizardWidth === 0) ? 1.0 : 0.0
				},
				duration: duration,
				onEnd: function() {
					if (wizardWidth > 0) {
						domStyle.set('wizard', 'display', 'block');
					}
					deferred.resolve(true);
				}
			});

			// If the Wizard has not been created yet, do so now
			// but wait for the container to become visible to do so,
			// Also, start fetching initial data that will be necessary for the UI's
			if (wizard === undefined) {
				AnalyzerQuery.getSetupData();
				setTimeout(function () {
					wizard = new Wizard({
						skipIntro: skipIntro
					}, 'wizard');
				}, (duration - 100));
				// Use duration - 100 to make sure the wizard is defined before the animation completes
				// and the deferred is resolved
			}

			if (wizardWidth === 0) {
				this.cleanupWizard();
			} else {
				if (wizard) {
					wizard.forceUpdate();
				}
				this.showWizardRelatedLayers();
			}

			// Add this variable to the url to share the status of this drawer
			if (wizardWidth === 0) {
				Hasher.removeKey('wiz');
			} else {
				Hasher.setHash('wiz', 'open');
			}

			return [wizardAnimation, tabAnimation];
		},

		/*
			Hides any wizard layers shown, leaves uploaded features and graphics visible
		*/
		cleanupWizard: function () {
			// Hide Wizard Related Layers
			app.map.getLayer(MapConfig.adminUnitsLayer.id).hide();
			app.map.getLayer(MapConfig.wizardGraphicsLayer.id).hide();
			app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id).hide();
			app.map._simpleLegends.concessions.hide();
		},

		showWizardRelatedLayers: function () {
			app.map.getLayer(MapConfig.adminUnitsLayer.id).show();
			app.map.getLayer(MapConfig.wizardGraphicsLayer.id).show();
			app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id).show();
		},

		/*
			This will launch the wizard with some the first two steps already completed
		*/
		analyzeAreaFromPopup: function (evt) {
			var target = evt.target ? evt.target : evt.srcElement,
					label = target.getAttribute('data-label'),
					type = target.getAttribute('data-type'),
					id = target.getAttribute('data-id'),
					selectedArea = AnalyzerConfig.stepOne.option3.id,
					url = MapConfig.oilPerm.url,
					self = this,
					layer;


			// Get Graphic, and set the appropriate content
			switch (type) {
				case 'Logging concession':
					layer = 3;
					break;
				case 'Mining concession':
					layer = 2;
					break;
				case 'Wood fiber plantation':
					layer = 0;
					break;
				case 'Oil palm concession':
					layer = 1;
					break;
				case 'RSPO Oil palm concession':
					layer = 4;
					url = MapConfig.commercialEntitiesLayer.url;
					break;
				case 'Plantations by Type':
					layer = 5;
					url = MapConfig.byType.url;
					selectedArea = 'Plantations by Type';
					break;
				case 'Plantations by Species': //todo: change URL?
					layer = 8;
					url = MapConfig.bySpecies.url;
					selectedArea = 'Plantations by Species';
					break;
				case 'GLAD Alerts': //todo: change URL?
					url = MapConfig.bySpecies.gladAlerts;
					break;
				case 'AdminBoundary':
					selectedArea = AnalyzerConfig.stepOne.option2.id;
					url = MapConfig.adminUnitsLayer.url;
					layer = MapConfig.adminUnitsLayer.layerId;
					break;
				case 'CertScheme':
					url = MapConfig.commercialEntitiesLayer.url;
					layer = MapConfig.commercialEntitiesLayer.layerId;
					break;
				case 'CustomGraphic':
					selectedArea = AnalyzerConfig.stepOne.option1.id;
					break;
				case 'MillPoint':
					selectedArea = AnalyzerConfig.stepOne.option5.id;
					break;
				case 'WDPA':
					url = MapConfig.palHelper.url;
					layer = MapConfig.palHelper.layerId;
					break;
			}

			console.log(type);
			console.log(selectedArea);

			if (type === 'CustomGraphic') {
				layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
				arrayUtils.some(layer.graphics, function (graphic) {
					if (graphic.attributes.WRI_ID === parseInt(id)) {
						if (!self.isOpen()) {
								topic.publish('toggleWizard');
							setWizardProps(graphic);
						} else {
							setWizardProps(graphic);
						}
						return true;
					}
					return false;
				});
			} else if (type === 'MillPoint') {
				// AnalyzerQuery.getMillByEntityId(id).then(function (feature) {
				AnalyzerQuery.getMillByWriId(id).then(function (feature) {
					feature.attributes.WRI_label = label;
					feature = GeoHelper.preparePointAsPolygon(feature);
					if (!self.isOpen()) {
									topic.publish('toggleWizard');
									setWizardProps(feature);
									self.addGraphicFromPopup(feature);
								} else {
									setWizardProps(feature);
									self.addGraphicFromPopup(feature);
								}
						});
					} else {
				// This should catch any generic dynamic layers
						AnalyzerQuery.getFeatureById(url + '/' + layer, id).then(function (feature) {
							feature.attributes.WRI_label = label;
							if (!self.isOpen()) {
									topic.publish('toggleWizard');
									setWizardProps(feature);
									self.addGraphicFromPopup(feature);
					} else {
						setWizardProps(feature);
						self.addGraphicFromPopup(feature);
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
				WizardStore.set(KEYS.areaOfInterest, selectedArea);
				WizardStore.set(KEYS.selectedCustomFeatures, [feature]);
				console.log(KEYS);
				// Set to Step 3, the parameter is index based like 0,1,2,3, 3 is the third step
				// because we inserted a introduction step that is now step 0

				if (wizard === undefined) {
					wizard = new Wizard({
						skipIntro: true
					}, 'wizard');
				}

				wizard._externalSetStep(3);
			}

			// Hide the info window
			app.map.infoWindow.hide();
		},

		addGraphicFromPopup: function (feature) {
			var layer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
					graphic;

			if (layer) {
				// Remove any previous features
				layer.clear();
				// Apply selection symbol and then add it
				feature = GeoHelper.applySelectionSymbolToFeature(feature);
				layer.add(feature);
			}
		},

		isOpen: function () {
			return domClass.contains('wizard-container', 'activated');
		}

	};

});
