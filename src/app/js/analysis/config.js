define([], function() {

    // Variables Used to Track which Area is Selected
    var customArea = "customAreaOption",
        adminUnit = "adminUnitOption",
        commArea = "commercialEntityOption",
        certArea = "certifiedAreaOption",
        millPoint = "millPointOption";

    // URLS - CURRENT IS STAGING, PRODUCTION URL BELOW
    var adminUnitQueryUrl = 'http://175.41.139.43/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer';

    // PRODUCTION URL
    // 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer';

    return {

        wizard: {
            breadcrumbs: ["Select Area", "Refine Area", "Select Analysis"]
            //breadcrumbs: ["Select Area", "Refine Area", "Select Analysis", "Refine Analysis"]
        },

        stepOne: {
            title: "Step 1: Select Area",
            description: "Please select one of the options below to begin analyzing.",
            option1: {
                'id': customArea,
                'label': 'Create custom area',
                'description': 'Draw a polygon or upload a shapefile to analyze one of it\'s features.'
            },
            option2: {
                'id': adminUnit,
                'label': 'Administrative unit',
                'description': 'View first or second level administrative units and select one to analyze.'
            },
            option3: {
                'id': commArea,
                'label': 'Commercial entity',
                'description': 'Search through various commercial entities by the type of commodity.'
            },
            option4: {
                'id': certArea,
                'label': 'Certified area',
                'description': 'View RSPO certified areas that are also an oil palm concession.'
            },
            option5: {
                'id': millPoint,
                'label': 'Mill point',
                'description': 'Coming Soon'
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
            }],
            suit: {
                label: 'Oil Palm Suitability',
                value: 'suit',
                description: 'Description of the output the user will see when selecting this option.'
            },
            rspo: {
                label: 'RSPO Land Use Change Analysis',
                value: 'rspo',
                description: 'Description of the output the user will see when selecting this option.'
            },
            forestChange: {
                label: 'Forest Change Analysis Variables',
                description: 'Choose one or more variable(s) to calculate hectares of forest loss, get a count of active fires and mothly clearance alerts.'
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

            description: "The analysis tools within Global Forest Watch Commodities allow users to customize analysis on land cover change, deforestation activity, and areas suitable for development. The following steps will guide you through selecting the geographic area of interest and the type of analysis you would like to conduct, and produce an array of charts according to your selections. The aim of this analysis is to support decisions surrounding land use and risk in forest commodities - we welcome FEEDBACK on these tools in hopes of continuing to improve upon them.",

        },

        customArea: {
            instructions: "Select a shape below and begin drawing on the map or choose \"Upload\" and upload a shapefile to analyze.",
            instructionsPartTwo: "Select a feature from the list below and click \"Next\" to proceed.",
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
            instructionsPartTwo: "Select a feature from the list below and click \"Next\" to proceed.",
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
                whereField: 'NAME_0'
            }
        },

        commercialEntity: {
            instructions: 'Select a commodity type:',
            instructionsPartTwo: 'Select a feature from the list below and click \"Next\" to proceed.',
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
            instructionsPartThree: "Select a feature from the list below and click \"Next\" to proceed.",
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
        }

    };

});