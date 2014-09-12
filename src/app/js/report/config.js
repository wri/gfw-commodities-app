define([], function () {

	var geometryService = "http://gis-potico.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer";

	return {

		corsEnabledServers: [
			// "https://api-ssl.bitly.com",
			// "http://globalforestwatch.org",
			// "http://firms.modaps.eosdis.nasa.gov",
			// "http://gfw-apis.appspot.com",
			// "http://50.18.182.188",
			"http://gis-potico.wri.org"
		],

		geometryServiceUrl: geometryService

	};

});