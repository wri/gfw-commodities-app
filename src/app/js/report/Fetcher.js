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

		},

		getPrimaryForestResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getTreeCoverResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getLegalClassResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getProtectedAreaResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getCarbonStocksResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getIntactForestResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getLandCoverResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getPeatLandsResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		getRSPOResults: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		// Main Query Calls Go Here

		_getTotalLossData: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		_getFireAlertData: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		_getClearanceAlertData: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},

		_getSuitabilityData: function () {
			var deferred = new Deferred();

			return deferred.promise;
		},


	};

});