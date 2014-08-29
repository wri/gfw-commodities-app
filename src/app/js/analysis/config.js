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
			millPoint: millPoint
		},

		customArea: {
			instructions: "Select a shape below and begin drawing on the map or choose \"Upload\" and upload a shapefile to analyze.",
			freehandLabel: 'Freehand',
			uploadLabel: 'Upload',
			polyLabel: 'Polygon'
		}

	};

});