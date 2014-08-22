define([
	"dojo/Evented",
	"dojo/_base/declare",
	"dojo/on",
	"dojo/dom",
	"dojo/dom-construct",
	// My Modules
	"map/config",
	// Esri Modules
	"esri/map",
	"esri/layers/RasterFunction",
	"esri/layers/ImageParameters",
	"esri/layers/ImageServiceParameters",
	"esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ArcGISTiledMapServiceLayer",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	// Esri Dijjits
	"esri/dijit/Geocoder",
	"esri/dijit/HomeButton",
	"esri/dijit/LocateButton",
	"esri/dijit/BasemapGallery"
], function (Evented, declare, on, dom, domConstruct, MapConfig, Map, RasterFunction, ImageParameters, ImageServiceParameters, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicLayer, Geocoder, HomeButton, Locator, BasemapGallery) {
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
				self.map.resize();
				self.mapLoaded();
			});


		},

		mapLoaded: function () {
			// Clear out default Esri Graphic at 0,0, dont know why its even there
      this.map.graphics.clear();

			this.addWidgets();
			this.addLayers();
			this.emit('map-ready', {});
		},

		addWidgets: function () {

			var home,
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

		},

		addLayers: function () {

			var firesLayer,
					fireParams,
					formaAlertsLayer,
					formaParams,
					gainLayer,
					lossLayer,
					lossParams,
					treeCoverDensityLayer,
					forestCoverLayer,
					forestCoverParams,
					forestUseLayer,
					forestUseParams,
					protectAreasLayer,
					agroSuitabilityLayer,
					agroSuitabilityParams,
					mapOverlaysLayer,
					mapOverlaysParams,
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

			gainLayer = new ArcGISImageServiceLayer(MapConfig.gain.url, {
				id: MapConfig.gain.id,
				visible: false
			});

			treeCoverDensityLayer = new ArcGISImageServiceLayer(MapConfig.tcd.url, {
				id: MapConfig.tcd.id,
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

			app.map.addLayers([
				// Forest Change Layers
				formaAlertsLayer,
				lossLayer,
				gainLayer,
				// Conservation Layers
				protectAreasLayer,
				// Agricultural Suitability Layers
				agroSuitabilityLayer,
				// Forest Cover Layers
				treeCoverDensityLayer,
				forestCoverLayer,
				// Forest Use Layers
				forestUseLayer,
				// Points Layers
				firesLayer,
				// Overlays
				mapOverlaysLayer
			]);

			on.once(app.map, 'layers-add-result', function () {
				self.emit('layers-loaded', {});
			});

			firesLayer.on('error', this.addLayerError);
			formaAlertsLayer.on('error', this.addLayerError);
			lossLayer.on('error', this.addLayerError);
			gainLayer.on('error', this.addLayerError);
			treeCoverDensityLayer.on('error', this.addLayerError);
			forestCoverLayer.on('error', this.addLayerError);
			forestUseLayer.on('error', this.addLayerError);
			protectAreasLayer.on('error', this.addLayerError);
			agroSuitabilityLayer.on('error', this.addLayerError);
			mapOverlaysLayer.on('error', this.addLayerError);

		},

		addLayerError: function (err) {
			console.error(err);
		}

	});

	return _map;

});