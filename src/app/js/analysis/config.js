define([], function () {

	// Variables Used to Track which Area is Selected
	var customArea = "customAreaOption",
			adminUnit = "adminUnitOption",
			commArea = "commercialEntityOption",
			certArea = "certifiedAreaOption",
			millPoint = "millPointOption";

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
		}

	};

});