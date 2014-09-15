define([], function () {

	var geometryServiceUrl = "http://gis-potico.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer",
			clearanceAlertsUrl = "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/FORMA50/ImageServer",
			imageServiceUrl = "http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/GFWCanalysis/ImageServer";

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
			bounds: [1, 12],
			labels: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012]
		},

		clearanceAlerts: {
			rasterId: "$2"
		},

		millPoints: {

		},

		suitability: {

		},

		fires: {

		},

		// The following is a dependency for all clearance alerts queries, this gets the number of labels and bounds
		// and must be used before any queries for clearanceAlerts will work
		clearanceBounds: {
			url: clearanceAlertsUrl,
			baseYearLabel: 13 
		},

		/* End Main Layers for Analyses */

		/* Here are all the other Layers used in the results */

		primaryForest: {
			rootNode: "primaryForest",
			title: "Primary Forests - Indonesia",
			rasterId: "$519",
			bounds: [1, 2],
			labels: ["Primary Degraded", "Primary Intact"],
			clearanceChart: {
				title: "Clearance Alerts in Primary Forests since 2012",
				type: "pie"
			},
			lossChart: {
				title: "Annual Tree Cover Loss (in hectares) in Primary Forests",
			},
			colors: ["#259F1F", "#186513"]
		},

		treeCover: {

		},

		legalClass: {

		},

		protectedArea: {

		},

		carbonStock: {

		},

		intactForest: {

		},

		landCover: {

		},

		peatLands: {
			rootNode: 'peatLands',
			title: 'Peat Lands',
			rasterId: '$8',
			bounds: [0, 1],
			labels: ["Peat"],
			clearanceChart: {
				title: "Clearance Alerts on Peat Lands since 2012",
				type: "bar"
			},
			lossChart: {
				title: "Annual Tree Cover Loss (in hectares) on Peat Lands",
			},
			colors: ["#161D9C"]
		},

		rspo: {

		}

	};

});