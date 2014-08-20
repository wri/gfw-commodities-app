define({

	mapOptions: {
		basemap: 'gray',
		centerX: 0,
		centerY: 0,
		zoom: 3,
		sliderPosition: "top-right"
	},


	// This is the list that creates all the filter menus on the map page, when a layer is added,
	// this is where we can add it to the UI, each item must have the following
	// title - String
	// filterClass - String (Refers to the same class that colors the filter options)
	// -- forest-change, forest-cover, forest-use, conservation, agro-suitability, company-pages
	// subtitle - String (Source as a subtitle)
	// layerId - String (ID of the layer to be turned on)
	// source - String (Will be used later for showing information specific to the layer)
	// type - String (radio or check)
	// unique - String (For React)
	/* NOTE THIS LIST MAY BE REMOVED AND GET CREATED DYNAMICALLY FROM THE LAYER CONFIG THAT WILL BE ADDED OR
		 THIS LIST WILL BE EXPANDED TO INCLUDE URL'S AND OTHER ATTRIBUTES AND BE THE OFFICIAL LAYER CONFIG */

	// Keys Match list in header.html
	"tcc": {
		"id": "TreeCoverChange"
	},
	"gain": {
		"id": "Gain"
	},
	"loss": {
		"id": "Loss"
	},
	"forma": {
		"id": "FormaAlerts"
	},
	"fires": {
		"id": "ActiveFires"
	},
	"tcd": {
		"id": "TreeCoverDensity"
	},
	"ifl": {
		"id": "IntactForestLandscapes"
	},
	"peat": {
		"id": "PeatLands"
	},
	"tfcs": {
		"id": "CarbonStocks"
	}

	// masterLayerList: {
	// 	"TreeCoverChange": { 
	// 		title: 'Annual Tree Cover Change',
	// 		subtitle: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
	// 		source: 'treeCoverChange',
	// 		layerId: 'a1',
	// 		filterClass: 'forest-change',
	// 		type: 'radio',
	// 		unique: '1'
	// 	},
	// 	"Gain": {
	// 		title: 'Gain',
	// 		subtitle: '',
	// 		source: '',
	// 		layerId: 'a1',
	// 		filterClass: 'forest-change-1',
	// 		type: 'check',
	// 		unique: '2'
	// 	},
	// 	"Loss": {
	// 		title: 'Loss',
	// 		subtitle: '',
	// 		source: 'treeCoverChange',
	// 		layerId: 'a1',
	// 		filterClass: 'forest-change-1',
	// 		type: 'check',
	// 		unique: '3'
	// 	},
	// 	"FORMA_Alerts": { 
	// 		title: 'FORMA',
	// 		subtitle: '(monthly, 500m, humid tropics)',
	// 		source: 'forma',
	// 		layerId: 'a2',
	// 		filterClass: 'forest-change',
	// 		type: 'radio',
	// 		unique: '4'
	// 	},
	// 	"ActiveFires": { 
	// 		title: 'Active Fires',
	// 		subtitle: '(past 7 days, 1km, global; NASA)',
	// 		source: 'nasaFires',
	// 		layerId: 'a3',
	// 		filterClass: 'forest-change',
	// 		type: 'radio',
	// 		unique: '5'
	// 	},
	// 	"treeCoverDensity": { 
	// 		title: 'Tree Cover Density',
	// 		subtitle: '(year 2000, 30m global)',
	// 		source: 'treeCoverDensity',
	// 		layerId: 'b1',
	// 		filterClass: 'forest-cover',
	// 		type: 'check',
	// 		unique: '6'
	// 	},
	// 	"IFL": { 
	// 		title: 'Intact Forest Landscapes',
	// 		subtitle: '(year 2000, 30m, global)',
	// 		source: 'intactForest',
	// 		layerId: 'b2',
	// 		filterClass: 'forest-cover',
	// 		type: 'check',
	// 		unique: '7'
	// 	}
	// },

	// masterListRadioButtons: [{
	// 	title: 'None',
	// 	subtitle: '',
	// 	source: '',
	// 	layerId: '',
	// 	filterClass: 'forest-change',
	// 	type: 'radio'
	// }]

});