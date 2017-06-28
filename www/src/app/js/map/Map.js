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
    "map/SimpleLegend",
    "layers/GladLayer",
    "layers/HansenLayer",
    "layers/GainLayer",
    // Esri Modules
    "esri/map",
    "esri/config",
    "esri/InfoTemplate",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/RasterFunction",
    "esri/layers/ImageParameters",
    "esri/layers/ImageServiceParameters",
    "esri/layers/ArcGISImageServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    // Esri Dijjits
    "esri/dijit/Legend",
    "esri/dijit/Geocoder",
    "esri/dijit/Scalebar",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
    "esri/dijit/BasemapGallery"
], function(Evented, declare, on, dom, topic, registry, arrayUtils, domConstruct, MapConfig, WizardHelper, SuitabilityImageServiceLayer, SimpleLegend, GladLayer, HansenLayer, GainLayer, Map, esriConfig, InfoTemplate, GraphicsLayer, FeatureLayer, RasterFunction, ImageParameters, ImageServiceParameters, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicLayer, Legend, Geocoder, Scalebar, HomeButton, Locator, BasemapGallery) {

    var _map = declare([Evented], {

        element: 'map',

        constructor: function(options) {
            declare.safeMixin(this, options);
            this.addConfigurations();
            this.createMap();
        },

        addConfigurations: function() {
            // Add this to basemaps so I can pass terrain as an option

            // 20141231 CRB - Commented out because it breaks when using the ESRI 3.12 library.
            /*esriConfig.defaults.map.basemaps.terrain = {
                baseMapLayers: [
                  { url: "http://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer" },
                  { url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer" }
                ],
                title: "Terrain Basemap"
            };*/
        },

        createMap: function() {
            var self = this;

            self.map = new Map(this.element, {
                basemap: this.basemap,
                center: [this.centerX, this.centerY],
                sliderPosition: this.sliderPosition,
                isScrollWheelZoom: true,
                zoom: this.zoom
            });

            self.map.on('load', function() {
                self.mapLoaded();
                self.map.resize();
                self.map.enableScrollWheelZoom();
                self.emit('map-ready', {});
            });

        },

        mapLoaded: function() {
            // Clear out default Esri Graphic at 0,0, dont know why its even there
            this.map.graphics.clear();
            this.addWidgets();
            this.addLayers();
        },

        addWidgets: function() {

            var home,
                legend,
                locator,
                geoCoder,
                basemapGallery,
                simpleLegends = {},
                scalebar,
                road,
                settle,
                poBounds,
                concessions;

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

            scalebar = new Scalebar({
                map: this.map,
                scalebarUnit: 'metric'
            });
            // This seems to break the app, very weird, dont uncomment unless new api fixes this
            // or needs to be started up
            //scalebar.startup();

            // Simple Legends

            // Overlays
            settle = new SimpleLegend(MapConfig.simpleLegends.settle);
            settle.init(settle.hide);

            road = new SimpleLegend(MapConfig.simpleLegends.road);
            road.init(road.hide);

            poBounds = new SimpleLegend(MapConfig.simpleLegends.poBounds);
            poBounds.init(poBounds.hide);

            // Concessions - NOTE replaces default wizard dynamic layer
            concessions = new SimpleLegend(MapConfig.simpleLegends.concessions);
            concessions.init(concessions.hide);

            simpleLegends.road = road;
            simpleLegends.settle = settle;
            simpleLegends.poBounds = poBounds;
            simpleLegends.concessions = concessions;

            this.map._simpleLegends = simpleLegends;

        },

        addLayers: function() {

            var firesLayer,
                fireParams,
                granChacoLayer,
                granChacoParams,
                plantationsTypeLayer,
                plantationsTypeParams,
                plantationsSpeciesLayer,
                plantationsSpeciesParams,
                soyLayer,
                soyParams,
                legendLayer,
                legendParams,
                formaAlertsLayer,
                formaParams,
                prodesAlertsLayer,
                prodesParams,
                gladAlertsLayer,
                gladParams = {},
                gladFootprintsLayer,
                gladFootprintsParams,
                hansenLossLayer,

                hansenLossLayer10,
                hansenLossLayer15,
                hansenLossLayer20,
                hansenLossLayer25,
                hansenLossLayer50,
                hansenLossLayer75,
                hansenLossParamsOrigParams = {},
                hansenLossParams10 = {},
                hansenLossParams15 = {},
                hansenLossParams20 = {},
                hansenLossParams25 = {},
                hansenLossParams50 = {},
                hansenLossParams75 = {},
                hansenGainLayer,
                hansenGainParams = {},
                // gainLayer,
                // gainHelperLayer,
                lossLayer,
                lossParams,
                treeCoverDensityLayer,
                batchParams,
                forestCover_forestCover,
                forestCover_tropical,
                tropicalParams,
                forestCover_landCover,
                forestUse_landUse,
                forestCover_commodities,
                forestUse_commodities,
                production_commodities,
                protectAreasLayer,
                protectAreasHelperParams,
                protectAreasHelper,
                customSuitabilityLayer,
                mapOverlaysLayer,
                mapOverlaysParams,
                customGraphicsLayer,
                wizardDynamicParams,
                wizardDynamicLayer,
                bioDiversityParams,
                bioDiversityLayer,
                wizardGraphicsLayer,
                wizardPointGraphicsLayer,
                self = this;

            fireParams = new ImageParameters();
            fireParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            fireParams.layerIds = MapConfig.fires.defaultLayers;
            fireParams.format = 'png32';

            var layerDefs = [];

            MapConfig.fires.defaultLayers.forEach(function(val) {
              layerDefs[val] = MapConfig.fires.defaultDefintion;
            });
            fireParams.layerDefinitions = layerDefs;

            firesLayer = new ArcGISDynamicLayer(MapConfig.fires.url, {
                imageParameters: fireParams,
                id: MapConfig.fires.id,
                visible: false
            });

            granChacoParams = new ImageParameters();
            granChacoParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            granChacoParams.layerIds = MapConfig.granChaco.defaultLayers;
            granChacoParams.format = 'png32';

            granChacoLayer = new ArcGISDynamicLayer(MapConfig.granChaco.url, {
                imageParameters: granChacoParams,
                id: MapConfig.granChaco.id,
                visible: false
            });

            plantationsTypeParams = new ImageParameters();
            plantationsTypeParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            plantationsTypeParams.layerIds = MapConfig.byType.defaultLayers;
            plantationsTypeParams.format = 'png32';

            plantationsTypeLayer = new ArcGISDynamicLayer(MapConfig.byType.url, {
                imageParameters: plantationsTypeParams,
                id: MapConfig.byType.id,
                visible: false
            });

            plantationsSpeciesParams = new ImageParameters();
            plantationsSpeciesParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            plantationsSpeciesParams.layerIds = MapConfig.bySpecies.defaultLayers;
            plantationsSpeciesParams.format = 'png32';

            plantationsSpeciesLayer = new ArcGISDynamicLayer(MapConfig.bySpecies.url, {
                imageParameters: plantationsSpeciesParams,
                id: MapConfig.bySpecies.id,
                visible: false
            });

            soyParams = new ImageParameters();
            soyParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            soyParams.layerIds = MapConfig.soy.defaultLayers;
            soyParams.format = 'png32';

            soyLayer = new ArcGISImageServiceLayer(MapConfig.soy.url, {
                // imageParameters: soyParams,
                id: MapConfig.soy.id,
                visible: false
            });

            legendParams = new ImageParameters();
            legendParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            legendParams.layerIds = [];
            legendParams.format = 'png32';

            legendLayer = new ArcGISDynamicLayer(MapConfig.legendLayer.url, {
                imageParameters: legendParams,
                id: MapConfig.legendLayer.id,
                visible: false
            });

            formaParams = new ImageServiceParameters();
            formaParams.renderingRule = new RasterFunction({
                'rasterFunction': 'Colormap',
                'rasterFunctionArguments': {
                    'Colormap': MapConfig.forma.colormap,
                    'Raster': {
                        'rasterFunction': 'Remap',
                        'rasterFunctionArguments': {
                            'InputRanges': MapConfig.forma.defaultRange,
                            'OutputValues': [1],
                            'AllowUnmatched': false
                        }
                    }
                },
                'variableName': 'Raster'
            });

            formaAlertsLayer = new ArcGISImageServiceLayer(MapConfig.forma.url, {
                imageServiceParameters: formaParams,
                id: MapConfig.forma.id,
                visible: false,
                opacity: 1
            });

            prodesParams = new ImageServiceParameters();
            prodesParams.renderingRule = new RasterFunction({
            'rasterFunction': 'Colormap',
            'rasterFunctionArguments': {
              'Colormap': MapConfig.prodes.colormap,
              'Raster': {
                'rasterFunction': 'Colormap',
                'rasterFunctionArguments': {
                  'Colormap': MapConfig.prodes.colormap,
                  'Raster': {
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': MapConfig.prodes.defaultRange,
                      'OutputValues': [1],
                      'AllowUnmatched': false
                    }
                  }
                }
              }
            }
          });

          // "rasterFunction": "Colormap",
          // "rasterFunctionArguments": {
          //   "Colormap":[[1,255,0,197]],
          //   "Raster":{
          //     "rasterFunction":"Remap",
          //     "rasterFunctionArguments":{
          //       "InputRanges":[1,14],
          //       "OutputValues":[1],
          //       "AllowUnmatched":false
          //     }
          //   }
          // },"variableName":"Raster"}

            prodesAlertsLayer = new ArcGISImageServiceLayer(MapConfig.prodes.url, {
                imageServiceParameters: prodesParams,
                id: MapConfig.prodes.id,
                visible: false,
                opacity: 1
            });

            gladParams.id = MapConfig.gladAlerts.id;
            gladParams.url = MapConfig.gladAlerts.url;
            gladParams.minDateValue = MapConfig.gladAlerts.minDateValue;
            gladParams.maxDateValue = MapConfig.gladAlerts.maxDateValue;
            gladParams.confidence = MapConfig.gladAlerts.confidence;
            gladParams.visible = false;

            gladAlertsLayer = new GladLayer(gladParams);

            hansenLossParamsOrigParams.id = MapConfig.hansenLoss.id;
            hansenLossParamsOrigParams.url = MapConfig.hansenLoss.url;
            hansenLossParamsOrigParams.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParamsOrigParams.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParamsOrigParams.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParamsOrigParams.visible = false;

            hansenLossParams10.id = MapConfig.hansenLoss.levels[0].id;
            hansenLossParams10.url = MapConfig.hansenLoss.levels[0].url;
            hansenLossParams10.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams10.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams10.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams10.visible = false;

            hansenLossParams15.id = MapConfig.hansenLoss.levels[1].id;
            hansenLossParams15.url = MapConfig.hansenLoss.levels[1].url;
            hansenLossParams15.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams15.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams15.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams15.visible = false;

            hansenLossParams20.id = MapConfig.hansenLoss.levels[2].id;
            hansenLossParams20.url = MapConfig.hansenLoss.levels[2].url;
            hansenLossParams20.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams20.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams20.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams20.visible = false;

            hansenLossParams25.id = MapConfig.hansenLoss.levels[3].id;
            hansenLossParams25.url = MapConfig.hansenLoss.levels[3].url;
            hansenLossParams25.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams25.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams25.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams25.visible = false;

            hansenLossParams50.id = MapConfig.hansenLoss.levels[5].id; //skipping 30 in the array
            hansenLossParams50.url = MapConfig.hansenLoss.levels[5].url;
            hansenLossParams50.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams50.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams50.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams50.visible = false;

            hansenLossParams75.id = MapConfig.hansenLoss.levels[6].id;
            hansenLossParams75.url = MapConfig.hansenLoss.levels[6].url;
            hansenLossParams75.minYear = MapConfig.hansenLoss.minYear;
            hansenLossParams75.maxYear = MapConfig.hansenLoss.maxYear;
            hansenLossParams75.confidence = MapConfig.hansenLoss.confidence;
            hansenLossParams75.visible = false;

            hansenLossLayer = new HansenLayer(hansenLossParamsOrigParams); //30% first

            hansenLossLayer10 = new HansenLayer(hansenLossParams10);
            hansenLossLayer15 = new HansenLayer(hansenLossParams15);
            hansenLossLayer20 = new HansenLayer(hansenLossParams20);
            hansenLossLayer25 = new HansenLayer(hansenLossParams25);
            hansenLossLayer50 = new HansenLayer(hansenLossParams50);
            hansenLossLayer75 = new HansenLayer(hansenLossParams75);


            hansenGainParams.id = MapConfig.hansenGain.id;
            hansenGainParams.url = MapConfig.hansenGain.url;
            hansenGainParams.visible = false;

            hansenGainLayer = new GainLayer(hansenGainParams);

            lossParams = new ImageServiceParameters();
            lossParams.interpolation = 'RSP_NearestNeighbor';
            lossParams.renderingRule = new RasterFunction({
                'rasterFunction': 'ForestCover_lossyear_density',
                'rasterFunctionArguments': {
                    'min_year': MapConfig.loss.defaultRange[0] + 2000,
                    'max_year': MapConfig.loss.defaultRange[1] + 2000,
                    'min_density': 30,
                    'max_density': 100
                }
            });
            gladFootprintsParams = new ImageParameters();
            gladFootprintsParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            gladFootprintsParams.layerIds = [MapConfig.gladFootprints.layerId];
            gladFootprintsParams.format = 'png32';

            gladFootprintsLayer = new ArcGISDynamicLayer(MapConfig.gladFootprints.url, {
                imageParameters: gladFootprintsParams,
                id: MapConfig.gladFootprints.id,
                visible: false
            });

            lossLayer = new ArcGISImageServiceLayer(MapConfig.loss.url, {
                imageServiceParameters: lossParams,
                id: MapConfig.loss.id,
                visible: false,
                // interpolation: 'RSP_NearestNeighbor',//INTERPOLATION_NEARESTNEIGHBOR
                opacity: 1
            });

            // gainLayer = new ArcGISTiledMapServiceLayer(MapConfig.gain.url, {
            //     id: MapConfig.gain.id,
            //     visible: false
            // });

            // gainHelperLayer = new ArcGISImageServiceLayer(MapConfig.gainHelper.url, {
            //     id: MapConfig.gainHelper.id,
            //     visible: false
            // });

            treeCoverDensityLayer = new ArcGISImageServiceLayer(MapConfig.tcd.url, {
                id: MapConfig.tcd.id,
                visible: false
            });

            batchParams = new ImageParameters();
            batchParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            batchParams.layerIds = [];
            batchParams.format = 'png32';

            forestCover_forestCover = new ArcGISDynamicLayer(MapConfig.ifl.url, {
                imageParameters: batchParams,
                id: 'forestCover_forestCover',
                visible: false
            });

            tropicalParams = new ImageServiceParameters();
            tropicalParams.renderingRule = new RasterFunction({
                'rasterFunction': 'Stretched'
            });

            forestCover_tropical = new ArcGISImageServiceLayer(MapConfig.tfcs.url, {
                imageServiceParameters: tropicalParams,
                id: MapConfig.tfcs.id,
                visible: false,
                opacity: 1
            });

            forestCover_landCover = new ArcGISDynamicLayer(MapConfig.ldcover.url, {
                imageParameters: batchParams,
                id: 'forestCover_landCover',
                visible: false
            });
            forestCover_landCover = new ArcGISDynamicLayer(MapConfig.ldcover.url, {
                imageParameters: batchParams,
                id: 'forestCover_landCover',
                visible: false
            });
            forestCover_landCover = new ArcGISDynamicLayer(MapConfig.ldcover.url, {
                imageParameters: batchParams,
                id: 'forestCover_landCover',
                visible: false
            });
            forestCover_commodities = new ArcGISDynamicLayer(MapConfig.peat.url, {
                imageParameters: batchParams,
                id: 'forestCover_commodities',
                visible: false
            });
            forestUse_landUse = new ArcGISDynamicLayer(MapConfig.minePerm.url, {
                imageParameters: batchParams,
                id: 'forestUse_landUse',
                visible: false
            });
            forestUse_commodities = new ArcGISDynamicLayer(MapConfig.mill.url, {
                imageParameters: batchParams,
                id: 'forestUse_commodities',
                visible: false
            });
            production_commodities = new ArcGISDynamicLayer(MapConfig.opsd.url, {
                imageParameters: batchParams,
                id: 'productionSuitability',
                visible: false
            });

            customSuitabilityLayer = new SuitabilityImageServiceLayer(MapConfig.suit.url, {
                id: MapConfig.suit.id,
                visible: false
            });

            protectAreasLayer = new ArcGISTiledMapServiceLayer(MapConfig.pal.url, {
                id: MapConfig.pal.id,
                visible: false
            });

            protectAreasHelperParams = new ImageParameters();
            protectAreasHelperParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            protectAreasHelperParams.layerIds = [MapConfig.palHelper.layerId];
            protectAreasHelperParams.format = 'png32';

            protectAreasHelper = new ArcGISDynamicLayer(MapConfig.palHelper.url, {
                imageParameters: protectAreasHelperParams,
                id: MapConfig.palHelper.id,
                maxScale: 0,
                minScale: 0,
                visible: false
            });

            bioDiversityParams = new ImageParameters();
            bioDiversityParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            bioDiversityParams.layerIds = [MapConfig.biodiversity.layerId];
            bioDiversityParams.format = 'png32';

            bioDiversityLayer = new ArcGISDynamicLayer(MapConfig.biodiversity.url, {
                imageParameters: bioDiversityParams,
                id: MapConfig.biodiversity.id,
                visible: false
            });

            mapOverlaysParams = new ImageParameters();
            mapOverlaysParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            mapOverlaysParams.layerIds = MapConfig.overlays.defaultLayers;
            mapOverlaysParams.format = 'png32';

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
            wizardDynamicParams.format = 'png32';

            wizardDynamicLayer = new ArcGISDynamicLayer(MapConfig.adminUnitsLayer.url, {
                imageParameters: wizardDynamicParams,
                id: MapConfig.adminUnitsLayer.id,
                visible: false
            });

            wizardGraphicsLayer = new GraphicsLayer({
                id: MapConfig.wizardGraphicsLayer.id
            });

            wizardPointGraphicsLayer = new GraphicsLayer({
                id: MapConfig.wizardPointGraphicsLayer.id
            });

            customGraphicsLayer = new GraphicsLayer({
                id: MapConfig.customGraphicsLayer.id
            });

            app.map.addLayers([
                // Hidden Legend Layer
                legendLayer,
                // Forest Cover Layers
                treeCoverDensityLayer,

                // Agricultural Suitability Layers
                customSuitabilityLayer,
                // Forest Use Layers

                // Conservation Layers

                // forestCoverAggregate,
                // commoditiesAggregate,
                // landUserAggregate,
                forestCover_forestCover,
                forestCover_tropical,
                forestCover_landCover,
                forestUse_landUse,
                forestCover_commodities,
                forestUse_commodities,
                production_commodities,

                protectAreasLayer,
                protectAreasHelper,
                bioDiversityLayer,
                // Forest Change Layers
                formaAlertsLayer,
                prodesAlertsLayer,
                gladAlertsLayer,
                gladFootprintsLayer,
                hansenLossLayer,
                hansenLossLayer10,
                hansenLossLayer15,
                hansenLossLayer20,
                hansenLossLayer25,
                hansenLossLayer50,
                hansenLossLayer75,
                hansenGainLayer,
                lossLayer,
                // gainLayer,
                // gainHelperLayer,
                granChacoLayer,
                soyLayer,
                // Points Layers
                firesLayer,
                plantationsTypeLayer,
                plantationsSpeciesLayer,
                // Overlays
                wizardDynamicLayer,
                mapOverlaysLayer,
                // Custom Features Layer -- Drawn Features and/or Uploaded Shapefiles
                // If needs be, seperate these out into multiple Graphics Layers
                customGraphicsLayer,
                wizardGraphicsLayer,
                wizardPointGraphicsLayer
            ]);

            on.once(app.map, 'layers-add-result', function(response) {
                self.emit('layers-loaded', {
                    response: response
                });

                var layerInfos = arrayUtils.map(response.layers, function(item) {
                    return {
                        layer: item.layer
                    };
                });

                layerInfos = arrayUtils.filter(layerInfos, function(item) {
                    return (!item.layer.url ? false : (item.layer.url.search('ImageServer') < 0 && item.layer.id.search('Gain') < 0) && item.layer.id !== MapConfig.adminUnitsLayer.id);
                });

                registry.byId('legend').refresh(layerInfos);

            });

            firesLayer.on('error', this.addLayerError);
            granChacoLayer.on('error', this.addLayerError);
            plantationsTypeLayer.on('error', this.addLayerError);
            plantationsSpeciesLayer.on('error', this.addLayerError);
            soyLayer.on('error', this.addLayerError);
            formaAlertsLayer.on('error', this.addLayerError);
            prodesAlertsLayer.on('error', this.addLayerError);
            gladAlertsLayer.on('error', this.addLayerError);
            gladFootprintsLayer.on('error', this.addLayerError);
            hansenLossLayer.on('error', this.addLayerError);
            hansenLossLayer10.on('error', this.addLayerError);
            hansenLossLayer15.on('error', this.addLayerError);
            hansenLossLayer20.on('error', this.addLayerError);
            hansenLossLayer25.on('error', this.addLayerError);
            hansenLossLayer50.on('error', this.addLayerError);
            hansenLossLayer75.on('error', this.addLayerError);
            hansenGainLayer.on('error', this.addLayerError);

            lossLayer.on('error', this.addLayerError);
            // gainLayer.on('error', this.addLayerError);
            // gainHelperLayer.on('error', this.addLayerError);
            treeCoverDensityLayer.on('error', this.addLayerError);
            customSuitabilityLayer.on('error', this.addLayerError);
            protectAreasLayer.on('error', this.addLayerError);
            protectAreasHelper.on('error', this.addLayerError);
            // forestCoverAggregate.on('error', this.addLayerError);
            // commoditiesAggregate.on('error', this.addLayerError);
            // landUserAggregate.on('error', this.addLayerError);
            forestCover_forestCover.on('error', this.addLayerError);
            forestCover_tropical.on('error', this.addLayerError);
            forestCover_landCover.on('error', this.addLayerError);
            forestUse_landUse.on('error', this.addLayerError);
            forestCover_commodities.on('error', this.addLayerError);
            forestUse_commodities.on('error', this.addLayerError);
            production_commodities.on('error', this.addLayerError);

            wizardDynamicLayer.on('error', this.addLayerError);
            mapOverlaysLayer.on('error', this.addLayerError);
            customGraphicsLayer.on('error', this.addLayerError);
            bioDiversityLayer.on('error', this.addLayerError);

            // Add Layer Specific events here
            customSuitabilityLayer.on('image-ready', function() {
                topic.publish('customSuitabilityImageReady');
            });

        },

        addLayerError: function(err) {
            console.error(err);
        }

    });

    return _map;

});
