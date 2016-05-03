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
], function(Evented, declare, on, dom, topic, registry, arrayUtils, domConstruct, MapConfig, WizardHelper, SuitabilityImageServiceLayer, SimpleLegend, Map, esriConfig, InfoTemplate, GraphicsLayer, FeatureLayer, RasterFunction, ImageParameters, ImageServiceParameters, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, ArcGISDynamicLayer, Legend, Geocoder, Scalebar, HomeButton, Locator, BasemapGallery) {
    'use strict';

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
                legendLayer,
                legendParams,
                formaAlertsLayer,
                formaParams,
                gainLayer,
                gainHelperLayer,
                lossLayer,
                lossParams,
                treeCoverDensityLayer,


                batchParams,

                forestCover_forestCover,
                forestCover_landCover,
                forestUse_landUse,
                forestCover_commodities,
                forestUse_commodities,
                production_commodities,


                primaryForestLayer,
                forestCoverLayer,
                forestCoverParams,
                forestCoverCommoditiesParams,
                forestUseLayer,
                forestUseParams,
                protectAreasLayer,
                protectAreasHelperParams,
                protectAreasHelper,
                customSuitabilityLayer,

                mapOverlaysLayer,
                mapOverlaysParams,
                customGraphicsLayer,
                adminBoundariesParams,
                adminBoundariesLayer,
                wizardDynamicParams,
                wizardDynamicLayer,
                bioDiversityParams,
                bioDiversityLayer,

                primaryParams,
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
            lossParams.interpolation = 'RSP_NearestNeighbor';
            lossParams.renderingRule = new RasterFunction({
                // "rasterFunction": "Colormap",
                // "rasterFunctionArguments": {
                //     "Colormap": MapConfig.loss.colormap,
                //     "Raster": {
                //         "rasterFunction": "Remap",
                //         "rasterFunctionArguments": {
                //             "InputRanges": MapConfig.loss.defaultRange,
                //             "OutputValues": [1],
                //             "AllowUnmatched": false
                //         }
                //     }
                // },
                // "variableName": "Raster"
                'rasterFunction': 'ForestCover_lossyear_density',
                'rasterFunctionArguments': {
                    'min_year': MapConfig.loss.defaultRange[0] + 2000,
                    'max_year': MapConfig.loss.defaultRange[1] + 2000,
                    'min_density': 30,
                    'max_density': 100
                }
            });

            lossLayer = new ArcGISImageServiceLayer(MapConfig.loss.url, {
                imageServiceParameters: lossParams,
                id: MapConfig.loss.id,
                visible: false,
                // interpolation: 'RSP_NearestNeighbor',//INTERPOLATION_NEARESTNEIGHBOR
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


            batchParams = new ImageParameters();
            batchParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            batchParams.layerIds = [];
            batchParams.format = "png32";


            forestCover_forestCover = new ArcGISDynamicLayer(MapConfig.ifl.url, {
                imageParameters: batchParams,
                id: "forestCover_forestCover",
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
                id: "forestCover_commodities",
                visible: false
            });
            forestUse_landUse = new ArcGISDynamicLayer(MapConfig.minePerm.url, {
                imageParameters: batchParams,
                id: "forestUse_landUse",
                visible: false
            });
            forestUse_commodities = new ArcGISDynamicLayer(MapConfig.rspoPerm.url, {
                imageParameters: batchParams,
                id: "forestUse_commodities",
                visible: false
            });
            production_commodities = new ArcGISDynamicLayer(MapConfig.opsd.url, {
                imageParameters: batchParams,
                id: "productionSuitability",
                visible: false
            });




            // forestCoverAggregate = new ArcGISDynamicLayer(MapConfig.ifl.url, {
            //     imageParameters: batchParams,
            //     id: "forestCover",
            //     visible: false
            // });

            // commoditiesAggregate = new ArcGISDynamicLayer(MapConfig.peat.url, {
            //     imageParameters: batchParams,
            //     id: "commodities",
            //     visible: false
            // });

            // landUserAggregate = new ArcGISDynamicLayer(MapConfig.oilPerm.url, {
            //     imageParameters: batchParams,
            //     id: "landUse",
            //     visible: false
            // });




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
            protectAreasHelperParams.format = "png32";

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
            bioDiversityParams.format = "png32";

            bioDiversityLayer = new ArcGISDynamicLayer(MapConfig.biodiversity.url, {
                imageParameters: bioDiversityParams,
                id: MapConfig.biodiversity.id,
                visible: false
            });


            mapOverlaysParams = new ImageParameters();
            mapOverlaysParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            mapOverlaysParams.layerIds = MapConfig.overlays.defaultLayers;
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

                // Agricultural Suitability Layers
                customSuitabilityLayer,
                // Forest Use Layers

                // Conservation Layers

                // forestCoverAggregate,
                // commoditiesAggregate,
                // landUserAggregate,
                forestCover_forestCover,
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
                customGraphicsLayer,
                wizardGraphicsLayer
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

                registry.byId("legend").refresh(layerInfos);

            });

            firesLayer.on('error', this.addLayerError);
            formaAlertsLayer.on('error', this.addLayerError);
            lossLayer.on('error', this.addLayerError);
            gainLayer.on('error', this.addLayerError);
            gainHelperLayer.on('error', this.addLayerError);
            treeCoverDensityLayer.on('error', this.addLayerError);
            customSuitabilityLayer.on('error', this.addLayerError);
            protectAreasLayer.on('error', this.addLayerError);
            protectAreasHelper.on('error', this.addLayerError);
            // forestCoverAggregate.on('error', this.addLayerError);
            // commoditiesAggregate.on('error', this.addLayerError);
            // landUserAggregate.on('error', this.addLayerError);
            forestCover_forestCover.on('error', this.addLayerError);
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
