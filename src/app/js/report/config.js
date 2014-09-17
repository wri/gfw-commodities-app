define([], function () {

	var geometryServiceUrl = "http://gis-potico.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer",
			clearanceAlertsUrl = "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/FORMA50/ImageServer",
			imageServiceUrl = "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/GFWCanalysis/ImageServer",
			firesQueryUrl = "http://gis-potico.wri.org/arcgis/rest/services/Fires/Global_Fires/MapServer";

	// Totoal Loss
	var lossBounds = [5, 12],
			lossLabels = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];


	// Tree Cover Density
	var treeCoverLabels = ["0 - 10%", "11 - 25%", "26 - 50%", "51 - 75%", "76 - 100%"],
			treeCoverBounds = [1, 5],
			treeCoverColors = ["#ccf1a5", "#a4c27a", "#859a59", "#65763e", "#4b5923"];

	// RSPO
	var rspoBounds = [0, 3],
			rspoColors = ['#87CEEB','#00AA00','#DD0000','#8A2BE2'];

	// Primary Forest
	var primaryForestLabels = ["Primary Degraded", "Primary Intact"],
			primaryForestBounds = [1, 2],
			primaryForestColors = ["#259F1F", "#186513"];

	// Legal Classes
	var legalClassLabels = ["Convertible Production Forest", "Limited Production Forest", "Non-forest", "Production Forest", "Protected Area"],
			legalClassBounds = [1, 5],
			legalClassColors = ["rgb(230, 152, 0)","rgb(116, 196, 118)","rgb(255, 255, 190)","rgb(199, 233, 192)","rgb(35, 139, 69)"];

	// Protected Areas
	var protectedAreaLabels = ["Protected Area"],
			protectedAreaBounds = [0, 1],
			protectedAreaColors = ["#296eaa"];

	// Carbon Stocks
	var carbonStockLabels = ["0","1 - 10","11 - 20","21- 35","36 - 70","71 - 100","101 - 150","151 - 200","201 - 300","Greater than 300"],
			carbonStockBounds = [0, 9],
			carbonStockColors = ["#fdffcc","#faeeb9","#f6ddaa","#f4ca99","#f1bc8b","#eca97a","#e89c6f","#e08b5e","#db7c54","#d56f4a"];

	// Intact Forests
	var intactForestLabels = ["Intact Forest"],
			intactForestBounds = [0, 1],
			intactForestColors = ["#186513"];

	// Peat Lands
	var peatLandsLabels = ["Peat"],
			peatLandsBounds = [0, 1],
			peatLandsColors = ["#161D9C"];

	return {

		corsEnabledServers: [
			// "https://api-ssl.bitly.com",
			// "http://globalforestwatch.org",
			// "http://firms.modaps.eosdis.nasa.gov",
			// "http://gfw-apis.appspot.com",
			// "http://50.18.182.188",
			"http://gis-potico.wri.org"
		],

		geometryServiceUrl: geometryServiceUrl,
		imageServiceUrl: imageServiceUrl,

		/* Begin Main Layers for Analyses */
		totalLoss: {
			rasterId: "$517",
			bounds: lossBounds,
			labels: lossLabels
		},

		clearanceAlerts: {
			rasterId: "$2"
		},

		millPoints: {

		},

		suitability: {

		},

		// The following is a dependency for all clearance alerts queries, this gets the number of labels and bounds
		// and must be used before any queries for clearanceAlerts will work
		clearanceBounds: {
			url: clearanceAlertsUrl,
			baseYearLabel: 13 
		},

		/* End Main Layers for Analyses */

		/* Here are all the other Layers used in the results */

		rspo: {
			rootNode: "rspoData",
			title: "RSPO Land Use Change Analysis",
			rasterId: "$5",
			bounds: rspoBounds,
			lossBounds: lossBounds,
			colors: rspoColors
		},

		primaryForest: {
			rootNode: "primaryForest",
			title: "Primary Forests - Indonesia",
			rasterId: "$519",
			bounds: primaryForestBounds,
			labels: primaryForestLabels,
			clearanceChart: {
				title: "Clearance Alerts in Primary Forests since 2012",
				type: "pie"
			},
			lossChart: {
				title: "Annual Tree Cover Loss (in hectares) in Primary Forests",
			},
			colors: primaryForestColors,
			fireKey: 'primaryForest' // Key to the Fires Config for items related to this
		},

		treeCover: {
			rootNode: "treeCoverDensity",
			title: "Tree Cover Density",
			rasterId: "$518",
			bounds: treeCoverBounds,
			labels: treeCoverLabels,
			clearanceChart: {
				title: "Clearance Alerts on Tree Cover Density since 2012",
				type: "pie"
			},
			lossChart: {
				title: "Annual Tree Cover Loss (in hectares) on Tree Cover Density"
			},
			colors: treeCoverColors,
			fireKey: 'treeCover' // Key to the Fires Config for items related to this
		},

		legalClass: {
			rootNode: "legalClasses",
			title: "Legal Classifications",
			rasterId: "$7",
	    bounds: legalClassBounds,
	    labels: legalClassLabels,
	    clearanceChart: {
	      title: "Clearance Alerts on Legal Classifications since 2012",
	      type: "pie"
	    },
	    lossChart: {
	      title: "Annual Tree Cover Loss (in hectares) on Legal Classifications"
	    },
	    colors: legalClassColors,
	    fireKey: 'legalClass' // Key to the Fires Config for items related to this
		},

		protectedArea: {
			rootNode: "protectedAreas",
			title: "Protected Areas",
			rasterId: "$10",
	    bounds: protectedAreaBounds,
	    labels: protectedAreaLabels,
	    clearanceChart: {
	      title: "Clearance Alerts on Protected Areas since 2012",
	      type: "bar"
	    },
	    lossChart: {
	      title: "Annual Tree Cover Loss (in hectares) on Protected Areas"
	    },
	    colors: protectedAreaColors,
	    fireKey: 'protectedArea' // Key to the Fires Config for items related to this
		},

		carbonStock: {
			rootNode: "carbonStocks",
			title: "Forest Carbon Stocks",
			rasterId: "$1",
	    bounds: carbonStockBounds,
	    labels: carbonStockLabels,
	    clearanceChart: {
	      title: "Clearance Alerts on Forest Carbon Stocks since 2012",
	      type: "pie"
	    },
	    lossChart: {
	      title: "Annual Tree Cover Loss (in hectares) on Forest Carbon Stocks (Mg C /Ha)"
	    },
	    colors: carbonStockColors,
	    fireKey: 'carbonStock' // Key to the Fires Config for items related to this
		},

		intactForest: {
			rootNode: "intactForestLandscape",
			title: "Intact Forest Landscapes",
			rasterId: "$9",
	    bounds: intactForestBounds,
	    labels: intactForestLabels,
	    clearanceChart: {
	      title: "Clearance Alerts on Intact Forest Landscapes since 2012",
	      type: "bar"
	    },
	    lossChart: {
	      title: "Annual Tree Cover Loss (in hectares) on Intact Forest Landscapes"
	    },
	    colors: intactForestColors,
	    fireKey: 'intactForest' // Key to the Fires Config for items related to this
		},

		peatLands: {
			rootNode: 'peatLands',
			title: 'Peat Lands',
			rasterId: '$8',
			bounds: peatLandsBounds,
			labels: peatLandsLabels,
			clearanceChart: {
				title: "Clearance Alerts on Peat Lands since 2012",
				type: "bar"
			},
			lossChart: {
				title: "Annual Tree Cover Loss (in hectares) on Peat Lands",
			},
			colors: peatLandsColors,
			fireKey: 'peatLands' // Key to the Fires Config for items related to this
		},

		landCover: {

		},
		
		fires: {
			url: firesQueryUrl,
			primaryForest: {
				type: 'pie',
				field: 'primary_fo',
				labels: primaryForestLabels,
				bounds: primaryForestBounds,
				colors: primaryForestColors,
				title: 'Active Fires in Primary Forests over the past 7 days',
				badgeDesc: 'in primary forests out of'
			},
			treeCover: {
				type: 'pie',
				field: 'treecover',
				labels: treeCoverLabels,
				bounds: treeCoverBounds,
				colors: treeCoverColors,
				title: 'Active Fires by Tree Cover Density over the past 7 days',
				badgeDesc: 'on tree cover density out of'
			},
			legalClass: {
				type: 'pie',
				field: 'legal',
				labels: legalClassLabels,
				bounds: legalClassBounds,
				colors: legalClassColors,
				title: 'Active Fires by Legal Classifications over the past 7 days',
				badgeDesc: 'on legal classes out of'
			},
			carbonStock: {
				type: 'pie',
				field: 'carbon',
				labels: carbonStockLabels,
				bounds: carbonStockBounds,
				colors: carbonStockColors,
				title: 'Active Fires by Forest Carbon Stocks over the past 7 days',
				badgeDesc: 'on forest carbon stocks out of'
			},
			protectedArea: {
				type: 'badge',
				field: 'wdpa',
				badgeDesc: 'in protected areas out of'
			},
			intactForest: {
				type: 'badge',
				field: 'ifl',
				badgeDesc: 'on intact forest landscapes out of'
			},
			peatLands: {
				type: 'badge',
				field: 'peat',
				badgeDesc: 'on peat lands out of'
			},
			landCover: {

			}
		}

	};

});