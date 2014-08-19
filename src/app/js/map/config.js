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
	// toggle - Function (String for now while developing)
	/* NOTE THIS LIST MAY BE REMOVED AND GET CREATED DYNAMICALLY FROM THE LAYER CONFIG THAT WILL BE ADDED OR
		 THIS LIST WILL BE EXPANDED TO INCLUDE URL'S AND OTHER ATTRIBUTES AND BE THE OFFICIAL LAYER CONFIG */

	masterLayerList: {
		"TreeCoverChange": { title: 'Annual Tree Cover Change',
					subtitle: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
					source: 'treeCoverChange',
					toggle: 'hello',
					layerId: 'Tree_Cover_Change',
					filterClass: 'forest-change' 
		},
		"FORMA_Alerts": { title: 'FORMA',
					subtitle: '(monthly, 500m, humid tropics)',
					source: 'forma',
					toggle: 'gello',
					layerId: 'FORMA_Alerts',
					filterClass: 'forest-change'
		},
		"ActiveFires": { title: 'Active Fires',
					subtitle: '(past 7 days, 1km, global; NASA)',
					source: 'nasaFires',
					toggle: 'hello',
					layerId: 'Active_Fires',
					filterClass: 'forest-change'
		},
		"treeCoverDensity": { title: 'Tree Cover Density',
					subtitle: '(year 2000, 30m global)',
					source: 'treeCoverDensity',
					toggle: 'hello',
					layerId: 'Tree_Cover_Density',
					filterClass: 'forest-cover'
		},
		"IFL": { title: 'Intact Forest Landscapes',
					subtitle: '(year 2000, 30m, global)',
					source: 'intactForest',
					toggle: 'hello',
					layerId: 'Intact_Forest_Landscapes',
					filterClass: 'forest-cover' 
		}
	}

});