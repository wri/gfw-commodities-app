define([
	"dojo/Deferred",
	"dojo/_base/array",
	"esri/tasks/query",
	"esri/graphicsUtils",
	"esri/tasks/QueryTask",
	"esri/tasks/StatisticDefinition",
	// My Modules
	"analysis/config",
	"map/MapModel"
], function (Deferred, arrayUtils, Query, graphicsUtils, QueryTask, StatisticDefinition, AnalyzerConfig, MapModel) {
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
					self = this,
					data = [],
					attrs;

			query.where = config.whereField + " = '" + countryName + "' AND " + config.requiredField + " IS NOT NULL";
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			function handleResponse(res) {				
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to retrieve a feature by its Group Name
		*/
		getFeaturesByGroupName: function (config, groupName) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			// Config is analysis/config using items like adminUnit.lowLevelUnitsQuery or commercialEntity.commodityQuery
			query.where = config.requiredField + " = '" + groupName + "'";
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(config.url, query, function (res) {
				if (res.features.length > 0) {
					deferred.resolve(res.features);
				} else {
					deferred.resolve(false);
				}
			}, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve a feature by its Object ID
		*/
		getFeatureById: function (url, objectId) {
			var deferred = new Deferred(),
					query = new Query(),
					self = this;

			query.where = "OBJECTID = " + objectId;
			query.returnGeometry = true;
			query.outFields = ["*"];

			this._query(url, query, function (res) {
				if (res.features.length === 1) {
					deferred.resolve(res.features[0]);
				}
			}, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve features by their Certification Scheme and Type
		*/

		getFeaturesByScheme: function (scheme, type) {
			var config = AnalyzerConfig.certifiedArea.schemeQuery,
					deferred = new Deferred(),
					query = new Query(),
					self = this,
					data = [];

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			query.where = config.whereField + " = '" + scheme + "' AND " + config.secondaryWhereField + " = '" + type + "'";
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;

		},

		/*
			Simple Query to retrieve features by their Commodity Type
		*/
		getFeaturesByCommodity: function (type) {
			var config = AnalyzerConfig.commercialEntity.commodityQuery,
					deferred = new Deferred(),
					query = new Query(),
					self = this,
					data = [],
					where;

			function handleResponse(res) {
				if (res.features.length > 0) {
					data = self._formatData(config, res.features);
					deferred.resolve(data);
				}
			}

			where = (type === 'Mining concession' ? 
												config.whereField + " = '" + type + "'" :
												config.whereField + " = '" + type + "' AND " + config.requiredField + " IS NOT NULL");

			query.where = where;
			query.returnGeometry = false;
			query.outFields = config.outFields;
			query.orderByFields = config.orderBy;

			this._query(config.url, query, handleResponse, function (err) {
				deferred.resolve(false);
				self._queryErrorHandler(err);
			});

			return deferred.promise;
		},

		/*
			Simple Query to zoom to features by a whereField in their config and a filter value
			@Params
				config must have url, and whereField defined
				filter is obvious, zoom where whereField = 'filter'
		*/
		zoomToFeatures: function (config, filter) {
			var query = new Query(),
					extent;

			query.where = config.whereField + " = '" + filter + "'";
			query.returnGeometry = true;
			query.geometryPrecision = 0;

			this._query(config.url, query, function (res) {
				if (res.features.length > 0) {
					extent = graphicsUtils.graphicsExtent(res.features);
					app.map.setExtent(extent, true);
				}
			}, this._queryErrorHandler);
		},

		/*
			@Params: 
				config object containing three fields, requiredField (bucket label), labelField (label for children), valueField (value for item)
				features array
			@Return
				returns an array of data formatted for the NestedList Component

			@Format
				[
					{'label': 'B', 'value': 'b'},
				 	{'label': 'C', 'value': 'c', 'children': [
					  	{'label': 'd', 'value': 'd'},
					  	{'label': 'e', 'value': 'e'},
						]
				  }
				]
		*/

		_formatData: function (config, features) {
			var buckets = {},
					data = [],			
					attrs;

			arrayUtils.forEach(features, function (feature) {
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

					// Now push the first child in
					buckets[attrs[config.requiredField]].children.push({
						'label': attrs[config.labelField],
						'value': attrs[config.valueField]
					});

				}

			});

			// Now push each bucket into an array
			for (var key in buckets) {
				data.push(buckets[key]);
			}

			return data;
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