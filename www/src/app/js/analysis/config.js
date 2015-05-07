define([], function() {

    // Variables Used to Track which Area is Selected
    var customArea = "customAreaOption",
        adminUnit = "adminUnitOption",
        commArea = "commercialEntityOption",
        certArea = "certifiedAreaOption",
        millPoint = "millPointOption";

    // URLS - CURRENT IS STAGING, PRODUCTION URL BELOW
    // var adminUnitQueryUrl = 'http://175.41.139.43/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer';

    // PRODUCTION URL
    var adminUnitQueryUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer',
        millPointMapService = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/oilpalmmills/MapServer';

    return {

        noNameField: "No Group Information Available",

        wizard: {
            breadcrumbs: ["Select Area", "Refine Area", "Select Analysis"]
            //breadcrumbs: ["Select Area", "Refine Area", "Select Analysis", "Refine Analysis"]
        },

        stepOne: {
            title: "Step 1: Select Area of interest",
            description: "Set the area to analyze using one of the following options.",
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
            title: "Step 2: Refine area",
            customArea: customArea,
            adminUnit: adminUnit,
            commArea: commArea,
            certArea: certArea,
            millPoint: millPoint,
            currentFeatureText: "Current selection: ",
            labelField: "WRI_label"
        },

        stepThree: {
            title: "Step 3: Select a variable to analyze",
            description: "Select which types of analysis you would like to perform and then click \"Perform Analysis\".  You must select at least one option.",
            //description: "Select which type of analysis you would like included in your results and then click \"Next\".",
            currentFeatureText: "Current selection: ",
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
                label: 'Forest Carbon Stocks',
                value: 'carbon'
            }, {
                label: 'Intact Forests',
                value: 'intact'
            }, {
                label: 'Land Cover - Global',
                value: 'landCoverGlob'
            }, {
                label: 'Land Cover - SE Asia',
                value: 'landCoverAsia'
            }, {
                label: 'Land Cover - Indonesia',
                value: 'landCoverIndo'
            }, {
                label: 'Peat Lands',
                value: 'peat'
            }, {
                label: 'Tree Cover Loss',
                value: 'treeCoverLoss'
            }, {
                label: 'Indonesia Moratorium',
                value: 'indonesiaMoratorium',
                noInfoIcon: true
            }],
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
                label: 'Mill Point Risk Assessment',
                value: 'mill',
                description: 'Analyze deforestation-related risks for a mill or set of mills.'
            },
            forestChange: {
                label: 'Forest Change Analysis',
                description: 'Analyze tree cover loss and fire activity according to the selected variable(s).'
            },
            millPoint: millPoint
        },

        stepFour: {
            title: "Step 4: Refine Analysis",
            description: "Select which data sets you would like to include in your analysis and then click \"Perform Analysis\".  You must select at least one data set.",
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
                label: 'Forest Carbon Stocks',
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

        stepFive: {
            beginningText: "Create custom analysis of your area of interest – such as a commodity concession or group of concessions -- considering factors such as:",
            firstList: [
                "Tree cover change",
                "Fire activity",
                "Primary or intact forest areas",
                "Protected areas",
                "Legal classification of land"
            ],
            secondaryText: "You can also: ",
            secondList: [
                "Upload your own shapefiles for analysis",
                "Draw an area of interest",
                "Sign up for alerts for clearance activity"
            ]
        },

        customArea: {
            instructions: "Select the \"Freehand\" or \"Polygon\" options below to draw an area of interest on the map, or choose \"Upload\" to upload a zipped shapefile of polygons or points or a list of point coordinates to analyze.",
            instructionsPartTwo: "Select an area from the list below and click \"Next\" to proceed.",
            freehandLabel: 'Freehand',
            uploadLabel: 'Upload',
            polyLabel: 'Polygon',
            uploadInstructions: [
                'Select a zip file(.zip) containing a shapefile(.shp,.dbf,.prj) from your local file system.',
                'The shapefile must be in Geographic Coordinate System (WGS84).',
                'The shapefile must be of POLYGON geometry type.',
                'The shapefile must not exceed 1 Megabyte.'
            ],
            incorrectFileTypeError: "Your shapefile must be of type .zip, please choose another file.",
            portalUrl: "http://www.arcgis.com/sharing/rest/content/features/generate"
        },

        adminUnit: {
            instructions: 'Select a country to view it\'s first or second level administrative units:',
            instructionsPartTwo: "Select a province or district from the list below and click \"Next\" to proceed.",
            countriesQuery: {
                url: adminUnitQueryUrl + '/7',
                where: "NAME_0 IS NOT NULL",
                outFields: ["NAME_0"],
                orderBy: ["NAME_0"],
                groupBy: ["NAME_0"],
                statistic: { // This is necessary to support the groupBy, cannot currently groupBy without statisticsQuery :( 
                    "statisticType": 'count',
                    "onStatisticField": 'OBJECTID',
                    "outStatisticFieldName": 'OBJECTID'
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
            instructionsPartTwo: "Select a concession or group from the list below and click \"Next\" to proceed.",
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
            instructionsPartThree: "Select a concession or group from the list below and click \"Next\" to proceed",
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
            listInstructions: "Select mill(s) from the list below and click \"Next\" to proceed.",
            commodityOptions: [{
                label: 'Oil palm',
                value: 'Oil palm concession'
            }],
            url: millPointMapService + '/0',
            // api: 'http://risk-api.appspot.com/',
            api: 'http://wip.risk-api.appspot.com/',
            outFields: ['Parent_Com', 'Mill_name', 'Entity_ID'],
            orderBy: ['Parent_Com', 'Mill_name'],
            labelField: 'Mill_name', // Children
            valueField: 'Entity_ID',
            requiredField: 'Parent_Com' // Bucket a.k.a. parent
        },

        STORE_KEYS: {
            selectedCustomFeatures: 'selectedCustomFeatures',
            selectedCustomFeatureAlias: 'selectedCustomFeatureAlias',
            userStep: 'userStep',
            areaOfInterest: 'areaOfInterest',
            analysisSets: 'analysisSets',
            customFeatures: 'customFeatures',
            customFeaturesSpliceArgs: 'customFeaturesSpliceArgs'
        }

    };

});