define([
	"dojo/Evented",
	"dojo/_base/declare",
	"dojo/on",
	"dojo/dom",
	"dojo/topic",
	"dijit/registry",
	"dojo/_base/array",
	"dojo/dom-construct",
	// My Modules
	"map/config",
	"analysis/WizardHelper",
	"map/SuitabilityImageServiceLayer",
	// Esri Modules
	"esri/map",
	"esri/InfoTemplate",
	"esri/layers/GraphicsLayer",
	"esri/layers/RasterFunction",
	"esri/layers/ImageParameters",
	"esri/layers/ImageServiceParameters",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	// Esri Dijjits
	"esri/dijit/Legend",
	"esri/dijit/Geocoder",
	"esri/dijit/HomeButton",
	"esri/dijit/LocateButton",
	"esri/dijit/BasemapGallery"
], function (Evented, declare, on, dom, topic, registry, arrayUtils, domConstruct, MapConfig, WizardHelper, SuitabilityImageServiceLayer, Map, InfoTemplate, GraphicsLayer, RasterFunction, ImageParameters, ImageServiceParameters, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicLayer, Legend, Geocoder, HomeButton, Locator, BasemapGallery) {
	'use strict';

	var _map = declare([Evented], {

		element: 'map',

		constructor: function (options) {
			declare.safeMixin(this, options);
			this.createMap();
		},

		createMap: function () {
			var self = this;

			self.map = new Map(this.element, {
				basemap: this.basemap,
				center: [this.centerX, this.centerY],
				sliderPosition: this.sliderPosition,
				zoom: this.zoom
			});

			self.map.on('load', function () {
				self.mapLoaded();
				self.map.resize();
				self.emit('map-ready', {});
			});

		},

		mapLoaded: function () {
			// Clear out default Esri Graphic at 0,0, dont know why its even there
      this.map.graphics.clear();
			this.addWidgets();
			this.addLayers();
		},

		addWidgets: function () {

			var home,
					legend,
					locator,
					geoCoder,
					basemapGallery;

			domConstruct.create("div", {
        'id': 'home-button',
        'class': 'home-button'
      }, document.querySelector(".esriSimpleSliderIncrementButton"), "after");

      home = new HomeButton({
          map: this.map
      }, "home-button");
      home.startup();

      basemapGallery = new BasemapGallery({
        map: this.map,
        showArcGISBasemaps: true
      }, "basemap-gallery");
      basemapGallery.startup();

      locator = new Locator({
        map: this.map,
        highlightLocation: false
      }, "location-widget");
      locator.startup();

      geoCoder = new Geocoder({
      	map: this.map,
      	autoComplete: true,
      	arcgisGeocoder: {
      		placeholder: "Enter address or region"
      	}      	
      }, "simple-geocoder");
      geoCoder.startup();

      legend = new Legend({
        map: this.map,
        layerInfos: [],
        autoUpdate: true
      }, "legend");
      legend.startup();

		},

		addLayers: function () {

			var firesLayer,
					fireParams,
					legendLayer,
					legendParams,
					formaAlertsLayer,
					formaParams,
					gainLayer,
					gainHelperLayer,
					lossLayer,
					lossParams,
					treeCoverDensityLayer,
					primaryForestLayer,
					forestCoverLayer,
					forestCoverParams,
					forestUseLayer,
					forestUseParams,
					protectAreasLayer,
					protectAreasHelperParams,
					protectAreasHelper,
					customSuitabilityLayer,
					agroSuitabilityLayer,
					agroSuitabilityParams,
					mapOverlaysLayer,
					mapOverlaysParams,
					customGraphicsLayer,
					adminBoundariesParams,
					adminBoundariesLayer,
					wizardDynamicParams,
					wizardDynamicLayer,
					wizardGraphicsLayer,
					self = this;

			fireParams = new ImageParameters();
			fireParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			fireParams.layerIds = MapConfig.fires.defaultLayers;
			fireParams.format = "png32";

			firesLayer = new ArcGISDynamicLayer(MapConfig.fires.url, {
				imageParameters: fireParams,
				id: MapConfig.fires.id,
				visible: false
			});

			legendParams = new ImageParameters();
			legendParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			legendParams.layerIds = [];
			legendParams.format = "png32";

			legendLayer = new ArcGISDynamicLayer(MapConfig.legendLayer.url, {
				imageParameters: legendParams,
				id: MapConfig.legendLayer.id,
				visible: false
			});

			formaParams = new ImageServiceParameters();
			formaParams.renderingRule = new RasterFunction({
				"rasterFunction": "Colormap",
        "rasterFunctionArguments": {
            "Colormap": MapConfig.forma.colormap,
            "Raster": {
                "rasterFunction": "Remap",
                "rasterFunctionArguments": {
                    "InputRanges": MapConfig.forma.defaultRange,
                    "OutputValues": [1],
                    "AllowUnmatched": false
                }
            }
        },
        "variableName": "Raster"
			});

			formaAlertsLayer = new ArcGISImageServiceLayer(MapConfig.forma.url, {
				imageServiceParameters: formaParams,
				id: MapConfig.forma.id,
				visible: false,
				opacity: 1
			});

			lossParams = new ImageServiceParameters();
			lossParams.renderingRule = new RasterFunction({
				"rasterFunction": "Colormap",
        "rasterFunctionArguments": {
            "Colormap": MapConfig.loss.colormap,
            "Raster": {
                "rasterFunction": "Remap",
                "rasterFunctionArguments": {
                    "InputRanges": MapConfig.loss.defaultRange,
                    "OutputValues": [1],
                    "AllowUnmatched": false
                }
            }
        },
        "variableName": "Raster"
			});

			lossLayer = new ArcGISImageServiceLayer(MapConfig.loss.url, {
				imageServiceParameters: lossParams,
				id: MapConfig.loss.id,
				visible: false,
				opacity: 1
			});

			gainLayer = new ArcGISTiledMapServiceLayer(MapConfig.gain.url, {
				id: MapConfig.gain.id,
				visible: false
			});

			gainHelperLayer = new ArcGISImageServiceLayer(MapConfig.gainHelper.url, {
				id: MapConfig.gainHelper.id,
				visible: false
			});

			treeCoverDensityLayer = new ArcGISImageServiceLayer(MapConfig.tcd.url, {
				id: MapConfig.tcd.id,
				visible: false
			});

			primaryForestLayer = new ArcGISImageServiceLayer(MapConfig.primForest.url, {
				id: MapConfig.primForest.id,
				visible: false
			});

			customSuitabilityLayer = new SuitabilityImageServiceLayer(MapConfig.suit.url, {
				id: MapConfig.suit.id,
				visible: false				
			});

			// Uses ifl config, which is the same as peat, tfcs, ldcover, legal.  They
			// are all part of the same dynamic layer so any config item could be used
			forestCoverParams = new ImageParameters();
			forestCoverParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			forestCoverParams.layerIds = [];
			forestCoverParams.format = "png32";

			forestCoverLayer = new ArcGISDynamicLayer(MapConfig.ifl.url, {
				imageParameters: forestCoverParams,
				id: MapConfig.ifl.id,
				visible: false
			});

			// Uses oilPerm config, which is the same as logPerm, minePerm, woodPerm.  They
			// are all part of the same dynamic layer so any config item could be used
			forestUseParams = new ImageParameters();
			forestUseParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			forestUseParams.layerIds = [];
			forestUseParams.format = "png32";

			forestUseLayer = new ArcGISDynamicLayer(MapConfig.oilPerm.url, {
				imageParameters: forestUseParams,
				id: MapConfig.oilPerm.id,
				visible: false
			});

			protectAreasLayer = new ArcGISTiledMapServiceLayer(MapConfig.pal.url, {
				id: MapConfig.pal.id,
				visible: false
			});

			protectAreasHelperParams = new ImageParameters();
			protectAreasHelperParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			protectAreasHelperParams.layerIds = [MapConfig.palHelper.layerId];
			protectAreasHelperParams.format = "png32";

			protectAreasHelper = new ArcGISDynamicLayer(MapConfig.palHelper.url, {
				imageParameters: protectAreasHelperParams,
				id: MapConfig.palHelper.id,
				visible: false
			});

			// Uses opsd config, which is the same as cons, elev, slope, rain, soilDr, soilDe, soilAc, soilTy.  
			// They are all part of the same dynamic layer so any config item could be used
			agroSuitabilityParams = new ImageParameters();
			agroSuitabilityParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			agroSuitabilityParams.layerIds = [];
			agroSuitabilityParams.format = "png32";

			agroSuitabilityLayer = new ArcGISDynamicLayer(MapConfig.opsd.url, {
				imageParameters: agroSuitabilityParams,
				id: MapConfig.opsd.id,
				visible: false
			});

			mapOverlaysParams = new ImageParameters();
			mapOverlaysParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			mapOverlaysParams.layerIds = [];
			mapOverlaysParams.format = "png32";

			mapOverlaysLayer = new ArcGISDynamicLayer(MapConfig.overlays.url, {
				imageParameters: mapOverlaysParams,
				id: MapConfig.overlays.id,
				visible: false
			});

			// Uses adminUnitsLayer config, which is the same as certificationSchemeLayer.  
			// They are all part of the same dynamic layer so any config item could be used
			wizardDynamicParams = new ImageParameters();
			wizardDynamicParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
			wizardDynamicParams.layerIds = [];
			wizardDynamicParams.format = "png32";

			wizardDynamicLayer = new ArcGISDynamicLayer(MapConfig.adminUnitsLayer.url, {
				imageParameters: wizardDynamicParams,
				id: MapConfig.adminUnitsLayer.id,
				visible: false
			});

			wizardGraphicsLayer = new GraphicsLayer({
				id: MapConfig.wizardGraphicsLayer.id
			});

			customGraphicsLayer = new GraphicsLayer({
				id: MapConfig.customGraphicsLayer.id
			});

			app.map.addLayers([
				// Hidden Legend Layer
				legendLayer,				
				// Forest Cover Layers
				treeCoverDensityLayer,
				primaryForestLayer,
				forestCoverLayer,
				// Agricultural Suitability Layers
				agroSuitabilityLayer,
				customSuitabilityLayer,
				// Forest Use Layers
				forestUseLayer,
				// Conservation Layers
				protectAreasLayer,
				protectAreasHelper,
				// Forest Change Layers
				formaAlertsLayer,
				lossLayer,
				gainLayer,
				gainHelperLayer,
				// Points Layers
				firesLayer,
				// Overlays
				wizardDynamicLayer,
				mapOverlaysLayer,
				// Custom Features Layer -- Drawn Features and/or Uploaded Shapefiles
				// If needs be, seperate these out into multiple Graphics Layers
				wizardGraphicsLayer,
				customGraphicsLayer
			]);

			on.once(app.map, 'layers-add-result', function (response) {
				self.emit('layers-loaded', { response: response });

				var layerInfos = arrayUtils.map(response.layers, function (item) {
					return {
						layer: item.layer
					};
				});

				layerInfos = arrayUtils.filter(layerInfos, function (item) {
					return !item.layer.url ? false : (item.layer.url.search('ImageServer') < 0 && item.layer.id.search('Gain') < 0);
				});

				registry.byId("legend").refresh(layerInfos);

			});

			firesLayer.on('error', this.addLayerError);
			formaAlertsLayer.on('error', this.addLayerError);
			lossLayer.on('error', this.addLayerError);
			gainLayer.on('error', this.addLayerError);
			gainHelperLayer.on('error', this.addLayerError);
			treeCoverDensityLayer.on('error', this.addLayerError);
			primaryForestLayer.on('error', this.addLayerError);
			customSuitabilityLayer.on('error', this.addLayerError);
			forestCoverLayer.on('error', this.addLayerError);
			forestUseLayer.on('error', this.addLayerError);
			protectAreasLayer.on('error', this.addLayerError);
			protectAreasHelper.on('error', this.addLayerError);
			agroSuitabilityLayer.on('error', this.addLayerError);
			wizardDynamicLayer.on('error', this.addLayerError);
			mapOverlaysLayer.on('error', this.addLayerError);
			customGraphicsLayer.on('error', this.addLayerError);

			// Add Layer Specific events here
			customSuitabilityLayer.on('image-ready', function () {
				topic.publish('customSuitabilityImageReady');
			});

		},

		addLayerError: function (err) {
			console.error(err);
		}

	});

	return _map;

});