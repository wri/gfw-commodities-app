define([
	"dojo/number",
	"dojo/Deferred",
	"report/config",
	"esri/geometry/Polygon",
	"esri/tasks/GeometryService",
  "esri/tasks/AreasAndLengthsParameters"
], function (dojoNumber, Deferred, Config, Polygon, GeometryService, AreasAndLengthsParameters) {
	'use strict';

	return {

		getAreaFromGeometry: function (geometry) {
			var geometryService = new GeometryService(Config.geometryServiceUrl),
					parameters = new AreasAndLengthsParameters(),
					polygon = new Polygon(geometry),
					errorString = "Not Available",
					area;

			function success(result) {
				if (result.areas.length === 1) {
					area = dojoNumber.format(result.areas[0], {places: 2} );
				} else {
					area = errorString;
				}
				document.getElementById("total-area").innerHTML = area;
			}

			function failure(err) {
				document.getElementById("total-area").innerHTML = errorString;
			}

			parameters.areaUnit = GeometryService.UNIT_HECTARES;
			geometryService.simplify([polygon], function (simplifiedGeometry) {
				parameters.polygons = simplifiedGeometry;
				geometryService.areasAndLengths(parameters, success, failure);
			}, failure);

		}

	};

});