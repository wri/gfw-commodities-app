define('main/config',{

  "title": "Global Forest Watch Commodities",

  "urls": {
    "gfw": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open",
    "blog": "http://commodities.globalforestwatch.org/#v=map&x=114.37&y=2.08&l=5&lyrs=tcc%2Closs",
    "fires": "http://fires.globalforestwatch.org/map/#activeLayers=activeFires&activeBasemap=topo&x=115&y=0&z=5",
    "supplierMonitoring": "http://commodities.globalforestwatch.org/#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open",
    "SPOTT": "#"


  },

  "corsEnabledServers": [
    "https://api-ssl.bitly.com",
    "http://globalforestwatch.org",
    "http://firms.modaps.eosdis.nasa.gov",
    "http://gis-potico.wri.org",
    "http://gfw-apis.appspot.com",
    "http://50.18.182.188"
  ],

  "homeModeOptions": [{
    'html': '<div class="home-slider-container">\n<h3>PALM OIL RISK TOOL</h3>\n<h4><span>NEW GFW COMMODITIES TOOL MEASURES</span>\n<span>DEFORESTATION RISK AROUND PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=-17.62&y=-0.89&l=3&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    'eventName': "goToWizard",
    'display': false,
    'id': 0,
    'tooltip': "Palm Oil Risk Tool",
    'imageBg': "./app/css/images/Slide-Picture6.jpg"
  },{
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES MAP</h3>\n<h4><span>EXPLORE THE</span>\n<span>COMMODITIES MAP</span></h4>\n<div><a href="./#v=map&x=114.37&y=1.99&l=5&lyrs=tcc%2Closs">More Info</a></div>\n</div>',
    "eventName": "goToMap",
    "display": false,
    "id": 1,
    "tooltip": "Commodities Map",
    "imageBg": "./app/css/images/Slide-Picture2.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>ANALYSIS</h3>\n<h4><span>ANALYZE FOREST COVER</span>\n<span>CHANGE IN A CONCESSION</span>\n<span>OR CUSTOM AREA</span></h4>\n<div><a href="./#v=map&x=104.27&y=1.99&l=5&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToAnalysis",
    "display": true,
    "id": 2,
    "tooltip": "Analysis",
    "imageBg": "./app/css/images/Slide-Picture1.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>SUPPLIER MONITORING</h3>\n<h4><span>MONITOR THE</span>\n<span>ACTIVITY NEAR</span>\n<span>PALM OIL MILLS</span></h4>\n<div><a href="./#v=map&x=104.27&y=2.08&l=5&lyrs=tcc%2Closs&wiz=open">More Info</a></div>\n</div>',
    "eventName": "goToSupplier",
    "display": false,
    "id": 3,
    "tooltip": "Supplier Monitoring",
    "imageBg": "./app/css/images/Slide-Picture4.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>ALERTS</h3>\n<h4><span>SIGN UP FOR TREE</span>\n<span>CLEARANCE AND FIRE</span>\n<span>ALERTS FORS AREAS IN</span>\n<span>YOUR SUPPLY CHAIN</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToFires",
    "display": false,
    "id": 4,
    "tooltip": "Alerts",
    "imageBg": "./app/css/images/Slide-Picture3.jpg"
  }, {
    "html": '<div class="home-slider-container">\n<h3>COMMODITIES</h3>\n<h4><span>ANALYZE LAND USE</span>\n<span>CHANGE WITHIN RSPO</span>\n<span>CERTIFIED AREAS</span></h4>\n<div><a href="#">More Info</a></div>\n</div>',
    "eventName": "goToPalm",
    "display": false,
    "id": 5,
    "tooltip": "Explore Commodities",
    "imageBg": "./app/css/images/Slide-Picture5.jpg"
  }],

  "homeDialog": {
    "html": "<p>GFW Commodities is constantly undergoing site enhancements including interface redesigns based on user feedback and the incorporation of new datasets and new tools you asked for.</p>" +
    "<p>If you'd like to be kept informed of these kinds of updates, please <a href='http://www.wri.org/global-forest-watch-updates-and-newsletter' target='_blank'>join our mailing list</a>.</p>" +
    "<p>We will <strong>NEVER</strong> sell your email address to anyone, ever. We will only use your email address to send you useful newsletters about updates to the site or request your user feedback. You can unsubscribe at any time.</p>"
  }

});

define('utils/Hasher',[
    "dojo/hash",
    "dojo/io-query",
    "dojo/topic",
    "dojo/_base/array",
    "dojo/query"
], function(hash, ioQuery, topic, arrayUtils, query) {
    'use strict';

    var currentView,
        currentFeature,
        currentX,
        currentY,
        currentL;

    return {
        // Grab initial hash or set initial hash to home and return current view
        init: function() {
            var state = ioQuery.queryToObject(hash()),
                defaultView = 'home',
                self = this;
            //state['x'];
            //state['y'];

            if (state.hasOwnProperty('v')) {
                defaultView = state.v;
            } else {
                state.v = 'home';
                hash(ioQuery.objectToQuery(state));
            }

            currentView = state.v;
            currentX = state.x;
            currentY = state.y;
            currentL = state.l;
            currentFeature = state.f;

            topic.subscribe("/dojo/hashchange", function(changedHash) {
                var oldState = state;

                state = ioQuery.queryToObject(changedHash);
                //console.log(state);

                if ((state.x !== currentX || state.y !== currentY) && state.v == "map") {
                    topic.publish('centerChange', currentX, currentY, currentL);
                }

                // If view has not changed, do nothing
                if (state.v === currentView) {
                    return;
                }

                currentView = state.v;
                self.changeView(currentView);

            });
            return defaultView;
        },

        handleHashChange: function(newState, oldState) {
            var that = this;

            //o.newState = newState;
            //var changedView = oldState.v != newState.v;
            //var mapView = newState.v == "map";
            var centerChange = ((oldState.x != newState.x) || (oldState.y != newState.y) || (oldState.y != newState.y));
            //var centerChange =
            //handle different scenarios here
            // if (changedView) {
            //     that.changeView(newState.v, oldState.v);
            // }
            //if (mapView && centerChange) {
            EventsController.centerChange(newState);
            MapController.centerChange();
            //}
            //currentState = newState; //important

        },

        getHash: function(key) {
            return key ? ioQuery.queryToObject(hash())[key] : ioQuery.queryToObject(hash());
        },

        setHash: function(key, value) {
            var state = ioQuery.queryToObject(hash());
            state[key] = value;
            hash(ioQuery.objectToQuery(state));
        },

        setHashFromState: function(state) {
            // We dont wont to overwrite the lyrs part of the hash,
            // We need to hold on to that and make sure it is mixed in
            // Discuss with Jason, May need to find another way to implement
            // this so it does not mess up his features, or we should probably
            // stash them and only bring them back when were in the map view

            var currentHash = this.getHash();
            if (currentHash.x && currentHash.y) {
                state.x = currentHash.x;
                state.y = currentHash.y;
                state.l = currentHash.l;

            }
            if (currentHash.lyrs) {
                state.lyrs = currentHash.lyrs;
            }

            if (currentHash.wiz) {
                state.wiz = currentHash.wiz;
            }

            if (currentHash.f && state.v === 'map') {
                state.f = currentHash.f;
            }

            hash(ioQuery.objectToQuery(state));

        },

        removeKey: function(key) {
            var state = ioQuery.queryToObject(hash());
            if (state[key]) {
                delete state[key];
            }
            hash(ioQuery.objectToQuery(state));
        },

        toggleLayers: function(layerId) {
            var state = ioQuery.queryToObject(hash()),
                lyrsArray,
                index;

            lyrsArray = state.lyrs ? state.lyrs.split(",") : [];
            index = lyrsArray.indexOf(layerId);

            if (index > -1) {
                lyrsArray.splice(index, 1);
            } else {
                lyrsArray.push(layerId);
            }

            if (lyrsArray.length === 0) {
                delete state.lyrs;
            } else {
                state.lyrs = lyrsArray.join(',');
            }

            hash(ioQuery.objectToQuery(state));
        },

        forceLayer: function(layerId, on) {
            var state = ioQuery.queryToObject(hash()),
                lyrsArray,
                index;

            lyrsArray = state.lyrs ? state.lyrs.split(",") : [];

            index = lyrsArray.indexOf(layerId);

            if (on) {
                if (index === -1) {
                    lyrsArray.push(layerId);
                }
            } else {
                if (index > -1) {
                    lyrsArray.splice(index, 1);
                }
            }

            if (lyrsArray.length === 0) {
                delete state.lyrs;
            } else {
                state.lyrs = lyrsArray.join(',');
            }

            hash(ioQuery.objectToQuery(state));

        },

        getLayers: function() {
            var layers = ioQuery.queryToObject(hash()).lyrs;
            return layers ? layers.split(',') : [];
        },

        removeLayers: function(value) {
            var state = ioQuery.queryToObject(hash()),
                layers = state.lyrs.split(',');

            layers.splice(layers.indexOf(value), 1);
            state.lyrs = layers.join(",");

            hash(ioQuery.objectToQuery(state));

        },

        changeView: function(view) {
            topic.publish('changeView', view);
        }

    };

});

define('map/config',[], function() {

    // The dynamicMapServiceUrl is used by several layers, make sure if you change it all layers and layer ids are still working
    // The dynamicMapServiceUrl is currently being used by the following layers (by key):
    // ifl, peat, tfcs, ldcover, legal, oilPerm, logPerm, minePerm, woodPerm
    // var dynamicMapServiceUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer',
    var dynamicMapServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/legends/MapServer',
        dynamicMapServiceUrlForest = 'http://gis-gfw.wri.org/arcgis/rest/services/forest_cover/MapServer',
        tropicalCarbonStocks = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/whrc_carbon/ImageServer',
        dynamicMapServiceUrlComm = 'http://gis-gfw.wri.org/arcgis/rest/services/commodities/MapServer',
        // rspoConcessions = 'http://gis-gfw.wri.org/arcgis/rest/services/protected_services/MapServer',
        globalLandCover = 'http://gis-gfw.wri.org/arcgis/rest/services/protected_services/MapServer',
        dynamicMapServiceUrlLand = 'http://gis-gfw.wri.org/arcgis/rest/services/land_use/MapServer',
        treeCoverGainUrl = 'http://gis-treecover.wri.org/arcgis/rest/services/ForestGain_2000_2012_map/MapServer',
        treeCoverGainImageUrl = 'http://gis-treecover.wri.org/arcgis/rest/services/ForestGain_2000_2012/ImageServer',
        gladAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/glad_alerts/ImageServer',
        // treeCoverLossUrl = 'http://50.18.182.188:6080/arcgis/rest/services/ForestCover_lossyear/ImageServer',
        treeCoverLossUrl = 'http://gis-treecover.wri.org/arcgis/rest/services/ForestCover_lossyear_density/ImageServer',
        // formaAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/commodities/FORMA50_2015/ImageServer',
        formaAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/forma_500/ImageServer',
        activeFiresUrl = 'http://gis-potico.wri.org/arcgis/rest/services/Fires/Global_Fires/MapServer',
        treeCoverDensityUrl = 'http://gis-treecover.wri.org/arcgis/rest/services/TreeCover2000/ImageServer',
        protectedAreasUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/cached/wdpa_protected_areas/MapServer',
        // protectedAreasHelperUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/conservation/wdpa_protected_areas/MapServer',
        mapOverlaysUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer',
        aggregateImageServerUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer',
        prodesUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/prodes/ImageServer',
        granChacoUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/cached/gran_chaco_deforestation/MapServer',
        // primaryForestUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/primary_forest_extent/ImageServer',
        customSuitabilityUrl = 'http://gis-potico.wri.org/arcgis/rest/services/suitabilitymapper/kpss_mosaic/ImageServer',
        millPointsUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/oilpalmmills/MapServer',
        biodiversityUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/conservation/MapServer',
        geometryServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer';
        // brazilBiomesLayer = 'http://gis-gfw.wri.org/arcgis/rest/services/country_data/country_data/MapServer';

    return {
        geometryServiceUrl: geometryServiceUrl,

        mapOptions: {
            basemap: 'gray',
            centerX: 4, //114,
            centerY: 5, //3,
            zoom: 3, //5,
            sliderPosition: 'top-right'
        },

        uploadForm: {
            title: 'Upload Shapefile or CSV',
            shapefileHeader: 'Shapefile Upload Instructions',
            csvHeader: 'CSV Upload Instructions',
            shapefileInstructions: [
                'Select a zip file(.zip) containing a shapefile(.shp,.dbf,.prj) from your local file system.',
                'The shapefile must be in Geographic Coordinate System (WGS84).',
                'The shapefile must not exceed 1 MB.'
            ],
            csvInstructions: 'Or, select a CSV from your local file system.  The CSV should contain a header row with columns for Name, Latitude, and Longitude.'
        },

        uploader: {
            portalUrl: 'http://www.arcgis.com/sharing/rest/content/features/generate',
            labelField: 'WRI_label',
            errors: {

            }
        },
        calendars: [
          {
            selectedDate: new window.Kalendae.moment('01/01/2015'),
            domId: 'gladCalendarStart',
            domClass: 'glad-calendar',
            method: 'changeGladStart'
          },
          {
            selectedDate: new window.Kalendae.moment(),
            domId: 'gladCalendarEnd',
            domClass: 'glad-calendar',
            method: 'changeGladEnd'
          }
        ],

        submitMessages: [
          {
            domId: 'storyName',
            domClass: 'submision-message',
            message: 'You must submit a name!'
          },
          {
            domId: 'storyCompany',
            domClass: 'submision-message',
            message: 'You must submit a company!'
          },
          {
            domId: 'storyPosition',
            domClass: 'submision-message',
            message: 'You must submit a position!'
          },
          {
            domId: 'storyEmail',
            domClass: 'submision-message',
            message: 'You must submit an email!'
          },
          {
            domId: 'storyData',
            domClass: 'submision-message',
            message: 'You must submit data with your story!'
          },
          {
            domId: 's3Error',
            domClass: 'submision-message',
            message: 'An error occurred during the data upload.'
          },
          {
            domId: 'layersRequestError',
            domClass: 'submision-message',
            message: 'An error occurred during the data upload to ArcGIS Online.'
          },
          {
            domId: 'submissionSuccess',
            domClass: 'submision-message',
            message: 'Success! Your data has been uploaded and our team has been notified of your contribution.'
          }
        ],

        tcdModal: {
          label: 'Adjust the minimum canopy density for tree cover and tree cover loss',
          densityValue: 30
        },

        coordinatesDialog: {
            coordinatesModalHeader: 'Enter Point Coordinates',
            coordinatesEnterButton: 'Enter',
            latitudePlaceholder: 'Latitude',
            longitudePlaceholder: 'Longitude',
            errors: {
                invalidLatitude: 'You did not enter a valid value for Latitude.',
                invalidLongitude: 'You did not enter a valid value for Longitude.'
            }
        },

        submissionDialog: {
            submissionModalHeader: 'Enter Point Coordinates',
            submissionEnterButton: 'Ok',
            submissionPlaceholder: 'Latitude',
            // longitudePlaceholder: 'Longitude',
            errors: {
                invalidSubmission: 'You did not enter a valid value for Latitude.'
                // invalidLongitude: 'You did not enter a valid value for Longitude.'
            }
        },

        // Layers which are not part of the Master Layer UI List Widget (Colored Categories Stripes across top of the map) go below

        overlays: {
            id: 'MapOverlaysLayer',
            url: mapOverlaysUrl,
            defaultLayers: [1, 5, 8, 11],
            infoTemplate: {
                content: '<table><tr><td>Name:</td><td>${NAME_1}</td></tr></table>' +
                    '<tr><td>Type:</td><td>${TYPE_1}</td></tr></table>'
            }
        },

        road: {
            layerId: 8
        },
        river: {
            layerId: 11
        },
        settle: {
            layerId: 1
        },
        poBounds: {
            layerId: 5
        },

        // The Following maps our layerIds to the WRI metadata API Ids

        metadataIds: {
          'forest-change-tree-cover-loss': 'tree_cover_loss',
          'forest-change-tree-cover-gain': 'tree_cover_gain',
          'forest-change-forma-alerts': 'forma',
          'forest-change-gran-chaco': 'gran_chaco_deforestation',
          'forest-change-nasa-active-fires': 'firms_active_fires',
          'forest-change-prodes-alerts': 'prodes',
          'forest-change-glad-alerts': 'umd_landsat_alerts',
          'forest-and-land-cover-tree-cover-density': 'tree_cover',
          'forest-and-land-cover-intact-forest-landscape': 'intact_forest_landscapes_change',
          'forest-and-land-cover-peat-lands': 'idn_peat_lands',
          'forest-and-land-cover-carbon-stocks': 'aboveground_biomass',
          'forest-and-land-cover-plantations': 'gfw_plantations',
          'forest-and-land-cover-brazil-biomes': 'bra_biomes',
          'forest-and-land-cover-primary-forest': 'idn_primary_forests', //cod_primary_forest
          'forest-and-land-cover-land-cover-global': 'global_landcover',
          'forest-and-land-cover-land-cover-indonesia': 'idn_land_cover_metadata',
          'forest-and-land-cover-land-cover-south-east-asia': 'khm_economic_land_concession',
          'forest-and-land-cover-legal-classifications': 'idn_conservation_areas',
          'land-use-oil-palm': 'gfw_oil_palm',
          'land-use-rspo-consessions': 'rspo_oil_palm',
          'land-use-logging': 'gfw_logging',
          'land-use-mining': 'gfw_mining',
          'land-use-wood-fiber-plantation': 'gfw_wood_fiber',
          'land-use-mill-points': 'rspo_mills',
          'land-use-gfw-mill-points': 'oil_palm_mills',
          'land-use-moratorium-areas': 'idn_forest_moratorium',
          'conservation-protected-areas': 'wdpa_protected_areas',
          'conservation-biodiversity-hotspots': 'biodiversity_hotspots',
          'suitability-soy-layer': 'tree_cover_loss',
          'suitability-custom-suitability-mapper': 'tree_cover_loss',
          'suitability-wri-standard-suitability': 'idn_suitability',
          'suitability-conservation-areas': 'idn_conservation_areas',
          'suitability-elevation': 'idn_elevation',
          'suitability-slope': 'idn_slope',
          'suitability-rainfall': 'idn_rainfall',
          'suitability-soil-drainage': 'idn_soil_drainage',
          'suitability-soil-depth': 'idn_soil_depth',
          'suitability-soil-acidity': 'idn_soil_acidity',
          'suitability-soil-type': 'idn_soil_type'

        },

        // The Following Layers are used by the Wizard

        customGraphicsLayer: {
            id: 'CustomFeatures',
            infoTemplate: {
                content: '<table><tr><td>Unique ID:</td><td>${WRI_ID:checkAvailable}</td></tr></table>'
            }
        },

        wizardGraphicsLayer: {
            id: 'WizardTempGraphics'
        },

        wizardPointGraphicsLayer: {
            id: 'WizardTempPointGraphics'
        },

        // Only Add One of these below that have the id WizardDynamicLayer
        // Only one layer but separate config makes easier to work with in other areas of application
        adminUnitsLayer: {
            id: 'WizardDynamicLayer',
            url: mapOverlaysUrl,
            whereField: 'NAME_0',
            layerId: 7,
            infoTemplate: {
                content: '<table><tr><td>Name:</td><td>${NAME_2}</td></tr></table>'
            }
        },

        certificationSchemeLayer: {
            id: 'WizardDynamicLayer',
            url: mapOverlaysUrl,
            whereField: 'CERT_SCHEME',
            layerId: 13,
            infoTemplate: {
                content: '<table><tr><td>Group:</td><td>${GROUP_NAME}</td></tr>' +
                    '<tr><td>Type:</td><td>${TYPE}</td></tr></table>'
            }
        },

        millPointsLayer: {
            id: 'WizardMillPointsLayer',
            url: millPointsUrl,
            layerId: 0,
            infoTemplate: {
                content: '<table><tr><td>Parent Company:</td><td>${Parent_Com}</td></tr>' +
                    '<tr><td>Mill Name:</td><td>${Mill_name}</td></tr></table>'
            }
        },

        // Info Template for this layer is immediately above this
        commercialEntitiesLayer: {
            id: 'WizardDynamicLayer',
            url: mapOverlaysUrl,
            whereField: 'TYPE',
            layerId: 13
        },

        // End Normal Layers not part of the Master Layer UI List
        // Keys Match list below which builds the Master Layer UI List
        // NOTE: If a item is specified in the layersUI below it needs to have a key defined here
        // If they are on the same layer, give them the same id and url and only add that layer to the map once
        // the toolsNode is for layers that have custom tools to work with them, it is the root dom node of the toolbox
        // If the layer is an image service layer that needs to pull a legend from a dynamic layer, look at
        // LayerController.refreshLegendWidget, it will need to add the config for the layer to the confItems array
        // This way it will know that when that layer is shown or hidden, refresh with the appropriate legendLayerId
        tcc: {
            id: 'TreeCoverChange'
        },
        gain: {
            id: 'Gain',
            url: treeCoverGainUrl,
            legendLayerId: 1
        },
        gainHelper: {
            id: 'GainHelper',
            url: treeCoverGainImageUrl
        },
        granChaco: {
            id: 'granChaco',
            url: granChacoUrl,
            defaultLayers: [0],
            toolsNode: 'guyra_toolbox'
        },
        loss: {
            id: 'Loss',
            url: treeCoverLossUrl,
            legendLayerId: 0,
            defaultRange: [1, 14],
            colormap: [
                [1, 219, 101, 152]
            ],
            toolsNode: 'treecover_change_toolbox'
        },
        forma: {
            id: 'FormaAlerts',
            url: formaAlertsUrl,
            legendLayerId: 3,
            defaultRange: [1, 19],
            colormap: [
                [1, 255, 0, 197]
            ],
            toolsNode: 'forma_toolbox'
        },
        prodes: {
            id: 'ProdesAlerts',
            url: prodesUrl,
            legendLayerId: 6,
            defaultRange: [1, 15],
            colormap: [
                [1, 255, 0, 197]
            ],
            toolsNode: 'prodes_toolbox'
        },
        fires: {
            id: 'ActiveFires',
            url: activeFiresUrl,
            defaultLayers: [0, 1, 2, 3],
            toolsNode: 'fires_toolbox',
            infoTemplate: {
                content: '<table><tr><td>Latitude: </td><td>${LATITUDE}</td></tr>' +
                    '<tr><td>Longitude: </td><td>${LONGITUDE}</td></tr>' +
                    '<tr><td>Brightness: </td><td>${BRIGHTNESS}</td></tr>' +
                    '<tr><td>Confidence: </td><td>${CONFIDENCE}</td></tr>' +
                    '<tr><td>Acquisition Date: </td><td>${ACQ_DATE}</td></tr>' +
                    '<tr><td>Acquisition Time: </td><td>${ACQ_TIME}</td></tr></table>'
            }
        },
        gladAlerts: {
            id: 'gladAlerts',
            url: gladAlertsUrl,
            legendLayerId: 7,
            defaultStartRange: [0, 1, 1, 365, 365, 366], //[0, 1, 1, 366],
            defaultEndRange: [0, 1, 1, 365, 365, 366], //[0, 20, 20, 366],
            colormap: [
              [1, 255, 102, 153]
            ],
            outputValues: [0, 1, 0],
            // startDate: new window.Kalendae.moment('01/01/2015'),
            // endDate: new window.Kalendae.moment()//,
            toolsNode: 'glad_toolbox'
        },
        tcd: {
            id: 'TreeCoverDensity',
            url: treeCoverDensityUrl,
            legendLayerId: 2,
            // The following are options needed for the rendering rule
            colormap: [[50, 14, 204, 14]],
            outputValue: [50]
        },
        primForest: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            infoTemplate: {
                content: '<div>Area: ${area_ha:NumberFormat(places:0)}</div>'
            },
            layerId: 8
            // legendLayerId: 33
        },

        suit: {
            id: 'CustomSuitability',
            url: customSuitabilityUrl,
            legendLayerId: 4,
            toolsNode: 'suitability_toolbox'
        },

        biomes: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 9,
            infoTemplate: {
                content: '<div>Area: ${area_ha:NumberFormat(places:0)}</div>'
            }
        },
        byType: {
            id: 'byType',
            url: dynamicMapServiceUrlForest,
            layerId: 5,
            defaultLayers: [5]
        },
        bySpecies: {
            id: 'bySpecies',
            url: dynamicMapServiceUrlForest,
            defaultLayers: [8],
            layerId: 8,
            infoTemplate: {
                content: '<table><tr><td>type: </td><td>${type}</td></tr>' +
                    '<tr><td>country: </td><td>${country}</td></tr>' +
                    '<tr><td>percent: </td><td>${percent}</td></tr>' +
                    '<tr><td>type_text: </td><td>${type_text}</td></tr>' +
                    '<tr><td>area_ha: </td><td>${area_ha}</td></tr>' +
                    '<tr><td>spec_org: </td><td>${spec_org}</td></tr></table>'
            }
        },
        /***** THE FOLLOWING ARE ALL PART OF DIFFERENT DYNAMIC LAYERS UNDER FORESTCOVER *****/
        ifl: {
            id: 'forestCover_forestCover',
            url: dynamicMapServiceUrlForest,
            layerId: 0
        },
        peat: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 22
        },
        tfcs: {
            id: 'forestCover_tropical',
            legendLayerId: 8,
            url: tropicalCarbonStocks//, //dynamicMapServiceUrlForest,
            //layerId: 1
        },
        ldcover: {
            id: 'forestCover_landCover',
            url: globalLandCover,
            layerId: 4
        },
        ldcoverIndo: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 12
        },
        ldcoverAsia: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 10
        },
        legal: {
            id: 'forestCover_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 13
        },
        /***** THE PREVIOUS ARE ALL PART OF DIFFERENT DYNAMIC LAYERS UNDER FORESTCOVER *****/
        /***** THE FOLLOWING ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTUSE *****/
        oilPerm: {
            id: 'forestUse_landUse',
            url: dynamicMapServiceUrlLand,
            layerId: 1,
            infoTemplate: {
                content: '<table><tr><td>Concession Type: </td><td>${Concession Type}</td></tr>' +
                    '<tr><td>Country: </td><td>${Country}</td></tr>' +
                    '<tr><td>Group: </td><td>${Group:checkAvailable}</td></tr>' +
                    '<tr><td>Certification Status: </td><td>${Certification Status:checkAvailable}</td></tr>' +
                    '<tr><td>GIS Calculated Area (ha): </td><td>${GIS Calculated Area (ha):NumberFormat}</td></tr>' +
                    '<tr><td>Source: </td><td>${Source:checkAvailable}</td></tr></table>'
            }
        },
        rspoPerm: {
            id: 'forestCover_landCover',
            url: globalLandCover,
            layerId: 0,
            infoTemplate: {
                content: '<table>' +
                    '<tr><td>Concession Type: </td><td>${Concession Type:checkAvailable}</td></tr>' +
                    '<tr><td>Country:</td><td>${Country:checkAvailable}</td></tr>' +
                    '<tr><td>Group:</td><td>${group_comp:checkAvailable}</td></tr>' +
                    '<tr><td>Certification Status:</td><td>${cert_schem:checkAvailable}</td></tr>' +
                    '<tr><td>GIS Calculated Area (ha):</td><td>${GIS Calculated Area (ha):NumberFormat}</td></tr>' +
                    '<tr><td>Certificate ID:</td><td>${certificat:checkAvailable}</td></tr>' +
                    '<tr><td>Certificate Issue Date:</td><td>${issued:checkAvailable}</td></tr>' +
                    '<tr><td>Certificate Expiry Date:</td><td>${expired:checkAvailable}</td></tr>' +
                    '<tr><td>Mill name:</td><td>${mill:checkAvailable}</td></tr>' +
                    '<tr><td>Mill location:</td><td>${location:checkAvailable}</td></tr>' +
                    '<tr><td>Mill capacity (t/hour):</td><td>${capacity:NumberFormat}</td></tr>' +
                    '<tr><td>Certified CPO (mt):</td><td>${cpo:NumberFormat}</td></tr>' +
                    '<tr><td>Certified PK (mt):</td><td>${pk:NumberFormat}</td></tr>' +
                    '<tr><td>Estate Suppliers:</td><td>${estate:checkAvailable}</td></tr>' +
                    '<tr><td>Estate Area (ha):</td><td>${estate_1:NumberFormat}</td></tr>' +
                    '<tr><td>Outgrower Area (ha):</td><td>${outgrower:NumberFormat}</td></tr>' +
                    '<tr><td>Scheme Smallholder area (ha):</td><td>${sh:NumberFormat}</td></tr>' +
                    '<tr><td>Source: </td><td>${Source:checkAvailable}</td></tr>' +
                    '</table>'
            }
        },
        logPerm: {
            id: 'forestUse_landUse',
            url: dynamicMapServiceUrlLand,
            layerId: 0
        },
        minePerm: {
            id: 'forestUse_landUse',
            url: dynamicMapServiceUrlLand,
            layerId: 2
        },
        woodPerm: {
            id: 'forestUse_landUse',
            url: dynamicMapServiceUrlLand,
            layerId: 3
        },
        moratorium: {
            id: 'forestUse_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 7
        },
        /***** THE PREVIOUS ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER FORESTUSE *****/

        // This layer is also under forest use but has its own service
        mill: {
            id: 'forestUse_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 27,
            query: 'certificat = \'RSPO Certified\'',
            infoTemplate: {
                content: '<table><tr><td>Parent Company:</td><td>${group_name}</td></tr>' +
                    '<tr><td>Mill Name:</td><td>${mill_name_}</td></tr>' +
                    '<tr><td>Certification Status:</td><td>${certificat}</td></tr></table>'
            }
        },
        gfwMill: {
            id: 'forestUse_commodities',
            url: dynamicMapServiceUrlComm,
            layerId: 27,
            query: 'certificat = \'None\'',
            infoTemplate: {
                content: '<table><tr><td>Parent Company:</td><td>${group_name}</td></tr>' +
                    '<tr><td>Mill Name:</td><td>${mill_name_}</td></tr>' +
                    '<tr><td>Certification Status:</td><td>${certificat}</td></tr></table>'
            }
        },
        pal: {
            id: 'ProtectedAreas',
            url: protectedAreasUrl,
            infoTemplate: {
                content: '<table><tr><td>Local Name:</td><td>${Local Name}</td></tr>' +
                    '<tr><td>Local Designation:</td><td>${Local Designation}</td></tr>' +
                    '<tr><td>WDPA ID:</td><td>${WDPA ID}</td></tr>' +
                    '<tr><td>Source:</td><td>${Source:checkAvailable}</td></tr></table>'
            }
        },

        biodiversity: {
            id: 'Biodiversity',
            url: globalLandCover,
            layerId: 2
        },

        palHelper: {
            id: 'ProtectedAreasHelper',
            url: protectedAreasUrl,
            layerId: 0
        },

        // Definition for shareable feature init
        concession: {
            url: dynamicMapServiceUrl
        },

        /***** THE FOLLOWING ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER AGRICULTURAL SUITABILITY *****/

        responsibleSoy: { // Oil Palm Suitability Default
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 28
        },
        opsd: { // Oil Palm Suitability Default
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 23
        },
        cons: { //Conservation Areas
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 14
        },
        elev: { // Elevation
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 19
        },
        slope: { // Slope
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 20
        },
        rain: { // Rainfall
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 21
        },
        soilDr: { // Soil Drainage
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 16
        },
        soilDe: { // Soil Depth
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 17
        },
        soilAc: { // Soil Acidity
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 18
        },
        soilTy: { // Soil Type
            id: 'productionSuitability',
            url: dynamicMapServiceUrlComm,
            layerId: 15
        },

        /***** THE PREVIOUS ARE ALL PART OF THE SAME DYNAMIC LAYER UNDER AGRICULTURAL SUITABILITY *****/

        /***
      This does not map to any UI elements, it is a hidden layer whose
      sole purpose is showing legends for ImageService layers
    ***/
        legendLayer: {
            id: 'LegendLayer',
            url: dynamicMapServiceUrl
        },

        // BELOW IS the data structure that will build the layer list widget
        // The Keys below match the keys above and tie these UI elements to the correct layer config
        // If the layer does nothing or is none, then no key needs to be provided above
        // Required properties are key, title, subtitle, filter, and type

        layersUI: [{
                id: 'tcc',
                title: 'Tree Cover Change',
                subtitle: '',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'none',
                children: [{
                    id: 'loss',
                    title: 'Loss',
                    subtitle: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
                    filter: 'forest-change',
                    type: 'check',
                    layerType: 'tiled',
                    infoDivClass: 'forest-change-tree-cover-loss'
                }, {
                    id: 'gain',
                    title: 'Gain',
                    subtitle: '(12 years, 30m, global, Hansen/UMD/Google/USGS/NASA)',
                    filter: 'forest-change',
                    type: 'check',
                    layerType: 'image',
                    infoDivClass: 'forest-change-tree-cover-gain'
                }]//,
                // infoDivClass: 'forest-change-tree-cover-change'
            }, {
                id: 'prodes',
                title: 'Prodes deforestation',
                subtitle: '(annual, 30m, Brazilian Amazon, INPE)',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'image',
                forceUnderline: true,
                infoDivClass: 'forest-change-prodes-alerts'
            }, {
                id: 'fires',
                title: 'Active Fires',
                subtitle: '(past 7 days, 1km, global; NASA)',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'dynamic',
                forceUnderline: true,
                infoDivClass: 'forest-change-nasa-active-fires'
            }, {
                id: 'granChaco',
                title: 'Gran Chaco deforestation (Guyra Paraguay)',
                subtitle: '(monthly, 30m, Gran Chaco, Guyra)',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'dynamic',
                forceUnderline: true,
                visible: true,
                infoDivClass: 'forest-change-gran-chaco',
                endChild: true
            }, {
                kids: ['gladAlerts', 'forma'],
                id: 'treeCoverLossAlerts',
                title: 'Tree Cover Loss Alerts',
                subtitle: '(near real-time)',
                filter: 'forest-change',
                layerType: 'dynamic'
            }, {
                id: 'gladAlerts',
                title: 'GLAD alerts',
                subtitle: '(weekly, 30m, select countries, UMD/GLAD)',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'image',
                visible: true,
                infoDivClass: 'forest-change-glad-alerts',
                parent: 'treeCoverLossAlerts',
                endChild: false
            }, {
                id: 'forma',
                title: 'FORMA Alerts',
                subtitle: '(monthly, 500m, humid tropics)',
                filter: 'forest-change',
                type: 'radio',
                layerType: 'image',
                forceUnderline: true,
                visible: true,
                infoDivClass: 'forest-change-forma-alerts',
                parent: 'treeCoverLossAlerts',
                endChild: false
            }, {
                id: 'tcd',
                title: 'Tree Cover Density',
                subtitle: '(year 2000, 30m global, Hansen/UMD/Google/USGS/NASA)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'image',
                infoDivClass: 'forest-and-land-cover-tree-cover-density'
            }, {
                id: 'ifl',
                title: 'Intact Forest Landscapes',
                subtitle: '(year 2013, 30m global)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-intact-forest-landscape'
            }, {
                id: 'peat',
                title: 'Peat Lands',
                subtitle: '(year 2011, Indonesia)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-peat-lands'
            }, {
                id: 'tfcs',
                title: 'Aboveground Biomass Density', //'Tropical Carbon Stocks'
                subtitle: '(early 2000s, 1km, tropics)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-carbon-stocks'
            }, {
                id: 'biomes',
                title: 'Brazil Biomes',
                subtitle: '(year 2004, Brazil)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-brazil-biomes'
            }, {
                kids: ['byType', 'bySpecies'],
                id: 'plantations',
                title: 'Tree plantations',
                filter: 'forest-cover',
                type: 'check',
                layerType: 'dynamic'
            }, {
                id: 'byType',
                title: 'by type',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                parent: 'plantations',
                visible: true,
                infoDivClass: 'forest-and-land-cover-plantations'
            }, {
                id: 'bySpecies',
                title: 'by species',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                parent: 'plantations',
                visible: true,
                infoDivClass: 'forest-and-land-cover-plantations'
            }, {
                id: 'primForest',
                title: 'Primary Forests',
                subtitle: '(2000, 30m, Indonesia)',
                filter: 'forest-cover',
                type: 'radio',
                forceUnderline: true,
                layerType: 'image',
                infoDivClass: 'forest-and-land-cover-primary-forest'
            }, {
                id: 'ldcover',
                title: 'Land Cover',
                subtitle: '(mid 2000s, global)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-land-cover-global'
            }, {
                id: 'ldcoverIndo',
                title: 'Land Cover Indonesia',
                subtitle: '(mid 2000s, Indonesia)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-land-cover-indonesia'
            }, {
                id: 'ldcoverAsia',
                title: 'Land Cover Southeast Asia',
                subtitle: '(mid 2000s, Southeast Asia)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-land-cover-south-east-asia'
            }, {
                id: 'legal',
                title: 'Legal Classifications',
                subtitle: '(year 2010, select countries)',
                filter: 'forest-cover',
                type: 'radio',
                layerType: 'dynamic',
                infoDivClass: 'forest-and-land-cover-legal-classifications'
            }, {
                kids: ['oilPerm', 'rspoPerm', 'woodPerm', 'minePerm', 'logPerm'],
                id: 'newConcessions',
                title: 'Concessions',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic' //,
                //infoDivClass: 'new-concessionss' //Add this class to give this group an info icon
            }, {
                id: 'oilPerm',
                title: 'Oil Palm',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-oil-palm',
                parent: 'newConcessions'
            }, {
                id: 'rspoPerm',
                title: 'RSPO Oil Palm',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-rspo-consessions',
                parent: 'newConcessions'
            }, {
                id: 'logPerm',
                title: 'Wood Fiber',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-wood-fiber-plantation',
                parent: 'newConcessions'
            }, {
                id: 'minePerm',
                title: 'Mining',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-mining',
                parent: 'newConcessions'
            }, {
                id: 'woodPerm',
                title: 'Managed Forests',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-logging',
                parent: 'newConcessions',
                endChild: true
            }, {
                kids: ['mill', 'gfwMill'],
                id: 'newInfrastructure',
                title: 'Infrastructure',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic'
            }, {
                id: 'mill',
                title: 'RSPO Palm Oil Mills',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-mill-points',
                parent: 'newInfrastructure'
            }, {
                id: 'gfwMill',
                title: 'Palm Oil Mills',
                subtitle: '(varies, select countries)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-gfw-mill-points',
                parent: 'newInfrastructure',
                endChild: true
            }, {
                kids: ['moratorium'],
                id: 'newOther',
                title: 'Other',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic'
            }, {
                id: 'moratorium',
                title: 'Indonesia Moratorium Areas',
                subtitle: '(IMM V7/V6, 2014, Indonesia)',
                filter: 'forest-use',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'land-use-moratorium-areas',
                parent: 'newOther',
                endChild: true
                // }, {
                //     kids: ['mill2', 'mill3'],
                //     id: 'newConcessions',
                //     title: 'New Concessions',
                //     filter: 'forest-use',
                //     type: 'check',
                //     layerType: 'dynamic' //,
                //     //infoDivClass: 'new-concessionss' //Add this class to give this group an info icon
                // }, {
                //     id: 'mill2',
                //     title: 'RSPO Mills',
                //     subtitle: '(varies, select countries)',
                //     filter: 'forest-use',
                //     type: 'check',
                //     layerType: 'dynamic',
                //     infoDivClass: 'land-use-mill-points',
                //     parent: 'newConcessions'
                // }, {
                //     id: 'mill3',
                //     title: 'RSPO Mills',
                //     subtitle: '(varies, select countries)',
                //     filter: 'forest-use',
                //     type: 'check',
                //     layerType: 'dynamic',
                //     infoDivClass: 'land-use-mill-points',
                //     parent: 'newConcessions'
            }, {
                id: 'pal',
                title: 'Protected Areas',
                subtitle: '(varies, global)',
                filter: 'conservation',
                type: 'check',
                layerType: 'tiled',
                infoDivClass: 'conservation-protected-areas'
            }, {
                id: 'biodiversity',
                title: 'Biodiversity Hotspots',
                subtitle: '(year 2011, global)',
                filter: 'conservation',
                type: 'check',
                layerType: 'dynamic',
                infoDivClass: 'conservation-biodiversity-hotspots'
            }, {
                kids: ['responsibleSoy'],
                id: 'soyBean',
                title: 'Soybean',
                filter: 'agro-suitability',
                type: 'check',
                layerType: 'dynamic'
            }, {
                id: 'responsibleSoy',
                title: 'RTRS Guides for Responsible Soy Expansion',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                layerType: 'image',
                parent: 'soyBean',
                infoDivClass: 'suitability-soy-layer'
            }, {
                kids: ['suit','opsd','cons','elev','slope','rain','soilDr','soilDe','soilAc','soilTy'],
                id: 'oilPalm',
                title: 'Oil Palm',
                filter: 'agro-suitability',
                type: 'check',
                layerType: 'dynamic'
            }, {
                id: 'suit',
                title: 'Custom Suitability Map',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'check',
                parent: 'oilPalm',
                layerType: 'image',
                infoDivClass: 'suitability-custom-suitability-mapper'
            }, {
                id: 'opsd',
                title: 'WRI Suitability Standard - Oil Palm',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-wri-standard-suitability'
            }, {
                id: 'cons',
                title: 'Conservation Areas',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-conservation-areas'
            }, {
                id: 'elev',
                title: 'Elevation',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-elevation'
            }, {
                id: 'slope',
                title: 'Slope',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-slope'
            }, {
                id: 'rain',
                title: 'Rainfall',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-rainfall'
            }, {
                id: 'soilDr',
                title: 'Soil Drainage',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-soil-drainage'
            }, {
                id: 'soilDe',
                title: 'Soil Depth',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-soil-depth'
            }, {
                id: 'soilAc',
                title: 'Soil Acidity',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-soil-acidity'
            }, {
                id: 'soilTy',
                title: 'Soil Type',
                subtitle: '',
                filter: 'agro-suitability',
                type: 'radio',
                parent: 'oilPalm',
                layerType: 'dynamic',
                infoDivClass: 'suitability-soil-type'
            }
            // , {
            //     id: 'none_agro',
            //     title: 'None',
            //     subtitle: '',
            //     filter: 'agro-suitability',
            //     type: 'radio',
            //     layerType: 'none'
            // }
        ],

        // Miscellaneous Settings
        treeCoverLossSlider: {
            baseYear: 2000,
            numYears: 12
        },

        // Values below are default suitable values for the particular raster
        customSuitabilityDefaults: {
            computeBinaryRaster: [
                // Land Cover
                {
                    id: 0,
                    values: '2,3,5,8,9,11,15,17,18',
                    classCount: 32,
                    operator: 'in',
                    name: 'LCInpR'
                },
                // Peat
                {
                    id: 1,
                    values: '0',
                    classCount: 32,
                    operator: 'in',
                    name: 'PeatInpR'
                },
                // Slope
                {
                    id: 2,
                    values: '30',
                    operator: 'lt',
                    name: 'SlopeInpR'
                },
                // Conservation 500 - 5000
                {
                    id: 3,
                    values: '1000',
                    operator: 'gt',
                    name: 'ConsInpR'
                },
                // Water
                {
                    id: 4,
                    values: '100',
                    operator: 'gt',
                    name: 'WaterInpR'
                },
                // Elevation
                {
                    id: 5,
                    values: '1000',
                    operator: 'lt',
                    name: 'ElevInpR'
                },
                // Rainfall
                {
                    id: 6,
                    values: '1500,6000',
                    operator: 'between',
                    name: 'RainfallInpR'
                },
                // Soil Drain
                {
                    id: 7,
                    values: '2,3,4,99',
                    classCount: 32,
                    operator: 'in',
                    name: 'SDrainInpR'
                },
                // Soil Depth
                {
                    id: 8,
                    values: '3,4,5,6,7,99',
                    classCount: 32,
                    operator: 'in',
                    name: 'SDepthInpR'
                },
                // Soil Acidity
                {
                    id: 9,
                    values: '1,2,3,4,5,6,7,99',
                    classCount: 32,
                    operator: 'in',
                    name: 'SAcidInpR'
                },
                // Soil Type
                {
                    id: 10,
                    values: '0,1,2,3,5,6,7,8,9',
                    classCount: 32,
                    operator: 'in',
                    name: 'STypeInpR'
                }
            ]
        },

        checkboxItems: [{
            node: 'shrub-check',
            name: 'landcover-checkbox',
            value: '2',
            checked: true
        }, {
            node: 'bareland-check',
            name: 'landcover-checkbox',
            value: '3',
            checked: true
        }, {
            node: 'secondary-forest-check',
            name: 'landcover-checkbox',
            value: '4',
            checked: false
        }, {
            node: 'dryland-agro-check',
            name: 'landcover-checkbox',
            value: '5',
            checked: true
        }, {
            node: 'water-check',
            name: 'landcover-checkbox',
            value: '6',
            checked: false
        }, {
            node: 'mining-check',
            name: 'landcover-checkbox',
            value: '7',
            checked: false
        }, {
            node: 'plantation-forest-check',
            name: 'landcover-checkbox',
            value: '8',
            checked: true
        }, {
            node: 'estate-crop-check',
            name: 'landcover-checkbox',
            value: '9',
            checked: true
        }, {
            node: 'swamp-shrub-check',
            name: 'landcover-checkbox',
            value: '10',
            checked: false
        }, {
            node: 'primary-swamp-check',
            name: 'landcover-checkbox',
            value: '12',
            checked: false
        }, {
            node: 'secondary-swamp-check',
            name: 'landcover-checkbox',
            value: '13',
            checked: false
        }, {
            node: 'settlement-check',
            name: 'landcover-checkbox',
            value: '14',
            checked: false
        }, {
            node: 'grassland-check',
            name: 'landcover-checkbox',
            value: '15',
            checked: true
        }, {
            node: 'secondary-mangrove-check',
            name: 'landcover-checkbox',
            value: '16',
            checked: false
        }, {
            node: 'dryland-check',
            name: 'landcover-checkbox',
            value: '17',
            checked: true
        }, {
            node: 'rice-check',
            name: 'landcover-checkbox',
            value: '18',
            checked: true
        }, {
            node: 'fish-check',
            name: 'landcover-checkbox',
            value: '19',
            checked: false
        }, {
            node: 'transmigration-check',
            name: 'landcover-checkbox',
            value: '20',
            checked: false
        }, {
            node: 'swamp-check',
            name: 'landcover-checkbox',
            value: '21',
            checked: false
        }, {
            node: 'primary-mangrove-check',
            name: 'landcover-checkbox',
            value: '22',
            checked: false
        }, {
            node: 'airport-check',
            name: 'landcover-checkbox',
            value: '23',
            checked: false
        }, {
            node: 'inceptisol-check',
            name: 'soil-type-checkbox',
            value: '1',
            checked: true
        }, {
            node: 'oxisol-check',
            name: 'soil-type-checkbox',
            value: '7',
            checked: true
        }, {
            node: 'alfisol-check',
            name: 'soil-type-checkbox',
            value: '5',
            checked: true
        }, {
            node: 'ultisol-check',
            name: 'soil-type-checkbox',
            value: '2',
            checked: true
        }, {
            node: 'spodosol-check',
            name: 'soil-type-checkbox',
            value: '8',
            checked: true
        }, {
            node: 'entisol-check',
            name: 'soil-type-checkbox',
            value: '3',
            checked: true
        }, {
            node: 'histosol-check',
            name: 'soil-type-checkbox',
            value: '4',
            checked: false
        }, {
            node: 'mollisol-check',
            name: 'soil-type-checkbox',
            value: '9',
            checked: true
        }, {
            node: 'rock-check',
            name: 'soil-type-checkbox',
            value: '10',
            checked: false
        }],

        suitabilitySliderTooltips: {
            'peat': {
                0: '0 cm',
                1: 'Less than 50 cm',
                2: '50 - 100 cm',
                3: '100- 200 cm' //,
                // 4: '200+ cm'//, // Was 200 - 400
                // 5: '400 - 800 cm',
                // 6: '800 - 1,200 cm'
            },
            'rainfall': {
                'label': 'mm/yr'
            },
            'drainage': {
                1: 'very poor',
                2: 'poor, imperfect',
                3: 'well, moderately well',
                4: 'excessive, slightly excessive'
            },
            'depth': {
                1: 'none, very shallow (0-10 cm)',
                2: 'shallow (11-25 cm)',
                3: 'mod shallow (26-50 cm)',
                4: 'mod deep (51-75 cm)',
                5: 'deep (76-100 cm)',
                6: 'very deep (101-150 cm)',
                7: 'extremely deep (> 150 cm)'
            },
            'acidity': {
                1: 'excessively acid (< 4.0)',
                2: 'extremely acid (4.0 - 4.5)',
                3: 'very strongly acid (4.6 - 5.0)',
                4: 'strongly acid (5.1 - 5.5)',
                5: 'moderately acid (5.6 - 6.0)',
                6: 'slightly acid (6.1 - 6.5)',
                7: 'neutral (6.6 - 7.3)',
                8: 'slightly alkaline (7.4 - 7.8)'
            },
            'treeCover': {
                0: '2001',
                1: '2002',
                2: '2003',
                3: '2004',
                4: '2005',
                5: '2006',
                6: '2007',
                7: '2008',
                8: '2009',
                9: '2010',
                10: '2011',
                11: '2012'
            }
        },

        firesConfidenceDialog: {
            title: 'High Confidence Fires',
            text: 'GFW employs a recommendation for detecting forest clearing fires (described in Morton and Defries, 2008), identifying fires with a Brightness value greater than or equal to 330 Kelvin and a Confidence value greater than or equal to 30% to indicate fires that have a higher confidence for being forest-clearing fires. Low confidence fires are lower intensity fires that could either be from non-forest-clearing fire activity (clearing fields or grass burning), or could be older fires that have decreased in intensity (smoldering rather than flaming fires). The use of this classification establishes a higher standard for fire detection than using all fire alerts equally.'
        },

        suitabilityExportDialog: {
            title: 'Export Suitability Settings and GeoTiff',
            instruction: 'The resolution downloaded for the Suitability Map is based on your current zoom extent. For a higher resolution download, zoom in closer to your area of interest.'
        },

        // Simple Legend configs
        simpleLegends: {

            // Concessions
            concessions: {
                url: mapOverlaysUrl + '/legend?f=json',
                parentId: 'legend-content',
                title: 'Concessions',
                id: 'concessions-legend',
                layers: [{
                    id: 13,
                }]
            },

            // Overlays
            road: {
                url: mapOverlaysUrl + '/legend?f=json',
                parentId: 'legend-content',
                id: 'roads-legend',
                title: 'Roads',
                layers: [{
                    id: 9,
                    labels: ['Primary']
                }, {
                    id: 10,
                    labels: ['Secondary']
                }]
            },

            settle: {
                url: mapOverlaysUrl + '/legend?f=json',
                parentId: 'legend-content',
                id: 'settle-legend',
                title: 'Settlements',
                layers: [{
                    id: 2
                }, {
                    id: 3,
                    labels: ['Cities and Towns']
                }]
            },

            poBounds: {
                url: mapOverlaysUrl + '/legend?f=json',
                parentId: 'legend-content',
                id: 'po-bounds-legend',
                title: 'Political Boundaries',
                layers: [{
                    id: 6,
                    labels: ['Admin Level 1']
                }, {
                    id: 7,
                    labels: ['Admin Level 2']
                }]
            }

        }

    };

});

define('map/Symbols',[
	'esri/Color',
	'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol'
], function (Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol) {
	'use strict';

	var Symbols = {

		/**
		* Polygon Symbol Used for Custom Drawn Polygons or Uploaded Polygons
		*/
		getPolygonSymbol: function () {
			return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
        new Color([103,200,255,0.0]));
		},

		/**
		* Point Symbol Used for Uploaded Points
		*/
		getPointSymbol: function () {
			return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
    		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]), 1),
    		new Color([0,0,0,0.25]));
		},

		/**
    * Cyan Colored Polygon Symbol for Highlighted or Active Features
    */
		getHighlightPolygonSymbol: function () {
      return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255]), 2),
        new Color([103,200,255,0.0]));
		},

    /**
    * Cyan Colored Point Symbol for Highlighted or Active Features
    */
    getHighlightPointSymbol: function () {
      return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,255,255]), 1),
        new Color([0,0,0,0.25]));
    }

	};

	return Symbols;

});

define('utils/assert',[], function () {
  'use strict';

  /**
  * Simple assertion function to validate some condition or throw an error
  * @param condition {boolean} This condition is an expression that must evaluate to a boolean
  */
  return function (condition, message) {
    if (condition) return;
    throw new Error(['Assertion Error:', message].join(' '));
  };

});

define('utils/GeoHelper',[
  "map/config",
  "map/Symbols",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/SpatialReference",
  "esri/tasks/GeometryService",
  "esri/geometry/webMercatorUtils",
  "dojo/Deferred",
  "dojo/_base/array",
  "utils/assert"
], function (MapConfig, Symbols, Units, Graphic, Point, Circle, SpatialReference, GeometryService, webMercatorUtils, Deferred, arrayUtils, assert) {

  var geometryService,
      spatialReference;

	return {

    getSpatialReference: function () {
      return spatialReference = spatialReference || new SpatialReference(102100);
    },

    generatePointGraphicFromGeometric: function (longitude, latitude, attributes) {
      return new Graphic(
        webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude)),
        Symbols.getPointSymbol(),
        attributes
      );
    },

		preparePointAsPolygon: function (pointFeature, radius) {
			var circle = new Circle(new Point(pointFeature.geometry), {
            "radius": radius || 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, Symbols.getPolygonSymbol(), pointFeature.attributes);
		},

    applySelectionSymbolToFeature: function (feature) {
      var symbol = feature.geometry.type === 'point' ?
        Symbols.getHighlightPointSymbol() :
        Symbols.getHighlightPolygonSymbol();

      return new Graphic(feature.geometry, symbol, feature.attributes);
    },

    zoomToFeature: function (feature) {
      if (feature.geometry.x) {
        app.map.centerAndZoom(feature.geometry, 9);
      } else if (feature.geometry.center) {
        app.map.centerAndZoom(feature.geometry.center, 9);
      } else {
        app.map.setExtent(feature.geometry.getExtent(), true);
      }
    },

    /**
    * Return the next highest unique id, using WRI_ID as the unique id field
    */
    nextCustomFeatureId: function () {
      var graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id),
          graphics = graphicsLayer.graphics,
          length = graphics.length,
          next = 0,
          index,
          temp;

      for (index = 0; index < length; index++) {
        temp = parseInt(graphics[index].attributes.WRI_ID);
        if (!isNaN(temp)) {
          next = Math.max(next, temp);
        }
      }
      return (next + 1);
    },

    convertGeometryToGeometric: function(geometry) {
      var geometryArray = [],
          newRings = [],
          lngLat,
          point,
          self = this;

      // Helper function to determine if the coordinate is already in the array
      // This signifies the completion of a ring and means I need to reset the newRings
      // and start adding coordinates to the new newRings array
      function sameCoords(arr, coords) {
          var result = false;
          arrayUtils.forEach(arr, function(item) {
              if (item[0] === coords[0] && item[1] === coords[1]) {
                  result = true;
              }
          });
          return result;
      }

      arrayUtils.forEach(geometry.rings, function(ringers) {
          arrayUtils.forEach(ringers, function(ring) {
              point = new Point(ring, self.getSpatialReference());
              lngLat = webMercatorUtils.xyToLngLat(point.x, point.y);
              if (sameCoords(newRings, lngLat)) {
                  newRings.push(lngLat);
                  geometryArray.push(newRings);
                  newRings = [];
              } else {
                  newRings.push(lngLat);
              }
          });
      });

      return {
          geom: geometryArray.length > 1 ? geometryArray : geometryArray[0],
          type: geometryArray.length > 1 ? 'MultiPolygon' : 'Polygon'
      };
    },

    union: function (polygons) {
      if (Object.prototype.toString.call(polygons) !== '[object Array]') {
        throw new Error('Method expects polygons paramter to be of type Array');
      }

      var deferred = new Deferred(),
          geometryService = geometryService || new GeometryService(MapConfig.geometryServiceUrl);

      if (polygons.length === 1) {
        deferred.resolve(polygons[0]);
      } else {
        geometryService.union(polygons, deferred.resolve, deferred.resolve);
      }
      return deferred;
    },

    /**
    * Remove Graphic from graphics layer with a given OBJECTID
    * @param {string} layerId - Id of the layer we want to remove graphic from
    * @param {string} field - Field we will use for matching the graphic we want to remove
    * @param {string} value - Value of the field in the graphic we want to remove
    */
    removeGraphicByField: function (layerId, field, value) {
      assert(layerId && field && value, "Invalid Parameters for 'GeoHelper.removeGraphicByField'");

      var layer = app.map.getLayer(layerId);

      if (layer) {
        arrayUtils.some(layer.graphics, function (graphic) {
          if (graphic.attributes[field] === value) {
            layer.remove(graphic);
            return true;
          }
        });
      }

    }

	};

});

/**
 * @license
 * lodash 3.8.0 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./lodash.js`
 */
;(function(){function n(n,t){if(n!==t){var r=n===n,e=t===t;if(n>t||!r||n===w&&e)return 1;if(n<t||!e||t===w&&r)return-1}return 0}function t(n,t,r){for(var e=n.length,u=r?e:-1;r?u--:++u<e;)if(t(n[u],u,n))return u;return-1}function r(n,t,r){if(t!==t)return p(n,r);r-=1;for(var e=n.length;++r<e;)if(n[r]===t)return r;return-1}function e(n){return typeof n=="function"||false}function u(n){return typeof n=="string"?n:null==n?"":n+""}function o(n){return n.charCodeAt(0)}function i(n,t){for(var r=-1,e=n.length;++r<e&&-1<t.indexOf(n.charAt(r)););
return r}function f(n,t){for(var r=n.length;r--&&-1<t.indexOf(n.charAt(r)););return r}function a(t,r){return n(t.a,r.a)||t.b-r.b}function c(n){return $n[n]}function l(n){return Ln[n]}function s(n){return"\\"+Mn[n]}function p(n,t,r){var e=n.length;for(t+=r?0:-1;r?t--:++t<e;){var u=n[t];if(u!==u)return t}return-1}function h(n){return!!n&&typeof n=="object"}function _(n){return 160>=n&&9<=n&&13>=n||32==n||160==n||5760==n||6158==n||8192<=n&&(8202>=n||8232==n||8233==n||8239==n||8287==n||12288==n||65279==n);

}function v(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;)n[r]===t&&(n[r]=z,o[++u]=r);return o}function g(n){for(var t=-1,r=n.length;++t<r&&_(n.charCodeAt(t)););return t}function y(n){for(var t=n.length;t--&&_(n.charCodeAt(t)););return t}function d(n){return zn[n]}function m(_){function $n(n){if(h(n)&&!(To(n)||n instanceof Bn)){if(n instanceof zn)return n;if(Ge.call(n,"__chain__")&&Ge.call(n,"__wrapped__"))return Lr(n)}return new zn(n)}function Ln(){}function zn(n,t,r){this.__wrapped__=n,this.__actions__=r||[],
this.__chain__=!!t}function Bn(n){this.__wrapped__=n,this.__actions__=null,this.__dir__=1,this.__filtered__=false,this.__iteratees__=null,this.__takeCount__=Iu,this.__views__=null}function Mn(){this.__data__={}}function Dn(n){var t=n?n.length:0;for(this.data={hash:du(null),set:new lu};t--;)this.push(n[t])}function Pn(n,t){var r=n.data;return(typeof t=="string"||se(t)?r.set.has(t):r.hash[t])?0:-1}function qn(n,t){var r=-1,e=n.length;for(t||(t=Ue(e));++r<e;)t[r]=n[r];return t}function Kn(n,t){for(var r=-1,e=n.length;++r<e&&false!==t(n[r],r,n););
return n}function Vn(n,t){for(var r=-1,e=n.length;++r<e;)if(!t(n[r],r,n))return false;return true}function Gn(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;){var i=n[r];t(i,r,n)&&(o[++u]=i)}return o}function Jn(n,t){for(var r=-1,e=n.length,u=Ue(e);++r<e;)u[r]=t(n[r],r,n);return u}function Xn(n,t,r,e){var u=-1,o=n.length;for(e&&o&&(r=n[++u]);++u<o;)r=t(r,n[u],u,n);return r}function Hn(n,t){for(var r=-1,e=n.length;++r<e;)if(t(n[r],r,n))return true;return false}function Qn(n,t){return n===w?t:n}function nt(n,t,r,e){
return n!==w&&Ge.call(e,r)?n:t}function tt(n,t,r){var e=Ko(t);fu.apply(e,Zu(t));for(var u=-1,o=e.length;++u<o;){var i=e[u],f=n[i],a=r(f,t[i],i,n,t);(a===a?a===f:f!==f)&&(f!==w||i in n)||(n[i]=a)}return n}function rt(n,t){for(var r=-1,e=null==n,u=!e&&jr(n),o=u&&n.length,i=t.length,f=Ue(i);++r<i;){var a=t[r];f[r]=u?kr(a,o)?n[a]:w:e?w:n[a]}return f}function et(n,t,r){r||(r={});for(var e=-1,u=t.length;++e<u;){var o=t[e];r[o]=n[o]}return r}function ut(n,t,r){var e=typeof n;return"function"==e?t===w?n:zt(n,t,r):null==n?Re:"object"==e?wt(n):t===w?Te(n):bt(n,t);

}function ot(n,t,r,e,u,o,i){var f;if(r&&(f=u?r(n,e,u):r(n)),f!==w)return f;if(!se(n))return n;if(e=To(n)){if(f=wr(n),!t)return qn(n,f)}else{var a=Xe.call(n),c=a==K;if(a!=Y&&a!=B&&(!c||u))return Nn[a]?xr(n,a,t):u?n:{};if(f=br(c?{}:n),!t)return $u(f,n)}for(o||(o=[]),i||(i=[]),u=o.length;u--;)if(o[u]==n)return i[u];return o.push(n),i.push(f),(e?Kn:ht)(n,function(e,u){f[u]=ot(e,t,r,u,n,o,i)}),f}function it(n,t,r){if(typeof n!="function")throw new Pe(L);return su(function(){n.apply(w,r)},t)}function ft(n,t){
var e=n?n.length:0,u=[];if(!e)return u;var o=-1,i=mr(),f=i==r,a=f&&200<=t.length?qu(t):null,c=t.length;a&&(i=Pn,f=false,t=a);n:for(;++o<e;)if(a=n[o],f&&a===a){for(var l=c;l--;)if(t[l]===a)continue n;u.push(a)}else 0>i(t,a,0)&&u.push(a);return u}function at(n,t){var r=true;return zu(n,function(n,e,u){return r=!!t(n,e,u)}),r}function ct(n,t){var r=[];return zu(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function lt(n,t,r,e){var u;return r(n,function(n,r,o){return t(n,r,o)?(u=e?r:n,false):void 0}),u}function st(n,t,r){
for(var e=-1,u=n.length,o=-1,i=[];++e<u;){var f=n[e];if(h(f)&&jr(f)&&(r||To(f)||ae(f))){t&&(f=st(f,t,r));for(var a=-1,c=f.length;++a<c;)i[++o]=f[a]}else r||(i[++o]=f)}return i}function pt(n,t){Mu(n,t,me)}function ht(n,t){return Mu(n,t,Ko)}function _t(n,t){return Du(n,t,Ko)}function vt(n,t){for(var r=-1,e=t.length,u=-1,o=[];++r<e;){var i=t[r];No(n[i])&&(o[++u]=i)}return o}function gt(n,t,r){if(null!=n){r!==w&&r in Fr(n)&&(t=[r]),r=-1;for(var e=t.length;null!=n&&++r<e;)n=n[t[r]];return r&&r==e?n:w}
}function yt(n,t,r,e,u,o){if(n===t)return true;var i=typeof n,f=typeof t;if("function"!=i&&"object"!=i&&"function"!=f&&"object"!=f||null==n||null==t)n=n!==n&&t!==t;else n:{var i=yt,f=To(n),a=To(t),c=M,l=M;f||(c=Xe.call(n),c==B?c=Y:c!=Y&&(f=ge(n))),a||(l=Xe.call(t),l==B?l=Y:l!=Y&&ge(t));var s=c==Y,a=l==Y,l=c==l;if(!l||f||s){if(!e&&(c=s&&Ge.call(n,"__wrapped__"),a=a&&Ge.call(t,"__wrapped__"),c||a)){n=i(c?n.value():n,a?t.value():t,r,e,u,o);break n}if(l){for(u||(u=[]),o||(o=[]),c=u.length;c--;)if(u[c]==n){
n=o[c]==t;break n}u.push(n),o.push(t),n=(f?_r:gr)(n,t,i,r,e,u,o),u.pop(),o.pop()}else n=false}else n=vr(n,t,c)}return n}function dt(n,t,r,e,u){for(var o=-1,i=t.length,f=!u;++o<i;)if(f&&e[o]?r[o]!==n[t[o]]:!(t[o]in n))return false;for(o=-1;++o<i;){var a=t[o],c=n[a],l=r[o];if(f&&e[o]?a=c!==w||a in n:(a=u?u(c,l,a):w,a===w&&(a=yt(l,c,u,true))),!a)return false}return true}function mt(n,t){var r=-1,e=jr(n)?Ue(n.length):[];return zu(n,function(n,u,o){e[++r]=t(n,u,o)}),e}function wt(n){var t=Ko(n),r=t.length;if(!r)return Ie(true);

if(1==r){var e=t[0],u=n[e];if(Cr(u))return function(n){return null==n?false:n[e]===u&&(u!==w||e in Fr(n))}}for(var o=Ue(r),i=Ue(r);r--;)u=n[t[r]],o[r]=u,i[r]=Cr(u);return function(n){return null!=n&&dt(Fr(n),t,o,i)}}function bt(n,t){var r=To(n),e=Er(n)&&Cr(t),u=n+"";return n=$r(n),function(o){if(null==o)return false;var i=u;if(o=Fr(o),!(!r&&e||i in o)){if(o=1==n.length?o:gt(o,It(n,0,-1)),null==o)return false;i=Pr(n),o=Fr(o)}return o[i]===t?t!==w||i in o:yt(t,o[i],null,true)}}function xt(n,t,r,e,u){if(!se(n))return n;

var o=jr(t)&&(To(t)||ge(t));if(!o){var i=Ko(t);fu.apply(i,Zu(t))}return Kn(i||t,function(f,a){if(i&&(a=f,f=t[a]),h(f)){e||(e=[]),u||(u=[]);n:{for(var c=a,l=e,s=u,p=l.length,_=t[c];p--;)if(l[p]==_){n[c]=s[p];break n}var p=n[c],v=r?r(p,_,c,n,t):w,g=v===w;g&&(v=_,jr(_)&&(To(_)||ge(_))?v=To(p)?p:jr(p)?qn(p):[]:Fo(_)||ae(_)?v=ae(p)?ye(p):Fo(p)?p:{}:g=false),l.push(_),s.push(v),g?n[c]=xt(v,_,r,l,s):(v===v?v!==p:p===p)&&(n[c]=v)}}else c=n[a],l=r?r(c,f,a,n,t):w,(s=l===w)&&(l=f),!o&&l===w||!s&&(l===l?l===c:c!==c)||(n[a]=l);

}),n}function At(n){return function(t){return null==t?w:t[n]}}function jt(n){var t=n+"";return n=$r(n),function(r){return gt(r,n,t)}}function kt(n,t){for(var r=n?t.length:0;r--;){var e=parseFloat(t[r]);if(e!=u&&kr(e)){var u=e;pu.call(n,e,1)}}}function Ot(n,t){return n+uu(Ou()*(t-n+1))}function Et(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function It(n,t,r){var e=-1,u=n.length;for(t=null==t?0:+t||0,0>t&&(t=-t>u?0:u+t),r=r===w||r>u?u:+r||0,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,
r=Ue(u);++e<u;)r[e]=n[e+t];return r}function Rt(n,t){var r;return zu(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function Ct(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;return n}function Wt(t,r,e){var u=dr(),o=-1;return r=Jn(r,function(n){return u(n)}),t=mt(t,function(n){return{a:Jn(r,function(t){return t(n)}),b:++o,c:n}}),Ct(t,function(t,r){var u;n:{u=-1;for(var o=t.a,i=r.a,f=o.length,a=e.length;++u<f;){var c=n(o[u],i[u]);if(c){u=u<a?c*(e[u]?1:-1):c;break n}}u=t.b-r.b}return u})}function St(n,t){
var r=0;return zu(n,function(n,e,u){r+=+t(n,e,u)||0}),r}function Tt(n,t){var e=-1,u=mr(),o=n.length,i=u==r,f=i&&200<=o,a=f?qu():null,c=[];a?(u=Pn,i=false):(f=false,a=t?[]:c);n:for(;++e<o;){var l=n[e],s=t?t(l,e,n):l;if(i&&l===l){for(var p=a.length;p--;)if(a[p]===s)continue n;t&&a.push(s),c.push(l)}else 0>u(a,s,0)&&((t||f)&&a.push(s),c.push(l))}return c}function Ut(n,t){for(var r=-1,e=t.length,u=Ue(e);++r<e;)u[r]=n[t[r]];return u}function Nt(n,t,r,e){for(var u=n.length,o=e?u:-1;(e?o--:++o<u)&&t(n[o],o,n););
return r?It(n,e?0:o,e?o+1:u):It(n,e?o+1:0,e?u:o)}function Ft(n,t){var r=n;r instanceof Bn&&(r=r.value());for(var e=-1,u=t.length;++e<u;){var r=[r],o=t[e];fu.apply(r,o.args),r=o.func.apply(o.thisArg,r)}return r}function $t(n,t,r){var e=0,u=n?n.length:e;if(typeof t=="number"&&t===t&&u<=Wu){for(;e<u;){var o=e+u>>>1,i=n[o];(r?i<=t:i<t)?e=o+1:u=o}return u}return Lt(n,t,Re,r)}function Lt(n,t,r,e){t=r(t);for(var u=0,o=n?n.length:0,i=t!==t,f=t===w;u<o;){var a=uu((u+o)/2),c=r(n[a]),l=c===c;(i?l||e:f?l&&(e||c!==w):e?c<=t:c<t)?u=a+1:o=a;

}return xu(o,Cu)}function zt(n,t,r){if(typeof n!="function")return Re;if(t===w)return n;switch(r){case 1:return function(r){return n.call(t,r)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,o){return n.call(t,r,e,u,o)};case 5:return function(r,e,u,o,i){return n.call(t,r,e,u,o,i)}}return function(){return n.apply(t,arguments)}}function Bt(n){return tu.call(n,0)}function Mt(n,t,r){for(var e=r.length,u=-1,o=bu(n.length-e,0),i=-1,f=t.length,a=Ue(o+f);++i<f;)a[i]=t[i];

for(;++u<e;)a[r[u]]=n[u];for(;o--;)a[i++]=n[u++];return a}function Dt(n,t,r){for(var e=-1,u=r.length,o=-1,i=bu(n.length-u,0),f=-1,a=t.length,c=Ue(i+a);++o<i;)c[o]=n[o];for(i=o;++f<a;)c[i+f]=t[f];for(;++e<u;)c[i+r[e]]=n[o++];return c}function Pt(n,t){return function(r,e,u){var o=t?t():{};if(e=dr(e,u,3),To(r)){u=-1;for(var i=r.length;++u<i;){var f=r[u];n(o,f,e(f,u,r),r)}}else zu(r,function(t,r,u){n(o,t,e(t,r,u),u)});return o}}function qt(n){return fe(function(t,r){var e=-1,u=null==t?0:r.length,o=2<u&&r[u-2],i=2<u&&r[2],f=1<u&&r[u-1];

for(typeof o=="function"?(o=zt(o,f,5),u-=2):(o=typeof f=="function"?f:null,u-=o?1:0),i&&Or(r[0],r[1],i)&&(o=3>u?null:o,u=1);++e<u;)(i=r[e])&&n(t,i,o);return t})}function Kt(n,t){return function(r,e){var u=r?Yu(r):0;if(!Rr(u))return n(r,e);for(var o=t?u:-1,i=Fr(r);(t?o--:++o<u)&&false!==e(i[o],o,i););return r}}function Vt(n){return function(t,r,e){var u=Fr(t);e=e(t);for(var o=e.length,i=n?o:-1;n?i--:++i<o;){var f=e[i];if(false===r(u[f],f,u))break}return t}}function Yt(n,t){function r(){return(this&&this!==Yn&&this instanceof r?e:n).apply(t,arguments);

}var e=Gt(n);return r}function Zt(n){return function(t){var r=-1;t=Oe(be(t));for(var e=t.length,u="";++r<e;)u=n(u,t[r],r);return u}}function Gt(n){return function(){var t=Lu(n.prototype),r=n.apply(t,arguments);return se(r)?r:t}}function Jt(n){function t(r,e,u){return u&&Or(r,e,u)&&(e=null),r=hr(r,n,null,null,null,null,null,e),r.placeholder=t.placeholder,r}return t}function Xt(n,t){return function(r,e,u){u&&Or(r,e,u)&&(e=null);var i=dr(),f=null==e;if(i===ut&&f||(f=false,e=i(e,u,3)),f){if(e=To(r),e||!ve(r))return n(e?r:Nr(r));

e=o}return yr(r,e,t)}}function Ht(n,r){return function(e,u,o){return u=dr(u,o,3),To(e)?(u=t(e,u,r),-1<u?e[u]:w):lt(e,u,n)}}function Qt(n){return function(r,e,u){return r&&r.length?(e=dr(e,u,3),t(r,e,n)):-1}}function nr(n){return function(t,r,e){return r=dr(r,e,3),lt(t,r,n,true)}}function tr(n){return function(){var t=arguments.length;if(!t)return function(){return arguments[0]};for(var r,e=n?t:-1,u=0,o=Ue(t);n?e--:++e<t;){var i=o[u++]=arguments[e];if(typeof i!="function")throw new Pe(L);var f=r?"":Vu(i);

r="wrapper"==f?new zn([]):r}for(e=r?-1:t;++e<t;)i=o[e],f=Vu(i),r=(u="wrapper"==f?Ku(i):null)&&Ir(u[0])&&u[1]==(R|k|E|C)&&!u[4].length&&1==u[9]?r[Vu(u[0])].apply(r,u[3]):1==i.length&&Ir(i)?r[f]():r.thru(i);return function(){var n=arguments;if(r&&1==n.length&&To(n[0]))return r.plant(n[0]).value();for(var e=0,n=o[e].apply(this,n);++e<t;)n=o[e].call(this,n);return n}}}function rr(n,t){return function(r,e,u){return typeof e=="function"&&u===w&&To(r)?n(r,e):t(r,zt(e,u,3))}}function er(n){return function(t,r,e){
return(typeof r!="function"||e!==w)&&(r=zt(r,e,3)),n(t,r,me)}}function ur(n){return function(t,r,e){return(typeof r!="function"||e!==w)&&(r=zt(r,e,3)),n(t,r)}}function or(n){return function(t,r,e){var u={};return r=dr(r,e,3),ht(t,function(t,e,o){o=r(t,e,o),e=n?o:e,t=n?t:o,u[e]=t}),u}}function ir(n){return function(t,r,e){return t=u(t),(n?t:"")+lr(t,r,e)+(n?"":t)}}function fr(n){var t=fe(function(r,e){var u=v(e,t.placeholder);return hr(r,n,null,e,u)});return t}function ar(n,t){return function(r,e,u,o){
var i=3>arguments.length;return typeof e=="function"&&o===w&&To(r)?n(r,e,u,i):Et(r,dr(e,o,4),u,i,t)}}function cr(n,t,r,e,u,o,i,f,a,c){function l(){for(var b=arguments.length,j=b,k=Ue(b);j--;)k[j]=arguments[j];if(e&&(k=Mt(k,e,u)),o&&(k=Dt(k,o,i)),_||y){var j=l.placeholder,O=v(k,j),b=b-O.length;if(b<c){var R=f?qn(f):null,b=bu(c-b,0),C=_?O:null,O=_?null:O,W=_?k:null,k=_?null:k;return t|=_?E:I,t&=~(_?I:E),g||(t&=~(x|A)),k=[n,t,r,W,C,k,O,R,a,b],R=cr.apply(w,k),Ir(n)&&Gu(R,k),R.placeholder=j,R}}if(j=p?r:this,
h&&(n=j[m]),f)for(R=k.length,b=xu(f.length,R),C=qn(k);b--;)O=f[b],k[b]=kr(O,R)?C[O]:w;return s&&a<k.length&&(k.length=a),(this&&this!==Yn&&this instanceof l?d||Gt(n):n).apply(j,k)}var s=t&R,p=t&x,h=t&A,_=t&k,g=t&j,y=t&O,d=!h&&Gt(n),m=n;return l}function lr(n,t,r){return n=n.length,t=+t,n<t&&mu(t)?(t-=n,r=null==r?" ":r+"",je(r,ru(t/r.length)).slice(0,t)):""}function sr(n,t,r,e){function u(){for(var t=-1,f=arguments.length,a=-1,c=e.length,l=Ue(f+c);++a<c;)l[a]=e[a];for(;f--;)l[a++]=arguments[++t];return(this&&this!==Yn&&this instanceof u?i:n).apply(o?r:this,l);

}var o=t&x,i=Gt(n);return u}function pr(n){return function(t,r,e,u){var o=dr(e);return o===ut&&null==e?$t(t,r,n):Lt(t,r,o(e,u,1),n)}}function hr(n,t,r,e,u,o,i,f){var a=t&A;if(!a&&typeof n!="function")throw new Pe(L);var c=e?e.length:0;if(c||(t&=~(E|I),e=u=null),c-=u?u.length:0,t&I){var l=e,s=u;e=u=null}var p=a?null:Ku(n);return r=[n,t,r,e,u,l,s,o,i,f],p&&(e=r[1],t=p[1],f=e|t,u=t==R&&e==k||t==R&&e==C&&r[7].length<=p[8]||t==(R|C)&&e==k,(f<R||u)&&(t&x&&(r[2]=p[2],f|=e&x?0:j),(e=p[3])&&(u=r[3],r[3]=u?Mt(u,e,p[4]):qn(e),
r[4]=u?v(r[3],z):qn(p[4])),(e=p[5])&&(u=r[5],r[5]=u?Dt(u,e,p[6]):qn(e),r[6]=u?v(r[5],z):qn(p[6])),(e=p[7])&&(r[7]=qn(e)),t&R&&(r[8]=null==r[8]?p[8]:xu(r[8],p[8])),null==r[9]&&(r[9]=p[9]),r[0]=p[0],r[1]=f),t=r[1],f=r[9]),r[9]=null==f?a?0:n.length:bu(f-c,0)||0,(p?Pu:Gu)(t==x?Yt(r[0],r[2]):t!=E&&t!=(x|E)||r[4].length?cr.apply(w,r):sr.apply(w,r),r)}function _r(n,t,r,e,u,o,i){var f=-1,a=n.length,c=t.length,l=true;if(a!=c&&(!u||c<=a))return false;for(;l&&++f<a;){var s=n[f],p=t[f],l=w;if(e&&(l=u?e(p,s,f):e(s,p,f)),
l===w)if(u)for(var h=c;h--&&(p=t[h],!(l=s&&s===p||r(s,p,e,u,o,i))););else l=s&&s===p||r(s,p,e,u,o,i)}return!!l}function vr(n,t,r){switch(r){case D:case P:return+n==+t;case q:return n.name==t.name&&n.message==t.message;case V:return n!=+n?t!=+t:n==+t;case Z:case G:return n==t+""}return false}function gr(n,t,r,e,u,o,i){var f=Ko(n),a=f.length,c=Ko(t).length;if(a!=c&&!u)return false;for(var c=u,l=-1;++l<a;){var s=f[l],p=u?s in t:Ge.call(t,s);if(p){var h=n[s],_=t[s],p=w;e&&(p=u?e(_,h,s):e(h,_,s)),p===w&&(p=h&&h===_||r(h,_,e,u,o,i));

}if(!p)return false;c||(c="constructor"==s)}return c||(r=n.constructor,e=t.constructor,!(r!=e&&"constructor"in n&&"constructor"in t)||typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)?true:false}function yr(n,t,r){var e=r?Iu:Eu,u=e,o=u;return zu(n,function(n,i,f){i=t(n,i,f),((r?i<u:i>u)||i===e&&i===o)&&(u=i,o=n)}),o}function dr(n,t,r){var e=$n.callback||Ee,e=e===Ee?ut:e;return r?e(n,t,r):e}function mr(n,t,e){var u=$n.indexOf||Dr,u=u===Dr?r:u;return n?u(n,t,e):u}function wr(n){var t=n.length,r=new n.constructor(t);

return t&&"string"==typeof n[0]&&Ge.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function br(n){return n=n.constructor,typeof n=="function"&&n instanceof n||(n=Be),new n}function xr(n,t,r){var e=n.constructor;switch(t){case J:return Bt(n);case D:case P:return new e(+n);case X:case H:case Q:case nn:case tn:case rn:case en:case un:case on:return t=n.buffer,new e(r?Bt(t):t,n.byteOffset,n.length);case V:case G:return new e(n);case Z:var u=new e(n.source,kn.exec(n));u.lastIndex=n.lastIndex}return u;

}function Ar(n,t,r){return null==n||Er(t,n)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),t=Pr(t)),t=null==n?n:n[t],null==t?w:t.apply(n,r)}function jr(n){return null!=n&&Rr(Yu(n))}function kr(n,t){return n=+n,t=null==t?Tu:t,-1<n&&0==n%1&&n<t}function Or(n,t,r){if(!se(r))return false;var e=typeof t;return("number"==e?jr(r)&&kr(t,r.length):"string"==e&&t in r)?(t=r[t],n===n?n===t:t!==t):false}function Er(n,t){var r=typeof n;return"string"==r&&dn.test(n)||"number"==r?true:To(n)?false:!yn.test(n)||null!=t&&n in Fr(t);

}function Ir(n){var t=Vu(n);return!!t&&n===$n[t]&&t in Bn.prototype}function Rr(n){return typeof n=="number"&&-1<n&&0==n%1&&n<=Tu}function Cr(n){return n===n&&!se(n)}function Wr(n,t){n=Fr(n);for(var r=-1,e=t.length,u={};++r<e;){var o=t[r];o in n&&(u[o]=n[o])}return u}function Sr(n,t){var r={};return pt(n,function(n,e,u){t(n,e,u)&&(r[e]=n)}),r}function Tr(n){var t;if(!h(n)||Xe.call(n)!=Y||!(Ge.call(n,"constructor")||(t=n.constructor,typeof t!="function"||t instanceof t)))return false;var r;return pt(n,function(n,t){
r=t}),r===w||Ge.call(n,r)}function Ur(n){for(var t=me(n),r=t.length,e=r&&n.length,u=$n.support,u=e&&Rr(e)&&(To(n)||u.nonEnumArgs&&ae(n)),o=-1,i=[];++o<r;){var f=t[o];(u&&kr(f,e)||Ge.call(n,f))&&i.push(f)}return i}function Nr(n){return null==n?[]:jr(n)?se(n)?n:Be(n):we(n)}function Fr(n){return se(n)?n:Be(n)}function $r(n){if(To(n))return n;var t=[];return u(n).replace(mn,function(n,r,e,u){t.push(e?u.replace(An,"$1"):r||n)}),t}function Lr(n){return n instanceof Bn?n.clone():new zn(n.__wrapped__,n.__chain__,qn(n.__actions__));

}function zr(n,t,r){return n&&n.length?((r?Or(n,t,r):null==t)&&(t=1),It(n,0>t?0:t)):[]}function Br(n,t,r){var e=n?n.length:0;return e?((r?Or(n,t,r):null==t)&&(t=1),t=e-(+t||0),It(n,0,0>t?0:t)):[]}function Mr(n){return n?n[0]:w}function Dr(n,t,e){var u=n?n.length:0;if(!u)return-1;if(typeof e=="number")e=0>e?bu(u+e,0):e;else if(e)return e=$t(n,t),n=n[e],(t===t?t===n:n!==n)?e:-1;return r(n,t,e||0)}function Pr(n){var t=n?n.length:0;return t?n[t-1]:w}function qr(n){return zr(n,1)}function Kr(n,t,e,u){
if(!n||!n.length)return[];null!=t&&typeof t!="boolean"&&(u=e,e=Or(n,t,u)?null:t,t=false);var o=dr();if((o!==ut||null!=e)&&(e=o(e,u,3)),t&&mr()==r){t=e;var i;e=-1,u=n.length;for(var o=-1,f=[];++e<u;){var a=n[e],c=t?t(a,e,n):a;e&&i===c||(i=c,f[++o]=a)}n=f}else n=Tt(n,e);return n}function Vr(n){if(!n||!n.length)return[];var t=-1,r=0;n=Gn(n,function(n){return jr(n)?(r=bu(n.length,r),true):void 0});for(var e=Ue(r);++t<r;)e[t]=Jn(n,At(t));return e}function Yr(n,t,r){return n&&n.length?(n=Vr(n),null==t?n:(t=zt(t,r,4),
Jn(n,function(n){return Xn(n,t,w,true)}))):[]}function Zr(n,t){var r=-1,e=n?n.length:0,u={};for(!e||t||To(n[0])||(t=[]);++r<e;){var o=n[r];t?u[o]=t[r]:o&&(u[o[0]]=o[1])}return u}function Gr(n){return n=$n(n),n.__chain__=true,n}function Jr(n,t,r){return t.call(r,n)}function Xr(n,t,r){var e=To(n)?Vn:at;return r&&Or(n,t,r)&&(t=null),(typeof t!="function"||r!==w)&&(t=dr(t,r,3)),e(n,t)}function Hr(n,t,r){var e=To(n)?Gn:ct;return t=dr(t,r,3),e(n,t)}function Qr(n,t,r,e){var u=n?Yu(n):0;return Rr(u)||(n=we(n),
u=n.length),u?(r=typeof r!="number"||e&&Or(t,r,e)?0:0>r?bu(u+r,0):r||0,typeof n=="string"||!To(n)&&ve(n)?r<u&&-1<n.indexOf(t,r):-1<mr(n,t,r)):false}function ne(n,t,r){var e=To(n)?Jn:mt;return t=dr(t,r,3),e(n,t)}function te(n,t,r){return(r?Or(n,t,r):null==t)?(n=Nr(n),t=n.length,0<t?n[Ot(0,t-1)]:w):(n=re(n),n.length=xu(0>t?0:+t||0,n.length),n)}function re(n){n=Nr(n);for(var t=-1,r=n.length,e=Ue(r);++t<r;){var u=Ot(0,t);t!=u&&(e[t]=e[u]),e[u]=n[t]}return e}function ee(n,t,r){var e=To(n)?Hn:Rt;return r&&Or(n,t,r)&&(t=null),
(typeof t!="function"||r!==w)&&(t=dr(t,r,3)),e(n,t)}function ue(n,t){var r;if(typeof t!="function"){if(typeof n!="function")throw new Pe(L);var e=n;n=t,t=e}return function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}}function oe(n,t,r){function e(){var r=t-(wo()-c);0>=r||r>t?(f&&eu(f),r=p,f=s=p=w,r&&(h=wo(),a=n.apply(l,i),s||f||(i=l=null))):s=su(e,r)}function u(){s&&eu(s),f=s=p=w,(v||_!==t)&&(h=wo(),a=n.apply(l,i),s||f||(i=l=null))}function o(){if(i=arguments,c=wo(),l=this,p=v&&(s||!g),
!1===_)var r=g&&!s;else{f||g||(h=c);var o=_-(c-h),y=0>=o||o>_;y?(f&&(f=eu(f)),h=c,a=n.apply(l,i)):f||(f=su(u,o))}return y&&s?s=eu(s):s||t===_||(s=su(e,t)),r&&(y=true,a=n.apply(l,i)),!y||s||f||(i=l=null),a}var i,f,a,c,l,s,p,h=0,_=false,v=true;if(typeof n!="function")throw new Pe(L);if(t=0>t?0:+t||0,true===r)var g=true,v=false;else se(r)&&(g=r.leading,_="maxWait"in r&&bu(+r.maxWait||0,t),v="trailing"in r?r.trailing:v);return o.cancel=function(){s&&eu(s),f&&eu(f),f=s=p=w},o}function ie(n,t){function r(){var e=arguments,u=r.cache,o=t?t.apply(this,e):e[0];

return u.has(o)?u.get(o):(e=n.apply(this,e),u.set(o,e),e)}if(typeof n!="function"||t&&typeof t!="function")throw new Pe(L);return r.cache=new ie.Cache,r}function fe(n,t){if(typeof n!="function")throw new Pe(L);return t=bu(t===w?n.length-1:+t||0,0),function(){for(var r=arguments,e=-1,u=bu(r.length-t,0),o=Ue(u);++e<u;)o[e]=r[t+e];switch(t){case 0:return n.call(this,o);case 1:return n.call(this,r[0],o);case 2:return n.call(this,r[0],r[1],o)}for(u=Ue(t+1),e=-1;++e<t;)u[e]=r[e];return u[t]=o,n.apply(this,u);

}}function ae(n){return h(n)&&jr(n)&&Xe.call(n)==B}function ce(n){return!!n&&1===n.nodeType&&h(n)&&-1<Xe.call(n).indexOf("Element")}function le(n){return h(n)&&typeof n.message=="string"&&Xe.call(n)==q}function se(n){var t=typeof n;return"function"==t||!!n&&"object"==t}function pe(n){return null==n?false:Xe.call(n)==K?Qe.test(Ze.call(n)):h(n)&&En.test(n)}function he(n){return typeof n=="number"||h(n)&&Xe.call(n)==V}function _e(n){return h(n)&&Xe.call(n)==Z}function ve(n){return typeof n=="string"||h(n)&&Xe.call(n)==G;

}function ge(n){return h(n)&&Rr(n.length)&&!!Un[Xe.call(n)]}function ye(n){return et(n,me(n))}function de(n){return vt(n,me(n))}function me(n){if(null==n)return[];se(n)||(n=Be(n));for(var t=n.length,t=t&&Rr(t)&&(To(n)||Fu.nonEnumArgs&&ae(n))&&t||0,r=n.constructor,e=-1,r=typeof r=="function"&&r.prototype===n,u=Ue(t),o=0<t;++e<t;)u[e]=e+"";for(var i in n)o&&kr(i,t)||"constructor"==i&&(r||!Ge.call(n,i))||u.push(i);return u}function we(n){return Ut(n,Ko(n))}function be(n){return(n=u(n))&&n.replace(In,c).replace(xn,"");

}function xe(n){return(n=u(n))&&bn.test(n)?n.replace(wn,"\\$&"):n}function Ae(n,t,r){return r&&Or(n,t,r)&&(t=0),ku(n,t)}function je(n,t){var r="";if(n=u(n),t=+t,1>t||!n||!mu(t))return r;do t%2&&(r+=n),t=uu(t/2),n+=n;while(t);return r}function ke(n,t,r){var e=n;return(n=u(n))?(r?Or(e,t,r):null==t)?n.slice(g(n),y(n)+1):(t+="",n.slice(i(n,t),f(n,t)+1)):n}function Oe(n,t,r){return r&&Or(n,t,r)&&(t=null),n=u(n),n.match(t||Wn)||[]}function Ee(n,t,r){return r&&Or(n,t,r)&&(t=null),h(n)?Ce(n):ut(n,t)}function Ie(n){
return function(){return n}}function Re(n){return n}function Ce(n){return wt(ot(n,true))}function We(n,t,r){if(null==r){var e=se(t),u=e&&Ko(t);((u=u&&u.length&&vt(t,u))?u.length:e)||(u=false,r=t,t=n,n=this)}u||(u=vt(t,Ko(t)));var o=true,e=-1,i=No(n),f=u.length;false===r?o=false:se(r)&&"chain"in r&&(o=r.chain);for(;++e<f;){r=u[e];var a=t[r];n[r]=a,i&&(n.prototype[r]=function(t){return function(){var r=this.__chain__;if(o||r){var e=n(this.__wrapped__);return(e.__actions__=qn(this.__actions__)).push({func:t,args:arguments,
thisArg:n}),e.__chain__=r,e}return r=[this.value()],fu.apply(r,arguments),t.apply(n,r)}}(a))}return n}function Se(){}function Te(n){return Er(n)?At(n):jt(n)}_=_?Zn.defaults(Yn.Object(),_,Zn.pick(Yn,Tn)):Yn;var Ue=_.Array,Ne=_.Date,Fe=_.Error,$e=_.Function,Le=_.Math,ze=_.Number,Be=_.Object,Me=_.RegExp,De=_.String,Pe=_.TypeError,qe=Ue.prototype,Ke=Be.prototype,Ve=De.prototype,Ye=(Ye=_.window)&&Ye.document,Ze=$e.prototype.toString,Ge=Ke.hasOwnProperty,Je=0,Xe=Ke.toString,He=_._,Qe=Me("^"+xe(Xe).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nu=pe(nu=_.ArrayBuffer)&&nu,tu=pe(tu=nu&&new nu(0).slice)&&tu,ru=Le.ceil,eu=_.clearTimeout,uu=Le.floor,ou=pe(ou=Be.getOwnPropertySymbols)&&ou,iu=pe(iu=Be.getPrototypeOf)&&iu,fu=qe.push,au=pe(au=Be.preventExtensions)&&au,cu=Ke.propertyIsEnumerable,lu=pe(lu=_.Set)&&lu,su=_.setTimeout,pu=qe.splice,hu=pe(hu=_.Uint8Array)&&hu,_u=pe(_u=_.WeakMap)&&_u,vu=function(){
try{var n=pe(n=_.Float64Array)&&n,t=new n(new nu(10),0,1)&&n}catch(r){}return t}(),gu=function(){var n=au&&pe(n=Be.assign)&&n;try{if(n){var t=au({1:0});t[0]=1}}catch(r){try{n(t,"xo")}catch(e){}return!t[1]&&n}return false}(),yu=pe(yu=Ue.isArray)&&yu,du=pe(du=Be.create)&&du,mu=_.isFinite,wu=pe(wu=Be.keys)&&wu,bu=Le.max,xu=Le.min,Au=pe(Au=Ne.now)&&Au,ju=pe(ju=ze.isFinite)&&ju,ku=_.parseInt,Ou=Le.random,Eu=ze.NEGATIVE_INFINITY,Iu=ze.POSITIVE_INFINITY,Ru=Le.pow(2,32)-1,Cu=Ru-1,Wu=Ru>>>1,Su=vu?vu.BYTES_PER_ELEMENT:0,Tu=Le.pow(2,53)-1,Uu=_u&&new _u,Nu={},Fu=$n.support={};

!function(n){function t(){this.x=n}var r=arguments,e=[];t.prototype={valueOf:n,y:n};for(var u in new t)e.push(u);Fu.funcDecomp=/\bthis\b/.test(function(){return this}),Fu.funcNames=typeof $e.name=="string";try{Fu.dom=11===Ye.createDocumentFragment().nodeType}catch(o){Fu.dom=false}try{Fu.nonEnumArgs=!cu.call(r,1)}catch(i){Fu.nonEnumArgs=true}}(1,0),$n.templateSettings={escape:_n,evaluate:vn,interpolate:gn,variable:"",imports:{_:$n}};var $u=gu||function(n,t){return null==t?n:et(t,Zu(t),et(t,Ko(t),n))},Lu=function(){
function n(){}return function(t){if(se(t)){n.prototype=t;var r=new n;n.prototype=null}return r||_.Object()}}(),zu=Kt(ht),Bu=Kt(_t,true),Mu=Vt(),Du=Vt(true),Pu=Uu?function(n,t){return Uu.set(n,t),n}:Re;tu||(Bt=nu&&hu?function(n){var t=n.byteLength,r=vu?uu(t/Su):0,e=r*Su,u=new nu(t);if(r){var o=new vu(u,0,r);o.set(new vu(n,0,r))}return t!=e&&(o=new hu(u,e),o.set(new hu(n,e))),u}:Ie(null));var qu=du&&lu?function(n){return new Dn(n)}:Ie(null),Ku=Uu?function(n){return Uu.get(n)}:Se,Vu=function(){return Fu.funcNames?"constant"==Ie.name?At("name"):function(n){
for(var t=n.name,r=Nu[t],e=r?r.length:0;e--;){var u=r[e],o=u.func;if(null==o||o==n)return u.name}return t}:Ie("")}(),Yu=At("length"),Zu=ou?function(n){return ou(Fr(n))}:Ie([]),Gu=function(){var n=0,t=0;return function(r,e){var u=wo(),o=U-(u-t);if(t=u,0<o){if(++n>=T)return r}else n=0;return Pu(r,e)}}(),Ju=fe(function(n,t){return jr(n)?ft(n,st(t,false,true)):[]}),Xu=Qt(),Hu=Qt(true),Qu=fe(function(t,r){r=st(r);var e=rt(t,r);return kt(t,r.sort(n)),e}),no=pr(),to=pr(true),ro=fe(function(n){return Tt(st(n,false,true));

}),eo=fe(function(n,t){return jr(n)?ft(n,t):[]}),uo=fe(Vr),oo=fe(function(n){var t=n.length,r=n[t-2],e=n[t-1];return 2<t&&typeof r=="function"?t-=2:(r=1<t&&typeof e=="function"?(--t,e):w,e=w),n.length=t,Yr(n,r,e)}),io=fe(function(n,t){return rt(n,st(t))}),fo=Pt(function(n,t,r){Ge.call(n,r)?++n[r]:n[r]=1}),ao=Ht(zu),co=Ht(Bu,true),lo=rr(Kn,zu),so=rr(function(n,t){for(var r=n.length;r--&&false!==t(n[r],r,n););return n},Bu),po=Pt(function(n,t,r){Ge.call(n,r)?n[r].push(t):n[r]=[t]}),ho=Pt(function(n,t,r){
n[r]=t}),_o=fe(function(n,t,r){var e=-1,u=typeof t=="function",o=Er(t),i=jr(n)?Ue(n.length):[];return zu(n,function(n){var f=u?t:o&&null!=n&&n[t];i[++e]=f?f.apply(n,r):Ar(n,t,r)}),i}),vo=Pt(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),go=ar(Xn,zu),yo=ar(function(n,t,r,e){var u=n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r},Bu),mo=fe(function(n,t){if(null==n)return[];var r=t[2];return r&&Or(t[0],t[1],r)&&(t.length=1),Wt(n,st(t),[])}),wo=Au||function(){return(new Ne).getTime();

},bo=fe(function(n,t,r){var e=x;if(r.length)var u=v(r,bo.placeholder),e=e|E;return hr(n,e,t,r,u)}),xo=fe(function(n,t){t=t.length?st(t):de(n);for(var r=-1,e=t.length;++r<e;){var u=t[r];n[u]=hr(n[u],x,n)}return n}),Ao=fe(function(n,t,r){var e=x|A;if(r.length)var u=v(r,Ao.placeholder),e=e|E;return hr(t,e,n,r,u)}),jo=Jt(k),ko=Jt(O),Oo=fe(function(n,t){return it(n,1,t)}),Eo=fe(function(n,t,r){return it(n,t,r)}),Io=tr(),Ro=tr(true),Co=fr(E),Wo=fr(I),So=fe(function(n,t){return hr(n,C,null,null,null,st(t));

}),To=yu||function(n){return h(n)&&Rr(n.length)&&Xe.call(n)==M};Fu.dom||(ce=function(n){return!!n&&1===n.nodeType&&h(n)&&!Fo(n)});var Uo=ju||function(n){return typeof n=="number"&&mu(n)},No=e(/x/)||hu&&!e(hu)?function(n){return Xe.call(n)==K}:e,Fo=iu?function(n){if(!n||Xe.call(n)!=Y)return false;var t=n.valueOf,r=pe(t)&&(r=iu(t))&&iu(r);return r?n==r||iu(n)==r:Tr(n)}:Tr,$o=qt(function(n,t,r){return r?tt(n,t,r):$u(n,t)}),Lo=fe(function(n){var t=n[0];return null==t?t:(n.push(Qn),$o.apply(w,n))}),zo=nr(ht),Bo=nr(_t),Mo=er(Mu),Do=er(Du),Po=ur(ht),qo=ur(_t),Ko=wu?function(n){
var t=null!=n&&n.constructor;return typeof t=="function"&&t.prototype===n||typeof n!="function"&&jr(n)?Ur(n):se(n)?wu(n):[]}:Ur,Vo=or(true),Yo=or(),Zo=qt(xt),Go=fe(function(n,t){if(null==n)return{};if("function"!=typeof t[0])return t=Jn(st(t),De),Wr(n,ft(me(n),t));var r=zt(t[0],t[1],3);return Sr(n,function(n,t,e){return!r(n,t,e)})}),Jo=fe(function(n,t){return null==n?{}:"function"==typeof t[0]?Sr(n,zt(t[0],t[1],3)):Wr(n,st(t))}),Xo=Zt(function(n,t,r){return t=t.toLowerCase(),n+(r?t.charAt(0).toUpperCase()+t.slice(1):t);

}),Ho=Zt(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Qo=ir(),ni=ir(true);8!=ku(Sn+"08")&&(Ae=function(n,t,r){return(r?Or(n,t,r):null==t)?t=0:t&&(t=+t),n=ke(n),ku(n,t||(On.test(n)?16:10))});var ti=Zt(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),ri=Zt(function(n,t,r){return n+(r?" ":"")+(t.charAt(0).toUpperCase()+t.slice(1))}),ei=fe(function(n,t){try{return n.apply(w,t)}catch(r){return le(r)?r:new Fe(r)}}),ui=fe(function(n,t){return function(r){return Ar(r,n,t)}}),oi=fe(function(n,t){
return function(r){return Ar(n,r,t)}}),ii=Xt(function(n){for(var t=-1,r=n.length,e=Eu;++t<r;){var u=n[t];u>e&&(e=u)}return e}),fi=Xt(function(n){for(var t=-1,r=n.length,e=Iu;++t<r;){var u=n[t];u<e&&(e=u)}return e},true);return $n.prototype=Ln.prototype,zn.prototype=Lu(Ln.prototype),zn.prototype.constructor=zn,Bn.prototype=Lu(Ln.prototype),Bn.prototype.constructor=Bn,Mn.prototype["delete"]=function(n){return this.has(n)&&delete this.__data__[n]},Mn.prototype.get=function(n){return"__proto__"==n?w:this.__data__[n];

},Mn.prototype.has=function(n){return"__proto__"!=n&&Ge.call(this.__data__,n)},Mn.prototype.set=function(n,t){return"__proto__"!=n&&(this.__data__[n]=t),this},Dn.prototype.push=function(n){var t=this.data;typeof n=="string"||se(n)?t.set.add(n):t.hash[n]=true},ie.Cache=Mn,$n.after=function(n,t){if(typeof t!="function"){if(typeof n!="function")throw new Pe(L);var r=n;n=t,t=r}return n=mu(n=+n)?n:0,function(){return 1>--n?t.apply(this,arguments):void 0}},$n.ary=function(n,t,r){return r&&Or(n,t,r)&&(t=null),
t=n&&null==t?n.length:bu(+t||0,0),hr(n,R,null,null,null,null,t)},$n.assign=$o,$n.at=io,$n.before=ue,$n.bind=bo,$n.bindAll=xo,$n.bindKey=Ao,$n.callback=Ee,$n.chain=Gr,$n.chunk=function(n,t,r){t=(r?Or(n,t,r):null==t)?1:bu(+t||1,1),r=0;for(var e=n?n.length:0,u=-1,o=Ue(ru(e/t));r<e;)o[++u]=It(n,r,r+=t);return o},$n.compact=function(n){for(var t=-1,r=n?n.length:0,e=-1,u=[];++t<r;){var o=n[t];o&&(u[++e]=o)}return u},$n.constant=Ie,$n.countBy=fo,$n.create=function(n,t,r){var e=Lu(n);return r&&Or(n,t,r)&&(t=null),
t?$u(e,t):e},$n.curry=jo,$n.curryRight=ko,$n.debounce=oe,$n.defaults=Lo,$n.defer=Oo,$n.delay=Eo,$n.difference=Ju,$n.drop=zr,$n.dropRight=Br,$n.dropRightWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),true,true):[]},$n.dropWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),true):[]},$n.fill=function(n,t,r,e){var u=n?n.length:0;if(!u)return[];for(r&&typeof r!="number"&&Or(n,t,r)&&(r=0,e=u),u=n.length,r=null==r?0:+r||0,0>r&&(r=-r>u?0:u+r),e=e===w||e>u?u:+e||0,0>e&&(e+=u),u=r>e?0:e>>>0,r>>>=0;r<u;)n[r++]=t;

return n},$n.filter=Hr,$n.flatten=function(n,t,r){var e=n?n.length:0;return r&&Or(n,t,r)&&(t=false),e?st(n,t):[]},$n.flattenDeep=function(n){return n&&n.length?st(n,true):[]},$n.flow=Io,$n.flowRight=Ro,$n.forEach=lo,$n.forEachRight=so,$n.forIn=Mo,$n.forInRight=Do,$n.forOwn=Po,$n.forOwnRight=qo,$n.functions=de,$n.groupBy=po,$n.indexBy=ho,$n.initial=function(n){return Br(n,1)},$n.intersection=function(){for(var n=[],t=-1,e=arguments.length,u=[],o=mr(),i=o==r,f=[];++t<e;){var a=arguments[t];jr(a)&&(n.push(a),
u.push(i&&120<=a.length?qu(t&&a):null))}if(e=n.length,2>e)return f;var i=n[0],c=-1,l=i?i.length:0,s=u[0];n:for(;++c<l;)if(a=i[c],0>(s?Pn(s,a):o(f,a,0))){for(t=e;--t;){var p=u[t];if(0>(p?Pn(p,a):o(n[t],a,0)))continue n}s&&s.push(a),f.push(a)}return f},$n.invert=function(n,t,r){r&&Or(n,t,r)&&(t=null),r=-1;for(var e=Ko(n),u=e.length,o={};++r<u;){var i=e[r],f=n[i];t?Ge.call(o,f)?o[f].push(i):o[f]=[i]:o[f]=i}return o},$n.invoke=_o,$n.keys=Ko,$n.keysIn=me,$n.map=ne,$n.mapKeys=Vo,$n.mapValues=Yo,$n.matches=Ce,
$n.matchesProperty=function(n,t){return bt(n,ot(t,true))},$n.memoize=ie,$n.merge=Zo,$n.method=ui,$n.methodOf=oi,$n.mixin=We,$n.negate=function(n){if(typeof n!="function")throw new Pe(L);return function(){return!n.apply(this,arguments)}},$n.omit=Go,$n.once=function(n){return ue(2,n)},$n.pairs=function(n){for(var t=-1,r=Ko(n),e=r.length,u=Ue(e);++t<e;){var o=r[t];u[t]=[o,n[o]]}return u},$n.partial=Co,$n.partialRight=Wo,$n.partition=vo,$n.pick=Jo,$n.pluck=function(n,t){return ne(n,Te(t))},$n.property=Te,
$n.propertyOf=function(n){return function(t){return gt(n,$r(t),t+"")}},$n.pull=function(){var n=arguments,t=n[0];if(!t||!t.length)return t;for(var r=0,e=mr(),u=n.length;++r<u;)for(var o=0,i=n[r];-1<(o=e(t,i,o));)pu.call(t,o,1);return t},$n.pullAt=Qu,$n.range=function(n,t,r){r&&Or(n,t,r)&&(t=r=null),n=+n||0,r=null==r?1:+r||0,null==t?(t=n,n=0):t=+t||0;var e=-1;t=bu(ru((t-n)/(r||1)),0);for(var u=Ue(t);++e<t;)u[e]=n,n+=r;return u},$n.rearg=So,$n.reject=function(n,t,r){var e=To(n)?Gn:ct;return t=dr(t,r,3),
e(n,function(n,r,e){return!t(n,r,e)})},$n.remove=function(n,t,r){var e=[];if(!n||!n.length)return e;var u=-1,o=[],i=n.length;for(t=dr(t,r,3);++u<i;)r=n[u],t(r,u,n)&&(e.push(r),o.push(u));return kt(n,o),e},$n.rest=qr,$n.restParam=fe,$n.set=function(n,t,r){if(null==n)return n;var e=t+"";t=null!=n[e]||Er(t,n)?[e]:$r(t);for(var e=-1,u=t.length,o=u-1,i=n;null!=i&&++e<u;){var f=t[e];se(i)&&(e==o?i[f]=r:null==i[f]&&(i[f]=kr(t[e+1])?[]:{})),i=i[f]}return n},$n.shuffle=re,$n.slice=function(n,t,r){var e=n?n.length:0;

return e?(r&&typeof r!="number"&&Or(n,t,r)&&(t=0,r=e),It(n,t,r)):[]},$n.sortBy=function(n,t,r){if(null==n)return[];r&&Or(n,t,r)&&(t=null);var e=-1;return t=dr(t,r,3),n=mt(n,function(n,r,u){return{a:t(n,r,u),b:++e,c:n}}),Ct(n,a)},$n.sortByAll=mo,$n.sortByOrder=function(n,t,r,e){return null==n?[]:(e&&Or(t,r,e)&&(r=null),To(t)||(t=null==t?[]:[t]),To(r)||(r=null==r?[]:[r]),Wt(n,t,r))},$n.spread=function(n){if(typeof n!="function")throw new Pe(L);return function(t){return n.apply(this,t)}},$n.take=function(n,t,r){
return n&&n.length?((r?Or(n,t,r):null==t)&&(t=1),It(n,0,0>t?0:t)):[]},$n.takeRight=function(n,t,r){var e=n?n.length:0;return e?((r?Or(n,t,r):null==t)&&(t=1),t=e-(+t||0),It(n,0>t?0:t)):[]},$n.takeRightWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3),false,true):[]},$n.takeWhile=function(n,t,r){return n&&n.length?Nt(n,dr(t,r,3)):[]},$n.tap=function(n,t,r){return t.call(r,n),n},$n.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new Pe(L);return false===r?e=false:se(r)&&(e="leading"in r?!!r.leading:e,
u="trailing"in r?!!r.trailing:u),Fn.leading=e,Fn.maxWait=+t,Fn.trailing=u,oe(n,t,Fn)},$n.thru=Jr,$n.times=function(n,t,r){if(n=uu(n),1>n||!mu(n))return[];var e=-1,u=Ue(xu(n,Ru));for(t=zt(t,r,1);++e<n;)e<Ru?u[e]=t(e):t(e);return u},$n.toArray=function(n){var t=n?Yu(n):0;return Rr(t)?t?qn(n):[]:we(n)},$n.toPlainObject=ye,$n.transform=function(n,t,r,e){var u=To(n)||ge(n);return t=dr(t,e,4),null==r&&(u||se(n)?(e=n.constructor,r=u?To(n)?new e:[]:Lu(No(e)&&e.prototype)):r={}),(u?Kn:ht)(n,function(n,e,u){
return t(r,n,e,u)}),r},$n.union=ro,$n.uniq=Kr,$n.unzip=Vr,$n.unzipWith=Yr,$n.values=we,$n.valuesIn=function(n){return Ut(n,me(n))},$n.where=function(n,t){return Hr(n,wt(t))},$n.without=eo,$n.wrap=function(n,t){return t=null==t?Re:t,hr(t,E,null,[n],[])},$n.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var r=arguments[n];if(jr(r))var e=e?ft(e,r).concat(ft(r,e)):r}return e?Tt(e):[]},$n.zip=uo,$n.zipObject=Zr,$n.zipWith=oo,$n.backflow=Ro,$n.collect=ne,$n.compose=Ro,$n.each=lo,$n.eachRight=so,
$n.extend=$o,$n.iteratee=Ee,$n.methods=de,$n.object=Zr,$n.select=Hr,$n.tail=qr,$n.unique=Kr,We($n,$n),$n.add=function(n,t){return(+n||0)+(+t||0)},$n.attempt=ei,$n.camelCase=Xo,$n.capitalize=function(n){return(n=u(n))&&n.charAt(0).toUpperCase()+n.slice(1)},$n.clone=function(n,t,r,e){return t&&typeof t!="boolean"&&Or(n,t,r)?t=false:typeof t=="function"&&(e=r,r=t,t=false),r=typeof r=="function"&&zt(r,e,1),ot(n,t,r)},$n.cloneDeep=function(n,t,r){return t=typeof t=="function"&&zt(t,r,1),ot(n,true,t)},$n.deburr=be,
$n.endsWith=function(n,t,r){n=u(n),t+="";var e=n.length;return r=r===w?e:xu(0>r?0:+r||0,e),r-=t.length,0<=r&&n.indexOf(t,r)==r},$n.escape=function(n){return(n=u(n))&&hn.test(n)?n.replace(sn,l):n},$n.escapeRegExp=xe,$n.every=Xr,$n.find=ao,$n.findIndex=Xu,$n.findKey=zo,$n.findLast=co,$n.findLastIndex=Hu,$n.findLastKey=Bo,$n.findWhere=function(n,t){return ao(n,wt(t))},$n.first=Mr,$n.get=function(n,t,r){return n=null==n?w:gt(n,$r(t),t+""),n===w?r:n},$n.has=function(n,t){if(null==n)return false;var r=Ge.call(n,t);

return r||Er(t)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),t=Pr(t),r=null!=n&&Ge.call(n,t)),r},$n.identity=Re,$n.includes=Qr,$n.indexOf=Dr,$n.inRange=function(n,t,r){return t=+t||0,"undefined"===typeof r?(r=t,t=0):r=+r||0,n>=xu(t,r)&&n<bu(t,r)},$n.isArguments=ae,$n.isArray=To,$n.isBoolean=function(n){return true===n||false===n||h(n)&&Xe.call(n)==D},$n.isDate=function(n){return h(n)&&Xe.call(n)==P},$n.isElement=ce,$n.isEmpty=function(n){return null==n?true:jr(n)&&(To(n)||ve(n)||ae(n)||h(n)&&No(n.splice))?!n.length:!Ko(n).length;

},$n.isEqual=function(n,t,r,e){return r=typeof r=="function"&&zt(r,e,3),!r&&Cr(n)&&Cr(t)?n===t:(e=r?r(n,t):w,e===w?yt(n,t,r):!!e)},$n.isError=le,$n.isFinite=Uo,$n.isFunction=No,$n.isMatch=function(n,t,r,e){var u=Ko(t),o=u.length;if(!o)return true;if(null==n)return false;if(r=typeof r=="function"&&zt(r,e,3),n=Fr(n),!r&&1==o){var i=u[0];if(e=t[i],Cr(e))return e===n[i]&&(e!==w||i in n)}for(var i=Ue(o),f=Ue(o);o--;)e=i[o]=t[u[o]],f[o]=Cr(e);return dt(n,u,i,f,r)},$n.isNaN=function(n){return he(n)&&n!=+n},$n.isNative=pe,
$n.isNull=function(n){return null===n},$n.isNumber=he,$n.isObject=se,$n.isPlainObject=Fo,$n.isRegExp=_e,$n.isString=ve,$n.isTypedArray=ge,$n.isUndefined=function(n){return n===w},$n.kebabCase=Ho,$n.last=Pr,$n.lastIndexOf=function(n,t,r){var e=n?n.length:0;if(!e)return-1;var u=e;if(typeof r=="number")u=(0>r?bu(e+r,0):xu(r||0,e-1))+1;else if(r)return u=$t(n,t,true)-1,n=n[u],(t===t?t===n:n!==n)?u:-1;if(t!==t)return p(n,u,true);for(;u--;)if(n[u]===t)return u;return-1},$n.max=ii,$n.min=fi,$n.noConflict=function(){
return _._=He,this},$n.noop=Se,$n.now=wo,$n.pad=function(n,t,r){n=u(n),t=+t;var e=n.length;return e<t&&mu(t)?(e=(t-e)/2,t=uu(e),e=ru(e),r=lr("",e,r),r.slice(0,t)+n+r):n},$n.padLeft=Qo,$n.padRight=ni,$n.parseInt=Ae,$n.random=function(n,t,r){r&&Or(n,t,r)&&(t=r=null);var e=null==n,u=null==t;return null==r&&(u&&typeof n=="boolean"?(r=n,n=1):typeof t=="boolean"&&(r=t,u=true)),e&&u&&(t=1,u=false),n=+n||0,u?(t=n,n=0):t=+t||0,r||n%1||t%1?(r=Ou(),xu(n+r*(t-n+parseFloat("1e-"+((r+"").length-1))),t)):Ot(n,t)},$n.reduce=go,
$n.reduceRight=yo,$n.repeat=je,$n.result=function(n,t,r){var e=null==n?w:n[t];return e===w&&(null==n||Er(t,n)||(t=$r(t),n=1==t.length?n:gt(n,It(t,0,-1)),e=null==n?w:n[Pr(t)]),e=e===w?r:e),No(e)?e.call(n):e},$n.runInContext=m,$n.size=function(n){var t=n?Yu(n):0;return Rr(t)?t:Ko(n).length},$n.snakeCase=ti,$n.some=ee,$n.sortedIndex=no,$n.sortedLastIndex=to,$n.startCase=ri,$n.startsWith=function(n,t,r){return n=u(n),r=null==r?0:xu(0>r?0:+r||0,n.length),n.lastIndexOf(t,r)==r},$n.sum=function(n,t,r){r&&Or(n,t,r)&&(t=null);

var e=dr(),u=null==t;if(e===ut&&u||(u=false,t=e(t,r,3)),u){for(n=To(n)?n:Nr(n),t=n.length,r=0;t--;)r+=+n[t]||0;n=r}else n=St(n,t);return n},$n.template=function(n,t,r){var e=$n.templateSettings;r&&Or(n,t,r)&&(t=r=null),n=u(n),t=tt($u({},r||t),e,nt),r=tt($u({},t.imports),e.imports,nt);var o,i,f=Ko(r),a=Ut(r,f),c=0;r=t.interpolate||Rn;var l="__p+='";r=Me((t.escape||Rn).source+"|"+r.source+"|"+(r===gn?jn:Rn).source+"|"+(t.evaluate||Rn).source+"|$","g");var p="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";

if(n.replace(r,function(t,r,e,u,f,a){return e||(e=u),l+=n.slice(c,a).replace(Cn,s),r&&(o=true,l+="'+__e("+r+")+'"),f&&(i=true,l+="';"+f+";\n__p+='"),e&&(l+="'+((__t=("+e+"))==null?'':__t)+'"),c=a+t.length,t}),l+="';",(t=t.variable)||(l="with(obj){"+l+"}"),l=(i?l.replace(fn,""):l).replace(an,"$1").replace(cn,"$1;"),l="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(o?",__e=_.escape":"")+(i?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+l+"return __p}",
t=ei(function(){return $e(f,p+"return "+l).apply(w,a)}),t.source=l,le(t))throw t;return t},$n.trim=ke,$n.trimLeft=function(n,t,r){var e=n;return(n=u(n))?n.slice((r?Or(e,t,r):null==t)?g(n):i(n,t+"")):n},$n.trimRight=function(n,t,r){var e=n;return(n=u(n))?(r?Or(e,t,r):null==t)?n.slice(0,y(n)+1):n.slice(0,f(n,t+"")+1):n},$n.trunc=function(n,t,r){r&&Or(n,t,r)&&(t=null);var e=W;if(r=S,null!=t)if(se(t)){var o="separator"in t?t.separator:o,e="length"in t?+t.length||0:e;r="omission"in t?u(t.omission):r}else e=+t||0;

if(n=u(n),e>=n.length)return n;if(e-=r.length,1>e)return r;if(t=n.slice(0,e),null==o)return t+r;if(_e(o)){if(n.slice(e).search(o)){var i,f=n.slice(0,e);for(o.global||(o=Me(o.source,(kn.exec(o)||"")+"g")),o.lastIndex=0;n=o.exec(f);)i=n.index;t=t.slice(0,null==i?e:i)}}else n.indexOf(o,e)!=e&&(o=t.lastIndexOf(o),-1<o&&(t=t.slice(0,o)));return t+r},$n.unescape=function(n){return(n=u(n))&&pn.test(n)?n.replace(ln,d):n},$n.uniqueId=function(n){var t=++Je;return u(n)+t},$n.words=Oe,$n.all=Xr,$n.any=ee,$n.contains=Qr,
$n.detect=ao,$n.foldl=go,$n.foldr=yo,$n.head=Mr,$n.include=Qr,$n.inject=go,We($n,function(){var n={};return ht($n,function(t,r){$n.prototype[r]||(n[r]=t)}),n}(),false),$n.sample=te,$n.prototype.sample=function(n){return this.__chain__||null!=n?this.thru(function(t){return te(t,n)}):te(this.value())},$n.VERSION=b,Kn("bind bindKey curry curryRight partial partialRight".split(" "),function(n){$n[n].placeholder=$n}),Kn(["dropWhile","filter","map","takeWhile"],function(n,t){var r=t!=$,e=t==N;Bn.prototype[n]=function(n,u){
var o=this.__filtered__,i=o&&e?new Bn(this):this.clone();return(i.__iteratees__||(i.__iteratees__=[])).push({done:false,count:0,index:0,iteratee:dr(n,u,1),limit:-1,type:t}),i.__filtered__=o||r,i}}),Kn(["drop","take"],function(n,t){var r=n+"While";Bn.prototype[n]=function(r){var e=this.__filtered__,u=e&&!t?this.dropWhile():this.clone();return r=null==r?1:bu(uu(r)||0,0),e?t?u.__takeCount__=xu(u.__takeCount__,r):Pr(u.__iteratees__).limit=r:(u.__views__||(u.__views__=[])).push({size:r,type:n+(0>u.__dir__?"Right":"")
}),u},Bn.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()},Bn.prototype[n+"RightWhile"]=function(n,t){return this.reverse()[r](n,t).reverse()}}),Kn(["first","last"],function(n,t){var r="take"+(t?"Right":"");Bn.prototype[n]=function(){return this[r](1).value()[0]}}),Kn(["initial","rest"],function(n,t){var r="drop"+(t?"":"Right");Bn.prototype[n]=function(){return this[r](1)}}),Kn(["pluck","where"],function(n,t){var r=t?"filter":"map",e=t?wt:Te;Bn.prototype[n]=function(n){return this[r](e(n));

}}),Bn.prototype.compact=function(){return this.filter(Re)},Bn.prototype.reject=function(n,t){return n=dr(n,t,1),this.filter(function(t){return!n(t)})},Bn.prototype.slice=function(n,t){n=null==n?0:+n||0;var r=this;return 0>n?r=this.takeRight(-n):n&&(r=this.drop(n)),t!==w&&(t=+t||0,r=0>t?r.dropRight(-t):r.take(t-n)),r},Bn.prototype.toArray=function(){return this.drop(0)},ht(Bn.prototype,function(n,t){var r=$n[t];if(r){var e=/^(?:filter|map|reject)|While$/.test(t),u=/^(?:first|last)$/.test(t);$n.prototype[t]=function(){
function t(n){return n=[n],fu.apply(n,o),r.apply($n,n)}var o=arguments,i=this.__chain__,f=this.__wrapped__,a=!!this.__actions__.length,c=f instanceof Bn,l=o[0],s=c||To(f);return s&&e&&typeof l=="function"&&1!=l.length&&(c=s=false),c=c&&!a,u&&!i?c?n.call(f):r.call($n,this.value()):s?(f=n.apply(c?f:new Bn(this),o),u||!a&&!f.__actions__||(f.__actions__||(f.__actions__=[])).push({func:Jr,args:[t],thisArg:$n}),new zn(f,i)):this.thru(t)}}}),Kn("concat join pop push replace shift sort splice split unshift".split(" "),function(n){
var t=(/^(?:replace|split)$/.test(n)?Ve:qe)[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:join|pop|replace|shift)$/.test(n);$n.prototype[n]=function(){var n=arguments;return e&&!this.__chain__?t.apply(this.value(),n):this[r](function(r){return t.apply(r,n)})}}),ht(Bn.prototype,function(n,t){var r=$n[t];if(r){var e=r.name;(Nu[e]||(Nu[e]=[])).push({name:t,func:r})}}),Nu[cr(null,A).name]=[{name:"wrapper",func:null}],Bn.prototype.clone=function(){var n=this.__actions__,t=this.__iteratees__,r=this.__views__,e=new Bn(this.__wrapped__);

return e.__actions__=n?qn(n):null,e.__dir__=this.__dir__,e.__filtered__=this.__filtered__,e.__iteratees__=t?qn(t):null,e.__takeCount__=this.__takeCount__,e.__views__=r?qn(r):null,e},Bn.prototype.reverse=function(){if(this.__filtered__){var n=new Bn(this);n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},Bn.prototype.value=function(){var n=this.__wrapped__.value();if(!To(n))return Ft(n,this.__actions__);var t,r=this.__dir__,e=0>r;t=n.length;for(var u=this.__views__,o=0,i=-1,f=u?u.length:0;++i<f;){
var a=u[i],c=a.size;switch(a.type){case"drop":o+=c;break;case"dropRight":t-=c;break;case"take":t=xu(t,o+c);break;case"takeRight":o=bu(o,t-c)}}t={start:o,end:t},u=t.start,o=t.end,t=o-u,u=e?o:u-1,o=xu(t,this.__takeCount__),f=(i=this.__iteratees__)?i.length:0,a=0,c=[];n:for(;t--&&a<o;){for(var u=u+r,l=-1,s=n[u];++l<f;){var p=i[l],h=p.iteratee,_=p.type;if(_==N){if(p.done&&(e?u>p.index:u<p.index)&&(p.count=0,p.done=false),p.index=u,!(p.done||(_=p.limit,p.done=-1<_?p.count++>=_:!h(s))))continue n}else if(p=h(s),
_==$)s=p;else if(!p){if(_==F)continue n;break n}}c[a++]=s}return c},$n.prototype.chain=function(){return Gr(this)},$n.prototype.commit=function(){return new zn(this.value(),this.__chain__)},$n.prototype.plant=function(n){for(var t,r=this;r instanceof Ln;){var e=Lr(r);t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},$n.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof Bn?(this.__actions__.length&&(n=new Bn(this)),new zn(n.reverse(),this.__chain__)):this.thru(function(n){
return n.reverse()})},$n.prototype.toString=function(){return this.value()+""},$n.prototype.run=$n.prototype.toJSON=$n.prototype.valueOf=$n.prototype.value=function(){return Ft(this.__wrapped__,this.__actions__)},$n.prototype.collect=$n.prototype.map,$n.prototype.head=$n.prototype.first,$n.prototype.select=$n.prototype.filter,$n.prototype.tail=$n.prototype.rest,$n}var w,b="3.8.0",x=1,A=2,j=4,k=8,O=16,E=32,I=64,R=128,C=256,W=30,S="...",T=150,U=16,N=0,F=1,$=2,L="Expected a function",z="__lodash_placeholder__",B="[object Arguments]",M="[object Array]",D="[object Boolean]",P="[object Date]",q="[object Error]",K="[object Function]",V="[object Number]",Y="[object Object]",Z="[object RegExp]",G="[object String]",J="[object ArrayBuffer]",X="[object Float32Array]",H="[object Float64Array]",Q="[object Int8Array]",nn="[object Int16Array]",tn="[object Int32Array]",rn="[object Uint8Array]",en="[object Uint8ClampedArray]",un="[object Uint16Array]",on="[object Uint32Array]",fn=/\b__p\+='';/g,an=/\b(__p\+=)''\+/g,cn=/(__e\(.*?\)|\b__t\))\+'';/g,ln=/&(?:amp|lt|gt|quot|#39|#96);/g,sn=/[&<>"'`]/g,pn=RegExp(ln.source),hn=RegExp(sn.source),_n=/<%-([\s\S]+?)%>/g,vn=/<%([\s\S]+?)%>/g,gn=/<%=([\s\S]+?)%>/g,yn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,dn=/^\w*$/,mn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,wn=/[.*+?^${}()|[\]\/\\]/g,bn=RegExp(wn.source),xn=/[\u0300-\u036f\ufe20-\ufe23]/g,An=/\\(\\)?/g,jn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,kn=/\w*$/,On=/^0[xX]/,En=/^\[object .+?Constructor\]$/,In=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,Rn=/($^)/,Cn=/['\n\r\u2028\u2029\\]/g,Wn=RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?=[A-Z\\xc0-\\xd6\\xd8-\\xde][a-z\\xdf-\\xf6\\xf8-\\xff]+)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|[0-9]+","g"),Sn=" \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",Tn="Array ArrayBuffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Math Number Object RegExp Set String _ clearTimeout document isFinite parseInt setTimeout TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap window".split(" "),Un={};

Un[X]=Un[H]=Un[Q]=Un[nn]=Un[tn]=Un[rn]=Un[en]=Un[un]=Un[on]=true,Un[B]=Un[M]=Un[J]=Un[D]=Un[P]=Un[q]=Un[K]=Un["[object Map]"]=Un[V]=Un[Y]=Un[Z]=Un["[object Set]"]=Un[G]=Un["[object WeakMap]"]=false;var Nn={};Nn[B]=Nn[M]=Nn[J]=Nn[D]=Nn[P]=Nn[X]=Nn[H]=Nn[Q]=Nn[nn]=Nn[tn]=Nn[V]=Nn[Y]=Nn[Z]=Nn[G]=Nn[rn]=Nn[en]=Nn[un]=Nn[on]=true,Nn[q]=Nn[K]=Nn["[object Map]"]=Nn["[object Set]"]=Nn["[object WeakMap]"]=false;var Fn={leading:false,maxWait:0,trailing:false},$n={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A",
"\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u",
"\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss"},Ln={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},zn={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},Bn={"function":true,object:true},Mn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Dn=Bn[typeof exports]&&exports&&!exports.nodeType&&exports,Pn=Bn[typeof module]&&module&&!module.nodeType&&module,qn=Bn[typeof self]&&self&&self.Object&&self,Kn=Bn[typeof window]&&window&&window.Object&&window,Vn=Pn&&Pn.exports===Dn&&Dn,Yn=Dn&&Pn&&typeof global=="object"&&global&&global.Object&&global||Kn!==(this&&this.window)&&Kn||qn||this,Zn=m();

typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Yn._=Zn, define('lodash',[],function(){return Zn})):Dn&&Pn?Vn?(Pn.exports=Zn)._=Zn:Dn._=Zn:Yn._=Zn}).call(this);
/**
 * React v0.13.3
 *
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define('react',[],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.React=e()}}(function(){return function e(t,n,r){function o(a,u){if(!n[a]){if(!t[a]){var s="function"==typeof require&&require;if(!u&&s)return s(a,!0);if(i)return i(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var c=n[a]={exports:{}};t[a][0].call(c.exports,function(e){var n=t[a][1][e];return o(n?n:e)},c,c.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){"use strict";var r=e(19),o=e(32),i=e(34),a=e(33),u=e(38),s=e(39),l=e(55),c=(e(56),e(40)),p=e(51),d=e(54),f=e(64),h=e(68),m=e(73),v=e(76),g=e(79),y=e(82),C=e(27),E=e(115),b=e(142);d.inject();var _=l.createElement,x=l.createFactory,D=l.cloneElement,M=m.measure("React","render",h.render),N={Children:{map:o.map,forEach:o.forEach,count:o.count,only:b},Component:i,DOM:c,PropTypes:v,initializeTouchEvents:function(e){r.useTouchEvents=e},createClass:a.createClass,createElement:_,cloneElement:D,createFactory:x,createMixin:function(e){return e},constructAndRenderComponent:h.constructAndRenderComponent,constructAndRenderComponentByID:h.constructAndRenderComponentByID,findDOMNode:E,render:M,renderToString:y.renderToString,renderToStaticMarkup:y.renderToStaticMarkup,unmountComponentAtNode:h.unmountComponentAtNode,isValidElement:l.isValidElement,withContext:u.withContext,__spread:C};"undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject&&__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({CurrentOwner:s,InstanceHandles:f,Mount:h,Reconciler:g,TextComponent:p});N.version="0.13.3",t.exports=N},{115:115,142:142,19:19,27:27,32:32,33:33,34:34,38:38,39:39,40:40,51:51,54:54,55:55,56:56,64:64,68:68,73:73,76:76,79:79,82:82}],2:[function(e,t,n){"use strict";var r=e(117),o={componentDidMount:function(){this.props.autoFocus&&r(this.getDOMNode())}};t.exports=o},{117:117}],3:[function(e,t,n){"use strict";function r(){var e=window.opera;return"object"==typeof e&&"function"==typeof e.version&&parseInt(e.version(),10)<=12}function o(e){return(e.ctrlKey||e.altKey||e.metaKey)&&!(e.ctrlKey&&e.altKey)}function i(e){switch(e){case T.topCompositionStart:return P.compositionStart;case T.topCompositionEnd:return P.compositionEnd;case T.topCompositionUpdate:return P.compositionUpdate}}function a(e,t){return e===T.topKeyDown&&t.keyCode===b}function u(e,t){switch(e){case T.topKeyUp:return-1!==E.indexOf(t.keyCode);case T.topKeyDown:return t.keyCode!==b;case T.topKeyPress:case T.topMouseDown:case T.topBlur:return!0;default:return!1}}function s(e){var t=e.detail;return"object"==typeof t&&"data"in t?t.data:null}function l(e,t,n,r){var o,l;if(_?o=i(e):w?u(e,r)&&(o=P.compositionEnd):a(e,r)&&(o=P.compositionStart),!o)return null;M&&(w||o!==P.compositionStart?o===P.compositionEnd&&w&&(l=w.getData()):w=v.getPooled(t));var c=g.getPooled(o,n,r);if(l)c.data=l;else{var p=s(r);null!==p&&(c.data=p)}return h.accumulateTwoPhaseDispatches(c),c}function c(e,t){switch(e){case T.topCompositionEnd:return s(t);case T.topKeyPress:var n=t.which;return n!==N?null:(R=!0,I);case T.topTextInput:var r=t.data;return r===I&&R?null:r;default:return null}}function p(e,t){if(w){if(e===T.topCompositionEnd||u(e,t)){var n=w.getData();return v.release(w),w=null,n}return null}switch(e){case T.topPaste:return null;case T.topKeyPress:return t.which&&!o(t)?String.fromCharCode(t.which):null;case T.topCompositionEnd:return M?null:t.data;default:return null}}function d(e,t,n,r){var o;if(o=D?c(e,r):p(e,r),!o)return null;var i=y.getPooled(P.beforeInput,n,r);return i.data=o,h.accumulateTwoPhaseDispatches(i),i}var f=e(15),h=e(20),m=e(21),v=e(22),g=e(91),y=e(95),C=e(139),E=[9,13,27,32],b=229,_=m.canUseDOM&&"CompositionEvent"in window,x=null;m.canUseDOM&&"documentMode"in document&&(x=document.documentMode);var D=m.canUseDOM&&"TextEvent"in window&&!x&&!r(),M=m.canUseDOM&&(!_||x&&x>8&&11>=x),N=32,I=String.fromCharCode(N),T=f.topLevelTypes,P={beforeInput:{phasedRegistrationNames:{bubbled:C({onBeforeInput:null}),captured:C({onBeforeInputCapture:null})},dependencies:[T.topCompositionEnd,T.topKeyPress,T.topTextInput,T.topPaste]},compositionEnd:{phasedRegistrationNames:{bubbled:C({onCompositionEnd:null}),captured:C({onCompositionEndCapture:null})},dependencies:[T.topBlur,T.topCompositionEnd,T.topKeyDown,T.topKeyPress,T.topKeyUp,T.topMouseDown]},compositionStart:{phasedRegistrationNames:{bubbled:C({onCompositionStart:null}),captured:C({onCompositionStartCapture:null})},dependencies:[T.topBlur,T.topCompositionStart,T.topKeyDown,T.topKeyPress,T.topKeyUp,T.topMouseDown]},compositionUpdate:{phasedRegistrationNames:{bubbled:C({onCompositionUpdate:null}),captured:C({onCompositionUpdateCapture:null})},dependencies:[T.topBlur,T.topCompositionUpdate,T.topKeyDown,T.topKeyPress,T.topKeyUp,T.topMouseDown]}},R=!1,w=null,O={eventTypes:P,extractEvents:function(e,t,n,r){return[l(e,t,n,r),d(e,t,n,r)]}};t.exports=O},{139:139,15:15,20:20,21:21,22:22,91:91,95:95}],4:[function(e,t,n){"use strict";function r(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var o={boxFlex:!0,boxFlexGroup:!0,columnCount:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,strokeDashoffset:!0,strokeOpacity:!0,strokeWidth:!0},i=["Webkit","ms","Moz","O"];Object.keys(o).forEach(function(e){i.forEach(function(t){o[r(t,e)]=o[e]})});var a={background:{backgroundImage:!0,backgroundPosition:!0,backgroundRepeat:!0,backgroundColor:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0}},u={isUnitlessNumber:o,shorthandPropertyExpansions:a};t.exports=u},{}],5:[function(e,t,n){"use strict";var r=e(4),o=e(21),i=(e(106),e(111)),a=e(131),u=e(141),s=(e(150),u(function(e){return a(e)})),l="cssFloat";o.canUseDOM&&void 0===document.documentElement.style.cssFloat&&(l="styleFloat");var c={createMarkupForStyles:function(e){var t="";for(var n in e)if(e.hasOwnProperty(n)){var r=e[n];null!=r&&(t+=s(n)+":",t+=i(n,r)+";")}return t||null},setValueForStyles:function(e,t){var n=e.style;for(var o in t)if(t.hasOwnProperty(o)){var a=i(o,t[o]);if("float"===o&&(o=l),a)n[o]=a;else{var u=r.shorthandPropertyExpansions[o];if(u)for(var s in u)n[s]="";else n[o]=""}}}};t.exports=c},{106:106,111:111,131:131,141:141,150:150,21:21,4:4}],6:[function(e,t,n){"use strict";function r(){this._callbacks=null,this._contexts=null}var o=e(28),i=e(27),a=e(133);i(r.prototype,{enqueue:function(e,t){this._callbacks=this._callbacks||[],this._contexts=this._contexts||[],this._callbacks.push(e),this._contexts.push(t)},notifyAll:function(){var e=this._callbacks,t=this._contexts;if(e){a(e.length===t.length),this._callbacks=null,this._contexts=null;for(var n=0,r=e.length;r>n;n++)e[n].call(t[n]);e.length=0,t.length=0}},reset:function(){this._callbacks=null,this._contexts=null},destructor:function(){this.reset()}}),o.addPoolingTo(r),t.exports=r},{133:133,27:27,28:28}],7:[function(e,t,n){"use strict";function r(e){return"SELECT"===e.nodeName||"INPUT"===e.nodeName&&"file"===e.type}function o(e){var t=x.getPooled(T.change,R,e);E.accumulateTwoPhaseDispatches(t),_.batchedUpdates(i,t)}function i(e){C.enqueueEvents(e),C.processEventQueue()}function a(e,t){P=e,R=t,P.attachEvent("onchange",o)}function u(){P&&(P.detachEvent("onchange",o),P=null,R=null)}function s(e,t,n){return e===I.topChange?n:void 0}function l(e,t,n){e===I.topFocus?(u(),a(t,n)):e===I.topBlur&&u()}function c(e,t){P=e,R=t,w=e.value,O=Object.getOwnPropertyDescriptor(e.constructor.prototype,"value"),Object.defineProperty(P,"value",k),P.attachEvent("onpropertychange",d)}function p(){P&&(delete P.value,P.detachEvent("onpropertychange",d),P=null,R=null,w=null,O=null)}function d(e){if("value"===e.propertyName){var t=e.srcElement.value;t!==w&&(w=t,o(e))}}function f(e,t,n){return e===I.topInput?n:void 0}function h(e,t,n){e===I.topFocus?(p(),c(t,n)):e===I.topBlur&&p()}function m(e,t,n){return e!==I.topSelectionChange&&e!==I.topKeyUp&&e!==I.topKeyDown||!P||P.value===w?void 0:(w=P.value,R)}function v(e){return"INPUT"===e.nodeName&&("checkbox"===e.type||"radio"===e.type)}function g(e,t,n){return e===I.topClick?n:void 0}var y=e(15),C=e(17),E=e(20),b=e(21),_=e(85),x=e(93),D=e(134),M=e(136),N=e(139),I=y.topLevelTypes,T={change:{phasedRegistrationNames:{bubbled:N({onChange:null}),captured:N({onChangeCapture:null})},dependencies:[I.topBlur,I.topChange,I.topClick,I.topFocus,I.topInput,I.topKeyDown,I.topKeyUp,I.topSelectionChange]}},P=null,R=null,w=null,O=null,S=!1;b.canUseDOM&&(S=D("change")&&(!("documentMode"in document)||document.documentMode>8));var A=!1;b.canUseDOM&&(A=D("input")&&(!("documentMode"in document)||document.documentMode>9));var k={get:function(){return O.get.call(this)},set:function(e){w=""+e,O.set.call(this,e)}},L={eventTypes:T,extractEvents:function(e,t,n,o){var i,a;if(r(t)?S?i=s:a=l:M(t)?A?i=f:(i=m,a=h):v(t)&&(i=g),i){var u=i(e,t,n);if(u){var c=x.getPooled(T.change,u,o);return E.accumulateTwoPhaseDispatches(c),c}}a&&a(e,t,n)}};t.exports=L},{134:134,136:136,139:139,15:15,17:17,20:20,21:21,85:85,93:93}],8:[function(e,t,n){"use strict";var r=0,o={createReactRootIndex:function(){return r++}};t.exports=o},{}],9:[function(e,t,n){"use strict";function r(e,t,n){e.insertBefore(t,e.childNodes[n]||null)}var o=e(12),i=e(70),a=e(145),u=e(133),s={dangerouslyReplaceNodeWithMarkup:o.dangerouslyReplaceNodeWithMarkup,updateTextContent:a,processUpdates:function(e,t){for(var n,s=null,l=null,c=0;c<e.length;c++)if(n=e[c],n.type===i.MOVE_EXISTING||n.type===i.REMOVE_NODE){var p=n.fromIndex,d=n.parentNode.childNodes[p],f=n.parentID;u(d),s=s||{},s[f]=s[f]||[],s[f][p]=d,l=l||[],l.push(d)}var h=o.dangerouslyRenderMarkup(t);if(l)for(var m=0;m<l.length;m++)l[m].parentNode.removeChild(l[m]);for(var v=0;v<e.length;v++)switch(n=e[v],n.type){case i.INSERT_MARKUP:r(n.parentNode,h[n.markupIndex],n.toIndex);break;case i.MOVE_EXISTING:r(n.parentNode,s[n.parentID][n.fromIndex],n.toIndex);break;case i.TEXT_CONTENT:a(n.parentNode,n.textContent);break;case i.REMOVE_NODE:}}};t.exports=s},{12:12,133:133,145:145,70:70}],10:[function(e,t,n){"use strict";function r(e,t){return(e&t)===t}var o=e(133),i={MUST_USE_ATTRIBUTE:1,MUST_USE_PROPERTY:2,HAS_SIDE_EFFECTS:4,HAS_BOOLEAN_VALUE:8,HAS_NUMERIC_VALUE:16,HAS_POSITIVE_NUMERIC_VALUE:48,HAS_OVERLOADED_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(e){var t=e.Properties||{},n=e.DOMAttributeNames||{},a=e.DOMPropertyNames||{},s=e.DOMMutationMethods||{};e.isCustomAttribute&&u._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var l in t){o(!u.isStandardName.hasOwnProperty(l)),u.isStandardName[l]=!0;var c=l.toLowerCase();if(u.getPossibleStandardName[c]=l,n.hasOwnProperty(l)){var p=n[l];u.getPossibleStandardName[p]=l,u.getAttributeName[l]=p}else u.getAttributeName[l]=c;u.getPropertyName[l]=a.hasOwnProperty(l)?a[l]:l,s.hasOwnProperty(l)?u.getMutationMethod[l]=s[l]:u.getMutationMethod[l]=null;var d=t[l];u.mustUseAttribute[l]=r(d,i.MUST_USE_ATTRIBUTE),u.mustUseProperty[l]=r(d,i.MUST_USE_PROPERTY),u.hasSideEffects[l]=r(d,i.HAS_SIDE_EFFECTS),u.hasBooleanValue[l]=r(d,i.HAS_BOOLEAN_VALUE),u.hasNumericValue[l]=r(d,i.HAS_NUMERIC_VALUE),u.hasPositiveNumericValue[l]=r(d,i.HAS_POSITIVE_NUMERIC_VALUE),u.hasOverloadedBooleanValue[l]=r(d,i.HAS_OVERLOADED_BOOLEAN_VALUE),o(!u.mustUseAttribute[l]||!u.mustUseProperty[l]),o(u.mustUseProperty[l]||!u.hasSideEffects[l]),o(!!u.hasBooleanValue[l]+!!u.hasNumericValue[l]+!!u.hasOverloadedBooleanValue[l]<=1)}}},a={},u={ID_ATTRIBUTE_NAME:"data-reactid",isStandardName:{},getPossibleStandardName:{},getAttributeName:{},getPropertyName:{},getMutationMethod:{},mustUseAttribute:{},mustUseProperty:{},hasSideEffects:{},hasBooleanValue:{},hasNumericValue:{},hasPositiveNumericValue:{},hasOverloadedBooleanValue:{},_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<u._isCustomAttributeFunctions.length;t++){var n=u._isCustomAttributeFunctions[t];if(n(e))return!0}return!1},getDefaultValueForProperty:function(e,t){var n,r=a[e];return r||(a[e]=r={}),t in r||(n=document.createElement(e),r[t]=n[t]),r[t]},injection:i};t.exports=u},{133:133}],11:[function(e,t,n){"use strict";function r(e,t){return null==t||o.hasBooleanValue[e]&&!t||o.hasNumericValue[e]&&isNaN(t)||o.hasPositiveNumericValue[e]&&1>t||o.hasOverloadedBooleanValue[e]&&t===!1}var o=e(10),i=e(143),a=(e(150),{createMarkupForID:function(e){return o.ID_ATTRIBUTE_NAME+"="+i(e)},createMarkupForProperty:function(e,t){if(o.isStandardName.hasOwnProperty(e)&&o.isStandardName[e]){if(r(e,t))return"";var n=o.getAttributeName[e];return o.hasBooleanValue[e]||o.hasOverloadedBooleanValue[e]&&t===!0?n:n+"="+i(t)}return o.isCustomAttribute(e)?null==t?"":e+"="+i(t):null},setValueForProperty:function(e,t,n){if(o.isStandardName.hasOwnProperty(t)&&o.isStandardName[t]){var i=o.getMutationMethod[t];if(i)i(e,n);else if(r(t,n))this.deleteValueForProperty(e,t);else if(o.mustUseAttribute[t])e.setAttribute(o.getAttributeName[t],""+n);else{var a=o.getPropertyName[t];o.hasSideEffects[t]&&""+e[a]==""+n||(e[a]=n)}}else o.isCustomAttribute(t)&&(null==n?e.removeAttribute(t):e.setAttribute(t,""+n))},deleteValueForProperty:function(e,t){if(o.isStandardName.hasOwnProperty(t)&&o.isStandardName[t]){var n=o.getMutationMethod[t];if(n)n(e,void 0);else if(o.mustUseAttribute[t])e.removeAttribute(o.getAttributeName[t]);else{var r=o.getPropertyName[t],i=o.getDefaultValueForProperty(e.nodeName,r);o.hasSideEffects[t]&&""+e[r]===i||(e[r]=i)}}else o.isCustomAttribute(t)&&e.removeAttribute(t)}});t.exports=a},{10:10,143:143,150:150}],12:[function(e,t,n){"use strict";function r(e){return e.substring(1,e.indexOf(" "))}var o=e(21),i=e(110),a=e(112),u=e(125),s=e(133),l=/^(<[^ \/>]+)/,c="data-danger-index",p={dangerouslyRenderMarkup:function(e){s(o.canUseDOM);for(var t,n={},p=0;p<e.length;p++)s(e[p]),t=r(e[p]),t=u(t)?t:"*",n[t]=n[t]||[],n[t][p]=e[p];var d=[],f=0;for(t in n)if(n.hasOwnProperty(t)){var h,m=n[t];for(h in m)if(m.hasOwnProperty(h)){var v=m[h];m[h]=v.replace(l,"$1 "+c+'="'+h+'" ')}for(var g=i(m.join(""),a),y=0;y<g.length;++y){var C=g[y];C.hasAttribute&&C.hasAttribute(c)&&(h=+C.getAttribute(c),C.removeAttribute(c),s(!d.hasOwnProperty(h)),d[h]=C,f+=1)}}return s(f===d.length),s(d.length===e.length),d},dangerouslyReplaceNodeWithMarkup:function(e,t){s(o.canUseDOM),s(t),s("html"!==e.tagName.toLowerCase());var n=i(t,a)[0];e.parentNode.replaceChild(n,e)}};t.exports=p},{110:110,112:112,125:125,133:133,21:21}],13:[function(e,t,n){"use strict";var r=e(139),o=[r({ResponderEventPlugin:null}),r({SimpleEventPlugin:null}),r({TapEventPlugin:null}),r({EnterLeaveEventPlugin:null}),r({ChangeEventPlugin:null}),r({SelectEventPlugin:null}),r({BeforeInputEventPlugin:null}),r({AnalyticsEventPlugin:null}),r({MobileSafariClickEventPlugin:null})];t.exports=o},{139:139}],14:[function(e,t,n){"use strict";var r=e(15),o=e(20),i=e(97),a=e(68),u=e(139),s=r.topLevelTypes,l=a.getFirstReactDOM,c={mouseEnter:{registrationName:u({onMouseEnter:null}),dependencies:[s.topMouseOut,s.topMouseOver]},mouseLeave:{registrationName:u({onMouseLeave:null}),dependencies:[s.topMouseOut,s.topMouseOver]}},p=[null,null],d={eventTypes:c,extractEvents:function(e,t,n,r){if(e===s.topMouseOver&&(r.relatedTarget||r.fromElement))return null;if(e!==s.topMouseOut&&e!==s.topMouseOver)return null;var u;if(t.window===t)u=t;else{var d=t.ownerDocument;u=d?d.defaultView||d.parentWindow:window}var f,h;if(e===s.topMouseOut?(f=t,h=l(r.relatedTarget||r.toElement)||u):(f=u,h=t),f===h)return null;var m=f?a.getID(f):"",v=h?a.getID(h):"",g=i.getPooled(c.mouseLeave,m,r);g.type="mouseleave",g.target=f,g.relatedTarget=h;var y=i.getPooled(c.mouseEnter,v,r);return y.type="mouseenter",y.target=h,y.relatedTarget=f,o.accumulateEnterLeaveDispatches(g,y,m,v),p[0]=g,p[1]=y,p}};t.exports=d},{139:139,15:15,20:20,68:68,97:97}],15:[function(e,t,n){"use strict";var r=e(138),o=r({bubbled:null,captured:null}),i=r({topBlur:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topContextMenu:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topError:null,topFocus:null,topInput:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topLoad:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topReset:null,topScroll:null,topSelectionChange:null,topSubmit:null,topTextInput:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topWheel:null}),a={topLevelTypes:i,PropagationPhases:o};t.exports=a},{138:138}],16:[function(e,t,n){var r=e(112),o={listen:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}}):e.attachEvent?(e.attachEvent("on"+t,n),{remove:function(){e.detachEvent("on"+t,n)}}):void 0},capture:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!0),{remove:function(){e.removeEventListener(t,n,!0)}}):{remove:r}},registerDefault:function(){}};t.exports=o},{112:112}],17:[function(e,t,n){"use strict";var r=e(18),o=e(19),i=e(103),a=e(118),u=e(133),s={},l=null,c=function(e){if(e){var t=o.executeDispatch,n=r.getPluginModuleForEvent(e);n&&n.executeDispatch&&(t=n.executeDispatch),o.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e)}},p=null,d={injection:{injectMount:o.injection.injectMount,injectInstanceHandle:function(e){p=e},getInstanceHandle:function(){return p},injectEventPluginOrder:r.injectEventPluginOrder,injectEventPluginsByName:r.injectEventPluginsByName},eventNameDispatchConfigs:r.eventNameDispatchConfigs,registrationNameModules:r.registrationNameModules,putListener:function(e,t,n){u(!n||"function"==typeof n);var r=s[t]||(s[t]={});r[e]=n},getListener:function(e,t){var n=s[t];return n&&n[e]},deleteListener:function(e,t){var n=s[t];n&&delete n[e]},deleteAllListeners:function(e){for(var t in s)delete s[t][e]},extractEvents:function(e,t,n,o){for(var a,u=r.plugins,s=0,l=u.length;l>s;s++){var c=u[s];if(c){var p=c.extractEvents(e,t,n,o);p&&(a=i(a,p))}}return a},enqueueEvents:function(e){e&&(l=i(l,e))},processEventQueue:function(){var e=l;l=null,a(e,c),u(!l)},__purge:function(){s={}},__getListenerBank:function(){return s}};t.exports=d},{103:103,118:118,133:133,18:18,19:19}],18:[function(e,t,n){"use strict";function r(){if(u)for(var e in s){var t=s[e],n=u.indexOf(e);if(a(n>-1),!l.plugins[n]){a(t.extractEvents),l.plugins[n]=t;var r=t.eventTypes;for(var i in r)a(o(r[i],t,i))}}}function o(e,t,n){a(!l.eventNameDispatchConfigs.hasOwnProperty(n)),l.eventNameDispatchConfigs[n]=e;var r=e.phasedRegistrationNames;if(r){for(var o in r)if(r.hasOwnProperty(o)){var u=r[o];i(u,t,n)}return!0}return e.registrationName?(i(e.registrationName,t,n),!0):!1}function i(e,t,n){a(!l.registrationNameModules[e]),l.registrationNameModules[e]=t,l.registrationNameDependencies[e]=t.eventTypes[n].dependencies}var a=e(133),u=null,s={},l={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},injectEventPluginOrder:function(e){a(!u),u=Array.prototype.slice.call(e),r()},injectEventPluginsByName:function(e){var t=!1;for(var n in e)if(e.hasOwnProperty(n)){var o=e[n];s.hasOwnProperty(n)&&s[n]===o||(a(!s[n]),s[n]=o,t=!0)}t&&r()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return l.registrationNameModules[t.registrationName]||null;for(var n in t.phasedRegistrationNames)if(t.phasedRegistrationNames.hasOwnProperty(n)){var r=l.registrationNameModules[t.phasedRegistrationNames[n]];if(r)return r}return null},_resetEventPlugins:function(){u=null;for(var e in s)s.hasOwnProperty(e)&&delete s[e];l.plugins.length=0;var t=l.eventNameDispatchConfigs;for(var n in t)t.hasOwnProperty(n)&&delete t[n];var r=l.registrationNameModules;for(var o in r)r.hasOwnProperty(o)&&delete r[o]}};t.exports=l},{133:133}],19:[function(e,t,n){"use strict";function r(e){return e===v.topMouseUp||e===v.topTouchEnd||e===v.topTouchCancel}function o(e){return e===v.topMouseMove||e===v.topTouchMove}function i(e){return e===v.topMouseDown||e===v.topTouchStart}function a(e,t){var n=e._dispatchListeners,r=e._dispatchIDs;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)t(e,n[o],r[o]);else n&&t(e,n,r)}function u(e,t,n){e.currentTarget=m.Mount.getNode(n);var r=t(e,n);return e.currentTarget=null,r}function s(e,t){a(e,t),e._dispatchListeners=null,e._dispatchIDs=null}function l(e){var t=e._dispatchListeners,n=e._dispatchIDs;if(Array.isArray(t)){for(var r=0;r<t.length&&!e.isPropagationStopped();r++)if(t[r](e,n[r]))return n[r]}else if(t&&t(e,n))return n;return null}function c(e){var t=l(e);return e._dispatchIDs=null,e._dispatchListeners=null,t}function p(e){var t=e._dispatchListeners,n=e._dispatchIDs;h(!Array.isArray(t));var r=t?t(e,n):null;return e._dispatchListeners=null,e._dispatchIDs=null,r}function d(e){return!!e._dispatchListeners}var f=e(15),h=e(133),m={Mount:null,injectMount:function(e){m.Mount=e}},v=f.topLevelTypes,g={isEndish:r,isMoveish:o,isStartish:i,executeDirectDispatch:p,executeDispatch:u,executeDispatchesInOrder:s,executeDispatchesInOrderStopAtTrue:c,hasDispatches:d,injection:m,useTouchEvents:!1};t.exports=g},{133:133,15:15}],20:[function(e,t,n){"use strict";function r(e,t,n){var r=t.dispatchConfig.phasedRegistrationNames[n];return v(e,r)}function o(e,t,n){var o=t?m.bubbled:m.captured,i=r(e,n,o);i&&(n._dispatchListeners=f(n._dispatchListeners,i),n._dispatchIDs=f(n._dispatchIDs,e))}function i(e){e&&e.dispatchConfig.phasedRegistrationNames&&d.injection.getInstanceHandle().traverseTwoPhase(e.dispatchMarker,o,e)}function a(e,t,n){if(n&&n.dispatchConfig.registrationName){var r=n.dispatchConfig.registrationName,o=v(e,r);o&&(n._dispatchListeners=f(n._dispatchListeners,o),n._dispatchIDs=f(n._dispatchIDs,e))}}function u(e){e&&e.dispatchConfig.registrationName&&a(e.dispatchMarker,null,e)}function s(e){h(e,i)}function l(e,t,n,r){d.injection.getInstanceHandle().traverseEnterLeave(n,r,a,e,t)}function c(e){h(e,u)}var p=e(15),d=e(17),f=e(103),h=e(118),m=p.PropagationPhases,v=d.getListener,g={accumulateTwoPhaseDispatches:s,accumulateDirectDispatches:c,accumulateEnterLeaveDispatches:l};t.exports=g},{103:103,118:118,15:15,17:17}],21:[function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};t.exports=o},{}],22:[function(e,t,n){"use strict";function r(e){this._root=e,this._startText=this.getText(),this._fallbackText=null}var o=e(28),i=e(27),a=e(128);i(r.prototype,{getText:function(){return"value"in this._root?this._root.value:this._root[a()]},getData:function(){if(this._fallbackText)return this._fallbackText;var e,t,n=this._startText,r=n.length,o=this.getText(),i=o.length;for(e=0;r>e&&n[e]===o[e];e++);var a=r-e;for(t=1;a>=t&&n[r-t]===o[i-t];t++);var u=t>1?1-t:void 0;return this._fallbackText=o.slice(e,u),this._fallbackText}}),o.addPoolingTo(r),t.exports=r},{128:128,27:27,28:28}],23:[function(e,t,n){"use strict";var r,o=e(10),i=e(21),a=o.injection.MUST_USE_ATTRIBUTE,u=o.injection.MUST_USE_PROPERTY,s=o.injection.HAS_BOOLEAN_VALUE,l=o.injection.HAS_SIDE_EFFECTS,c=o.injection.HAS_NUMERIC_VALUE,p=o.injection.HAS_POSITIVE_NUMERIC_VALUE,d=o.injection.HAS_OVERLOADED_BOOLEAN_VALUE;if(i.canUseDOM){var f=document.implementation;r=f&&f.hasFeature&&f.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")}var h={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,acceptCharset:null,accessKey:null,action:null,allowFullScreen:a|s,allowTransparency:a,alt:null,async:s,autoComplete:null,autoPlay:s,cellPadding:null,cellSpacing:null,charSet:a,checked:u|s,classID:a,className:r?a:u,cols:a|p,colSpan:null,content:null,contentEditable:null,contextMenu:a,controls:u|s,coords:null,crossOrigin:null,data:null,dateTime:a,defer:s,dir:null,disabled:a|s,download:d,draggable:null,encType:null,form:a,formAction:a,formEncType:a,formMethod:a,formNoValidate:s,formTarget:a,frameBorder:a,headers:null,height:a,hidden:a|s,high:null,href:null,hrefLang:null,htmlFor:null,httpEquiv:null,icon:null,id:u,label:null,lang:null,list:a,loop:u|s,low:null,manifest:a,marginHeight:null,marginWidth:null,max:null,maxLength:a,media:a,mediaGroup:null,method:null,min:null,multiple:u|s,muted:u|s,name:null,noValidate:s,open:s,optimum:null,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:u|s,rel:null,required:s,role:a,rows:a|p,rowSpan:null,sandbox:null,scope:null,scoped:s,scrolling:null,seamless:a|s,selected:u|s,shape:null,size:a|p,sizes:a,span:p,spellCheck:null,src:null,srcDoc:u,srcSet:a,start:c,step:null,style:null,tabIndex:null,target:null,title:null,type:null,useMap:null,value:u|l,width:a,wmode:a,autoCapitalize:null,autoCorrect:null,itemProp:a,itemScope:a|s,itemType:a,itemID:a,itemRef:a,property:null,unselectable:a},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMPropertyNames:{autoCapitalize:"autocapitalize",autoComplete:"autocomplete",autoCorrect:"autocorrect",autoFocus:"autofocus",autoPlay:"autoplay",encType:"encoding",hrefLang:"hreflang",radioGroup:"radiogroup",spellCheck:"spellcheck",srcDoc:"srcdoc",srcSet:"srcset"}};t.exports=h},{10:10,21:21}],24:[function(e,t,n){"use strict";function r(e){l(null==e.props.checkedLink||null==e.props.valueLink)}function o(e){r(e),l(null==e.props.value&&null==e.props.onChange)}function i(e){r(e),l(null==e.props.checked&&null==e.props.onChange)}function a(e){this.props.valueLink.requestChange(e.target.value)}function u(e){this.props.checkedLink.requestChange(e.target.checked)}var s=e(76),l=e(133),c={button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0},p={Mixin:{propTypes:{value:function(e,t,n){return!e[t]||c[e.type]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t,n){return!e[t]||e.onChange||e.readOnly||e.disabled?null:new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:s.func}},getValue:function(e){return e.props.valueLink?(o(e),e.props.valueLink.value):e.props.value},getChecked:function(e){return e.props.checkedLink?(i(e),e.props.checkedLink.value):e.props.checked},getOnChange:function(e){return e.props.valueLink?(o(e),a):e.props.checkedLink?(i(e),u):e.props.onChange}};t.exports=p},{133:133,76:76}],25:[function(e,t,n){"use strict";function r(e){e.remove()}var o=e(30),i=e(103),a=e(118),u=e(133),s={trapBubbledEvent:function(e,t){u(this.isMounted());var n=this.getDOMNode();u(n);var r=o.trapBubbledEvent(e,t,n);this._localEventListeners=i(this._localEventListeners,r)},componentWillUnmount:function(){this._localEventListeners&&a(this._localEventListeners,r)}};t.exports=s},{103:103,118:118,133:133,30:30}],26:[function(e,t,n){"use strict";var r=e(15),o=e(112),i=r.topLevelTypes,a={eventTypes:null,extractEvents:function(e,t,n,r){if(e===i.topTouchStart){var a=r.target;a&&!a.onclick&&(a.onclick=o)}}};t.exports=a},{112:112,15:15}],27:[function(e,t,n){"use strict";function r(e,t){if(null==e)throw new TypeError("Object.assign target cannot be null or undefined");for(var n=Object(e),r=Object.prototype.hasOwnProperty,o=1;o<arguments.length;o++){var i=arguments[o];if(null!=i){var a=Object(i);for(var u in a)r.call(a,u)&&(n[u]=a[u])}}return n}t.exports=r},{}],28:[function(e,t,n){"use strict";var r=e(133),o=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},i=function(e,t){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,e,t),r}return new n(e,t)},a=function(e,t,n){var r=this;if(r.instancePool.length){var o=r.instancePool.pop();return r.call(o,e,t,n),o}return new r(e,t,n)},u=function(e,t,n,r,o){var i=this;if(i.instancePool.length){var a=i.instancePool.pop();return i.call(a,e,t,n,r,o),a}return new i(e,t,n,r,o)},s=function(e){var t=this;r(e instanceof t),e.destructor&&e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},l=10,c=o,p=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||c,n.poolSize||(n.poolSize=l),n.release=s,n},d={addPoolingTo:p,oneArgumentPooler:o,twoArgumentPooler:i,threeArgumentPooler:a,fiveArgumentPooler:u};t.exports=d},{133:133}],29:[function(e,t,n){"use strict";var r=e(115),o={getDOMNode:function(){return r(this)}};t.exports=o},{115:115}],30:[function(e,t,n){"use strict";function r(e){return Object.prototype.hasOwnProperty.call(e,m)||(e[m]=f++,p[e[m]]={}),p[e[m]]}var o=e(15),i=e(17),a=e(18),u=e(59),s=e(102),l=e(27),c=e(134),p={},d=!1,f=0,h={topBlur:"blur",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTextInput:"textInput",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topWheel:"wheel"},m="_reactListenersID"+String(Math.random()).slice(2),v=l({},u,{ReactEventListener:null,injection:{injectReactEventListener:function(e){e.setHandleTopLevel(v.handleTopLevel),v.ReactEventListener=e}},setEnabled:function(e){v.ReactEventListener&&v.ReactEventListener.setEnabled(e)},isEnabled:function(){return!(!v.ReactEventListener||!v.ReactEventListener.isEnabled())},listenTo:function(e,t){for(var n=t,i=r(n),u=a.registrationNameDependencies[e],s=o.topLevelTypes,l=0,p=u.length;p>l;l++){var d=u[l];i.hasOwnProperty(d)&&i[d]||(d===s.topWheel?c("wheel")?v.ReactEventListener.trapBubbledEvent(s.topWheel,"wheel",n):c("mousewheel")?v.ReactEventListener.trapBubbledEvent(s.topWheel,"mousewheel",n):v.ReactEventListener.trapBubbledEvent(s.topWheel,"DOMMouseScroll",n):d===s.topScroll?c("scroll",!0)?v.ReactEventListener.trapCapturedEvent(s.topScroll,"scroll",n):v.ReactEventListener.trapBubbledEvent(s.topScroll,"scroll",v.ReactEventListener.WINDOW_HANDLE):d===s.topFocus||d===s.topBlur?(c("focus",!0)?(v.ReactEventListener.trapCapturedEvent(s.topFocus,"focus",n),v.ReactEventListener.trapCapturedEvent(s.topBlur,"blur",n)):c("focusin")&&(v.ReactEventListener.trapBubbledEvent(s.topFocus,"focusin",n),v.ReactEventListener.trapBubbledEvent(s.topBlur,"focusout",n)),i[s.topBlur]=!0,i[s.topFocus]=!0):h.hasOwnProperty(d)&&v.ReactEventListener.trapBubbledEvent(d,h[d],n),i[d]=!0)}},trapBubbledEvent:function(e,t,n){
return v.ReactEventListener.trapBubbledEvent(e,t,n)},trapCapturedEvent:function(e,t,n){return v.ReactEventListener.trapCapturedEvent(e,t,n)},ensureScrollValueMonitoring:function(){if(!d){var e=s.refreshScrollValues;v.ReactEventListener.monitorScrollValue(e),d=!0}},eventNameDispatchConfigs:i.eventNameDispatchConfigs,registrationNameModules:i.registrationNameModules,putListener:i.putListener,getListener:i.getListener,deleteListener:i.deleteListener,deleteAllListeners:i.deleteAllListeners});t.exports=v},{102:102,134:134,15:15,17:17,18:18,27:27,59:59}],31:[function(e,t,n){"use strict";var r=e(79),o=e(116),i=e(132),a=e(147),u={instantiateChildren:function(e,t,n){var r=o(e);for(var a in r)if(r.hasOwnProperty(a)){var u=r[a],s=i(u,null);r[a]=s}return r},updateChildren:function(e,t,n,u){var s=o(t);if(!s&&!e)return null;var l;for(l in s)if(s.hasOwnProperty(l)){var c=e&&e[l],p=c&&c._currentElement,d=s[l];if(a(p,d))r.receiveComponent(c,d,n,u),s[l]=c;else{c&&r.unmountComponent(c,l);var f=i(d,null);s[l]=f}}for(l in e)!e.hasOwnProperty(l)||s&&s.hasOwnProperty(l)||r.unmountComponent(e[l]);return s},unmountChildren:function(e){for(var t in e){var n=e[t];r.unmountComponent(n)}}};t.exports=u},{116:116,132:132,147:147,79:79}],32:[function(e,t,n){"use strict";function r(e,t){this.forEachFunction=e,this.forEachContext=t}function o(e,t,n,r){var o=e;o.forEachFunction.call(o.forEachContext,t,r)}function i(e,t,n){if(null==e)return e;var i=r.getPooled(t,n);f(e,o,i),r.release(i)}function a(e,t,n){this.mapResult=e,this.mapFunction=t,this.mapContext=n}function u(e,t,n,r){var o=e,i=o.mapResult,a=!i.hasOwnProperty(n);if(a){var u=o.mapFunction.call(o.mapContext,t,r);i[n]=u}}function s(e,t,n){if(null==e)return e;var r={},o=a.getPooled(r,t,n);return f(e,u,o),a.release(o),d.create(r)}function l(e,t,n,r){return null}function c(e,t){return f(e,l,null)}var p=e(28),d=e(61),f=e(149),h=(e(150),p.twoArgumentPooler),m=p.threeArgumentPooler;p.addPoolingTo(r,h),p.addPoolingTo(a,m);var v={forEach:i,map:s,count:c};t.exports=v},{149:149,150:150,28:28,61:61}],33:[function(e,t,n){"use strict";function r(e,t){var n=D.hasOwnProperty(t)?D[t]:null;N.hasOwnProperty(t)&&y(n===_.OVERRIDE_BASE),e.hasOwnProperty(t)&&y(n===_.DEFINE_MANY||n===_.DEFINE_MANY_MERGED)}function o(e,t){if(t){y("function"!=typeof t),y(!d.isValidElement(t));var n=e.prototype;t.hasOwnProperty(b)&&M.mixins(e,t.mixins);for(var o in t)if(t.hasOwnProperty(o)&&o!==b){var i=t[o];if(r(n,o),M.hasOwnProperty(o))M[o](e,i);else{var a=D.hasOwnProperty(o),l=n.hasOwnProperty(o),c=i&&i.__reactDontBind,p="function"==typeof i,f=p&&!a&&!l&&!c;if(f)n.__reactAutoBindMap||(n.__reactAutoBindMap={}),n.__reactAutoBindMap[o]=i,n[o]=i;else if(l){var h=D[o];y(a&&(h===_.DEFINE_MANY_MERGED||h===_.DEFINE_MANY)),h===_.DEFINE_MANY_MERGED?n[o]=u(n[o],i):h===_.DEFINE_MANY&&(n[o]=s(n[o],i))}else n[o]=i}}}}function i(e,t){if(t)for(var n in t){var r=t[n];if(t.hasOwnProperty(n)){var o=n in M;y(!o);var i=n in e;y(!i),e[n]=r}}}function a(e,t){y(e&&t&&"object"==typeof e&&"object"==typeof t);for(var n in t)t.hasOwnProperty(n)&&(y(void 0===e[n]),e[n]=t[n]);return e}function u(e,t){return function(){var n=e.apply(this,arguments),r=t.apply(this,arguments);if(null==n)return r;if(null==r)return n;var o={};return a(o,n),a(o,r),o}}function s(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function l(e,t){var n=t.bind(e);return n}function c(e){for(var t in e.__reactAutoBindMap)if(e.__reactAutoBindMap.hasOwnProperty(t)){var n=e.__reactAutoBindMap[t];e[t]=l(e,f.guard(n,e.constructor.displayName+"."+t))}}var p=e(34),d=(e(39),e(55)),f=e(58),h=e(65),m=e(66),v=(e(75),e(74),e(84)),g=e(27),y=e(133),C=e(138),E=e(139),b=(e(150),E({mixins:null})),_=C({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null}),x=[],D={mixins:_.DEFINE_MANY,statics:_.DEFINE_MANY,propTypes:_.DEFINE_MANY,contextTypes:_.DEFINE_MANY,childContextTypes:_.DEFINE_MANY,getDefaultProps:_.DEFINE_MANY_MERGED,getInitialState:_.DEFINE_MANY_MERGED,getChildContext:_.DEFINE_MANY_MERGED,render:_.DEFINE_ONCE,componentWillMount:_.DEFINE_MANY,componentDidMount:_.DEFINE_MANY,componentWillReceiveProps:_.DEFINE_MANY,shouldComponentUpdate:_.DEFINE_ONCE,componentWillUpdate:_.DEFINE_MANY,componentDidUpdate:_.DEFINE_MANY,componentWillUnmount:_.DEFINE_MANY,updateComponent:_.OVERRIDE_BASE},M={displayName:function(e,t){e.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)o(e,t[n])},childContextTypes:function(e,t){e.childContextTypes=g({},e.childContextTypes,t)},contextTypes:function(e,t){e.contextTypes=g({},e.contextTypes,t)},getDefaultProps:function(e,t){e.getDefaultProps?e.getDefaultProps=u(e.getDefaultProps,t):e.getDefaultProps=t},propTypes:function(e,t){e.propTypes=g({},e.propTypes,t)},statics:function(e,t){i(e,t)}},N={replaceState:function(e,t){v.enqueueReplaceState(this,e),t&&v.enqueueCallback(this,t)},isMounted:function(){var e=h.get(this);return e&&e!==m.currentlyMountingInstance},setProps:function(e,t){v.enqueueSetProps(this,e),t&&v.enqueueCallback(this,t)},replaceProps:function(e,t){v.enqueueReplaceProps(this,e),t&&v.enqueueCallback(this,t)}},I=function(){};g(I.prototype,p.prototype,N);var T={createClass:function(e){var t=function(e,t){this.__reactAutoBindMap&&c(this),this.props=e,this.context=t,this.state=null;var n=this.getInitialState?this.getInitialState():null;y("object"==typeof n&&!Array.isArray(n)),this.state=n};t.prototype=new I,t.prototype.constructor=t,x.forEach(o.bind(null,t)),o(t,e),t.getDefaultProps&&(t.defaultProps=t.getDefaultProps()),y(t.prototype.render);for(var n in D)t.prototype[n]||(t.prototype[n]=null);return t.type=t,t},injection:{injectMixin:function(e){x.push(e)}}};t.exports=T},{133:133,138:138,139:139,150:150,27:27,34:34,39:39,55:55,58:58,65:65,66:66,74:74,75:75,84:84}],34:[function(e,t,n){"use strict";function r(e,t){this.props=e,this.context=t}{var o=e(84),i=e(133);e(150)}r.prototype.setState=function(e,t){i("object"==typeof e||"function"==typeof e||null==e),o.enqueueSetState(this,e),t&&o.enqueueCallback(this,t)},r.prototype.forceUpdate=function(e){o.enqueueForceUpdate(this),e&&o.enqueueCallback(this,e)};t.exports=r},{133:133,150:150,84:84}],35:[function(e,t,n){"use strict";var r=e(44),o=e(68),i={processChildrenUpdates:r.dangerouslyProcessChildrenUpdates,replaceNodeWithMarkupByID:r.dangerouslyReplaceNodeWithMarkupByID,unmountIDFromEnvironment:function(e){o.purgeID(e)}};t.exports=i},{44:44,68:68}],36:[function(e,t,n){"use strict";var r=e(133),o=!1,i={unmountIDFromEnvironment:null,replaceNodeWithMarkupByID:null,processChildrenUpdates:null,injection:{injectEnvironment:function(e){r(!o),i.unmountIDFromEnvironment=e.unmountIDFromEnvironment,i.replaceNodeWithMarkupByID=e.replaceNodeWithMarkupByID,i.processChildrenUpdates=e.processChildrenUpdates,o=!0}}};t.exports=i},{133:133}],37:[function(e,t,n){"use strict";function r(e){var t=e._currentElement._owner||null;if(t){var n=t.getName();if(n)return" Check the render method of `"+n+"`."}return""}var o=e(36),i=e(38),a=e(39),u=e(55),s=(e(56),e(65)),l=e(66),c=e(71),p=e(73),d=e(75),f=(e(74),e(79)),h=e(85),m=e(27),v=e(113),g=e(133),y=e(147),C=(e(150),1),E={construct:function(e){this._currentElement=e,this._rootNodeID=null,this._instance=null,this._pendingElement=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._renderedComponent=null,this._context=null,this._mountOrder=0,this._isTopLevel=!1,this._pendingCallbacks=null},mountComponent:function(e,t,n){this._context=n,this._mountOrder=C++,this._rootNodeID=e;var r=this._processProps(this._currentElement.props),o=this._processContext(this._currentElement._context),i=c.getComponentClassForElement(this._currentElement),a=new i(r,o);a.props=r,a.context=o,a.refs=v,this._instance=a,s.set(a,this);var u=a.state;void 0===u&&(a.state=u=null),g("object"==typeof u&&!Array.isArray(u)),this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1;var p,d,h=l.currentlyMountingInstance;l.currentlyMountingInstance=this;try{a.componentWillMount&&(a.componentWillMount(),this._pendingStateQueue&&(a.state=this._processPendingState(a.props,a.context))),p=this._getValidatedChildContext(n),d=this._renderValidatedComponent(p)}finally{l.currentlyMountingInstance=h}this._renderedComponent=this._instantiateReactComponent(d,this._currentElement.type);var m=f.mountComponent(this._renderedComponent,e,t,this._mergeChildContext(n,p));return a.componentDidMount&&t.getReactMountReady().enqueue(a.componentDidMount,a),m},unmountComponent:function(){var e=this._instance;if(e.componentWillUnmount){var t=l.currentlyUnmountingInstance;l.currentlyUnmountingInstance=this;try{e.componentWillUnmount()}finally{l.currentlyUnmountingInstance=t}}f.unmountComponent(this._renderedComponent),this._renderedComponent=null,this._pendingStateQueue=null,this._pendingReplaceState=!1,this._pendingForceUpdate=!1,this._pendingCallbacks=null,this._pendingElement=null,this._context=null,this._rootNodeID=null,s.remove(e)},_setPropsInternal:function(e,t){var n=this._pendingElement||this._currentElement;this._pendingElement=u.cloneAndReplaceProps(n,m({},n.props,e)),h.enqueueUpdate(this,t)},_maskContext:function(e){var t=null;if("string"==typeof this._currentElement.type)return v;var n=this._currentElement.type.contextTypes;if(!n)return v;t={};for(var r in n)t[r]=e[r];return t},_processContext:function(e){var t=this._maskContext(e);return t},_getValidatedChildContext:function(e){var t=this._instance,n=t.getChildContext&&t.getChildContext();if(n){g("object"==typeof t.constructor.childContextTypes);for(var r in n)g(r in t.constructor.childContextTypes);return n}return null},_mergeChildContext:function(e,t){return t?m({},e,t):e},_processProps:function(e){return e},_checkPropTypes:function(e,t,n){var o=this.getName();for(var i in e)if(e.hasOwnProperty(i)){var a;try{g("function"==typeof e[i]),a=e[i](t,i,o,n)}catch(u){a=u}a instanceof Error&&(r(this),n===d.prop)}},receiveComponent:function(e,t,n){var r=this._currentElement,o=this._context;this._pendingElement=null,this.updateComponent(t,r,e,o,n)},performUpdateIfNecessary:function(e){null!=this._pendingElement&&f.receiveComponent(this,this._pendingElement||this._currentElement,e,this._context),(null!==this._pendingStateQueue||this._pendingForceUpdate)&&this.updateComponent(e,this._currentElement,this._currentElement,this._context,this._context)},_warnIfContextsDiffer:function(e,t){e=this._maskContext(e),t=this._maskContext(t);for(var n=Object.keys(t).sort(),r=(this.getName()||"ReactCompositeComponent",0);r<n.length;r++)n[r]},updateComponent:function(e,t,n,r,o){var i=this._instance,a=i.context,u=i.props;t!==n&&(a=this._processContext(n._context),u=this._processProps(n.props),i.componentWillReceiveProps&&i.componentWillReceiveProps(u,a));var s=this._processPendingState(u,a),l=this._pendingForceUpdate||!i.shouldComponentUpdate||i.shouldComponentUpdate(u,s,a);l?(this._pendingForceUpdate=!1,this._performComponentUpdate(n,u,s,a,e,o)):(this._currentElement=n,this._context=o,i.props=u,i.state=s,i.context=a)},_processPendingState:function(e,t){var n=this._instance,r=this._pendingStateQueue,o=this._pendingReplaceState;if(this._pendingReplaceState=!1,this._pendingStateQueue=null,!r)return n.state;if(o&&1===r.length)return r[0];for(var i=m({},o?r[0]:n.state),a=o?1:0;a<r.length;a++){var u=r[a];m(i,"function"==typeof u?u.call(n,i,e,t):u)}return i},_performComponentUpdate:function(e,t,n,r,o,i){var a=this._instance,u=a.props,s=a.state,l=a.context;a.componentWillUpdate&&a.componentWillUpdate(t,n,r),this._currentElement=e,this._context=i,a.props=t,a.state=n,a.context=r,this._updateRenderedComponent(o,i),a.componentDidUpdate&&o.getReactMountReady().enqueue(a.componentDidUpdate.bind(a,u,s,l),a)},_updateRenderedComponent:function(e,t){var n=this._renderedComponent,r=n._currentElement,o=this._getValidatedChildContext(),i=this._renderValidatedComponent(o);if(y(r,i))f.receiveComponent(n,i,e,this._mergeChildContext(t,o));else{var a=this._rootNodeID,u=n._rootNodeID;f.unmountComponent(n),this._renderedComponent=this._instantiateReactComponent(i,this._currentElement.type);var s=f.mountComponent(this._renderedComponent,a,e,this._mergeChildContext(t,o));this._replaceNodeWithMarkupByID(u,s)}},_replaceNodeWithMarkupByID:function(e,t){o.replaceNodeWithMarkupByID(e,t)},_renderValidatedComponentWithoutOwnerOrContext:function(){var e=this._instance,t=e.render();return t},_renderValidatedComponent:function(e){var t,n=i.current;i.current=this._mergeChildContext(this._currentElement._context,e),a.current=this;try{t=this._renderValidatedComponentWithoutOwnerOrContext()}finally{i.current=n,a.current=null}return g(null===t||t===!1||u.isValidElement(t)),t},attachRef:function(e,t){var n=this.getPublicInstance(),r=n.refs===v?n.refs={}:n.refs;r[e]=t.getPublicInstance()},detachRef:function(e){var t=this.getPublicInstance().refs;delete t[e]},getName:function(){var e=this._currentElement.type,t=this._instance&&this._instance.constructor;return e.displayName||t&&t.displayName||e.name||t&&t.name||null},getPublicInstance:function(){return this._instance},_instantiateReactComponent:null};p.measureMethods(E,"ReactCompositeComponent",{mountComponent:"mountComponent",updateComponent:"updateComponent",_renderValidatedComponent:"_renderValidatedComponent"});var b={Mixin:E};t.exports=b},{113:113,133:133,147:147,150:150,27:27,36:36,38:38,39:39,55:55,56:56,65:65,66:66,71:71,73:73,74:74,75:75,79:79,85:85}],38:[function(e,t,n){"use strict";var r=e(27),o=e(113),i=(e(150),{current:o,withContext:function(e,t){var n,o=i.current;i.current=r({},o,e);try{n=t()}finally{i.current=o}return n}});t.exports=i},{113:113,150:150,27:27}],39:[function(e,t,n){"use strict";var r={current:null};t.exports=r},{}],40:[function(e,t,n){"use strict";function r(e){return o.createFactory(e)}var o=e(55),i=(e(56),e(140)),a=i({a:"a",abbr:"abbr",address:"address",area:"area",article:"article",aside:"aside",audio:"audio",b:"b",base:"base",bdi:"bdi",bdo:"bdo",big:"big",blockquote:"blockquote",body:"body",br:"br",button:"button",canvas:"canvas",caption:"caption",cite:"cite",code:"code",col:"col",colgroup:"colgroup",data:"data",datalist:"datalist",dd:"dd",del:"del",details:"details",dfn:"dfn",dialog:"dialog",div:"div",dl:"dl",dt:"dt",em:"em",embed:"embed",fieldset:"fieldset",figcaption:"figcaption",figure:"figure",footer:"footer",form:"form",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",head:"head",header:"header",hr:"hr",html:"html",i:"i",iframe:"iframe",img:"img",input:"input",ins:"ins",kbd:"kbd",keygen:"keygen",label:"label",legend:"legend",li:"li",link:"link",main:"main",map:"map",mark:"mark",menu:"menu",menuitem:"menuitem",meta:"meta",meter:"meter",nav:"nav",noscript:"noscript",object:"object",ol:"ol",optgroup:"optgroup",option:"option",output:"output",p:"p",param:"param",picture:"picture",pre:"pre",progress:"progress",q:"q",rp:"rp",rt:"rt",ruby:"ruby",s:"s",samp:"samp",script:"script",section:"section",select:"select",small:"small",source:"source",span:"span",strong:"strong",style:"style",sub:"sub",summary:"summary",sup:"sup",table:"table",tbody:"tbody",td:"td",textarea:"textarea",tfoot:"tfoot",th:"th",thead:"thead",time:"time",title:"title",tr:"tr",track:"track",u:"u",ul:"ul","var":"var",video:"video",wbr:"wbr",circle:"circle",clipPath:"clipPath",defs:"defs",ellipse:"ellipse",g:"g",line:"line",linearGradient:"linearGradient",mask:"mask",path:"path",pattern:"pattern",polygon:"polygon",polyline:"polyline",radialGradient:"radialGradient",rect:"rect",stop:"stop",svg:"svg",text:"text",tspan:"tspan"},r);t.exports=a},{140:140,55:55,56:56}],41:[function(e,t,n){"use strict";var r=e(2),o=e(29),i=e(33),a=e(55),u=e(138),s=a.createFactory("button"),l=u({onClick:!0,onDoubleClick:!0,onMouseDown:!0,onMouseMove:!0,onMouseUp:!0,onClickCapture:!0,onDoubleClickCapture:!0,onMouseDownCapture:!0,onMouseMoveCapture:!0,onMouseUpCapture:!0}),c=i.createClass({displayName:"ReactDOMButton",tagName:"BUTTON",mixins:[r,o],render:function(){var e={};for(var t in this.props)!this.props.hasOwnProperty(t)||this.props.disabled&&l[t]||(e[t]=this.props[t]);return s(e,this.props.children)}});t.exports=c},{138:138,2:2,29:29,33:33,55:55}],42:[function(e,t,n){"use strict";function r(e){e&&(null!=e.dangerouslySetInnerHTML&&(g(null==e.children),g("object"==typeof e.dangerouslySetInnerHTML&&"__html"in e.dangerouslySetInnerHTML)),g(null==e.style||"object"==typeof e.style))}function o(e,t,n,r){var o=d.findReactContainerForID(e);if(o){var i=o.nodeType===D?o.ownerDocument:o;E(t,i)}r.getPutListenerQueue().enqueuePutListener(e,t,n)}function i(e){P.call(T,e)||(g(I.test(e)),T[e]=!0)}function a(e){i(e),this._tag=e,this._renderedChildren=null,this._previousStyleCopy=null,this._rootNodeID=null}var u=e(5),s=e(10),l=e(11),c=e(30),p=e(35),d=e(68),f=e(69),h=e(73),m=e(27),v=e(114),g=e(133),y=(e(134),e(139)),C=(e(150),c.deleteListener),E=c.listenTo,b=c.registrationNameModules,_={string:!0,number:!0},x=y({style:null}),D=1,M=null,N={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},I=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,T={},P={}.hasOwnProperty;a.displayName="ReactDOMComponent",a.Mixin={construct:function(e){this._currentElement=e},mountComponent:function(e,t,n){this._rootNodeID=e,r(this._currentElement.props);var o=N[this._tag]?"":"</"+this._tag+">";return this._createOpenTagMarkupAndPutListeners(t)+this._createContentMarkup(t,n)+o},_createOpenTagMarkupAndPutListeners:function(e){var t=this._currentElement.props,n="<"+this._tag;for(var r in t)if(t.hasOwnProperty(r)){var i=t[r];if(null!=i)if(b.hasOwnProperty(r))o(this._rootNodeID,r,i,e);else{r===x&&(i&&(i=this._previousStyleCopy=m({},t.style)),i=u.createMarkupForStyles(i));var a=l.createMarkupForProperty(r,i);a&&(n+=" "+a)}}if(e.renderToStaticMarkup)return n+">";var s=l.createMarkupForID(this._rootNodeID);return n+" "+s+">"},_createContentMarkup:function(e,t){var n="";("listing"===this._tag||"pre"===this._tag||"textarea"===this._tag)&&(n="\n");var r=this._currentElement.props,o=r.dangerouslySetInnerHTML;if(null!=o){if(null!=o.__html)return n+o.__html}else{var i=_[typeof r.children]?r.children:null,a=null!=i?null:r.children;if(null!=i)return n+v(i);if(null!=a){var u=this.mountChildren(a,e,t);return n+u.join("")}}return n},receiveComponent:function(e,t,n){var r=this._currentElement;this._currentElement=e,this.updateComponent(t,r,e,n)},updateComponent:function(e,t,n,o){r(this._currentElement.props),this._updateDOMProperties(t.props,e),this._updateDOMChildren(t.props,e,o)},_updateDOMProperties:function(e,t){var n,r,i,a=this._currentElement.props;for(n in e)if(!a.hasOwnProperty(n)&&e.hasOwnProperty(n))if(n===x){var u=this._previousStyleCopy;for(r in u)u.hasOwnProperty(r)&&(i=i||{},i[r]="");this._previousStyleCopy=null}else b.hasOwnProperty(n)?C(this._rootNodeID,n):(s.isStandardName[n]||s.isCustomAttribute(n))&&M.deletePropertyByID(this._rootNodeID,n);for(n in a){var l=a[n],c=n===x?this._previousStyleCopy:e[n];if(a.hasOwnProperty(n)&&l!==c)if(n===x)if(l?l=this._previousStyleCopy=m({},l):this._previousStyleCopy=null,c){for(r in c)!c.hasOwnProperty(r)||l&&l.hasOwnProperty(r)||(i=i||{},i[r]="");for(r in l)l.hasOwnProperty(r)&&c[r]!==l[r]&&(i=i||{},i[r]=l[r])}else i=l;else b.hasOwnProperty(n)?o(this._rootNodeID,n,l,t):(s.isStandardName[n]||s.isCustomAttribute(n))&&M.updatePropertyByID(this._rootNodeID,n,l)}i&&M.updateStylesByID(this._rootNodeID,i)},_updateDOMChildren:function(e,t,n){var r=this._currentElement.props,o=_[typeof e.children]?e.children:null,i=_[typeof r.children]?r.children:null,a=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,u=r.dangerouslySetInnerHTML&&r.dangerouslySetInnerHTML.__html,s=null!=o?null:e.children,l=null!=i?null:r.children,c=null!=o||null!=a,p=null!=i||null!=u;null!=s&&null==l?this.updateChildren(null,t,n):c&&!p&&this.updateTextContent(""),null!=i?o!==i&&this.updateTextContent(""+i):null!=u?a!==u&&M.updateInnerHTMLByID(this._rootNodeID,u):null!=l&&this.updateChildren(l,t,n)},unmountComponent:function(){this.unmountChildren(),c.deleteAllListeners(this._rootNodeID),p.unmountIDFromEnvironment(this._rootNodeID),this._rootNodeID=null}},h.measureMethods(a,"ReactDOMComponent",{mountComponent:"mountComponent",updateComponent:"updateComponent"}),m(a.prototype,a.Mixin,f.Mixin),a.injection={injectIDOperations:function(e){a.BackendIDOperations=M=e}},t.exports=a},{10:10,11:11,114:114,133:133,134:134,139:139,150:150,27:27,30:30,35:35,5:5,68:68,69:69,73:73}],43:[function(e,t,n){"use strict";var r=e(15),o=e(25),i=e(29),a=e(33),u=e(55),s=u.createFactory("form"),l=a.createClass({displayName:"ReactDOMForm",tagName:"FORM",mixins:[i,o],render:function(){return s(this.props)},componentDidMount:function(){this.trapBubbledEvent(r.topLevelTypes.topReset,"reset"),this.trapBubbledEvent(r.topLevelTypes.topSubmit,"submit")}});t.exports=l},{15:15,25:25,29:29,33:33,55:55}],44:[function(e,t,n){"use strict";var r=e(5),o=e(9),i=e(11),a=e(68),u=e(73),s=e(133),l=e(144),c={dangerouslySetInnerHTML:"`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.",style:"`style` must be set using `updateStylesByID()`."},p={updatePropertyByID:function(e,t,n){var r=a.getNode(e);s(!c.hasOwnProperty(t)),null!=n?i.setValueForProperty(r,t,n):i.deleteValueForProperty(r,t)},deletePropertyByID:function(e,t,n){var r=a.getNode(e);s(!c.hasOwnProperty(t)),i.deleteValueForProperty(r,t,n)},updateStylesByID:function(e,t){var n=a.getNode(e);r.setValueForStyles(n,t)},updateInnerHTMLByID:function(e,t){var n=a.getNode(e);l(n,t)},updateTextContentByID:function(e,t){var n=a.getNode(e);o.updateTextContent(n,t)},dangerouslyReplaceNodeWithMarkupByID:function(e,t){var n=a.getNode(e);o.dangerouslyReplaceNodeWithMarkup(n,t)},dangerouslyProcessChildrenUpdates:function(e,t){for(var n=0;n<e.length;n++)e[n].parentNode=a.getNode(e[n].parentID);o.processUpdates(e,t)}};u.measureMethods(p,"ReactDOMIDOperations",{updatePropertyByID:"updatePropertyByID",deletePropertyByID:"deletePropertyByID",updateStylesByID:"updateStylesByID",updateInnerHTMLByID:"updateInnerHTMLByID",updateTextContentByID:"updateTextContentByID",dangerouslyReplaceNodeWithMarkupByID:"dangerouslyReplaceNodeWithMarkupByID",dangerouslyProcessChildrenUpdates:"dangerouslyProcessChildrenUpdates"}),t.exports=p},{11:11,133:133,144:144,5:5,68:68,73:73,9:9}],45:[function(e,t,n){"use strict";var r=e(15),o=e(25),i=e(29),a=e(33),u=e(55),s=u.createFactory("iframe"),l=a.createClass({displayName:"ReactDOMIframe",tagName:"IFRAME",mixins:[i,o],render:function(){return s(this.props)},componentDidMount:function(){this.trapBubbledEvent(r.topLevelTypes.topLoad,"load")}});t.exports=l},{15:15,25:25,29:29,33:33,55:55}],46:[function(e,t,n){"use strict";var r=e(15),o=e(25),i=e(29),a=e(33),u=e(55),s=u.createFactory("img"),l=a.createClass({displayName:"ReactDOMImg",tagName:"IMG",mixins:[i,o],render:function(){return s(this.props)},componentDidMount:function(){this.trapBubbledEvent(r.topLevelTypes.topLoad,"load"),this.trapBubbledEvent(r.topLevelTypes.topError,"error")}});t.exports=l},{15:15,25:25,29:29,33:33,55:55}],47:[function(e,t,n){"use strict";function r(){this.isMounted()&&this.forceUpdate()}var o=e(2),i=e(11),a=e(24),u=e(29),s=e(33),l=e(55),c=e(68),p=e(85),d=e(27),f=e(133),h=l.createFactory("input"),m={},v=s.createClass({displayName:"ReactDOMInput",tagName:"INPUT",mixins:[o,a.Mixin,u],getInitialState:function(){var e=this.props.defaultValue;return{initialChecked:this.props.defaultChecked||!1,initialValue:null!=e?e:null}},render:function(){var e=d({},this.props);e.defaultChecked=null,e.defaultValue=null;var t=a.getValue(this);e.value=null!=t?t:this.state.initialValue;var n=a.getChecked(this);return e.checked=null!=n?n:this.state.initialChecked,e.onChange=this._handleChange,h(e,this.props.children)},componentDidMount:function(){var e=c.getID(this.getDOMNode());m[e]=this},componentWillUnmount:function(){var e=this.getDOMNode(),t=c.getID(e);delete m[t]},componentDidUpdate:function(e,t,n){var r=this.getDOMNode();null!=this.props.checked&&i.setValueForProperty(r,"checked",this.props.checked||!1);var o=a.getValue(this);null!=o&&i.setValueForProperty(r,"value",""+o)},_handleChange:function(e){var t,n=a.getOnChange(this);n&&(t=n.call(this,e)),p.asap(r,this);var o=this.props.name;if("radio"===this.props.type&&null!=o){for(var i=this.getDOMNode(),u=i;u.parentNode;)u=u.parentNode;for(var s=u.querySelectorAll("input[name="+JSON.stringify(""+o)+'][type="radio"]'),l=0,d=s.length;d>l;l++){var h=s[l];if(h!==i&&h.form===i.form){var v=c.getID(h);f(v);var g=m[v];f(g),p.asap(r,g)}}}return t}});t.exports=v},{11:11,133:133,2:2,24:24,27:27,29:29,33:33,55:55,68:68,85:85}],48:[function(e,t,n){"use strict";var r=e(29),o=e(33),i=e(55),a=(e(150),i.createFactory("option")),u=o.createClass({displayName:"ReactDOMOption",tagName:"OPTION",mixins:[r],componentWillMount:function(){},render:function(){return a(this.props,this.props.children)}});t.exports=u},{150:150,29:29,33:33,55:55}],49:[function(e,t,n){"use strict";function r(){if(this._pendingUpdate){this._pendingUpdate=!1;var e=u.getValue(this);null!=e&&this.isMounted()&&i(this,e)}}function o(e,t,n){if(null==e[t])return null;if(e.multiple){if(!Array.isArray(e[t]))return new Error("The `"+t+"` prop supplied to <select> must be an array if `multiple` is true.")}else if(Array.isArray(e[t]))return new Error("The `"+t+"` prop supplied to <select> must be a scalar value if `multiple` is false.")}function i(e,t){var n,r,o,i=e.getDOMNode().options;if(e.props.multiple){for(n={},r=0,o=t.length;o>r;r++)n[""+t[r]]=!0;for(r=0,o=i.length;o>r;r++){var a=n.hasOwnProperty(i[r].value);i[r].selected!==a&&(i[r].selected=a)}}else{for(n=""+t,r=0,o=i.length;o>r;r++)if(i[r].value===n)return void(i[r].selected=!0);i.length&&(i[0].selected=!0)}}var a=e(2),u=e(24),s=e(29),l=e(33),c=e(55),p=e(85),d=e(27),f=c.createFactory("select"),h=l.createClass({displayName:"ReactDOMSelect",tagName:"SELECT",mixins:[a,u.Mixin,s],propTypes:{defaultValue:o,value:o},render:function(){var e=d({},this.props);return e.onChange=this._handleChange,e.value=null,f(e,this.props.children)},componentWillMount:function(){this._pendingUpdate=!1},componentDidMount:function(){var e=u.getValue(this);null!=e?i(this,e):null!=this.props.defaultValue&&i(this,this.props.defaultValue)},componentDidUpdate:function(e){var t=u.getValue(this);null!=t?(this._pendingUpdate=!1,i(this,t)):!e.multiple!=!this.props.multiple&&(null!=this.props.defaultValue?i(this,this.props.defaultValue):i(this,this.props.multiple?[]:""))},_handleChange:function(e){var t,n=u.getOnChange(this);return n&&(t=n.call(this,e)),this._pendingUpdate=!0,p.asap(r,this),t}});t.exports=h},{2:2,24:24,27:27,29:29,33:33,55:55,85:85}],50:[function(e,t,n){"use strict";function r(e,t,n,r){return e===n&&t===r}function o(e){var t=document.selection,n=t.createRange(),r=n.text.length,o=n.duplicate();o.moveToElementText(e),o.setEndPoint("EndToStart",n);var i=o.text.length,a=i+r;return{start:i,end:a}}function i(e){var t=window.getSelection&&window.getSelection();if(!t||0===t.rangeCount)return null;var n=t.anchorNode,o=t.anchorOffset,i=t.focusNode,a=t.focusOffset,u=t.getRangeAt(0),s=r(t.anchorNode,t.anchorOffset,t.focusNode,t.focusOffset),l=s?0:u.toString().length,c=u.cloneRange();c.selectNodeContents(e),c.setEnd(u.startContainer,u.startOffset);var p=r(c.startContainer,c.startOffset,c.endContainer,c.endOffset),d=p?0:c.toString().length,f=d+l,h=document.createRange();h.setStart(n,o),h.setEnd(i,a);var m=h.collapsed;return{start:m?f:d,end:m?d:f}}function a(e,t){var n,r,o=document.selection.createRange().duplicate();"undefined"==typeof t.end?(n=t.start,r=n):t.start>t.end?(n=t.end,r=t.start):(n=t.start,r=t.end),o.moveToElementText(e),o.moveStart("character",n),o.setEndPoint("EndToStart",o),o.moveEnd("character",r-n),o.select()}function u(e,t){if(window.getSelection){var n=window.getSelection(),r=e[c()].length,o=Math.min(t.start,r),i="undefined"==typeof t.end?o:Math.min(t.end,r);if(!n.extend&&o>i){var a=i;i=o,o=a}var u=l(e,o),s=l(e,i);if(u&&s){var p=document.createRange();p.setStart(u.node,u.offset),n.removeAllRanges(),o>i?(n.addRange(p),n.extend(s.node,s.offset)):(p.setEnd(s.node,s.offset),n.addRange(p))}}}var s=e(21),l=e(126),c=e(128),p=s.canUseDOM&&"selection"in document&&!("getSelection"in window),d={getOffsets:p?o:i,setOffsets:p?a:u};t.exports=d},{126:126,128:128,21:21}],51:[function(e,t,n){"use strict";var r=e(11),o=e(35),i=e(42),a=e(27),u=e(114),s=function(e){};a(s.prototype,{construct:function(e){this._currentElement=e,this._stringText=""+e,this._rootNodeID=null,this._mountIndex=0},mountComponent:function(e,t,n){this._rootNodeID=e;var o=u(this._stringText);return t.renderToStaticMarkup?o:"<span "+r.createMarkupForID(e)+">"+o+"</span>"},receiveComponent:function(e,t){if(e!==this._currentElement){this._currentElement=e;var n=""+e;n!==this._stringText&&(this._stringText=n,i.BackendIDOperations.updateTextContentByID(this._rootNodeID,n))}},unmountComponent:function(){o.unmountIDFromEnvironment(this._rootNodeID)}}),t.exports=s},{11:11,114:114,27:27,35:35,42:42}],52:[function(e,t,n){"use strict";function r(){this.isMounted()&&this.forceUpdate()}var o=e(2),i=e(11),a=e(24),u=e(29),s=e(33),l=e(55),c=e(85),p=e(27),d=e(133),f=(e(150),l.createFactory("textarea")),h=s.createClass({displayName:"ReactDOMTextarea",tagName:"TEXTAREA",mixins:[o,a.Mixin,u],getInitialState:function(){var e=this.props.defaultValue,t=this.props.children;null!=t&&(d(null==e),Array.isArray(t)&&(d(t.length<=1),t=t[0]),e=""+t),null==e&&(e="");var n=a.getValue(this);return{initialValue:""+(null!=n?n:e)}},render:function(){var e=p({},this.props);return d(null==e.dangerouslySetInnerHTML),e.defaultValue=null,e.value=null,e.onChange=this._handleChange,f(e,this.state.initialValue)},componentDidUpdate:function(e,t,n){var r=a.getValue(this);if(null!=r){var o=this.getDOMNode();i.setValueForProperty(o,"value",""+r)}},_handleChange:function(e){var t,n=a.getOnChange(this);return n&&(t=n.call(this,e)),c.asap(r,this),t}});t.exports=h},{11:11,133:133,150:150,2:2,24:24,27:27,29:29,33:33,55:55,85:85}],53:[function(e,t,n){"use strict";function r(){this.reinitializeTransaction()}var o=e(85),i=e(101),a=e(27),u=e(112),s={initialize:u,close:function(){d.isBatchingUpdates=!1}},l={initialize:u,close:o.flushBatchedUpdates.bind(o)},c=[l,s];a(r.prototype,i.Mixin,{getTransactionWrappers:function(){return c}});var p=new r,d={isBatchingUpdates:!1,batchedUpdates:function(e,t,n,r,o){var i=d.isBatchingUpdates;d.isBatchingUpdates=!0,i?e(t,n,r,o):p.perform(e,null,t,n,r,o)}};t.exports=d},{101:101,112:112,27:27,85:85}],54:[function(e,t,n){"use strict";function r(e){return h.createClass({tagName:e.toUpperCase(),render:function(){return new T(e,null,null,null,null,this.props)}})}function o(){R.EventEmitter.injectReactEventListener(P),R.EventPluginHub.injectEventPluginOrder(s),R.EventPluginHub.injectInstanceHandle(w),R.EventPluginHub.injectMount(O),R.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:L,EnterLeaveEventPlugin:l,ChangeEventPlugin:a,MobileSafariClickEventPlugin:d,SelectEventPlugin:A,BeforeInputEventPlugin:i}),R.NativeComponent.injectGenericComponentClass(g),R.NativeComponent.injectTextComponentClass(I),R.NativeComponent.injectAutoWrapper(r),R.Class.injectMixin(f),R.NativeComponent.injectComponentClasses({button:y,form:C,iframe:_,img:E,input:x,option:D,select:M,textarea:N,html:F("html"),head:F("head"),body:F("body")}),R.DOMProperty.injectDOMPropertyConfig(p),R.DOMProperty.injectDOMPropertyConfig(U),R.EmptyComponent.injectEmptyComponent("noscript"),R.Updates.injectReconcileTransaction(S),R.Updates.injectBatchingStrategy(v),R.RootIndex.injectCreateReactRootIndex(c.canUseDOM?u.createReactRootIndex:k.createReactRootIndex),R.Component.injectEnvironment(m),R.DOMComponent.injectIDOperations(b)}var i=e(3),a=e(7),u=e(8),s=e(13),l=e(14),c=e(21),p=e(23),d=e(26),f=e(29),h=e(33),m=e(35),v=e(53),g=e(42),y=e(41),C=e(43),E=e(46),b=e(44),_=e(45),x=e(47),D=e(48),M=e(49),N=e(52),I=e(51),T=e(55),P=e(60),R=e(62),w=e(64),O=e(68),S=e(78),A=e(87),k=e(88),L=e(89),U=e(86),F=e(109);

t.exports={inject:o}},{109:109,13:13,14:14,21:21,23:23,26:26,29:29,3:3,33:33,35:35,41:41,42:42,43:43,44:44,45:45,46:46,47:47,48:48,49:49,51:51,52:52,53:53,55:55,60:60,62:62,64:64,68:68,7:7,78:78,8:8,86:86,87:87,88:88,89:89}],55:[function(e,t,n){"use strict";var r=e(38),o=e(39),i=e(27),a=(e(150),{key:!0,ref:!0}),u=function(e,t,n,r,o,i){this.type=e,this.key=t,this.ref=n,this._owner=r,this._context=o,this.props=i};u.prototype={_isReactElement:!0},u.createElement=function(e,t,n){var i,s={},l=null,c=null;if(null!=t){c=void 0===t.ref?null:t.ref,l=void 0===t.key?null:""+t.key;for(i in t)t.hasOwnProperty(i)&&!a.hasOwnProperty(i)&&(s[i]=t[i])}var p=arguments.length-2;if(1===p)s.children=n;else if(p>1){for(var d=Array(p),f=0;p>f;f++)d[f]=arguments[f+2];s.children=d}if(e&&e.defaultProps){var h=e.defaultProps;for(i in h)"undefined"==typeof s[i]&&(s[i]=h[i])}return new u(e,l,c,o.current,r.current,s)},u.createFactory=function(e){var t=u.createElement.bind(null,e);return t.type=e,t},u.cloneAndReplaceProps=function(e,t){var n=new u(e.type,e.key,e.ref,e._owner,e._context,t);return n},u.cloneElement=function(e,t,n){var r,s=i({},e.props),l=e.key,c=e.ref,p=e._owner;if(null!=t){void 0!==t.ref&&(c=t.ref,p=o.current),void 0!==t.key&&(l=""+t.key);for(r in t)t.hasOwnProperty(r)&&!a.hasOwnProperty(r)&&(s[r]=t[r])}var d=arguments.length-2;if(1===d)s.children=n;else if(d>1){for(var f=Array(d),h=0;d>h;h++)f[h]=arguments[h+2];s.children=f}return new u(e.type,l,c,p,e._context,s)},u.isValidElement=function(e){var t=!(!e||!e._isReactElement);return t},t.exports=u},{150:150,27:27,38:38,39:39}],56:[function(e,t,n){"use strict";function r(){if(y.current){var e=y.current.getName();if(e)return" Check the render method of `"+e+"`."}return""}function o(e){var t=e&&e.getPublicInstance();if(!t)return void 0;var n=t.constructor;return n?n.displayName||n.name||void 0:void 0}function i(){var e=y.current;return e&&o(e)||void 0}function a(e,t){e._store.validated||null!=e.key||(e._store.validated=!0,s('Each child in an array or iterator should have a unique "key" prop.',e,t))}function u(e,t,n){D.test(e)&&s("Child objects should have non-numeric keys so ordering is preserved.",t,n)}function s(e,t,n){var r=i(),a="string"==typeof n?n:n.displayName||n.name,u=r||a,s=_[e]||(_[e]={});if(!s.hasOwnProperty(u)){s[u]=!0;var l="";if(t&&t._owner&&t._owner!==y.current){var c=o(t._owner);l=" It was passed a child from "+c+"."}}}function l(e,t){if(Array.isArray(e))for(var n=0;n<e.length;n++){var r=e[n];m.isValidElement(r)&&a(r,t)}else if(m.isValidElement(e))e._store.validated=!0;else if(e){var o=E(e);if(o){if(o!==e.entries)for(var i,s=o.call(e);!(i=s.next()).done;)m.isValidElement(i.value)&&a(i.value,t)}else if("object"==typeof e){var l=v.extractIfFragment(e);for(var c in l)l.hasOwnProperty(c)&&u(c,l[c],t)}}}function c(e,t,n,o){for(var i in t)if(t.hasOwnProperty(i)){var a;try{b("function"==typeof t[i]),a=t[i](n,i,e,o)}catch(u){a=u}a instanceof Error&&!(a.message in x)&&(x[a.message]=!0,r(this))}}function p(e,t){var n=t.type,r="string"==typeof n?n:n.displayName,o=t._owner?t._owner.getPublicInstance().constructor.displayName:null,i=e+"|"+r+"|"+o;if(!M.hasOwnProperty(i)){M[i]=!0;var a="";r&&(a=" <"+r+" />");var u="";o&&(u=" The element was created by "+o+".")}}function d(e,t){return e!==e?t!==t:0===e&&0===t?1/e===1/t:e===t}function f(e){if(e._store){var t=e._store.originalProps,n=e.props;for(var r in n)n.hasOwnProperty(r)&&(t.hasOwnProperty(r)&&d(t[r],n[r])||(p(r,e),t[r]=n[r]))}}function h(e){if(null!=e.type){var t=C.getComponentClassForElement(e),n=t.displayName||t.name;t.propTypes&&c(n,t.propTypes,e.props,g.prop),"function"==typeof t.getDefaultProps}}var m=e(55),v=e(61),g=e(75),y=(e(74),e(39)),C=e(71),E=e(124),b=e(133),_=(e(150),{}),x={},D=/^\d+$/,M={},N={checkAndWarnForMutatedProps:f,createElement:function(e,t,n){var r=m.createElement.apply(this,arguments);if(null==r)return r;for(var o=2;o<arguments.length;o++)l(arguments[o],e);return h(r),r},createFactory:function(e){var t=N.createElement.bind(null,e);return t.type=e,t},cloneElement:function(e,t,n){for(var r=m.cloneElement.apply(this,arguments),o=2;o<arguments.length;o++)l(arguments[o],r.type);return h(r),r}};t.exports=N},{124:124,133:133,150:150,39:39,55:55,61:61,71:71,74:74,75:75}],57:[function(e,t,n){"use strict";function r(e){c[e]=!0}function o(e){delete c[e]}function i(e){return!!c[e]}var a,u=e(55),s=e(65),l=e(133),c={},p={injectEmptyComponent:function(e){a=u.createFactory(e)}},d=function(){};d.prototype.componentDidMount=function(){var e=s.get(this);e&&r(e._rootNodeID)},d.prototype.componentWillUnmount=function(){var e=s.get(this);e&&o(e._rootNodeID)},d.prototype.render=function(){return l(a),a()};var f=u.createElement(d),h={emptyElement:f,injection:p,isNullComponentID:i};t.exports=h},{133:133,55:55,65:65}],58:[function(e,t,n){"use strict";var r={guard:function(e,t){return e}};t.exports=r},{}],59:[function(e,t,n){"use strict";function r(e){o.enqueueEvents(e),o.processEventQueue()}var o=e(17),i={handleTopLevel:function(e,t,n,i){var a=o.extractEvents(e,t,n,i);r(a)}};t.exports=i},{17:17}],60:[function(e,t,n){"use strict";function r(e){var t=p.getID(e),n=c.getReactRootIDFromNodeID(t),r=p.findReactContainerForID(n),o=p.getFirstReactDOM(r);return o}function o(e,t){this.topLevelType=e,this.nativeEvent=t,this.ancestors=[]}function i(e){for(var t=p.getFirstReactDOM(h(e.nativeEvent))||window,n=t;n;)e.ancestors.push(n),n=r(n);for(var o=0,i=e.ancestors.length;i>o;o++){t=e.ancestors[o];var a=p.getID(t)||"";v._handleTopLevel(e.topLevelType,t,a,e.nativeEvent)}}function a(e){var t=m(window);e(t)}var u=e(16),s=e(21),l=e(28),c=e(64),p=e(68),d=e(85),f=e(27),h=e(123),m=e(129);f(o.prototype,{destructor:function(){this.topLevelType=null,this.nativeEvent=null,this.ancestors.length=0}}),l.addPoolingTo(o,l.twoArgumentPooler);var v={_enabled:!0,_handleTopLevel:null,WINDOW_HANDLE:s.canUseDOM?window:null,setHandleTopLevel:function(e){v._handleTopLevel=e},setEnabled:function(e){v._enabled=!!e},isEnabled:function(){return v._enabled},trapBubbledEvent:function(e,t,n){var r=n;return r?u.listen(r,t,v.dispatchEvent.bind(null,e)):null},trapCapturedEvent:function(e,t,n){var r=n;return r?u.capture(r,t,v.dispatchEvent.bind(null,e)):null},monitorScrollValue:function(e){var t=a.bind(null,e);u.listen(window,"scroll",t)},dispatchEvent:function(e,t){if(v._enabled){var n=o.getPooled(e,t);try{d.batchedUpdates(i,n)}finally{o.release(n)}}}};t.exports=v},{123:123,129:129,16:16,21:21,27:27,28:28,64:64,68:68,85:85}],61:[function(e,t,n){"use strict";var r=(e(55),e(150),{create:function(e){return e},extract:function(e){return e},extractIfFragment:function(e){return e}});t.exports=r},{150:150,55:55}],62:[function(e,t,n){"use strict";var r=e(10),o=e(17),i=e(36),a=e(33),u=e(57),s=e(30),l=e(71),c=e(42),p=e(73),d=e(81),f=e(85),h={Component:i.injection,Class:a.injection,DOMComponent:c.injection,DOMProperty:r.injection,EmptyComponent:u.injection,EventPluginHub:o.injection,EventEmitter:s.injection,NativeComponent:l.injection,Perf:p.injection,RootIndex:d.injection,Updates:f.injection};t.exports=h},{10:10,17:17,30:30,33:33,36:36,42:42,57:57,71:71,73:73,81:81,85:85}],63:[function(e,t,n){"use strict";function r(e){return i(document.documentElement,e)}var o=e(50),i=e(107),a=e(117),u=e(119),s={hasSelectionCapabilities:function(e){return e&&("INPUT"===e.nodeName&&"text"===e.type||"TEXTAREA"===e.nodeName||"true"===e.contentEditable)},getSelectionInformation:function(){var e=u();return{focusedElem:e,selectionRange:s.hasSelectionCapabilities(e)?s.getSelection(e):null}},restoreSelection:function(e){var t=u(),n=e.focusedElem,o=e.selectionRange;t!==n&&r(n)&&(s.hasSelectionCapabilities(n)&&s.setSelection(n,o),a(n))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&"INPUT"===e.nodeName){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=o.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,r=t.end;if("undefined"==typeof r&&(r=n),"selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(r,e.value.length);else if(document.selection&&"INPUT"===e.nodeName){var i=e.createTextRange();i.collapse(!0),i.moveStart("character",n),i.moveEnd("character",r-n),i.select()}else o.setOffsets(e,t)}};t.exports=s},{107:107,117:117,119:119,50:50}],64:[function(e,t,n){"use strict";function r(e){return f+e.toString(36)}function o(e,t){return e.charAt(t)===f||t===e.length}function i(e){return""===e||e.charAt(0)===f&&e.charAt(e.length-1)!==f}function a(e,t){return 0===t.indexOf(e)&&o(t,e.length)}function u(e){return e?e.substr(0,e.lastIndexOf(f)):""}function s(e,t){if(d(i(e)&&i(t)),d(a(e,t)),e===t)return e;var n,r=e.length+h;for(n=r;n<t.length&&!o(t,n);n++);return t.substr(0,n)}function l(e,t){var n=Math.min(e.length,t.length);if(0===n)return"";for(var r=0,a=0;n>=a;a++)if(o(e,a)&&o(t,a))r=a;else if(e.charAt(a)!==t.charAt(a))break;var u=e.substr(0,r);return d(i(u)),u}function c(e,t,n,r,o,i){e=e||"",t=t||"",d(e!==t);var l=a(t,e);d(l||a(e,t));for(var c=0,p=l?u:s,f=e;;f=p(f,t)){var h;if(o&&f===e||i&&f===t||(h=n(f,l,r)),h===!1||f===t)break;d(c++<m)}}var p=e(81),d=e(133),f=".",h=f.length,m=100,v={createReactRootID:function(){return r(p.createReactRootIndex())},createReactID:function(e,t){return e+t},getReactRootIDFromNodeID:function(e){if(e&&e.charAt(0)===f&&e.length>1){var t=e.indexOf(f,1);return t>-1?e.substr(0,t):e}return null},traverseEnterLeave:function(e,t,n,r,o){var i=l(e,t);i!==e&&c(e,i,n,r,!1,!0),i!==t&&c(i,t,n,o,!0,!1)},traverseTwoPhase:function(e,t,n){e&&(c("",e,t,n,!0,!1),c(e,"",t,n,!1,!0))},traverseAncestors:function(e,t,n){c("",e,t,n,!0,!1)},_getFirstCommonAncestorID:l,_getNextDescendantID:s,isAncestorIDOf:a,SEPARATOR:f};t.exports=v},{133:133,81:81}],65:[function(e,t,n){"use strict";var r={remove:function(e){e._reactInternalInstance=void 0},get:function(e){return e._reactInternalInstance},has:function(e){return void 0!==e._reactInternalInstance},set:function(e,t){e._reactInternalInstance=t}};t.exports=r},{}],66:[function(e,t,n){"use strict";var r={currentlyMountingInstance:null,currentlyUnmountingInstance:null};t.exports=r},{}],67:[function(e,t,n){"use strict";var r=e(104),o={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=r(e);return e.replace(">"," "+o.CHECKSUM_ATTR_NAME+'="'+t+'">')},canReuseMarkup:function(e,t){var n=t.getAttribute(o.CHECKSUM_ATTR_NAME);n=n&&parseInt(n,10);var i=r(e);return i===n}};t.exports=o},{104:104}],68:[function(e,t,n){"use strict";function r(e,t){for(var n=Math.min(e.length,t.length),r=0;n>r;r++)if(e.charAt(r)!==t.charAt(r))return r;return e.length===t.length?-1:n}function o(e){var t=P(e);return t&&K.getID(t)}function i(e){var t=a(e);if(t)if(L.hasOwnProperty(t)){var n=L[t];n!==e&&(w(!c(n,t)),L[t]=e)}else L[t]=e;return t}function a(e){return e&&e.getAttribute&&e.getAttribute(k)||""}function u(e,t){var n=a(e);n!==t&&delete L[n],e.setAttribute(k,t),L[t]=e}function s(e){return L.hasOwnProperty(e)&&c(L[e],e)||(L[e]=K.findReactNodeByID(e)),L[e]}function l(e){var t=b.get(e)._rootNodeID;return C.isNullComponentID(t)?null:(L.hasOwnProperty(t)&&c(L[t],t)||(L[t]=K.findReactNodeByID(t)),L[t])}function c(e,t){if(e){w(a(e)===t);var n=K.findReactContainerForID(t);if(n&&T(n,e))return!0}return!1}function p(e){delete L[e]}function d(e){var t=L[e];return t&&c(t,e)?void(W=t):!1}function f(e){W=null,E.traverseAncestors(e,d);var t=W;return W=null,t}function h(e,t,n,r,o){var i=D.mountComponent(e,t,r,I);e._isTopLevel=!0,K._mountImageIntoNode(i,n,o)}function m(e,t,n,r){var o=N.ReactReconcileTransaction.getPooled();o.perform(h,null,e,t,n,o,r),N.ReactReconcileTransaction.release(o)}var v=e(10),g=e(30),y=(e(39),e(55)),C=(e(56),e(57)),E=e(64),b=e(65),_=e(67),x=e(73),D=e(79),M=e(84),N=e(85),I=e(113),T=e(107),P=e(127),R=e(132),w=e(133),O=e(144),S=e(147),A=(e(150),E.SEPARATOR),k=v.ID_ATTRIBUTE_NAME,L={},U=1,F=9,B={},V={},j=[],W=null,K={_instancesByReactRootID:B,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,r){return K.scrollMonitor(n,function(){M.enqueueElementInternal(e,t),r&&M.enqueueCallbackInternal(e,r)}),e},_registerComponent:function(e,t){w(t&&(t.nodeType===U||t.nodeType===F)),g.ensureScrollValueMonitoring();var n=K.registerContainer(t);return B[n]=e,n},_renderNewRootComponent:function(e,t,n){var r=R(e,null),o=K._registerComponent(r,t);return N.batchedUpdates(m,r,o,t,n),r},render:function(e,t,n){w(y.isValidElement(e));var r=B[o(t)];if(r){var i=r._currentElement;if(S(i,e))return K._updateRootComponent(r,e,t,n).getPublicInstance();K.unmountComponentAtNode(t)}var a=P(t),u=a&&K.isRenderedByReact(a),s=u&&!r,l=K._renderNewRootComponent(e,t,s).getPublicInstance();return n&&n.call(l),l},constructAndRenderComponent:function(e,t,n){var r=y.createElement(e,t);return K.render(r,n)},constructAndRenderComponentByID:function(e,t,n){var r=document.getElementById(n);return w(r),K.constructAndRenderComponent(e,t,r)},registerContainer:function(e){var t=o(e);return t&&(t=E.getReactRootIDFromNodeID(t)),t||(t=E.createReactRootID()),V[t]=e,t},unmountComponentAtNode:function(e){w(e&&(e.nodeType===U||e.nodeType===F));var t=o(e),n=B[t];return n?(K.unmountComponentFromNode(n,e),delete B[t],delete V[t],!0):!1},unmountComponentFromNode:function(e,t){for(D.unmountComponent(e),t.nodeType===F&&(t=t.documentElement);t.lastChild;)t.removeChild(t.lastChild)},findReactContainerForID:function(e){var t=E.getReactRootIDFromNodeID(e),n=V[t];return n},findReactNodeByID:function(e){var t=K.findReactContainerForID(e);return K.findComponentRoot(t,e)},isRenderedByReact:function(e){if(1!==e.nodeType)return!1;var t=K.getID(e);return t?t.charAt(0)===A:!1},getFirstReactDOM:function(e){for(var t=e;t&&t.parentNode!==t;){if(K.isRenderedByReact(t))return t;t=t.parentNode}return null},findComponentRoot:function(e,t){var n=j,r=0,o=f(t)||e;for(n[0]=o.firstChild,n.length=1;r<n.length;){for(var i,a=n[r++];a;){var u=K.getID(a);u?t===u?i=a:E.isAncestorIDOf(u,t)&&(n.length=r=0,n.push(a.firstChild)):n.push(a.firstChild),a=a.nextSibling}if(i)return n.length=0,i}n.length=0,w(!1)},_mountImageIntoNode:function(e,t,n){if(w(t&&(t.nodeType===U||t.nodeType===F)),n){var o=P(t);if(_.canReuseMarkup(e,o))return;var i=o.getAttribute(_.CHECKSUM_ATTR_NAME);o.removeAttribute(_.CHECKSUM_ATTR_NAME);var a=o.outerHTML;o.setAttribute(_.CHECKSUM_ATTR_NAME,i);var u=r(e,a);" (client) "+e.substring(u-20,u+20)+"\n (server) "+a.substring(u-20,u+20),w(t.nodeType!==F)}w(t.nodeType!==F),O(t,e)},getReactRootID:o,getID:i,setID:u,getNode:s,getNodeFromInstance:l,purgeID:p};x.measureMethods(K,"ReactMount",{_renderNewRootComponent:"_renderNewRootComponent",_mountImageIntoNode:"_mountImageIntoNode"}),t.exports=K},{10:10,107:107,113:113,127:127,132:132,133:133,144:144,147:147,150:150,30:30,39:39,55:55,56:56,57:57,64:64,65:65,67:67,73:73,79:79,84:84,85:85}],69:[function(e,t,n){"use strict";function r(e,t,n){h.push({parentID:e,parentNode:null,type:c.INSERT_MARKUP,markupIndex:m.push(t)-1,textContent:null,fromIndex:null,toIndex:n})}function o(e,t,n){h.push({parentID:e,parentNode:null,type:c.MOVE_EXISTING,markupIndex:null,textContent:null,fromIndex:t,toIndex:n})}function i(e,t){h.push({parentID:e,parentNode:null,type:c.REMOVE_NODE,markupIndex:null,textContent:null,fromIndex:t,toIndex:null})}function a(e,t){h.push({parentID:e,parentNode:null,type:c.TEXT_CONTENT,markupIndex:null,textContent:t,fromIndex:null,toIndex:null})}function u(){h.length&&(l.processChildrenUpdates(h,m),s())}function s(){h.length=0,m.length=0}var l=e(36),c=e(70),p=e(79),d=e(31),f=0,h=[],m=[],v={Mixin:{mountChildren:function(e,t,n){var r=d.instantiateChildren(e,t,n);this._renderedChildren=r;var o=[],i=0;for(var a in r)if(r.hasOwnProperty(a)){var u=r[a],s=this._rootNodeID+a,l=p.mountComponent(u,s,t,n);u._mountIndex=i,o.push(l),i++}return o},updateTextContent:function(e){f++;var t=!0;try{var n=this._renderedChildren;d.unmountChildren(n);for(var r in n)n.hasOwnProperty(r)&&this._unmountChildByName(n[r],r);this.setTextContent(e),t=!1}finally{f--,f||(t?s():u())}},updateChildren:function(e,t,n){f++;var r=!0;try{this._updateChildren(e,t,n),r=!1}finally{f--,f||(r?s():u())}},_updateChildren:function(e,t,n){var r=this._renderedChildren,o=d.updateChildren(r,e,t,n);if(this._renderedChildren=o,o||r){var i,a=0,u=0;for(i in o)if(o.hasOwnProperty(i)){var s=r&&r[i],l=o[i];s===l?(this.moveChild(s,u,a),a=Math.max(s._mountIndex,a),s._mountIndex=u):(s&&(a=Math.max(s._mountIndex,a),this._unmountChildByName(s,i)),this._mountChildByNameAtIndex(l,i,u,t,n)),u++}for(i in r)!r.hasOwnProperty(i)||o&&o.hasOwnProperty(i)||this._unmountChildByName(r[i],i)}},unmountChildren:function(){var e=this._renderedChildren;d.unmountChildren(e),this._renderedChildren=null},moveChild:function(e,t,n){e._mountIndex<n&&o(this._rootNodeID,e._mountIndex,t)},createChild:function(e,t){r(this._rootNodeID,t,e._mountIndex)},removeChild:function(e){i(this._rootNodeID,e._mountIndex)},setTextContent:function(e){a(this._rootNodeID,e)},_mountChildByNameAtIndex:function(e,t,n,r,o){var i=this._rootNodeID+t,a=p.mountComponent(e,i,r,o);e._mountIndex=n,this.createChild(e,a)},_unmountChildByName:function(e,t){this.removeChild(e),e._mountIndex=null}}};t.exports=v},{31:31,36:36,70:70,79:79}],70:[function(e,t,n){"use strict";var r=e(138),o=r({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,TEXT_CONTENT:null});t.exports=o},{138:138}],71:[function(e,t,n){"use strict";function r(e){if("function"==typeof e.type)return e.type;var t=e.type,n=p[t];return null==n&&(p[t]=n=l(t)),n}function o(e){return s(c),new c(e.type,e.props)}function i(e){return new d(e)}function a(e){return e instanceof d}var u=e(27),s=e(133),l=null,c=null,p={},d=null,f={injectGenericComponentClass:function(e){c=e},injectTextComponentClass:function(e){d=e},injectComponentClasses:function(e){u(p,e)},injectAutoWrapper:function(e){l=e}},h={getComponentClassForElement:r,createInternalComponent:o,createInstanceForText:i,isTextComponent:a,injection:f};t.exports=h},{133:133,27:27}],72:[function(e,t,n){"use strict";var r=e(133),o={isValidOwner:function(e){return!(!e||"function"!=typeof e.attachRef||"function"!=typeof e.detachRef)},addComponentAsRefTo:function(e,t,n){r(o.isValidOwner(n)),n.attachRef(t,e)},removeComponentAsRefFrom:function(e,t,n){r(o.isValidOwner(n)),n.getPublicInstance().refs[t]===e.getPublicInstance()&&n.detachRef(t)}};t.exports=o},{133:133}],73:[function(e,t,n){"use strict";function r(e,t,n){return n}var o={enableMeasure:!1,storedMeasure:r,measureMethods:function(e,t,n){},measure:function(e,t,n){return n},injection:{injectMeasure:function(e){o.storedMeasure=e}}};t.exports=o},{}],74:[function(e,t,n){"use strict";var r={};t.exports=r},{}],75:[function(e,t,n){"use strict";var r=e(138),o=r({prop:null,context:null,childContext:null});t.exports=o},{138:138}],76:[function(e,t,n){"use strict";function r(e){function t(t,n,r,o,i){if(o=o||b,null==n[r]){var a=C[i];return t?new Error("Required "+a+" `"+r+"` was not specified in "+("`"+o+"`.")):null}return e(n,r,o,i)}var n=t.bind(null,!1);return n.isRequired=t.bind(null,!0),n}function o(e){function t(t,n,r,o){var i=t[n],a=m(i);if(a!==e){var u=C[o],s=v(i);return new Error("Invalid "+u+" `"+n+"` of type `"+s+"` "+("supplied to `"+r+"`, expected `"+e+"`."))}return null}return r(t)}function i(){return r(E.thatReturns(null))}function a(e){function t(t,n,r,o){var i=t[n];if(!Array.isArray(i)){var a=C[o],u=m(i);return new Error("Invalid "+a+" `"+n+"` of type "+("`"+u+"` supplied to `"+r+"`, expected an array."))}for(var s=0;s<i.length;s++){var l=e(i,s,r,o);if(l instanceof Error)return l}return null}return r(t)}function u(){function e(e,t,n,r){if(!g.isValidElement(e[t])){var o=C[r];return new Error("Invalid "+o+" `"+t+"` supplied to "+("`"+n+"`, expected a ReactElement."))}return null}return r(e)}function s(e){function t(t,n,r,o){if(!(t[n]instanceof e)){var i=C[o],a=e.name||b;return new Error("Invalid "+i+" `"+n+"` supplied to "+("`"+r+"`, expected instance of `"+a+"`."))}return null}return r(t)}function l(e){function t(t,n,r,o){for(var i=t[n],a=0;a<e.length;a++)if(i===e[a])return null;var u=C[o],s=JSON.stringify(e);return new Error("Invalid "+u+" `"+n+"` of value `"+i+"` "+("supplied to `"+r+"`, expected one of "+s+"."))}return r(t)}function c(e){function t(t,n,r,o){var i=t[n],a=m(i);if("object"!==a){var u=C[o];return new Error("Invalid "+u+" `"+n+"` of type "+("`"+a+"` supplied to `"+r+"`, expected an object."))}for(var s in i)if(i.hasOwnProperty(s)){var l=e(i,s,r,o);if(l instanceof Error)return l}return null}return r(t)}function p(e){function t(t,n,r,o){for(var i=0;i<e.length;i++){var a=e[i];if(null==a(t,n,r,o))return null}var u=C[o];return new Error("Invalid "+u+" `"+n+"` supplied to "+("`"+r+"`."))}return r(t)}function d(){function e(e,t,n,r){if(!h(e[t])){var o=C[r];return new Error("Invalid "+o+" `"+t+"` supplied to "+("`"+n+"`, expected a ReactNode."))}return null}return r(e)}function f(e){function t(t,n,r,o){var i=t[n],a=m(i);if("object"!==a){var u=C[o];return new Error("Invalid "+u+" `"+n+"` of type `"+a+"` "+("supplied to `"+r+"`, expected `object`."))}for(var s in e){var l=e[s];if(l){var c=l(i,s,r,o);if(c)return c}}return null}return r(t)}function h(e){switch(typeof e){case"number":case"string":case"undefined":return!0;case"boolean":return!e;case"object":if(Array.isArray(e))return e.every(h);if(null===e||g.isValidElement(e))return!0;e=y.extractIfFragment(e);for(var t in e)if(!h(e[t]))return!1;return!0;default:return!1}}function m(e){var t=typeof e;return Array.isArray(e)?"array":e instanceof RegExp?"object":t}function v(e){var t=m(e);if("object"===t){if(e instanceof Date)return"date";if(e instanceof RegExp)return"regexp"}return t}var g=e(55),y=e(61),C=e(74),E=e(112),b="<<anonymous>>",_=u(),x=d(),D={array:o("array"),bool:o("boolean"),func:o("function"),number:o("number"),object:o("object"),string:o("string"),any:i(),arrayOf:a,element:_,instanceOf:s,node:x,objectOf:c,oneOf:l,oneOfType:p,shape:f};t.exports=D},{112:112,55:55,61:61,74:74}],77:[function(e,t,n){"use strict";function r(){this.listenersToPut=[]}var o=e(28),i=e(30),a=e(27);a(r.prototype,{enqueuePutListener:function(e,t,n){this.listenersToPut.push({rootNodeID:e,propKey:t,propValue:n})},putListeners:function(){for(var e=0;e<this.listenersToPut.length;e++){var t=this.listenersToPut[e];i.putListener(t.rootNodeID,t.propKey,t.propValue)}},reset:function(){this.listenersToPut.length=0},destructor:function(){this.reset()}}),o.addPoolingTo(r),t.exports=r},{27:27,28:28,30:30}],78:[function(e,t,n){"use strict";function r(){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=o.getPooled(null),this.putListenerQueue=s.getPooled()}var o=e(6),i=e(28),a=e(30),u=e(63),s=e(77),l=e(101),c=e(27),p={initialize:u.getSelectionInformation,close:u.restoreSelection},d={initialize:function(){var e=a.isEnabled();return a.setEnabled(!1),e},close:function(e){a.setEnabled(e)}},f={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},h={initialize:function(){this.putListenerQueue.reset()},close:function(){this.putListenerQueue.putListeners()}},m=[h,p,d,f],v={getTransactionWrappers:function(){return m},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){o.release(this.reactMountReady),this.reactMountReady=null,s.release(this.putListenerQueue),this.putListenerQueue=null}};c(r.prototype,l.Mixin,v),i.addPoolingTo(r),t.exports=r},{101:101,27:27,28:28,30:30,6:6,63:63,77:77}],79:[function(e,t,n){"use strict";function r(){o.attachRefs(this,this._currentElement)}var o=e(80),i=(e(56),{mountComponent:function(e,t,n,o){var i=e.mountComponent(t,n,o);return n.getReactMountReady().enqueue(r,e),i},unmountComponent:function(e){o.detachRefs(e,e._currentElement),e.unmountComponent()},receiveComponent:function(e,t,n,i){var a=e._currentElement;if(t!==a||null==t._owner){var u=o.shouldUpdateRefs(a,t);u&&o.detachRefs(e,a),e.receiveComponent(t,n,i),u&&n.getReactMountReady().enqueue(r,e)}},performUpdateIfNecessary:function(e,t){e.performUpdateIfNecessary(t)}});t.exports=i},{56:56,80:80}],80:[function(e,t,n){"use strict";function r(e,t,n){"function"==typeof e?e(t.getPublicInstance()):i.addComponentAsRefTo(t,e,n)}function o(e,t,n){"function"==typeof e?e(null):i.removeComponentAsRefFrom(t,e,n)}var i=e(72),a={};a.attachRefs=function(e,t){var n=t.ref;null!=n&&r(n,e,t._owner)},a.shouldUpdateRefs=function(e,t){return t._owner!==e._owner||t.ref!==e.ref},a.detachRefs=function(e,t){var n=t.ref;null!=n&&o(n,e,t._owner)},t.exports=a},{72:72}],81:[function(e,t,n){"use strict";var r={injectCreateReactRootIndex:function(e){o.createReactRootIndex=e}},o={createReactRootIndex:null,injection:r};t.exports=o},{}],82:[function(e,t,n){"use strict";function r(e){p(i.isValidElement(e));var t;try{var n=a.createReactRootID();return t=s.getPooled(!1),t.perform(function(){var r=c(e,null),o=r.mountComponent(n,t,l);return u.addChecksumToMarkup(o)},null)}finally{s.release(t)}}function o(e){p(i.isValidElement(e));var t;try{var n=a.createReactRootID();return t=s.getPooled(!0),t.perform(function(){var r=c(e,null);return r.mountComponent(n,t,l)},null)}finally{s.release(t)}}var i=e(55),a=e(64),u=e(67),s=e(83),l=e(113),c=e(132),p=e(133);t.exports={renderToString:r,renderToStaticMarkup:o}},{113:113,132:132,133:133,55:55,64:64,67:67,83:83}],83:[function(e,t,n){"use strict";function r(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.reactMountReady=i.getPooled(null),this.putListenerQueue=a.getPooled()}var o=e(28),i=e(6),a=e(77),u=e(101),s=e(27),l=e(112),c={initialize:function(){this.reactMountReady.reset()},close:l},p={initialize:function(){this.putListenerQueue.reset()},close:l},d=[p,c],f={getTransactionWrappers:function(){return d},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){i.release(this.reactMountReady),this.reactMountReady=null,a.release(this.putListenerQueue),this.putListenerQueue=null}};s(r.prototype,u.Mixin,f),o.addPoolingTo(r),t.exports=r},{101:101,112:112,27:27,28:28,6:6,77:77}],84:[function(e,t,n){"use strict";function r(e){e!==i.currentlyMountingInstance&&l.enqueueUpdate(e)}function o(e,t){p(null==a.current);var n=s.get(e);return n?n===i.currentlyUnmountingInstance?null:n:null}var i=e(66),a=e(39),u=e(55),s=e(65),l=e(85),c=e(27),p=e(133),d=(e(150),{enqueueCallback:function(e,t){p("function"==typeof t);var n=o(e);return n&&n!==i.currentlyMountingInstance?(n._pendingCallbacks?n._pendingCallbacks.push(t):n._pendingCallbacks=[t],void r(n)):null},enqueueCallbackInternal:function(e,t){p("function"==typeof t),e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t],r(e)},enqueueForceUpdate:function(e){var t=o(e,"forceUpdate");t&&(t._pendingForceUpdate=!0,r(t))},enqueueReplaceState:function(e,t){var n=o(e,"replaceState");n&&(n._pendingStateQueue=[t],n._pendingReplaceState=!0,r(n))},enqueueSetState:function(e,t){var n=o(e,"setState");if(n){var i=n._pendingStateQueue||(n._pendingStateQueue=[]);i.push(t),r(n)}},enqueueSetProps:function(e,t){var n=o(e,"setProps");if(n){p(n._isTopLevel);var i=n._pendingElement||n._currentElement,a=c({},i.props,t);n._pendingElement=u.cloneAndReplaceProps(i,a),r(n)}},enqueueReplaceProps:function(e,t){var n=o(e,"replaceProps");if(n){p(n._isTopLevel);var i=n._pendingElement||n._currentElement;n._pendingElement=u.cloneAndReplaceProps(i,t),r(n)}},enqueueElementInternal:function(e,t){e._pendingElement=t,r(e)}});t.exports=d},{133:133,150:150,27:27,39:39,55:55,65:65,66:66,85:85}],85:[function(e,t,n){"use strict";function r(){v(N.ReactReconcileTransaction&&E)}function o(){this.reinitializeTransaction(),this.dirtyComponentsLength=null,this.callbackQueue=c.getPooled(),this.reconcileTransaction=N.ReactReconcileTransaction.getPooled()}function i(e,t,n,o,i){r(),E.batchedUpdates(e,t,n,o,i)}function a(e,t){return e._mountOrder-t._mountOrder}function u(e){var t=e.dirtyComponentsLength;v(t===g.length),g.sort(a);for(var n=0;t>n;n++){var r=g[n],o=r._pendingCallbacks;if(r._pendingCallbacks=null,f.performUpdateIfNecessary(r,e.reconcileTransaction),o)for(var i=0;i<o.length;i++)e.callbackQueue.enqueue(o[i],r.getPublicInstance())}}function s(e){return r(),E.isBatchingUpdates?void g.push(e):void E.batchedUpdates(s,e)}function l(e,t){v(E.isBatchingUpdates),y.enqueue(e,t),C=!0}var c=e(6),p=e(28),d=(e(39),e(73)),f=e(79),h=e(101),m=e(27),v=e(133),g=(e(150),[]),y=c.getPooled(),C=!1,E=null,b={initialize:function(){this.dirtyComponentsLength=g.length},close:function(){this.dirtyComponentsLength!==g.length?(g.splice(0,this.dirtyComponentsLength),D()):g.length=0}},_={initialize:function(){this.callbackQueue.reset()},close:function(){this.callbackQueue.notifyAll()}},x=[b,_];m(o.prototype,h.Mixin,{getTransactionWrappers:function(){return x},destructor:function(){this.dirtyComponentsLength=null,c.release(this.callbackQueue),this.callbackQueue=null,N.ReactReconcileTransaction.release(this.reconcileTransaction),this.reconcileTransaction=null},perform:function(e,t,n){return h.Mixin.perform.call(this,this.reconcileTransaction.perform,this.reconcileTransaction,e,t,n)}}),p.addPoolingTo(o);var D=function(){for(;g.length||C;){if(g.length){var e=o.getPooled();e.perform(u,null,e),o.release(e)}if(C){C=!1;var t=y;y=c.getPooled(),t.notifyAll(),c.release(t)}}};D=d.measure("ReactUpdates","flushBatchedUpdates",D);var M={injectReconcileTransaction:function(e){v(e),N.ReactReconcileTransaction=e},injectBatchingStrategy:function(e){v(e),v("function"==typeof e.batchedUpdates),v("boolean"==typeof e.isBatchingUpdates),E=e}},N={ReactReconcileTransaction:null,batchedUpdates:i,enqueueUpdate:s,flushBatchedUpdates:D,injection:M,asap:l};t.exports=N},{101:101,133:133,150:150,27:27,28:28,39:39,6:6,73:73,79:79}],86:[function(e,t,n){"use strict";var r=e(10),o=r.injection.MUST_USE_ATTRIBUTE,i={Properties:{clipPath:o,cx:o,cy:o,d:o,dx:o,dy:o,fill:o,fillOpacity:o,fontFamily:o,fontSize:o,fx:o,fy:o,gradientTransform:o,gradientUnits:o,markerEnd:o,markerMid:o,markerStart:o,offset:o,opacity:o,patternContentUnits:o,patternUnits:o,points:o,preserveAspectRatio:o,r:o,rx:o,ry:o,spreadMethod:o,stopColor:o,stopOpacity:o,stroke:o,strokeDasharray:o,strokeLinecap:o,strokeOpacity:o,strokeWidth:o,textAnchor:o,transform:o,version:o,viewBox:o,x1:o,x2:o,x:o,y1:o,y2:o,y:o},DOMAttributeNames:{clipPath:"clip-path",fillOpacity:"fill-opacity",fontFamily:"font-family",fontSize:"font-size",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",patternContentUnits:"patternContentUnits",patternUnits:"patternUnits",preserveAspectRatio:"preserveAspectRatio",spreadMethod:"spreadMethod",stopColor:"stop-color",stopOpacity:"stop-opacity",strokeDasharray:"stroke-dasharray",strokeLinecap:"stroke-linecap",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",textAnchor:"text-anchor",viewBox:"viewBox"}};t.exports=i},{10:10}],87:[function(e,t,n){"use strict";function r(e){if("selectionStart"in e&&u.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(window.getSelection){var t=window.getSelection();return{anchorNode:t.anchorNode,anchorOffset:t.anchorOffset,focusNode:t.focusNode,focusOffset:t.focusOffset}}if(document.selection){var n=document.selection.createRange();return{parentElement:n.parentElement(),text:n.text,top:n.boundingTop,left:n.boundingLeft}}}function o(e){if(y||null==m||m!==l())return null;var t=r(m);if(!g||!d(g,t)){g=t;var n=s.getPooled(h.select,v,e);return n.type="select",n.target=m,a.accumulateTwoPhaseDispatches(n),n}}var i=e(15),a=e(20),u=e(63),s=e(93),l=e(119),c=e(136),p=e(139),d=e(146),f=i.topLevelTypes,h={select:{phasedRegistrationNames:{bubbled:p({onSelect:null}),captured:p({onSelectCapture:null})},dependencies:[f.topBlur,f.topContextMenu,f.topFocus,f.topKeyDown,f.topMouseDown,f.topMouseUp,f.topSelectionChange]
}},m=null,v=null,g=null,y=!1,C={eventTypes:h,extractEvents:function(e,t,n,r){switch(e){case f.topFocus:(c(t)||"true"===t.contentEditable)&&(m=t,v=n,g=null);break;case f.topBlur:m=null,v=null,g=null;break;case f.topMouseDown:y=!0;break;case f.topContextMenu:case f.topMouseUp:return y=!1,o(r);case f.topSelectionChange:case f.topKeyDown:case f.topKeyUp:return o(r)}}};t.exports=C},{119:119,136:136,139:139,146:146,15:15,20:20,63:63,93:93}],88:[function(e,t,n){"use strict";var r=Math.pow(2,53),o={createReactRootIndex:function(){return Math.ceil(Math.random()*r)}};t.exports=o},{}],89:[function(e,t,n){"use strict";var r=e(15),o=e(19),i=e(20),a=e(90),u=e(93),s=e(94),l=e(96),c=e(97),p=e(92),d=e(98),f=e(99),h=e(100),m=e(120),v=e(133),g=e(139),y=(e(150),r.topLevelTypes),C={blur:{phasedRegistrationNames:{bubbled:g({onBlur:!0}),captured:g({onBlurCapture:!0})}},click:{phasedRegistrationNames:{bubbled:g({onClick:!0}),captured:g({onClickCapture:!0})}},contextMenu:{phasedRegistrationNames:{bubbled:g({onContextMenu:!0}),captured:g({onContextMenuCapture:!0})}},copy:{phasedRegistrationNames:{bubbled:g({onCopy:!0}),captured:g({onCopyCapture:!0})}},cut:{phasedRegistrationNames:{bubbled:g({onCut:!0}),captured:g({onCutCapture:!0})}},doubleClick:{phasedRegistrationNames:{bubbled:g({onDoubleClick:!0}),captured:g({onDoubleClickCapture:!0})}},drag:{phasedRegistrationNames:{bubbled:g({onDrag:!0}),captured:g({onDragCapture:!0})}},dragEnd:{phasedRegistrationNames:{bubbled:g({onDragEnd:!0}),captured:g({onDragEndCapture:!0})}},dragEnter:{phasedRegistrationNames:{bubbled:g({onDragEnter:!0}),captured:g({onDragEnterCapture:!0})}},dragExit:{phasedRegistrationNames:{bubbled:g({onDragExit:!0}),captured:g({onDragExitCapture:!0})}},dragLeave:{phasedRegistrationNames:{bubbled:g({onDragLeave:!0}),captured:g({onDragLeaveCapture:!0})}},dragOver:{phasedRegistrationNames:{bubbled:g({onDragOver:!0}),captured:g({onDragOverCapture:!0})}},dragStart:{phasedRegistrationNames:{bubbled:g({onDragStart:!0}),captured:g({onDragStartCapture:!0})}},drop:{phasedRegistrationNames:{bubbled:g({onDrop:!0}),captured:g({onDropCapture:!0})}},focus:{phasedRegistrationNames:{bubbled:g({onFocus:!0}),captured:g({onFocusCapture:!0})}},input:{phasedRegistrationNames:{bubbled:g({onInput:!0}),captured:g({onInputCapture:!0})}},keyDown:{phasedRegistrationNames:{bubbled:g({onKeyDown:!0}),captured:g({onKeyDownCapture:!0})}},keyPress:{phasedRegistrationNames:{bubbled:g({onKeyPress:!0}),captured:g({onKeyPressCapture:!0})}},keyUp:{phasedRegistrationNames:{bubbled:g({onKeyUp:!0}),captured:g({onKeyUpCapture:!0})}},load:{phasedRegistrationNames:{bubbled:g({onLoad:!0}),captured:g({onLoadCapture:!0})}},error:{phasedRegistrationNames:{bubbled:g({onError:!0}),captured:g({onErrorCapture:!0})}},mouseDown:{phasedRegistrationNames:{bubbled:g({onMouseDown:!0}),captured:g({onMouseDownCapture:!0})}},mouseMove:{phasedRegistrationNames:{bubbled:g({onMouseMove:!0}),captured:g({onMouseMoveCapture:!0})}},mouseOut:{phasedRegistrationNames:{bubbled:g({onMouseOut:!0}),captured:g({onMouseOutCapture:!0})}},mouseOver:{phasedRegistrationNames:{bubbled:g({onMouseOver:!0}),captured:g({onMouseOverCapture:!0})}},mouseUp:{phasedRegistrationNames:{bubbled:g({onMouseUp:!0}),captured:g({onMouseUpCapture:!0})}},paste:{phasedRegistrationNames:{bubbled:g({onPaste:!0}),captured:g({onPasteCapture:!0})}},reset:{phasedRegistrationNames:{bubbled:g({onReset:!0}),captured:g({onResetCapture:!0})}},scroll:{phasedRegistrationNames:{bubbled:g({onScroll:!0}),captured:g({onScrollCapture:!0})}},submit:{phasedRegistrationNames:{bubbled:g({onSubmit:!0}),captured:g({onSubmitCapture:!0})}},touchCancel:{phasedRegistrationNames:{bubbled:g({onTouchCancel:!0}),captured:g({onTouchCancelCapture:!0})}},touchEnd:{phasedRegistrationNames:{bubbled:g({onTouchEnd:!0}),captured:g({onTouchEndCapture:!0})}},touchMove:{phasedRegistrationNames:{bubbled:g({onTouchMove:!0}),captured:g({onTouchMoveCapture:!0})}},touchStart:{phasedRegistrationNames:{bubbled:g({onTouchStart:!0}),captured:g({onTouchStartCapture:!0})}},wheel:{phasedRegistrationNames:{bubbled:g({onWheel:!0}),captured:g({onWheelCapture:!0})}}},E={topBlur:C.blur,topClick:C.click,topContextMenu:C.contextMenu,topCopy:C.copy,topCut:C.cut,topDoubleClick:C.doubleClick,topDrag:C.drag,topDragEnd:C.dragEnd,topDragEnter:C.dragEnter,topDragExit:C.dragExit,topDragLeave:C.dragLeave,topDragOver:C.dragOver,topDragStart:C.dragStart,topDrop:C.drop,topError:C.error,topFocus:C.focus,topInput:C.input,topKeyDown:C.keyDown,topKeyPress:C.keyPress,topKeyUp:C.keyUp,topLoad:C.load,topMouseDown:C.mouseDown,topMouseMove:C.mouseMove,topMouseOut:C.mouseOut,topMouseOver:C.mouseOver,topMouseUp:C.mouseUp,topPaste:C.paste,topReset:C.reset,topScroll:C.scroll,topSubmit:C.submit,topTouchCancel:C.touchCancel,topTouchEnd:C.touchEnd,topTouchMove:C.touchMove,topTouchStart:C.touchStart,topWheel:C.wheel};for(var b in E)E[b].dependencies=[b];var _={eventTypes:C,executeDispatch:function(e,t,n){var r=o.executeDispatch(e,t,n);r===!1&&(e.stopPropagation(),e.preventDefault())},extractEvents:function(e,t,n,r){var o=E[e];if(!o)return null;var g;switch(e){case y.topInput:case y.topLoad:case y.topError:case y.topReset:case y.topSubmit:g=u;break;case y.topKeyPress:if(0===m(r))return null;case y.topKeyDown:case y.topKeyUp:g=l;break;case y.topBlur:case y.topFocus:g=s;break;case y.topClick:if(2===r.button)return null;case y.topContextMenu:case y.topDoubleClick:case y.topMouseDown:case y.topMouseMove:case y.topMouseOut:case y.topMouseOver:case y.topMouseUp:g=c;break;case y.topDrag:case y.topDragEnd:case y.topDragEnter:case y.topDragExit:case y.topDragLeave:case y.topDragOver:case y.topDragStart:case y.topDrop:g=p;break;case y.topTouchCancel:case y.topTouchEnd:case y.topTouchMove:case y.topTouchStart:g=d;break;case y.topScroll:g=f;break;case y.topWheel:g=h;break;case y.topCopy:case y.topCut:case y.topPaste:g=a}v(g);var C=g.getPooled(o,n,r);return i.accumulateTwoPhaseDispatches(C),C}};t.exports=_},{100:100,120:120,133:133,139:139,15:15,150:150,19:19,20:20,90:90,92:92,93:93,94:94,96:96,97:97,98:98,99:99}],90:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(93),i={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};o.augmentClass(r,i),t.exports=r},{93:93}],91:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(93),i={data:null};o.augmentClass(r,i),t.exports=r},{93:93}],92:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(97),i={dataTransfer:null};o.augmentClass(r,i),t.exports=r},{97:97}],93:[function(e,t,n){"use strict";function r(e,t,n){this.dispatchConfig=e,this.dispatchMarker=t,this.nativeEvent=n;var r=this.constructor.Interface;for(var o in r)if(r.hasOwnProperty(o)){var i=r[o];i?this[o]=i(n):this[o]=n[o]}var u=null!=n.defaultPrevented?n.defaultPrevented:n.returnValue===!1;u?this.isDefaultPrevented=a.thatReturnsTrue:this.isDefaultPrevented=a.thatReturnsFalse,this.isPropagationStopped=a.thatReturnsFalse}var o=e(28),i=e(27),a=e(112),u=e(123),s={type:null,target:u,currentTarget:a.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};i(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e.preventDefault?e.preventDefault():e.returnValue=!1,this.isDefaultPrevented=a.thatReturnsTrue},stopPropagation:function(){var e=this.nativeEvent;e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,this.isPropagationStopped=a.thatReturnsTrue},persist:function(){this.isPersistent=a.thatReturnsTrue},isPersistent:a.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var t in e)this[t]=null;this.dispatchConfig=null,this.dispatchMarker=null,this.nativeEvent=null}}),r.Interface=s,r.augmentClass=function(e,t){var n=this,r=Object.create(n.prototype);i(r,e.prototype),e.prototype=r,e.prototype.constructor=e,e.Interface=i({},n.Interface,t),e.augmentClass=n.augmentClass,o.addPoolingTo(e,o.threeArgumentPooler)},o.addPoolingTo(r,o.threeArgumentPooler),t.exports=r},{112:112,123:123,27:27,28:28}],94:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(99),i={relatedTarget:null};o.augmentClass(r,i),t.exports=r},{99:99}],95:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(93),i={data:null};o.augmentClass(r,i),t.exports=r},{93:93}],96:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(99),i=e(120),a=e(121),u=e(122),s={key:a,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:u,charCode:function(e){return"keypress"===e.type?i(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?i(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}};o.augmentClass(r,s),t.exports=r},{120:120,121:121,122:122,99:99}],97:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(99),i=e(102),a=e(122),u={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:a,button:function(e){var t=e.button;return"which"in e?t:2===t?2:4===t?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+i.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+i.currentScrollTop}};o.augmentClass(r,u),t.exports=r},{102:102,122:122,99:99}],98:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(99),i=e(122),a={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:i};o.augmentClass(r,a),t.exports=r},{122:122,99:99}],99:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(93),i=e(123),a={view:function(e){if(e.view)return e.view;var t=i(e);if(null!=t&&t.window===t)return t;var n=t.ownerDocument;return n?n.defaultView||n.parentWindow:window},detail:function(e){return e.detail||0}};o.augmentClass(r,a),t.exports=r},{123:123,93:93}],100:[function(e,t,n){"use strict";function r(e,t,n){o.call(this,e,t,n)}var o=e(97),i={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};o.augmentClass(r,i),t.exports=r},{97:97}],101:[function(e,t,n){"use strict";var r=e(133),o={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,t,n,o,i,a,u,s){r(!this.isInTransaction());var l,c;try{this._isInTransaction=!0,l=!0,this.initializeAll(0),c=e.call(t,n,o,i,a,u,s),l=!1}finally{try{if(l)try{this.closeAll(0)}catch(p){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return c},initializeAll:function(e){for(var t=this.transactionWrappers,n=e;n<t.length;n++){var r=t[n];try{this.wrapperInitData[n]=i.OBSERVED_ERROR,this.wrapperInitData[n]=r.initialize?r.initialize.call(this):null}finally{if(this.wrapperInitData[n]===i.OBSERVED_ERROR)try{this.initializeAll(n+1)}catch(o){}}}},closeAll:function(e){r(this.isInTransaction());for(var t=this.transactionWrappers,n=e;n<t.length;n++){var o,a=t[n],u=this.wrapperInitData[n];try{o=!0,u!==i.OBSERVED_ERROR&&a.close&&a.close.call(this,u),o=!1}finally{if(o)try{this.closeAll(n+1)}catch(s){}}}this.wrapperInitData.length=0}},i={Mixin:o,OBSERVED_ERROR:{}};t.exports=i},{133:133}],102:[function(e,t,n){"use strict";var r={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(e){r.currentScrollLeft=e.x,r.currentScrollTop=e.y}};t.exports=r},{}],103:[function(e,t,n){"use strict";function r(e,t){if(o(null!=t),null==e)return t;var n=Array.isArray(e),r=Array.isArray(t);return n&&r?(e.push.apply(e,t),e):n?(e.push(t),e):r?[e].concat(t):[e,t]}var o=e(133);t.exports=r},{133:133}],104:[function(e,t,n){"use strict";function r(e){for(var t=1,n=0,r=0;r<e.length;r++)t=(t+e.charCodeAt(r))%o,n=(n+t)%o;return t|n<<16}var o=65521;t.exports=r},{}],105:[function(e,t,n){function r(e){return e.replace(o,function(e,t){return t.toUpperCase()})}var o=/-(.)/g;t.exports=r},{}],106:[function(e,t,n){"use strict";function r(e){return o(e.replace(i,"ms-"))}var o=e(105),i=/^-ms-/;t.exports=r},{105:105}],107:[function(e,t,n){function r(e,t){return e&&t?e===t?!0:o(e)?!1:o(t)?r(e,t.parentNode):e.contains?e.contains(t):e.compareDocumentPosition?!!(16&e.compareDocumentPosition(t)):!1:!1}var o=e(137);t.exports=r},{137:137}],108:[function(e,t,n){function r(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"length"in e&&!("setInterval"in e)&&"number"!=typeof e.nodeType&&(Array.isArray(e)||"callee"in e||"item"in e)}function o(e){return r(e)?Array.isArray(e)?e.slice():i(e):[e]}var i=e(148);t.exports=o},{148:148}],109:[function(e,t,n){"use strict";function r(e){var t=i.createFactory(e),n=o.createClass({tagName:e.toUpperCase(),displayName:"ReactFullPageComponent"+e,componentWillUnmount:function(){a(!1)},render:function(){return t(this.props)}});return n}var o=e(33),i=e(55),a=e(133);t.exports=r},{133:133,33:33,55:55}],110:[function(e,t,n){function r(e){var t=e.match(c);return t&&t[1].toLowerCase()}function o(e,t){var n=l;s(!!l);var o=r(e),i=o&&u(o);if(i){n.innerHTML=i[1]+e+i[2];for(var c=i[0];c--;)n=n.lastChild}else n.innerHTML=e;var p=n.getElementsByTagName("script");p.length&&(s(t),a(p).forEach(t));for(var d=a(n.childNodes);n.lastChild;)n.removeChild(n.lastChild);return d}var i=e(21),a=e(108),u=e(125),s=e(133),l=i.canUseDOM?document.createElement("div"):null,c=/^\s*<(\w+)/;t.exports=o},{108:108,125:125,133:133,21:21}],111:[function(e,t,n){"use strict";function r(e,t){var n=null==t||"boolean"==typeof t||""===t;if(n)return"";var r=isNaN(t);return r||0===t||i.hasOwnProperty(e)&&i[e]?""+t:("string"==typeof t&&(t=t.trim()),t+"px")}var o=e(4),i=o.isUnitlessNumber;t.exports=r},{4:4}],112:[function(e,t,n){function r(e){return function(){return e}}function o(){}o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},t.exports=o},{}],113:[function(e,t,n){"use strict";var r={};t.exports=r},{}],114:[function(e,t,n){"use strict";function r(e){return i[e]}function o(e){return(""+e).replace(a,r)}var i={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},a=/[&><"']/g;t.exports=o},{}],115:[function(e,t,n){"use strict";function r(e){return null==e?null:u(e)?e:o.has(e)?i.getNodeFromInstance(e):(a(null==e.render||"function"!=typeof e.render),void a(!1))}{var o=(e(39),e(65)),i=e(68),a=e(133),u=e(135);e(150)}t.exports=r},{133:133,135:135,150:150,39:39,65:65,68:68}],116:[function(e,t,n){"use strict";function r(e,t,n){var r=e,o=!r.hasOwnProperty(n);o&&null!=t&&(r[n]=t)}function o(e){if(null==e)return e;var t={};return i(e,r,t),t}{var i=e(149);e(150)}t.exports=o},{149:149,150:150}],117:[function(e,t,n){"use strict";function r(e){try{e.focus()}catch(t){}}t.exports=r},{}],118:[function(e,t,n){"use strict";var r=function(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)};t.exports=r},{}],119:[function(e,t,n){function r(){try{return document.activeElement||document.body}catch(e){return document.body}}t.exports=r},{}],120:[function(e,t,n){"use strict";function r(e){var t,n=e.keyCode;return"charCode"in e?(t=e.charCode,0===t&&13===n&&(t=13)):t=n,t>=32||13===t?t:0}t.exports=r},{}],121:[function(e,t,n){"use strict";function r(e){if(e.key){var t=i[e.key]||e.key;if("Unidentified"!==t)return t}if("keypress"===e.type){var n=o(e);return 13===n?"Enter":String.fromCharCode(n)}return"keydown"===e.type||"keyup"===e.type?a[e.keyCode]||"Unidentified":""}var o=e(120),i={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},a={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};t.exports=r},{120:120}],122:[function(e,t,n){"use strict";function r(e){var t=this,n=t.nativeEvent;if(n.getModifierState)return n.getModifierState(e);var r=i[e];return r?!!n[r]:!1}function o(e){return r}var i={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};t.exports=o},{}],123:[function(e,t,n){"use strict";function r(e){var t=e.target||e.srcElement||window;return 3===t.nodeType?t.parentNode:t}t.exports=r},{}],124:[function(e,t,n){"use strict";function r(e){var t=e&&(o&&e[o]||e[i]);return"function"==typeof t?t:void 0}var o="function"==typeof Symbol&&Symbol.iterator,i="@@iterator";t.exports=r},{}],125:[function(e,t,n){function r(e){return i(!!a),d.hasOwnProperty(e)||(e="*"),u.hasOwnProperty(e)||("*"===e?a.innerHTML="<link />":a.innerHTML="<"+e+"></"+e+">",u[e]=!a.firstChild),u[e]?d[e]:null}var o=e(21),i=e(133),a=o.canUseDOM?document.createElement("div"):null,u={circle:!0,clipPath:!0,defs:!0,ellipse:!0,g:!0,line:!0,linearGradient:!0,path:!0,polygon:!0,polyline:!0,radialGradient:!0,rect:!0,stop:!0,text:!0},s=[1,'<select multiple="true">',"</select>"],l=[1,"<table>","</table>"],c=[3,"<table><tbody><tr>","</tr></tbody></table>"],p=[1,"<svg>","</svg>"],d={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:s,option:s,caption:l,colgroup:l,tbody:l,tfoot:l,thead:l,td:c,th:c,circle:p,clipPath:p,defs:p,ellipse:p,g:p,line:p,linearGradient:p,path:p,polygon:p,polyline:p,radialGradient:p,rect:p,stop:p,text:p};t.exports=r},{133:133,21:21}],126:[function(e,t,n){"use strict";function r(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function o(e){for(;e;){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function i(e,t){for(var n=r(e),i=0,a=0;n;){if(3===n.nodeType){if(a=i+n.textContent.length,t>=i&&a>=t)return{node:n,offset:t-i};i=a}n=r(o(n))}}t.exports=i},{}],127:[function(e,t,n){"use strict";function r(e){return e?e.nodeType===o?e.documentElement:e.firstChild:null}var o=9;t.exports=r},{}],128:[function(e,t,n){"use strict";function r(){return!i&&o.canUseDOM&&(i="textContent"in document.documentElement?"textContent":"innerText"),i}var o=e(21),i=null;t.exports=r},{21:21}],129:[function(e,t,n){"use strict";function r(e){return e===window?{x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}t.exports=r},{}],130:[function(e,t,n){function r(e){return e.replace(o,"-$1").toLowerCase()}var o=/([A-Z])/g;t.exports=r},{}],131:[function(e,t,n){"use strict";function r(e){return o(e).replace(i,"-ms-")}var o=e(130),i=/^ms-/;t.exports=r},{130:130}],132:[function(e,t,n){"use strict";function r(e){return"function"==typeof e&&"undefined"!=typeof e.prototype&&"function"==typeof e.prototype.mountComponent&&"function"==typeof e.prototype.receiveComponent}function o(e,t){var n;if((null===e||e===!1)&&(e=a.emptyElement),"object"==typeof e){var o=e;n=t===o.type&&"string"==typeof o.type?u.createInternalComponent(o):r(o.type)?new o.type(o):new c}else"string"==typeof e||"number"==typeof e?n=u.createInstanceForText(e):l(!1);return n.construct(e),n._mountIndex=0,n._mountImage=null,n}var i=e(37),a=e(57),u=e(71),s=e(27),l=e(133),c=(e(150),function(){});s(c.prototype,i.Mixin,{_instantiateReactComponent:o}),t.exports=o},{133:133,150:150,27:27,37:37,57:57,71:71}],133:[function(e,t,n){"use strict";var r=function(e,t,n,r,o,i,a,u){if(!e){var s;if(void 0===t)s=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[n,r,o,i,a,u],c=0;s=new Error("Invariant Violation: "+t.replace(/%s/g,function(){return l[c++]}))}throw s.framesToPop=1,s}};t.exports=r},{}],134:[function(e,t,n){"use strict";function r(e,t){if(!i.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,r=n in document;if(!r){var a=document.createElement("div");a.setAttribute(n,"return;"),r="function"==typeof a[n]}return!r&&o&&"wheel"===e&&(r=document.implementation.hasFeature("Events.wheel","3.0")),r}var o,i=e(21);i.canUseDOM&&(o=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0),t.exports=r},{21:21}],135:[function(e,t,n){function r(e){return!(!e||!("function"==typeof Node?e instanceof Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}t.exports=r},{}],136:[function(e,t,n){"use strict";function r(e){return e&&("INPUT"===e.nodeName&&o[e.type]||"TEXTAREA"===e.nodeName)}var o={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};t.exports=r},{}],137:[function(e,t,n){function r(e){return o(e)&&3==e.nodeType}var o=e(135);t.exports=r},{135:135}],138:[function(e,t,n){"use strict";var r=e(133),o=function(e){var t,n={};r(e instanceof Object&&!Array.isArray(e));for(t in e)e.hasOwnProperty(t)&&(n[t]=t);return n};t.exports=o},{133:133}],139:[function(e,t,n){var r=function(e){var t;for(t in e)if(e.hasOwnProperty(t))return t;return null};t.exports=r},{}],140:[function(e,t,n){"use strict";function r(e,t,n){if(!e)return null;var r={};for(var i in e)o.call(e,i)&&(r[i]=t.call(n,e[i],i,e));return r}var o=Object.prototype.hasOwnProperty;t.exports=r},{}],141:[function(e,t,n){"use strict";function r(e){var t={};return function(n){return t.hasOwnProperty(n)||(t[n]=e.call(this,n)),t[n]}}t.exports=r},{}],142:[function(e,t,n){"use strict";function r(e){return i(o.isValidElement(e)),e}var o=e(55),i=e(133);t.exports=r},{133:133,55:55}],143:[function(e,t,n){"use strict";function r(e){return'"'+o(e)+'"'}var o=e(114);t.exports=r},{114:114}],144:[function(e,t,n){"use strict";var r=e(21),o=/^[ \r\n\t\f]/,i=/<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/,a=function(e,t){e.innerHTML=t};if("undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction&&(a=function(e,t){MSApp.execUnsafeLocalFunction(function(){e.innerHTML=t})}),r.canUseDOM){var u=document.createElement("div");u.innerHTML=" ",""===u.innerHTML&&(a=function(e,t){if(e.parentNode&&e.parentNode.replaceChild(e,e),o.test(t)||"<"===t[0]&&i.test(t)){e.innerHTML="\ufeff"+t;var n=e.firstChild;1===n.data.length?e.removeChild(n):n.deleteData(0,1)}else e.innerHTML=t})}t.exports=a},{21:21}],145:[function(e,t,n){"use strict";var r=e(21),o=e(114),i=e(144),a=function(e,t){e.textContent=t};r.canUseDOM&&("textContent"in document.documentElement||(a=function(e,t){i(e,o(t))})),t.exports=a},{114:114,144:144,21:21}],146:[function(e,t,n){"use strict";function r(e,t){if(e===t)return!0;var n;for(n in e)if(e.hasOwnProperty(n)&&(!t.hasOwnProperty(n)||e[n]!==t[n]))return!1;for(n in t)if(t.hasOwnProperty(n)&&!e.hasOwnProperty(n))return!1;return!0}t.exports=r},{}],147:[function(e,t,n){"use strict";function r(e,t){if(null!=e&&null!=t){var n=typeof e,r=typeof t;if("string"===n||"number"===n)return"string"===r||"number"===r;if("object"===r&&e.type===t.type&&e.key===t.key){var o=e._owner===t._owner;return o}}return!1}e(150);t.exports=r},{150:150}],148:[function(e,t,n){function r(e){var t=e.length;if(o(!Array.isArray(e)&&("object"==typeof e||"function"==typeof e)),o("number"==typeof t),o(0===t||t-1 in e),e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(n){}for(var r=Array(t),i=0;t>i;i++)r[i]=e[i];return r}var o=e(133);t.exports=r},{133:133}],149:[function(e,t,n){"use strict";function r(e){return v[e]}function o(e,t){return e&&null!=e.key?a(e.key):t.toString(36)}function i(e){return(""+e).replace(g,r)}function a(e){return"$"+i(e)}function u(e,t,n,r,i){var s=typeof e;if(("undefined"===s||"boolean"===s)&&(e=null),null===e||"string"===s||"number"===s||l.isValidElement(e))return r(i,e,""===t?h+o(e,0):t,n),1;var p,v,g,y=0;if(Array.isArray(e))for(var C=0;C<e.length;C++)p=e[C],v=(""!==t?t+m:h)+o(p,C),g=n+y,y+=u(p,v,g,r,i);else{var E=d(e);if(E){var b,_=E.call(e);if(E!==e.entries)for(var x=0;!(b=_.next()).done;)p=b.value,v=(""!==t?t+m:h)+o(p,x++),g=n+y,y+=u(p,v,g,r,i);else for(;!(b=_.next()).done;){var D=b.value;D&&(p=D[1],v=(""!==t?t+m:h)+a(D[0])+m+o(p,0),g=n+y,y+=u(p,v,g,r,i))}}else if("object"===s){f(1!==e.nodeType);var M=c.extract(e);for(var N in M)M.hasOwnProperty(N)&&(p=M[N],v=(""!==t?t+m:h)+a(N)+m+o(p,0),g=n+y,y+=u(p,v,g,r,i))}}return y}function s(e,t,n){return null==e?0:u(e,"",0,t,n)}var l=e(55),c=e(61),p=e(64),d=e(124),f=e(133),h=(e(150),p.SEPARATOR),m=":",v={"=":"=0",".":"=1",":":"=2"},g=/[=.:]/g;t.exports=s},{124:124,133:133,150:150,55:55,61:61,64:64}],150:[function(e,t,n){"use strict";var r=e(112),o=r;t.exports=o},{112:112}]},{},[1])(1)});
define('analysis/WizardStore',[
	'lodash'
], function (_) {

	var Callbacks = {};
	var Store = {};

	/**
	* Expected items so far in the store
	* If you add new keys to the store, place them in the list below to help developers know what data will be available
	*
	* @property {object|array} analysisArea 		- Is a Feature or Array of Features
	* @property {number} userStep								- User's current step in the Wizard, a number 0 -3( or 4)
	* @property {string} areaOfInterest 				- Option chosen in step one of Wizard, will be an ID for a radio button of selected option
	* @property {object} analysisSets						- Object containing keywords of types of analysis to perform and boolean indicating if it is included in analysis
	* @property {string} optionalAnalysisLabel  - Label to be used when multiple features are selected
	* @property {array} customFeatures					- Array of Graphic objects (points & polygons)
	*/

	var Interface = {

		/**
		* @param {string} key - key of item in store
		*/
		get: function (key) {
			return Store[key];
		},

    /**
    * @param {string} key - key of item in store
    */
    clone: function(key) {
      return _.cloneDeep(Store[key]);
    },

		/**
		* @param {string} key - key of item in store
		* @param {string} vaule - Item to save in store
		*/
		set: function (key, value, skipUpdate) {
			Store[key] = value;
      if (!skipUpdate) {
        this.updateSubscribers(key);
      }
		},

		/**
		* @param {string} key - key of item in Callbacks
		* @param {function} callback - callback to trigger on update of store
		*/
		registerCallback: function (key, callback) {
			if (Callbacks[key]) {
				Callbacks[key].push(callback);
			} else {
				Callbacks[key] = [];
				Callbacks[key].push(callback);
			}
		},

		/**
		* @param {string} key - key of Callbacks to invoke
		*/
		updateSubscribers: function (key) {
			var callbacks = Callbacks[key];

			if (callbacks) {
				callbacks.forEach(function (func) {
					func();
				});
			}
		},

		/**
		* log the store to the console so I can inspect it in the app
		*/
		debug: function () {
			console.dir(Store);
		}

	};

	return Interface;

});

define('analysis/config',[], function() {

    // Variables Used to Track which Area is Selected
    var customArea = 'customAreaOption',
        adminUnit = 'adminUnitOption',
        commArea = 'commercialEntityOption',
        certArea = 'certifiedAreaOption',
        millPoint = 'millPointOption';

    // URLS - CURRENT IS STAGING, PRODUCTION URL BELOW
    // var adminUnitQueryUrl = 'http://175.41.139.43/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer';

    // PRODUCTION URL
    var adminUnitQueryUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer',
        millPointMapService = 'http://gis-gfw.wri.org/arcgis/rest/services/commodities/MapServer';

    return {

        noNameField: 'No Group Information Available',

        wizard: {
            breadcrumbs: ['Select Area', 'Refine Area', 'Select Analysis']
            //breadcrumbs: ['Select Area', 'Refine Area', 'Select Analysis', 'Refine Analysis']
        },

        intro: {
          beginningText: 'Create custom analysis of your area of interest – such as a commodity concession or group of concessions -- considering factors such as:',
          firstList: [
            'Tree cover change',
            'Fire activity',
            'Primary or intact forest areas',
            'Protected areas',
            'Legal classification of land'
          ],
          secondaryText: 'You can also: ',
          secondList: [
            'Upload your own shapefiles for analysis',
            'Draw an area of interest',
            'Sign up for alerts for clearance activity'
          ]
        },

        stepOne: {
            title: 'Step 1: Select Area of interest',
            description: 'Set the area to analyze using one of the following options.',
            option1: {
                'id': customArea,
                'label': 'Create custom area',
                'description': 'Draw a polygon or upload a shapefile to analyze.'
            },
            option2: {
                'id': adminUnit,
                'label': 'Administrative unit',
                'description': 'Analyze provinces, districts, and other subnational areas.'
            },
            option3: {
                'id': commArea,
                'label': 'Concession area',
                'description': 'Analyze an individual concession or a group of concessions.'
            },
            option4: {
                'id': certArea,
                'label': 'Certified area',
                'description': 'Analyze RSPO certified palm oil concessions.'
            },
            option5: {
                'id': millPoint,
                'label': 'Palm oil mill points',
                'description': 'Analyze deforestation-related risks for a mill or set of mills.'
            }
        },

        stepTwo: {
            title: 'Step 2: Refine area',
            customArea: customArea,
            adminUnit: adminUnit,
            commArea: commArea,
            certArea: certArea,
            millPoint: millPoint,
            currentFeatureText: 'Current selection: ',
            labelField: 'WRI_label'
        },

        stepThree: {
            title: 'Step 3: Select a variable to analyze',
            description: 'Select which types of analysis you would like to perform and then click \'Perform Analysis\'.  You must select at least one option.',
            //description: 'Select which type of analysis you would like included in your results and then click \'Next\'.',
            currentFeatureText: 'Current selection: ',
            millPoint: millPoint,
            customArea: customArea,
            pointRadiusDescription: 'Choose a buffer for your points:',
            knownMillsDisclaimer: '(Analysis based on 50km buffer)',
            pointRadiusOptions: [
              {label: '50km', value: 50},
              {label: '40km', value: 40},
              {label: '30km', value: 30},
              {label: '20km', value: 20},
              {label: '10km', value: 10}
            ],
            cb1: {
                label: 'Forest Change',
                value: 'forest'
            },
            cb2: {
                label: 'Tree cover loss and fires',
                value: 'loss'
            },
            cb3: {
                label: 'FORMA clearance alerts',
                value: 'forma'
            },
            cb4: {
                label: 'Suitability',
                value: 'suit'
            },
            cb5: {
                label: 'Risk Assessment',
                value: 'risk'
            },
            checkboxes: [{
                label: 'ID Primary Forests',
                value: 'primForest',
                checked: false
            }, {
                label: 'Tree Cover Density',
                value: 'treeDensity',
                checked: false
            }, {
                label: 'Legal Classes',
                value: 'legal',
                checked: false
            }, {
                label: 'Protected Areas',
                value: 'protected',
                checked: true
            }, {
                label: 'Aboveground Biomass Density',
                value: 'carbon',
                checked: false
            }, {
                label: 'Brazil Biomes',
                value: 'biomes',
                checked: false
            }, {
                label: 'Intact Forests',
                value: 'intact',
                checked: true
            }, {
                label: 'Land Cover - Global',
                value: 'landCoverGlob',
                checked: false
            }, {
                label: 'Land Cover - SE Asia',
                value: 'landCoverAsia',
                checked: false
            }, {
                label: 'Land Cover - Indonesia',
                value: 'landCoverIndo',
                checked: false
            }, {
                label: 'Peat Lands',
                value: 'peat',
                checked: false
            }, {
                label: 'Tree Cover Loss',
                value: 'treeCoverLoss',
                checked: true
            }, {
                label: 'Indonesia Moratorium',
                value: 'indonesiaMoratorium',
                checked: false
            }, {
                label: 'Prodes deforestation',
                value: 'prodes',
                checked: false
            }, {
                label: 'Plantations by Type',
                value: 'plantationsTypeLayer',
                checked: false
            }, {
                label: 'Plantations by Species',
                value: 'plantationsSpeciesLayer',
                checked: false
            // }, {
            //     label: 'GLAD Alerts',
            //     value: 'gladAlerts',
            //     checked: false
            }, {
                label: 'Gran Chaco deforestation (Guyra Paraguay)',
                value: 'guyraAlerts',
                checked: false
            }
          ],
            suit: {
                label: 'Oil Palm Suitability',
                value: 'suit',
                description: 'Analyze Areas potentially suitable and unsuitable for palm oil development using WRI\'s methodology.'
            },
            rspo: {
                label: 'RSPO Land Use Change Analysis',
                value: 'rspo',
                description: 'Analyze tree cover loss according to the RSPO compensation procedure and New Planting Procedure guidelines.'
            },
            mill: {
                label: 'PALM Risk Tool',
                value: 'mill',
                description: 'Analyze deforestation-related risks for a mill or set of mills.'
            },
            forestChange: {
                label: 'Forest Change Analysis',
                value: 'fca',
                description: 'Analyze tree cover loss and fire activity according to the selected variable(s).'
            }
        },

        stepFour: {
            title: 'Step 4: Refine Analysis',
            description: 'Select which data sets you would like to include in your analysis and then click \'Perform Analysis\'.  You must select at least one data set.',
            checkboxes: [{
                label: 'Primary Forests',
                value: 'primForest'
            }, {
                label: 'Tree Cover Density',
                value: 'treeDensity'
            }, {
                label: 'Legal Classes',
                value: 'legal'
            }, {
                label: 'Protected Areas',
                value: 'protected'
            }, {
                label: 'Aboveground Biomass Density',
                value: 'carbon'
            }, {
                label: 'Intact Forests',
                value: 'intact'
            }, {
                label: 'Land Cover - Global',
                value: 'landCoverGlob'
            }, {
                label: 'Land Cover - Southeast Asia',
                value: 'landCoverAsia'
            }, {
                label: 'Land Cover - Indonesia',
                value: 'landCoverIndo'
            }, {
                label: 'Peat Lands',
                value: 'peat'
            }]
        },

        customArea: {
            instructions: 'Select the \'Freehand\' or \'Polygon\' options below to draw an area of interest on the map, or choose \'Upload\' to upload a zipped shapefile of polygons or points or a list of point coordinates to analyze.',
            instructionsPartTwo: 'Select an area from the list below and click \'Next\' to proceed.',
            customCoordLabel: 'Enter Coordinates',
            freehandLabel: 'Freehand',
            uploadLabel: 'Upload',
            polyLabel: 'Polygon',
            uploadInstructions: [
                'Select a zip file(.zip) containing a shapefile(.shp,.dbf,.prj) from your local file system.',
                'The shapefile must be in Geographic Coordinate System (WGS84).',
                'The shapefile must be of POLYGON geometry type.',
                'The shapefile must not exceed 1 Megabyte.'
            ],
            incorrectFileTypeError: 'Your shapefile must be of type .zip, please choose another file.',
            portalUrl: 'http://www.arcgis.com/sharing/rest/content/features/generate'
        },

        adminUnit: {
            instructions: 'Select a country to view it\'s first or second level administrative units:',
            instructionsPartTwo: 'Select a province or district from the list below and click \'Next\' to proceed.',
            countriesQuery: {
                url: adminUnitQueryUrl + '/7',
                where: 'NAME_0 IS NOT NULL',
                outFields: ['NAME_0'],
                orderBy: ['NAME_0'],
                groupBy: ['NAME_0'],
                statistic: { // This is necessary to support the groupBy, cannot currently groupBy without statisticsQuery :(
                    'statisticType': 'count',
                    'onStatisticField': 'OBJECTID',
                    'outStatisticFieldName': 'OBJECTID'
                },
                labelValueField: 'NAME_0' // For label and value in select box
            },
            lowLevelUnitsQuery: {
                url: adminUnitQueryUrl + '/7',
                whereField: 'NAME_0',
                requiredField: 'NAME_1',
                outFields: ['NAME_0', 'NAME_1', 'NAME_2', 'OBJECTID'],
                orderBy: ['NAME_1', 'NAME_2'],
                labelField: 'NAME_2',
                valueField: 'OBJECTID'
            },
            countryBoundaries: {
                url: adminUnitQueryUrl + '/6',
                whereField: 'NAME_0',
                requiredField: 'NAME_1' // USed for Admin Unit Group Queries
            }
        },

        commercialEntity: {
            instructions: 'Select a commodity type:',
            instructionsPartTwo: 'Select a concession or group from the list below and click \'Next\' to proceed.',
            commodityOptions: [{
                label: 'None',
                value: 'NONE'
            }, {
                label: 'Logging concession',
                value: 'Logging concession'
            }, {
                label: 'Mining concession',
                value: 'Mining concession'
            }, {
                label: 'Oil palm concession',
                value: 'Oil palm concession'
            }, {
                label: 'Wood fiber plantation',
                value: 'Wood fiber plantation'
            }],
            commodityQuery: {
                url: adminUnitQueryUrl + '/13',
                whereField: 'TYPE',
                outFields: ['GROUP_NAME', 'Name', 'TYPE', 'OBJECTID'],
                orderBy: ['GROUP_NAME', 'Name'],
                labelField: 'Name', // Children
                valueField: 'OBJECTID',
                requiredField: 'GROUP_NAME' // Bucket a.k.a. parent
            },
            groupQuery: {
                url: adminUnitQueryUrl + '/27',
                requiredField: 'GROUP_NAME'
            }
        },

        certifiedArea: {
            instructions: 'Select a commodity type:',
            instructionsPartTwo: 'Select a Certification Scheme:',
            instructionsPartThree: 'Select a concession or group from the list below and click \'Next\' to proceed',
            commodityOptions: [{
                label: 'Oil palm concession',
                value: 'Oil palm concession'
            }],
            certificationOptions: [{
                label: 'None',
                value: 'NONE'
            }, {
                label: 'RSPO',
                value: 'RSPO'
            }],

            schemeQuery: {
                url: adminUnitQueryUrl + '/13',
                whereField: 'CERT_SCHEME',
                secondaryWhereField: 'TYPE',
                outFields: ['GROUP_NAME', 'Name', 'CERT_SCHEME', 'OBJECTID'],
                orderBy: ['GROUP_NAME', 'Name'],
                labelField: 'Name', // Children
                valueField: 'OBJECTID',
                requiredField: 'GROUP_NAME' // Bucket a.k.a. parent
            },
            groupQuery: {
                url: adminUnitQueryUrl + '/28',
                requiredField: 'GROUP_NAME'
            }
        },

        millPoints: {
            instructions: 'Select a method for choosing or creating mill points to analyze.',
            selectInstructions: 'Select a commodity type:',
            listInstructions: 'Select mill(s) from the list below and click \'Next\' to proceed.',
            selectFromListButton: 'Select from List',
            selectFromCustomListButton: 'Select from my features',
            enterCoordinatesButton: 'Enter Coordinates',
            uploadButton: 'Upload',
            commodityOptions: [{
                label: 'Oil palm',
                value: 'Oil palm concession'
            }],
            url: millPointMapService + '/27',
            // api: 'http://risk-api.appspot.com/',
            api: 'http://wip.risk-api.appspot.com/',
            outFields: ['group_name', 'mill_name_', 'wri_id'],
            orderBy: ['group_name', 'mill_name_'],
            labelField: 'mill_name_', // Children
            valueField: 'wri_id',
            requiredField: 'group_name' // Bucket a.k.a. parent
        },

        STORE_KEYS: {
            customFeatures: 'customFeatures',
            removedCustomFeatures: 'removedCustomFeatures',
            selectedCustomFeatures: 'selectedCustomFeatures',
            selectedPresetFeature: 'selectedPresetFeature',
            userStep: 'userStep',
            areaOfInterest: 'areaOfInterest',
            analysisSets: 'analysisSets',
            analysisPointRadius: 'analysisPointRadius',
            alertsDialogActive: 'alertsDialogActive',
            forestChangeCheckbox: 'forestChangeCheckbox'
        }
    };

});

define('components/alertsForm/config',[
  'analysis/config'
], function(AnalyzerConfig){
  return {
    // Referenced configs
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    customArea: {
      instructions: AnalyzerConfig.customArea.instructions,
      freehandLabel: AnalyzerConfig.customArea.freehandLabel,
      polyLabel: AnalyzerConfig.customArea.polyLabel,
      uploadLabel: AnalyzerConfig.customArea.uploadLabel
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS,
    // Unique configs
    MODAL_ID: 'subscription-modal',
    TEXT: {
      title: 'Alerts Subscription',
      selection: 'Current selection:',
      noSelection: 'none',
      modalTitle: 'Subscribe to Alerts',
      subscribe: 'Subscribe'
    }
  }
});

define('components/featureList/config',[
  'analysis/config'
], function(AnalyzerConfig){
  return {
    // Referenced configs
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS,
    // Unique configs
    TEXT: {
      instruction: 'Select areas of interest using the left checkboxes.',
      noAreas: 'No current areas of interest, please draw or upload some.',
      clear: 'Clear Selection',
      headers: [
        'Type',
        'Area Name',
        'RSPO'
      ]
    }
  }
});

/** @jsx React.DOM */

define('components/featureList/FeatureList',[
  // libs
  'react',
  'lodash',
  // src
  'components/featureList/config',
  'analysis/WizardStore',
  'utils/GeoHelper',
  'map/config'
], function (React, _, FeatureListConfig, WizardStore, GeoHelper, MapConfig) {

  var FeatureList,
      getDefaultState,
      TEXT = FeatureListConfig.TEXT,
      KEYS = FeatureListConfig.STORE_KEYS,
      self = this;

  return React.createClass({

    propTypes: {
      features: React.PropTypes.array.isRequired,
      selectedFeatures: React.PropTypes.array.isRequired,
      rspoChecks: React.PropTypes.bool,
      showClear: React.PropTypes.bool
    },

    render: function () {
      var allFeaturesSelected = false,
          featureIds,
          selectedFeatureIds,
          allFeaturesRSPO,
          clearButton,
          rspoChecksHeader = '';

      if (this.props.selectedFeatures) {
        featureIds = this.props.features.map(this._featuresIdMapper);
        selectedFeatureIds = this.props.selectedFeatures.map(function (selectedFeature) {return selectedFeature.attributes.WRI_ID});
        allFeaturesSelected = featureIds.length > 0 && _.difference(featureIds, selectedFeatureIds).length === 0;
      }

      if (this.props.rspoChecks) {
        allFeaturesRSPO = this.props.features.length > 0 ? _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}) : false;
        rspoChecksHeader = React.createElement("th", null, React.createElement("label", null, React.createElement("input", {type: "checkbox", onChange: this._toggleAllFeaturesRSPO, checked: allFeaturesRSPO, disabled: this.props.features.length === 0}), TEXT.headers[2]));
      }

      if (this.props.selectedFeatures.length === 0 || (this.props.showClear !== undefined && this.props.showClear === false)) {
        clearButton = '';
      } else {
        clearButton = React.createElement("button", {className: "button-link float-right margin__right no-padding__right", onClick: this._removeFeatureSelection}, TEXT.clear);
      }

      return (
        React.createElement("div", {className: "feature-list"}, 
          clearButton, 
          React.createElement("div", {className: "padding__wide margin__bottom instructions"}, TEXT.instruction), 
          React.createElement("table", {className: "feature-list__table no-border-spacing fill__wide border-box border-orange"}, 
            React.createElement("thead", null, 
              React.createElement("tr", {className: "text-white text-center back-orange"}, 
                React.createElement("th", null, React.createElement("input", {type: "checkbox", onChange: this._toggleAllFeaturesSelection, checked: allFeaturesSelected, disabled: this.props.features.length === 0})), 
                React.createElement("th", null, TEXT.headers[0]), 
                React.createElement("th", null, TEXT.headers[1]), 
                rspoChecksHeader
              )
            ), 
            React.createElement("tbody", null, 
              this._noFeatures(), 
              this.props.features.map(this._featuresMapper, this)
            )
          )
        )
      );
    },

    _featuresMapper: function (feature, index) {
      var isSelected = _.find(this.props.selectedFeatures, function (selectedFeature) { return feature.attributes.WRI_ID === selectedFeature.attributes.WRI_ID}) || false,
          className = index % 2 === 0 ? 'back-light-gray' : '',
          className = isSelected ? 'text-white back-medium-gray' : className,
          rspoChecks = this.props.rspoChecks ? React.createElement("td", {className: "text-center"}, React.createElement("input", {type: "checkbox", onChange: this._toggleFeatureRSPO, checked: feature.attributes.isRSPO, "data-feature-id": feature.attributes.WRI_ID})) : '',
          typeIcon = 'app/css/images/icon_' + (feature.geometry.type === 'polygon' ? 'polygon_' : 'circle_') + (isSelected ? 'white' : 'gray') + '.png';

      return (
        React.createElement("tr", {key: index, className: className}, 
          React.createElement("td", {className: "text-center"}, 
            React.createElement("input", {type: "checkbox", onChange: this._toggleFeatureSelection, checked: isSelected, "data-feature-index": index, "data-feature-id": feature.attributes.WRI_ID})
          ), 
          React.createElement("td", {className: "text-center"}, 
            React.createElement("img", {className: "vertical-middle", width: "15px", height: "15px", src: typeIcon})
          ), 
          React.createElement("td", null, 
            React.createElement("input", {className: "custom-feature-label text-inherit-color vertical-middle feedback-outline-orange", type: "text", onChange: this._renameFeature, value: feature.attributes[FeatureListConfig.stepTwo.labelField], "data-feature-index": index, "data-feature-id": feature.attributes.WRI_ID})
          ), 
          rspoChecks
        )
      )
    },

    _noFeatures: function () {
      var colSpan = this.props.rspoChecks ? '4' : '3';

      if (this.props.features.length > 0) {
        return React.createElement("tr", {className: "text-center"});
      }

      return (
        React.createElement("tr", null, 
          React.createElement("td", {className: "text-center text-medium-gray", colSpan: colSpan}, React.createElement("i", null, TEXT.noAreas))
        )
      )
    },

    _toggleFeatureSelection: function (evt) {
      var index,
          id,
          filteredSelectedFeatures;

      if (evt.target.checked) {
        index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute('data-feature-index'));
        filteredSelectedFeatures = this.props.selectedFeatures.concat(this.props.features[index]);
      } else {
        id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute('data-feature-id')),
        filteredSelectedFeatures = _.filter(this.props.selectedFeatures, function (selectedFeature) { return selectedFeature.attributes.WRI_ID !== id })
      }

      this.addHighlightFeatures(filteredSelectedFeatures);
      WizardStore.set(KEYS.selectedCustomFeatures, filteredSelectedFeatures);

    },

    _toggleAllFeaturesSelection: function (evt) {
      var features = this.props.features,
          featureIds = features.map(this._featuresIdMapper),
          selectedFeatureIds,
          featuresToSelect,
          updatedSelectedFeatures;

      if (evt.target.checked) {
        selectedFeatureIds = this.props.selectedFeatures.map(this._featuresIdMapper),
        featuresToSelect = _.difference(featureIds, selectedFeatureIds).map(function (id) { return _.find(features, function (feature) {return feature.attributes.WRI_ID === id}) }),
        updatedSelectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures).concat(featuresToSelect);
      } else {
        updatedSelectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures).filter(function (feature) { return featureIds.indexOf(feature.attributes.WRI_ID) < 0 });
      }

      this.addHighlightFeatures(updatedSelectedFeatures);
      WizardStore.set(KEYS.selectedCustomFeatures, updatedSelectedFeatures);
    },

    addHighlightFeatures: function (features) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);

      if (wizardGraphicsLayer) {
        // Clear Previous Selection Features
        wizardGraphicsLayer.clear();
        features.forEach(function (feature) {
          feature = GeoHelper.applySelectionSymbolToFeature(feature);
          wizardGraphicsLayer.add(feature);
        });
      }

    },

    _toggleAllFeaturesRSPO: function () {
      if (this.props.features.length === 0) {
        return;
      }

      var feature,
          features = WizardStore.get(KEYS.customFeatures),
          featureIdsToUpdate = this.props.features.map(this._featuresIdMapper),
          allFeaturesRSPO = _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}),
          shouldFeaturesRSPO = !allFeaturesRSPO;

      featureIdsToUpdate.forEach(function (id) {
        feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});
        if (feature) {
          feature.attributes.isRSPO = shouldFeaturesRSPO;
        }
      });
      WizardStore.set(KEYS.customFeatures, features);
    },

    _toggleFeatureRSPO: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute('data-feature-id')),
          features = WizardStore.get(KEYS.customFeatures),
          feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});

      if (feature) {
        feature.attributes.isRSPO = !feature.attributes.isRSPO;
        WizardStore.set(KEYS.customFeatures, features);
      } else {
        throw new Error('Could not find feature to update rspo based on id');
      }
    },

    _removeFeatureSelection: function () {
      var featureIdsToRemove = this.props.selectedFeatures.map(this._featuresIdMapper),
          idsToRemoveFilter = function (feature) {return featureIdsToRemove.indexOf(feature.attributes.WRI_ID) < 0;},
          features = _.filter(WizardStore.get(KEYS.customFeatures), idsToRemoveFilter),
          selectedFeatures = _.filter(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          removedFeatures = _.reject(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          wizardGraphicsLayer;

      WizardStore.set(KEYS.removedCustomFeatures, removedFeatures);
      WizardStore.set(KEYS.customFeatures, features);
      WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);

      // Clear The Wizard Graphics Layer so no selected features are showing
      wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
      if (wizardGraphicsLayer) { wizardGraphicsLayer.clear(); }
    },

    _renameFeature: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute('data-feature-id')),
          features = WizardStore.get(KEYS.customFeatures),
          updatedFeature = features.filter(function (feature) {return feature.attributes.WRI_ID === id});

      if (!updatedFeature) {
        throw new Error('Undefined: Could not identify feature to rename.')
      }

      features.some(function (feature, index) {
        var isUpdatedFeature = feature.attributes.WRI_ID === id;
        if (isUpdatedFeature) {
          features[index].attributes[FeatureListConfig.stepTwo.labelField] = evt.target.value;
        }
        return isUpdatedFeature;
      })

      WizardStore.set(KEYS.customFeatures, features);
      if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
        WizardStore.set(KEYS.selectedCustomFeatures, feature);
      }
    },

    _featuresIdMapper: function(feature) {
      return feature.attributes.WRI_ID;
    }

  })
})

;
// Knockout JavaScript library v3.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {(function(p){var A=this||(0,eval)("this"),w=A.document,K=A.navigator,t=A.jQuery,C=A.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports):"function"===typeof define&&define.amd?define('knockout',["exports"],p):p(A.ko={})})(function(z){function G(a,c){return null===a||typeof a in M?a===c:!1}function N(a,c){var d;return function(){d||(d=setTimeout(function(){d=p;a()},c))}}function O(a,c){var d;return function(){clearTimeout(d);d=setTimeout(a,
c)}}function H(b,c,d,e){a.d[b]={init:function(b,h,g,k,l){var n,r;a.ba(function(){var g=a.a.c(h()),k=!d!==!g,s=!r;if(s||c||k!==n)s&&a.ca.fa()&&(r=a.a.lb(a.e.childNodes(b),!0)),k?(s||a.e.U(b,a.a.lb(r)),a.gb(e?e(l,g):l,b)):a.e.da(b),n=k},null,{G:b});return{controlsDescendantBindings:!0}}};a.g.aa[b]=!1;a.e.Q[b]=!0}var a="undefined"!==typeof z?z:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.s=function(a,c,d){a[c]=d};a.version="3.1.0";a.b("version",
a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,f={},h={};f[K&&/Firefox\/2/i.test(K.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];f.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(f,function(a,b){if(b.length)for(var c=0,
d=b.length;c<d;c++)h[b[c]]=a});var g={propertychange:!0},k=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{mb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],r:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},l:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},hb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];return null},ma:function(b,c){var d=a.a.l(b,c);0<d?b.splice(d,1):0===d&&b.shift()},ib:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.l(c,b[d])&&c.push(b[d]);return c},ya:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},la:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},$:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Y:function(b,c,d){var e=a.a.l(a.a.Sa(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},na:e,extend:c,ra:d,sa:e?d:c,A:b,Oa:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Fa:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},ec:function(b){b=a.a.R(b);for(var c=w.createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.M(b[d]));return c},lb:function(b,c){for(var d=0,e=b.length,g=[];d<
e;d++){var k=b[d].cloneNode(!0);g.push(c?a.M(k):k)}return g},U:function(b,c){a.a.Fa(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},Bb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],g=e.parentNode,k=0,h=c.length;k<h;k++)g.insertBefore(c[k],e);k=0;for(h=d.length;k<h;k++)a.removeNode(d[k])}},ea:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)if(a.push(c),
c=c.nextSibling,!c)return;a.push(d)}}return a},Db:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},ta:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oc:function(b,c){for(var d=[],e=(b||"").split(c),g=0,k=e.length;g<k;g++){var h=a.a.ta(e[g]);""!==h&&d.push(h)}return d},kc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Sb:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===
a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ea:function(b){return a.a.Sb(b,b.ownerDocument.documentElement)},eb:function(b){return!!a.a.hb(b,a.a.Ea)},B:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},q:function(b,c,d){var e=k&&g[c];if(!e&&t)t(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var h=function(a){d.call(b,a)},f="on"+c;b.attachEvent(f,
h);a.a.u.ja(b,function(){b.detachEvent(f,h)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,d,!1)},ha:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.B(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(t&&!d)t(b).trigger(c);else if("function"==typeof w.createEvent)if("function"==typeof b.dispatchEvent)d=w.createEvent(h[c]||"HTMLEvents"),
d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.v(b)?b():b},Sa:function(b){return a.v(b)?b.o():b},ua:function(b,c,d){if(c){var e=/\S+/g,g=b.className.match(e)||[];a.a.r(c.match(e),function(b){a.a.Y(g,b,d)});b.className=g.join(" ")}},Xa:function(b,
c){var d=a.a.c(c);if(null===d||d===p)d="";var e=a.e.firstChild(b);!e||3!=e.nodeType||a.e.nextSibling(e)?a.e.U(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Vb(b)},Cb:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(w.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},Vb:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Tb:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},ic:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=
[],e=b;e<=c;e++)d.push(e);return d},R:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},mc:6===k,nc:7===k,oa:k,ob:function(b,c){for(var d=a.a.R(b.getElementsByTagName("input")).concat(a.a.R(b.getElementsByTagName("textarea"))),e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},g=[],k=d.length-1;0<=k;k--)e(d[k])&&g.push(d[k]);return g},fc:function(b){return"string"==typeof b&&(b=a.a.ta(b))?C&&C.parse?C.parse(b):(new Function("return "+b))():
null},Ya:function(b,c,d){if(!C||!C.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");return C.stringify(a.a.c(b),c,d)},gc:function(c,d,e){e=e||{};var g=e.params||{},k=e.includeFields||this.mb,h=c;if("object"==typeof c&&"form"===a.a.B(c))for(var h=c.action,f=k.length-1;0<=f;f--)for(var u=a.a.ob(c,k[f]),D=u.length-1;0<=D;D--)g[u[D].name]=
u[D].value;d=a.a.c(d);var y=w.createElement("form");y.style.display="none";y.action=h;y.method="post";for(var p in d)c=w.createElement("input"),c.name=p,c.value=a.a.Ya(a.a.c(d[p])),y.appendChild(c);b(g,function(a,b){var c=w.createElement("input");c.name=a;c.value=b;y.appendChild(c)});w.body.appendChild(y);e.submitter?e.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.r);a.b("utils.arrayFirst",a.a.hb);a.b("utils.arrayFilter",
a.a.la);a.b("utils.arrayGetDistinctValues",a.a.ib);a.b("utils.arrayIndexOf",a.a.l);a.b("utils.arrayMap",a.a.ya);a.b("utils.arrayPushAll",a.a.$);a.b("utils.arrayRemoveItem",a.a.ma);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.mb);a.b("utils.getFormFields",a.a.ob);a.b("utils.peekObservable",a.a.Sa);a.b("utils.postJson",a.a.gc);a.b("utils.parseJson",a.a.fc);a.b("utils.registerEventHandler",a.a.q);a.b("utils.stringifyJson",a.a.Ya);a.b("utils.range",a.a.ic);a.b("utils.toggleDomNodeCssClass",
a.a.ua);a.b("utils.triggerEvent",a.a.ha);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.A);a.b("utils.addOrRemoveItem",a.a.Y);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this,d=Array.prototype.slice.call(arguments);a=d.shift();return function(){return c.apply(a,d.concat(Array.prototype.slice.call(arguments)))}});a.a.f=new function(){function a(b,h){var g=b[d];if(!g||"null"===g||!e[g]){if(!h)return p;g=b[d]="ko"+c++;e[g]={}}return e[g]}
var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},L:function(){return c++ +d}}};a.b("utils.domData",a.a.f);a.b("utils.domData.clear",a.a.f.clear);a.a.u=new function(){function b(b,c){var e=a.a.f.get(b,d);e===p&&c&&(e=[],a.a.f.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](d);
a.a.f.clear(d);a.a.u.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.f.L(),e={1:!0,8:!0,9:!0},f={1:!0,9:!0};return{ja:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},Ab:function(c,e){var k=b(c,!1);k&&(a.a.ma(k,e),0==k.length&&a.a.f.set(c,d,p))},M:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.$(d,b.getElementsByTagName("*"));for(var k=0,l=d.length;k<l;k++)c(d[k])}return b},
removeNode:function(b){a.M(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){t&&"function"==typeof t.cleanData&&t.cleanData([a])}}};a.M=a.a.u.M;a.removeNode=a.a.u.removeNode;a.b("cleanNode",a.M);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.u);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.u.ja);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.u.Ab);(function(){a.a.Qa=function(b){var c;if(t)if(t.parseHTML)c=t.parseHTML(b)||[];else{if((c=t.clean([b]))&&
c[0]){for(b=c[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var d=a.a.ta(b).toLowerCase();c=w.createElement("div");d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+d[1]+b+d[2]+"</div>";for("function"==typeof A.innerShiv?c.appendChild(A.innerShiv(b)):
c.innerHTML=b;d[0]--;)c=c.lastChild;c=a.a.R(c.lastChild.childNodes)}return c};a.a.Va=function(b,c){a.a.Fa(b);c=a.a.c(c);if(null!==c&&c!==p)if("string"!=typeof c&&(c=c.toString()),t)t(b).html(c);else for(var d=a.a.Qa(c),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.Qa);a.b("utils.setHtml",a.a.Va);a.w=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.w.xb(c.nodeValue);null!=f&&e.push({Rb:c,cc:f})}else if(1==c.nodeType)for(var f=0,h=c.childNodes,g=h.length;f<g;f++)b(h[f],
e)}var c={};return{Na:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},Hb:function(a,b){var f=c[a];if(f===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a]}},Ib:function(c,e){var f=
[];b(c,f);for(var h=0,g=f.length;h<g;h++){var k=f[h].Rb,l=[k];e&&a.a.$(l,e);a.w.Hb(f[h].cc,l);k.nodeValue="";k.parentNode&&k.parentNode.removeChild(k)}},xb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.w);a.b("memoization.memoize",a.w.Na);a.b("memoization.unmemoize",a.w.Hb);a.b("memoization.parseMemoText",a.w.xb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.w.Ib);a.Ga={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.h({read:b,write:function(a){clearTimeout(d);
d=setTimeout(function(){b(a)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);f="notifyWhenChangesStop"==e?O:N;a.Ma(function(a){return f(a,d)})},notify:function(a,c){a.equalityComparer="always"==c?null:G}};var M={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ga);a.Fb=function(b,c,d){this.target=b;this.za=c;this.Qb=d;this.sb=!1;a.s(this,"dispose",this.F)};a.Fb.prototype.F=function(){this.sb=!0;this.Qb()};a.N=function(){a.a.sa(this,a.N.fn);this.H=
{}};var F="change";z={V:function(b,c,d){var e=this;d=d||F;var f=new a.Fb(e,c?b.bind(c):b,function(){a.a.ma(e.H[d],f)});e.o&&e.o();e.H[d]||(e.H[d]=[]);e.H[d].push(f);return f},notifySubscribers:function(b,c){c=c||F;if(this.qb(c))try{a.k.jb();for(var d=this.H[c].slice(0),e=0,f;f=d[e];++e)f.sb||f.za(b)}finally{a.k.end()}},Ma:function(b){var c=this,d=a.v(c),e,f,h;c.ia||(c.ia=c.notifySubscribers,c.notifySubscribers=function(a,b){b&&b!==F?"beforeChange"===b?c.bb(a):c.ia(a,b):c.cb(a)});var g=b(function(){d&&
h===c&&(h=c());e=!1;c.Ka(f,h)&&c.ia(f=h)});c.cb=function(a){e=!0;h=a;g()};c.bb=function(a){e||(f=a,c.ia(a,"beforeChange"))}},qb:function(a){return this.H[a]&&this.H[a].length},Wb:function(){var b=0;a.a.A(this.H,function(a,d){b+=d.length});return b},Ka:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.A(b,function(b,e){var f=a.Ga[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.s(z,"subscribe",z.V);a.s(z,"extend",z.extend);a.s(z,"getSubscriptionsCount",
z.Wb);a.a.na&&a.a.ra(z,Function.prototype);a.N.fn=z;a.tb=function(a){return null!=a&&"function"==typeof a.V&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.N);a.b("isSubscribable",a.tb);a.ca=a.k=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{jb:b,end:c,zb:function(b){if(e){if(!a.tb(b))throw Error("Only subscribable things can act as dependencies");e.za(b,b.Kb||(b.Kb=++f))}},t:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},fa:function(){if(e)return e.ba.fa()},
pa:function(){if(e)return e.pa}}}();a.b("computedContext",a.ca);a.b("computedContext.getDependenciesCount",a.ca.fa);a.b("computedContext.isInitial",a.ca.pa);a.m=function(b){function c(){if(0<arguments.length)return c.Ka(d,arguments[0])&&(c.P(),d=arguments[0],c.O()),this;a.k.zb(c);return d}var d=b;a.N.call(c);a.a.sa(c,a.m.fn);c.o=function(){return d};c.O=function(){c.notifySubscribers(d)};c.P=function(){c.notifySubscribers(d,"beforeChange")};a.s(c,"peek",c.o);a.s(c,"valueHasMutated",c.O);a.s(c,"valueWillMutate",
c.P);return c};a.m.fn={equalityComparer:G};var E=a.m.hc="__ko_proto__";a.m.fn[E]=a.m;a.a.na&&a.a.ra(a.m.fn,a.N.fn);a.Ha=function(b,c){return null===b||b===p||b[E]===p?!1:b[E]===c?!0:a.Ha(b[E],c)};a.v=function(b){return a.Ha(b,a.m)};a.ub=function(b){return"function"==typeof b&&b[E]===a.m||"function"==typeof b&&b[E]===a.h&&b.Yb?!0:!1};a.b("observable",a.m);a.b("isObservable",a.v);a.b("isWriteableObservable",a.ub);a.T=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
b=a.m(b);a.a.sa(b,a.T.fn);return b.extend({trackArrayChanges:!0})};a.T.fn={remove:function(b){for(var c=this.o(),d=[],e="function"!=typeof b||a.v(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var h=c[f];e(h)&&(0===d.length&&this.P(),d.push(h),c.splice(f,1),f--)}d.length&&this.O();return d},removeAll:function(b){if(b===p){var c=this.o(),d=c.slice(0);this.P();c.splice(0,c.length);this.O();return d}return b?this.remove(function(c){return 0<=a.a.l(b,c)}):[]},destroy:function(b){var c=this.o(),d=
"function"!=typeof b||a.v(b)?function(a){return a===b}:b;this.P();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.O()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.l(b,c)}):[]},indexOf:function(b){var c=this();return a.a.l(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.P(),this.o()[d]=c,this.O())}};a.a.r("pop push reverse shift sort splice unshift".split(" "),function(b){a.T.fn[b]=function(){var a=this.o();
this.P();this.kb(a,b,arguments);a=a[b].apply(a,arguments);this.O();return a}});a.a.r(["slice"],function(b){a.T.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.na&&a.a.ra(a.T.fn,a.m.fn);a.b("observableArray",a.T);var I="arrayChange";a.Ga.trackArrayChanges=function(b){function c(){if(!d){d=!0;var c=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==F||++f;return c.apply(this,arguments)};var k=[].concat(b.o()||[]);e=null;b.V(function(c){c=[].concat(c||[]);if(b.qb(I)){var d;
if(!e||1<f)e=a.a.Aa(k,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,I)}k=c;e=null;f=0})}}if(!b.kb){var d=!1,e=null,f=0,h=b.V;b.V=b.subscribe=function(a,b,d){d===I&&c();return h.apply(this,arguments)};b.kb=function(b,c,l){function h(a,b,c){return r[r.length]={status:a,value:b,index:c}}if(d&&!f){var r=[],m=b.length,q=l.length,s=0;switch(c){case "push":s=m;case "unshift":for(c=0;c<q;c++)h("added",l[c],s+c);break;case "pop":s=m-1;case "shift":m&&h("deleted",b[s],s);break;case "splice":c=Math.min(Math.max(0,
0>l[0]?m+l[0]:l[0]),m);for(var m=1===q?m:Math.min(c+(l[1]||0),m),q=c+q-2,s=Math.max(m,q),B=[],u=[],D=2;c<s;++c,++D)c<m&&u.push(h("deleted",b[c],c)),c<q&&B.push(h("added",l[D],c));a.a.nb(u,B);break;default:return}e=r}}}};a.ba=a.h=function(b,c,d){function e(){q=!0;a.a.A(v,function(a,b){b.F()});v={};x=0;n=!1}function f(){var a=g.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(h,a)):g.wa?g.wa():h()}function h(){if(!r&&!q){if(y&&y()){if(!m){p();return}}else m=!1;r=!0;try{var b=v,d=x;a.k.jb({za:function(a,
c){q||(d&&b[c]?(v[c]=b[c],++x,delete b[c],--d):v[c]||(v[c]=a.V(f),++x))},ba:g,pa:!x});v={};x=0;try{var e=c?s.call(c):s()}finally{a.k.end(),d&&a.a.A(b,function(a,b){b.F()}),n=!1}g.Ka(l,e)&&(g.notifySubscribers(l,"beforeChange"),l=e,g.wa&&!g.throttleEvaluation||g.notifySubscribers(l))}finally{r=!1}x||p()}}function g(){if(0<arguments.length){if("function"===typeof B)B.apply(c,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
return this}n&&h();a.k.zb(g);return l}function k(){return n||0<x}var l,n=!0,r=!1,m=!1,q=!1,s=b;s&&"object"==typeof s?(d=s,s=d.read):(d=d||{},s||(s=d.read));if("function"!=typeof s)throw Error("Pass a function that returns the value of the ko.computed");var B=d.write,u=d.disposeWhenNodeIsRemoved||d.G||null,D=d.disposeWhen||d.Da,y=D,p=e,v={},x=0,t=null;c||(c=d.owner);a.N.call(g);a.a.sa(g,a.h.fn);g.o=function(){n&&!x&&h();return l};g.fa=function(){return x};g.Yb="function"===typeof d.write;g.F=function(){p()};
g.ga=k;var w=g.Ma;g.Ma=function(a){w.call(g,a);g.wa=function(){g.bb(l);n=!0;g.cb(g)}};a.s(g,"peek",g.o);a.s(g,"dispose",g.F);a.s(g,"isActive",g.ga);a.s(g,"getDependenciesCount",g.fa);u&&(m=!0,u.nodeType&&(y=function(){return!a.a.Ea(u)||D&&D()}));!0!==d.deferEvaluation&&h();u&&k()&&u.nodeType&&(p=function(){a.a.u.Ab(u,p);e()},a.a.u.ja(u,p));return g};a.$b=function(b){return a.Ha(b,a.h)};z=a.m.hc;a.h[z]=a.m;a.h.fn={equalityComparer:G};a.h.fn[z]=a.h;a.a.na&&a.a.ra(a.h.fn,a.N.fn);a.b("dependentObservable",
a.h);a.b("computed",a.h);a.b("isComputed",a.$b);(function(){function b(a,f,h){h=h||new d;a=f(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var g=a instanceof Array?[]:{};h.save(a,g);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[c]=d;break;case "object":case "undefined":var n=h.get(d);g[c]=n!==p?n:b(d,f,h)}});return g}function c(a,b){if(a instanceof Array){for(var c=
0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.ab=[]}a.Gb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.v(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Gb(b);return a.a.Ya(b,c,d)};d.prototype={save:function(b,c){var d=a.a.l(this.keys,b);0<=d?this.ab[d]=c:(this.keys.push(b),this.ab.push(c))},get:function(b){b=a.a.l(this.keys,
b);return 0<=b?this.ab[b]:p}}})();a.b("toJS",a.Gb);a.b("toJSON",a.toJSON);(function(){a.i={p:function(b){switch(a.a.B(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.f.get(b,a.d.options.Pa):7>=a.a.oa?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex]):p;default:return b.value}},X:function(b,c,d){switch(a.a.B(b)){case "option":switch(typeof c){case "string":a.a.f.set(b,a.d.options.Pa,
p);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.f.set(b,a.d.options.Pa,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=p;for(var e=-1,f=0,h=b.options.length,g;f<h;++f)if(g=a.i.p(b.options[f]),g==c||""==g&&c===p){e=f;break}if(d||0<=e||c===p&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===p)c="";b.value=c}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",
a.i.p);a.b("selectExtensions.writeValue",a.i.X);a.g=function(){function b(b){b=a.a.ta(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),g,m,q=0;if(d){d.push(",");for(var s=0,B;B=d[s];++s){var u=B.charCodeAt(0);if(44===u){if(0>=q){g&&c.push(m?{key:g,value:m.join("")}:{unknown:g});g=m=q=0;continue}}else if(58===u){if(!m)continue}else if(47===u&&s&&1<B.length)(u=d[s-1].match(f))&&!h[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),d.push(","),s=-1,B="/");else if(40===u||123===u||91===
u)++q;else if(41===u||125===u||93===u)--q;else if(!g&&!m){g=34===u||39===u?B.slice(1,-1):B;continue}m?m.push(B):m=[B]}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},g={};return{aa:[],W:g,Ra:b,qa:function(e,l){function f(b,e){var l,k=a.getBindingHandler(b);
if(k&&k.preprocess?e=k.preprocess(e,b,f):1){if(k=g[b])l=e,0<=a.a.l(c,l)?l=!1:(k=l.match(d),l=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:l),k=l;k&&m.push("'"+b+"':function(_z){"+l+"=_z}");q&&(e="function(){return "+e+" }");h.push("'"+b+"':"+e)}}l=l||{};var h=[],m=[],q=l.valueAccessors,s="string"===typeof e?b(e):e;a.a.r(s,function(a){f(a.key||a.unknown,a.value)});m.length&&f("_ko_property_writers","{"+m.join(",")+" }");return h.join(",")},bc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;
return!1},va:function(b,c,d,e,g){if(b&&a.v(b))!a.ub(b)||g&&b.o()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.g);a.b("expressionRewriting.bindingRewriteValidators",a.g.aa);a.b("expressionRewriting.parseObjectLiteral",a.g.Ra);a.b("expressionRewriting.preProcessBindings",a.g.qa);a.b("expressionRewriting._twoWayBindings",a.g.W);a.b("jsonExpressionRewriting",a.g);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.g.qa);(function(){function b(a){return 8==
a.nodeType&&h.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,g=1,k=[];e=e.nextSibling;){if(c(e)&&(g--,0===g))return k;k.push(e);b(e)&&g++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,h=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
g=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,k={ul:!0,ol:!0};a.e={Q:{},childNodes:function(a){return b(a)?d(a):a.childNodes},da:function(c){if(b(c)){c=a.e.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.Fa(c)},U:function(c,d){if(b(c)){a.e.da(c);for(var e=c.nextSibling,g=0,k=d.length;g<k;g++)e.parentNode.insertBefore(d[g],e)}else a.a.U(c,d)},yb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},rb:function(c,
d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.e.yb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Xb:b,lc:function(a){return(a=(f?a.text:a.nodeValue).match(h))?a[1]:null},wb:function(d){if(k[a.a.B(d)]){var g=d.firstChild;if(g){do if(1===g.nodeType){var f;f=g.firstChild;
var h=null;if(f){do if(h)h.push(f);else if(b(f)){var q=e(f,!0);q?f=q:h=[f]}else c(f)&&(h=[f]);while(f=f.nextSibling)}if(f=h)for(h=g.nextSibling,q=0;q<f.length;q++)h?d.insertBefore(f[q],h):d.appendChild(f[q])}while(g=g.nextSibling)}}}}})();a.b("virtualElements",a.e);a.b("virtualElements.allowedBindings",a.e.Q);a.b("virtualElements.emptyNode",a.e.da);a.b("virtualElements.insertAfter",a.e.rb);a.b("virtualElements.prepend",a.e.yb);a.b("virtualElements.setDomNodeChildren",a.e.U);(function(){a.J=function(){this.Nb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind");case 8:return a.e.Xb(b);default:return!1}},getBindings:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a):null},getBindingAccessors:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a,{valueAccessors:!0}):null},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.e.lc(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Nb,h=b+(e&&e.valueAccessors||""),g;if(!(g=f[h])){var k,l="with($context){with($data||{}){return{"+a.g.qa(b,e)+"}}}";k=new Function("$context","$element",l);g=f[h]=k}return g(c,d)}catch(n){throw n.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+n.message,n;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function c(a){return a()}
function d(b){return a.a.Oa(a.k.t(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return d(this.getBindings.bind(this,a,b))}function f(b,c,d){var e,g=a.e.firstChild(c),k=a.J.instance,f=k.preprocessNode;if(f){for(;e=g;)g=a.e.nextSibling(e),f.call(k,e);g=a.e.firstChild(c)}for(;e=g;)g=a.e.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,g=1===c.nodeType;g&&a.e.wb(c);if(g&&d||a.J.instance.nodeHasBindings(c))e=k(c,null,b,d).shouldBindDescendants;e&&!n[a.a.B(c)]&&f(b,c,!g)}function g(b){var c=
[],d={},e=[];a.a.A(b,function y(g){if(!d[g]){var k=a.getBindingHandler(g);k&&(k.after&&(e.push(g),a.a.r(k.after,function(c){if(b[c]){if(-1!==a.a.l(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));y(c)}}),e.length--),c.push({key:g,pb:k}));d[g]=!0}});return c}function k(b,d,k,f){var h=a.a.f.get(b,r);if(!d){if(h)throw Error("You cannot apply bindings multiple times to the same element.");a.a.f.set(b,r,!0)}!h&&f&&a.Eb(b,k);var l;if(d&&"function"!==
typeof d)l=d;else{var n=a.J.instance,m=n.getBindingAccessors||e,x=a.h(function(){(l=d?d(k,b):m.call(n,b,k))&&k.D&&k.D();return l},null,{G:b});l&&x.ga()||(x=null)}var t;if(l){var w=x?function(a){return function(){return c(x()[a])}}:function(a){return l[a]},z=function(){return a.a.Oa(x?x():l,c)};z.get=function(a){return l[a]&&c(w(a))};z.has=function(a){return a in l};f=g(l);a.a.r(f,function(c){var d=c.pb.init,e=c.pb.update,g=c.key;if(8===b.nodeType&&!a.e.Q[g])throw Error("The binding '"+g+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.t(function(){var a=d(b,w(g),z,k.$data,k);if(a&&a.controlsDescendantBindings){if(t!==p)throw Error("Multiple bindings ("+t+" and "+g+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");t=g}}),"function"==typeof e&&a.h(function(){e(b,w(g),z,k.$data,k)},null,{G:b})}catch(f){throw f.message='Unable to process binding "'+g+": "+l[g]+'"\nMessage: '+f.message,f;}})}return{shouldBindDescendants:t===p}}
function l(b){return b&&b instanceof a.I?b:new a.I(b)}a.d={};var n={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.I=function(b,c,d,e){var g=this,k="function"==typeof b&&!a.v(b),f,h=a.h(function(){var f=k?b():b,l=a.a.c(f);c?(c.D&&c.D(),a.a.extend(g,c),h&&(g.D=h)):(g.$parents=[],g.$root=l,g.ko=a);g.$rawData=f;g.$data=l;d&&(g[d]=l);e&&e(g,c,l);return g.$data},null,{Da:function(){return f&&!a.a.eb(f)},G:!0});h.ga()&&(g.D=h,h.equalityComparer=null,f=[],h.Jb=function(b){f.push(b);a.a.u.ja(b,
function(b){a.a.ma(f,b);f.length||(h.F(),g.D=h=p)})})};a.I.prototype.createChildContext=function(b,c,d){return new a.I(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.I.prototype.extend=function(b){return new a.I(this.D||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var r=a.a.f.L(),m=a.a.f.L();a.Eb=function(b,c){if(2==arguments.length)a.a.f.set(b,m,c),
c.D&&c.D.Jb(b);else return a.a.f.get(b,m)};a.xa=function(b,c,d){1===b.nodeType&&a.e.wb(b);return k(b,c,l(d),!0)};a.Lb=function(c,e,g){g=l(g);return a.xa(c,"function"===typeof e?d(e.bind(null,g,c)):a.a.Oa(e,b),g)};a.gb=function(a,b){1!==b.nodeType&&8!==b.nodeType||f(l(a),b,!0)};a.fb=function(a,b){!t&&A.jQuery&&(t=A.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||A.document.body;h(l(a),
b,!0)};a.Ca=function(b){switch(b.nodeType){case 1:case 8:var c=a.Eb(b);if(c)return c;if(b.parentNode)return a.Ca(b.parentNode)}return p};a.Pb=function(b){return(b=a.Ca(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.fb);a.b("applyBindingsToDescendants",a.gb);a.b("applyBindingAccessorsToNode",a.xa);a.b("applyBindingsToNode",a.Lb);a.b("contextFor",a.Ca);a.b("dataFor",a.Pb)})();var L={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.A(d,function(c,
d){d=a.a.c(d);var h=!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.oa&&c in L?(c=L[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Cb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):b.value}function f(){var g=b.checked,f=r?e():g;if(!a.ca.pa()&&(!k||g)){var h=a.k.t(c);l?n!==f?(g&&(a.a.Y(h,f,!0),a.a.Y(h,n,!1)),n=f):a.a.Y(h,f,g):a.g.va(h,d,"checked",
f,!0)}}function h(){var d=a.a.c(c());b.checked=l?0<=a.a.l(d,e()):g?d:e()===d}var g="checkbox"==b.type,k="radio"==b.type;if(g||k){var l=g&&a.a.c(c())instanceof Array,n=l?e():p,r=k||l;k&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.ba(f,null,{G:b});a.a.q(b,"click",f);a.ba(h,null,{G:b})}}};a.g.W.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());"object"==typeof d?a.a.A(d,function(c,d){d=a.a.c(d);a.a.ua(b,c,d)}):(d=String(d||
""),a.a.ua(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.ua(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var h=c()||{};a.a.A(h,function(g){"string"==typeof g&&a.a.q(b,g,function(b){var h,n=c()[g];if(n){try{var r=a.a.R(arguments);e=f.$data;r.unshift(e);h=n.apply(e,r)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={vb:function(b){return function(){var c=b(),d=a.a.Sa(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.K.Ja};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.K.Ja}}},init:function(b,
c){return a.d.template.init(b,a.d.foreach.vb(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.vb(c),d,e,f)}};a.g.aa.foreach=!1;a.e.Q.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var k=b.ownerDocument;if("activeElement"in k){var f;try{f=k.activeElement}catch(h){f=k.body}e=f===b}k=c();a.g.va(k,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),h=e.bind(null,!1);a.a.q(b,"focus",f);a.a.q(b,"focusin",
f);a.a.q(b,"blur",h);a.a.q(b,"focusout",h)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),a.k.t(a.a.ha,null,[b,d?"focusin":"focusout"]))}};a.g.W.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.g.W.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Va(b,c())}};H("if");H("ifnot",!1,!0);H("with",!0,!1,function(a,c){return a.createChildContext(c)});var J={};a.d.options={init:function(b){if("select"!==
a.a.B(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.la(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(r.length){var e=0<=a.a.l(r,a.i.p(d[0]));a.a.Db(d[0],e);m&&!e&&a.k.t(a.a.ha,null,[b,"change"])}}var g=0!=b.length&&b.multiple?b.scrollTop:null,k=a.a.c(c()),l=d.get("optionsIncludeDestroyed");
c={};var n,r;r=b.multiple?a.a.ya(e(),a.i.p):0<=b.selectedIndex?[a.i.p(b.options[b.selectedIndex])]:[];k&&("undefined"==typeof k.length&&(k=[k]),n=a.a.la(k,function(b){return l||b===p||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(k=a.a.c(d.get("optionsCaption")),null!==k&&k!==p&&n.unshift(J)));var m=!1;c.beforeRemove=function(a){b.removeChild(a)};k=h;d.has("optionsAfterRender")&&(k=function(b,c){h(0,c);a.k.t(d.get("optionsAfterRender"),null,[c[0],b!==J?b:p])});a.a.Ua(b,n,function(c,e,g){g.length&&
(r=g[0].selected?[a.i.p(g[0])]:[],m=!0);e=b.ownerDocument.createElement("option");c===J?(a.a.Xa(e,d.get("optionsCaption")),a.i.X(e,p)):(g=f(c,d.get("optionsValue"),c),a.i.X(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Xa(e,c));return[e]},c,k);a.k.t(function(){d.get("valueAllowUnset")&&d.has("value")?a.i.X(b,a.a.c(d.get("value")),!0):(b.multiple?r.length&&e().length<r.length:r.length&&0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex])!==r[0]:r.length||0<=b.selectedIndex)&&a.a.ha(b,"change")});a.a.Tb(b);
g&&20<Math.abs(g-b.scrollTop)&&(b.scrollTop=g)}};a.d.options.Pa=a.a.f.L();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.q(b,"change",function(){var e=c(),f=[];a.a.r(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.i.p(b))});a.g.va(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.B(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c());d&&"number"==typeof d.length&&a.a.r(b.getElementsByTagName("option"),function(b){var c=
0<=a.a.l(d,a.i.p(b));a.a.Db(b,c)})}};a.g.W.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.A(d,function(c,d){d=a.a.c(d);b.style[c]=d||""})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.q(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,c){a.a.Xa(b,c())}};a.e.Q.text=!0;a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Ob;a.a.Cb(b,d)}}};a.d.uniqueName.Ob=0;a.d.value={after:["options","foreach"],init:function(b,c,d){function e(){g=!1;var e=c(),f=a.i.p(b);a.g.va(e,d,"value",f)}var f=["change"],h=d.get("valueUpdate"),g=!1;h&&("string"==typeof h&&(h=[h]),a.a.$(f,h),f=a.a.ib(f));!a.a.oa||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||
-1!=a.a.l(f,"propertychange")||(a.a.q(b,"propertychange",function(){g=!0}),a.a.q(b,"focus",function(){g=!1}),a.a.q(b,"blur",function(){g&&e()}));a.a.r(f,function(c){var d=e;a.a.kc(c,"after")&&(d=function(){setTimeout(e,0)},c=c.substring(5));a.a.q(b,c,d)})},update:function(b,c,d){var e=a.a.c(c());c=a.i.p(b);if(e!==c)if("select"===a.a.B(b)){var f=d.get("valueAllowUnset");d=function(){a.i.X(b,e,f)};d();f||e===a.i.p(b)?setTimeout(d,0):a.k.t(a.a.ha,null,[b,"change"])}else a.i.X(b,e)}};a.g.W.value=!0;a.d.visible=
{update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,h){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,h)}}})("click");a.C=function(){};a.C.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.C.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.C.prototype.makeTemplateSource=
function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.n.j(d)}if(1==b.nodeType||8==b.nodeType)return new a.n.Z(b);throw Error("Unknown template type: "+b);};a.C.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d)};a.C.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.C.prototype.rewriteTemplate=
function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.C);a.Za=function(){function b(b,c,d,g){b=a.g.Ra(b);for(var k=a.g.aa,l=0;l<b.length;l++){var n=b[l].key;if(k.hasOwnProperty(n)){var r=k[n];if("function"===typeof r){if(n=r(b[l].value))throw Error(n);}else if(!r)throw Error("This template engine does not support the '"+n+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.g.qa(b,
{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return g.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Ub:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Za.dc(b,c)},d)},dc:function(a,f){return a.replace(c,function(a,c,d,e,n){return b(n,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e",
"#comment",f)})},Mb:function(b,c){return a.w.Na(function(d,g){var k=d.nextSibling;k&&k.nodeName.toLowerCase()===c&&a.xa(k,b,g)})}}}();a.b("__tr_ambtns",a.Za.Mb);(function(){a.n={};a.n.j=function(a){this.j=a};a.n.j.prototype.text=function(){var b=a.a.B(this.j),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.j[b];var c=arguments[0];"innerHTML"===b?a.a.Va(this.j,c):this.j[b]=c};var b=a.a.f.L()+"_";a.n.j.prototype.data=function(c){if(1===arguments.length)return a.a.f.get(this.j,
b+c);a.a.f.set(this.j,b+c,arguments[1])};var c=a.a.f.L();a.n.Z=function(a){this.j=a};a.n.Z.prototype=new a.n.j;a.n.Z.prototype.text=function(){if(0==arguments.length){var b=a.a.f.get(this.j,c)||{};b.$a===p&&b.Ba&&(b.$a=b.Ba.innerHTML);return b.$a}a.a.f.set(this.j,c,{$a:arguments[0]})};a.n.j.prototype.nodes=function(){if(0==arguments.length)return(a.a.f.get(this.j,c)||{}).Ba;a.a.f.set(this.j,c,{Ba:arguments[0]})};a.b("templateSources",a.n);a.b("templateSources.domElement",a.n.j);a.b("templateSources.anonymousTemplate",
a.n.Z)})();(function(){function b(b,c,d){var e;for(c=a.e.nextSibling(c);b&&(e=b)!==c;)b=a.e.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],h=e.parentNode,m=a.J.instance,q=m.preprocessNode;if(q){b(e,f,function(a,b){var c=a.previousSibling,d=q.call(m,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.ea(c,h))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.fb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==
b.nodeType||a.w.Ib(b,[d])});a.a.ea(c,h)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,n,r){r=r||{};var m=b&&d(b),m=m&&m.ownerDocument,q=r.templateEngine||f;a.Za.Ub(h,q,m);h=q.renderTemplate(h,n,r,m);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");m=!1;switch(e){case "replaceChildren":a.e.U(b,h);m=!0;break;case "replaceNode":a.a.Bb(b,h);m=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}m&&(c(h,n),r.afterRender&&a.k.t(r.afterRender,null,[h,n.$data]));return h}var f;a.Wa=function(b){if(b!=p&&!(b instanceof a.C))throw Error("templateEngine must inherit from ko.templateEngine");f=b};a.Ta=function(b,c,h,n,r){h=h||{};if((h.templateEngine||f)==p)throw Error("Set a template engine before calling renderTemplate");r=r||"replaceChildren";if(n){var m=d(n);return a.h(function(){var f=c&&c instanceof a.I?c:new a.I(a.a.c(c)),p=a.v(b)?b():"function"==typeof b?b(f.$data,f):b,f=e(n,r,p,f,h);
"replaceNode"==r&&(n=f,m=d(n))},null,{Da:function(){return!m||!a.a.Ea(m)},G:m&&"replaceNode"==r?m.parentNode:m})}return a.w.Na(function(d){a.Ta(b,c,h,d,"replaceNode")})};a.jc=function(b,d,f,h,r){function m(a,b){c(b,s);f.afterRender&&f.afterRender(b,a)}function q(a,c){s=r.createChildContext(a,f.as,function(a){a.$index=c});var d="function"==typeof b?b(a,s):b;return e(null,"ignoreTargetNode",d,s,f)}var s;return a.h(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.la(b,function(b){return f.includeDestroyed||
b===p||null===b||!a.a.c(b._destroy)});a.k.t(a.a.Ua,null,[h,b,q,f,m])},null,{G:h})};var h=a.a.f.L();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.e.da(b):(d=a.e.childNodes(b),d=a.a.ec(d),(new a.n.Z(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var m=c(),q;c=a.a.c(m);d=!0;e=null;"string"==typeof c?c={}:(m=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),q=a.a.c(c.data));"foreach"in c?e=a.jc(m||b,d&&c.foreach||
[],c,b,f):d?(f="data"in c?f.createChildContext(q,c.as):f,e=a.Ta(m||b,f,c,b)):a.e.da(b);f=e;(q=a.a.f.get(b,h))&&"function"==typeof q.F&&q.F();a.a.f.set(b,h,f&&f.ga()?f:p)}};a.g.aa.template=function(b){b=a.g.Ra(b);return 1==b.length&&b[0].unknown||a.g.bc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.e.Q.template=!0})();a.b("setTemplateEngine",a.Wa);a.b("renderTemplate",a.Ta);a.a.nb=function(a,c,d){if(a.length&&c.length){var e,f,h,g,k;for(e=
f=0;(!d||e<d)&&(g=a[f]);++f){for(h=0;k=c[h];++h)if(g.value===k.value){g.moved=k.index;k.moved=g.index;c.splice(h,1);e=h=0;break}e+=h}}};a.a.Aa=function(){function b(b,d,e,f,h){var g=Math.min,k=Math.max,l=[],n,p=b.length,m,q=d.length,s=q-p||1,t=p+q+1,u,w,y;for(n=0;n<=p;n++)for(w=u,l.push(u=[]),y=g(q,n+s),m=k(0,n-1);m<=y;m++)u[m]=m?n?b[n-1]===d[m-1]?w[m-1]:g(w[m]||t,u[m-1]||t)+1:m+1:n+1;g=[];k=[];s=[];n=p;for(m=q;n||m;)q=l[n][m]-1,m&&q===l[n][m-1]?k.push(g[g.length]={status:e,value:d[--m],index:m}):
n&&q===l[n-1][m]?s.push(g[g.length]={status:f,value:b[--n],index:n}):(--m,--n,h.sparse||g.push({status:"retained",value:d[m]}));a.a.nb(k,s,10*p);return g.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<=d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Aa);(function(){function b(b,c,f,h,g){var k=[],l=a.h(function(){var l=c(f,g,a.a.ea(k,b))||[];0<k.length&&(a.a.Bb(k,l),h&&a.k.t(h,null,[f,
l,g]));k.length=0;a.a.$(k,l)},null,{G:b,Da:function(){return!a.a.eb(k)}});return{S:k,h:l.ga()?l:p}}var c=a.a.f.L();a.a.Ua=function(d,e,f,h,g){function k(b,c){v=r[c];u!==c&&(z[b]=v);v.Ia(u++);a.a.ea(v.S,d);s.push(v);y.push(v)}function l(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.r(c[d].S,function(a){b(a,d,c[d].ka)})}e=e||[];h=h||{};var n=a.a.f.get(d,c)===p,r=a.a.f.get(d,c)||[],m=a.a.ya(r,function(a){return a.ka}),q=a.a.Aa(m,e,h.dontLimitMoves),s=[],t=0,u=0,w=[],y=[];e=[];for(var z=[],m=[],
v,x=0,A,C;A=q[x];x++)switch(C=A.moved,A.status){case "deleted":C===p&&(v=r[t],v.h&&v.h.F(),w.push.apply(w,a.a.ea(v.S,d)),h.beforeRemove&&(e[x]=v,y.push(v)));t++;break;case "retained":k(x,t++);break;case "added":C!==p?k(x,C):(v={ka:A.value,Ia:a.m(u++)},s.push(v),y.push(v),n||(m[x]=v))}l(h.beforeMove,z);a.a.r(w,h.beforeRemove?a.M:a.removeNode);for(var x=0,n=a.e.firstChild(d),E;v=y[x];x++){v.S||a.a.extend(v,b(d,f,v.ka,g,v.Ia));for(t=0;q=v.S[t];n=q.nextSibling,E=q,t++)q!==n&&a.e.rb(d,q,E);!v.Zb&&g&&(g(v.ka,
v.S,v.Ia),v.Zb=!0)}l(h.beforeRemove,e);l(h.afterMove,z);l(h.afterAdd,m);a.a.f.set(d,c,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Ua);a.K=function(){this.allowTemplateRewriting=!1};a.K.prototype=new a.C;a.K.prototype.renderTemplateSource=function(b){var c=(9>a.a.oa?0:b.nodes)?b.nodes():null;if(c)return a.a.R(c.cloneNode(!0).childNodes);b=b.text();return a.a.Qa(b)};a.K.Ja=new a.K;a.Wa(a.K.Ja);a.b("nativeTemplateEngine",a.K);(function(){a.La=function(){var a=this.ac=function(){if(!t||
!t.tmpl)return 0;try{if(0<=t.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f){f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=t.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=t.extend({koBindingContext:e},f.templateOptions);e=t.tmpl(h,b,e);e.appendTo(w.createElement("div"));
t.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(t.tmpl.tag.ko_code={open:"__.push($1 || '');"},t.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.La.prototype=new a.C;var b=new a.La;0<b.ac&&a.Wa(b);a.b("jqueryTmplTemplateEngine",a.La)})()})})();})();

/* global define */
define('map/MapModel',[
  'dojo/_base/declare',
  'main/config',
  'map/config',
  'knockout'
],
function (declare, AppConfig, MapConfig, ko) {

  var Model = declare(null, {

    constructor: function (el) {
      Model.vm = {};
      Model.root = el;

      // Create Model Properties
      Model.vm.showDMSInputs = ko.observable(true);
      Model.vm.showLatLongInputs = ko.observable(false);
      Model.vm.showBasemapGallery = ko.observable(false);
      Model.vm.showLocatorOptions = ko.observable(false);
      Model.vm.showSharingOptions = ko.observable(false);
      Model.vm.showClearPinsOption = ko.observable(false);
      Model.vm.currentLatitude = ko.observable();
      Model.vm.currentLongitude = ko.observable();

      // Storage of Custom Suitability Settings
      Model.vm.suitabilitySettings = ko.observable(MapConfig.customSuitabilityDefaults);

      // Upload Dialog Items
      Model.vm.uploadModalHeader = ko.observable(MapConfig.uploadForm.title);
      Model.vm.shapefileUploadInstructionHeader = ko.observable(MapConfig.uploadForm.shapefileHeader);
      Model.vm.csvUploadInstructionHeader = ko.observable(MapConfig.uploadForm.csvHeader);
      Model.vm.shapefileInstructions = ko.observableArray(MapConfig.uploadForm.shapefileInstructions);
      Model.vm.csvInstructions = ko.observable(MapConfig.uploadForm.csvInstructions);

      // Coordinates Dialog Items
      Model.vm.coordinatesModalHeader = ko.observable(MapConfig.coordinatesDialog.coordinatesModalHeader);
      Model.vm.coordinatesEnterButton = ko.observable(MapConfig.coordinatesDialog.coordinatesEnterButton);
      Model.vm.latitudePlaceholder = ko.observable(MapConfig.coordinatesDialog.latitudePlaceholder);
      Model.vm.longitudePlaceholder = ko.observable(MapConfig.coordinatesDialog.longitudePlaceholder);

      // Tree Cover Density Items
      Model.vm.tcdModalLabel = ko.observable(MapConfig.tcdModal.label);
      Model.vm.tcdDensityValue = ko.observable(MapConfig.tcdModal.densityValue);

      // Storage of specific objects for Wizard
      // Admin Unit
      Model.vm.allCountries = ko.observableArray([]);
      Model.vm.lowerLevelAdminUnits = ko.observableArray([]);
      Model.vm.drawToolsEnabled = ko.observable(false);

      // Apply Bindings upon initialization
      ko.applyBindings(Model.vm, document.getElementById(el));
    }

  });

  Model.get = function (item) {
    return item === "model" ? Model.vm : Model.vm[item]();
  };

  Model.set = function (item, value) {
    Model.vm[item](value);
  };

  Model.applyTo = function(el) {
    ko.applyBindings(Model.vm, document.getElementById(el));
  };

  Model.initialize = function (el) {
    if (!Model.instance) {
      Model.instance = new Model(el);
    }
    return Model.instance;
  };

  return Model;

});

define('utils/Analytics',[], function() {
    'use strict';

    return {

        /**
         * Send an event to Google Analytics
         * @param {string} category - Category of an event, all should be 'Event'
         * @param {string} action - Type of action performed
         * @param {string} label - label describing the action
         * @param {number} value - value associated with the action
         */
        sendEvent: function(category, action, label, value) {

            var payload = {
                'hitType': 'event',
                'eventCategory': category,
                'eventAction': action,
                'eventLabel': label,
                'eventValue': value || 1
            };

            if (ga) {
                ga('A.send', payload);
                ga('B.send', payload);
                ga('C.send', payload);
            }

        },

        /**
         * Send a pageview to Google Analytics
         * @param {string} - [overrideUrl] - Override the page url and send in a different url
         * @param {string} - [overrideTitle] - Override the page title and send in a different title
         */
        sendPageview: function(overrideUrl, overrideTitle) {
            var payload = {
                'hitType': 'pageview'
            };

            // Add in url if it needs to be overwritten
            if (overrideUrl) {
                payload.page = overrideUrl;
            }

            // Add in title if it needs to be overwritten
            if (overrideTitle) {
                payload.title = overrideTitle;
            }

            if (ga) {
                ga('A.send', payload);
                ga('B.send', payload);
                ga('C.send', payload);
            }

        }

    };

});
define('map/Uploader',[
    // My Modules
    'map/config',
    'map/Symbols',
    'utils/GeoHelper',
    'analysis/config',
    'analysis/WizardStore',
    'utils/Analytics',
    // Dojo Modules
    'dojo/on',
    'dojo/sniff',
    'dojo/dom-class',
    'dijit/registry',
    'dojo/store/Memory',
    'dojo/dom-construct',
    'dijit/form/ComboBox',
    'dojox/data/CsvStore',
    // Esri Modules
    'esri/request',
    'esri/graphic',
    'esri/geometry/Point',
    'esri/geometry/Extent',
    'esri/geometry/Polygon',
    'esri/geometry/scaleUtils',
    'esri/geometry/webMercatorUtils'
], function(MapConfig, Symbols, GeoHelper, AnalysisConfig, WizardStore, Analytics, on, sniff, domClass, registry, Memory, domConstruct, ComboBox, CsvStore, esriRequest, Graphic, Point, Extent, Polygon, scaleUtils, webMercatorUtils) {
    'use strict';

    var closeHandle;

    var KEYS = AnalysisConfig.STORE_KEYS;

    var Uploader = {

        /**
         * Toggle the Upload Panel
         */
        toggle: function() {
            domClass.toggle('upload-modal', 'active');

            if (closeHandle) {
                closeHandle.remove();
                closeHandle = undefined;
            } else {
                closeHandle = on.once(document.querySelector('#upload-modal .close-icon'), 'click', this.toggle);
            }

        },

        /**
         * Force close
         */
        close: function() {
            if (closeHandle) {
                closeHandle.remove();
                closeHandle = undefined;
            }
            return domClass.remove('upload-modal', 'active');
        },

        /**
         * Receive the Form event and delegate to the appropriate method
         * @param {object} evt - Event emitted by the form onChange
         */
        beginUpload: function(evt) {
            if (evt.target.value === '') {
                // Form was reset so just return
                return;
            }

            var filename = evt.target.value.toLowerCase();
            // Filename is full path so extract the filename if in IE
            if (sniff('ie')) {
                var temp = filename.split('\\');
                filename = temp[temp.length - 1];
            }

            if (filename.indexOf('.zip') < 0) {
                this.uploadCSV(evt);
            } else {
                this.uploadShapefile(filename, evt);
            }

        },

        /**
         * Upload csv file containing name, latitude, and longitude
         * @param {stirng} filename - name of file to upload
         * @param {object} evt - Event emitted by the form onChange(may not be needed but passed just incase)
         */
        uploadCSV: function(evt) {
            var file = evt.target.files[0],
                reader = new FileReader(),
                attributeStore = [],
                self = this,
                fileLoaded,
                attributes,
                store;

            fileLoaded = function() {
                // Create a CSV Store and fetch all items from it afterwards
                store = new CsvStore({
                    data: reader.result,
                    separator: ','
                });

                store.fetch({
                    onComplete: function(items) {

                        if (items.length < 1) {
                            throw new Error('No items found in CSV file.');
                        }

                        // Emit Event for Analytics
                        Analytics.sendEvent('Event', 'Upload Data', 'User uploaded CSV.', 1);

                        attributes = store.getAttributes(items[0]);

                        attributes.forEach(function(attr) {
                            attributeStore.push({
                                name: attr,
                                id: attr
                            });
                        });

                        self.generateDropdown(attributeStore, function(name) {
                            if (name) {
                                self.formatCSVDataForStore(store, items, name);
                            }
                        });

                    },
                    onError: self.uploadError
                });

            };

            // Read the CSV File
            reader.onload = fileLoaded;
            reader.readAsText(file);
        },

        /**
         * Upload a shapefile containing points or polygons
         * @param {stirng} filename - name of file to upload
         * @param {object} evt - Event emitted by the form onChange(may not be needed but passed just incase)
         */
        uploadShapefile: function(filename, evt) {

            var params,
                extent;



            // Split the extension off using the .
            filename = filename.split('.');

            //Chrome and IE add c:\fakepath to the value - we need to remove it
            //See this link for more info: http://davidwalsh.name/fakepath
            filename = filename[0].replace("c:\\fakepath\\", "");

            params = {
                'name': filename,
                'targetSR': app.map.spatialReference,
                'generalize': true,
                'maxRecordCount': 1000,
                'reducePrecision': true,
                'numberOfDigitsAfterDecimal': 0,
                'enforceInputFileSizeLimit': true,
                'enforceOutputJsonSizeLimit': true
            };

            // Generalize Features, based on https://developers.arcgis.com/javascript/jssamples/portal_addshapefile.html
            extent = scaleUtils.getExtentForScale(app.map, 40000);
            params.maxAllowableOffset = extent.getWidth() / app.map.width;

            esriRequest({
                url: MapConfig.uploader.portalUrl,
                content: {
                    'f': 'json',
                    'filetype': 'shapefile',
                    'callback.html': 'callback',
                    'publishParameters': JSON.stringify(params)
                },
                form: document.getElementById('upload-form'),
                handleAs: 'json',
                load: this.uploadSuccess.bind(this),
                error: this.uploadError
            });

        },

        /**
         * @param {object} err - Error object emitted from portal upload
         */
        uploadError: function(err) {
            console.error("Error uplaoding data: ", err);
        },

        /**
         * @param {object} res - Response from the portal upload
         * @param {object} params - Parameters sent in with the request (prob not needed but here anyway)
         */
        uploadSuccess: function(res, params) {

            var featureCollection = res.featureCollection,
                uploadedFeatureStore = [],
                self = this;

            // Emit Event for Analytics
            Analytics.sendEvent('Event', 'Upload Data', 'User uploaded zip file.', 1);

            // Create a store of data
            // Currently this upload only takes the first layer of a shapefile
            // This may need to be reworked to upload multiple layers if needed
            featureCollection.layers[0].layerDefinition.fields.forEach(function(field) {
                uploadedFeatureStore.push({
                    name: field.name,
                    id: field.alias
                });
            });

            self.generateDropdown(uploadedFeatureStore, function(name) {
                if (name) {
                    self.formatFeaturesToStore(featureCollection.layers[0].featureSet, name);
                }
            });

        },

        /**
         * Prepare a csv data store to be pushed to the WizardStore, output format will be esri.Graphic
         * @param {object} store - dojo's CSV Store
         * @param {array} items - Array of items resulting from a fetch on the csv store
         * @param {string} nameField - Field to be used as the name field
         */
        formatCSVDataForStore: function(store, items, nameField) {
            var counter = GeoHelper.nextCustomFeatureId(),
                newFeatures = [],
                attributes,
                feature,
                attrs,
                value,
                lat,
                lon;

            // Parse the Attribtues
            items.forEach(function(item, index) {
                attributes = {};
                attrs = store.getAttributes(item);
                attrs.forEach(function(attr) {
                    value = store.getValue(item, attr);
                    attributes[attr] = isNaN(value) ? value : parseFloat(value);
                });

                attributes[MapConfig.uploader.labelField] = 'ID - ' + (counter + index) + ': ' + attributes[nameField];
                attributes.WRI_ID = (counter + index);
                attributes.isRSPO = false;

                // Try to get the Lat and Long from Latitude and Longitude but not case sensitive
                lat = attributes.Latitude ? attributes.Latitude : attributes.latitude;
                lon = attributes.Longitude ? attributes.Longitude : attributes.longitude;

                feature = GeoHelper.generatePointGraphicFromGeometric(lon, lat, attributes);
                newFeatures.push(feature);
            });

            WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat(newFeatures));

        },

        /**
         * Prepare a feature set to be added to the WizardStore
         * @param {} featureSet - Feature Set
         * @param {string} nameField - Field to be used as the name field
         */
        formatFeaturesToStore: function(featureSet, nameField) {

            var counter = GeoHelper.nextCustomFeatureId(),
                newFeatures = [],
                geometry,
                graphic,
                extent,
                symbol,
                temp;

            featureSet.features.forEach(function(feature, index) {
                feature.attributes[MapConfig.uploader.labelField] = 'ID - ' + (counter + index) + ': ' + feature.attributes[nameField];
                feature.attributes.WRI_ID = (counter + index);
                // If its a point, create a point, else, create a polygon
                // If it is a point, add a isRSPO field and set it to false
                if (feature.geometry.x) {
                    symbol = Symbols.getPointSymbol();
                    geometry = new Point(feature.geometry);
                    temp = new Extent(geometry.x, geometry.y, geometry.x, geometry.y, geometry.spatialReference);
                    extent = extent ? extent.union(temp) : temp;
                    feature.attributes.isRSPO = false;
                } else {
                    symbol = Symbols.getPolygonSymbol();
                    geometry = new Polygon(feature.geometry);
                    extent = extent ? extent.union(geometry.getExtent()) : geometry.getExtent();
                }

                graphic = new Graphic(geometry, symbol, feature.attributes);
                newFeatures.push(graphic);

            });

            WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat(newFeatures));

        },

        /**
         * Simple Utility function to destroy dijits and reset the form
         */
        resetForm: function() {
            var nameFieldNode = document.getElementById('uploadNameField');

            if (registry.byId('uploadNameFieldWidget')) {
                registry.byId('uploadNameFieldWidget').destroy();
            }
            if (nameFieldNode) {
                domConstruct.destroy(nameFieldNode.id);
            }

            document.getElementById('upload-form').reset();
        },

        /**
         * Simple Utility function to create a dropdown to allow the user to choose a name field
         * The data should be an array of objects like {name: '..', id: '..'}
         * @param {array} data - Array of data to create the dropdown with
         * @param {function} callback - Callback to invoke once complete
         */
        generateDropdown: function(data, callback) {

            var locationNode = document.getElementById('postUploadOptions'),
                self = this,
                store;

            domConstruct.create('div', {
                'id': 'uploadNameField',
                'innerHTML': '<div id="uploadNameFieldWidget"></div>'
            }, locationNode, 'last');

            store = new Memory({
                data: data
            });

            new ComboBox({
                id: "uploadNameFieldWidget",
                value: "-- Choose name field --",
                store: store,
                searchAttr: "name",
                onChange: function(name) {
                    self.resetForm();
                    self.toggle();
                    callback(name);
                }
            }, "uploadNameFieldWidget");

        }


    };

    return Uploader;

});

define('components/alertsForm/AlertsForm',[
  // libs
  'react',
  'lodash',
  // src
  'analysis/WizardStore',
  'components/alertsForm/config',
  'components/featureList/FeatureList',
  'map/config',
  'map/MapModel',
  'map/Uploader',
  'map/Symbols',
  'utils/GeoHelper',
  // esri/dojo
  'esri/graphic',
  'esri/geometry/Polygon',
  'esri/toolbars/draw',
  'dojo/topic',
  'dojo/dom',
  'dojo/query',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  'dojox/validate/web'
], function (React, _, WizardStore, AlertsConfig, FeatureList, MapConfig, MapModel, Uploader, Symbols, GeoHelper, Graphic, Polygon, Draw, topic, dom, dojoQuery, domClass, Deferred, all, xhr, validate) {

  var AlertsForm,
      drawToolbar,
      activeTool,
      TEXT = AlertsConfig.TEXT,
      KEYS = AlertsConfig.STORE_KEYS,
      getDefaultState,
      self = this;

  getDefaultState = function () {
    return {
      features: WizardStore.get(KEYS.customFeatures),
      selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)
    }
  }

  AlertsForm = React.createClass({

    getInitialState: getDefaultState,

    componentDidMount: function () {
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);

      WizardStore.registerCallback(KEYS.customFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.customFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      this.setState(getDefaultState());
    },

    componentWillReceiveProps: function (newProps) {
      // Update state with newly received props
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    render: function () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          currentSelectionLabel = currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label}).join(', ') : TEXT.noSelection,
          self = this;

      return (
        React.DOM.div({className: 'relative fill'},
          // Header
          React.DOM.div({className: 'alerts-form__header'},
            React.DOM.div({className: 'alerts-form__header__title inline-block fill__long border-box padding__long vertical-middle'}, TEXT.title),
            React.DOM.button({'onClick': this._toggle, className: 'alerts-form__header__exit back-white absolute no-top no-right no-padding fill__long pointer'},
              React.DOM.img({'className': 'vertical-middle', 'src': 'app/css/images/close_symbol.png'})
            )
          ),
          // Body
          React.DOM.div({className: 'alerts-form__body'},
            // Tools
            React.DOM.div({'className':'padding__wide padding__top'},
              React.DOM.div({'className':'margin__bottom'}, AlertsConfig.customArea.instructions),
              React.DOM.div({'className':'text-center margin__bottom'},
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, AlertsConfig.customArea.freehandLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, AlertsConfig.customArea.polyLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': Uploader.toggle.bind(Uploader), 'id':'alerts-draw-upload' }, AlertsConfig.customArea.uploadLabel)
              )
            ),
            // Features
            new FeatureList({'features': this.state.features, 'selectedFeatures': this.state.selectedFeatures})
          ),
          // Footer
          React.DOM.div({className: 'alerts-form__footer'},
          React.DOM.div({className: 'inline-block padding__left'}, TEXT.selection),
          React.DOM.div({className: 'alerts-form__footer__selection absolute inline-block padding__wide text-gold ellipsis border-box', title: currentSelectionLabel}, currentSelectionLabel),
          React.DOM.button({className: 'text-white back-orange no-border fill__long pointer absolute no-right no-top', onClick: this._subscribeToAlerts, disabled: (this.state.selectedFeatures.length === 0)}, TEXT.subscribe)
          )
        )
      );
    },

    _toggle: function () {
      topic.publish('toggleAlerts');
    },

    _activateToolbar: function (evt) {
      var geometryType;

      geometryType = evt.target.dataset ? evt.target.dataset.geometryType : evt.target.getAttribute("data-geometry-type")

      // If any other tools are active, remove the active class
      this._removeActiveClass();

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === geometryType) {
        this._deactivateToolbar();
        return;
      }

      activeTool = geometryType

      drawToolbar.activate(geometryType);
      domClass.add(evt.target, "active");

      // Update the Model so other parts of the application can be aware of this
      MapModel.set('drawToolsEnabled', true);
    },

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
      MapModel.set('drawToolsEnabled', false);
    },

    _drawComplete: function (evt) {
      this._removeActiveClass();
      this._deactivateToolbar();

      if (!evt.geometry) {
        return;
      }

      var id = GeoHelper.nextCustomFeatureId(),
          attrs = { "WRI_ID": id },
          feature = new Graphic(evt.geometry, Symbols.getPolygonSymbol(), attrs);

      attrs[AlertsConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";

      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
    },

    _removeActiveClass: function () {
      dojoQuery(".alerts-form__body .alerts-form__drawing-tool").forEach(function (node) {
        domClass.remove(node, "active");
      });
    },

    _subscribeToAlerts: function () {
      WizardStore.set(KEYS.alertsDialogActive, !WizardStore.get(KEYS.alertsDialogActive));
    }
  });

  return function (props, el) {
    return React.renderComponent(new AlertsForm(props), document.getElementById(el));
  };
});

define('components/alertsDialog/config',[
  'analysis/config'
], function (AnalysisConfig) {
  return {
    // Referenced configs
    STORE_KEYS: AnalysisConfig.STORE_KEYS,
    // Unique configs
    MAX_INPUT_CHARS: 70,
    IDS: {
      mount: 'subscription-modal',
      forma: 'alerts-forma',
      fires: 'alerts-fires',
      buffer: 'alerts-buffer',
      email: 'alerts-email',
      subscription: 'alerts-subscription'
    },
    TEXT: {
      title: 'Subscribe to Alerts',
      forma: 'Monthly Clearance Alerts',
      fires: 'Fire Alerts',
      selectionLabel: 'Selection:',
      noSelection: 'No name available',
      subscriptionPlaceholder: 'Subscription name',
      subscriptionDefaultLabel: 'Use default name',
      emailPlaceholder: 'your_email@example.com',
      subscribe: 'Subscribe',
      bufferLabel: 'Point data selected - buffer area(s) required.',
      bufferOptionsLabel: 'Buffer radius:',
      bufferOptions: [
        ['50', '50km'],
        ['40', '40km'],
        ['30', '30km'],
        ['20', '20km'],
        ['10', '10km']
      ],
      messagesLabel: 'Please fill in the following:\n',
      messages: {
        invalidEmail: 'You must provide a valid email in the form.',
        noAreaSelection: 'You must select at least one area from the list.',
        noSelection: 'You must select at least one checkbox from the form.',
        noSelectionName: 'You must provide a name for your subscription area.',
        formaSuccess: 'Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.',
        formaFail: 'There was an error with your request to subscribe to Forma alerts.  Please try again later.',
        fireSuccess: 'Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.',
        fireFail: 'There was an error with your request to subscribe to Fires alerts.  Please try again later.'
      },
      requiredLabels: {
        alerts: '* Please select an alert type.',
        subscription: '* Please name this alert.',
        email: '* Please enter a valid email.'
      }
    },
    requests: {
      fires: {
        url: 'https://gfw-fires.wri.org/subscribe_by_polygon',
        options: {
          method: 'POST',
          handleAs: 'json',
          headers: {
            'X-Requested-With': null
          },
          data: {
            msg_type: 'email',
            msg_addr: null,
            area_name: null,
            features: null
          }
        },
        successMessage: 'subscription successful'
      },
      forma: {
        url: 'http://gfw-apis.appspot.com/subscribe',
        options: {
          method: 'POST',
          data: {
            topic: 'updates/forma',
            geom: null,
            email: null
          }
        }
      }
    }
  };
});

/** @jsx React.DOM */
define('components/alertsDialog/alertsDialog',[
  // libs
  'react',
  'lodash',
  // src
  'components/alertsDialog/config',
  'analysis/WizardStore',
  'utils/GeoHelper',
  'utils/Analytics',
  // esri/dojo
  'esri/geometry/Polygon',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  'dojox/validate/web'
], function (React, _, Config, WizardStore, GeoHelper, Analytics, Polygon, dom, domClass, Deferred, all, xhr, validate) {

  var AlertsDialog,
      getDefaultState,
      KEYS = Config.STORE_KEYS,
      IDS = Config.IDS,
      TEXT = Config.TEXT,
      self = this;

  // form attributes/text
  var pbVal,
      pbId1,
      pbId2,
      formaId = _.uniqueId(IDS.forma),
      firesId = _.uniqueId(IDS.fires),
      bufferId = _.uniqueId(IDS.buffer),
      emailId = _.uniqueId(IDS.email),
      subscriptionNameId = _.uniqueId(IDS.subscrpition);

  getDefaultState = function () {
    return {
      forma: false,
      fires: false,
      email: '',
      subscriptionName: '',
      features: WizardStore.get(KEYS.selectedCustomFeatures),
      presetFeature: WizardStore.get(KEYS.selectedPresetFeature)
    };
  }

  AlertsDialog = React.createClass({displayName: "AlertsDialog",
    getInitialState: getDefaultState,

    componentDidMount: function () {
      WizardStore.registerCallback(KEYS.alertsDialogActive, function () {
        if (WizardStore.get(KEYS.alertsDialogActive)) {
          domClass.add(IDS.mount, 'active');
        } else {
          domClass.remove(IDS.mount, 'active');
        }
      }.bind(this));

      WizardStore.registerCallback(KEYS.customFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.selectedCustomFeatures)});
        WizardStore.set(KEYS.selectedPresetFeature, null);
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedPresetFeature, function () {
        this.setState({presetFeature: WizardStore.get(KEYS.selectedPresetFeature)});

      }.bind(this));

      if (WizardStore.get(KEYS.alertsDialogActive) === true) {
        domClass.add(IDS.mount, 'active');
      }
    },

    render: function () {
      var features = this.state.features,
          presetFeature = this.state.presetFeature,
          selection,
          featuresContainsPoint,
          disable,
          disableConditions,
          hiddenConditions,
          radiusSelect;

      if (presetFeature !== null) {

        featuresContainsPoint = presetFeature.geometry.type === 'point';
        selection = presetFeature.attributes.WRI_label ||
                    presetFeature.attributes.Name ||
                    presetFeature.attributes.name ||
                    presetFeature.attributes.NAME ||
                    presetFeature.attributes.Mill_name ||
                    TEXT.noSelection;

      } else {
        featuresContainsPoint = _.find(features, function (feature) {return feature.geometry.type === 'point'}) ? true : false;
        selection = features.length > 0 ? features.map(function (feature) {return feature.attributes.WRI_label}).join(', ') : TEXT.noSelection;
      }

      if (featuresContainsPoint) {
        radiusSelect = (
          React.createElement("div", {className: "margin__bottom"}, 
            React.createElement("div", {className: "margin--small__left"}, TEXT.bufferLabel), 
            React.createElement("span", {className: "margin--small__left"}, TEXT.bufferOptionsLabel), 
            React.createElement("select", {id: bufferId, className: "margin__left"}, 
              TEXT.bufferOptions.map(function (option) {
                return React.createElement("option", {value: option[0]}, option[1])
              })
            )
          )
        )
      }
      hiddenConditions = [
        selection === TEXT.noSelection
      ]

      disableConditions = [
        features.length === 0 && presetFeature === null,
        this.state.subscriptionName.trim().length === 0,
        this.state.email.trim().length === 0,
        !validate.isEmailAddress(this.state.email),
        this.state.forma !== true && this.state.fires !== true

      ]

      disabled = disableConditions.indexOf(true) > -1;

      pbId1 = 'pb_' + _.random(1,100).toString();
      pbId2 = 'pb_' + _.random(1,100).toString();
      // Set default once because React doesn't update defaultValue
      pbVal = pbVal || pbId1 + pbId2;

      // <div className='margin__bottom'>
      //   <label className='vertical-middle'>
      //     <input id={formaId} className='vertical-middle' type='checkbox' onChange={this._formChange} checked={this.state.forma} />
      //     {TEXT.forma}
      //   </label>
      // </div>

      return (
        React.createElement("div", {className: "alerts-dialog"}, 
          React.createElement("div", {className: "close-icon", onClick: this._close}), 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "alerts-form__form no-wide border-box"}, 
              React.createElement("div", {className: "modal-header"}, TEXT.title), 
              React.createElement("div", {className: "margin__bottom margin--small__left"}, 
                React.createElement("span", null, TEXT.selectionLabel), 
                React.createElement("span", {className: 'padding__left' + (disableConditions[0] ? ' text-red' : ' text-gold'), title: selection}, 
                  selection.substr(0, 75), 
                  selection.length > 75 ? '...' : ''
                )
              ), 
              React.createElement("div", {className: "margin--small__wide"}, 
                React.createElement("div", {className: "font-12px text-red margin__top", style: {visibility: disableConditions[4] ? 'visible' : 'hidden'}}, 
                  TEXT.requiredLabels.alerts
                )
              ), 

              React.createElement("div", {className: ""}, 
                React.createElement("label", {className: "margin--small__bottom vertical-middle"}, 
                  React.createElement("input", {id: firesId, className: "vertical-middle", type: "checkbox", onChange: this._formChange, checked: this.state.fires}), 
                  TEXT.fires
                )
              ), 
              React.createElement("div", {className: "pooh-bear text-center"}, 
                React.createElement("div", {className: "pooh-bear"}, "Please leave this blank"), 
                React.createElement("input", {id: pbId1, className: "pooh-bear", type: "text", name: "name"})
              ), 
              React.createElement("div", {className: "margin--small__wide font-12px text-red margin__top", style: {visibility: disableConditions[1] ? 'visible' : 'hidden'}}, 
                TEXT.requiredLabels.subscription
              ), 
              React.createElement("div", {className: "text-left margin__bottom margin--small__wide"}, 
                React.createElement("input", {id: subscriptionNameId, className: "border-medium-gray border-radius", maxLength: toString(Config.MAX_INPUT_CHARS), type: "text", onChange: this._formChange, value: this.state.subscriptionName, placeholder: TEXT.subscriptionPlaceholder}), 
                React.createElement("button", {className: "margin__left font-16px text-white back-orange no-border border-radius", onClick: this._setDefaultSubscriptionName, disabled: disableConditions[0], style: {display: hiddenConditions[0] ? 'none' : 'inline-block'}}, TEXT.subscriptionDefaultLabel)
              ), 
              React.createElement("div", {className: "margin--small__wide font-12px text-red margin__top", style: {visibility: disableConditions[3] ? 'visible' : 'hidden'}}, 
                TEXT.requiredLabels.email
              ), 
              React.createElement("div", {className: "text-left margin__bottom margin--small__wide"}, 
                React.createElement("input", {id: emailId, className: "border-medium-gray border-radius", maxLength: toString(Config.MAX_INPUT_CHARS), type: "text", onChange: this._formChange, value: this.state.email, placeholder: TEXT.emailPlaceholder})
              ), 
              React.createElement("div", {className: "pooh-bear text-center"}, 
                React.createElement("div", {className: "pooh-bear"}, "Please do not change this field"), 
                React.createElement("input", {id: pbId2, className: "pooh-bear", type: "text", name: "address", defaultValue: pbVal})
              ), 
              radiusSelect, 
              React.createElement("div", {className: "text-center margin__bottom"}, 
                React.createElement("button", {className: "text-white back-orange no-border border-radius font-16px", onClick: this._subscribe, disabled: disabled}, 
                  React.createElement("img", {className: "vertical-sub", width: "21px", height: "19px", src: 'app/css/images/alert_symbol_' + (disabled ? 'gray' : 'white') + '.png'}), 
                  React.createElement("span", {className: "padding__left"}, TEXT.subscribe)
                )
              )
            )
          )
        )
      )
    },

    _close: function () {
      WizardStore.set(KEYS.alertsDialogActive, !WizardStore.get(KEYS.alertsDialogActive));
    },

    _formChange: function (event) {
      var state = {
        // forma: dom.byId(formaId).checked,
        fires: dom.byId(firesId).checked,
        subscriptionName: dom.byId(subscriptionNameId).value,
        email: dom.byId(emailId).value
      };
      this.setState(state);
    },

    _subscribeToFires: function (unionedPolygon, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = TEXT.messages,
          firesConfig = Config.requests.fires,
          url = firesConfig.url,
          options = _.cloneDeep(firesConfig.options);

      options.data.features = JSON.stringify({
        rings: unionedPolygon.rings,
        spatialReference: unionedPolygon.spatialReference
      });
      options.data.msg_addr = email;
      options.data.area_name = subscriptionName;
      xhr(url, options).then(function (response) {
        deferred.resolve((response.message && response.message === firesConfig.successMessage) ? messagesConfig.fireSuccess : messagesConfig.fireFail);
      });

      Analytics.sendEvent('Subscribe', 'Fire Alerts', 'User is subscribing to Fire Alerts.');

      return deferred.promise;
    },

    _subscribeToForma: function (geoJson, subscriptionName, email) {
      var deferred = new Deferred(),
          messagesConfig = TEXT.messages,
          url = Config.requests.forma.url,
          options = _.cloneDeep(Config.requests.forma.options),
          data = JSON.stringify({
            topic: options.data.topic,
            email: email,
            geom: '{"type": "' + geoJson.type + '", "coordinates":[' + JSON.stringify(geoJson.geom) + ']}'
          }),
          request = new XMLHttpRequest()
          self = this;

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          deferred.resolve((JSON.parse(request.response).subscribe) ? messagesConfig.formaSuccess : messagesConfig.formaFail);
        }
      };
      request.addEventListener('error', function () {
        deferred.resolve(false);
      }, false);
      request.open(options.method, url, true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.send(data);

      Analytics.sendEvent('Subscribe', 'Monthly Clearance Alerts', 'User is subscribing to Monthly Clearance Alerts.');

      return deferred.promise;
    },


    _subscribe: function () {
      // honeypot short-circuit
      if ( (dom.byId(pbId1) == null || dom.byId(pbId2) == null) || (dom.byId(pbId1).value.length > 0 || dom.byId(pbId2).value !== pbVal) ) {
        return;
      }

      var features = this.state.features,
          presetFeature = this.state.presetFeature,
          featuresContainsPoint,
          polygons,
          pointsAsPolygons,
          radius,
          subscriptions = [];

      if (presetFeature !== null) {
        features = [presetFeature];
        featuresContainsPoint = features[0].geometry.type === 'point';
      } else {
        featuresContainsPoint = _.find(features, function (feature) {return feature.geometry.type === 'point'}) ? true : false;
      }

      if (featuresContainsPoint) {
        radius = parseInt(dom.byId(bufferId).value);
        pointsAsPolygons = _.filter(features, function (feature) {return feature.geometry.type === 'point'});
        pointsAsPolygons = pointsAsPolygons.map(function (point) {return GeoHelper.preparePointAsPolygon(point, radius);});
        pointsAsPolygons = pointsAsPolygons.map(function (point) {return new Polygon(GeoHelper.getSpatialReference()).addRing(point.geometry.rings[point.geometry.rings.length - 1]);});
        features = _.filter(features, function (feature) {return feature.geometry.type !== 'point'});
        polygons = features.map(function (feature) {
          var polygon = new Polygon(GeoHelper.getSpatialReference());
          polygon.rings = feature.geometry.rings;
          return polygon;
        });
        polygons = polygons.concat(pointsAsPolygons);
      } else {
        polygons = features.map(function (feature) {
          var polygon = new Polygon(GeoHelper.getSpatialReference());
          polygon.rings = feature.geometry.rings;
          return polygon;
        });
      }

      GeoHelper.union(polygons).then(function (unionedPolygon) {
        // if (this.state.forma === true) {
        //   subscriptions.push(this._subscribeToForma(GeoHelper.convertGeometryToGeometric(unionedPolygon), this.state.subscriptionName.trim(), this.state.email.trim()));
        // }
        if (this.state.fires === true) {
          subscriptions.push(this._subscribeToFires(unionedPolygon, this.state.subscriptionName.trim(), this.state.email.trim()));
        }

        all(subscriptions).then(function (responses) {
          // alert(responses.join('\n'));
          console.log(responses.join('\n'));
        });
      }.bind(this));

      this._close();
    },

    _setDefaultSubscriptionName: function () {
      var feature = this.state.presetFeature !== null ? this.state.presetFeature : this.state.features[0],
          subscriptionName = feature.attributes.WRI_label ||
                              feature.attributes.Name ||
                              feature.attributes.NAME ||
                              feature.attributes.Mill_name ||
                              '';
      this.setState({subscriptionName: subscriptionName.substr(0, Config.MAX_INPUT_CHARS)});
    }

  });

  return function () {
    return React.render(React.createElement(AlertsDialog, null), dom.byId(IDS.mount));
  };
});

define('analysis/Query',[
	"dojo/Deferred",
	"dojo/_base/array",
	"esri/tasks/query",
	"esri/graphicsUtils",
	"esri/tasks/QueryTask",
	"esri/tasks/StatisticDefinition",
	// My Modules
	"analysis/config",
	"map/MapModel"
], function (Deferred, arrayUtils, Query, graphicsUtils, QueryTask, StatisticDefinition, AnalyzerConfig, MapModel) {
	'use strict';

	return {

		getSetupData: function () {
			this.getAdminUnitData();
		},

		/*
			Fetches a list of All Countries for populating the Admin Unit Dropdown
		*/
		getAdminUnitData: function () {
			var query = new Query(),
					config = AnalyzerConfig.adminUnit.countriesQuery,
					statsDefinition;

			// Create a statistics defenition
			statsDefinition = new StatisticDefinition();
			statsDefinition.statisticType = config.statistic.statisticType;
			statsDefinition.onStatisticField = config.statistic.onStatisticField;
      statsDefinition.outStatisticFieldName = config.statistic.outStatisticFieldName;

			query.where = config.where;
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;
			query.outStatistics = [statsDefinition];
			query.groupByFieldsForStatistics = config.groupBy;

			function formatResponse(res) {
				var data = [];
				// Push in Default None Object
				data.push({'label': 'None', 'value': 'NONE'});

				arrayUtils.forEach(res.features, function (feature) {
					data.push({
						'label': feature.attributes[config.labelValueField],
						'value': feature.attributes[config.labelValueField]
					});
				});

				MapModel.set('allCountries', data);
			}

			this._query(config.url, query, formatResponse, this._queryErrorHandler);

		},

		getLowLevelAdminUnitData: function (countryName) {
			var deferred = new Deferred(),
					query = new Query(),
					config = AnalyzerConfig.adminUnit.lowLevelUnitsQuery,
					buckets = {},
					self = this,
					data = [],
					attrs;

			query.where = config.whereField + " = '" + countryName + "' AND " + config.requiredField + " IS NOT NULL";
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve([]);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to retrieve a feature by its Group Name
		*/
		getFeaturesByGroupName: function (config, groupName) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			// Config is analysis/config using items like adminUnit.lowLevelUnitsQuery or commercialEntity.commodityQuery
			query.where = config.requiredField + " = '" + groupName + "'";
			query.geometryPrecision = 0;
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(config.url, query, function (res) {
				if (res.features.length > 0) {
					deferred.resolve(res.features);
				} else {
					deferred.resolve([]);
				}
			}, function (err) {
				deferred.resolve([]);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve a feature by its Group Name and Country Name
		*/
		getFeaturesByGroupNameAndCountry: function (config, groupName, countryName) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			// Config is analysis/config using items like adminUnit.lowLevelUnitsQuery or commercialEntity.commodityQuery
			query.where = config.requiredField + " = '" + groupName + "'" + " AND NAME_0 = '" + countryName + "'";
			query.geometryPrecision = 0;
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(config.url, query, function (res) {
				if (res.features.length > 0) {
					deferred.resolve(res.features);
				} else {
					deferred.resolve([]);
				}
			}, function (err) {
				deferred.resolve([]);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve mills by their entity id
		*/
		getMillByEntityId: function (entityID) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			query.where = "Entity_ID = '" + entityID + "'";
			query.geometryPrecision = 2;
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(AnalyzerConfig.millPoints.url, query, function (res) {
				if (res.features.length === 1) {
					deferred.resolve(res.features[0]);
				} else {
					deferred.resolve(false);
				}
			}, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve mills by their wri id
		*/
		getMillByWriId: function (wriID) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			query.where = "wri_id = '" + wriID + "'";
			query.geometryPrecision = 2;
			query.returnGeometry = true;
			query.outFields = ['*'];

			this._query(AnalyzerConfig.millPoints.url, query, function (res) {
				if (res.features.length === 1) {
					deferred.resolve(res.features[0]);
				} else {
					deferred.resolve(false);
				}
			}, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to retrieve a feature by its Object ID
		*/
		getFeatureById: function (url, objectId) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

      query.objectIds = [objectId];
			query.geometryPrecision = 0;
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(url, query, function (res) {
				if (res.features.length === 1) {
					deferred.resolve(res.features[0]);
				}
			}, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve features by their Certification Scheme and Type
		*/

		getFeaturesByScheme: function (scheme, type) {
			var config = AnalyzerConfig.certifiedArea.schemeQuery,
					deferred = new Deferred(),
					query = new Query(),
					self = this,
					data = [];

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			query.where = config.whereField + " = '" + scheme + "' AND " + config.secondaryWhereField + " = '" + type + "'";
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve ALL MILL POINTS
		*/
		getMillPointData: function () {
			var config = AnalyzerConfig.millPoints,
					deferred = new Deferred(),
					query = new Query(),
					self = this,
					data = [];

			// This May need to change as we have more options for mill points and this function
			// may need to take an argument specifying a type of filter we want to apply based on which
			// commodity type the user selected in the app
			query.where = 'mill_name_ <> \'Unknown\'';
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to retrieve features by their Commodity Type
		*/
		getFeaturesByCommodity: function (type) {
			var config = AnalyzerConfig.commercialEntity.commodityQuery,
					deferred = new Deferred(),
					query = new Query(),
					self = this,
					data = [],
					where;

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			where = (type === 'Mining concession' ?
												config.whereField + " = '" + type + "'" :
												config.whereField + " = '" + type + "'"); // AND " + config.requiredField + " IS NOT NULL");

			query.where = where;
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to zoom to features by a whereField in their config and a filter value
			@Params
				config must have url, and whereField defined
				filter is obvious, zoom where whereField = 'filter'
		*/
		zoomToFeatures: function (config, filter) {
			var query = new Query(),
					extent;

			query.where = config.whereField + " = '" + filter + "'";
			query.maxAllowableOffset = 3000;
			query.returnGeometry = true;
			query.geometryPrecision = 0;

			this._query(config.url, query, function (res) {
				if (res.features.length > 0) {
					extent = graphicsUtils.graphicsExtent(res.features);
					app.map.setExtent(extent, true);
				}
			}, this._queryErrorHandler);
		},

		/*
			@Params:
				config object containing three fields, requiredField (bucket label), labelField (label for children), valueField (value for item)
				features array
			@Return
				returns an array of data formatted for the NestedList Component

			@Format
				[
					{'label': 'B', 'value': 'b'},
				 	{'label': 'C', 'value': 'c', 'children': [
					  	{'label': 'd', 'value': 'd'},
					  	{'label': 'e', 'value': 'e'},
						]
				  }
				]
		*/

		_formatData: function (config, features) {
			var buckets = {},
					data = [],
					bucketName,
					attrs;

			arrayUtils.forEach(features, function (feature) {
				attrs = feature.attributes;
				bucketName = attrs[config.requiredField] || AnalyzerConfig.noNameField;

				if (buckets.hasOwnProperty(bucketName)) {
					buckets[bucketName].children.push({
						'label': attrs[config.labelField],
						'value': attrs[config.valueField]
					});
				} else {
					// requiredField is label for bucket, labelField is label for all children, valueField is value for all items
					buckets[bucketName] = {
						'label': bucketName,
						'value': attrs[config.valueField],
						'children': []
					};

					// Now push the first child in
					buckets[bucketName].children.push({
						'label': attrs[config.labelField],
						'value': attrs[config.valueField]
					});

				}

			});

			// Now push each bucket into an array except the no information field, do that last
			for (var key in buckets) {
				if (key !== AnalyzerConfig.noNameField) {
					data.push(buckets[key]);
				}
			}

			if (buckets[AnalyzerConfig.noNameField]) {
				data.push(buckets[AnalyzerConfig.noNameField]);
			}

			return data;
		},

		/*
			Simple Wrapper for creating executing query and handling responses
		*/
		_query: function (url, queryObject, success, fail) {
			var task = new QueryTask(url);
			task.execute(queryObject, success, fail);
		},

		/*
			Handle all query errors with this class
		*/
		_queryErrorHandler: function (err) {
			console.error(err);
		}

	};

});

define('utils/AlertsHelper',[
  'lodash',
  'dojo/fx',
  'dojo/_base/fx',
  'dojo/Deferred',
  'components/alertsForm/AlertsForm',
  'components/alertsDialog/alertsDialog',
  'analysis/WizardStore',
  'analysis/Query',
  'analysis/config',
  'map/config'
], function (_, coreFx, Fx, Deferred, AlertsForm, AlertsDialog, WizardStore, AnalyzerQuery, AnalyzerConfig, MapConfig) {

  var alertsForm,
      alertsDialog,
      KEYS = AnalyzerConfig.STORE_KEYS,
      GENERIC_LAYER_IDS = {
        'Logging concession': 3,
        'Mining concession': 2,
        'Wood fiber plantation': 0,
        'Oil palm concession': 1//,
        //'RSPO Oil palm concession': 27
      },
      _isOpen = false,
      _initAlertsDialog,
      _animate,
      _open,
      _close,
      self = this;

  _initAlertsDialog = function () {
    alertsDialog = alertsDialog || new AlertsDialog();
  }

  _animate = function (alertsFormWidth) {
    var animations,
        orignalCenterPoint = app.map.extent.getCenter();
        alertsFormWidth = alertsFormWidth || 0;
        duration = 500;

    return Fx.animateProperty({
      node: document.getElementById('alerts-form-container'),
      properties: {
        width: alertsFormWidth
      },
      duration: duration,
      onEnd: function () {
        _isOpen = !_isOpen;
      }
    });
  }

  _toggle = function () {
    WizardStore.set(KEYS.selectedCustomFeatures, []);
    return !_isOpen ? _animate(510) : _animate(0);
  }

  _getFeatureFromPopup = function (event) {
    var deferred,
        target = event.target,
        type = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
        label = target.dataset ? target.dataset.label : target.getAttribute('data-label'),
        id = target.dataset ? target.dataset.id : target.getAttribute('data-id'),
        url,
        layer,
        self = this;

    // Referenced from WizardHelper.js@analyzeAreaFromPopup
    if (type === 'AdminBoundary') {
      layer = MapConfig.adminUnitsLayer.layerId;
      url = MapConfig.adminUnitsLayer.url + '/' + layer;
    } else if (type === 'CertScheme') {
      layer = MapConfig.commercialEntitiesLayer.layerId;
      url = MapConfig.commercialEntitiesLayer.url + '/' + layer;
    } else if (type === 'MillPoint') {
      // deferred = AnalyzerQuery.getMillByEntityId(id);
      deferred = AnalyzerQuery.getMillByWriId(id);
    } else if (type === 'WDPA') {
      layer = MapConfig.palHelper.layerId;
      url = MapConfig.palHelper.url + '/' + layer;
    } else if (type === 'CustomGraphic') {
      deferred = new Deferred();
      layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
      deferred.resolve(_.find(layer.graphics, function (graphic) {return graphic.attributes.WRI_ID === parseInt(id)}) || false);
    } else if (GENERIC_LAYER_IDS[type] !== undefined) {
      layer = GENERIC_LAYER_IDS[type];
      url = MapConfig.oilPerm.url + '/' + layer;
    }

    if (deferred === undefined && url !== undefined) {
      deferred = AnalyzerQuery.getFeatureById(url, id);
    } else if (deferred === undefined) {
      throw new Error('Could not identify feature from event data.');
    }

    return deferred;
  }

  // NOTE: Below code is necessary to init dialog
  WizardStore.registerCallback(KEYS.alertsDialogActive, _initAlertsDialog);

  return {
    toggleAlertsForm: function () {
      alertsForm = alertsForm || new AlertsForm({}, 'alerts-form');
      return _toggle();
    },
    isOpen: function () {
      return _isOpen;
    },
    subscribeFromPopup: function (event) {
      var target = event.target,
          isCustomGraphic = (target.dataset ? target.dataset.type : target.getAttribute('data-type')) === 'CustomGraphic';

      self._getFeatureFromPopup(event).then(function (response) {

        if (response) {

          WizardStore.set(KEYS.alertsDialogActive, true);
          WizardStore.set(KEYS.selectedCustomFeatures, isCustomGraphic ? [response] : []);
          WizardStore.set(KEYS.selectedPresetFeature, isCustomGraphic ? null : response);
        } else {
          throw new Error('Could not identify feature from event data.');
        }
      });
      app.map.infoWindow.hide();
    }
  }
});

define('actions/WizardActions',[
  'utils/assert',
  'analysis/config',
  'analysis/WizardStore'
], function (assert, AnalyzerConfig, Store) {
  'use strict';

  var KEYS = AnalyzerConfig.STORE_KEYS;

  return {
    /**
    * Remove a feature from the Selected Features list by field with the provided value
    * this function is not greedy so the value provided should be unique, it will bail after first match
    * @param {string} field - field name we will be using for matching
    * @param {string} value - Value to match to the provided field
    */
    removeSelectedFeatureByField: function (field, value) {
      assert(field && value, 'Invalid Parameters for \'WizardActions.removeSelectedFeatureByField\'');

      var selectedFeatures = Store.get(KEYS.selectedCustomFeatures),
          featureRemoved,
          index;

      featureRemoved = selectedFeatures.some(function (feature, index) {
        if (feature.attributes[field] === value) {
          selectedFeatures.splice(index, 1);
          return true;
        }
      });

      if (featureRemoved) {
        Store.set(KEYS.selectedCustomFeatures, selectedFeatures);
      }

    },

    /**
    * Add a graphic to the store
    * @param {array} graphics - Array of Esri Graphic object to add to the list
    */
    addSelectedFeatures: function (graphics) {
      assert(graphics !== undefined, 'Invalid Parameters for \'WizardActions.addSelectedFeature\'');

      var selectedFeatures = Store.get(KEYS.selectedCustomFeatures);
      selectedFeatures = selectedFeatures.concat(graphics);
      Store.set(KEYS.selectedCustomFeatures, selectedFeatures);
    },

    /**
    * Add a graphic to the store of custom features, either drawn, from coordinates, or from upload
    * @param {array} graphics - Array of Esri Graphic object to add to the list
    */
    addCustomFeatures: function (graphics) {
      assert(graphics !== undefined, 'Invalid Parameters for \'WizardActions.addCustomFeatures\'');

      var customFeatures = Store.get(KEYS.customFeatures);
      customFeatures = customFeatures.concat(graphics);
      Store.set(KEYS.customFeatures, customFeatures);
    },

    /**
    * Clear the selected features list
    */
    clearSelectedCustomFeatures: function () {
      Store.set(KEYS.selectedCustomFeatures, []);
    },

    /**
    * Move on to the next step in the wizard
    */
    proceedToNextStep: function () {
      Store.set(KEYS.userStep, Store.get(KEYS.userStep) + 1);
    },

    /**
    * Update the selected area of interest in the wizard
    * @param {string} areaId - ID for the area of Interest
    * Valid Options are in analysis/config.js:
    * - AnalyzerConfig.stepOne.option1.id
    * - AnalyzerConfig.stepOne.option2.id
    * - AnalyzerConfig.stepOne.option3.id
    * - AnalyzerConfig.stepOne.option4.id
    * - AnalyzerConfig.stepOne.option5.id
    */
    setAreaOfInterest: function (areaId) {
      assert(areaId !== undefined, 'Invalid Parameters for \'WizardActions.setAreaOfInterest\'.');
      console.log(areaId);
      // debugger
      Store.set(KEYS.areaOfInterest, areaId);
    }

  };

});

/** @jsx React.DOM */
define('components/wizard/StepOne',[
	'react',
  'analysis/config',
	'utils/Analytics',
  'analysis/WizardStore',
  'actions/WizardActions'
], function (React, AnalyzerConfig, Analytics, WizardStore, WizardActions) {

  // Variables
  var config = AnalyzerConfig.stepOne,
      option1 = config.option1,
      option2 = config.option2,
      option3 = config.option3,
      option4 = config.option4,
      option5 = config.option5,
      KEYS = AnalyzerConfig.STORE_KEYS;

  // Helper Functions
  function getDefaultState() {

    return {
      completed: true,
      selectedOption: WizardStore.get(KEYS.areaOfInterest) || option1.id,
      previousAreaOfInterest: undefined
    };
  }

	function getAOILabel (aoi) {
		switch (aoi) {
			case option1.id:
				return option1.label;
			case option2.id:
				return option2.label;
			case option3.id:
				return option3.label;
			case option4.id:
				return option4.label;
			case option5.id:
				return option5.label;
		}
	}

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Set the default value in the store
			var aoi = WizardStore.get(KEYS.areaOfInterest);
			console.log(aoi);

			if (!aoi) {
				WizardActions.setAreaOfInterest(option1.id);
			}
      // Register a callback to the item of interest
      WizardStore.registerCallback(KEYS.areaOfInterest, this.areaOfInterestUpdated);
    },

    areaOfInterestUpdated: function () {
      var selectedOption = WizardStore.get(KEYS.areaOfInterest);
      this.setState({ selectedOption: selectedOption });
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        var defaults = getDefaultState();
        this.replaceState(defaults);
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        React.createElement("div", {className: "step"}, 
          React.createElement("div", {className: "step-body"}, 
            React.createElement("div", {className: "step-title"}, config.title), 
            React.createElement("p", {className: "step-one-main-description"}, config.description), 
            React.createElement("div", {className: "s1-radio-container"}, 
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option1.id, checked: this.state.selectedOption === option1.id}), 
              React.createElement("label", {htmlFor: option1.id}, option1.label), 
              React.createElement("p", {className: "step-one-option-description"}, option1.description)
            ), 
            React.createElement("div", {className: "s1-radio-container"}, 
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option2.id, checked: this.state.selectedOption === option2.id}), 
              React.createElement("label", {htmlFor: option2.id}, option2.label), 
              React.createElement("p", {className: "step-one-option-description"}, option2.description)
            ), 
            React.createElement("div", {className: "s1-radio-container"}, 
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option3.id, checked: this.state.selectedOption === option3.id}), 
              React.createElement("label", {htmlFor: option3.id}, option3.label), 
              React.createElement("p", {className: "step-one-option-description"}, option3.description)
            ), 
            React.createElement("div", {className: "s1-radio-container"}, 
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option4.id, checked: this.state.selectedOption === option4.id}), 
              React.createElement("label", {htmlFor: option4.id}, option4.label), 
              React.createElement("p", {className: "step-one-option-description"}, option4.description)
            ), 
            React.createElement("div", {className: "s1-radio-container"}, 
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option5.id, checked: this.state.selectedOption === option5.id}), 
              React.createElement("label", {htmlFor: option5.id}, option5.label), 
              React.createElement("p", {className: "step-one-option-description"}, option5.description)
            )
          ), 
          React.createElement("div", {className: "step-footer"}, 
            React.createElement("div", {className: "next-button-container", onClick: this.proceed}, 
              React.createElement("span", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },
    /* jshint ignore:end */

    changeSelection: function (e) {
      WizardActions.setAreaOfInterest(e.target.id);
    },

    resetSelectedFeatures: function() {
      var previousAreaOfInterest = this.state.previousAreaOfInterest || false,
          currentAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);

      if (previousAreaOfInterest && previousAreaOfInterest !== currentAreaOfInterest) {
        WizardActions.clearSelectedCustomFeatures();
      } else {
        this.setState({previousAreaOfInterest: currentAreaOfInterest});
      }
    },

    proceed: function () {
      this.resetSelectedFeatures();
      WizardActions.proceedToNextStep();
			//- Send Analytics
			var aoi = WizardStore.get(KEYS.areaOfInterest);
			Analytics.sendEvent('Analysis', 'Area', getAOILabel(aoi));
    }

  });

});

define('map/CoordinatesModal',[
  // My Modules
  'map/config',
  'map/Symbols',
  'utils/GeoHelper',
  'analysis/config',
  'analysis/WizardStore',
  'actions/WizardActions',
  // Dojo Modules
  'dojo/on',
  'dojo/dom-class'//,
  // Esri Modules
  // 'esri/graphic',
  // 'esri/geometry/Point'
], function (MapConfig, Symbols, GeoHelper, AnalysisConfig, WizardStore, WizardActions, on, domClass) {

  var closeHandle;

  // var KEYS = AnalysisConfig.STORE_KEYS;

  var CoordsModal = {

    /**
    * Toggle the Upload Panel
    */
    toggle: function () {
      domClass.toggle('coordinates-modal', 'active');

      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      } else {
        closeHandle = on.once(document.querySelector('#coordinates-modal .close-icon'), 'click', this.toggle);
      }
    },

    /**
    * Force close
    */
    close: function () {
      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      }
      return domClass.remove('coordinates-modal', 'active');
    },

    resetForm: function () {
      document.getElementById('coordsModalLatitiude').value = '';
      document.getElementById('coordsModalLongitude').value = '';
    },

    /**
    * Save a point with the coordinates entered by the user
    */
    savePoint: function () {

      var latitude = parseFloat(document.getElementById('coordsModalLatitiude').value),
          longitude = parseFloat(document.getElementById('coordsModalLongitude').value),
          errorMessages = MapConfig.coordinatesDialog.errors,
          id = GeoHelper.nextCustomFeatureId(),
          attributes = {},
          errors = [],
          feature;

      // Check for invalid entry
      if (latitude === '' || isNaN(latitude) || (latitude > 90 || latitude < -90)) {
        errors.push(errorMessages.invalidLatitude);
      }

      if (longitude === '' || isNaN(longitude) || (longitude > 180 || longitude < -180)) {
        errors.push(errorMessages.invalidLongitude);
      }

      // If there is invalid entry, notify the user
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Use the same label field as in the Uploader dialog instead of creating duplicate entries in the config
      attributes[MapConfig.uploader.labelField] = 'ID - ' + id;
      attributes.WRI_ID = id;
      attributes.isRSPO = false;

      feature = GeoHelper.generatePointGraphicFromGeometric(longitude, latitude, attributes);
      WizardActions.addCustomFeatures([feature]);
      app.map.centerAndZoom(feature.geometry, 7);
      this.resetForm();
      this.close();
    }

  };

  return CoordsModal;

});

/** @jsx React.DOM */
define('components/wizard/NestedList',[
	"react"
], function (React) {

	var ListItem = React.createClass({displayName: "ListItem",

		propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.number.isRequired,
      click: React.PropTypes.func.isRequired,
      filter: React.PropTypes.string.isRequired
    },

    /* jshint ignore:start */
		render: function () {
			var isGroupActive = this.props.activeListGroupValue !== undefined && this.props.activeListGroupValue == this.props.value,
					className;

			// Filter not applied  or filter is applied and there are children who match the filter
			// This means we can't hide the parent or else the children will get hidden as well
			if (this.props.filter === '' || this._searchChildrenForMatches(this.props.children, this.props.filter)) {
				className = isGroupActive ? 'active' : '';
				return (
					React.createElement("div", {className: "wizard-list-item"}, 
						React.createElement("span", {"data-value": this.props.value, "data-type": "group", onClick: this._click, className: className}, this.props.label), 
						this.props.children ? this.props.children.map(this._childrenMapper.bind(this, isGroupActive)) : undefined
					)
				);
			} else {
				// Filter applied, none of the children match, if the root matches, show it, else hide it
				className = 'wizard-list-item' + (this.props.label.toLowerCase().search(this.props.filter) > -1 ? '' : ' hidden') + (isGroupActive ? ' active' : '' );

				return (
					React.createElement("div", {className: className}, 
						React.createElement("span", {"data-value": this.props.value, "data-type": "group", onClick: this._click, className: className}, this.props.label)
					)
				);

			}
		},

		_childrenMapper: function (parentActive, item, index) {

			var label = item.label.toLowerCase(), // Filter is lowercase, make the label lowercase for comparison
					className = 'wizard-list-child-item' + (label.search(this.props.filter) > -1 ? '' : ' hidden');

			if (this.props.activeListItemValues.indexOf(item.value) != -1 || parentActive) {
				className += ' active';
			}

			return (
				React.createElement("div", {className: className, key: index}, 
					React.createElement("span", {"data-value": item.value, "data-type": "individual", onClick: this._click}, item.label)
				)
			);
		},
		/* jshint ignore:end */

		_searchChildrenForMatches: function (children, filter) {
			return children.some(function (child) {
				if (child.label.toLowerCase().search(filter) > -1) {
					return true;
				} else {
					return false;
				}
			});
		},

		_click: function (evt) {
			this.props.click(evt.target);
		}

	});


	function getDefaultState() {
		return {
      filter: ''
    };
	}

	var NestedList = React.createClass({displayName: "NestedList",

    getInitialState: function () {
      return (getDefaultState());
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
      	React.createElement("div", {className: "nested-list"}, 
      		React.createElement("div", {className: 'searchBox relative' + (this.props.data.length > 0 ? '' : ' hidden')}, 
      			React.createElement("div", {className: "nested-list-search-icon"}), 
      			React.createElement("input", {placeholder: this.props.placeholder, type: "text", value: this.state.filter, onChange: this._setFilter})
      		), 
      		React.createElement("div", {className: 'list-container' + (this.state.filter !== '' ? ' filtered' : '')}, 
      			this.props.data.map(this._mapper, this)
      		)
      	)
      );
    },

    _mapper: function (item, index) {
    	return (
    		React.createElement(ListItem, {
    			key: index, 
    			label: item.label || 'No Name', 
    			value: item.value, 
    			click: this.props.click, 
    			children: item.children, 
    			activeListItemValues: this.props.activeListItemValues, 
    			activeListGroupValue: this.props.activeListGroupValue, 
    			filter: this.state.filter}
    		)
    	);
    },
    /* jshint ignore:end */

    _setFilter: function (evt) {
    	this.setState({
    		filter: evt.target.value.toLowerCase()
    	});
    }

  });

return NestedList;

});

/** @jsx React.DOM */
define('components/wizard/MillPoint',[
	"react",
  "map/config",
  "dojo/topic",
  "dojo/query",
  "map/Uploader",
  "dojo/dom-class",
  "dojo/_base/array",
	"dojo/promise/all",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "map/CoordinatesModal",
  "analysis/WizardStore",
  "components/wizard/NestedList",
  "components/featureList/FeatureList"
], function (React, MapConfig, topic, dojoQuery, Uploader, domClass, arrayUtils, all, AnalyzerQuery, AnalyzerConfig, GeoHelper, CoordinatesModal, WizardStore, NestedList, FeatureList) {

  var config = AnalyzerConfig.millPoints;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;

  var getDefaultState = function () {
    return ({
      nestedListData: [],
      activeListItemValues: [],
      selectedCommodity: config.commodityOptions[0].value,
      showCustomFeaturesList: false,
      selectedCustomFeatures: WizardStore.get(KEYS.selectedCustomFeatures),
      customFeatures: getCustomPointFeatures()
    });
  };

  var getCustomPointFeatures = function () {
    var customFeatures = WizardStore.get(KEYS.customFeatures);
    return customFeatures.filter(function (feature) {
      return feature.geometry.type === 'point';
    });
  };

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      previousStep = WizardStore.get(KEYS.userStep);
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      WizardStore.registerCallback(KEYS.customFeatures, this.customFeaturesUpdated);
      WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.selectedCustomFeaturesUpdated);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option5.id;
    },

    customFeaturesUpdated: function () {
      var customFeatures = getCustomPointFeatures();
      this.setState({ customFeatures: customFeatures });
    },

    selectedCustomFeaturesUpdated: function () {
      var selectedCustomFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
      this.setState({ selectedCustomFeatures: selectedCustomFeatures });
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // If they are arriving at this step
      if (selectedAreaOfInterest === 'millPointOption' && currentStep === 2) {
        // Get Data if there is none present
        if (this.state.nestedListData.length === 0) {
          this._loadMillPoints();
        }
      }

      // If they are moving forward through the wizard and end up here
      if (selectedAreaOfInterest === 'millPointOption' && previousStep === 1 && currentStep === 2) {
        // If Mill Points is not visible show it and select it in the UI, otherwise do nothing
        var layer = app.map.getLayer(MapConfig.mill.id);
        if (layer) {
          if (!layer.visible) {
            topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','mill');
						// topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','gfwMill');
          }
        }

        // If this component is appearing in the UI, reset some things and load data if its not available
        // Reset Active List Items for the NestedList
        this.setState({ activeListItemValues: [] });
      }

      previousStep = WizardStore.get(KEYS.userStep);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        React.createElement("div", {className: "mill-point", id: "mill-point"}, 
          /* Custom Toggle Switch, mill-list-toggle-indicator has orange background behind active list option */
          React.createElement("div", {className: "mill-list-options back-light-gray relative"}, 
            React.createElement("div", {className: 'mill-list-toggle-indicator mill-' + (this.state.showCustomFeaturesList ? 'custom-list' : 'known-list')}), 
            React.createElement("div", {className: 'relative select-mill-list-button inline-block ' + (this.state.showCustomFeaturesList ? '' : 'active'), 
                  id: "selectFromList", 
                  onClick:  this.toggleList}, 
              config.selectFromListButton
            ), 
            React.createElement("div", {className: 'relative select-mill-list-button inline-block ' + (this.state.showCustomFeaturesList ? 'active' : ''), 
                  id: "selectFromCustom", 
                  onClick:  this.toggleList}, 
              config.selectFromCustomListButton
            )
          ), 
          /* Render this list when user clicks selectFromList */
          React.createElement("div", {className: this.state.showCustomFeaturesList ? 'hidden' : ''}, 
            React.createElement("p", {className: "instructions"}, config.selectInstructions), 
            React.createElement("div", {className: "select-container"}, 
              React.createElement("select", {id: "mill-select", className: "mill-select", value: this.state.selectedCommodity, onChange: this._loadMillPoints}, 
                 config.commodityOptions.map(this._selectMapper, this) 
              )
            ), 
            React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, " ", config.listInstructions, " "), 
            React.createElement(NestedList, {data: this.state.nestedListData, 
              click: this._millPointSelected, 
              placeholder: "Search mill points...", 
              activeListItemValues: this.state.activeListItemValues, 
              isResetting: this.props.isResetting}
            )
          ), 
          /* Render this list when user clicks upload or enterCoords */
          React.createElement("div", {className: this.state.showCustomFeaturesList ? '' : 'hidden'}, 
            React.createElement("p", {className: "instructions"}, config.instructions), 
            React.createElement("div", {className: "drawing-tools"}, 
              React.createElement("div", {className: "drawing-tool-button", id: "enterCoords", onClick:  this.drawToolClicked}, config.enterCoordinatesButton), 
              React.createElement("div", {className: "drawing-tool-button", id: "upload", onClick:  this.drawToolClicked}, config.uploadButton)
            ), 
            React.createElement(FeatureList, {features: this.state.customFeatures, selectedFeatures: this.state.selectedCustomFeatures, rspoChecks: true, showClear: true})
          )
        )
      );
    },

    _selectMapper: function (item) {
      return React.createElement("option", {value: item.value}, " ", item.label, " ");
    },
    /* jshint ignore:end */

    toggleList: function (evt){
      var nodeClicked = evt.target.id,
          showCustomFeaturesList;

      showCustomFeaturesList = nodeClicked === 'selectFromCustom' ? true : false;

      // If we aren't showing features from the custom list, make sure to hide both dialogs
      // calling close if the dialog is already closed will do nothing
      if (!showCustomFeaturesList) {
        CoordinatesModal.close();
        Uploader.close();
      }

      // if showCustomFeaturesList is a different value from before, update state and clear selection
      if (this.state.showCustomFeaturesList !== showCustomFeaturesList) {
        this.setState({ showCustomFeaturesList: showCustomFeaturesList });
        this._localReset();
      }

    },

    drawToolClicked: function (evt) {
      // Split off the key and save it here as it is the key to which node was clicked
      var id = evt.target.id;

      switch (id) {
        case "enterCoords":
          Uploader.close();
          CoordinatesModal.toggle();
        break;
        case "upload":
          CoordinatesModal.close();
          Uploader.toggle();
        break;
      }

    },

    _loadMillPoints: function () {

      this.setState({ isLoading: true });

      // Show the features on the map
      var self = this;
      AnalyzerQuery.getMillPointData().then(function (data) {
        if (data) {
          self.setState({ nestedListData: data, isLoading: false });
        }
      });

    },

    _millPointSelected: function (target) {
      var featureType = target.getAttribute('data-type'),
          wriId = target.getAttribute('data-value'),
          selectedFeatures = this.state.selectedCustomFeatures,
          newActiveListItemValues,
          wizardGraphicsLayer,
					wizardPointGraphicsLayer,
          self = this,
					millIds = [],
					millLabels = [],
          removeIndex,
          removeId,
          graphic,
          label;

			wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
			wizardPointGraphicsLayer = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
      if (featureType === "group") {
        // Mills dont support group selection
				// debugger
				for (var i = 0; i < this.state.nestedListData.length; i++) {
					if (this.state.nestedListData[i].value === wriId) {
						for (var j = 0; j < this.state.nestedListData[i].children.length; j++) {
							millIds.push(AnalyzerQuery.getMillByWriId(this.state.nestedListData[i].children[j].value));
							millLabels.push(this.state.nestedListData[i].children[j].label);
						}
					}
				}

				all(millIds).then(function (responses) {
					var ids = [];
          for (var k = 0; k < responses.length; k++) {


						var feature = responses[k];

						// label = target.innerText || target.innerHTML;
						label = millLabels[k];

            if ( self.state.activeListItemValues.indexOf(feature.attributes.wri_id) != -1 ) {
              // Remove The Entity Id
              var valueIndex = self.state.activeListItemValues.indexOf(feature.attributes.wri_id);
              newActiveListItemValues = self.state.activeListItemValues.slice(0);
              newActiveListItemValues.splice(valueIndex, 1);
              self.setState( { activeListItemValues: newActiveListItemValues } );
              // Id to remove
              removeId = feature.attributes.OBJECTID;
              // Remove selected feature from features array
              arrayUtils.forEach(selectedFeatures, function (graphic, index) {
                if (removeId === graphic.attributes.OBJECTID) { removeIndex = index; }
              });
              selectedFeatures.splice(removeIndex, 1);
              // Remove the feature from the map
							arrayUtils.some(wizardGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
							arrayUtils.some(wizardPointGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardPointGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
            } else {
              // Add it to the map and make it the current selection, give it a label
							ids.push(feature.attributes.wri_id);
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;

							var pointGraphic = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
              graphic = GeoHelper.preparePointAsPolygon(feature);
              graphic = GeoHelper.applySelectionSymbolToFeature(graphic);
              wizardGraphicsLayer.add(graphic);
							wizardPointGraphicsLayer.add(pointGraphic);

              selectedFeatures.push(graphic);
            }

					}

					// Add Active Class, Add to array or features, and add label to array of labels
					newActiveListItemValues = self.state.activeListItemValues.concat(ids);
					self.setState({ activeListItemValues: newActiveListItemValues });

					// Mark this as your current selection and provide label
					if (selectedFeatures.length > 0) {
						WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
					} else {
						// This resets the current selection to none
						WizardStore.set(KEYS.selectedCustomFeatures, []);
					}

        });

      } else if (wriId) {

        if (wizardGraphicsLayer) {
	  // AnalyzerQuery.getMillByEntityId(wriId).then(function (feature) {
          AnalyzerQuery.getMillByWriId(wriId).then(function (feature) {
            // Get Reference to Parent for showing selected or not selected
            label = target.innerText || target.innerHTML;


            if ( self.state.activeListItemValues.indexOf(wriId) != -1 ) {
              // Remove The Entity Id
              var valueIndex = self.state.activeListItemValues.indexOf(wriId);
              newActiveListItemValues = self.state.activeListItemValues.slice(0);
              newActiveListItemValues.splice(valueIndex, 1);
              self.setState( { activeListItemValues: newActiveListItemValues } );
              // Id to remove
              removeId = feature.attributes.OBJECTID;
              // Remove selected feature from features array
              arrayUtils.forEach(selectedFeatures, function (graphic, index) {
                if (removeId === graphic.attributes.OBJECTID) { removeIndex = index; }
              });
              selectedFeatures.splice(removeIndex, 1);
              // Remove the feature from the map
              arrayUtils.some(wizardGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
							arrayUtils.some(wizardPointGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardPointGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });

            } else {
              // Add it to the map and make it the current selection, give it a label
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
							var pointGraphic = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
              graphic = GeoHelper.preparePointAsPolygon(feature);
              graphic = GeoHelper.applySelectionSymbolToFeature(graphic);
              wizardGraphicsLayer.add(graphic);
							wizardPointGraphicsLayer.add(pointGraphic);
              // Add Active Class, Add to array or features, and add label to array of labels
              newActiveListItemValues = self.state.activeListItemValues.concat([wriId]);
              self.setState({ activeListItemValues: newActiveListItemValues });

              selectedFeatures.push(graphic);
            }

            // Mark this as your current selection and provide label
            if (selectedFeatures.length > 0) {
              WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
            } else {
              // This resets the current selection to none
              WizardStore.set(KEYS.selectedCustomFeatures, []);
            }

          });
        }
      }

    },

    _localReset: function () {
      // Call this to reset the selection list and graphics layer
      var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
			var wizLayerPoints = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
      WizardStore.set(KEYS.selectedCustomFeatures, []);
      wizLayer.clear();
			wizLayerPoints.clear();

      this.setState({ activeListItemValues: [] });
    }

  });

});

/** @jsx React.DOM */
define('components/wizard/AdminUnit',[
	"react",
  "map/config",
  "map/Symbols",
  "map/MapModel",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "actions/WizardActions",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic",
], function (React, MapConfig, Symbols ,MapModel, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.adminUnit;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;
  var previousFeatureType;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: null,
      isLoading: false
    };
  }

	var AdminUnit = React.createClass({displayName: "AdminUnit",

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      MapModel.applyTo('admin-unit');
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      previousStep = WizardStore.get(KEYS.userStep);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option2.id;
    },

    userChangedSteps: function () {
      // If the user is arriving at this step, set up some layer defs to support this component
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      if (selectedAreaOfInterest === 'adminUnitOption' && currentStep === 2) {
        var value = document.getElementById("country-select").value;
        if (value !== "NONE" && previousStep === 1) {
          topic.publish("setAdminBoundariesDefinition", value);
        }
      }

      previousStep = WizardStore.get(KEYS.userStep);

    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        document.getElementById('country-select').value = "NONE";
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        React.createElement("div", {className: "admin-unit", id: "admin-unit"}, 
          React.createElement("p", {className: "instructions"}, " ", config.instructions, " "), 
          React.createElement("div", {className: "select-container"}, 
            React.createElement("select", {
              id: "country-select", 
              className: "country-select", 
              onChange: this._loadAdminUnits, 
              "data-bind": "options: allCountries, optionsText: \"label\", optionsValue: \"value\""}
            ), 
            React.createElement("span", {className: 'loading-wheel' + (this.state.isLoading ? '' : ' hidden')})
          ), 
          React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0) ? '' : ' hidden'}, 
            config.instructionsPartTwo
          ), 
          React.createElement(NestedList, {
            data: this.state.nestedListData, 
            click: this._lowLevelAdminUnitClick, 
            placeholder: "Search administrative units...", 
            activeListItemValues: this.state.activeListItemValues, 
            activeListGroupValue: this.state.activeListGroupValue, 
            isResetting: this.props.isResetting}
          )
        )
      );
    },

    /* jshint ignore:end */

    _loadAdminUnits: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === 'NONE') {
        // Hide the Layer and clear the list
        topic.publish('setAdminBoundariesDefinition');
        this.setState({
          nestedListData: []
        });
        return;
      }
      // Update State and publish method to show the layer on the map
      this.setState({
        isLoading: true
      });

      topic.publish('setAdminBoundariesDefinition', value);

      AnalyzerQuery.getLowLevelAdminUnitData(value).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });

    },

    _lowLevelAdminUnitClick: function (target) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
          objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          label = target.innerText || target.innerHTML,
          activeItems,
          self = this,
          graphic;

      // They cant select features and groups right now
      // so if they swicth, clear the selection list and the layer
      if (featureType !== previousFeatureType) {
        WizardActions.clearSelectedCustomFeatures();
        wizardGraphicsLayer.clear();
      }

      // Update this for bookkeeping
      previousFeatureType = featureType;

      if (featureType === 'group') {

        activeItems = this.state.activeListGroupValue;

        if (activeItems === objectId) {
          WizardActions.removeSelectedFeatureByField(config.countryBoundaries.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.countryBoundaries.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });
        } else {

          // Clear Previous Features
          WizardActions.clearSelectedCustomFeatures();

          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });
          // Clear the layer
          wizardGraphicsLayer.clear();

          // Takes URL and group name, group name will always be the targets innerHTML
          var countrySelect = document.getElementById('country-select').value;

          AnalyzerQuery.getFeaturesByGroupNameAndCountry(config.countryBoundaries, label, countrySelect).then(function (features) {
            if (features && wizardGraphicsLayer) {
              features.forEach(function (feature) {
                // Add it to the map and make it the current selection, give it a label
                feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
                graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
                wizardGraphicsLayer.add(graphic);
              });
              WizardActions.addSelectedFeatures(features);
            }
          });


        }

      } else if (objectId) {


        activeItems = this.state.activeListItemValues;
        var indexOfObject = activeItems.indexOf(objectId);

        if (indexOfObject > -1) {
          activeItems.splice(indexOfObject, 1);
          WizardActions.removeSelectedFeatureByField('OBJECTID', objectId);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, 'OBJECTID', objectId);

          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: undefined
          });
        } else {
          activeItems.push(objectId);
          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: null
          });

          AnalyzerQuery.getFeatureById(config.lowLevelUnitsQuery.url, objectId).then(function (feature) {

            // Add it to the map and make it the current selection, give it a label
            feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
            graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
            WizardActions.addSelectedFeatures([graphic]);

            if (wizardGraphicsLayer) {
              wizardGraphicsLayer.add(graphic);
            }

          });

        } // End else

      } // End else-if

    } // End Function

  });

  return AdminUnit;

});

/** @jsx React.DOM */
define('components/wizard/CustomArea',[
	"react",
  "analysis/config",
  "analysis/WizardStore",
  "esri/graphic",
  "esri/toolbars/draw",
  "dojo/dom",
  "dojo/query",
  "dojo/dom-class",
  "map/config",
  "map/MapModel",
	"map/CoordinatesModal",
  "map/Uploader",
  "map/Symbols",
  "utils/GeoHelper",
  "components/featureList/FeatureList"
], function (React, AnalyzerConfig, WizardStore, Graphic, Draw, dom, dojoQuery, domClass, MapConfig, MapModel, CoordinatesModal, Uploader, Symbols, GeoHelper, FeatureList) {

  var drawToolbar,
      activeTool;

  var KEYS = AnalyzerConfig.STORE_KEYS;

  function getDefaultState() {
    return {
      graphics: WizardStore.get(KEYS.customFeatures),
      selectedGraphics: WizardStore.get(KEYS.selectedCustomFeatures)
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {

      // Create all the Necessary Drawing Tools Here
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);
      // Register Callbacks
      WizardStore.registerCallback(KEYS.customFeatures, this.graphicsListUpdated);

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({selectedGraphics: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      this.setState(getDefaultState());
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option1.id;
    },

    graphicsListUpdated: function () {
      var newGraphicsList = WizardStore.get(KEYS.customFeatures);
      this.setState({ graphics: newGraphicsList });
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        React.createElement("div", {className: "custom-area"}, 
          React.createElement("p", {className: "drawing-instructions"}, " ", AnalyzerConfig.customArea.instructions, " "), 
          React.createElement("div", {className: "drawing-tools"}, 
						React.createElement("div", {className: "drawing-tool-button", id: "draw-coordinates", "data-label": AnalyzerConfig.customArea.customCoordLabel, onClick: this.drawToolClicked}, AnalyzerConfig.customArea.customCoordLabel), 
            React.createElement("div", {className: "drawing-tool-button", id: "draw-freehand", "data-label": AnalyzerConfig.customArea.freehandLabel, onClick: this._activateToolbar}, AnalyzerConfig.customArea.freehandLabel), 
            React.createElement("div", {className: "drawing-tool-button", id: "draw-polygon", "data-label": AnalyzerConfig.customArea.polyLabel, onClick: this._activateToolbar}, AnalyzerConfig.customArea.polyLabel), 
            React.createElement("div", {className: "drawing-tool-button", id: "draw-upload", "data-label": AnalyzerConfig.customArea.uploadLabel, onClick: this.drawToolClicked}, AnalyzerConfig.customArea.uploadLabel)
          ), 
          React.createElement("div", {className: "custom-graphics-list-container"}, 
            React.createElement("p", {className: "drawing-instructions"}, AnalyzerConfig.customArea.instructionsPartTwo), 
            React.createElement(FeatureList, {features: this.state.graphics, selectedFeatures: this.state.selectedGraphics})
          )
        )
      );
    },
    /* jshint ignore:end */

		drawToolClicked: function (evt) {
			// Split off the key and save it here as it is the key to which node was clicked
			var id = evt.target.id;

			switch (id) {
				case "draw-coordinates":
					Uploader.close();
					CoordinatesModal.toggle();
				break;
				case "draw-upload":
					CoordinatesModal.close();
					Uploader.toggle();
				break;
			}

		},

    _activateToolbar: function (evt) {

      // If any other tools are active, remove the active class
      this._removeActiveClass();

      // Hide the Upload tools if visible
      this.setState({ showUploadTools: false });

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === evt.target.id) {
        this._deactivateToolbar();
        return;
      }

      activeTool = evt.target.id;
			var innerText;
			if (evt.target.getAttribute('data-label')) {
				innerText = evt.target.getAttribute('data-label');
			} else if (evt.target.parentElement.getAttribute('data-label')) {
				innerText = evt.target.parentElement.getAttribute('data-label');
			} else {
				innerText = evt.target.parentElement.parentElement.getAttribute('data-label');
			}
      switch (innerText) {
        case AnalyzerConfig.customArea.freehandLabel:
          drawToolbar.activate(Draw.FREEHAND_POLYGON);
        break;
        case AnalyzerConfig.customArea.polyLabel:
          drawToolbar.activate(Draw.POLYGON);
        break;
        default:
        break;
      }

      domClass.add(evt.target, "active");

      // Update the Model so other parts of the application can be aware of this
      MapModel.set('drawToolsEnabled', true);

    },

    _drawComplete: function (evt) {

      this._removeActiveClass();
      this._deactivateToolbar();

      if (!evt.geometry) {
        return;
      }

      // WRI_ID = Unique ID for Drawn Graphics
      var id = GeoHelper.nextCustomFeatureId(),
          attrs = { "WRI_ID": id },
          graphic;

      // Add a Label
      attrs[AnalyzerConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";
      graphic = new Graphic(evt.geometry, Symbols.getPolygonSymbol(), attrs);
      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([graphic]));

    },

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
      MapModel.set('drawToolsEnabled', false);
    },

    _removeActiveClass: function () {
      dojoQuery(".drawing-tools .drawing-tool-button").forEach(function (node) {
        domClass.remove(node, "active");
      });
    },

  });

});

/** @jsx React.DOM */
define('components/wizard/CertifiedArea',[
  "react",
  "map/config",
  "map/Symbols",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "actions/WizardActions",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic"
], function (React, MapConfig, Symbols, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.certifiedArea;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousFeatureType; // Track what kind of feature they are currently selecting
  var previousStep;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: null,
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value,
      selectedScheme: config.certificationOptions[1].value
    };
  }

  return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      previousStep = WizardStore.get(KEYS.userStep);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option4.id;
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // If the user is arriving at this step and has chosen a type and scheme
      if (selectedAreaOfInterest === 'certifiedAreaOption' && 
          this.state.selectedScheme !== 'NONE' && 
          currentStep === 2 && previousStep === 1) {
        
        topic.publish('setCertificationSchemeDefinition', this.state.selectedScheme);

        // If no data has been loaded, do so now that this view is presented to the user
        if (this.state.nestedListData.length === 0) {
          var mockEvt = {
            target: {
              value: config.certificationOptions[1].value
            }
          };
          
          this._loadFeatures(mockEvt);
        }

      }

      previousStep = WizardStore.get(KEYS.userStep);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {

      // Hide legend content pane
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      if (currentStep === 2 && selectedAreaOfInterest === 'certifiedAreaOption') {

        switch (this.state.selectedCommodity) {
          case 'Oil palm concession':
            topic.publish('filterConcessionsLegendItems',2);
            break;
        }

        if (this.state.selectedCommodity === 'NONE') {
          topic.publish('hideConcessionsLegend');
        } else {
          topic.publish('showConcessionsLegend');
        }

      }

      return (
        React.createElement("div", {className: "certified-area"}, 
          React.createElement("p", {className: "instructions"}, " ", config.instructions, " "), 
          React.createElement("select", {className: "commodity-type-select", value: this.state.selectedCommodity, onChange: this._updateCommodity}, 
            config.commodityOptions.map(this._selectMapper, this)
          ), 
          React.createElement("p", {className: "instructions"}, " ", config.instructionsPartTwo, " "), 
          React.createElement("select", {className: "certification-scheme-select", value: this.state.selectedScheme, onChange: this._loadFeatures}, 
            config.certificationOptions.map(this._selectMapper, this)
          ), 
          React.createElement("span", {className: 'loading-wheel' + (this.state.isLoading ? '': ' hidden')}), 
          React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, config.instructionsPartThree), 
          React.createElement(NestedList, {
            data: this.state.nestedListData, 
            click: this._schemeClicked, 
            placeholder: "Search certified areas...", 
            activeListItemValues: this.state.activeListItemValues, 
            activeListGroupValue: this.state.activeListGroupValue, 
            isResetting: this.props.isResetting}
          )
        )
      );
    },

    _selectMapper: function (item) {
      return React.createElement("option", {value: item.value}, item.label);
    },
    /* jshint ignore:end */

    _updateCommodity: function (evt) {
      this.setState({ selectedCommodity: evt.target.value });
    },

    _updateScheme: function (value) {
      // Update the isLoading because when this is updated, we are performing a query
      this.setState({
        selectedScheme: value,
        isLoading: true
      });
    },

    _loadFeatures: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer and clear the list
        topic.publish("setCertificationSchemeDefinition");
        this.setState({
          nestedListData: [],
          selectedScheme: value
        });
        return;
      }

      // Update scheme in state and isLoading
      this._updateScheme(value);

      // Show the features on the map
      topic.publish('setCertificationSchemeDefinition', value);

      AnalyzerQuery.getFeaturesByScheme(value, this.state.selectedCommodity).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });
    },

    _schemeClicked: function (target) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
          objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          label = target.innerText || target.innerHTML,
          activeItems,
          self = this,
          graphic;

      // They cant select features and groups right now
      // so if they swicth, clear the selection list and the layer
      if (featureType !== previousFeatureType) {
        WizardActions.clearSelectedCustomFeatures();
        wizardGraphicsLayer.clear();
      }
      
      // Update this for bookkeeping
      previousFeatureType = featureType;

      if (featureType === "group") {
    
        activeItems = this.state.activeListGroupValue; // Single Id
        // Same group, deselect it by removing it from store, map, and list
        if (activeItems === objectId) {
          WizardActions.removeSelectedFeatureByField(config.groupQuery.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.groupQuery.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });
        } else {
          // Clear Previous Features
          WizardActions.clearSelectedCustomFeatures();
          // Update state
          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });
          // Clear the layer
          wizardGraphicsLayer.clear();

          // Takes URL and group name, group name will always be the targets innerHTML
          AnalyzerQuery.getFeaturesByGroupName(config.groupQuery, label).then(function (features) {
            wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (features && wizardGraphicsLayer) {
              features.forEach(function (feature) {
                // Add it to the map and make it the current selection, give it a label
                feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
                graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
                wizardGraphicsLayer.add(graphic);
              });
              WizardActions.addSelectedFeatures(features);
            }
          });
        }

      } else if (objectId) {

        activeItems = this.state.activeListItemValues;
        var indexOfObject = activeItems.indexOf(objectId);

        // This item is already selected, deselect it by removing it from the store, map, and list
        if (indexOfObject > -1) {
          activeItems.splice(indexOfObject, 1);
          WizardActions.removeSelectedFeatureByField('OBJECTID', objectId);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, 'OBJECTID', objectId);

          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: undefined
          });
        } else {

          activeItems.push(objectId);

          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: null
          });

          AnalyzerQuery.getFeatureById(config.schemeQuery.url, objectId).then(function (feature) {
            // Add it to the map and make it the current selection, give it a label
            feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
            graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
            WizardActions.addSelectedFeatures([graphic]);

            wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (wizardGraphicsLayer) {
              wizardGraphicsLayer.add(graphic);
            }
          });

        } // End else

      }// End else if

    }// End _schemeClicked

  });

});

/** @jsx React.DOM */
define('components/wizard/CommercialEntity',[
	"react",
  "map/config",
  "map/Symbols",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
	"utils/Analytics",
  "analysis/WizardStore",
  "actions/WizardActions",
  "components/wizard/NestedList",
  // Other Useful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic"
], function (React, MapConfig, Symbols, AnalyzerQuery, AnalyzerConfig, GeoHelper, Analytics, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.commercialEntity;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;
  var previousFeatureType;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: undefined,
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      previousStep = WizardStore.get(KEYS.userStep);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option3.id;
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);
      // If the user is arriving at this step and has selected a commoditity type
      if (selectedAreaOfInterest === 'commercialEntityOption' &&
          this.state.selectedCommodity !== 'NONE' &&
          previousStep === 1 && currentStep === 2) {

        topic.publish('setCommercialEntityDefinition', this.state.selectedCommodity);
      }

      previousStep = WizardStore.get(KEYS.userStep);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {

      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // Filter legend content pane or hide
      if (currentStep === 2 && selectedAreaOfInterest === 'commercialEntityOption') {

        switch (this.state.selectedCommodity) {
          case 'Logging concession':
            topic.publish('filterConcessionsLegendItems',0);
            break;
          case 'Mining concession':
            topic.publish('filterConcessionsLegendItems',1);
            break;
          case 'Oil palm concession':
            topic.publish('filterConcessionsLegendItems',2);
            break;
          case 'Wood fiber plantation':
            topic.publish('filterConcessionsLegendItems',3);
            break;
        }

        if (this.state.selectedCommodity === 'NONE') {
          topic.publish('hideConcessionsLegend');
        } else {
          topic.publish('showConcessionsLegend');
        }

      }

      return (
        React.createElement("div", {className: "commercial-entity"}, 
          React.createElement("p", {className: "instructions"}, " ", config.instructions, " "), 
          React.createElement("select", {ref: "commoditySelect", className: "commodity-type-select", value: this.state.selectedCommodity, onChange: this._loadFeatures}, 
            config.commodityOptions.map(this._selectMapper, this)
          ), 
          React.createElement("span", {className: 'loading' + (this.state.isLoading ? '' : ' hidden')}), 
          React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, 
            config.instructionsPartTwo
          ), 
          React.createElement(NestedList, {
            data: this.state.nestedListData, 
            click: this._commodityClicked, 
            placeholder: "Search commercial entities", 
            activeListItemValues: this.state.activeListItemValues, 
            activeListGroupValue: this.state.activeListGroupValue, 
            isResetting: this.props.isResetting}
          )
        )
      );
    },

    _selectMapper: function (item) {
      return React.createElement("option", {value: item.value}, item.label);
    },
    /* jshint ignore:end */

    _loadFeatures: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer and clear the list
        topic.publish("setCommercialEntityDefinition");
        this.setState({
          nestedListData: [],
          selectedCommodity: value
        });
        return;
      }

      this.setState({
        selectedCommodity: value,
        isLoading: true
      });

      // Show the features on the map
      topic.publish('setCommercialEntityDefinition', value);
      AnalyzerQuery.getFeaturesByCommodity(value).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });

			// Send off Analytics
			if (value !== 'NONE') {
				Analytics.sendEvent('Analysis', 'Commodity Type', value);
			}
    },

    _commodityClicked: function (target) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
          objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          // selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          label = target.innerText || target.innerHTML,
          self = this,
          graphic;

      // They cant select features and groups right now
      // so if they swicth, clear the selection list and the layer
      if (previousFeatureType !== featureType) {
        WizardActions.clearSelectedCustomFeatures();
        wizardGraphicsLayer.clear();
      }

      // Update this for bookkeeping purposes
      previousFeatureType = featureType;

      if (featureType === "group") {
        // Do nothing for group with no name since its not an actual group
        if (label === AnalyzerConfig.noNameField) {
          return;
        }

        var activeGroupId = this.state.activeListGroupValue;

        // If the same group is clicked, clear the list, selectedFeatures, and Map Graphics
        if (objectId === activeGroupId) {
          // The name is the inner HTML, the field is the field used for the query
          WizardActions.removeSelectedFeatureByField(config.groupQuery.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.groupQuery.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });

        } else {
          // Clear Previous Features
          WizardActions.clearSelectedCustomFeatures();
          // Set the active group id and make sure individual features are not selected
          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });
          // Clear the layer
          wizardGraphicsLayer.clear();

          AnalyzerQuery.getFeaturesByGroupName(config.groupQuery, label).then(function (features) {
            if (features && wizardGraphicsLayer) {
              features.forEach(function (feature) {
                // Add it to the map and make it the current selection, give it a label
                feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
                graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
                wizardGraphicsLayer.add(graphic);
              });

              WizardActions.addSelectedFeatures(features);
            }
          });
        }

      } else if (objectId) {

        var activeListIds = this.state.activeListItemValues;
        var indexOfObject = activeListIds.indexOf(objectId);

        // If the id already exists, then we should remove it
        if (indexOfObject > -1) {
          // Remove from list, selectedFeatures, and map
          activeListIds.splice(indexOfObject, 1);
          WizardActions.removeSelectedFeatureByField('OBJECTID', objectId);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, 'OBJECTID', objectId);

          self.setState({
            activeListItemValues: activeListIds,
            activeListGroupValue: undefined
          });
        } else {
          // Item not yet selected, so add the ID to the selected list
          activeListIds.push(objectId);

          // Update the state
          self.setState({
            activeListItemValues: activeListIds,
            activeListGroupValue: undefined
          });

          // Get the graphic and add it to the selected features list
          AnalyzerQuery.getFeatureById(config.commodityQuery.url, objectId).then(function (feature) {
            // Add it to the map and make it the current selection
            feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
            graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
            WizardActions.addSelectedFeatures([graphic]);

            // Add the graphic to the map
            if (wizardGraphicsLayer) {
              wizardGraphicsLayer.add(graphic);
            }

          });
        } // End else

      } // End else if

			var select = this.refs.commoditySelect;
			var value = select && select.props && select.props.value;
			//- Send Analytics
			if (value && value !== 'NONE') {
				//- e.g. Analysis, Oil palm concession, PT. Astra Agro Lestari
				Analytics.sendEvent('Analysis', value, label);
			}

    }// End __commodityClicked

  });

});

/** @jsx React.DOM */
define('components/wizard/StepTwo',[
	"react",
  "analysis/config",
  "analysis/WizardStore",
	"map/CoordinatesModal",
  "actions/WizardActions",
  "components/wizard/MillPoint",
  "components/wizard/AdminUnit",
  "components/wizard/CustomArea",
  "components/wizard/CertifiedArea",
  "components/wizard/CommercialEntity"
], function (React, AnalyzerConfig, WizardStore, CoordinatesModal, WizardActions, MillPoint, AdminUnit, CustomArea, CertifiedArea, CommercialEntity) {
  // Variables
  var title = AnalyzerConfig.stepTwo.title,
      // Selection Area Variables
      customArea = AnalyzerConfig.stepTwo.customArea,
      adminUnit = AnalyzerConfig.stepTwo.adminUnit,
      millPoint = AnalyzerConfig.stepTwo.millPoint,
      certArea = AnalyzerConfig.stepTwo.certArea,
      commArea = AnalyzerConfig.stepTwo.commArea,
      labelField = AnalyzerConfig.stepTwo.labelField,
      customTitles = {};

  var KEYS = AnalyzerConfig.STORE_KEYS;

  customTitles[customArea] = 'Create a custom area';
  customTitles[adminUnit] = 'Administrative unit';
  customTitles[millPoint] = 'Mill point';
  customTitles[certArea] = 'Certified area';
  customTitles[commArea] = 'Commercial entity';

  // Helper Functions
	function getCurrentSelectionLabel () {
    var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
    return (currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label; }).join(',') : 'none');
  }

  function getDefaultState() {
    return {
      completed: false,
      currentSelectionLabel: getCurrentSelectionLabel()
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
    },

    analysisAreaUpdated: function () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);

      if (currentFeatures.length > 0) {
        this.setState({
          completed: true,
          currentSelectionLabel: getCurrentSelectionLabel()
        });
      } else {
        this.replaceState(getDefaultState());
      }
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      var selectedArea = WizardStore.get(KEYS.areaOfInterest);
      return (
        React.createElement("div", {className: "step"}, 
          React.createElement("div", {className: "step-body"}, 
            React.createElement("div", {className: "step-title"}, title + ' - ' + customTitles[selectedArea]), 
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== millPoint ? 'hidden' : '')}, 
              React.createElement(MillPoint, React.__spread({},  this.props))
            ), 
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== adminUnit ? 'hidden' : '')}, 
              React.createElement(AdminUnit, React.__spread({},  this.props))
            ), 
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== customArea ? 'hidden' : '')}, 
              React.createElement(CustomArea, React.__spread({},  this.props))
            ), 
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== certArea ? 'hidden' : '')}, 
              React.createElement(CertifiedArea, React.__spread({},  this.props))
            ), 
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== commArea ? 'hidden' : '')}, 
              React.createElement(CommercialEntity, React.__spread({},  this.props))
            )
          ), 
          React.createElement("div", {className: "step-footer"}, 
            React.createElement("div", {className: "selected-analysis-area"}, 
              React.createElement("div", {className: "current-selection-label"}, AnalyzerConfig.stepTwo.currentFeatureText), 
              React.createElement("div", {className: "current-selection", title: this.state.currentSelectionLabel}, this.state.currentSelectionLabel)
            ), 
            React.createElement("div", {onClick: this.checkRequirements, className: 'next-button-container ' + (this.state.completed ? '' : 'disabled')}, 
              React.createElement("span", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },
    /* jshint ignore:end */

    checkRequirements: function () {
      if (this.state.completed) {
        WizardActions.proceedToNextStep();
      }
    }

  });

});

/** @jsx React.DOM */
define('components/wizard/WizardCheckbox',[
  'react',
  'dojo/topic'
], function (React, topic) {

  return React.createClass({

    propTypes: {
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    },
    //
    // getInitialState: function() {
    //   return {
    //     active: this.props.defaultChecked || false
    //     // defaultOff: ['protected', 'plantationsTypeLayer', 'plantationsSpeciesLayer']
    //   };
    // },

    // componentWillReceiveProps: function(newProps) {
    //   if (newProps.isResetting) {
    //     this.replaceState(this.getInitialState());
    //   }
    //   console.log(newProps.checkedFromPopup);
    //   if (newProps.checkedFromPopup === true) {
    //     this.setState({
    //       active: true
    //     });
    //   }
    //   // else if (this.state.defaultOff.indexOf(newProps.value) > -1) {
    //   //   this.setState({
    //   //     active: false
    //   //   });
    //   // }
    // },

    // componentDidUpdate: function(prevProps, prevState) {
    //   if (this.props.change && (prevState.active !== this.state.active)) {
    //     this.props.change(this.props.value);
    //   }
    // },

    /* jshint ignore:start */
    render: function() {
      var className = 'wizard-checkbox' + (this.props.checked ? ' active' : '');

      return (
        React.createElement("div", {className: "wizard-checkbox-container"}, 
          React.createElement("div", {className: className, "data-value": this.props.value}, 
            React.createElement("span", {className: "custom-check", onClick: this.toggle}, 
              React.createElement("span", null)
            ), 
            React.createElement("a", {className: "wizard-checkbox-label", onClick: this.toggle}, this.props.label), 
            
              this.props.noInfoIcon ? null :
              React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}})
            
          )
        )
      );
    },
    /* jshint ignore:end */

    toggle: function() {
      this.props.change(this.props.value);
      // this.setState({ active: !this.state.active });
    },

    showInfo: function() {
      console.log(this.props.value);

      switch (this.props.value) {
        case 'peat':
          this.props.infoDivClass = 'forest-and-land-cover-peat-lands';
          break;
        case 'gladAlerts':
          this.props.infoDivClass = 'forest-change-glad-alerts';
          break;
        case 'plantationsTypeLayer':
          this.props.infoDivClass = 'forest-and-land-cover-plantations';
          break;
        case 'plantationsSpeciesLayer':
          this.props.infoDivClass = 'forest-and-land-cover-plantations';
          break;
        case 'indonesiaMoratorium':
          this.props.infoDivClass = 'land-use-moratorium-areas';
          break;
        case 'prodes':
          this.props.infoDivClass = 'forest-change-prodes-alerts';
          break;
        case 'guyraAlerts':
          this.props.infoDivClass = 'forest-change-gran-chaco';
          break;
        case 'treeDensity':
          this.props.infoDivClass = 'forest-and-land-cover-tree-cover-density';
          break;
        case 'legal':
          this.props.infoDivClass = 'forest-and-land-cover-legal-classifications';
          break;
        case 'protected':
          this.props.infoDivClass = 'conservation-protected-areas';
          break;
        case 'carbon':
          this.props.infoDivClass = 'forest-and-land-cover-carbon-stocks';
          break;
        case 'intact':
          this.props.infoDivClass = 'forest-and-land-cover-intact-forest-landscape';
          break;
        case 'landCoverGlob':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-global';
          break;
        case 'primForest':
          this.props.infoDivClass = 'forest-and-land-cover-primary-forest';
          break;
        case 'biomes':
          this.props.infoDivClass = 'forest-and-land-cover-brazil-biomes';
          break;
        case 'suit':
          this.props.infoDivClass = 'land-use-oil-palm';
          break;
        case 'rspo':
          this.props.infoDivClass = 'land-use-rspo-consessions';
          break;
        case 'landCoverIndo':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-indonesia';
          break;
        case 'landCoverAsia':
          this.props.infoDivClass = 'forest-and-land-cover-land-cover-south-east-asia';
          break;
        case 'treeCoverLoss':
          this.props.infoDivClass = 'forest-change-tree-cover-change';
          break;
      }
      console.log(this.props.infoDivClass);

      if (document.getElementsByClassName(this.props.infoDivClass).length) {
        topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
      } else {
        topic.publish('showInfoPanel', this.props.infoDivClass);
      }

    }

  });

});

/** @jsx React.DOM */
define('components/wizard/StepThree',[
    'react',
    'analysis/config',
    'analysis/WizardStore',
    'components/wizard/WizardCheckbox'
], function (React, AnalyzerConfig, WizardStore, WizardCheckbox) {

    var config = AnalyzerConfig.stepThree;
    var treeClosed = '<use xlink:href="#tree-closed" />';
    var treeOpen = '<use xlink:href="#tree-open" />';
    var cacheArray = [];
    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getDefaultCheckedState() {
      return config.checkboxes.filter(function(item) {
        return item.checked;
      }).map(function(item) {
        return item.value;
      }).concat([config.forestChange.value]);
    }

    function getCurrentSelectionLabel () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
      return (currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label; }).join(',') : 'none');
    }

    /* Helper Functions */
    function getDefaultState() {
      return {
        completed: false,
        optionsExpanded: true,
        forestChangeCategory: true,
        forestChangeCheckbox: getDefaultCheckedState(),
        currentSelectionLabel: getCurrentSelectionLabel()
      };
    }

    return React.createClass({

      getInitialState: function() {
        return getDefaultState();
      },

      componentDidMount: function () {
        WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
        WizardStore.registerCallback(KEYS.areaOfInterest, this.AOIupdated);
        // WizardStore.registerCallback(KEYS.forestChangeCheckbox, this.checkboxesUpdated);
        // WizardStore.set(KEYS.forestChangeCheckbox, this.state.forestChangeCheckbox);
      },

      AOIupdated: function () {
        var aoi = WizardStore.get(KEYS.areaOfInterest);
        var checkedValues = this.state.forestChangeCheckbox.slice();
        config.checkboxes.some(function(checkbox) {
          if(aoi === checkbox.label && checkedValues.indexOf(checkbox.value) === -1) {
            console.log(this);
            checkedValues.push(checkbox.value);
            this.setState({forestChangeCheckbox: checkedValues});
            return true;
          }
        }, this);
      },

      analysisAreaUpdated: function () {
        this.setState({ currentSelectionLabel: getCurrentSelectionLabel() });
      },

      toggleOptions: function () { //todo: toggle these open (or not) on analysis via popup!
        this.setState({ optionsExpanded: !this.state.optionsExpanded });
      },

      // checkboxesUpdated: function () { //todo: toggle these open (or not) on analysis via popup!
      //   // var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
      //   this.setState({ forestChangeCheckbox: WizardStore.get(KEYS.forestChangeCheckbox) });
      // },

      componentDidUpdate: function () {
        // var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        var currentStep = WizardStore.get(KEYS.userStep);

        // if (selectedAreaOfInterest !== 'millPointOption' &&
        if (currentStep === 3) {
          // Recheck requirements and update state if necessary
          this._selectionMade();
        }
      },

      componentWillReceiveProps: function(newProps) {
        if (newProps.isResetting) {
          this.replaceState(getDefaultState());
        }
      },

      shouldComponentUpdate: function () {
        // Should Only Rerender if we are on this step, dont rerender if this is not visible
        return WizardStore.get(KEYS.userStep) === 3;
      },

      // resetForestChange: function() {
      //   this.setState({forestChangeCheckbox: getDefaultCheckedState()});
      // },

      /* jshint ignore:start */
      render: function() {
        var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
        var optionsExpanded = this.state.optionsExpanded;
        var checkedValues = this.state.forestChangeCheckbox;
        var hasPoints = selectedFeatures.length > 0 && selectedFeatures.some(function (feature) {
          return feature.geometry.type === 'point';
        });

        //<span onClick={this.toggleOptions} className={`analysis-expander ${this.state.optionsExpanded ? 'open' : 'closed'}`}></span>
        return (
          React.createElement("div", {className: "step select-analysis"}, 
            React.createElement("div", {className: "step-body"}, 
              React.createElement("div", {className: "step-three-top"}, 
                React.createElement("div", {className: "step-title"}, config.title), 
                /* Show this Only If Mill Point Analysis is Being Done */
                
                  selectedAreaOfInterest === config.millPoint || selectedAreaOfInterest === config.customArea ?
                    this.createPointContent(hasPoints) :
                    null, 
                
                React.createElement("div", {className: "relative forestChange-description"}, 
                  React.createElement(WizardCheckbox, {onClick: this.toggleOptions, value: config.forestChange.value, checked: checkedValues.indexOf(config.forestChange.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, label: config.forestChange.label, noInfoIcon: true}), 
                  React.createElement("svg", {onClick: this.toggleOptions, className: ("analysis-expander " + (optionsExpanded ? 'open' : 'closed')), dangerouslySetInnerHTML: { __html: optionsExpanded ? treeOpen : treeClosed}}), 
                  React.createElement("p", {className: "forest-options-text layer-description"}, "Choose layers here")
                ), 
                React.createElement("p", {className: "layer-description"}, config.forestChange.description), 
                React.createElement("div", {className: ("checkbox-list " + (optionsExpanded === false ? 'transition-hidden' : ''))}, 
                  React.createElement("div", null, 
                    config.checkboxes.map(this._mapper, this)
                  )
                ), 

                React.createElement(WizardCheckbox, {label: config.suit.label, value: config.suit.value, checked: checkedValues.indexOf(config.suit.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                React.createElement("p", {className: "layer-description"}, config.suit.description), 
                React.createElement(WizardCheckbox, {label: config.rspo.label, value: config.rspo.value, checked: checkedValues.indexOf(config.rspo.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                React.createElement("p", {className: "layer-description"}, config.rspo.description), 
                React.createElement("div", {className: selectedAreaOfInterest === 'millPointOption' || selectedAreaOfInterest === 'commercialEntityOption' ? '' : 'hidden', 
                  style: { 'position': 'relative'}
                }, 
                React.createElement(WizardCheckbox, {label: config.mill.label, value: config.mill.value, checked: checkedValues.indexOf(config.mill.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                React.createElement("p", {className: "layer-description"}, config.mill.description)
                )
              )
            ), 
            React.createElement("div", {className: "step-footer"}, 
              React.createElement("div", {className: "selected-analysis-area"}, 
                React.createElement("div", {className: "current-selection-label"}, AnalyzerConfig.stepTwo.currentFeatureText), 
                React.createElement("div", {className: "current-selection", title: this.state.currentSelectionLabel}, this.state.currentSelectionLabel)
              ), 
              React.createElement("div", {onClick: this._proceed, className: 'next-button-container ' + (this.state.completed ? '' : 'disabled')}, 
                React.createElement("span", {className: "next-button"}, "Perform Analysis")
              )
            )
          )
        );
      },

      _mapper: function(item) {
        var checkedValues = this.state.forestChangeCheckbox;

        return React.createElement(WizardCheckbox, {
          label: item.label, 
          value: item.value, 
          change: this._selectionMade, 
          isResetting: this.props.isResetting, // Pass Down so Components receive the reset command
          checked: checkedValues.indexOf(item.value) > -1, 
          noInfoIcon: item.noInfoIcon || false}
        );
      },

      createPointContent: function (hasPoints) {

        var isCustomArea = WizardStore.get(KEYS.areaOfInterest) === config.customArea;

        var options = config.pointRadiusOptions.map(function (option) {
          return React.createElement("option", {value: option.value}, option.label);
        });

        // If it has points, render a select to choose a buffer radius
        // If it does not have points but it is custom features, user used Create Custom Area and
        // is analyzing polygons, so show nothing, otherwise, show little description

        return (!hasPoints && isCustomArea ? null : React.createElement("p", {className: "sub-title"}, config.knownMillsDisclaimer));

        // return (hasPoints ?
        //   <div className='point-radius-select-container'>
        //       <span className='instructions'>{config.pointRadiusDescription}</span>
        //       <select ref='pointRadiusSelect' className='point-radius-select'>{options}</select>
        //   </div> :
        //     isCustomArea ? null : <p className='sub-title'>{config.knownMillsDisclaimer}</p>
        // );
      },

      /* jshint ignore:end */

      _selectionMade: function(checkboxValue) {
        var a = this.state.forestChangeCheckbox.slice();

        if(checkboxValue && checkboxValue === config.forestChange.value) {
          this.toggleFca(a.indexOf(checkboxValue) > -1);
        } else if(checkboxValue){
          var index = a.indexOf(checkboxValue);

          if(index > -1) {
            a.splice(index, 1);
          } else {
            a.push(checkboxValue);
          }
          this.setState({forestChangeCheckbox: a});
        }
        var completed = this._checkRequirements();
        let oldCompleted = this.state.completed;
        if (oldCompleted !== completed) {
          this.setState({ completed: completed });
        }
      },

      toggleFca: function(currentChecked) {
        var checkedValues = this.state.forestChangeCheckbox.slice();
        if(!currentChecked){
          checkedValues = checkedValues.concat(cacheArray);
          checkedValues.push(config.forestChange.value);
        } else {
          cacheArray = [];
          config.checkboxes.forEach(function(item) {
            if(checkedValues.indexOf(item.value) > -1) {
              cacheArray.push(item.value);
            }
          });
          cacheArray.forEach(function(value) {
            checkedValues.splice(checkedValues.indexOf(value), 1);
          });
          checkedValues.splice(checkedValues.indexOf(config.forestChange.value), 1);
        }
        this.setState({forestChangeCheckbox: checkedValues});
      },

      checkedOverride: function(itemLabel) {
        var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        // var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
        if (selectedAreaOfInterest === itemLabel) {
          return true;
        } else {
          return false;
        }
      },

      _checkRequirements: function() {
        var result = false,
          nodes = document.querySelectorAll('.select-analysis .wizard-checkbox.active');
          // selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
          // value;

        // Conditions
        // At least One item must be checked
        // If more than one item is checked, we pass
        if (nodes.length > 0) {
          // if (nodes.length > 1) {
          result = true;
          // } else {
          //     // nodes === 1
          //     value = nodes[0].dataset ? nodes[0].dataset.value : nodes[0].getAttribute('data-value');
          //     // if (selectedAreaOfInterest !== 'millPointOption' && value === 'mill') {
          //     //     // This Fails, result is already false so do nothing
          //     // } else {
          //         result = true;
          //     // }
          // } // millPoint is back in as a viable Analysis Layer, hence the check removal
        }

        return result;
      },

      _getPayload: function() {
        var nodes = document.querySelectorAll('.select-analysis .wizard-checkbox'),
          selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
          payload = {},
          value;

        Array.prototype.forEach.call(nodes, function(node) {
          value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
          if (selectedAreaOfInterest !== 'millPointOption' && value === 'mill') {
            // Dont add mills unless millPointOption is the selectedArea
          } else {
            payload[value] = (node.className.search('active') > -1);
          }
        });

        return payload;
      },

      _proceed: function() {
        if (this.state.completed) {
          var payload = this._getPayload();
          WizardStore.set(KEYS.analysisSets, payload);
          // Get the Radius and set it to the store if it exists
          // var pointRadiusSelect = this.refs.pointRadiusSelect;
          // if (pointRadiusSelect) {
          //   var radius = pointRadiusSelect.getDOMNode().value;
          //   WizardStore.set(KEYS.analysisPointRadius, radius);
          // }
          this.props.callback.performAnalysis();
          //- Send off analytics for Commercial Entity If they picked that.
        }
      }
    });

});

/** @jsx React.DOM */
define('components/wizard/Intro',[
  "react",
  "analysis/config",
  "actions/WizardActions"
], function (React, AnalyzerConfig, WizardActions) {

  // Variables
  var config = AnalyzerConfig.intro;

  return React.createClass({
    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "step"}, 
          React.createElement("div", {className: "step-body"}, 
            React.createElement("div", {className: "step-title"}, config.title), 
            React.createElement("div", {className: "step-one-main-description"}, 
              React.createElement("p", null, config.beginningText), 
              React.createElement("ul", null, 
                config.firstList.map(this._listMapper)
              ), 
              React.createElement("p", null, config.secondaryText), 
              React.createElement("ul", null, 
                config.secondList.map(this._listMapper)
              )
            )
          ), 
          React.createElement("div", {className: "step-footer"}, 
            React.createElement("div", {className: "next-button-container", onClick: WizardActions.proceedToNextStep}, 
              React.createElement("div", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },

    _listMapper: function (item) {
        return React.createElement("li", null, item);
    }
    /* jshint ignore:end */

  });

});

define('map/LayerController',[

    "map/config",
    "map/MapModel",
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "dojo/_base/array",
    "utils/Hasher",
    "utils/Analytics",
    "esri/InfoTemplate",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/layers/RasterFunction",
    "esri/layers/LayerDrawingOptions"
], function (MapConfig, MapModel, on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, Hasher, Analytics, InfoTemplate, Graphic, graphicsUtils, esriQuery, QueryTask, RasterFunction, LayerDrawingOptions) {

    return {

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show or hide layers
        toggleLayers: function(layerConfig) {
          var layer = app.map.getLayer(layerConfig.id);
          // The WDPA or pal layer has a helper layer it needs to manage
          // offload that functionality to a different function
          if (layerConfig.id === MapConfig.pal.id) {
              this.updateZoomDependentLayer(layerConfig, MapConfig.palHelper, 6);
              return;
          }

          if (layerConfig.id === MapConfig.gain.id) {
              this.updateZoomDependentLayer(layerConfig, MapConfig.gainHelper, 13);
              return;
          }

          // For the customSuitability Layer, It has to make a request to the server for a url for the image
          // and then load the image, show a loading wheel as this can be slow at times
          if (layerConfig.id === MapConfig.suit.id) {
              this.showSuitabilityLoader();
              // We also want to track this layer and not a lot of others for now
              var message = 'User toggled Custom Suitabiltiy Layer ' + (layer.visible ? 'off.' : 'on.');
              Analytics.sendEvent('Event', 'Layer', message);
          }
          if (layer) {
              layer.setVisibility(!layer.visible);
              this.refreshLegendWidget();
          }
        },

        // Called From Delegator or internally, props is coming from a click event on the layer UI.
        // Can see the props in MapConfig.layerUI
        // This function should update dynamic layers but is called from checkboxes in the UI
        // and not radio buttons, which is why it has it's own function and cannot use updateDynamicLayer,
        // This queries other checkboxes in the same layer to find out which needs to be added to visible layers
        updateLayer: function(props) {
            var conf = MapConfig[props.id],
                layer = app.map.getLayer(conf.id),
                queryClass = props.filter,
                visibleLayers = [],
                itemLayer,
                itemConf,
                status,
                value;

            dojoQuery('.gfw .filter-list .' + queryClass).forEach(function(node) {
                itemLayer = node.dataset ? node.dataset.layer : node.getAttribute('data-layer');
                itemConf = MapConfig[itemLayer];
                if (itemConf) {

                    if (itemConf.id === layer.id && domClass.contains(node, 'active')) {
                        visibleLayers.push(itemConf.layerId);
                    }
                }
            });

            if (layer) {

                if (visibleLayers.length > 0) {
                    layer.setVisibleLayers(visibleLayers);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }

            // If layer is a mill point, update definition query
            if (conf.layerId == '27') {
                var millChecked = domClass.contains(dom.byId('mill_checkbox').parentElement, 'active'),
                    gfwMillChecked = domClass.contains(dom.byId('gfwMill_checkbox').parentElement, 'active'),
                    layerDefinitions = [],
                    definitionQueries = [];

                if (millChecked) {definitionQueries.push(MapConfig.mill.query);}
                if (gfwMillChecked) {definitionQueries.push(MapConfig.gfwMill.query);}

                layerDefinitions[27] = definitionQueries.join(' OR ');
                app.map.getLayer(conf.id).setLayerDefinitions(layerDefinitions);
                app.map.getLayer(conf.id).refresh();
            }

            // We only want to apply analytics to a few layers for now, catch those here
            // As they add more layers we can find a better way to catch this, possibly higher
            // up in the callstack so one function can catch all and this becomes less messy
            // may also want to add descriptive content to layer config
            status = arrayUtils.indexOf(visibleLayers, conf.layerId) > -1 ? 'on.' : 'off.';

            switch (conf) {
              case MapConfig.oilPerm:
                value = 'User toggled Oil Palm Concessions layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
              case MapConfig.rspoPerm:
                value = 'User toggled RSPO Oil Palm Concessions layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
              case MapConfig.mill:
                value = 'User toggled RSPO Mills layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
            }

        },
        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show layers

        showLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layerConfig.layerId !== undefined) {
                this.updateDynamicLayer(layerConfig);
                return;
            }

            if (layer) {
                if (!layer.visible) {
                    layer.show();
                    this.refreshLegendWidget();
                }
            }
        },

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only hide layers, helper for hiding children
        hideLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);

            if (layer) {
                if (layer.visible) {
                    if (layer.visibleLayers) {
                        if (layer.visibleLayers.length > 1 && layerConfig.layerId) {
                            var index = layer.visibleLayers.indexOf(layerConfig.layerId);
                            layer.visibleLayers.splice(index, 1);
                            layer.setVisibleLayers(layer.visibleLayers);
                        } else {
                            layer.hide();
                        }
                    } else {
                        layer.hide();
                    }


                    this.refreshLegendWidget();
                }
            }
        },

        // Updates a dynamic layer controlled by a radio button so it simply changes the visible layers
        // to the one tied to the radio button, no need to have multiple sublayers turned on, if you do need
        // that, look at updateLayer function instead or create a new one as that one is tied to the checkboxes
        updateDynamicLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id),
                visibleLayers = [];
            if (layer) {
                visibleLayers.push(layerConfig.layerId);
                layer.setVisibleLayers(visibleLayers);
                layer.show();
                this.refreshLegendWidget();
            }
        },

        parseDate: function (str) {
          var mdy = str.split('/');
          return new Date(mdy[2], mdy[0] - 1, mdy[1]);
        },

        daydiff: function (first, second) {
          return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
        },

        isLeapYear: function (year) {
          if((year & 3) !== 0) {
              return false;
          }
          return ((year % 100) !== 0 || (year % 400) === 0);
        },

        updateGuyraDates: function(clauseArray) {
          var start = clauseArray[0];
          var end = clauseArray[1];

          var guyraLayer = app.map.getLayer('granChaco');
          var layerDefs = [];
          var where = "date >= '" + start.toDateString() + "' AND date <= '" + end.toDateString() + "'";
          layerDefs[0] = where;
          guyraLayer.setLayerDefinitions(layerDefs);
        },

        updateGladDates: function(clauseArray) {
          var gladLayer = app.map.getLayer('gladAlerts');

          var otherDateStart = new Date(clauseArray[0]);
          var monthStart = otherDateStart.getMonth();
          var yearStart = otherDateStart.getFullYear();
          var janOneStart = new Date(yearStart + ' 01 01');
          var origDateStart = window.Kalendae.moment(janOneStart).format('M/D/YYYY');

          var julianStart = this.daydiff(this.parseDate(origDateStart), this.parseDate(clauseArray[0]));

          if (monthStart > 1 && this.isLeapYear(yearStart)) {
            julianStart++;
          }

          var otherDateEnd = new Date(clauseArray[1]);
          var monthEnd = otherDateEnd.getMonth();
          var yearEnd = otherDateEnd.getFullYear();
          var janOneEnd = new Date(yearEnd + ' 01 01');
          var origDateEnd = window.Kalendae.moment(janOneEnd).format('M/D/YYYY');

          var julianEnd = this.daydiff(this.parseDate(origDateEnd), this.parseDate(clauseArray[1]));

          if (monthEnd > 1 && this.isLeapYear(yearEnd)) {
            julianEnd++;
          }

          var inputStartRanges = [];
          var inputEndRanges = [];

          if (yearStart === 2015 && yearEnd === 2015) {
            inputStartRanges = [0, julianStart, julianStart, julianEnd, julianEnd, 366];
            inputEndRanges = [0, 367, 367, 367, 367, 367];
          } else if (yearStart === 2016 && yearEnd === 2016) {
            inputStartRanges = [0, 367, 367, 367, 367, 367];
            inputEndRanges = [0, julianStart, julianStart, julianEnd, julianEnd, 366];
          } else if (yearStart === 2015 && yearEnd === 2016) {
            inputStartRanges = [0, julianStart, julianStart, 366, 366, 366];
            inputEndRanges = [0, 0, 0, julianEnd, julianEnd, 366];
          } else {
            return;
          }

          if (gladLayer) {
            var rasterF = new RasterFunction({
              'rasterFunction': 'Colormap',
              'rasterFunctionArguments': {
                'Colormap': [
                  [1, 255, 102, 153]
                ],
                'Raster': {
                  'rasterFunction': 'Local',
                  'rasterFunctionArguments': {
                    'Operation': 67, //max value; ignores no data
                    'Rasters': [{
                      'rasterFunction': 'Remap',
                      'rasterFunctionArguments': {
                        'InputRanges': inputStartRanges,
                        'OutputValues': [0, 1, 0],
                        'Raster': '$1', //2015
                        'AllowUnmatched': false
                      }
                    }, {
                      'rasterFunction': 'Remap',
                      'rasterFunctionArguments': {
                        'InputRanges': inputEndRanges,
                        'OutputValues': [0, 1, 0],
                        'Raster': '$2', //2016
                        'AllowUnmatched': false
                      }
                    }]
                  }
                }
              }
            });

            gladLayer.setRenderingRule(rasterF);
          }
        },

        setWizardDynamicLayerDefinition: function(config, filter) {
            var layer = app.map.getLayer(config.id),
                layerDefs = [],
                where;

            if (layer) {
                if (filter !== undefined) {
                    where = config.whereField + " = '" + filter + "'";
                    layerDefs[config.layerId] = where;
                    layer.setVisibleLayers([config.layerId], true);
                    layer.setLayerDefinitions(layerDefs);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }
        },

        setWizardMillPointsLayerDefinition: function(config) {
            // Option for Layer Definitions will come soon,
            // for now, just toggle the layer
            var layer = app.map.getLayer(config.id);
            if (layer) {
                if (layer.visible) {
                    layer.hide();
                } else {
                    layer.show();
                }
            }
        },

        setFiresLayerDefinition: function(filter, highConfidence) {
            var time = new Date(),
                layerDefs = [],
                visibleLayers,
                dateString,
                layer,
                where;

            layer = app.map.getLayer(MapConfig.fires.id);

            // 1*filter essentially casts as a number
            time.setDate(time.getDate() - (1 * filter));

            dateString = time.getFullYear() + "-" +
                (time.getMonth() + 1) + "-" +
                time.getDate() + " " + time.getHours() + ":" +
                time.getMinutes() + ":" + time.getSeconds();

            // Set up Layer defs based on the filter value, if filter = 7, just set where to 1 = 1
            where = (filter !== "7" ? "ACQ_DATE > date '" + dateString + "'" : "1 = 1");
            for (var i = 0, length = MapConfig.fires.defaultLayers.length; i < length; i++) {
                layerDefs[i] = where;
            }

            if (layer) {
                // Set up and update Visible Layers if they need to be updated
                visibleLayers = (highConfidence ? [0, 1] : [0, 1, 2, 3]);
                if (layer.visibleLayers.length !== visibleLayers.length) {
                    layer.setVisibleLayers(visibleLayers);
                }

                layer.setLayerDefinitions(layerDefs);
                this.refreshLegendWidget();
            }
        },

        setOverlaysVisibleLayers: function() {
            var visibleLayers = [],
                layer,
                key;

            for (var key in app.map._simpleLegends) {
                app.map._simpleLegends[key].hide();
            }

            // Layer Ids are in the config, the key to the config file is under the data-layer attribute of the elements
            dojoQuery(".gfw .overlays-container .overlays-checkbox.selected").forEach(function(node) {
                key = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
                visibleLayers.push(MapConfig[key].layerId);
                if (app.map._simpleLegends[key]) app.map._simpleLegends[key].show();
            });

            layer = app.map.getLayer(MapConfig.overlays.id);
            if (layer) {
                if (visibleLayers.length === 0) {
                    visibleLayers.push(-1);
                    layer.hide();
                } else {
                    layer.show();
                }
                layer.setVisibleLayers(visibleLayers);
                this.refreshLegendWidget();
            }

        },

        updateLossImageServiceRasterFunction: function(values, layerConfig, densityRange) {

            var layer = app.map.getLayer(layerConfig.id),
                outRange = [1],
                rasterFunction,
                range;

            if (layer) {
                // range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
                range = [values[0] + 2001, values[1] + 2001];
                rasterFunction = this.getColormapLossRasterFunction(layerConfig.colormap, range, outRange, densityRange);
                layer.setRenderingRule(rasterFunction);
            }

        },

        updateImageServiceRasterFunction: function(values, layerConfig) {

            var layer = app.map.getLayer(layerConfig.id),
                outRange = [1],
                rasterFunction,
                range;

            if (layer) {
              // For Forma updates, if its a single range, we need to remap 1 to 0
              // Values in slider are from a 0 based index, the range starts at 1
              // so we need to shift the values by 1 to have correct range
              // Also the rule is [inclusive, exclusive], so if values are 3,3 use 4,4
              // if they are 3,4 then use 4,6
              if (layerConfig.id === 'FormaAlerts') {
                  var finalValue = (values[0] === values[1] ? values[1] + 1 : values[1] + 2);
                  range = [1, 1, values[0] + 1, finalValue];
                  outRange = [0, 1];
              } else if (layerConfig.id === 'gladAlerts') {
                // debugger
              } else {
                  range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
              }

              rasterFunction = this.getColormapRasterFunction(layerConfig.colormap, range, outRange);
              layer.setRenderingRule(rasterFunction);

            }
        },

        updateTCDRenderingRule: function (newInputValue) {
          var config = MapConfig.tcd,
              colormap = config.colormap,
              output = config.outputValue,
              input = [newInputValue, 101],
              layer;

          layer = app.map.getLayer(config.id);

          if (layer) {
            layer.setRenderingRule(this.getColormapRasterFunction(colormap, input, output));
          }

        },

        getColormapLossRasterFunction: function(colormap, range, outRange, densityRange) {
            return new RasterFunction({
                // 'rasterFunction': 'Colormap',
                // 'rasterFunctionArguments': {
                //     'Colormap': colormap,
                //     'Raster': {
                //         'rasterFunction': 'ForestCover_lossyear_density',
                //         'rasterFunctionArguments': {
                //             'min_year': range[0],
                //             'max_year': range[1],
                //             'min_density': densityRange[0],
                //             'max_density': densityRange[1]
                //         }
                //     }
                // },
                // 'variableName': 'Raster'
                'rasterFunction': 'ForestCover_lossyear_density',
                'rasterFunctionArguments': {
                    'min_year': range[0],
                    'max_year': range[1],
                    'min_density': densityRange[0],
                    'max_density': densityRange[1]
                }
            });
        },

        getColormapRasterFunction: function(colormap, range, outRange) {

            return new RasterFunction({
                'rasterFunction': 'Colormap',
                'rasterFunctionArguments': {
                    'Colormap': colormap,
                    'Raster': {
                        'rasterFunction': 'Remap',
                        'rasterFunctionArguments': {
                            'InputRanges': range,
                            'OutputValues': outRange,
                            'AllowUnmatched': false
                        }
                    }
                },
                'variableName': 'Raster'
            });
        },

        updateCustomSuitabilityLayer: function(value, dispatcher) {

            var customLayer = app.map.getLayer(MapConfig.suit.id),
                settings = MapModel.get('suitabilitySettings'),
                activeCheckboxes = [];

            switch (dispatcher) {
                case 'peat-depth-slider':
                    settings.computeBinaryRaster[1].values = this._prepareSuitabilityJSON(0, value);
                    break;
                case 'conservation-area-slider':
                    settings.computeBinaryRaster[3].values = value;
                    break;
                case 'water-resource-slider':
                    settings.computeBinaryRaster[4].values = value;
                    break;
                case 'slope-slider':
                    settings.computeBinaryRaster[2].values = value;
                    break;
                case 'elevation-slider':
                    settings.computeBinaryRaster[5].values = value;
                    break;
                case 'rainfall-slider':
                    settings.computeBinaryRaster[6].values = parseInt(value[0]) + "," + parseInt(value[1]);
                    break;
                case 'soil-drainage-slider':
                    settings.computeBinaryRaster[7].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'soil-depth-slider':
                    settings.computeBinaryRaster[8].values = this._prepareSuitabilityJSON(value, 7, [99]);
                    break;
                case 'soil-acid-slider':
                    settings.computeBinaryRaster[9].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'landcover-checkbox':
                    // Push in all Active Checkboxes values
                    // Need to include Cloud as Suitable, its ID is 11
                    activeCheckboxes.push('11');
                    dojoQuery('#environmental-criteria .suitable-checkbox input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    settings.computeBinaryRaster[0].values = activeCheckboxes.join(",");
                    break;
                case 'soil-type-checkbox':
                    // Need to include default values to represent unknown values
                    activeCheckboxes.push('0');
                    activeCheckboxes.push('6');
                    // Push in all other Active Checkboxes values
                    dojoQuery('#environmental-criteria .suitable-checkbox-soil input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    //console.log("****************** soil type checkboxes: " + activeCheckboxes.toString());
                    settings.computeBinaryRaster[10].values = activeCheckboxes.join(",");
                    break;
            }


            MapModel.set('suitabilitySettings', settings);

            if (customLayer) {
                customLayer.refresh();
                this.showSuitabilityLoader();
            }

        },

        showSuitabilityLoader: function() {
            domClass.remove('suitability_loader', 'hidden');
        },

        hideSuitabilityLoader: function() {
            domClass.add('suitability_loader', 'hidden');
        },

        checkZoomDependentLayers: function(evt) {
            var protectedAreaConfig = MapConfig.pal,
                protectedAreaHelperConfig = MapConfig.palHelper,
                gainLayerConfig = MapConfig.gain,
                gainHelperConfig = MapConfig.gainHelper;

            this.toggleZoomDependentLayer(evt, protectedAreaConfig, protectedAreaHelperConfig, 6);
            this.toggleZoomDependentLayer(evt, gainLayerConfig, gainHelperConfig, 13);
        },

        toggleZoomDependentLayer: function(evt, tiledConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(tiledConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (!mainLayer.visible && !helperLayer.visible) {
                return;
            }

            if (app.map.getLevel() > level) {
                helperLayer.show();
                mainLayer.hide();
            } else {
                helperLayer.hide();
                mainLayer.show();
            }

        },

        updateZoomDependentLayer: function(layerConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(layerConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (mainLayer.visible || helperLayer.visible) {
                helperLayer.hide();
                mainLayer.hide();
            } else {
                if (app.map.getLevel() > level) {
                    helperLayer.show();
                } else {
                    mainLayer.show();
                }
            }

            this.refreshLegendWidget();

        },

        refreshLegendWidget: function() {
            var legendLayer = app.map.getLayer(MapConfig.legendLayer.id),
                densityConf = MapConfig.tcd,
                formaConf = MapConfig.forma,
                gladConf = MapConfig.gladAlerts,
                lossConf = MapConfig.loss,
                gainConf = MapConfig.gain,
                prodesConf = MapConfig.prodes,
                biomassConf = MapConfig.tfcs,
                primForConf = MapConfig.primForest,
                suitConf = MapConfig.suit,
                confItems = [densityConf, formaConf, gladConf, lossConf, gainConf, prodesConf, biomassConf, primForConf, suitConf],
                visibleLayers = [],
                layerOptions = [],
                layer,
                self = this;

            // Check Tree Cover Density, Tree Cover Loss, Tree Cover Gain, GLAD, and FORMA Alerts visibility,
            // If they are visible, show them in the legend by adding their ids to visibleLayers.
            // Make sure to set layer drawing options for those values so they do not display
            // over their ImageService counterparts

            ldos = new LayerDrawingOptions();
            ldos.transparency = 100;

            arrayUtils.forEach(confItems, function(item) {
                layer = app.map.getLayer(item.id);
                if (layer) {
                    if (layer.visible) {
                        visibleLayers.push(item.legendLayerId);
                        layerOptions[item.legendLayerId] = ldos;
                    }
                }
            });

            if (visibleLayers.length > 0) {
                legendLayer.setVisibleLayers(visibleLayers);
                legendLayer.setLayerDrawingOptions(layerOptions);
                if (!legendLayer.visible) {
                    legendLayer.show();
                }
            } else {
                legendLayer.hide();
            }
            registry.byId("legend").refresh();
        },

        changeLayerTransparency: function(layerConfig, layerType, transparency) {
            switch (layerType) {
                case "image":
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
                case "dynamic":
                    this.setDynamicLayerTransparency(layerConfig, transparency);
                    break;
                case "tiled":
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
            }
        },

        setLayerOpacity: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layer) {
                layer.setOpacity(transparency / 100);
            } else {
                return;
            }
            // Protected Areas Layer has a helper dynamic layer to show closer then zoom level 6
            // So if we are setting transparency for Protected Areas, pass the helper config on to
            // the Set Dynamic Layer Transparency function
            if (layer.id === 'ProtectedAreas') {
                this.setDynamicLayerTransparency(MapConfig.palHelper, transparency);
            }
            if (layer.id === 'Gain') {
                this.setLayerOpacity(MapConfig.gainHelper, transparency);
            }
        },

        setDynamicLayerTransparency: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id),
                layerOptions,
                ldos;

            if (!layer) {
                // If the layer is invalid or missing, just return
                return;
            }

            ldos = new LayerDrawingOptions();
            // 100 is fully transparent, our sliders show 0 as transparent and 100 as opaque
            // Need to flip my transparency value around
            ldos.transparency = 100 - transparency;

            // If layer has layer drawing options, dont overwrite all of them, append to them or overwrite
            // only the relevant layer id
            layerOptions = layer.layerDrawingOptions || [];
            if (layerConfig.layerId !== undefined) {
                layerOptions[layerConfig.layerId] = ldos;

            } else if (layerConfig.defaultLayers) {
                arrayUtils.forEach(layerConfig.defaultLayers, function(layerId) {
                    layerOptions[layerId] = ldos;
                });
            }

            layer.setLayerDrawingOptions(layerOptions);

        },

        /**
         * Focus infowindow & highlight on intiial shared feature
         * @param {object} options
         */
        setSelectedFeature: function(options) {
            var query = new esriQuery(),
                queryTask = new QueryTask(options.url),
                graphic,
                location,
                item;

            // Build query
            query.objectIds = [options.objectId];
            query.outFields = ['*'];
            query.returnGeometry = true;

            // Execute query
            queryTask.execute(query).then(function(response) {
                // If exists response then open infowindow & highlight
                if (response.features && response.features[0]) {
                    // Create graphic for location & infowindow content
                    graphic = new Graphic(response.features[0].geometry, null, response.features[0].attributes, null);
                    graphic.layer = options.layer;

                    location = graphicsUtils.graphicsExtent([graphic]).getCenter();

                    // Format an input for Finder template function
                    item = {
                        feature: graphic,
                        value: graphic.attributes[response.displayFieldName]
                    }

                    // Get template using Finder function
                    graphic = options.templateFunction([item])[0];

                    // Update infowindow
                    app.map.infoWindow.setFeatures([graphic]);
                    app.map.infoWindow.show(location);
                }
            });
        },

        _prepareSuitabilityJSON: function(start, end, extraValues) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            if (extraValues) {
                result = result.concat(extraValues);
            }
            return result.join(",");
        }

    };


});

define('map/LossSlider',[
  "dojo/on",
  "map/config",
  "utils/Analytics",
  "map/LayerController"
], function (on, MapConfig, Analytics, LayerController) {
  "use strict";

  var playInterval,
      playButton,
      lossSlider;

  var config = {
    containerId: "treecover_change_toolbox",
    values: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
    sliderSelector: '#loss-range-slider',
    baseValue: 2001,
    playHtml: "&#9658;",
    pauseHtml: "&#x25A0"
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: config.values.length - 1
  };

  var LossSliderController = {

    init: function () {
      var self = this;
      if (lossSlider === undefined) {
        // Initialize the slider
        $(config.sliderSelector).ionRangeSlider({
          type: "double",
					values: config.values,
          grid: true,
          hide_min_max: true,
          hide_from_to: true,
          prettify_enabled: false,
					onFinish: self.change,
          onUpdate: self.change
				});
        // Save this instance to a variable ???
        lossSlider = $(config.sliderSelector).data("ionRangeSlider");
        // Cache query for play button
        playButton = $("#lossPlayButton");
        // Attach Events related to this item
        on(playButton, "click", self.playToggle);
      }

    },

    /**
    * Called when the user drags a thumb on the slider or update is called programmatically
    */
    change: function (data) {
      var densityRange;
      var treeCoverDensity = app.map.getLayer(MapConfig.tcd.id);
      if (treeCoverDensity.renderingRule.functionArguments) {
        densityRange = treeCoverDensity.renderingRule.functionArguments.Raster.rasterFunctionArguments.InputRanges;
      } else {
        densityRange = [30, 100];
      }

      LayerController.updateLossImageServiceRasterFunction([data.from, data.to], MapConfig.loss, densityRange);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Loss Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Loss Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = data.from;
      state.to = data.to;
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = lossSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        lossSlider.update({ from: lossSlider.result.from, to: lossSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = lossSlider.result.from;
          toValue = lossSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            lossSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1250);

        // Update the button html
        playButton.html(config.pauseHtml);
      }

      Analytics.sendEvent('Event', 'Loss Timeline', 'Play');
    }

  };

  return LossSliderController;

});

define('map/FormaSlider',[
  'dojo/on',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'utils/Analytics',
  'map/LayerController'
], function (on, MapConfig, esriRequest, Deferred, Analytics, LayerController) {
  // "use strict";

  var playInterval,
      formaSlider,
      playButton;

  var config = {
    sliderSelector: '#forma-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 15 // 2015
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: 0
  };

  var getFormaLabels = function getFormaLabels () {
    var deferred = new Deferred(),
        labels = [],
        request;

    request = esriRequest({
      url: MapConfig.forma.url,
      callbackParamName: 'callback',
      content: { f: 'json' },
      handleAs: 'json'
    });

    request.then(function (res) {
      // Labels should be formatted like so: {month|numeric} - {year|two-digit}
      var min = res.minValues[0] || 1,
          max = res.maxValues[0] || 9,
          year;

      for (min; min <= max; min++) {
        year = config.baseYear + Math.floor(min / 12);
        labels.push(min + ' - ' + year);
      }

      deferred.resolve(labels);
    }, function () {
      deferred.reject();
    });

    return deferred;
  };

  var FormaSlider = {

    init: function () {
      var self = this;
      if (formaSlider === undefined) {
        getFormaLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          formaSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#formaPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
          //- set the state for change tracking
          state.to = labels.length - 1;
        });
      }
    },

    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.forma);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = data.from;
      state.to = data.to;
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = formaSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        formaSlider.update({ from: formaSlider.result.from, to: formaSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = formaSlider.result.from;
          toValue = formaSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            formaSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1250);

        // Update the button html
        playButton.html(config.pauseHtml);
      }

      Analytics.sendEvent('Event', 'Forma Timeline', 'Play');
    }

  };

  return FormaSlider;

});

define('utils/DateHelper',[
], function () {

  return {
    getDate: function (date) {
      var whatDay = this.getDayOfWeek(date);
      var whatMonth = this.getMonth(date);
      var fullDate = whatDay + ', ' + date.getDate() + ' ' + whatMonth + ' ' + date.getFullYear();
      return fullDate;
    },
    getDayOfWeek: function (date) {
      var dayOfWeek;
      switch (date.getDay()) {
        case 0:
          dayOfWeek = 'Su';
          break;
        case 1:
          dayOfWeek = 'Mo';
          break;
        case 2:
          dayOfWeek = 'Tu';
          break;
        case 3:
          dayOfWeek = 'We';
          break;
        case 4:
          dayOfWeek = 'Th';
          break;
        case 5:
          dayOfWeek = 'Fr';
          break;
        case 6:
          dayOfWeek = 'Sa';
          break;
      }
      return dayOfWeek;
    },
    getMonth: function (date) {
      var month;
      switch (date.getMonth()) {
        case 0:
          month = 'Jan';
          break;
        case 1:
          month = 'Feb';
          break;
        case 2:
          month = 'March';
          break;
        case 3:
          month = 'April';
          break;
        case 4:
          month = 'May';
          break;
        case 5:
          month = 'June';
          break;
        case 6:
          month = 'July';
          break;
        case 7:
          month = 'August';
          break;
        case 8:
          month = 'Sept';
          break;
        case 9:
          month = 'Oct';
          break;
        case 10:
          month = 'Nov';
          break;
        case 11:
          month = 'Dec';
          break;
      }
      return month;
    }
  };
});

/** @jsx React.DOM */
define('components/ModalWrapper',[
  'react',
  'dojo/dom-class'
], function (React, domClass) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

  var ModalWrapper = React.createClass({displayName: "ModalWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "modal-background", onClick: this.close}), 
        React.createElement("div", {className: "modal-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll has-footer"}, 
            this.props.children, 
            React.createElement("div", {className: "modal-footer"}, 
              React.createElement("div", {className: "m-btncontainer is-center"}, 
                React.createElement("a", {href: "http://earthenginepartners.appspot.com/science-2013-global-forest", target: "_blank", className: "btn green uppercase download-mobile-link"}, "Learn more or download data")
              )
            )
          )
        )
      )
      );

    }

  });

  // return function (props, el) {
  //   /* jshint ignore:start */
  //   return React.render(<ModalWrapper />, document.getElementById(el));
  //   /* jshint ignore:end */
  // };
  return ModalWrapper;

});

define('components/CalendarWrapper',[
	'react',
	'components/ModalWrapper',
  'dojo/dom-class'
], function (React, ModalWrapper, domClass) {

  var closeSvg = '<use xlink:href="#shape-close" />';

  var CalendarWrapper = React.createClass({displayName: "CalendarWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "calendar-background", onClick: this.close}), 
        React.createElement("div", {className: "calendar-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "calendar-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }
  });

  return CalendarWrapper;

});

/** @jsx React.DOM */
define('components/CalendarModal',[
	'react',
	'components/CalendarWrapper',
  'dojo/dom-class',
  'dojo/topic',
  'utils/DateHelper',
	'utils/Analytics',
	'map/config'
], function (React, CalendarWrapper, domClass, topic, DateHelper, Analytics, MapConfig) {

	// Variables
	var calendarConfig = MapConfig.calendars;

	var CalendarModal = React.createClass({displayName: "CalendarModal",

		getInitialState: function() {
			return {
				activeCalendar: '',
        startDate: new window.Kalendae.moment('01/01/2015'),
        endDate: new window.Kalendae.moment()
			};
		},

		componentDidMount: function () {

			var self = this;

			calendarConfig.forEach(function(calendar) {
				var calendar_obj = new window.Kalendae(calendar.domId, {
					months: 1,
					mode: 'single',
					// direction: calendar.direction,
					// blackout: function (date) {
					// 	if (date.yearDay() >= calendar.startDate.yearDay()) {
					// 		return false;
					// 	} else {
					// 		return true;
					// 	}
					// },
					selected: calendar.selectedDate
				});
				calendar_obj.subscribe('change', self[calendar.method].bind(self));
			});

			// calendarStart.subscribe('change', function (date) {
			// 	debugger
			// });

		},

		componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

		render: function() {
			return (
				React.createElement(CalendarWrapper, null, 
					React.createElement("div", {className: "calendar-window"}, 
						calendarConfig.map(this.itemMapper, this)
					)
				)
			);
		},

		itemMapper: function (item) {
			return React.createElement("div", {className: item.domClass}, 
				React.createElement("div", {id: item.domId, className: ((this.state.activeCalendar === item.domId ? '' : ' hidden'))})
			);
		},

		setCalendar: function (calendar) {
			this.setState({
				activeCalendar: calendar
			});
		},

		close: function () {
			var node = React.findDOMNode(this).parentElement;
			domClass.add(node, 'hidden');
		},

		changeGladStart: function (date) {
      date = date.format('M/D/YYYY');
      var playButton = $('#gladPlayButtonStartClick');
      // playButton.html(date);
      var formattedStart = new Date(date);

      playButton.html(DateHelper.getDate(formattedStart));
			this.close();
      this.setState({
        startDate: date
      });
			var endDate = this.state.endDate;
			if (endDate.format) {
				endDate = endDate.format('M/D/YYYY');
			}
      topic.publish('updateGladDates', [date, endDate]);
			Analytics.sendEvent('Event', 'Glad Timeline', 'Change start date');
		},

		changeGladEnd: function (date) {
      date = date.format('M/D/YYYY');
      var playButtonEnd = $('#gladPlayButtonEndClick');
      // playButtonEnd.html(date);
      var formattedEnd = new Date(date);
      playButtonEnd.html(DateHelper.getDate(formattedEnd));
			this.close();
      this.setState({
        endDate: date
      });
			var startDate = this.state.startDate;
			if (startDate.format) {
				startDate = startDate.format('M/D/YYYY');
			}

      topic.publish('updateGladDates', [startDate, date]);
			Analytics.sendEvent('Event', 'Glad Timeline', 'Change end date');
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(React.createElement(CalendarModal, React.__spread({},  props)), document.getElementById(el));
		/* jshint ignore:end */
	};

});

define('map/GladSlider',[
  'dojo/on',
  'dojo/dom-class',
  'map/config',
  'esri/request',
  'utils/DateHelper',
  'dojo/Deferred',
  'components/CalendarModal',
  'map/LayerController'
], function (on, domClass, MapConfig, esriRequest, DateHelper, Deferred, CalendarModal, LayerController) {
  // "use strict";

  var playInterval,
      gladSlider;

  var config = {
    sliderSelector: '#glad-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 15 // 2015
  };

  var state = {
    isPlaying: false
  };

  var GladSlider = {

    init: function () {
      var self = this;
      if (gladSlider === undefined) {

        var calendarModal = new CalendarModal({
        }, 'calendar-modal');

        var playButton = $('#gladPlayButtonStartClick');
        var startDate = new window.Kalendae.moment('01/01/2015').format('M/D/YYYY');
        var formattedStart = new Date(startDate);
        playButton.html(DateHelper.getDate(formattedStart));

        on(playButton, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('gladCalendarStart');
          domClass.remove(node.parentNode, 'hidden');
        });

        var playButtonEnd = $('#gladPlayButtonEndClick');
        var endDate = new window.Kalendae.moment().format('M/D/YYYY');
        var formattedEnd = new Date(endDate);
        playButtonEnd.html(DateHelper.getDate(formattedEnd));

        on(playButtonEnd, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('gladCalendarEnd');
          domClass.remove(node.parentNode, 'hidden');
        });

      }
    },

    change: function (data) {
      // debugger
      console.log(data.from, data.to)
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.gladAlerts);
    }

  };

  return GladSlider;

});

define('map/ProdesSlider',[
  'dojo/on',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'utils/Analytics',
  'map/LayerController'
], function (on, MapConfig, esriRequest, Deferred, Analytics, LayerController) {

  // TODO: replace all forma's with prodes
  // 'use strict';

  var playInterval,
      prodesSlider,
      playButton;

  var config = {
    sliderSelector: '#prodes-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 1999
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: 0
  };

  var getProdesLabels = function getProdesLabels () {
    var deferred = new Deferred(),
        labels = [],
        request;

    request = esriRequest({
      url: MapConfig.prodes.url,
      callbackParamName: 'callback',
      content: { f: 'json' },
      handleAs: 'json'
    });

    request.then(function (res) {
      // Labels should be formatted like so: {month|numeric} - {year|two-digit}
      var min = res.minValues[0],
          max = res.maxValues[0],
          year;

      for (min; min <= max; min++) {
        year = config.baseYear + min;
        labels.push(year);
      }

      deferred.resolve(labels);
    }, function () {
      deferred.reject();
    });

    return deferred;
  };

  var ProdesSlider = {

    init: function () {
      var self = this;
      if (prodesSlider === undefined) {
        getProdesLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            prettify_enabled: false,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          prodesSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#prodesPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
          //- set the state for change tracking
          state.to = labels.length - 1;
        });
      }
    },

    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.prodes);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = data.from;
      state.to = data.to;
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = prodesSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        prodesSlider.update({ from: prodesSlider.result.from, to: prodesSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = prodesSlider.result.from;
          toValue = prodesSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            prodesSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1250);

        // Update the button html
        playButton.html(config.pauseHtml);
      }
      Analytics.sendEvent('Event', 'Prodes Timeline', 'Play');
    }

  };

  return ProdesSlider;

});

define('map/GuyraSlider',[
  'dojo/on',
  'map/config',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dojo/Deferred',
  'utils/Analytics',
  'map/LayerController'
], function (on, MapConfig, Query, QueryTask, Deferred, Analytics, LayerController) {

  var playInterval,
      guyraSlider,
      playButton;

  var config = {
    sliderSelector: '#guyra-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 1999
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: 0
  };

  var getGuyraLabels = function getGuyraLabels () {
    var deferred = new Deferred(),
        query, queryTask;

    query = new Query();
    query.returnGeometry = false;
    query.outFields = ['date'];
    query.returnDistinctValues = true;
    query.where = '1=1';

    queryTask = new QueryTask(MapConfig.granChaco.url + '/' + MapConfig.granChaco.defaultLayers[0]);

    queryTask.execute(query, function(res) {
      var labels = [], date, month, year;

      res.features.sort(function(a, b){
        return new Date(b.attributes.date) - new Date(a.attributes.date);
      });

      res.features.reverse();

      // var max = new Date(res.features[0].attributes.date);
      // var min = new Date(res.features[res.features.length - 1].attributes.date);

      for (var j = 0; j < res.features.length; j++) {
        date = new Date(res.features[j].attributes.date);
        year = date.getFullYear().toString().substr(2, 2);
        month = ('0' + (date.getMonth() + 1)).slice(-2);
        labels.push(month + '-' + year);

      }
      deferred.resolve(labels);

    });

    return deferred;
  };

  var GuyraSlider = {

    init: function () {
      var self = this;
      if (guyraSlider === undefined) {
        getGuyraLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            prettify_enabled: false,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          guyraSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#guyraPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
          //- set the state for change tracking
          state.to = labels.length - 1;
        });
      }
    },

    change: function (data) {

      var fromData = data.from_value.split('-');
      var toData = data.to_value.split('-');

      var fromDate = new Date(fromData[0] + '/1/20' + fromData[1]);
      var toDate = new Date(toData[0] + '/1/20' + toData[1]);

      LayerController.updateGuyraDates([fromDate, toDate]);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = fromDate;
      state.to = toDate;
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = guyraSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        guyraSlider.update({ from: guyraSlider.result.from, to: guyraSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = guyraSlider.result.from;
          toValue = guyraSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            guyraSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1000);

        // Update the button html
        playButton.html(config.pauseHtml);
      }
      Analytics.sendEvent('Event', 'Guyra Timeline', 'Play');
    }

  };

  return GuyraSlider;

});

define('map/Controls',[
    'dojo/dom',
    'dojo/query',
    'dojo/Deferred',
    'dojo/_base/fx',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/dom-construct',
    'utils/Hasher',
    'map/config',
    'map/MapModel',
    'map/LossSlider',
    'map/FormaSlider',
    'map/GladSlider',
    'map/ProdesSlider',
    'map/GuyraSlider',
    'map/LayerController',
    'esri/request',
    'esri/TimeExtent',
    'esri/dijit/TimeSlider',
    'dijit/form/CheckBox'
], function(dom, dojoQuery, Deferred, Fx, arrayUtils, domClass, domStyle, registry, domConstruct, Hasher, MapConfig, MapModel, LossSlider, FormaSlider, GladSlider, ProdesSlider, GuyraSlider, LayerController, request, TimeExtent, TimeSlider, Checkbox) {


    var jq171 = jQuery.noConflict();

    return {

        toggleToolbox: function(layerConfig, operation) {
            if (layerConfig.id === 'CustomSuitability') {
                // Toggle This checkbox independent of other toolboxes
                var display = (operation === 'show' ? 'block' : 'none');
                domStyle.set(layerConfig.toolsNode, 'display', display);
                // Resize the Accordion and The JQuery Sliders so they look correct
                // registry.byId('suitability-accordion').resize();
                this.resizeRangeSliders();
            } else {
                // Hide other tools, then show this node if operation is show
                this.hideAllToolboxes();
                if (operation === 'show') {
                    domStyle.set(layerConfig.toolsNode, 'display', 'block');
                }
            }
        },

        hideAllToolboxes: function() {
            dojoQuery('.gfw .layer-controls-container .toolbox').forEach(function(node) {
                if (domStyle.get(node, 'display') === 'block') {
                    domStyle.set(node, 'display', 'none');
                }
            });
        },

        createDialogBox: function(content) {
            require([
                'dijit/Dialog'
            ], function(Dialog) {

                // var contentClone = Lang.clone(content);
                //
                // var node = contentClone.querySelector(".source_body");
                //
                // if (node.querySelector(".source_extended")) {
                //     node.removeChild(node.querySelector(".source_extended"));
                // }
                // if (node.querySelector(".source_download")) {
                //     node.removeChild(node.querySelector(".source_download"));
                // }
                // if (node.querySelector(".overview_title")) {
                //     node.querySelector(".source_summary").removeChild(node.querySelector(".overview_title"));
                // }
                // if (contentClone.querySelector(".source_header")) {
                //     contentClone.removeChild(contentClone.querySelector(".source_header"));
                //
                // }
                // //remove checkbox
                //
                // if (contentClone.getElementsByTagName("input").length) {
                //     contentClone.removeChild(contentClone.getElementsByTagName("input")[0]);
                //
                // }

                var dialog = new Dialog({
                    // title: content.querySelector(".source_title").innerHTML.toUpperCase(),
                    // title: content.querySelector(".source_title").innerHTML,
                    title: content,
                    style: 'height: 600px; width: 600px; overflow-y: auto;',
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });

                // dialog.setContent(contentClone.innerHTML);

                dialog.onClose(function() {
                    //console.log("CLOSED");
                });
                //for possible title
                //content.getElementsByClassName("source_title")[0].innerHTML


                dialog.show();

                $('body').on('click', function(e){
                    if (e.target.classList.contains('dijitDialogUnderlay')) {
                        dialog.hide();
                        $('body').off('click');
                    }
                });

            });
        },

        showFiresConfidenceInfo: function() {
            require([
                'dijit/Dialog'
            ], function(Dialog) {
                //Export Dialog
                //TODO: Move this HTML into one of the template files.
                var content = '<p>' + MapConfig.firesConfidenceDialog.text + '</p>';

                var dialog = new Dialog({
                    title: MapConfig.firesConfidenceDialog.title.toUpperCase(),
                    style: 'height: 310px; width: 415px; font-size:14px; padding: 5px;',
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });
                dialog.setContent(content);
                dialog.show();

                $('body').on('click', function(e) {
                    if (e.target.classList.contains('dijitDialogUnderlay')) {
                        dialog.hide();
                        $('body').off('click');
                    }
                });

            });
        },

        toggleFiresLayerOptions: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement,
                filter = target.dataset ? target.dataset.filter : target.getAttribute('data-filter'),
                highConfidence;
            // Remove selected class from previous selection
            dojoQuery('.fires_toolbox .toolbox-list li').forEach(function(node) {
                domClass.remove(node, 'selected');
            });
            // Add selected class to new selection
            domClass.add(target, "selected");

            // Get status of high confidence fires checkbox
            highConfidence = dom.byId("high-confidence").checked;

            LayerController.setFiresLayerDefinition(filter, highConfidence);
        },

        toggleFiresConfidenceLevel: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement,
                highConfidence = target.checked,
                element,
                filter;

            // Find the currently active filter
            element = dojoQuery('.fires_toolbox .toolbox-list li.selected')[0];
            filter = element.dataset ? element.dataset.filter : element.getAttribute('data-filter');

            LayerController.setFiresLayerDefinition(filter, highConfidence);

        },

        // this function should also have the ability to handle string (dom node id's) to turn these on
        toggleOverlays: function(evt, nodeId) {
            if (evt) {
                domClass.toggle(evt.currentTarget, 'selected');
            } else if (nodeId) {
                // May Extend this to take an array so if 4 nodes need to be updated, I dont update the layer 4 times
                // instead, toggle all the classes and then update the layer, in this case, nodeId would be an array
                domClass.toggle(dom.byId(nodeId), 'selected');
            }

            LayerController.setOverlaysVisibleLayers();
        },

        generateTimeSliders: function() {
            LossSlider.init();
            FormaSlider.init();
            GladSlider.init();
            ProdesSlider.init();
            GuyraSlider.init();
        },

        // fetchFORMAAlertsLabels: function() {
        //     var deferred = new Deferred(),
        //         req;
        //
        //     req = request({
        //         url: MapConfig.forma.url,
        //         content: {
        //             "f": "pjson"
        //         },
        //         handleAs: "json",
        //         callbackParamName: "callback"
        //     });
        //
        //     req.then(function(res) {
        //         deferred.resolve(res);
        //     }, function(err) {
        //         //console.error(err);
        //         deferred.resolve(false);
        //     });
        //
        //     return deferred.promise;
        // },

        toggleLegendContainer: function() {
            var node = dom.byId("legend-container"),
                height = node.offsetHeight === 280 ? 30 : 280;

            Fx.animateProperty({
                node: node,
                properties: {
                    height: height
                },
                duration: 500,
                onEnd: function() {
                    if (height === 30) {
                        domClass.add("legend-title", "closed");
                    } else {
                        domClass.remove("legend-title", "closed");
                    }
                }
            }).play();
        },

        generateSuitabilitySliders: function() {

            //var accordion = new Accordion({}, "suitability-accordion"),
            //var	self = this;

            // accordion.addChild(new ContentPane({
            // 	title: "Environmental"
            // }, "environmental-criteria"));

            // accordion.addChild(new ContentPane({
            // 	title: "Crop"
            // }, "crop-criteria"));

            // accordion.startup();
            this.createCheckboxDijits();
            this.createRangeSliders();

            // Listen for the accordion to change, then resize the sliders
            // accordion.watch('selectedChildWidget', function (name, oldVal, newVal) {
            // 	self.resizeRangeSliders();
            // });
        },

        createCheckboxDijits: function() {
            var checkbox;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                checkbox = new Checkbox({
                    name: item.name,
                    value: item.value,
                    checked: item.checked,
                    onChange: function() {
                        LayerController.updateCustomSuitabilityLayer(null, item.name);
                    }
                }, item.node);
            });
        },

        createRangeSliders: function() {
            var sliderConfig = MapConfig.suitabilitySliderTooltips;
            // jQuery Shim To Allow Older Plugin to Work Correctly with new Version of JQuery
            jQuery.browser = {};
            (function() {
                jQuery.browser.msie = false;
                jQuery.browser.version = 0;
                if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                    jQuery.browser.msie = true;
                    jQuery.browser.version = RegExp.$1;
                }
            })();
            // Peat Depth
            jq171("#peat-depth-slider").rangeSlider({
                defaultValues: {
                    min: 0,
                    max: 3
                },
                valueLabels: 'change',
                bounds: {
                    min: 0,
                    max: 3
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.peat[val];
                }
            });
            jq171("#peat-depth-slider").addClass("singleValueSlider reverseSlider");
            jq171("#peat-depth-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'peat-depth-slider');
            });
            // Conservation Area Buffers
            jq171("#conservation-area-slider").rangeSlider({
                defaultValues: {
                    min: 1000,
                    max: 5000
                },
                valueLabels: 'change',
                bounds: {
                    min: 500,
                    max: 5000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " m";
                }
            });
            jq171("#conservation-area-slider").addClass("singleValueSlider");
            jq171("#conservation-area-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'conservation-area-slider');
            });
            // Water Resource Buffers
            jq171("#water-resource-slider").rangeSlider({
                defaultValues: {
                    min: 100,
                    max: 1000
                },
                valueLabels: 'change',
                bounds: {
                    min: 50,
                    max: 1000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " m";
                }
            });
            jq171("#water-resource-slider").addClass("singleValueSlider");
            jq171("#water-resource-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'water-resource-slider');
            });
            // Slope
            jq171("#slope-slider").rangeSlider({
                defaultValues: {
                    min: 30,
                    max: 80
                },
                valueLabels: 'change',
                bounds: {
                    min: 0,
                    max: 80
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + "%";
                }
            });
            jq171("#slope-slider").addClass("singleValueSlider reverseSlider");
            jq171("#slope-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'slope-slider');
            });
            // Elevation
            jq171("#elevation-slider").rangeSlider({
                defaultValues: {
                    min: 1000,
                    max: 5000
                },
                valueLabels: 'hide',
                bounds: {
                    min: 0,
                    max: 5000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + "m";
                }
            });
            jq171("#elevation-slider").addClass("singleValueSlider reverseSlider");
            jq171("#elevation-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'elevation-slider');
            });
            // Rainfall
            jq171("#rainfall-slider").rangeSlider({
                defaultValues: {
                    min: 1500,
                    max: 6000
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1500,
                    max: 6000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " " + sliderConfig.rainfall.label;
                }
            });
            jq171("#rainfall-slider").addClass("narrowTooltips");
            jq171("#rainfall-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'rainfall-slider'
                );
            });
            // Soil Drainage
            jq171("#soil-drainage-slider").rangeSlider({
                defaultValues: {
                    min: 2,
                    max: 4
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1,
                    max: 4
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.drainage[val];
                }
            });
            jq171("#soil-drainage-slider").addClass("narrowTooltips");
            jq171("#soil-drainage-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'soil-drainage-slider'
                );
            });
            // Soil Depth
            jq171("#soil-depth-slider").rangeSlider({
                defaultValues: {
                    min: 3,
                    max: 7
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1,
                    max: 7
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.depth[val];
                }
            });
            jq171("#soil-depth-slider").addClass("singleValueSlider narrowTooltips");
            jq171("#soil-depth-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'soil-depth-slider');
            });
            // Soil Acidity
            jq171("#soil-acid-slider").rangeSlider({
                defaultValues: {
                    min: 1,
                    max: 7
                },
                valueLabels: 'change',
                bounds: {
                    min: 1,
                    max: 8
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.acidity[val];
                }
            });
            jq171("#soil-acid-slider").addClass("narrowTooltips");
            jq171("#soil-acid-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'soil-acid-slider'
                );
            });
            // Newest Version of Sliders has a css bug, this is a hack to hide it
            // May need to switch to ion sliders instead in future and remove older version
            // of jQuery
            dojoQuery('.ui-rangeSlider-innerBar').forEach(function(node) {
                domConstruct.create('div', {
                    'class': 'slider-bar-blocker'
                }, node, 'after');
            });

        },

        resetSuitabilitySettings: function() {
            // Reset Sliders
            jq171('#peat-depth-slider').rangeSlider('values', 0, 3);
            jq171('#conservation-area-slider').rangeSlider('values', 1000, 5000);
            jq171('#water-resource-slider').rangeSlider('values', 100, 1000);
            jq171('#slope-slider').rangeSlider('values', 30, 80);
            jq171('#elevation-slider').rangeSlider('values', 1000, 5000);
            jq171('#rainfall-slider').rangeSlider('values', 1500, 6000);
            jq171('#soil-drainage-slider').rangeSlider('values', 2, 4);
            jq171('#soil-depth-slider').rangeSlider('values', 3, 7);
            jq171('#soil-acid-slider').rangeSlider('values', 1, 7);
            this.resizeRangeSliders();
            // Reset Checkboxes
            var cb;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                cb = registry.byId(item.node);
                if (cb) {
                    cb.set('checked', item.checked);
                }
            });
        },

        exportSuitabilitySettings: function() {
            var _self = this;
            require([
                "dijit/Dialog",
                "dojo/on",
                "dojo/_base/lang"
            ], function(Dialog, on, Lang) {
                //Export Dialog
                //TODO: Move this HTML into one of the template files.
                var content = "<p>" + MapConfig.suitabilityExportDialog.instruction + "</p>";
                content += "<p id='export-error-message' style='color: #e50036;font-size: 12px;'></p>";
                content += "<div id='export-loading-now' class='submit-container' style='display: none; visibility: hidden;'><div class='loading-wheel-container'><div class='loading-wheel'></div></div></div>"
                content += "<div id='export-buttons-container' class='submit-container'>";
                content += "<button id='export-cancel-now'>Cancel</button> ";
                content += "<button id='export-download-now'>Download</button>";
                content += "</div>";

                var dialog = new Dialog({
                    title: MapConfig.suitabilityExportDialog.title.toUpperCase(),
                    style: "height: 190px; width: 415px; overflow-y: none;",
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });
                dialog.setContent(content);
                dialog.show();

                on(dom.byId("export-cancel-now"), 'click', function() {
                    dialog.destroy();
                });
                on(dom.byId("export-download-now"), 'click', function() {
                    //Export CSV
                    var text = _self._getSettingsCSV();
                    var blob = new Blob([text], {
                        type: "text/csv;charset=utf-8;"
                    });
                    saveAs(blob, "settings.csv");

                    //dom.byId("export-error-message").innerHTML = "";
                    domStyle.set(dom.byId("export-buttons-container"), 'visibility', 'hidden');
                    domStyle.set(dom.byId("export-loading-now"), 'visibility', 'visible');
                    domStyle.set(dom.byId("export-loading-now"), 'display', 'block');

                    //Export GeoTIFF
                    _self._saveTIFF(function(errorMsg) {
                        console.log("**callback** (error = " + errorMsg + ")");
                        //domStyle.set(dom.byId("export-buttons-container"), 'visibility','visible');
                        domStyle.set(dom.byId("export-loading-now"), 'visibility', 'hidden');
                        domStyle.set(dom.byId("export-loading-now"), 'display', 'none');
                        if (errorMsg == "") {
                            //Close pop-up
                            dialog.destroy();
                        } else {
                            dom.byId("export-error-message").innerHTML = errorMsg;
                        }
                    });

                });
            });
        },

        _saveTIFF: function(callback) {
            var _self = this;
            var ext = app.map.extent;
            var width = 1460;
            var height = 854;
            var params = {
                noData: 0,
                noDataInterpretation: "esriNoDataMatchAny",
                interpolation: "RSP_BilinearInterpolation",
                format: "tiff",
                size: width + "," + height,
                imageSR: 3857,
                bboxSR: 3857,
                f: "json",
                pixelType: 'UNKNOWN'
            };
            var exporter = function(url, content) {
                console.log("exporter() :: url = ", url);
                window.open(url, "geoTiffWin");
                callback("");
            };

            var layerID = MapConfig.suit.id;

            app.map.getLayer(layerID).getImageUrl(app.map.extent, width, height, exporter, params);
            /*
            var _self = this;
            require(["esri/request", "mapui", "mainmodel", "dialog", "resources", "on"],
                function (esriRequest, MapUI, MainModel, Dialog, Resources, on) {
                    function exporter(url, content) {
                        var layersRequest = esriRequest({
                            url: url,
                            content: content,
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        layersRequest.then(
                            function (response) {
                                // dlg is the dialog created below
                                dlg.hide();
                                window.open(response.href, "newWin");

                            }, function (error) {
                                console.log("Error: ", error.message);
                            });
                        //xmlhttp.open("POST", result, true);
                        //xmlhttp.send();
                    }
                    var map = MapUI.getMap();
                    var ext = map.extent;
                    var width = 1460;
                    var height = 854;
                    var bbox =
                    {
                        xmax: ext.xmax,
                        xmin: ext.xmin,
                        ymax: ext.ymax,
                        ymin: ext.ymin
                    };
                    var params = {
                        noData: 0,
                        noDataInterpretation: "esriNoDataMatchAny",
                        interpolation: "RSP_BilinearInterpolation",
                        format: "tiff",
                        size: width + "," + height,
                        imageSR: 3857,
                        bboxSR: 3857,
                        f: "json",
                        pixelType: 'UNKNOWN'
                    };

                    var resources = Resources(),
                        content = resources.en.exportSuitImageContent,
                        title = resources.en.exportSuitImage;

                    var dlg = registry.byId("exportMapDialog");
                    dlg.set("title", title);
                    dlg.set("style", "width: 300px;");
                    dom.byId("exportMapDialogContent").innerHTML = content;
                    dlg.show();

                    on.once(dom.byId("exportOK"), "click", function () {
                        var sl = map.getLayer(toolsconfig.getConfig().suitabilityImageServiceLayer.id).getImageUrl(map.extent,
                            width, height, exporter, params);
                        //_self.exportSuitText();
                    });

                    on.once(dom.byId("exportCancel"), "click", function () {
                        dlg.hide();
                    });

                    //bbox['spatialReference'] = { 'wkid': 3857 };
                    //_self.computeSuitHistogram("PalmOilSuitability_Histogram", bbox, "esriGeometryEnvelope");
                });
            */
        },

        _getSettingsCSV: function() {
            // get slider values & labels (and direction)
            var sliders = ["peat-depth-slider", "conservation-area-slider", "water-resource-slider", "slope-slider", "elevation-slider", "rainfall-slider", "soil-drainage-slider", "soil-depth-slider", "soil-acid-slider"];
            var sliderSelections = "";
            var lbl, vals, bounds, rev, cfg, temp;
            arrayUtils.forEach(sliders, function(sliderName) {
                lbl = dom.byId(sliderName + "-label");
                vals = jq171('#' + sliderName).rangeSlider('values');
                bounds = jq171('#' + sliderName).rangeSlider('bounds');
                rev = domClass.contains(sliderName, "reverseSlider");

                // get tooltips to use for value-labels, if available
                temp = sliderName.split("-");
                if (temp[0] != "rainfall") {
                    cfg = MapConfig.suitabilitySliderTooltips[temp[0]];
                    if (cfg == undefined) {
                        if (temp[1] == "acid") temp[1] = "acidity";
                        cfg = MapConfig.suitabilitySliderTooltips[temp[1]];
                    }
                }

                if (sliderSelections != "") sliderSelections += "\n";
                sliderSelections += lbl.innerHTML + ",";
                if (rev) {
                    if (cfg == undefined) {
                        sliderSelections += bounds.min + "-" + vals.min;
                    } else {
                        var tempList = "";
                        for (var i = bounds.min; i <= vals.min; ++i) {
                            if (tempList != "") tempList += "; ";
                            tempList += cfg[i].replace(",", "/");
                        }
                        sliderSelections += tempList;
                    }
                } else {
                    if (cfg == undefined) {
                        sliderSelections += vals.min + "-" + vals.max;
                    } else {
                        var tempList = "";
                        for (var i = vals.min; i <= vals.max; ++i) {
                            if (tempList != "") tempList += "; ";
                            tempList += cfg[i].replace(",", "/");
                        }
                        sliderSelections += tempList;
                    }
                }
            });

            // get value-labels for selected checkboxes
            var landCoverSelection = "";
            var soilTypeSelection = "";
            var cb;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                cb = registry.byId(item.node);
                if (cb && cb.get('checked')) {
                    lbl = dojoQuery("label[for='" + item.node + "']")[0];
                    //console.log(" :: chb '" + item.node + "': checked? " + cb.get('checked'));
                    //console.log(" :::: LABEL:", lbl);
                    if (item.name == "landcover-checkbox") {
                        if (landCoverSelection != "") landCoverSelection += "; ";
                        landCoverSelection += lbl.innerHTML;
                    } else if (item.name == "soil-type-checkbox") {
                        if (soilTypeSelection != "") soilTypeSelection += "; ";
                        soilTypeSelection += lbl.innerHTML;
                    }
                }
            });

            //composite CSV
            var fields = ['Suitability Parameter', 'Suitability Values'];
            var csvStr = fields.join(",") + '\n';
            csvStr += sliderSelections + "\n";
            csvStr += "Land Cover," + landCoverSelection + "\n";
            csvStr += "Soil Type," + soilTypeSelection + "\n";

            return csvStr;
        },

        resizeRangeSliders: function() {
            /* Do the Following for Each Slider
			 - Hide the labels
			 - resize the slider
			 - reactivate the listeners to show labels
			*/
            jq171("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#water-resource-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#slope-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#elevation-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#rainfall-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'hide');

            jq171("#peat-depth-slider").rangeSlider('resize');
            jq171("#conservation-area-slider").rangeSlider('resize');
            jq171("#water-resource-slider").rangeSlider('resize');
            jq171("#slope-slider").rangeSlider('resize');
            jq171("#elevation-slider").rangeSlider('resize');
            jq171("#rainfall-slider").rangeSlider('resize');
            jq171("#soil-drainage-slider").rangeSlider('resize');
            jq171("#soil-depth-slider").rangeSlider('resize');
            jq171("#soil-acid-slider").rangeSlider('resize');

            jq171("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#water-resource-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#slope-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#elevation-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#rainfall-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'change');

        },

        serializeSuitabilitySettings: function() {
            return {
                'Peat Depth': jq171("#peat-depth-slider").rangeSlider('values').min,
                'Conservation Area': jq171("#conservation-area-slider").rangeSlider('values').min,
                'Water Resource': jq171("#water-resource-slider").rangeSlider('values').min,
                'Slope': jq171("#slope-slider").rangeSlider('values').min,
                'Elevation': jq171("#elevation-slider").rangeSlider('values').min,
                'Rainfall': jq171("#rainfall-slider").rangeSlider('values'),
                'Soil Drainage': jq171("#soil-drainage-slider").rangeSlider('values'),
                'Soil Depth': jq171("#soil-depth-slider").rangeSlider('values').min,
                'Soil Acidity': jq171("#soil-acid-slider").rangeSlider('values'),
                'Shrub': registry.byId('shrub-check').checked,
                'Bareland': registry.byId('bareland-check').checked,
                'Secondary Forest': registry.byId('secondary-forest-check').checked,
                'Dryland Agriculture mixed with shrub': registry.byId('dryland-agro-check').checked,
                'Water Body': registry.byId('water-check').checked,
                'Mining': registry.byId('mining-check').checked,
                'Plantation Forest': registry.byId('plantation-forest-check').checked,
                'Estate Crop Plantation': registry.byId('estate-crop-check').checked,
                'Swamp shrub': registry.byId('swamp-shrub-check').checked,
                'Primary swamp Forest': registry.byId('primary-swamp-check').checked,
                'Secondary swamp Forest': registry.byId('secondary-swamp-check').checked,
                'Settlement': registry.byId('settlement-check').checked,
                'Grassland': registry.byId('grassland-check').checked,
                'Secondary mangrove forest': registry.byId('secondary-mangrove-check').checked,
                'Dryland agriculture': registry.byId('dryland-check').checked,
                'Rice field': registry.byId('rice-check').checked,
                'Fish pond': registry.byId('fish-check').checked,
                'Transmigration area': registry.byId('transmigration-check').checked,
                'Swamp': registry.byId('swamp-check').checked,
                'Primary mangrove swamp': registry.byId('primary-mangrove-check').checked,
                'Airport': registry.byId('airport-check').checked,
                'Inceptisol': registry.byId('inceptisol-check').checked,
                'Oxisol': registry.byId('oxisol-check').checked,
                'Alfisol': registry.byId('alfisol-check').checked,
                'Ultisol': registry.byId('ultisol-check').checked,
                'Spodosol': registry.byId('spodosol-check').checked,
                'Entisol': registry.byId('entisol-check').checked,
                'Histosol': registry.byId('histosol-check').checked,
                'Mollisol': registry.byId('mollisol-check').checked,
                'Rock': registry.byId('rock-check').checked
            };
        }

    };

});

/** @jsx React.DOM */
define('components/wizard/Wizard',[
    'react',
    'analysis/config',
    'analysis/WizardStore',
    'components/wizard/StepOne',
    'components/wizard/StepTwo',
    'components/wizard/StepThree',
    'components/wizard/Intro',
    // Other Helpful Modules
    'dojo/topic',
    'dojo/_base/array',
    'map/config',
    'dojo/_base/lang',
    'esri/tasks/PrintTask',
    'map/Controls',
    'utils/Analytics',
    'utils/GeoHelper'
], function (React, AnalyzerConfig, WizardStore, StepOne, StepTwo, StepThree, Intro, topic, arrayUtils, MapConfig, lang, PrintTask, MapControls, Analytics, GeoHelper) {

    var breadcrumbs = AnalyzerConfig.wizard.breadcrumbs;
    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getDefaultState() {
        return {
            currentStep: WizardStore.get(KEYS.userStep) || 0,
            analysisArea: WizardStore.get(KEYS.selectedCustomFeatures),
            usersAreaOfInterest: WizardStore.get(KEYS.areaOfInterest)
        };
    }

    // This Component has some dynamic properties that get created to trigger refresh on the children or
    // keep track of items that effect some childrens rendering

    var Wizard = React.createClass({displayName: "Wizard",

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function() {
            // Register Callbacks for analysis area updates
            // Anytime the data in the store at these keys is updated, these callbacks trigger
            WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
            WizardStore.registerCallback(KEYS.userStep, this.currentUserStepUpdated);
            WizardStore.registerCallback(KEYS.areaOfInterest, this.areaOfInterestUpdated);
            // if we need to skip the intro, update the current step
            // else, store the current step in the store since this key needs a default value in the store
            if (this.props.skipIntro) {
                WizardStore.set(KEYS.userStep, 3);
            } else {
                WizardStore.set(KEYS.userStep, this.state.currentStep);
            }
        },

        /* Methods for reacting to store updates */
        analysisAreaUpdated: function () {
            var updatedArea = WizardStore.get(KEYS.selectedCustomFeatures);
            this.setState({ analysisArea: updatedArea });
        },

        currentUserStepUpdated: function () {
            var newStep = WizardStore.get(KEYS.userStep);
            this.setState({ currentStep: newStep });
        },

        areaOfInterestUpdated: function () {
            var newAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
            var adminUnitsLayer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (newAreaOfInterest === 'adminUnitOption' && adminUnitsLayer.visible === false) {
              adminUnitsLayer.show();
            } else if (newAreaOfInterest !== 'adminUnitOption') {
              adminUnitsLayer.hide();
            }
            this.setState({ usersAreaOfInterest: newAreaOfInterest });
        },
        /* Methods for reacting to store updates above */

        componentDidUpdate: function(prevProps, prevState) {
            if (this.props.isResetting) {
                // Reset the isResetting property so any future changes dont accidentally trigger a reset
                this.setProps({ isResetting: false });
            }

            // User returned to Step 1 so we need to reset some things.
            if (prevState.currentStep > 1 && this.state.currentStep === 1) {
              // Clear Graphics from Wizard Layer, it just shows the selection they made
              var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
              if (wizLayer) { wizLayer.clear(); }
            }
        },

        /* jshint ignore:start */
        render: function() {
            var props = this.props;
            // Mixin a callback to trigger the analysis when the user has completed the Wizard
            props.callback = {
                performAnalysis: this._performAnalysis
            };

            if (this.state.currentStep === 0) {
                $('.breadcrumbs').hide();
                $('.gfw .wizard-header').css('height', '-=45px');
                $('.gfw .wizard-body').css('top', '55px');
                $('.gfw .wizard-header .button.reset').hide();
            } else {
                $('.breadcrumbs').show();
                $('.gfw .wizard-header').css('height', '+=45px');
                $('.gfw .wizard-body').css('top', '');
                $('.gfw .wizard-header .button.reset').show();
                $('.gfw .wizard-header .button.reset').css('top', '0px');
            }

            // Hide legend content pane if appropriate
            if (['commercialEntityOption', 'certifiedAreaOption'].indexOf(this.state.usersAreaOfInterest) === -1 || this.props.currentStep === 1) {
                topic.publish('hideConcessionsLegend');
            }

            return (
              React.createElement("div", {className: "relative wizard-root"}, 
                React.createElement("div", {className: "wizard-header"}, 
                  React.createElement("div", {className: "title-section"}, 
                    React.createElement("span", {className: "title"}, "Analysis"), 
                    React.createElement("span", {className: "button reset", onClick: this._reset}, "Reset"), 
                    React.createElement("span", {className: "button close", onClick: this._close})
                  ), 
                  React.createElement("div", {className: "breadcrumbs"}, 
                    breadcrumbs.map(this._breadcrumbMapper, this)
                  )
                ), 
                React.createElement("div", {className: "wizard-body"}, 
                  React.createElement("div", {className: this.state.currentStep !== 0 ? 'hidden' : ''}, 
                    React.createElement(Intro, React.__spread({},  props))
                  ), 
                  React.createElement("div", {className: this.state.currentStep !== 1 ? 'hidden' : ''}, 
                    React.createElement(StepOne, React.__spread({},  props))
                  ), 
                  React.createElement("div", {className: this.state.currentStep !== 2 ? 'hidden' : ''}, 
                    React.createElement(StepTwo, React.__spread({},  props))
                  ), 
                  React.createElement("div", {className: this.state.currentStep !== 3 ? 'hidden' : ''}, 
                    React.createElement(StepThree, React.__spread({},  props))
                  )
                )
              )
            );
        },

        _breadcrumbMapper: function(item, index) {
            var className = index < (this.state.currentStep - 1) ? 'enabled' : '';
            className += (this.state.currentStep - 1) === index ? ' active' : '';

            return (
                React.createElement("span", {className: className}, 
                    React.createElement("span", {className: "piece", "data-index": index, onClick: this._changeStep}, item), 
                    (index < breadcrumbs.length - 1) ? React.createElement("span", {className: "carat"}, " > ") : null
                )
            );
        },
        /* jshint ignore:end */

        // UI Functions that affect internal properties only
        _changeStep: function(synEvent) {
            var targetIndex = synEvent.target.dataset ? synEvent.target.dataset.index : synEvent.target.getAttribute('data-index');

            targetIndex *= 1;

            if (targetIndex < (this.state.currentStep + 1)) {
                // Convert to Int, add 1 because adding intro added a new step
                WizardStore.set(KEYS.userStep, (1 * targetIndex) + 1);
            }
        },

        _reset: function() {
            // Call setProps to trigger reset on children
            this.replaceProps({
                isResetting: true
            });

            // Reset this components state
            WizardStore.set(KEYS.areaOfInterest, AnalyzerConfig.stepOne.option1.id, true);
            WizardStore.set(KEYS.selectedCustomFeatures, [], true);
            WizardStore.set(KEYS.userStep, 0, true);
            this.replaceState(getDefaultState());
            // Clear the WizardGraphicsLayer
            var layer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (layer) {
              layer.clear();
            }
            var layer = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
            if (layer) {
              layer.clear();
            }
            // Hide the Dynamic Layer Associated with the Wizard
            layer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (layer) {
              layer.hide();
            }
        },

        _close: function() {
            topic.publish('toggleWizard');
        },

        // Function that can be used in the Analyzer.js file to programmatically set which step it is on
        _externalSetStep: function(step) {
            if (step >= 0 || step <= 3) {
                WizardStore.set(KEYS.userStep, step);
            }
        },

        _performAnalysis: function() {
            var self = this,
                geometry = self._prepareGeometry(self.state.analysisArea),
                datasets = WizardStore.get(KEYS.analysisSets),
                labelField,
                suitableRule,
                readyEvent,
                payload,
                win;

            labelField = AnalyzerConfig.stepTwo.labelField;
            suitableRule = app.map.getLayer(MapConfig.suit.id).getRenderingRule();

            payload = {
                geometry: geometry,
                datasets: datasets,
                //types: self.state.analysisTypes,
                title: self.state.analysisArea.map(function (feature) {return feature.attributes.WRI_label;}).join(','),
                suitability: {
                    renderRule: suitableRule,
                    csv: MapControls._getSettingsCSV()
                }
            };

            win = window.open('report.html', '_blank', 'menubar=yes,titlebar=yes,scrollbars=yes,resizable=yes');

            if (localStorage) {
               localStorage.setItem('payload', JSON.stringify(payload));
            } else {
                win.payload = payload;
            }

            if (win === null || typeof(win) === undefined || win === undefined) {
                alert('You need to disable your popup blocker for this feature to work.');
            } else {
                win.focus();
                // Some browsers load really fast and are ready before the payload has been set
                // create a custom event that the new page can listen to
                if (win.document.createEvent) {
                    readyEvent = win.document.createEvent('Event');
                    readyEvent.initEvent('PayloadReady', true, true);
                    win.document.dispatchEvent(readyEvent);
                }
            }

            // Emit Event for Analytics
            Analytics.sendEvent('Event', 'Perform Analysis', 'User clicked perfrom analysis.');

            //- Create a list of types selected
            var checkboxes = AnalyzerConfig.stepThree.checkboxes;
            var types = checkboxes.filter(function (checkbox) {
              return datasets[checkbox.value];
            }).map(function (checkbox) { return checkbox.label; });
            //- Send Event for all types selected
            types.forEach(function (type) {
              Analytics.sendEvent('Analysis', 'Type of Analysis', type);
            });
        },

        _prepareGeometry: function(features) {
          // Get the point radius incase we need it, we may not
          // if it's not set for some reason, default to 50km
          var pointRadius = WizardStore.get(KEYS.analysisPointRadius) || 50;
          var geometries = [];

          // If its not an array, force it into an array so I dont need two separate
          // blocks of code to prepare the geometry, this can and should be removed once
          // we verify that features is always of type array
          if (Object.prototype.toString.call(features) !== '[object Array]') {
            features = [features];
          }

          // Helper function
          function getMillId (feature) {
            var areaOfInterest = WizardStore.get(KEYS.areaOfInterest),
                // id = feature.attributes.Entity_ID || feature.attributes.WRI_ID || undefined;
                id = feature.attributes.wri_id || feature.attributes.WRI_ID || undefined;

            return areaOfInterest === 'millPointOption' ? id : undefined;
          }

          features.forEach(function (feature) {
            var pointToPush;
            // If the feature is a point, cast as a circle with radius
            if (feature.geometry.type === 'point') {
              feature = GeoHelper.preparePointAsPolygon(feature, pointRadius);
            }

            if (getMillId(feature)) {
                pointToPush = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
                console.log(pointToPush);
            }

            geometries.push({
              geometry: feature.geometry,
              type: (feature.geometry.radius ? 'circle' : 'polygon'),
              isCustom: feature.attributes.WRI_ID !== undefined,
              label: feature.attributes.WRI_label || undefined,
              point: pointToPush,
              // Mill Point Specific Fields, Include them as undefined if the values are not present
              millId: getMillId(feature),
              isRSPO: feature.attributes.isRSPO || undefined,
              buffer: pointRadius
            });

          });

          return JSON.stringify(geometries);

        },

        // External Function to Help determine what state the wizard is in, could be useful
        // for handling various layers and other functions when toggling the wizard or jumping around
        // Leverage some of the published functions for layers, see delegator
        _getStepAndActiveArea: function() {
            return {
                currentStep: this.state.currentStep,
                selectedArea: this.state.usersAreaOfInterest || 'none'
            };
        }

    });

    return function(props, el) {
        /* jshint ignore:start */
        return React.render(React.createElement(Wizard, React.__spread({},  props)), document.getElementById(el));
        /* jshint ignore:end */
    };

});

define('analysis/WizardHelper',[
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
					MAX_WIDTH = 550, // 600 - Currently we are forcing the size to be 525 and not responsive
					MIN_WIDTH = 550, // 450
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
			// app.map.getLayer(MapConfig.adminUnitsLayer.id).show();
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

			domClass.add('analysis-modal', 'hidden');

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
				case 'overlays':
					// layer = 4;
					layer = target.getAttribute('data-layer');
					selectedArea = AnalyzerConfig.stepOne.option2.id;
					url = MapConfig.overlays.url;
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
				case 'Mill Points':
					layer = 27;
					url = MapConfig.mill.url;
					selectedArea = AnalyzerConfig.stepOne.option5.id;
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
			} else if (type === 'Mill Points') {
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

define('utils/Helper',[
	"dojo/dom-class",
	"dojo/dom-geometry",
  "analysis/WizardHelper",
  "utils/AlertsHelper",
  "dojo/_base/window",
  "dojo/_base/connect",
  "dojo/_base/fx",
  "dojo/fx",
	"dojo/on"
], function (domClass, domGeom, WizardHelper, AlertsHelper, win, connect, Fx, coreFx, on) {
	'use strict';

  var _mapContainer,
      _getMapAnimation,
      ANIMATION_DURATION = 500,
      WIZARD_WIDTH = 510,
      self = this;

  _getMapAnimation = function (leftAnimationValue, resize, originalCenterPoint) {
    _mapContainer = _mapContainer || document.getElementById('map-container')
    // var originalCenterPoint = app.map.extent.getCenter(),
    var resize = resize || true,
        beforeBegin = function () {
          if (resize === true) {
            on.once(app.map, 'resize', function () {
              app.map.centerAt(originalCenterPoint);
            });
          }
        },
        onEnd = function () {
          if (resize === true) {
            app.map.resize(true);
          }
        },
        animation = {
          node:_mapContainer,
          properties: {
            left: leftAnimationValue
          },
          duration: ANIMATION_DURATION,
          beforeBegin: beforeBegin,
          onEnd: onEnd
        };
    return Fx.animateProperty(animation);
  };

  return {
  	enableLayout: function () {
  		var body = win.body(),
  				width = domGeom.position(body).w;

  		if (width < 960) {
  			domClass.add(body, "mobile");
  		}
  	},
    toggleWizard: function () {
      var preAnimation,
          originalCenterPoint = app.map.extent.getCenter();
      if (AlertsHelper.isOpen() === true) {
        preAnimation = coreFx.combine([AlertsHelper.toggleAlertsForm()].concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0, true, originalCenterPoint))).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine(WizardHelper.toggleWizard().concat(_getMapAnimation(WizardHelper.isOpen() ? WIZARD_WIDTH : 0, true, originalCenterPoint))).play();
      }
    },
    toggleAlerts: function () {
      var preAnimation,
          originalCenterPoint = app.map.extent.getCenter();
      if (WizardHelper.isOpen() === true) {
        preAnimation = coreFx.combine(WizardHelper.toggleWizard().concat([_getMapAnimation(0, false)]));
        connect.connect(preAnimation, 'onEnd', function() {
          coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH, true, originalCenterPoint)]).play();
        });
        preAnimation.play();
      } else {
        coreFx.combine([AlertsHelper.toggleAlertsForm(), _getMapAnimation(AlertsHelper.isOpen() ? 0 : WIZARD_WIDTH, true, originalCenterPoint)]).play();
      }
    }
  };
});

define('map/SuitabilityImageServiceLayer',[
  "dojo/_base/declare",
  "dojo/Evented",
  "dojo/_base/lang",
  "dojo/_base/array",
  "esri/layers/RasterFunction",
  "esri/layers/ImageServiceParameters",
  "esri/layers/ArcGISImageServiceLayer",
  "map/MapModel",
  "esri/request"
], function (declare, Evented, lang, arrayUtils, RasterFunction, ImageServiceParameters, ArcGISImageServiceLayer, Model, esriRequest) {
    
  return declare("SuitabilityImageServiceLayer", [Evented, ArcGISImageServiceLayer], {
    constructor: function () {
      // This line below is very important, without, printing will not know the layer type since this is a custom
      // layer and won't know how to serialize the JSON
      this.declaredClass = "esri.layers.ArcGISImageServiceLayer";      

      // raster function arguments must be in same order as in image service moasic dataset
      this.rasterFunctionArguments = {};
      this.rasterFunctionArguments.ElevRaster = "$1";
      this.rasterFunctionArguments.SlopeRaster = "$2";
      this.rasterFunctionArguments.WaterRaster = "$3";
      this.rasterFunctionArguments.ConsRaster = "$4";
      this.rasterFunctionArguments.STypeRaster = "$5";
      this.rasterFunctionArguments.SDepthRaster = "$6";
      this.rasterFunctionArguments.PeatRaster = "$7";
      this.rasterFunctionArguments.SAcidRaster = "$8";
      this.rasterFunctionArguments.SDrainRaster = "$9";
      this.rasterFunctionArguments.RainfallRaster = "$10";
      this.rasterFunctionArguments.LCRaster = "$11";

      // scalars are harded-coded based on raster pre-processing scripts
      this.rasterFunctionScalars = {};
      this.rasterFunctionScalars.Elev = 10;
      this.rasterFunctionScalars.Slope = 1;
      this.rasterFunctionScalars.Water = 10;
      this.rasterFunctionScalars.Cons = 100;
      this.rasterFunctionScalars.SType = 1;
      this.rasterFunctionScalars.SDepth = 1;
      this.rasterFunctionScalars.Peat = 1;
      this.rasterFunctionScalars.SAcid = 1;
      this.rasterFunctionScalars.SDrain = 1;
      this.rasterFunctionScalars.Rainfall = 10;
      this.rasterFunctionScalars.LC = 1;

      this.renderingRule = {};

      var rasterFunction = new RasterFunction();
      rasterFunction.functionName = "RemapColormap2Prashant";
      rasterFunction.arguments = this.rasterFunctionArguments;

      var params = new ImageServiceParameters();
      params.noData = 0;
      params.renderingRule = rasterFunction;
      this.imageServiceParameters = params;

    },

    getExportUrl: function (extent, width, height, callback, options) {

    },

    getRenderingRule: function () {
      var _self = this;
      var suitabilitySettings = _self.returnRasterSettingsAsObject();
      var render_rule = {};

      lang.mixin(render_rule, this.rasterFunctionArguments);

      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Elev', _self.rasterFunctionScalars, 'MAX');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Slope', _self.rasterFunctionScalars, 'MAX');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Water', _self.rasterFunctionScalars, 'MIN');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Cons', _self.rasterFunctionScalars, 'MIN');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Rainfall', _self.rasterFunctionScalars, 'BETWEEN');
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SDepth', [0, 1, 2, 3, 4, 5, 6, 7, 99]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'Peat', [0, 1, 2, 3, 4, 5, 6]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SAcid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 99]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SDrain', [0, 1, 2, 3, 4, 99]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'LC', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 
                                                                          13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SType', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      var rasterFunction = new RasterFunction();
      rasterFunction.rasterFunction = "PalmOilSuitabilityNew";
      rasterFunction.rasterFunctionArguments = render_rule;
      return rasterFunction;
    },

    getImageUrl: function (extent, width, height, callback, options) {
      var _self = this;
      extent = extent._normalize();

      var bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
          params,
          min,
          max,
          tempArray,
          membership_arguments,
          req;

      var rasterFunction = _self.getRenderingRule();
      if (options) {
        params = options;
        params.renderingRule = JSON.stringify(rasterFunction);
        params.bbox = bbox.join(",");
        // If hitting callback directly, I dont need .f = json, only if using the esri request with post
        // because the request is too long
        params.f = 'json';
        _self.renderingRule = rasterFunction;

        req = esriRequest({
          url: _self.url + '/exportImage',
          content: params,
          handleAs: 'json',
          callbackParamName: 'callback'
        }, {usePost: true});

        req.then(function (res) {
          try {
            callback(res.href);
            _self.emit('image-ready', {});
          } catch (e) {
            _self.refresh();
          }
        }, function (err) {
          console.dir(err);
          _self.emit('image-ready', {});
        });

        //callback(_self.url + "/exportImage?", params);
      } else {
        params = {
          noData: 0,
          noDataInterpretation: "esriNoDataMatchAny",
          interpolation: "RSP_BilinearInterpolation",
          renderingRule: JSON.stringify(rasterFunction),
          format: "png8",
          size: width + "," + height,
          imageSR: 3857,
          bboxSR: 3857,
          f: "json",
          pixelType: 'U8',
          bbox: bbox.join(",")
        };

        _self.renderingRule = rasterFunction;
        _self.renderingRule.toJson = function() {
          return _self.getRenderingRule();
        };

        req = esriRequest({
          url: _self.url + '/exportImage',
          content: params,
          handleAs: 'json',
          callbackParamName: 'callback'
        }, {usePost: true});

        req.then(function (res) {
          try {
            callback(res.href);
            _self.emit('image-ready', {});
          } catch (e) {
            _self.refresh();
          }
        }, function (err) {
          console.dir(err);
          _self.emit('image-ready', {});
        });

        //callback(_self.url + "/exportImage?" + dojo.objectToQuery(params));
      
      }
      
    },

    returnRasterSettingsAsObject: function () {
      var result = {},
          settingsArray = Model.get('suitabilitySettings').computeBinaryRaster;

      arrayUtils.forEach(settingsArray, function (setting) {
        result[setting.name] = setting.values;
      });
      
      return result;
    },

    returnNumericArray : function (stringArray) {
        var temp = stringArray.split(",");
        var result = [];
        arrayUtils.forEach(temp, function (value) {
          result.push(parseInt(value, 10));
        });
        return result;
    },

    addThresholdArgument: function (suitabilitySettings, renderRule, variableName, scalars, breakType) {
      var _self = this;
      scalar = scalars[variableName];
      if (breakType === 'BETWEEN') {
          var tempArray = _self.returnNumericArray(suitabilitySettings[variableName + 'InpR']);
          var min = tempArray[0];
          var max = tempArray[tempArray.length - 1];
          renderRule[variableName + 'InpR'] = [0, min / scalar, min / scalar, max / scalar, max / scalar, 1000000];
          renderRule[variableName + 'OutV'] = [1, 1, 0];
      } else {
          var breakpoint = parseInt(suitabilitySettings[variableName + 'InpR'], 10);
          renderRule[variableName + 'InpR'] = [0, breakpoint / scalar, breakpoint / scalar, 1000000];
          renderRule[variableName + 'OutV'] = breakType === 'MIN' ? [0, 1] : [1, 0];
      }
    },

    addMembershipArgument: function (suitabilitySettings, renderRule, variableName, allValues) {
      var _self = this;
      var validValues = _self.returnNumericArray(suitabilitySettings[variableName + 'InpR']);
      var input_values = [];
      var output_values = [];
      var includeNulls = ["SDepth","SAcid","SDrain","LC"];
      var val;
      var i;

      if (includeNulls.indexOf(variableName) > -1 && validValues[0] !== 0)
        validValues.unshift(0);

      for (i = 0; i < allValues.length; i++) {
        val = allValues[i];
        input_values.push(val, val);
        if (validValues.indexOf(val) === -1) {
          output_values.push(0);
        } else {
          output_values.push(1);
        }
      }
      renderRule[variableName + 'InpR'] = input_values;
      renderRule[variableName + 'OutV'] = output_values;
    }

  });  // End return declare
}); // End define;
define('map/SimpleLegend',[],
    function() {

        SimpleLegend = function(config) {
            this.config = config;
            this.CLASS_NAME = 'simple-legend';
            this.onHide = function() {};
            this.onShow = function() {};
            this.items = [];

            return this;
        };

        SimpleLegend.prototype.init = function(callback) {

            var legendRequest = new XMLHttpRequest(),
                layerIndex = 0,
                content = '',
                configLayerIds,
                response,
                responseLayers,
                config = this.config,
                self = this;

            legendRequest.onreadystatechange = function(res) {
                if (legendRequest.readyState === 4) {
                    if (legendRequest.status === 200) {
                        response = JSON.parse(legendRequest.response);


                        // Root div setup
                        content += '<div id="' + config.id + '" class="' + self.CLASS_NAME + '">';

                        if (config.title) {
                            content += '<div id="' + config.id + '-title" class="simple-legend-title">' + config.title + '</div>';
                        }

                        // Legend items
                        configLayerIds = config.layers.map(function(layer) {
                            return layer.id;
                        });


                        responseLayers = response.layers.filter(function(responseLayer) {
                            return configLayerIds.indexOf(responseLayer.layerId) > -1;
                        });

                        responseLayers.forEach(function(responseLayer) {

                            responseLayer.config = config.layers.filter(function(config) {
                                return config.id === responseLayer.layerId;
                            }, this)[0];

                            responseLayer.legend.forEach(function(legendItem, i) {
                                var itemId = config.id + '-layer-' + layerIndex + '-' + i,
                                    itemLabel = legendItem.label;

                                self.items.push(itemId);

                                // Label overrides
                                if (config.layers[layerIndex].labels !== undefined && config.layers[layerIndex].labels[i]) {
                                    itemLabel = config.layers[layerIndex].labels[i];
                                }

                                content += '<div id="' + itemId + '" class="simple-legend-layer">' +
                                    '<img class="simple-legend-image" src="data:image/png;base64,' + legendItem.imageData + '" height="' + legendItem.height + 'px" width="' + legendItem.width + 'px">' +
                                    '<span class="simple-legend-label">' + itemLabel + '</span>' +
                                    '</div>';
                            });

                            layerIndex += 1;

                        });

                        // Root div cleanup
                        if (config.title) {
                            content += '</div>';
                        }

                        content += '</div>';

                        document.getElementById(config.parentId).insertAdjacentHTML('afterbegin', content);

                        if (callback) callback.bind(self)();

                    } else {
                        console.log('Error');
                    }
                }
            };

            legendRequest.addEventListener('error', function(error) {
                if (error) console.log(error);
            }, false);

            legendRequest.open('GET', config.url, true);
            legendRequest.send();

        };

        SimpleLegend.prototype.show = function() {
            var node = document.getElementById(this.config.id);
            if (node) {
                node.style.display = 'block';
            }
            this.onShow();
            return this;
        };

        SimpleLegend.prototype.hide = function() {
            var node = document.getElementById(this.config.id);
            if (node) {
                node.style.display = 'none';
            }
            this.onHide();
            return this;
        };

        SimpleLegend.prototype.filterItem = function(index) {
            this.items.forEach(function(elementId, elementIndex) {
                if (elementIndex === index) {
                    document.getElementById(elementId).style.display = 'block';
                } else {
                    document.getElementById(elementId).style.display = 'none';
                }
            });
            return this;
        };

        return SimpleLegend;

    });
define('map/Map',[
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
                granChacoLayer,
                granChacoParams,
                plantationsTypeLayer,
                plantationsTypeParams,
                plantationsSpeciesLayer,
                plantationsSpeciesParams,
                legendLayer,
                legendParams,
                formaAlertsLayer,
                formaParams,
                prodesAlertsLayer,
                prodesParams,
                gladAlertsLayer,
                gladParams,
                gainLayer,
                gainHelperLayer,
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


                // primaryForestLayer,
                // forestCoverLayer,
                // forestCoverParams,
                // forestCoverCommoditiesParams,
                // forestUseLayer,
                // forestUseParams,
                protectAreasLayer,
                protectAreasHelperParams,
                protectAreasHelper,
                customSuitabilityLayer,

                mapOverlaysLayer,
                mapOverlaysParams,
                customGraphicsLayer,
                // adminBoundariesParams,
                // adminBoundariesLayer,
                wizardDynamicParams,
                wizardDynamicLayer,
                bioDiversityParams,
                bioDiversityLayer,

                // primaryParams,
                wizardGraphicsLayer,
                wizardPointGraphicsLayer,
                self = this;

            fireParams = new ImageParameters();
            fireParams.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            fireParams.layerIds = MapConfig.fires.defaultLayers;
            fireParams.format = 'png32';

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

            console.log(MapConfig.gladAlerts.defaultStartRange);
            console.log(MapConfig.gladAlerts.defaultEndRange);

            gladParams = new ImageServiceParameters();
            // gladParams.interpolation = 'RSP_NearestNeighbor';
            gladParams.renderingRule = new RasterFunction({
              'rasterFunction': 'Colormap',
              'rasterFunctionArguments': {
                'Colormap': MapConfig.gladAlerts.colormap,
                'Raster': {
                  'rasterFunction': 'Local',
                  'rasterFunctionArguments': {
                    'Operation': 67, //max value; ignores no data
                    'Rasters': [{
                      'rasterFunction': 'Remap',
                      'rasterFunctionArguments': {
                        'InputRanges': MapConfig.gladAlerts.defaultStartRange,
                        'OutputValues': MapConfig.gladAlerts.outputValues, //[0, 1],
                        'Raster': '$1', //2015
                        'AllowUnmatched': false
                      }
                    }, {
                      'rasterFunction': 'Remap',
                      'rasterFunctionArguments': {
                        'InputRanges': MapConfig.gladAlerts.defaultEndRange,
                        'OutputValues': MapConfig.gladAlerts.outputValues, //[0, 1],
                        'Raster': '$2', //2016
                        'AllowUnmatched': false
                      }
                    }]
                  }
                }
              }
            });

            gladAlertsLayer = new ArcGISImageServiceLayer(MapConfig.gladAlerts.url, {
              imageServiceParameters: gladParams,
              id: MapConfig.gladAlerts.id,
              visible: false
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
            batchParams.format = 'png32';


            forestCover_forestCover = new ArcGISDynamicLayer(MapConfig.ifl.url, {
                imageParameters: batchParams,
                id: 'forestCover_forestCover',
                visible: false
            });

            tropicalParams = new ImageServiceParameters();
            tropicalParams.renderingRule = new RasterFunction({
                'rasterFunction': 'Stretched'//,
                // 'rasterFunctionArguments': {
                //     'Colormap': MapConfig.forma.colormap,
                //     'Raster': {
                //         'rasterFunction': 'Remap',
                //         'rasterFunctionArguments': {
                //             'InputRanges': MapConfig.forma.defaultRange,
                //             'OutputValues': [1],
                //             'AllowUnmatched': false
                //         }
                //     }
                // },
                // 'variableName': 'Raster'
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
                lossLayer,
                gainLayer,
                gainHelperLayer,
                granChacoLayer,
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
            formaAlertsLayer.on('error', this.addLayerError);
            prodesAlertsLayer.on('error', this.addLayerError);
            gladAlertsLayer.on('error', this.addLayerError);
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

define('map/Finder',[
    "dojo/on",
    "dojo/dom",
    "dojo/Deferred",
    "dojo/promise/all",
    "map/config",
    "map/MapModel",
    "analysis/WizardHelper",
    "utils/AlertsHelper",
    'utils/GeoHelper',
    "esri/graphic",
    "dojo/_base/array",
    "esri/InfoTemplate",
    "esri/geometry/Point",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/geometry/webMercatorUtils",
    "esri/symbols/PictureMarkerSymbol"
], function(on, dom, Deferred, all, MapConfig, MapModel, WizardHelper, AlertsHelper, GeoHelper, Graphic, arrayUtils, InfoTemplate, Point, IdentifyTask, IdentifyParameters, webMercatorUtils, PictureSymbol) {
    'use strict';

    // NOTE: Map is available as app.map

    return {

        searchAreaByCoordinates: function() {
            var values = {},
                latitude, longitude,
                invalidValue = false,
                invalidMessage = "You did not enter a valid value.  Please check that your location values are all filled in and nubmers only.",
                symbol = new PictureSymbol('app/css/images/RedStickpin.png', 32, 32),
                attributes = {},
                point,
                graphic,
                getValue = function(value) {
                    if (!invalidValue) {
                        invalidValue = isNaN(parseFloat(value));
                    }
                    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                };

            // If the DMS Coords View is present, get the appropriate corrdinates and convert them
            if (MapModel.get('showDMSInputs')) {
                values.dlat = getValue(dom.byId('degreesLatInput').value);
                values.mlat = getValue(dom.byId('minutesLatInput').value);
                values.slat = getValue(dom.byId('secondsLatInput').value);
                values.dlon = getValue(dom.byId('degreesLonInput').value);
                values.mlon = getValue(dom.byId('minutesLonInput').value);
                values.slon = getValue(dom.byId('secondsLonInput').value);
                latitude = values.dlat + (values.mlat / 60) + (values.slat / 3600);
                longitude = values.dlon + (values.mlon / 60) + (values.slon / 3600);
            } else { // Else, get LatLong Coordinates and Zoom to them
                latitude = getValue(dom.byId('latitudeInput').value);
                longitude = getValue(dom.byId('longitudeInput').value);
            }

            if (invalidValue) {
                alert(invalidMessage);
            } else {
                attributes.locatorValue = GeoHelper.nextCustomFeatureId();
                attributes.id = 'LOCATOR_' + attributes.locatorValue;
                graphic = GeoHelper.generatePointGraphicFromGeometric(longitude, latitude, attributes);
                // point = webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude));
                // graphic = new Graphic(point, symbol, attributes);
                app.map.graphics.add(graphic);
                app.map.centerAndZoom(graphic.geometry, 7);
                MapModel.set('showClearPinsOption', true);
            }
        },

        performIdentify: function(evt) {
            // If none of the layers we identify on are visible, then return immediately after checks
            var mapPoint = evt.mapPoint,
                deferreds = [],
                features = [],
                self = this,
                helperLayer,
                layer;

            // Clear out Previous Features
            app.map.infoWindow.clearFeatures();


            layer = app.map.getLayer(MapConfig.fires.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyFires(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.rspoPerm.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyforestUseCommodities(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.oilPerm.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyforestUseLandUse(mapPoint));
                }
            }

            helperLayer = app.map.getLayer(MapConfig.palHelper.id);
            layer = app.map.getLayer(MapConfig.pal.id);
            if (layer && helperLayer) {
                if (layer.visible || helperLayer.visible) {
                    deferreds.push(self.identifyWDPA(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyWizardDynamicLayer(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.biomes.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyBiomesLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.byType.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyPlantationsTypeLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.bySpecies.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyPlantationsSpeciesLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.mill.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyMillPoints(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.overlays.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyOverlaysLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.getCustomGraphics(evt));
                }
            }

            if (deferreds.length === 0) {
                return;
            }

            // If drawing tools enabled, dont continue
            if (MapModel.get('drawToolsEnabled')) {
                return;
            }

            /*
        featureObject has the following structure properties
        layer - the layer the feature belongs to, current possible values are:
              - Fires, WDPA, Concessions
        features - array of features found by the identify task
      */

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {

                    // if (item) {
                    //     item.features.forEach(function(feature) {
                    //         feature.feature.layer = item.layer;
                    //     });
                    // }
                    console.log(item);
                    console.log(item.layer);

                    switch (item.layer) {

                        case 'Fires':
                            features = features.concat(self.setFireTemplates(item.features));
                            break;
                        case 'MillPoints':
                            features = features.concat(self.setMillPointTemplates(item.features));
                            break;
                        case 'forestUseCommodities':
                            features = features.concat(self.setForestUseCommoditiesTemplates(item.features));
                            break;
                        case 'forestUseLandUse':
                            features = features.concat(self.setForestUseLandUseTemplates(item.features));
                            break;
                        case 'WDPA':
                            features = features.concat(self.setWDPATemplates(item.features));
                            break;
                        case 'byType':
                            features = features.concat(self.setPlantationsTypeTemplates(item.features));
                            break;
                        case 'bySpecies':
                            features = features.concat(self.setPlantationsSpeciesTemplates(item.features));
                            break;
                        case 'overlays':
                            features = features.concat(self.setOverlaysTemplates(item.features));
                            break;
                        // case "Concessions":
                        //     features = features.concat(self.setConcessionTemplates(item.features));
                        //     break;
                        case 'WizardDynamic':
                            features = features.concat(self.setWizardTemplates(item.features));
                            break;
                        case 'CustomGraphics':
                            // This will only contain a single feature and return a single feature
                            // instead of an array of features
                            features.push(self.setCustomGraphicTemplates(item.feature));
                            break;
                        case 'Biomes':
                            features = features.concat(self.setBiomesTemplates(item.features));
                            break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    app.map.infoWindow.setFeatures(features);
                    app.map.infoWindow.show(mapPoint);
                }

            });


        },

        identifyFires: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.fires.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [0, 1, 2, 3];
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "Fires",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setFireTemplates: function(featureObjects) {
            var template,
                features = [];
            arrayUtils.forEach(featureObjects, function(item) {
                template = new InfoTemplate(item.layerName, MapConfig.fires.infoTemplate.content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyWDPA: function(mapPoint) {
            // Idenitfy URL is layer 25 using the oilPermit url
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.palHelper.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [MapConfig.palHelper.id];
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'WDPA';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: "WDPA",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setWDPATemplates: function(featureObjects) {
            var template,
                features = [],
                content;

            arrayUtils.forEach(featureObjects, function(item) {
                content = MapConfig.pal.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='WDPA' data-id='${objectid}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='WDPA' data-id='${objectid}'>" +
                        "Subscribe</button>" +
                        "</div>";

                template = new InfoTemplate(item.value, content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        setOverlaysTemplates: function(featureObjects) {
            var template,
                features = [],
                // dataLayer,
                content;

            arrayUtils.forEach(featureObjects, function(item) {
              // if (item.layerId === 6 || item.layerId === 7) {
              //   dataLayer = 5;
              // }
                content = MapConfig.overlays.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-layer=" +
                        item.layerId + " data-label='" +
                        item.value + "' data-type='overlays' data-id='${OBJECTID}'>" +
                        'Analyze</button>' +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-layer=" +
                        item.layerId + " data-label='" +
                        item.value + "' data-type='overlays' data-id='${OBJECTID}'>" +
                        'Subscribe</button>' +
                        '</div>';

                template = new InfoTemplate(item.value, content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyforestUseCommodities: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.rspoPerm.url),
                params = new IdentifyParameters();

            if (app.map.getLayer(MapConfig.rspoPerm.id).visibleLayers.indexOf(0) === -1) {
              return false; //Layer 0 (RSPO) is the only layer in the service we'll allow an ID task on
            }

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [0]; //app.map.getLayer(MapConfig.rspoPerm.id).visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    features.forEach(function(feature) {
                        feature.feature.layer = 'forestUseCommodities'; //"forestUseCommodities-" + feature.layerId;
                    });

                    deferred.resolve({
                        layer: 'forestUseCommodities',
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyforestUseLandUse: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.oilPerm.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = app.map.getLayer(MapConfig.oilPerm.id).visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    features.forEach(function(feature) {
                        feature.feature.layer = "forestUseLandUse-" + feature.layerId;
                    });

                    deferred.resolve({
                        layer: "forestUseLandUse",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyOverlaysLayer: function(mapPoint) {

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.overlays.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            // params.layerIds = app.map.getLayer(MapConfig.overlays.id).visibleLayers;
            params.layerIds = [5];
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'overlays';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: 'overlays',
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyBiomesLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.biomes.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.biomes.layerId];
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "Biomes";
              });

              deferred.resolve({
                layer: "Biomes",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        setBiomesTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.biomes.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate(item.value, content));
            features.push(item.feature);
          });

          return features;
        },

        identifyPlantationsTypeLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.byType.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.byType.layerId];
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "byType";
              });

              deferred.resolve({
                layer: "byType",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        identifyPlantationsSpeciesLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.bySpecies.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.bySpecies.layerId];
          console.log(params)
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "bySpecies";
              });

              deferred.resolve({
                layer: "bySpecies",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        setPlantationsTypeTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.bySpecies.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate('Plantations by Type', content +
           "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
           item.value + "' data-type='Plantations by Type' data-id='${objectid}'>" +
           "Analyze</button>" +
           "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
           item.value + "' data-type='Plantations by Type' data-id='${objectid}'>" +
           "Subscribe</button>" +
           "</div>"));
            features.push(item.feature);
          });

          return features;
        },

        setPlantationsSpeciesTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.bySpecies.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate('Plantations by Species', content +
           "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
           item.value + "' data-type='Plantations by Species' data-id='${objectid}'>" +
           "Analyze</button>" +
           "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
           item.value + "' data-type='Plantations by Species' data-id='${objectid}'>" +
           "Subscribe</button>" +
           "</div>"));
            features.push(item.feature);
          });

          return features;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        // setConcessionTemplates: function(featureObjects) {
        //     var template,
        //         features = [],
        //         self = this;

        //     arrayUtils.forEach(featureObjects, function(item) {
        //         if (item.layerId === 27) {
        //             template = new InfoTemplate(item.value,
        //                 MapConfig.rspoPerm.infoTemplate.content +
        //                 "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
        //                 item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
        //                 "Analyze</button>" +
        //                 "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
        //                 item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
        //                 "Subscribe</button>" +
        //                 "</div>"
        //             );
        //             item.feature.setInfoTemplate(template);
        //             features.push(item.feature);
        //         } else if (item.layerId === 16) {
        //             console.log("Finder >>> setConcessionTemplates");
        //         } else {
        //             template = new InfoTemplate(item.value,
        //                 MapConfig.oilPerm.infoTemplate.content +
        //                 "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
        //                 item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
        //                 "Analyze</button>" +
        //                 "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
        //                 item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
        //                 "Subscribe</button>" +
        //                 "</div>"
        //             );
        //             item.feature.setInfoTemplate(template);
        //             features.push(item.feature);
        //         }
        //     });
        //     return features;
        // },

        setForestUseCommoditiesTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                console.log('layerId', item.layerId);
                template = new InfoTemplate(item.value,
                    MapConfig.rspoPerm.infoTemplate.content +
                    "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                    item.value + "' data-type='RSPO Oil palm concession' data-id='${objectid}'>" +
                    'Analyze</button>' +
                    "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                    item.value + "' data-type='RSPO Oil palm concession' data-id='${objectid}'>" +
                    'Subscribe</button>' +
                    '</div>'
                );
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
                // if (item.layerId === 4) {
                //     template = new InfoTemplate(item.value,
                //         MapConfig.rspoPerm.infoTemplate.content +
                //         "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                //         item.value + "' data-type='RSPO Oil palm concession' data-id='${objectid}'>" +
                //         "Analyze</button>" +
                //         "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                //         item.value + "' data-type='RSPO Oil palm concession' data-id='${objectid}'>" +
                //         "Subscribe</button>" +
                //         "</div>"
                //     );
                //     item.feature.setInfoTemplate(template);
                //     features.push(item.feature);
                // } else if (item.layerId === 6) {
                //     // debugger
                //     template = new InfoTemplate(item.value,
                //         MapConfig.mill.infoTemplate.content +
                //         "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                //         "${mill_name}' data-type='MillPoint' data-id='${wri_id}'>" +
                //         "Analyze</button>" +
                //         "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                //         "${mill_name}' data-type='MillPoint' data-id='${wri_id}'>Subscribe</button>" +
                //         "</div>"
                //     );
                //     item.feature.setInfoTemplate(template);
                //     features.push(item.feature);
                // } else if (item.layerId === 27) {
                //     template = new InfoTemplate(item.value,
                //         MapConfig.gfwMill.infoTemplate.content +
                //         "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                //         "${mill_name_}' data-type='MillPoint' data-id='${wri_id}'>" +
                //         "Analyze</button>" +
                //         "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                //         "${mill_name_}' data-type='MillPoint' data-id='${wri_id}'>Subscribe</button>" +
                //         "</div>"
                //     );
                //     item.feature.setInfoTemplate(template);
                //     // prevent duplicate features
                //     if (features.filter(function(f) {return f.attributes.wri_id === item.feature.attributes.wri_id}).length === 0) {
                //       features.push(item.feature);
                //     }
                // }
            });
            return features;
        },

        setMillPointTemplates: function(featureObjects) {
            var template,
                features = [];

            arrayUtils.forEach(featureObjects, function(item) {
                console.log('feature', item);
                template = new InfoTemplate(item.value,
                    MapConfig.mill.infoTemplate.content +
                    "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                    item.value + "' data-type='Mill Points' data-id='${wri_id}'>" +
                    'Analyze</button>' +
                    "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                    item.value + "' data-type='Mill Points' data-id='${wri_id}'>" +
                    'Subscribe</button>' +
                    '</div>'
                );
                item.feature.setInfoTemplate(template);
                features.push(item.feature);

            });
            return features;
        },

        setForestUseLandUseTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                console.log(item.layerId) // 0,1,2,3
                if (item.layerId === 0) {
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Wood fiber plantation' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Wood fiber plantation' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 1) {
                    // debugger
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Oil palm concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Oil palm concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 2) {
                    template = new InfoTemplate(item.feature.attributes.Company, //item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Mining concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Mining concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 3) {
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Logging concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Logging concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                }
            });
            return features;
        },


        identifyWizardDynamicLayer: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.adminUnitsLayer.url),
                layer = app.map.getLayer(MapConfig.adminUnitsLayer.id),
                params = new IdentifyParameters(),
                layerDefs = [];

            // Layer Defs All Possible Layers
            layerDefs[7] = '1 = 1';
            layerDefs[13] = layer.layerDefinitions[13];

            params.tolerance = 3;
            params.returnGeometry = false;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = layer.visibleLayers;
            params.layerDefinitions = layerDefs;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "WizardDynamic",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setWizardTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                if (item.layerId === 7) {
                    template = new InfoTemplate(item.value,
                        MapConfig.adminUnitsLayer.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        "${NAME_2}' data-type='AdminBoundary' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        "${NAME_2}' data-type='AdminBoundary' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                } else {
                    template = new InfoTemplate(item.value,
                        MapConfig.certificationSchemeLayer.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='CertScheme' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='CertScheme' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                }
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyMillPoints: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.mill.url),
                layer = app.map.getLayer(MapConfig.mill.id),
                params = new IdentifyParameters(),
                layerDefs = [];

            layerDefs[0] = '1 = 1';

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = layer.visibleLayers;
            params.layerDefinitions = layerDefs;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'MillPoints';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: 'MillPoints',
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },



        getCustomGraphics: function(evt) {
            var deferred = new Deferred();

            if (evt.graphic && evt.graphic._layer.id === MapConfig.customGraphicsLayer.id) {
                deferred.resolve({
                    layer: 'CustomGraphics',
                    feature: evt.graphic
                });
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        },

        /*
      @param {object} feature - take a arcgis graphic object
      @return {object} feature - returns a feature with an infoTemplate applied
    */
        setCustomGraphicTemplates: function(feature) {
            var label = feature.attributes.WRI_label,
                infoTemplate;

            infoTemplate = new InfoTemplate(label,
                MapConfig.customGraphicsLayer.infoTemplate.content +
                "<div>" +
                "<button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                label + "' data-type='CustomGraphic' data-id='${WRI_ID}'>" +
                "Analyze</button>" +
                "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                label + "' data-type='CustomGraphic' data-id='${WRI_ID}'>" +
                "Subscribe</button>" +
                "</div>"
            );
            feature.setInfoTemplate(infoTemplate);
            return feature;
        },

        // The formatter functions must be in the global scope so attach them to window
        createFormattingFunctions: function() {
            // Formatting functions take a graphic as a parameter or a value,key,data(feature) combo
            // and MUST RETURN a string, reference to HTML element, or a deferred
            window.checkAvailable = function(value, key, data) {
                return (data[key] === undefined || data[key] === "Null") ? "N/A" : data[key];
            };
        },

        setupInfowindowListeners: function() {
            var handle,
                subscribeHandle;

            on(app.map.infoWindow, 'selection-change', function() {
                setTimeout(function() {
                    if (dom.byId('popup-analyze-area')) {
                        if (handle) {
                            handle.remove();
                        }
                        handle = on(dom.byId('popup-analyze-area'), 'click',
                            WizardHelper.analyzeAreaFromPopup.bind(WizardHelper));
                    }
                    if (dom.byId('subscribe-area')) {
                      if (subscribeHandle) {
                        subscribeHandle.remove();
                      }
                      subscribeHandle = on(dom.byId('subscribe-area'), 'click', AlertsHelper.subscribeFromPopup)
                    }
                }, 0);
            });

            on(app.map.infoWindow, 'hide', function() {
                if (handle) {
                    handle.remove();
                }
                if (subscribeHandle) {
                    subscribeHandle.remove();
                }
            });

        }

    };

});

(function (win, doc) {

	// Make Sure requestAnimationFrame is available
	win.requestAnimationFrame = (function () {
		return win.requestAnimationFrame ||
			win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
	})();

	var Animator = {};
	var fps = 1000 / 60;

	Animator.fadeIn = function (itemIds, options, callback) {

		if (Object.prototype.toString.call(itemIds) !== '[object Array]') {
			itemIds = [itemIds];
		}

		var	id = itemIds.shift(),
				element = document.getElementById(id),
				steps = fps / (options.duration || 500);		

		function fade() {
			// 1 * element.style.opacity is necessary to convert string to number for addition
			element.style.opacity = 1 * element.style.opacity + steps;
			if (element.style.opacity < 1) {
				win.requestAnimationFrame(fade);
			} else {
				id = itemIds.shift();
				element = document.getElementById(id);
				if (element) {
					win.requestAnimationFrame(fade);
				} else {
					if (typeof callback === "function") {
						callback();
					}
				}
			}
		}
		win.requestAnimationFrame(fade);
	};

	// Animator.slide = function (options, callback) {

	// 	// Options must contain node, and some properties object containing which properties to animate

	// };


  if (typeof define === "function" && define.amd) {
    define('utils/Animator',[],function() {
    	return Animator;
	  });
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Animator;
	} else {
		win.animator = Animator;
	}

})(window, document, define);
define('map/TCDSlider',[
  'dojo/on',
  'map/MapModel',
  'map/config',
  'map/LayerController'
], function (on, MapModel, MapConfig, LayerController) {
  'use strict';

  var tcdSlider,
      modal;

  var TCDSliderController = {

    show: function () {
      var self = this;
      if (tcdSlider === undefined) {
        tcdSlider = $('#tcd-density-slider').ionRangeSlider({
          type: 'double',
					values: [0, 10, 15, 20, 25, 30, 50, 75, 100],
          hide_min_max: true,
					from_min: 1,
					from_max: 7,
          to_fixed: true,
          grid: true,
          grid_snap: true,
					from: 5,
					onFinish: self.change,
          prettify: function (value) { return value + '%'; }
				});
      }

      // Cache the dom query operation
      modal = $('#tcd-modal');
      modal.addClass('active');
      on.once($('#tcd-modal .close-icon')[0], 'click', self.hide);
    },

    hide: function () {
      if (modal) { modal.removeClass('active'); }
    },

    change: function (data) {
      var value = data.from_value;
      if (value) {
        // Update the Value in the Model
        MapModel.set('tcdDensityValue', data.from_value);
        LayerController.updateTCDRenderingRule(data.from_value);

        var treeCoverLoss = app.map.getLayer(MapConfig.loss.id);
        var densityRange = [data.from_value, data.to_value];
        var from = treeCoverLoss.renderingRule.functionArguments.min_year - 2001;
        var to = treeCoverLoss.renderingRule.functionArguments.max_year - 2001;
        LayerController.updateLossImageServiceRasterFunction([from, to], MapConfig.loss, densityRange);
      }
    }

  };

  return TCDSliderController;

});

/** @jsx React.DOM */
define('components/Check',[
	'react',
	'knockout',
	'dojo/topic',
	'dojo/dom-class',
	'map/TCDSlider',
	'map/MapModel',
	'utils/Hasher',
	'dijit/form/HorizontalSlider'
], function(React, ko, topic, domClass, TCDSlider, MapModel, Hasher, HorizontalSlider) {


	return React.createClass({

		getInitialState: function() {
			return ({
				active: this.props.active || false
			});
		},

		componentDidMount: function() {
			this.props.postCreate(this);
			var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.id) > -1,
					self = this;

			// If layer is activated from the hash in the url
			if (active) {
				this.setState({ active: active });

				if (this.props.useRadioCallback || this.props.id === 'suit') {
					topic.publish('toggleLayer', this.props.id);
				} else {
					// Call these functions on the next animation frame to give React time
					// to render the changes from its new state, the callback needs to read
					// the ui to update the layer correctly
					requestAnimationFrame(function() {
						topic.publish('updateLayer', self.props);
					});
				}
			}
			if (!this.props.kids) {

				// Create the slider
				if (document.getElementById(this.props.id + '_slider')) {
					new HorizontalSlider({
						value: 100,
						minimum: 0,
						maximum: 100,
						discreteValues: 100,
						showButtons: false,
						intermediateChanges: false,
						onChange: function(value) {
							topic.publish('changeLayerTransparency', self.props.id, self.props.layerType, value);
						}
					}, this.props.id + '_slider').startup();
				}
			}

			if (this.props.id === 'loss') {
				ko.applyBindings(MapModel.get('model'), document.querySelector('.loss-button-container'));
			}

		},

		// componentWillReceiveProps: function(nextProps, nextState) {
		//   if (nextProps.id === 'loss' || nextProps.id === 'gain') {
		//     if (!nextProps.visible) {
		//       this.setState({ 'active' : false })
		//     }
		//   }

		// },

		toggle: function(synEvent) {
			if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
				synEvent.target.className.search('dijit') < 0) {
				this.props.handle(this);
			}
		},

		showInfo: function() {
			if (document.getElementsByClassName(this.props.infoDivClass).length) {
				topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
			} else {
				topic.publish('showInfoPanel', this.props.infoDivClass);
			}
		},

		showTCDSlider: function (evt) {
			TCDSlider.show();
			evt.stopPropagation();
		},

		/* jshint ignore:start */
		render: function() {
			var className = 'layer-list-item ' +
					this.props.filter +
					(this.state.active ? ' active' : '') +
					(this.props.parent ? ' indented' : '') +
					(this.props.kids ? ' newList' : '') +
					(this.props.visible ? '' : ' hidden');


			return (
				React.createElement("li", {className: className, "data-layer": this.props.id}, 
						React.createElement("div", {id: this.props.id + '_checkbox', onClick: this.props.kids ? null : this.toggle}, 

						
							this.props.kids ? null : React.createElement("span", {className: "custom-check"}, 
								/* Used as an icon node */
								React.createElement("span", null)
							), 
						
						/* If this condition is met, render a layer info icon, else, render nothing */ 
						
							this.props.infoDivClass !== undefined ?
								React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}}) : null, 
						
						React.createElement("a", {className: "layer-title"}, this.props.title), 


						React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle), 
						
						this.props.kids ? null : React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
							React.createElement("div", {id: this.props.id + '_slider'})
						), 
						
						
							this.props.id === 'loss' ? (
								React.createElement("div", {className: 'loss-button-container' + (this.state.active ? '' : ' hidden')}, 
											React.createElement("span", {className: "loss-percentage-label"}, "Displaying at "), 
											React.createElement("span", {className: "loss-percentage-button", onClick: this.showTCDSlider, "data-bind": "text: tcdDensityValue"}), 
											React.createElement("span", {className: "loss-percentage-label"}, " density")
								)
							) : null
						

					)
				)
			);
		}
		/* jshint ignore:end */

	});

});

/** @jsx React.DOM */
define('components/RadioButton',[
	'react',
	'knockout',
	'dojo/topic',
  'dojo/dom-class',
	'utils/Hasher',
	'map/MapModel',
	'map/TCDSlider',
	'components/Check',
  'dijit/form/HorizontalSlider'
], function (React, ko, topic, domClass, Hasher, MapModel, TCDSlider, Check, HorizontalSlider) {

	var RadioButton = React.createClass({displayName: "RadioButton",

    getInitialState: function () {
      return ({ active: this.props.active || false });
    },

    componentDidMount: function () {
      this.props.postCreate(this);
      var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.id) > -1,
          self = this;

			if (active) {
				topic.publish('showLayer', this.props.id);
				this.setState({
					active: active
				});
			}

      // Create the slider if the container exists
      if (document.getElementById(this.props.id + '_slider') && !this.props.noSlider) {
        new HorizontalSlider({
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 100,
          showButtons: false,
          intermediateChanges: false,
          onChange: function (value) {
            topic.publish('changeLayerTransparency', self.props.id, self.props.layerType, value);
          }
        }, this.props.id + '_slider').startup();
      }

			if (this.props.id === 'tcd') {
				ko.applyBindings(MapModel.get('model'), document.querySelector('.tcd-button-container'));
			}

    },

    toggle: function (synEvent) {
        if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
            synEvent.target.className.search('dijit') < 0){
            this.props.handle(this);
        }
    },

    showInfo: function () {
        if(document.getElementsByClassName(this.props.infoDivClass).length){
            topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
        } else {
            topic.publish('showInfoPanel', this.props.infoDivClass);
        }
    },

		showTCDSlider: function () {
			TCDSlider.show();
		},

    /* jshint ignore:start */
    render: function () {
      var className = 'layer-list-item ' +
        this.props.filter +
        (this.state.active ? ' active' : '') +
				(this.props.parent ? ' indented' : '') +
        (this.props.forceUnderline ? ' newList' : '') +
        (this.props.visible ? '' : ' hidden');


      return (
        React.createElement("li", {className: className, "data-layer": this.props.id, "data-name": this.props.filter}, 
          React.createElement("div", {onClick: this.toggle}, 
            React.createElement("span", {className: "radio-icon"}, 
              /* Used as an icon node */
              React.createElement("span", null)
            ), 
						/* If this condition is met, render a layer info icon, else, render nothing */ 
            
              (this.props.title !== 'None' && this.props.id !== 'tcc' && !this.props.noSlider) ?
              React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}}) : null, 
            
            React.createElement("a", {className: "layer-title"}, this.props.title), 

            React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle)
          ), 
          
            this.props.children ?
              React.createElement("ul", null, " ", this.props.children.map(this._mapper), " ") :
              this.props.layerType !== 'none' && !this.props.noSlider ?
                React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
                  React.createElement("div", {id: this.props.id + '_slider'})
                ) :
                null, 
          
					
						this.props.id === 'tcd' ? (
							React.createElement("div", {className: 'tcd-button-container' + (this.state.active ? '' : ' hidden')}, 
										React.createElement("span", {className: "tcd-percentage-label"}, "Displaying at "), 
										React.createElement("span", {className: "tcd-percentage-button", onClick: this.showTCDSlider, "data-bind": "text: tcdDensityValue"}), 
										React.createElement("span", {className: "tcd-percentage-label"}, " density")
							)
						) : null
					
        )
      );
    },

    _mapper: function (item) {

      item.visible = this.state.active;
      item.handle = this.props.handle;
      item.postCreate = this.props.postCreate;
      item.useRadioCallback = true;

      if (item.type === 'radio') {
        return React.createElement(RadioButton, React.__spread({},  item));
      } else {
        return React.createElement(Check, React.__spread({},  item));
      }
    }

    /* jshint ignore:end */

  });

	return RadioButton;

});

/** @jsx React.DOM */
define('components/LayerList',[
	"react",
	"dojo/topic",
	"utils/Hasher",
	"components/RadioButton",
	"components/Check"
], function (React, topic, Hasher, RadioButton, Check) {

	var _components = [];

  var List = React.createClass({displayName: "List",

    getInitialState: function () {
      return ({
        title: this.props.title,
        filter: this.props.filter
      });


    },

    componentDidMount: function () {
    	// Component is Done, Enforce Rules or Toggle Items Here if Necessary
    	// This is probably the right spot to check to make sure only one option
    	// per radio container is selected or select none if none are selected

    	// Radio Button Groups
    	// var radioGroups = ['forest-change','forest-cover','agro-suitability'],
    	// 		noneComponent,
    	// 		foundActive;

    	// radioGroups.forEach(function (group) {
    	// 	foundActive = false;
    	// 	_components.forEach(function (component) {
    	// 		if (component.props.filter === group) {
    	// 			// Locate the none radio button
    	// 			if (component.props.id.search("none_") > -1) {
    	// 				noneComponent = component;
    	// 			}
    	// 			// Check if any are active
    	// 			if (component.state.active) {
    	// 				foundActive = true;
    	// 			}
    	// 		}
    	// 	});
    	// 	// If none are active, select the none radio button
    	// 	// if (!foundActive) {
    	// 	// 	noneComponent.setState({
    	// 	// 		active: true
    	// 	// 	});
    	// 	// }
    	// });

    },

    componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

    /* jshint ignore:start */
    render: function () {

      return (
        React.createElement("div", {className: "smart-list"}, 
          React.createElement("div", {className: this.props.title}, 
              React.createElement("div", {className: "category-icon"})
          ), 
          React.createElement("div", {className: "filter-list-title"}, this.props.title), 
          React.createElement("div", {className: "layer-line"}), 
          React.createElement("ul", {className: "filter-list"}, 
            this.props.items.map(this._mapper, this)
          )
        )
      );
    },

    _mapper: function (props) {
      props.visible = (this.state.filter === props.filter);
      props.handle = this._handle;
      props.postCreate = this._postCreate;

      if (props.type === 'radio') {
        return React.createElement(RadioButton, React.__spread({},  props));
      } else {
        return React.createElement(Check, React.__spread({},  props));
      }

    },
    /* jshint ignore:end */

    _handle: function (component) {

      if (component.props.type === 'radio') {
        this._radio(component);
      } else {
        this._check(component);
      }
    },

    _check: function (component) {
			var newState = !component.state.active;
      component.setState({
        active: newState
      });

      // if (component.props.kids) {

      //   var childComponents = [];

      //   component.props.kids.forEach(function (child) {
      //     _components.forEach(function (comp) {
      //       if (comp.props.id === child) {
      //         childComponents.push(comp);
      //       }
      //     });
      //   });

      //   childComponents.forEach(function (child) {

      //     child.setState({
      //       active: newState
      //     });

      //     //topic.publish('showLayer', child.props.id);
      //     requestAnimationFrame(function () {
      //       topic.publish('updateLayer', child.props);
      //     });
      //     Hasher.forceLayer(child.props.id, newState);
      //   });

      // } else {
      Hasher.toggleLayers(component.props.id);

      if (component.props.useRadioCallback || component.props.id === 'suit') {
        topic.publish('toggleLayer', component.props.id);
      } else {
        // Call this function on the next animation frame to give React time
        // to render the changes from its new state, the callback needs to read
        // the ui to update the layer correctly
        requestAnimationFrame(function () {
          topic.publish('updateLayer', component.props);
        });
      }
      // }



    },

    _radio: function (component) {

      var previous,
      		isNewSelection;

      _components.forEach(function (item, idx) {
        if (item.props.filter === component.props.filter) {
          if (item.state.active) {
            previous = item;
          }
        }
      });

      if (previous) {
      	isNewSelection = (previous.props.id !== component.props.id);
        if (isNewSelection) {
          if (previous.props.type !== 'check') {
            previous.setState({
              active: false
            });

            // Remove Previous Hash but ignore it if None was previous
            if (previous.props.id.search("none_") === -1) {
              Hasher.toggleLayers(previous.props.id);
              topic.publish('hideLayer', previous.props.id);
            }

            // Toggle Children for Previous if it has any
            this._toggleChildren(previous, 'remove');
          }

          // Add New if None is not selected and isNew
		      if (component.props.id.search("none_") === -1) {
		      	Hasher.toggleLayers(component.props.id);
						topic.publish('showLayer', component.props.id);
		      }

        } else {
          // The Same button was clicked twice, just disable it
          component.setState({
            active: false
          });

          this._toggleChildren(component, 'remove');
          Hasher.removeLayers(component.props.id);
          topic.publish('hideLayer', component.props.id);

        }
      } else {
        // Add New if None is not selected and isNew
	      if (component.props.id.search("none_") === -1) {
	      	Hasher.toggleLayers(component.props.id);
					topic.publish('showLayer', component.props.id);
	      }
      }

      if (isNewSelection !== false) {
        component.setState({
          active: true
        });

        this._toggleChildren(component, 'add');
      }

    },

    _toggleChildren: function (component, action) {

    	var childComponents = [];

    	if (component.props.children) {
    		component.props.children.forEach(function (child) {
    			_components.forEach(function (comp) {
    				if (comp.props.id === child.id) {
    					childComponents.push(comp);
    				}
    			});
    		});

    		if (action === 'remove') {
    			childComponents.forEach(function (child) {
    				if (child.state.active) {
  						topic.publish('hideLayer', child.props.id);
  						Hasher.removeLayers(child.props.id);
    				}
	    		});
    		} else {
    			childComponents.forEach(function (child) {
    				if (child.state.active) {
							topic.publish('showLayer', child.props.id);
							Hasher.toggleLayers(child.props.id);
    				}
	    		});
    		}
    	}

    },

    _postCreate: function (component) {
      _components.push(component);
    },

    toggleFormElement: function (id) {
      // Loop through the components
      // If the id matches, trigger the onChange callback (a.k.a. props.handle)
      _components.forEach(function (comp) {
        if (comp.props.id === id) {
          comp.props.handle(comp);
        }
      });
    }

  });

	return function (props, el) {
    /* jshint ignore:start */
		return React.render(React.createElement(List, React.__spread({},  props)), document.getElementById(el));
    /* jshint ignore:end */
	};

});

/** @jsx React.DOM */
define('components/LayerModal',[
  "react",
  "components/ModalWrapper",
  "main/config"
], function (React, ModalWrapper, MainConfig) {

  // Variables
  var config = MainConfig.layerModal;

  var LayerModal = React.createClass({displayName: "LayerModal",

    getInitialState: function () {
      return ({
        layerInfo: {}
      });

    },

    componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

    render: function() {
      var layerInfo = [];
      for (var layer in this.state.layerInfo) {
        layerInfo.push(this.state.layerInfo[layer]);
      }

      return (
          React.createElement(ModalWrapper, null, 
          !this.state.layerInfo.title ? React.createElement("div", {className: "no-info-available"}, "No information available") :
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-source"}, 
              React.createElement("h2", {className: "modal-title"}, this.state.layerInfo.title), 
              React.createElement("h3", {className: "modal-subtitle"}, this.state.layerInfo.subtitle), 
              React.createElement("div", {className: "modal-table"}, 
                !this.state.layerInfo.function ? null :
                  this.tableMap(this.state.layerInfo.function, 'function'), 
                
                
                  !this.state.layerInfo.resolution ? null :
                  this.tableMap(this.state.layerInfo.resolution, 'RESOLUTION/SCALE'), 
                
                
                  !this.state.layerInfo.geographic_coverage ? null :
                  this.tableMap(this.state.layerInfo.geographic_coverage, 'GEOGRAPHIC COVERAGE'), 
                
                
                  !this.state.layerInfo.source ? null :
                  this.tableMap(this.state.layerInfo.source, 'source data'), 
                
                
                  !this.state.layerInfo.frequency_of_updates ? null :
                  this.tableMap(this.state.layerInfo.frequency_of_updates, 'FREQUENCY OF UPDATES'), 
                
                
                  !this.state.layerInfo.date_of_content ? null :
                  this.tableMap(this.state.layerInfo.date_of_content, 'DATE OF CONTENT'), 
                
                
                  !this.state.layerInfo.cautions ? null :
                  this.tableMap(this.state.layerInfo.cautions, 'cautions'), 
                
                
                  !this.state.layerInfo.other ? null :
                  this.tableMap(this.state.layerInfo.other, 'other'), 
                
                
                  !this.state.layerInfo.license ? null :
                  this.tableMap(this.state.layerInfo.license, 'license')
                
              ), 
              React.createElement("div", {className: "modal-overview"}, 
                React.createElement("h3", null, "Overview"), 
                
                  !this.state.layerInfo.overview ? null :
                  this.summaryMap(this.state.layerInfo.overview)
                
              ), 
              React.createElement("div", {className: "modal-credits"}, 
                React.createElement("h3", null, "Citation"), 
                
                  !this.state.layerInfo.citation ? null :
                  this.summaryMap(this.state.layerInfo.citation)
                
              )
            )
          )
        
        )
     );
  },

  setData: function (data) {
      this.setState({
        layerInfo: data
      });
  },

  tableMap: function (item, label) {
    return (
      React.createElement("dl", {className: "source-row"}, 
        React.createElement("dt", null, label), 
        React.createElement("dd", {dangerouslySetInnerHTML: { __html: item}})

      )
    );
  },

  summaryMap: function (item) {
    return (
      React.createElement("div", {dangerouslySetInnerHTML: { __html: item}})
    );
  }

  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(React.createElement(LayerModal, React.__spread({},  props)), document.getElementById(el));
    /* jshint ignore:end */
	};

});

/** @jsx React.DOM */
define('components/AnalysisModal',[
  "react",
  "components/ModalWrapper",
  "dojo/cookie",
  "main/config",
  'dojo/on',
  'dojo/dom-class'
], function (React, ModalWrapper, cookie, MainConfig, on, domClass) {

  // Variables
  var config = MainConfig.analysisModal;
  var closeSvg = '<use xlink:href="#shape-close" />';
  var closeHandle;

  var AnalysisModal = React.createClass({displayName: "AnalysisModal",

    getInitialState: function () {
      return ({
        checked: false
      });
    },

    // componentWillReceiveProps: function (newProps, oldProps) {
		// 	this.setState(newProps);
		// },

    componentDidMount: function () {
      // debugger todo
    },

    toggleChecked: function () {
			this.setState({
        checked: !this.state.checked
      });
		},

    close: function () {
      if (this.state.checked === true) {
        //todo: add cookie reference and respect it somehow
        cookie('hideAnalysisModal', this.state.checked, {
            expires: 31
        });
      }
      domClass.add('analysis-modal', 'hidden');
    },

    show: function () {
      var splashScreen = cookie('hideAnalysisModal');
      if (!splashScreen) {
        domClass.remove('analysis-modal', 'hidden');
      }
    },

    render: function() {

      /** Old Modal Overview Content
      <p>Create custom analysis of your area of interest - such as a commodity concession or group of concessions - considering factors such as:</p>
      <ul className='analysis-modal-list'>
        <li>Tree cover change</li>
        <li>Fire activity</li>
        <li>Primary or intact forest areas</li>
        <li>Protected areas</li>
        <li>Legal classification of land</li>
      </ul>
      <p>You can also:</p>
      <ul className='analysis-modal-list'>
        <li>Upload your own shapefiles for analysis</li>
        <li>Draw an area of interest</li>
        <li>Sign up for alerts for clearance activity</li>
      </ul>
      */

      return (
        React.createElement("div", {className: "analysis-modal-window"}, 
        React.createElement("div", {className: "tooltipmap"}), 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-source"}, 
              React.createElement("h2", {className: "analysis-modal-title"}, "Analysis"), 

              React.createElement("div", {className: "modal-overview"}, 
                React.createElement("p", null, 
                  "Create custom analysis of your area of interest, such as a commodity concession, a jurisdiction, the sourcing area around a palm mill, or a custom area of your choice."
                ), 
                React.createElement("div", {className: "analysis-modal-hide"}, "Don't show this again", React.createElement("input", {checked: this.state.checked, onChange: this.toggleChecked, type: "checkbox"}))
              )
            )
          )
        )
        )

     );
  }

  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(React.createElement(AnalysisModal, React.__spread({},  props)), document.getElementById(el));
    /* jshint ignore:end */
	};

});

define('utils/Loader',[
    'dojo/Deferred',
    'esri/urlUtils',
    'esri/request'
], function(Deferred, urlUtils, esriRequest) {

    return {

        getTemplate: function(name) {
            var deferred = new Deferred(),
                path = './app/templates/' + name + '.html?v=2.4.13',
                req;

            req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    deferred.resolve(req.responseText);
                }
            };

            req.open('GET', path, true);
            req.send();
            return deferred.promise;
        },

        getWRITemplate: function() {
            var path = 'http://54.88.79.102/gfw-sync/metadata';
                // deferred = new Deferred(),
                // req;

            urlUtils.addProxyRule({
              urlPrefix: 'http://54.88.79.102',
              proxyUrl: '/app/php/proxy.php'
            });

            // esri.config.defaults.io.corsEnabledServers.push('54.88.79.102');
            var layersRequest = esriRequest({
                url: path,
                handleAs: 'json',
                callbackParamName: 'callback'
              }, {
                  usePost: true
              });

            return layersRequest;
            // layersRequest.then(
            //   function (response) {
            //     console.log(response);
            //     return response;
            // }, function (error) {
            //     console.log(error);
            //     return false;
            // });

            // req = new XMLHttpRequest();
            // req.onreadystatechange = function() {
            //     if (req.readyState === 4 && req.status === 200) {
            //       debugger
            //         deferred.resolve(req);
            //     }
            // };
            //
            // req.open("GET", path, true);
            // req.send();
            // return deferred.promise;
        },

        loadCSS: function(path) {
            var l = doc.createElement('link'),
                h = doc.getElementsByTagName('head')[0];
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.href = path;
            h.appendChild(l);
        }

    };

});

define('controllers/MapController',[
    'dojo/on',
    'dojo/dom',
    'dojo/query',
    'dojo/topic',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/_base/array',
    'dojo/dom-geometry',
    'dojo/number',
    'map/config',
    'map/Map',
    'map/Finder',
    'map/MapModel',
    'utils/Hasher',
    'utils/Animator',
    'utils/Helper',
    'utils/GeoHelper',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/Point',
    'esri/graphicsUtils',
    'map/Controls',
    'map/LayerController',
    'analysis/WizardStore',
    'components/LayerList',
    'components/LayerModal',
    'components/AnalysisModal',
    'utils/Loader',
    'map/Uploader',
    'map/CoordinatesModal',
    'utils/Analytics'
], function (on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, domGeom, number, MapConfig, Map, Finder, MapModel, Hasher, Animator, Helper, GeoHelper, webMercatorUtils, Point, graphicsUtils, MapControl, LayerController, WizardStore, LayerList, LayerModal, AnalysisModal, Loader, Uploader, CoordinatesModal, Analytics) {

    var initialized = false,
        mapModel,
        layerList,
        layerModal,
        analysisModal,
        dataDivLoaded = false,
        layerData,
        map;
    var infoDiv = document.createElement('infoDiv');

    return {

        /* NOTE : Set Default Layers in renderComponents at the bottom of the page,
							Hash needs to be updated before the LayerList is created */

        init: function(template) {

            var self = this,
                ids = [],
                url;

            if (initialized) {
                registry.byId("stackContainer").selectChild("mapView");
                Analytics.sendPageview("/#v=map", "Map");
                return;
            }

            initialized = true;
            registry.byId("mapView").set('content', template);
            registry.byId("stackContainer").selectChild("mapView");

            // 20141222 CRB - Added restoring of map center & level when sharing url
            var hashX =  Hasher.getHash('x');
            var hashY =  Hasher.getHash('y');
            var hashL =  Hasher.getHash('l');
            //console.log("**********************> map settings in hash: " + hashX + "/" + hashY + "/" + hashL);
            var mapOptions = {};
            for (var prop in MapConfig.mapOptions) {
                mapOptions[prop] = MapConfig.mapOptions[prop];
            }
            if (hashX !== undefined && hashX !== "") mapOptions.centerX = hashX;
            if (hashX !== undefined && hashX !== "") mapOptions.centerY = hashY;
            if (hashX !== undefined && hashX !== "") mapOptions.zoom = hashL;
            //console.log("**********************> map options:", mapOptions);

            // This is not esri map, it is custom map class, esri map object available as map.map
            map = new Map(mapOptions);

            // Set the map object to the global app variable for easy use throughout the project
            app.map = map.map;

            // On layers-loaded attempt to focus on selected feature from share url
            map.on('layers-loaded', function() {
                // Feature focus

                var feature = Hasher.getHash('f'),
                    featureArgs,
                    layer,
                    objectId,
                    selectedFeatureOptions;

                if (feature !== undefined) {
                    featureArgs = feature.split('-');

                    layer = featureArgs[0];

                    // Configure options to query for the feature & show it's correct infowindow
                    switch (layer) {
                        case 'WDPA':
                            selectedFeatureOptions = {
                                layer: layer,
                                url: MapConfig.pal.url + '/0',
                                objectId: featureArgs[1],
                                templateFunction: Finder.setWDPATemplates
                            };
                            LayerController.setSelectedFeature(selectedFeatureOptions);
                            break;
                        case 'MillPoints':
                            selectedFeatureOptions = {
                                layer: layer,
                                url: MapConfig.mill.url + '/0',
                                objectId: featureArgs[1],
                                templateFunction: Finder.setMillPointTemplates
                            };
                            LayerController.setSelectedFeature(selectedFeatureOptions);
                            break;
                        case 'Concessions':
                            selectedFeatureOptions = {
                                layer: layer + '-' + featureArgs[1],
                                url: MapConfig.concession.url + '/' + featureArgs[1],
                                objectId: featureArgs[2],
                                templateFunction: Finder.setConcessionTemplates
                            };
                            LayerController.setSelectedFeature(selectedFeatureOptions);
                            break;
                    }
                }

                var forestUse = map.map.getLayer('forestUse_commodities');

                if (forestUse) {
                  map.map.reorderLayer(forestUse, map.map.layerIds.length + 1);
                }

            });

            map.on("map-ready", function() {
                // Bind the Model to the Map Panel, and then again to the list in the header
                var extent = webMercatorUtils.webMercatorToGeographic(map.map.extent);
                var x = number.round(extent.getCenter().x, 2);
                var y = number.round(extent.getCenter().y, 2);
                var l = map.map.getZoom();

                setTimeout(function () {
                  Hasher.setHash('x', x);
                  Hasher.setHash('y', y);
                  // Hasher.setHash('l', 5);
                  // Hasher.setHash('l', l);
                }, 1000);

                mapModel = MapModel.initialize('map-container');
                // Render any React Components - These will activate any default or hashed layers
                // Only use this after the map has been loaded,
                // Also call other functions in renderComponents that build UI elements
                self.renderComponents();
                // Connect Events

                self.bindUIEvents();

                // Register Wizard Store update callbacks
                self.registerStoreCallbacks();
                // Check Hash for some defaults and react accordingly
                var wizardState = Hasher.getHash('wiz');

                if (wizardState !== undefined && wizardState === 'open') {
                    Helper.toggleWizard();
                } else {
                  analysisModal.show();
                }

                // View Controller Events
                topic.subscribe('changeView', function(newView) {
                  if (newView !== 'map') {
                    analysisModal.close();
                  }
                });
                // on.once(map.map, "extent-change", function() {
                //     o.mapExtentPausable.resume();
                // });

            });

            // Set up zoom listener for Protected Areas Layer *and now Gain Layer
            app.map.on('zoom-end', LayerController.checkZoomDependentLayers.bind(LayerController));

            // Set up Click Listener to Perform Identify
            app.map.on('click', Finder.performIdentify.bind(Finder));



            // Have the Finder create any formatter functions necessary for info window content
            // and then have it setup info window specific listeners for specific info windows with buttons
            Finder.createFormattingFunctions();
            Finder.setupInfowindowListeners();

            // Fade in the map controls, first, get a list of the ids
            dojoQuery(".gfw .map-layer-controls li").forEach(function(item) {
                ids.push(item.id);
            });
            // FadeIn fades opacity from current opacity to 1
            Animator.fadeIn(ids, {
                duration: 100
            });

            // Initialize Add This
            try {
                addthis.init();
            } catch (e) {
                dom.byId('sharing-modal').innerHTML = "Sorry.  AddThis is temporarily down.";
            }

            on(app.map.infoWindow, 'hide', function() {
                Hasher.removeKey('f');
            });

            // Infowindow feature hash updating
            // on(app.map.infoWindow, 'selection-change', function() {
            //   // if (this.features) {
            //   //   Hasher.setHash('f', this.getSelectedFeature().layer + '-' + this.getSelectedFeature().attributes.OBJECTID);
            //   // } else {
            //   //   Hasher.removeKey('f');
            //   // }

            //   if (!this.features) d.removeKey('f');

            // });

            // Priority reordering for mill points & feature url updating
            var previousFeatures;
            var replacer = ['attributes','geometry','infoTemplate','symbol'];
            var changeHandle = on.pausable(app.map.infoWindow, 'selection-change', function() {
                if (this.features) {
                    if (JSON.stringify(this.features, replacer) != JSON.stringify(previousFeatures, replacer)) {
                        var reorderedFeatures = [],
                            existsMillPoint,
                            isMillPoint,
                            self = this;

                        self.features.forEach(function(feature) {
                          isMillPoint = feature.attributes.Mill_name !== undefined;
                          if (isMillPoint) {
                            existsMillPoint = true;
                            reorderedFeatures.unshift(feature);
                          } else {
                            reorderedFeatures.push(feature);
                          }
                        });

                        if (existsMillPoint) {
                          changeHandle.pause();
                          self.hide();
                          self.clearFeatures();
                          self.setFeatures(reorderedFeatures);
                          previousFeatures = reorderedFeatures;
                          self.show(self.location, {closestFirst:false});
                          changeHandle.resume();
                        }

                    }

                    Hasher.setHash('f', this.getSelectedFeature().layer + '-' + this.getSelectedFeature().attributes.OBJECTID);

                } else {
                    Hasher.removeKey('f');
                }
            });

            Analytics.sendPageview("/#v=map", "Map");

        },

        bindUIEvents: function() {

            var self = this;

            on(app.map, 'mouse-move', function(evt) {
                MapModel.set('currentLatitude', evt.mapPoint.getLatitude().toFixed(4));
                MapModel.set('currentLongitude', evt.mapPoint.getLongitude().toFixed(4));
            });

            on(app.map, 'extent-change', function(e) {
                var delta = e.delta;
                var extent = webMercatorUtils.webMercatorToGeographic(e.extent);
                var levelChange = e.levelChange;
                var lod = e.lod;
                var map = e.target;

                var x = number.round(extent.getCenter().x, 2);
                var y = number.round(extent.getCenter().y, 2);

                Hasher.setHash('x', x);
                Hasher.setHash('y', y);
                Hasher.setHash('l', lod.level);

            });

            on(dom.byId('locator-widget-button'), 'click', function() {
                MapModel.set('showBasemapGallery', false);
                MapModel.set('showSharingOptions', false);
                MapModel.set('showLocatorOptions', !MapModel.get('showLocatorOptions'));
            });

            on(dom.byId('basemap-gallery-button'), 'click', function() {
                MapModel.set('showLocatorOptions', false);
                MapModel.set('showSharingOptions', false);
                MapModel.set('showBasemapGallery', !MapModel.get('showBasemapGallery'));
            });

            on(dom.byId('share-button'), 'click', function() {
                MapModel.set('showLocatorOptions', false);
                MapModel.set('showBasemapGallery', false);
                MapModel.set('showSharingOptions', !MapModel.get('showSharingOptions'));

                Analytics.sendEvent('Event', 'Share Button', 'User clicked the share button.');
            });

            // on(dom.byId('alert-button'), 'click', function() {
            //     Helper.toggleAlerts();
            // });

            on(dom.byId('dms-search'), 'change', function(evt) {
                var checked = evt.target ? evt.target.checked : evt.srcElement.checked;
                if (checked) {
                    MapModel.set('showDMSInputs', true);
                    MapModel.set('showLatLongInputs', false);
                }
            });

            on(dom.byId('lat-long-search'), 'change', function(evt) {
                var checked = evt.target ? evt.target.checked : evt.srcElement.checked;
                if (checked) {
                    MapModel.set('showDMSInputs', false);
                    MapModel.set('showLatLongInputs', true);
                }
            });

            on(dom.byId('search-option-go-button'), 'click', function() {
                Finder.searchAreaByCoordinates();
            });

            on(dom.byId('clear-search-pins'), 'click', function() {
                map.map.graphics.clear();
                MapModel.set('showClearPinsOption', false);
            });

            dojoQuery('.map-layer-controls li').forEach(function(node) {
                node.addEventListener('mouseenter', function () {
                  self.toggleLayerList(node);
                });
            });

            on(dom.byId('master-layer-list'), 'mouseleave', function() {
                domStyle.set('master-layer-list', 'opacity', 0.0);
                domStyle.set('master-layer-list', 'left', '-1000px');
            });

            dojoQuery('.fires_toolbox .toolbox-list li').forEach(function(node) {
                on(node, 'click', MapControl.toggleFiresLayerOptions);
            });

            on(dom.byId('high-confidence'), 'change', MapControl.toggleFiresConfidenceLevel);

            on(dom.byId('high-confidence-info'), 'click', MapControl.showFiresConfidenceInfo);

            dojoQuery('.gfw .overlays-container .overlays-checkbox').forEach(function(node) {
                on(node, 'click', MapControl.toggleOverlays);
            });

            on(dom.byId('legend-title'), 'click', function() {
                MapControl.toggleLegendContainer();
            });

            on(dom.byId('reset-suitability'), 'click', function() {
                MapControl.resetSuitabilitySettings();
            });

            on(dom.byId('export-suitability'), 'click', function() {
                MapControl.exportSuitabilitySettings();
            });

            on(dom.byId('close-suitability'), 'click', function() {
                // Pass in the key from the MapConfig.LayerUI
                // for Custom Suitability Layer
                self.toggleItemInLayerList('suit');
            });

            on(dom.byId('wizard-tab'), 'click', function() {
                analysisModal.close();
                Helper.toggleWizard();
            });

            // Click info icon in suitabiliyy tools container for all sliders
            dojoQuery('.suitability-accordion .slider-name .layer-info-icon').forEach(function(node) {
                on(node, 'click', function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataClass = target.dataset ? target.dataset.class : target.getAttribute('data-class');
                    self.showInfoPanel(dataClass);
                });
            });

            // Click info icon in suitabiliyy tools container for Headers of sections of checkboxes
            dojoQuery('.suitability-accordion .criteria-separator .layer-info-icon').forEach(function(node) {
                on(node, 'click', function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataClass = target.dataset ? target.dataset.class : target.getAttribute('data-class');
                    self.showInfoPanel(dataClass);
                });
            });

            on(dom.byId('upload-form'), 'change', Uploader.beginUpload.bind(Uploader));
            on(document.querySelector('.coordinates-modal-enter-button'), 'click', CoordinatesModal.savePoint.bind(CoordinatesModal));

        },

        registerStoreCallbacks: function() {
            // TODO: refactor keys to reference config
            // TODO: refactor below sets to an init phase for the WizardStore
            WizardStore.set('customFeatures', []);
            WizardStore.set('removedCustomFeatures', []);
            WizardStore.set('selectedCustomFeatures', []);
            WizardStore.set('selectedPresetFeature', null);
            WizardStore.registerCallback('customFeatures', function() {
                var layer = map.map.getLayer(MapConfig.customGraphicsLayer.id),
                    storeGraphics = WizardStore.get('customFeatures'),
                    graphicsLengthDifference = layer.graphics.length - storeGraphics.length,
                    addGraphics,
                    removeGraphics;

                addGraphics = function() {
                    storeGraphics.slice(layer.graphics.length - storeGraphics.length).forEach(function(graphic) {
                      if (graphic.geometry.type === 'point') {
                        var circle = GeoHelper.preparePointAsPolygon(graphic, 50);
                        layer.add(circle);
                      } else {
                        layer.add(graphic);
                      }
                    });
                };

                removeGraphics = function() {
                    WizardStore.get('removedCustomFeatures').forEach(function (feature) {
                      if (feature.geometry.type === 'point') {
                        var fieldName = 'WRI_ID';
                        GeoHelper.removeGraphicByField(layer.id, fieldName, feature.attributes[fieldName]);
                      } else {
                        layer.remove(feature);
                      }
                    });
                };

                if (storeGraphics.length > 0 && graphicsLengthDifference < 0) {
                    addGraphics();
                } else if (graphicsLengthDifference > 0) {
                    removeGraphics();
                } else if (storeGraphics.length === 0) {
                    layer.clear();
                }
            });

            WizardStore.registerCallback('selectedCustomFeatures', function() {
              var selectedFeatures = WizardStore.get('selectedCustomFeatures');

              if (selectedFeatures.length > 0) {
                map.map.setExtent(graphicsUtils.graphicsExtent(selectedFeatures), true);
              }
            });

        },

        toggleLayerList: function(el) {
            var filter = el.dataset ? el.dataset.filter : el.getAttribute('data-filter'),
                newclass = el.dataset ? el.dataset.class : el.getAttribute('data-class'),
                position = domGeom.position(el, true),
                containerWidth = 180,
                offset;

            // 200 is the default width of the container, to keep it centered, update containerWidth
            offset = (position.w - containerWidth) / 2;
            domStyle.set('master-layer-list', 'left', (position.x + offset) + 'px');

            // Show the Container
            Animator.fadeIn('master-layer-list', {
                duration: 100
            });
            // Add the Appropriate Class so the Items display correct color, styling etc.
            domClass.remove('master-layer-list');
            domClass.add('master-layer-list', newclass);

            // Update the list, reuse the title from the first anchor tag in the element (el)
            if (layerList) {
                layerList.setProps({
                    title: el.children[0].innerHTML,
                    filter: filter
                });
            }
        },

        renderComponents: function() {

            // Set Default Layers Here if none are present in the URL
            // Current Default Layers(lyrs) are tcc and loss
            var state = Hasher.getHash();
            // If state.lyrs is undefined, set hash, otherwise, load the layers already there
            if (state.lyrs === undefined) {
                Hasher.toggleLayers('tcc');
                Hasher.toggleLayers('loss');
            }

            MapControl.generateSuitabilitySliders();

            layerList = new LayerList({
                items: MapConfig.layersUI
            }, 'master-layer-list');

            layerModal = new LayerModal({
            }, 'layer-modal');

            analysisModal = new AnalysisModal({
            }, 'analysis-modal');

            MapControl.generateTimeSliders();

        },


        toggleItemInLayerList: function(key) {
            layerList.toggleFormElement(key);
        },

        toggleItemInLayerListOff: function() {

          var mapLayer = map.map.getLayer('forestUse_landUse');
          console.log(mapLayer);

          if (mapLayer.visible === true) {
            if (mapLayer.visibleLayers.indexOf(0) > -1) {
              layerList.toggleFormElement('logPerm');
            }
            if (mapLayer.visibleLayers.indexOf(2) > -1) {
              layerList.toggleFormElement('minePerm');
            }
            if (mapLayer.visibleLayers.indexOf(1) > -1) {
              layerList.toggleFormElement('oilPerm');
            }
            if (mapLayer.visibleLayers.indexOf(3) > -1) {
              layerList.toggleFormElement('woodPerm');
            }
          }
        },

        updateLayerModalData: function(data) {
            layerModal.setData(data);
        },

        centerChange: function(x, y, zoom) {
            //compare current center and change if different
            if (!initialized) {
                return; //map not initialized yet
            }
            // var currentExtent = webMercatorUtils.webMercatorToGeographic(map.map.extent);

            var extent = webMercatorUtils.webMercatorToGeographic(map.map.extent);
            x = number.round(extent.getCenter().x, 2);
            y = number.round(extent.getCenter().y, 2);
            var l = map.map.getLevel();

            // Hasher.setHash('x', x);
            // Hasher.setHash('y', y);
            // Hasher.setHash('l', 5);
            //var newState = HashController.newState;
            //console.log(Hasher.getHash());
            var state = Hasher.getHash();

            // Hasher.toggleLayers('tcc');
            // Hasher.toggleLayers('loss');


            var centerChangeByUrl = ((parseFloat(state.x) !== x) || (parseFloat(state.y) !== y) || (parseInt(state.l) !== l));
            //console.log(centerChangeByUrl + ' ' + state.y + " " + state.x);
            if (centerChangeByUrl) {
                //o.mapExtentPausable.pause();
                // on.once(map.map, "extent-change", function() {
                //     o.mapExtentPausable.resume();
                // });
                var ptWM = webMercatorUtils.geographicToWebMercator(new Point(parseFloat(state.x), parseFloat(state.y)));

                map.map.centerAndZoom(ptWM, parseInt(state.l));

                // Hasher.setHash(x, xValue);
                // Hasher.setHash(y, yValue);
            }
        },

        showInfoPanel: function(infoPanelClass) {//"forest-change-tree-cover-loss"
            var content = '';
            if (typeof (infoPanelClass) === 'object') {
                content = infoPanelClass;
                MapControl.createDialogBox(content);
            } else {

                infoPanelClass = MapConfig.metadataIds[infoPanelClass];
                console.log(infoPanelClass);
                if (dataDivLoaded) {

                    var metadata = layerData[infoPanelClass];
                    if (metadata) {

                      layerModal.setData(metadata);
                      var node = layerModal.getDOMNode();
                      domClass.remove(node.parentNode, 'hidden');
                    }

                } else {

                  var getTemplate = Loader.getWRITemplate();

                  getTemplate.then(function(data) {
                    dataDivLoaded = true;
                    layerData = data;
                    var metadata = data[infoPanelClass];

                    if (metadata) {
                      layerModal.setData(metadata);
                      var node = layerModal.getDOMNode();
                      domClass.remove(node.parentNode, 'hidden');
                    }

                  });

                }
            }
        }
    };

});

define('utils/NavListController',[
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/hash",
    "dojo/io-query",
    "utils/Hasher",
    "utils/Analytics"
], function (dom, query, domClass, domStyle, hash, ioQuery, Hasher, Analytics){

    // Utility Function
    // Convert DATA ANALYSIS to Data Analysis and ABOUT GFW to About GFW
    function convertToCamelCase (string) {
      return string.replace(/\w*/g, function(txt) {
        return txt === 'GFW' ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    return {

        loadNavControl: function (context){
            query(".nav-item").forEach(function(node){

                if(node.id.indexOf(context) > -1){
                    //Add the a link function
                    node.onclick = function (){
                        changeNavItem (node, context);
                    };
                }
            });


            // query(".nav-link-more").forEach(function(node){
            //     node.onclick = function (){
            //         changeNavItemAbout(node, "about");
            //     };
            // });

            function changeNavItem (node, context) {

                query(".nav-item-a.selected ").forEach(function(selectedDiv){
                    if(selectedDiv.parentElement.id.indexOf(context) > -1){
                        domClass.remove(selectedDiv, "selected");
                        domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
                        domClass.remove(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "selected");
                    }
                });

                //Add 'selected' css class to nav list
                domClass.add(node.children[0], "selected");

                //Displays corresponding information div
                domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");

                //clear old selected # in url

                //add new selected # in url
                //extract nav title
                var navTitle = node.id;
                navTitle = navTitle.replace("Nav", "").replace(context, "");

                Hasher.setHash("n", navTitle);


                // Camel Case the label and construct a clean url with minimal parameters
                var analyticsTitle = convertToCamelCase(context) + ' - ' + convertToCamelCase(node.children[0].innerHTML);
                var url = "/#v=" + context + "&n=" + navTitle;
                Analytics.sendPageview(url, analyticsTitle);
            }


        },

        loadNavView: function (context){

          // debugger
            var state = ioQuery.queryToObject(hash());
            var needsDefaults = true;
            var activeNode;

            if(state.hasOwnProperty("n")){
                //set selected nav-item
                query(".nav-item").forEach(function(node){
                    //check that its in appropriate context
                    if(node.id.indexOf(context) > -1){
                        //if node matches #, set to selected

                        if(state.n === node.id.replace("Nav", "").replace(context, "")){
                            domClass.add(node.children[0], "selected");
                            domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");
                            domClass.add(node.id.match(/(.*)Nav/)[1], "selected");
                            needsDefaults = false;
                            activeNode = node.children[0];
                        }
                    }
                    if (!activeNode) {
                      query(".nav-item-a.default-selection").forEach(function(node){
                          if(node.parentElement.id.indexOf(context) > -1){
                              domClass.add(node, "selected");
                              activeNode = node;
                          }
                      });
                      query(".nav-subpage.default-selection").forEach(function(node){
                          if(node.id.indexOf(context) > -1){
                              domStyle.set(node, "display", "block");
                          }
                      });
                    }
                });
            } else {
            // if(needsDefaults){
                query(".nav-item-a.default-selection").forEach(function(node){
                    if(node.parentElement.id.indexOf(context) > -1){
                        domClass.add(node, "selected");
                        activeNode = node;
                    }
                });
                query(".nav-subpage.default-selection").forEach(function(node){
                    if(node.id.indexOf(context) > -1){
                        domStyle.set(node, "display", "block");
                    }
                });
            }
            if(state.hasOwnProperty("s")){
                if (dom.byId(state.s)) {
                    dom.byId(state.s).checked = true;
                }
            }

            // Camel Case the label and construct a clean url with minimal parameters
            if (activeNode) {
              var analyticsTitle = convertToCamelCase(context) + ' - ' + convertToCamelCase(activeNode.innerHTML);
              var subPage = activeNode.parentElement.id.replace("Nav", "").replace(context, "");
              var url = "/#v=" + context + "&n=" + subPage;
              Analytics.sendPageview(url, analyticsTitle);
            }


        },

        urlControl: function (view) {
            //Page should be loaded, set URL
            //state object used to create url with dojo hasher
            var state = {};
            var divs;
            var i;

            state.v = view;

            //Grab selected nav items and add them to state oject
            var nodes = query(".nav-item-a.selected");
            if(nodes.length > 0){
                nodes.forEach(function(node){
                    if(node.parentElement.id.indexOf(view) > -1){
                        state.n = node.parentElement.id.replace("Nav", "").replace(view, "");
                    }
                });
            } else {
                if(state.n) {
                    delete state.n;
                }
            }

            //Grab subpage mapped from nav item and add to state object
            divs = document.getElementsByTagName('input');
            for(i=0; i < divs.length; i++) {
                if(divs[i].checked){
                    state.s = divs[i].id;
                } else {
                    if(state.s){
                        delete state.s;
                    }
                }
            }

            //Find checked divs in data page
            //Only in data page, check context (view)
            var dataClickablesNeedsCleared = true;
            divs = document.getElementsByTagName('input');
            for(i=0; i < divs.length; i++) {
                if(divs[i].checked){
                    state.s = divs[i].id;
                    dataClickablesNeedsCleared = false;
                }
            }

            var onDataPage = (view.indexOf("data") > -1);
            if(dataClickablesNeedsCleared || !onDataPage){
                if(state.s){
                    delete state.s;
                }
            }
            Hasher.setHashFromState(state);
        }


    };
});

define('controllers/Header',[
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/query",
    "dojo/hash",
    "dojo/dom-class",
    "dojo/io-query",
    "dijit/Dialog",
    "utils/Hasher",
    'utils/Helper',
    "main/config",
    "utils/NavListController"
], function(on, dom, domStyle, query, hash, domClass, ioQuery, Dialog, Hasher, Helper, AppConfig, NavListController) {
    'use strict';

    var state = 'large', // large, small, or mobile
        initialized = false;

    return {

        init: function(template) {

            if (initialized) {
                return;
            }

            // This is most likely the culprit for why gfw-assets must be loaded in the footer after this content
            // is injected
            dom.byId("app-header").innerHTML = dom.byId("app-header").innerHTML + template;

            this.bindEvents();

            initialized = true;

        },

        setState: function(newState) {
            domClass.remove('app-header', state);
            domClass.add('app-header', newState);
            state = newState;
        },

        bindEvents: function() {
            var self = this;

            query(".header .nav-link").forEach(function(item) {
                on(item, "click", function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataView = target.dataset ? target.dataset.view : target.getAttribute('data-view'),
                        external = target.dataset ? target.dataset.external : target.getAttribute('data-external');

                    self.updateView(dataView, external, initialized);
                });
            });

            query("#dijit_Dialog_0 > div.dijitDialogPaneContent > p > a").forEach(function(item) {
                on(item, "click", function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataView = "map",
                        external = false;
                    //$('#dijit_Dialog_0').dialog("close");
                    //$('#dijit_Dialog_0').close();
                    $("#dijit_Dialog_0 > div.dijitDialogTitleBar > span.dijitDialogCloseIcon").click();
                    self.updateView(dataView, external, initialized);
                });
            });


            query(".nav-link-more").forEach(function(node){
                node.onclick = function (){
                    self.changeNavItemAbout(node, "about");
                };
            });

            var handlerIn = function() {
                $("#learn-more-dropdown").removeClass('hidden');
            }
            var handlerOut = function() {
                $("#learn-more-dropdown").addClass('hidden');
            }

            $("#learnMoreItem").mouseenter(handlerIn).mouseleave(handlerOut);

            setTimeout(function () {
              $("#footerSelecter").click(function() {
                self.addSubscriptionDialog();
              });
              $('.arrow-down-icon').click( function() {
                $('html body').animate({
                  scrollTop: $(".arrow-down-icon").offset().top
                }, 1500);
              });
              $('#get-started__button').click(function () {
                $('#tooltip-getstarted').toggleClass('display');
              });
            }, 200);
        },

        changeNavItemAbout: function(node, context) {
                query(".nav-item-a.selected ").forEach(function(selectedDiv){

                    if(selectedDiv.parentElement.id.indexOf(context) > -1){

                        domClass.remove(selectedDiv, "selected");
                        domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
                        domClass.remove(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "selected");
                    }
                });

                var state = ioQuery.queryToObject(hash());

                //if we're on the about page already, dont reset view
                if (state.v != "about") {
                    Hasher.setHash("v", "about");
                    Hasher.setHash("n", node['dataset'].src);

                } else {
                    Hasher.setHash("n", node['dataset'].src);
                }

                var replacementNode;
                switch (node['dataset'].src) {
                    case "GFW":
                        replacementNode = $("#aboutGFWNav");
                        break;
                    case "History":
                        replacementNode = $("#aboutHistoryNav");
                        break;
                    case "Partners":
                        replacementNode = $("#aboutPartnersNav");
                        break;
                    case "Videos":
                        replacementNode = $("#aboutVideosNav");
                        break;
                    case "Users":
                        replacementNode = $("#aboutUsersNav");
                        break;
                    default:
                        replacementNode = $("#aboutGFWNav");
                        break;
                }



                if (replacementNode[0]) {
                   // //if node matches #, set to selected
                    if (node['dataset'].src === replacementNode[0].id.replace("Nav", "").replace(context, "")){

                        domClass.add(replacementNode[0].children[0], "selected");
                        domStyle.set(replacementNode[0].id.match(/(.*)Nav/)[1], "display", "block");
                        domClass.add(replacementNode[0].id.match(/(.*)Nav/)[1], "selected");
                        // needsDefaults = false;
                        // activeNode = replacementNode[0].children[0];
                    }
                }


            },

        updateView: function(view, isExternal, initialized) {
          console.log(view);

            if (isExternal === "true") {
                this.redirectPage(view);
                return;
            }

            if (view === 'map-wizard') {
              window.open(window.location.pathname + '#v=map&lyrs=tcc%2Closs%2Cmill%2CgfwMill&x=143.48&y=1.66&l=3&wiz=open', '_self');
              return;
            } else if (view === 'map-analysis') {
              window.open(window.location.pathname + '#v=map&lyrs=oilPerm%2CrspoPerm%2ClogPerm%2CminePerm%2CwoodPerm&x=143.48&y=1.66&l=3&wiz=open', '_self');
              return;
            } else if (view === 'map-supplier') {
              window.open(window.location.pathname + '#v=map&x=104.27&y=1.96&l=5&lyrs=tcc%2Closs%2Cmill%2CgfwMill&wiz=open', '_self');
              return;
            } else if (view === 'map-palm') {
              window.open(window.location.pathname + '#v=map&lyrs=rspoPerm&x=-150.13&y=-1.9&l=3', '_self');
              return;
            }

            query(".header .nav-link.selected").forEach(function(node) {
                domClass.remove(node, 'selected');
            });

            query('.nav-link-list [data-view="' + view + '"]').forEach(function(node) {
                domClass.add(node, "selected");
            });

            if (initialized) {
              // if (addOn === 'wizard') {
              //   window.open('http://commodities.globalforestwatch.org/#v=map&x=143.48&y=1.66&l=3&lyrs=tcc%2Closs%2Cmill%2CgfwMill&wiz=open');
                // if (app.map) {
                //   var hash = Hasher.getHash();
                //   Hasher.setHash('lyrs', 'mill,gfwMill');
                //   if (wizard && hash.wiz !== 'open') {
                //     Helper.toggleWizard();
                //   }
                // } else {
                //   Hasher.setHash('lyrs', 'mill,gfwMill');
                //   Hasher.setHash("wiz", 'open');
                // }
                // Hasher.setHash("v", view);
              // } else if (addOn === 'analysis') {
              //   window.open('http://commodities.globalforestwatch.org/#v=map&x=143.48&y=1.66&l=3&lyrs=tcc%2Closs%2Cmill%2CgfwMill&wiz=open');
                // if (app.map) {
                //   //nope, here we will just open the correct URL in the SAME WINDOW
                //   var hash = Hasher.getHash();
                //   //todo: make a way to turn all of these layers on! Once the map is loaded, it does not
                //   // respect the hash. Also do this for mills above. Maybe publish a topic that we listen
                //   // to, to turn on all of the correct layers?
                //   // debugger
                //   Hasher.setHash('lyrs', 'oilPerm,rspoPerm,logPerm,minePerm,woodPerm');
                //   if (wizard && hash.wiz !== 'open') {
                //     Helper.toggleWizard();
                //   }
                // } else {
                //   Hasher.setHash('lyrs', 'oilPerm,rspoPerm,logPerm,minePerm,woodPerm');
                //   Hasher.setHash("wiz", 'open');
                // }
                Hasher.setHash("v", view);
              // }
            }

        },

        toggleForView: function(view) {
            if (view === 'map') {
                this.setForMap();
            } else if (view === 'home') {
                this.setForHome();
            } else {
                this.setForGenericView();
            }
        },

        setForMap: function() {
            domClass.add("nav-content", "outer");
            domClass.remove("nav-content", "inner");
            domClass.add("app-header", "mapView");
            domClass.remove("app-header", "generalView");
        },

        setForGenericView: function() {
            this.setForHome();
            //domClass.add("nav-content", "outer");
            //domClass.remove("nav-content", "inner");
            domClass.remove("app-header", "mapView");
            domClass.add("app-header", "generalView");
            //domClass.remove("footerModesContainer", "generalView");
            $(".footerModesContainer").hide();

            // Resize the page here!

        },

        setForHome: function() {
            domClass.add("nav-content", "inner");
            domClass.remove("nav-content", "outer");
            domClass.remove("app-header", "mapView");
            domClass.remove("app-header", "generalView");
            $(".footerModesContainer").show();
        },

        redirectPage: function(view) {
            window.open(AppConfig.urls[view], "_blank");
        },

        addSubscriptionDialog: function() {
            this.dialog2 = new Dialog({
                style: 'width: 300px; text-align: center;'
            });
            var self = this;
            var content = '<p>To sign up for tree clearance or fire alerts go to the <span id="goToMapFromDialog">Map</span>, turn on a data layer from the Forest Use or Conservation drop-down tabs, select an area on the map, and click "Subscribe".</p>';

            this.dialog2.setContent(content);

            $("#goToMapFromDialog").css("color", "#e98300");
            $("#goToMapFromDialog").css("cursor", "pointer");
            $("#goToMapFromDialog").css("font-weight", "bold");

            $("#goToMapFromDialog").click(function(){
              self.dialog2.destroy();
              self.updateView("map", false, true);

            });

            $("#dijit_Dialog_0 > div.dijitDialogPaneContent").css("margin-top", "-30px");
            $("#dijit_Dialog_0 > div.dijitDialogPaneContent").css("margin-bottom", "-10px");

            this.dialog2.show();

        }


    };

});

define('controllers/Footer',[
    'dojo/query',
    'dojo/dom',
    'dojo/dom-style'
], function(dojoQuery, dom, domStyle) {

    var initialized = false;

    return {

        init: function(template) {

            if (initialized) { return; }

            initialized = true;

            // This is most likely the culprit for why gfw-assets must be loaded in the footer after this content
            // is injected
            dom.byId('app-footer').innerHTML = template + dom.byId('app-footer').innerHTML;

            // Inject Header and Footer from GFW, This must be loaded here
            // until the architecture gets cleaned up or else things break
            var s = document.createElement('script'),
                h = document.getElementsByTagName('head')[0];

            // latest
            // s.src = 'http://globalforestwatch.org/gfw-assets';

            //test
            // s.src = 'https://cdn.rawgit.com/simbiotica/gfw_assets/3862c199249e4acc7407c4c9ba615d0a20025a61/js/build/production.js';
            // s.src = 'https://cdn.rawgit.com/simbiotica/gfw_assets/c821fe8f7c5dc545d78be491074621/js/build/production.js';
            s.src = 'http://gfw-assets.s3.amazonaws.com/static/gfw-assets.latest.js';

            s.async = true;
            s.setAttribute('id', 'loader-gfw'); // this is very important
            s.setAttribute('data-current', '.shape-commodities'); // fire"s" the "s" is necessary
            h.appendChild(s);
        },

        toggle: function(hide) {
            if (hide) {
                domStyle.set('app-footer', 'display', 'none');
            } else {
                domStyle.set('app-footer', 'display', 'block');
            }
        }

    };

});

/* global define */
define('models/HomeModel',[
        "dojo/_base/declare",
        "main/config",
        "knockout"
    ],
    function(declare, AppConfig, ko) {

        var Model = declare(null, {
            constructor: function(el) {
                Model.vm = {};
                Model.root = el;
                // Create Model Properties
                Model.vm.homeModeOptions = ko.observableArray(AppConfig.homeModeOptions);
                //console.log(AppConfig.homeModeOptions);

                Model.vm.dataSubmit = function(obj, evt) {
                    debugger
                }
                Model.vm.modeSelect = function(obj, evt) {
                    var eventName = obj.eventName;
                    console.log(obj);
                    require(["controllers/HomeController"], function(HomeController) {
                        HomeController.handleModeClick(eventName);
                    })
                }
                Model.vm.dotSelect = function(obj, evt) {
                    //var eventName = obj.eventName;
                    //var id = obj.id;
                    //debugger;
                    require(["controllers/HomeController"], function(HomeController) {
                        HomeController.handleDotClick(obj);
                    })
                }
                // Apply Bindings upon initialization
                ko.applyBindings(Model.vm, document.getElementById(el));

            }

        });

        Model.get = function(item) {
            return item === 'model' ? Model.vm : Model.vm[item]();
        };

        Model.set = function(item, value) {
            Model.vm[item](value);
        };

        Model.applyTo = function(el) {
            ko.applyBindings(Model.vm, document.getElementById(el));
        };

        Model.initialize = function(el) {
            if (!Model.instance) {
                Model.instance = new Model(el);
            }
            return Model.instance;
        };

        return Model;

    });

define('controllers/HomeController',[
    "main/config",
    "dojo/dom",
    "dojo/cookie",
    "dijit/Dialog",
    "dijit/registry",
    "dojo/_base/array",
    "models/HomeModel"
], function(AppConfig, dom, cookie, Dialog, registry, arrayUtil, HomeModel) {
    'use strict';


    var o = {};
    var initialized = false;
    var viewName = "homeView";
    var viewObj = {
        viewId: "homeView",
        viewName: "home"
    };


    var stopAnimation = false;


    o.startModeAnim = function() {

        var currentNodeId = 0; //start with last one

        var currentModeOption = function(id) {

            var homeModeOptions = HomeModel.vm.homeModeOptions();
            var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {

                if (i === id) {
                    //alert(i);
                    hmOpt.display = true;
                } else {
                    hmOpt.display = false;
                }
                return hmOpt;
            });
            HomeModel.vm.homeModeOptions([]);
            HomeModel.vm.homeModeOptions(mappedHomModeOptions);
        };

        currentModeOption(currentNodeId);

        require(["dojo/fx", "dojo/_base/fx", "dojo/query"], function(coreFx, baseFx, dojoQuery) {

            var runAnimation = function(id) {

                var itemsToAnimate = dojoQuery(".modeGroup");
                var maxItems = itemsToAnimate.length;
                //var maxItems = 5;

                var anim = coreFx.chain([

                    baseFx.animateProperty({
                        node: itemsToAnimate[id],
                        properties: {
                            marginLeft: {
                                start: 0,
                                end: -350
                            },
                            opacity: {
                                start: 1,
                                end: 0
                            }
                        },
                        onEnd: function() {
                            var nextNodeId;
                            if (currentNodeId < maxItems - 1) {
                                nextNodeId = currentNodeId + 1;
                                currentNodeId++;
                            } else {
                                nextNodeId = 0;
                                currentNodeId = 0;
                            }

                            setTimeout(function() {
                                if (!stopAnimation) {
                                    currentModeOption(nextNodeId);
                                    setTimeout(function() {
                                        if (!stopAnimation) {
                                            runAnimation(nextNodeId);
                                        }

                                    }, 1000);
                                }
                            }, 250); //Time between animations but before the next circle appears
                        },
                        units: "px",
                        duration: 1000, //Time it takes the circle to slide left and dissipate
                        delay: 2000 // Time we wait to animate on Load
                    })

                ]);
                anim.play();
            };
            runAnimation(currentNodeId);
        });

    };

    o.stopModeAnim = function(data) {
        stopAnimation = true;

        if (data) {
            //o.startModeAnim(data.id);

            var currentNodeId = data.id;

            var homeModeOptions = HomeModel.vm.homeModeOptions();
            HomeModel.vm.homeModeOptions([]);

            var mappedHomModeOptions = arrayUtil.map(homeModeOptions, function(hmOpt, i) {

                if (currentNodeId == i) {
                    hmOpt.display = true;
                } else {
                    hmOpt.display = false;
                }
                HomeModel.vm.homeModeOptions.push(hmOpt);
                return hmOpt;
            });
        }

    };

    // o.isInitialized = function() {
    //     return initialized;
    // };


    return {

        init: function(template) {

            if (initialized) {
                registry.byId("stackContainer").selectChild("homeView");
                return;
            }
            initialized = true;
            registry.byId("stackContainer").selectChild("homeView");
            registry.byId("homeView").set('content', template);

            HomeModel.initialize("homeView");
            o.startModeAnim();

            // GFW Requested to remove this feature
            // Commenting out for now in case it needs to be added back in
            // Show the Splash Info Window
            // this.showSplashScreen();

        },

        handleModeClick: function(eventName) {
            require(["controllers/Header"], function(Header) {
              console.log(eventName);
                if (eventName == "goToMap") {
                    Header.updateView("map", false, true);
                } else if (eventName == "goToWizard") {
                    Header.updateView("map-wizard", false, true);
                } else if (eventName == "goToAnalysis") {
                  Header.updateView("map-analysis", false, true);
                } else if (eventName == "goToSupplier") {
                  Header.updateView("map-supplier", false, true);
                } else if (eventName == "goToPalm") {
                    Header.updateView("map-palm", false, true);
                } else if (eventName == "goToFires") {
                    Header.updateView("fires", "true", true);
                } else if (eventName == "goToBlogs") {
                    Header.updateView("blog", "true", true);
                } else if (eventName == "goToZSL") {
                    Header.updateView("SPOTT", "true", true);
                }

            });

        },

        handleDotClick: function(obj) {
            o.stopModeAnim(obj);

            //o.startModeAnim(obj.id);
        },

        showSplashScreen: function () {
            // Dialog
            // Cookie
            var splashScreen = cookie("hideSplashScreen"),
                checkboxContent,
                dialog,
                value;

            if (!splashScreen) {
                checkboxContent = "<label><input id='hideSplashScreen' type='checkbox' />&nbsp;&nbsp;Don't ask me again.</label>";
                dialog = new Dialog({
                    id: 'splashDialog',
                    title: 'Welcome to GFW Commodities Analyzer',
                    style: 'width: 510px;',
                    content: AppConfig.homeDialog.html + checkboxContent
                });
                dialog.show();

                dialog.on('cancel', function () {
                    value = document.getElementById('hideSplashScreen').checked;
                    if (value) {
                        cookie("hideSplashScreen", value, {
                            expires: 31
                        });
                    }
                });
            }

        }

    };

});

define('controllers/AboutController',[
	"dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
	"dijit/registry",
	"utils/Hasher",
    "utils/NavListController"
], function (dom, query, domClass, domStyle, registry, Hasher, NavListController) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {

			if (initialized) {
				registry.byId("stackContainer").selectChild("aboutView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("aboutView");
			registry.byId("aboutView").set('content', template);

            var context = "about";

            // Hasher.setHash("n", "videos");

            // debugger

            NavListController.loadNavControl(context);
            // if (newContext) {
            // 	NavListController.loadNavView(newContext);
            // } else {
            NavListController.loadNavView(context);
            // }


		}

	};

});

define('controllers/DataController',[
    "dijit/registry",
    "utils/NavListController",
    "utils/Hasher",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-style",
], function (registry, NavListController, Hasher, dom, query, domClass, domStyle) {
    'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("dataView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("dataView");
			registry.byId("dataView").set('content', template);

            var context = "data";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

            var divs = document.getElementsByTagName('input');
            for(var i=0; i < divs.length; i += 1) {
                divs[i].onclick = function(){
                    if(this.checked){
                        Hasher.setHash("s", this.id);
                    } else {
                        Hasher.removeKey("s");
                    }
                    //need to close all other checked boxes
                    //so only one can be open at a time.
                    for(var j=0; j<divs.length; j++){
                        if(divs[j] !== this){
                            divs[j].checked = false;
                        }
                    }
                };
            }

			this.initializeCountryDropdowns();
		},

		initializeCountryDropdowns: function () {

			var dropdowns = document.getElementsByClassName('source_download_container');
			var options = document.getElementsByClassName('source_dropdown_body');

			if(dropdowns.length > 0){
				[].map.call(dropdowns, function(dropdown) {
					dropdown.onchange = function(){
						[].map.call(options, function(option){
							if(option.value !== "none"){
								option.className = 'source_dropdown_body';
							}
						});
						var selectedValue = dropdown.options[dropdown.selectedIndex].value;
						if(selectedValue !== "none"){
							var countryInfo = document.getElementById(selectedValue)
							countryInfo.className = countryInfo.className + " active";
						}
					}
				});
			}
		}

	};

});
define('controllers/MethodsController',[
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "utils/NavListController"
], function (dom, query, domClass, domStyle, registry, NavListController) {
    'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("methodsView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("methodsView");
			registry.byId("methodsView").set('content', template);

            var context = "methods";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

		}

	};

});
define('controllers/PublicationsController',[
	"dojo/dom",
	"dijit/registry"
], function (dom, registry) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("publicationsView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("publicationsView");
			registry.byId("publicationsView").set('content', template);

		}

	};

});
/** @jsx React.DOM */
define('components/SubmitWrapper',[
  'react',
  'dojo/dom-class'
], function (React, domClass) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

  var SubmitWrapper = React.createClass({displayName: "SubmitWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "submit-background", onClick: this.close}), 
        React.createElement("div", {className: "modal-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }

  });

  // return function (props, el) {
  //   /* jshint ignore:start */
  //   return React.render(<ModalWrapper />, document.getElementById(el));
  //   /* jshint ignore:end */
  // };
  return SubmitWrapper;

});

/** @jsx React.DOM */
define('components/SubmitModal',[
	'react',
	'components/SubmitWrapper',
  'dojo/dom-class',
  'map/config'
], function (React, SubmitWrapper, domClass, MapConfig) {

	// Variables
	var submitConfig = MapConfig.submitMessages;

	var SubmitModal = React.createClass({displayName: "SubmitModal",

		getInitialState: function() {
			return {
				activeMessage: ''
			};
		},

		render: function() {
			return (
				React.createElement(SubmitWrapper, null, 
					React.createElement("div", {className: "submit-window"}, 
            submitConfig.map(this.itemMapper, this)
					)
				)
			);
		},

    itemMapper: function (item) {
			return React.createElement("div", {className: item.domClass}, 
				React.createElement("div", {id: item.domId, className: ((this.state.activeMessage === item.domId ? '' : ' hidden'))}, item.message)
			);
		},

    // <div id='storyName' className={`${this.state.activeMessage === 'storyName' ? '' : ' hidden'}`}></div>
    // <div id='storyCompany' className={`${this.state.activeMessage === 'storyCompany' ? '' : ' hidden'}`}></div>
    // <div id='storyPosition' className={`${this.state.activeMessage === 'storyPosition' ? '' : ' hidden'}`}></div>

		close: function () {
			var node = React.findDOMNode(this).parentElement;
			domClass.add(node, 'hidden');
		},

    addError: function (area) {
      this.setState({
        activeMessage: area
      });
		},

		changeGladEnd: function (date) {
      var playButtonEnd = $('#gladPlayButtonEndClick');
      playButtonEnd.html('aa');
			this.close();
      this.setState({
        endDate: date
      });
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(React.createElement(SubmitModal, React.__spread({},  props)), document.getElementById(el));
		/* jshint ignore:end */
	};

});

/* global define */
define('models/SubmissionModel',[
        'dojo/_base/declare',
        'map/config',
        'knockout'
    ],
    function(declare, MapConfig, ko) {

        var Model = declare(null, {
            constructor: function(el) {
                Model.vm = {};
                Model.root = el;

                Model.vm.storyNameData = ko.observable();
                Model.vm.storyCompanyData = ko.observable();
                Model.vm.storyTitleData = ko.observable();
                Model.vm.storyEmailData = ko.observable();
                Model.vm.storyDetailsData = ko.observable();

                Model.vm.concessionFileName = ko.observable();
                Model.vm.concessionFileType = ko.observable();
                Model.vm.facilityFileName = ko.observable();
                Model.vm.facilityFileType = ko.observable();
                Model.vm.otherFileName = ko.observable();
                Model.vm.otherFileType = ko.observable();

                // Submission Dialog Items
                Model.vm.submissionModalHeader = ko.observable(MapConfig.submissionDialog.submissionModalHeader);
                Model.vm.submissionEnterButton = ko.observable(MapConfig.submissionDialog.submissionEnterButton);
                Model.vm.submissionPlaceholder = ko.observable(MapConfig.submissionDialog.submissionPlaceholder);
                // Model.vm.longitudePlaceholder = ko.observable(MapConfig.submissionDialog.longitudePlaceholder);


                Model.vm.mediaChange = function(obj, evt) {
                  require(['controllers/SubmissionController'], function(SubmissionController) {
                      SubmissionController.handleFileChange(obj, evt);
                  });
                };

                // Model.vm.mediaChange2 = function(obj, evt) {
                //   require(["controllers/SubmissionController"], function(SubmissionController) {
                //       SubmissionController.handleFileChange(obj, evt);
                //   });
                // }

                Model.vm.dataSubmit = function(obj) {
                    require(['controllers/SubmissionController'], function(SubmissionController) {
                        SubmissionController.handleDataSubmit(obj);
                    });
                };

                // Apply Bindings upon initialization
                ko.applyBindings(Model.vm, document.getElementById(el));

            }

        });

        Model.get = function(item) {
            return item === 'model' ? Model.vm : Model.vm[item]();
        };

        Model.set = function(item, value) {
            Model.vm[item](value);
        };

        Model.applyTo = function(el) {
            ko.applyBindings(Model.vm, document.getElementById(el));
        };

        Model.initialize = function(el) {
            if (!Model.instance) {
                Model.instance = new Model(el);
            }
            return Model.instance;
        };

        return Model;

    });

define('controllers/SubmissionController',[
    'dojo/dom',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'esri/graphic',
    'esri/request',
    'components/SubmitModal',
    'utils/NavListController',
    'models/SubmissionModel'
], function (dom, query, domClass, domStyle, registry, Graphic, esriRequest, SubmitModal, NavListController, SubmissionModel) {

	var initialized = false;
  var self;
  var submitModal;

	return {

		init: function (template) {

			if (initialized) {
				registry.byId('stackContainer').selectChild('submissionView');
				return;
			}
      self = this;

			initialized = true;
			registry.byId('stackContainer').selectChild('submissionView');
			registry.byId('submissionView').set('content', template);
      SubmissionModel.initialize('submissionView');

      submitModal = new SubmitModal({
      }, 'submit-modal');
      // var context = 'submission';
      // NavListController.loadNavControl(context);
      // NavListController.loadNavView(context);

		},

    handleDataSubmit: function(model) {
        self.model = model;
        $('#storyNameInput').css('border-color', '#c0c0c0');
        $('#storyCompanyInput').css('border-color', '#c0c0c0');
        $('#storyTitleInput').css('border-color', '#@c0c0c0');
        $('#storyEmailInput').css('border-color', '#c0c0c0');

        $('#concessionInput').css('border-color', '#c0c0c0');
        $('#facilityInput').css('border-color', '#c0c0c0');
        $('#otherInput').css('border-color', '#c0c0c0');

        var concessionFileName = model.concessionFileName();
        var concessionFileType = model.concessionFileType();
        var facilityFileName = model.facilityFileName();
        var facilityFileType = model.facilityFileType();
        var otherFileName = model.otherFileName();
        var otherFileType = model.otherFileType();
        var node;

        if (!model.storyNameData()) {
          $('#storyNameInput').css('border-color', 'red');
          // alert('Please enter your name!');
          // SubmissionModal.addClass('story-name');
          // SubmissionModal.toggle();
          submitModal.addError('storyName');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyCompanyData()) {
          $('#storyCompanyInput').css('border-color', 'red');
          submitModal.addError('storyCompany');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyTitleData()) {
          $('#storyTitleInput').css('border-color', 'red');
          submitModal.addError('storyPosition');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }
        if (!model.storyEmailData()) {
          $('#storyEmailInput').css('border-color', 'red');
          submitModal.addError('storyEmail');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }

        if (!model.concessionFileName()) {
          $('#concessionInput').css('border-color', 'red');
          submitModal.addError('storyData');
          node = submitModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
          return;
        }

        var concessionFile = $('#concessionInput')[0].files[0];
        var facilityFile = $('#facilityInput')[0].files[0];
        var otherFile = $('#otherInput')[0].files[0];

        if (concessionFile || facilityFile || otherFile) {
          var form_data = new FormData();
          if (concessionFile) {
            form_data.append('concessionFile', concessionFile);
            form_data.append('concessionFileName', concessionFileName);
            form_data.append('concessionFileType', concessionFileType);
          }
          if (facilityFile) {
            form_data.append('facilityFile', facilityFile);
            form_data.append('facilityFileName', facilityFileName);
            form_data.append('facilityFileType', facilityFileType);
          }
          if (otherFile) {
            form_data.append('otherFile', otherFile);
            form_data.append('otherFileName', otherFileName);
            form_data.append('otherFileType', otherFileType);
          }

          form_data.append('storyEmail', model.storyEmailData());
          form_data.append('storyTitle', model.storyTitleData());
          form_data.append('storyCompany', model.storyCompanyData());
          form_data.append('storyUserName', model.storyNameData());

          var d = new Date();
          var datestring = d.getDate() + '_' + (d.getMonth() + 1) + '_' + d.getFullYear();

          form_data.append('datestring', datestring);

          $.ajax({
            url: 'app/php/post_file_to_s3.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(){
              // self.uploadToAGOL(response);
            },
            error: function () {
              submitModal.addError('s3Error');
              node = submitModal.getDOMNode();
              domClass.remove(node.parentNode, 'hidden');
            }
          });

        }
    },
    handleFileChange: function(obj, evt){
      if (evt.target.files.length === 0) {
        return;
      }
      var fileName = evt.target.files[0].name;
      var hash = {
        '.xls': 1,
        '.xlsx': 1,
        '.csv': 1
      };
      var re = /\..+$/;
      var ext = fileName.match(re);

      var fileType = evt.target.files[0].type;

      // if (fileType !== 'text/csv' && fileType !== 'application/zip' && hash[ext] !== 1) {
      //   evt.target.value = '';
      //   if (evt.target.value) {
      //     evt.target.type = 'file';
      //     evt.target.type = 'input';
      //   }
      //   alert('You must submit a zipped shapfile or a CSV/XLS!');
      //
      //   return;
      // }

      if (evt.target.id === 'concessionInput') {
        obj.concessionFileName(fileName);
        obj.concessionFileType(fileType);
      } else if (evt.target.id === 'facilityInput') {
        obj.facilityFileName(fileName);
        obj.facilityFileType(fileType);
      } else if (evt.target.id === 'otherInput') {
        obj.facilityFileName(fileName);
        obj.facilityFileType(fileType);
      }


    },
    uploadToAGOL: function(response){
      var arr = response.split(';');
      var modalNode;

      var url1 = arr[0];
      var url2;
      if (arr.length > 1){
        url2 = arr[1];
      }
      var attributes = {};
      attributes.name = self.model.storyNameData();
      attributes.company = self.model.storyCompanyData();
      attributes.title = self.model.storyTitleData();
      attributes.email = self.model.storyEmailData();
      if (self.model.storyDetailsData()) {
          attributes.notes = self.model.storyDetailsData();
      }
      attributes.data_file_name = self.model.dataFileName();
      if (self.model.facilityFileName()) {
          attributes.att_file_name = self.model.facilityFileName();
      }
      attributes.data_url = url1;
      if (url2) {
        attributes.attribute_url = url2;
      }

      var features = [
        {
          attributes: attributes
        }
      ];

      // var proxyUrl = 'http://commodities-test.herokuapp.com/app/php/proxy.php';
      var proxyUrl = './app/php/proxy.php';

      esri.config.defaults.io.proxyUrl = proxyUrl;
      esri.config.defaults.io.alwaysUseProxy = false;

      var layerUrl = 'http://services.arcgis.com/hBEMHCkbQdfV906F/arcgis/rest/services/data_submission_form/FeatureServer/0/addFeatures';
      var layersRequest = esriRequest({
        url: layerUrl,
        content: {
          'f': 'json',
          features: JSON.stringify(features)
        },
        handleAs: 'json',
        callbackParamName: 'callback'
      },
      {
        usePost: true,
        useProxy: true
      });

      layersRequest.then(
        function() {
          submitModal.addError('submissionSuccess');
          modalNode = submitModal.getDOMNode();
          domClass.remove(modalNode.parentNode, 'hidden');
          $('#storyForm')[0].reset();
      }, function() {
          submitModal.addError('layersRequestError');
          modalNode = submitModal.getDOMNode();
          domClass.remove(modalNode.parentNode, 'hidden');
      });

    }

	};

});

define('controllers/ViewController',[
    "dojo/dom-class",
    "dojo/query",
    "dojo/io-query",
    "dijit/registry",
    "utils/Loader",
    "controllers/Header",
    "controllers/Footer",
    "controllers/MapController",
    "controllers/HomeController",
    "controllers/AboutController",
    "controllers/DataController",
    "controllers/MethodsController",
    "controllers/PublicationsController",
    "controllers/SubmissionController",
    "utils/Hasher",
    "utils/NavListController"
], function(domClass, query, ioQuery, registry, Loader, Header, Footer, MapController, HomeController, AboutController, DataController, MethodsController, PublicationsController, SubmissionController, Hasher, NavListController) {
    'use strict';

    var loadedViews = {};

    return {

        init: function(defaultView) {
            var self = this;
            // Initialize Header, Footer, and defaultView
            self.load('header', function(template) {
                Header.init(template);
                // second parameter signifies the view is not external, always false in this case
                Header.updateView(defaultView, false);
                self.load(defaultView);
            });
            self.load('footer', Footer.init);
        },

        load: function(view, callback) {
            if (!view) {
                return
            }
            var self = this;
            if (!callback) {
                callback = this.getCallback(view);
            }


            // If the View has already been loaded, dont fetch the content again
            if (loadedViews[view]) {
                if (!callback) {
                    callback = this.getCallback(view);
                }
                callback();
                self.viewLoaded(view);
                // if (view != "home view") {
                //     HomeController.stopModeAnim(2);
                // }
                // Resize Became Necessary after adding tundra.css
                registry.byId("stackContainer").resize();
            } else {
                loadedViews[view] = true;
                Loader.getTemplate(view).then(function(template) {
                    callback(template);
                    self.viewLoaded(view);
                    // Resize Became Necessary after adding tundra.css
                    registry.byId("stackContainer").resize();
                });

            }

        },

        viewLoaded: function(view) {
            // These views only need to be loaded, nothing else
            if (view === 'header' || view === 'footer') {
                return;
            }

            // If we are in map view, hide footer, else show it
            Footer.toggle(view === 'map');

            // Set header to appropriate style base on view
            Header.toggleForView(view);

            // Set class on app-body
            domClass.remove("app-body");
            domClass.add("app-body", view + "View");

            //once page is loaded set drilled down url
            NavListController.urlControl(view);


        },

        getCallback: function(view) {
            switch (view) {
                case 'home':
                    return HomeController.init.bind(HomeController);
                case 'map':
                    return MapController.init.bind(MapController);
                case 'data':
                    return DataController.init.bind(DataController);
                case 'methods':
                    return MethodsController.init.bind(MethodsController);
                case 'about':
                    return AboutController.init.bind(AboutController);
                case 'publications':
                    return PublicationsController.init.bind(PublicationsController);
                case 'submission':
                    return SubmissionController.init.bind(SubmissionController);
                default:
                    return;
            }
        }

    };

});

define('utils/Delegator',[
    "dojo/topic",
    "map/config",
    "map/Controls",
    "map/MapModel",
    "analysis/Query",
    "analysis/config",
    "utils/Helper",
    "map/LayerController",
    "controllers/MapController",
    "controllers/ViewController"
], function(topic, MapConfig, Controls, MapModel, AnalyzerQuery, AnalyzerConfig, Helper, LayerController, MapController, ViewController) {
    'use strict';

    return {

        startListening: function() {

            // View Controller Events
            topic.subscribe('changeView', function(newView) {
                ViewController.load(newView);
            });

            // Events coming from the Wizard
            topic.subscribe('toggleWizard', function() {
                Helper.toggleWizard();
            });

            // Events coming from the Wizard
            topic.subscribe('toggleAlerts', function() {
                Helper.toggleAlerts();
            });

            topic.subscribe('setAdminBoundariesDefinition', function(filter) {
                LayerController.setWizardDynamicLayerDefinition(MapConfig.adminUnitsLayer, filter);
                // If filter is none, dont zoom to none, above will turn layer off when none is selected
                if (filter) {
                    AnalyzerQuery.zoomToFeatures(AnalyzerConfig.adminUnit.countryBoundaries, filter);
                }
                // Hide the Mill Points layer if its visible
                var layer = app.map.getLayer(MapConfig.mill.id);
                if (layer) {
                    if (layer.visible) {
                        LayerController.setWizardMillPointsLayerDefinition(MapConfig.mill);
                        // Update the UI to reflect that this layer is off
                        topic.publish('toggleItemInLayerList', 'mill');
                    }
                }
            });

            topic.subscribe('setCertificationSchemeDefinition', function(scheme) {
                LayerController.setWizardDynamicLayerDefinition(MapConfig.certificationSchemeLayer, scheme);
                // If filter is none, dont zoom to none, above will turn layer off when none is selected
                if (scheme) {
                    AnalyzerQuery.zoomToFeatures(AnalyzerConfig.certifiedArea.schemeQuery, scheme);
                }
                // Hide the Mill Points layer if its visible
                var layer = app.map.getLayer(MapConfig.mill.id);
                if (layer) {
                    if (layer.visible) {
                        LayerController.setWizardMillPointsLayerDefinition(MapConfig.mill);
                        // Update the UI to reflect that this layer is off
                        topic.publish('toggleItemInLayerList', 'mill');
                    }
                }
            });

            topic.subscribe("setCommercialEntityDefinition", function(entityType) {
                // LayerController.setWizardDynamicLayerDefinition(MapConfig.commercialEntitiesLayer, entityType);

                // // If filter is none, dont zoom to none, above will turn layer off when none is selected
                // if (entityType) {
                //     AnalyzerQuery.zoomToFeatures(AnalyzerConfig.commercialEntity.commodityQuery, entityType);
                // }

                if (entityType === "Logging concession") {
                  topic.publish('toggleItemInLayerList', 'logPerm');
                } else if (entityType === "Oil palm concession") {
                  topic.publish('toggleItemInLayerList', 'oilPerm');
                } else if (entityType === "Mining concession") {
                  topic.publish('toggleItemInLayerList', 'minePerm');
                } else if (entityType === "Wood fiber plantation") {
                  topic.publish('toggleItemInLayerList', 'woodPerm');
                } else if (!entityType) {

                  topic.publish('toggleItemInLayerListOff');
                  // topic.publish('toggleItemInLayerListOff', 'oilPerm');
                  // topic.publish('toggleItemInLayerListOff', 'minePerm');
                  // topic.publish('toggleItemInLayerListOff', 'woodPerm');
                  //topic.publish('toggleItemInLayerList', 'woodPerm');
                }

                // Hide the Mill Points layer if its visible
                var layer = app.map.getLayer(MapConfig.mill.id);
                if (layer) {
                    if (layer.visible) {
                        LayerController.setWizardMillPointsLayerDefinition(MapConfig.mill);
                        // Update the UI to reflect that this layer is off
                        topic.publish('toggleItemInLayerList', 'mill');
                    }
                }
            });

            topic.subscribe('showMillPoints', function() {
                // Turn off the dynamic layer by calling this method without passing a 2nd parameter to it
                LayerController.setWizardDynamicLayerDefinition(MapConfig.certificationSchemeLayer);
                // Toggle the wizard layer with this, will need to add a definition to it when the data supports it
                LayerController.setWizardMillPointsLayerDefinition(MapConfig.mill);
                LayerController.setWizardMillPointsLayerDefinition(MapConfig.gfwMill);


            });

            // Layer Controller Functions
            topic.subscribe('toggleLayer', function(layerId) {
                var config = MapConfig[layerId];
                if (config) {
                    if (config.toolsNode) {
                        // Show the opposite of the visible status, if the layer is visible, it is about to be turned off,
                        // if the layer is not visible, it is about to be turned on
                        var operation = app.map.getLayer(config.id).visible ? 'hide' : 'show';
                        Controls.toggleToolbox(config, operation);
                    }
                    LayerController.toggleLayers(config);
                }
            });

            topic.subscribe('showLayer', function(layerId) {
                var config = MapConfig[layerId];
                if (config) {
                    LayerController.showLayer(config);
                    if (config.toolsNode) {
                        Controls.toggleToolbox(config, 'show');
                    }
                }
            });

            topic.subscribe('hideLayer', function(layerId) {
                var config = MapConfig[layerId];
                if (config) {
                    LayerController.hideLayer(config);
                    if (config.toolsNode) {
                        Controls.toggleToolbox(config, 'hide');
                    }
                }
            });

            topic.subscribe('updateLayer', function(props) {
                if (props.layerType === 'tiled') {
                    var config = MapConfig[props.id];
                    if (config) {
                        LayerController.toggleLayers(config);
                    }
                } else if (props.layerType === 'dynamic') {
                    LayerController.updateLayer(props);
                }
            });

            topic.subscribe('updateGladDates', function(dates) {
              LayerController.updateGladDates(dates);
            });

            topic.subscribe('changeLayerTransparency', function(layerKey, layerType, transparencyValue) {
                var config = MapConfig[layerKey];
                if (config) {
                    LayerController.changeLayerTransparency(config, layerType, transparencyValue);
                }
            });

            topic.subscribe('customSuitabilityImageReady', function() {
                LayerController.hideSuitabilityLoader();
            });

            // Map Controller Functions
            topic.subscribe('showInfoPanel', MapController.showInfoPanel);
            topic.subscribe('toggleItemInLayerList', MapController.toggleItemInLayerList);
            topic.subscribe('toggleItemInLayerListOff', MapController.toggleItemInLayerListOff);

            topic.subscribe("centerChange", function(x, y, zoom) {
                MapController.centerChange(x, y, zoom);
            });

            topic.subscribe('showConcessionsLegend', function() {
                app.map._simpleLegends.concessions.show();
            });

            topic.subscribe('hideConcessionsLegend', function() {
                app.map._simpleLegends.concessions.hide();
            });

            topic.subscribe('filterConcessionsLegendItems', function(index) {
                app.map._simpleLegends.concessions.filterItem(index);
            });

        }

    };

});

define('main/Main',[
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
				urlPrefix: 'http://gis-gfw.wri.org/arcgis/rest/services/protected_services/MapServer',
				proxyUrl: '/app/php/proxy.php'
			});
			urlUtils.addProxyRule({
				urlPrefix: 'http://gis-gfw.wri.org/arcgis/rest/services/cached/wdpa_protected_areas/MapServer',
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

(function () {
  require(["main/Main"],function(Main){
    Main.init();
  });
})();

define("app/js/bundle", function(){});

