define([
  'report/config',
  'dojo/Deferred',
  'dojo/promise/all',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'report/riskController',
  'esri/geometry/geometryEngine',
], function (ReportConfig, Deferred, all, Query, QueryTask, RiskController, geometryEngine) {
  'use strict';

  /** 
  * To Perform Risk Analysis, for each feature, I need area to know if it is in Indonesia
  */

  var Helper = {

    /**
    * @param {array} features - An Array of Mill Objects containing geometry, label, type, and isCustom
    * @retrun {object} promise - Return a promise that will be resolved with all the necessary information to 
    *                            use the 'report/riskController' method
    */
    prepareFeatures: function (features) {
      var mainDeferred = new Deferred(),
          promises = [],
          self = this;

      features.forEach(function (feature) {
        var featureDeferred = new Deferred();

        self.getAreaAndIndoIntersect(feature).then(function (data) {

          featureDeferred.resolve({
            feature: data.feature,
            area: data.area,
            inIndonesia: data.inIndonesia
          });

        });

        promises.push(featureDeferred.promise);
      });

      all(promises).then(function (results) {
        mainDeferred.resolve(results);
      });

      return mainDeferred.promise;
    },

    /**
    * Get Area of Feature and Determine if the Feature intersects with Indonesia
    * @param {object} feature - Mill Object containing geometry, label, type, and isCustom props
    * @return {object} promise - Return a promise that will be resolved when the queries are complete
    */
    getAreaAndIndoIntersect: function (feature) {
      var mainDeferred = new Deferred();

      var area = this.getArea(feature.geometry);

      this.getIntersectionStatus(feature).then(function (results) {

        mainDeferred.resolve({
          feature: feature,
          area: area,
          inIndonesia: results
        });

      });

      return mainDeferred.promise;
    },

    /**
    * This is done here because requiring Fetcher will cause a circular Issue
    * @param {object} geometry - Geometry of feature to get area for, feature should be in web mercator
    * @return {number} area - Returns the area of the given geometry in square meters
    */
    getArea: function (geometry) {
      var simplified = geometryEngine.simplify(geometry);
      return geometryEngine.planarArea(simplified);
    },

    /**
    * @param {object} geometry - Geometry of feature to get area for, feature should be in web mercator
    * @return {object} promise - Return a promise that will resolve with an unformatted area, up to the caller to format
    */
    getIntersectionStatus: function (feature) {
      var deferred = new Deferred(),
          query,
          task;

      task = new QueryTask(ReportConfig.boundariesUrl);
      query = new Query();
      query.returnGeometry = true;
      query.outFields = ['OBJECTID'];
      query.where = "ISO3 = 'IDN'";
      query.geometryPrecision = 1;

      task.execute(query, function (result) {
        var indoBounds = result.features[0] && result.features[0].geometry;
        deferred.resolve(geometryEngine.contains(indoBounds, feature.geometry));
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /**
    * @param {object} featureObjects - Objects containing a mill point feature object, area, and isIndonesia property
    */
    performAnalysis: function (featureObjects) {
      var promises = [],
          inIndonesia,
          geometry,
          area,
          rspo;
      
      featureObjects.forEach(function (featureObj) {
        var featureDeferred = new Deferred();

        rspo = featureObj.feature.isRSPO || false;
        geometry = featureObj.feature.geometry;
        inIndonesia = featureObj.inIndonesia;
        area = featureObj.area;

        all([
          RiskController(geometry, area, 'concession', rspo, inIndonesia),
          RiskController(geometry, area, 'radius', rspo, inIndonesia)
        ]).then(function (results) {

          featureDeferred.resolve({
            feature: featureObj.feature,
            results: results
          });

        });

        promises.push(featureDeferred);

      });

      all(promises).then(function (results) {

        console.dir(results);
        console.log(JSON.stringify(results[0].results));

      });

    }

  };

  return Helper;

});
