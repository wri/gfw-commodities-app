define([
	"dojo/Deferred",
	"dojo/_base/array",
	"esri/tasks/query",
	"esri/tasks/QueryTask",
	"esri/tasks/StatisticDefinition",
	// My Modules
	"analysis/config",
	"map/MapModel"
], function (Deferred, arrayUtils, Query, QueryTask, StatisticDefinition, AnalyzerConfig, MapModel) {
	'use strict';

	return {

		getSetupData: function () {
			this.getAdminUnitData();
		},

		/*
			Fetches a list of All Countries for populating the Admin Unit Dropdown
		*/
		getAdminUnitData: function () {
			var query = new Query(),
					config = AnalyzerConfig.adminUnit.countriesQuery,
					statsDefinition;

			// Create a statistics defenition
			statsDefinition = new StatisticDefinition();
			statsDefinition.statisticType = config.statistic.statisticType;
			statsDefinition.onStatisticField = config.statistic.onStatisticField;
      statsDefinition.outStatisticFieldName = config.statistic.outStatisticFieldName;

			query.where = config.where;
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;
			query.outStatistics = [statsDefinition];
			query.groupByFieldsForStatistics = config.groupBy;

			function formatResponse(res) {
				var data = [];
				// Push in Default None Object
				data.push({'label': 'None', 'value': 'NONE'});

				arrayUtils.forEach(res.features, function (feature) {
					data.push({
						'label': feature.attributes[config.labelValueField],
						'value': feature.attributes[config.labelValueField]
					});
				});

				MapModel.set('allCountries', data);
			}

			this._query(config.url, query, formatResponse, this._queryErrorHandler);

		},

		getLowLevelAdminUnitData: function (countryName) {
			var deferred = new Deferred(),
					query = new Query(),
					config = AnalyzerConfig.adminUnit.lowLevelUnitsQuery,
					buckets = {},
					data = [],
					attrs;

			query.where = config.whereField + " = '" + countryName + "' AND " + config.requiredField + " IS NOT NULL";
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			this._query(config.url, query, function (res) {
				// Format data into an easy to consume format
				/*
					[
						{'label': 'B', 'value': 'b'},
  				 	{'label': 'C', 'value': 'c', 'children': [
						  	{'label': 'd', 'value': 'd'},
						  	{'label': 'e', 'value': 'e'},
							]
					  }
					]
				*/
				arrayUtils.forEach(res.features, function (feature) {
					attrs = feature.attributes;

					if (buckets.hasOwnProperty(attrs[config.requiredField])) {
						buckets[attrs[config.requiredField]].children.push({
							'label': attrs[config.labelField],
							'value': attrs[config.valueField]
						});
					} else {
						// requiredField is label for bucket, labelField is label for all children, valueField is value for all items
						buckets[attrs[config.requiredField]] = {
							'label': attrs[config.requiredField],
							'value': attrs[config.valueField],
							'children': []
						};
					}

				});

				// Now push each bucket into an array
				for (var key in buckets) {
					data.push(buckets[key]);
				}

				deferred.resolve(data);

			}, this._queryErrorHandler);

			return deferred.promise;
		},

		/*
			Simple Query to zoom to a country boundary
		*/
		zoomToBoundaries: function (filter) {
			var query = new Query(),
					config = AnalyzerConfig.adminUnit.lowLevelUnitsQuery;

			query.where = config.whereField + " = '" + filter + "'";
			query.returnGeometry = true;
			query.outFields = [config.whereField];

			this._query(config.url, query, function (res) {
				console.dir(res);
			}, this._queryErrorHandler);

		},

		/*
			Simple Wrapper for creating executing query and handling responses
		*/
		_query: function (url, queryObject, success, fail) {
			var task = new QueryTask(url);
			task.execute(queryObject, success, fail);
		},

		/*
			Handle all query errors with this class
		*/
		_queryErrorHandler: function (err) {
			console.error(err);
		}

	};

});