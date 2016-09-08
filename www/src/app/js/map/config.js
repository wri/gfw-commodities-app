define([], function() {

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
            defaultLayers: [0]
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
