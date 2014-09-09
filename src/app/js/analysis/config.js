define([], function () {

	// Variables Used to Track which Area is Selected
	var customArea = "customAreaOption",
			adminUnit = "adminUnitOption",
			commArea = "commercialEntityOption",
			certArea = "certifiedAreaOption",
			millPoint = "millPointOption";

	// URLS
	var adminUnitQueryUrl = 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/mapfeatures/MapServer';

	return {

		wizard: {
			breadcrumbs: ["Select Area", "Refine Area", "Select Analysis", "Refine Analysis"]
		},

		stepOne: {
			title: "Step 1: Select Area",
			option1: {
        'id': customArea,
        'label': 'Create custom area'
      },
      option2: {
        'id': adminUnit,
        'label': 'Administrative unit'
      },
      option3: {
        'id': commArea,
        'label': 'Commercial entity'
      },
      option4: {
        'id': certArea,
        'label': 'Certified area'
      },
      option5: {
        'id': millPoint,
        'label': 'Mill point'
      }
		},

		stepTwo: {
			title: "Step 2: Refine area",
			customArea: customArea,
			adminUnit: adminUnit,
			commArea: commArea,
			certArea: certArea,
			millPoint: millPoint,
			currentFeatureText: "Current feature for analysis: ",
			labelField: "WRI_label"
		},

		stepThree: {
			title: "Step 3: Select Analysis",
			description: "Select which type of analysis you would like included in your results and then click \"Next\".",
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
			millPoint: millPoint
		},

		stepFour: {
			title: "Step 4: Refine Analysis",
			description: "Select which data sets you would like to include in your analysis and then click \"Perform Analysis\".  You must select at least one data set.",
			checkboxes: [
				{label: 'Primary Forests', value: 'primForest', checked: true},
				{label: 'Tree Cover Density', value: 'treeDensity'},
				{label: 'Legal Classes', value: 'legal'},
				{label: 'Protected Areas', value: 'protected'},
				{label: 'Forest Carbon Stocks', value: 'carbon'},
				{label: 'Intact Forests', value: 'intact'},
				{label: 'Land Cover', value: 'landCover'},
				{label: 'Peat Lands', value: 'peat'},
				{label: 'Suitability', value: 'suit'},
				{label: 'RSPO Land Use Change Analysis', value: 'rspo'}
			]
		},

		customArea: {
			instructions: "Select a shape below and begin drawing on the map or choose \"Upload\" and upload a shapefile to analyze.",
			instructionsPartTwo: "Select a feature from below and click \"Next\" to proceed.",
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
			instructionsPartTwo: "Select a feature from below and click \"Next\" to proceed.",
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
				outFields: ['NAME_0','NAME_1','NAME_2','OBJECTID'],
				orderBy: ['NAME_1', 'NAME_2'],
				labelField: 'NAME_2',
				valueField: 'OBJECTID'
			},
			countryBoundaries: {
				url: adminUnitQueryUrl + '/6',
				whereField: 'NAME_0'
			}
		}

	};

});