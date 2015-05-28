define([
  'report/config',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/promise/all',
  'dojo/_base/array',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'report/riskController',
  'esri/geometry/geometryEngine',
], function (ReportConfig, Deferred, lang, all, arrayUtils, Query, QueryTask, RiskController, geometryEngine) {
  'use strict';

  /** 
  * To Perform Risk Analysis, for each feature, I need area to know if it is in Indonesia
  */


  // Data Specification for the Response Needed by our templating function
  var JSON_SPEC = {
    'id': '',
    'deforestation': {
      'umd_loss_primary': { 
        'concession': {}, 
        'radius': {} 
      },
      'forma_primary': { 
        'concession': {}, 
        'radius': {} 
    },
      'umd_loss': { 
        'concession': {}, 
        'radius': {} 
    },
      'carbon': { 
        'concession': {}, 
        'radius': {} 
    },
      'forma': { 
        'concession': {}, 
        'radius': {} 
      },
      'area_primary': {
        'concession': {}, 
        'radius': {}
      }
    },
    'legal': { 
      'concession': {}, 
      'radius': {} 
    },
    'fire': { 
      'concession': {}, 
      'radius': {}
    },
    'peat': { 
      'concession': {}, 
      'radius': {},
      'clearance': {
        'concession': {}, 
        'radius': {},
      },
      'presence': {
        'concession': {}, 
        'radius': {},
      }
    },
    'rspo': {},
    'priority_level_concession': '',
    'priority_level_radius': '',
    'total_mill_priority_level': ''
  };

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

      arrayUtils.forEach(features, function (feature) {
        var featureDeferred = new Deferred();

        self.getAreaAndIndoIntersect(feature).then(function (data) {

          featureDeferred.resolve({
            feature: data.feature,
            // area: data.area,
            inIndonesia: data.inIndonesia
          });

        });

        promises.push(featureDeferred.promise);
      });

      all(promises).then(function (results) {

        self.performAnalysis(results).then(function (mills) {
          mainDeferred.resolve(mills);
        });

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

      // var area = this.getArea(feature.geometry);

      this.getIntersectionStatus(feature).then(function (intersectionStatus) {

        mainDeferred.resolve({
          feature: feature,
          // area: area,
          inIndonesia: intersectionStatus
        });

      });

      return mainDeferred.promise;
    },

    /**
    * This is done here because requiring Fetcher will cause a circular Issue
    * @param {object} geometry - Geometry of feature to get area for, feature should be in web mercator
    * @return {number} area - Returns the area of the given geometry in square meters
    */
    // getArea: function (geometry) {
    //   var simplified = geometryEngine.simplify(geometry);
    //   return geometryEngine.planarArea(simplified);
    // },

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
    * @return {object} promise - Return a promise that will resolve with custom mill analysis objects
    */
    performAnalysis: function (featureObjects) {
      var deferred = new Deferred(),
          self = this,
          promises = [],
          inIndonesia,
          geometry,
          buffer,
          // area,
          rspo;
      
      arrayUtils.forEach(featureObjects, function (featureObj) {
        var featureDeferred = new Deferred();

        rspo = featureObj.feature.isRSPO || false;
        geometry = featureObj.feature.geometry.getExtent().getCenter();
        inIndonesia = featureObj.inIndonesia;
        // area = featureObj.area;
        buffer = JSON.parse(featureObj.feature.buffer);

        all([
          RiskController.getRisk(geometry, buffer, rspo, inIndonesia)
        ]).then(function (results) {

          featureDeferred.resolve({
            feature: featureObj.feature,
            results: results
          });

        });

        promises.push(featureDeferred);

      });

      all(promises).then(function (resultSets) {
        var mills = self.formatData(resultSets);
        deferred.resolve(mills);
      });

      return deferred.promise;

    },

    /**
    * Take some results and put them in the correct format for our templating function
    * @param {object} resultSets - Result Sets include a mill feature object and results containing arrays of results
    * @return {array} mills - array of mills
    */
    formatData: function (resultSets) {
      var mills = [],
          riskObject;

      // CONSTANT LOOK UP OBJECT
      // var RISK = {
      //   1: 'low',
      //   2: 'medium',
      //   3: 'high'
      // };

      /**
      * @param {object} data - concessionData object
      * @param {string} type - concession|radius only 
      */
      // function placeResultsInRiskObject (data, type) {

      //   var key;

      //   switch (data.label) {
      //     case 'Legality': 
      //       riskObject.legal[type] = { risk: RISK[data.risk] };
      //     break;
      //     case 'RSPO': 
      //       // Do Nothing for Now
      //       // riskObject.rspo.risk = (data.risk !== undefined ? data.risk : false);
      //     break;
      //     case 'Fires': 
      //       riskObject.fire[type] = { risk: RISK[data.risk] };
      //     break;
      //     case 'Carbon':
      //       arrayUtils.forEach(data.categories, function (category) {
      //         if (category.key === 'loss_carbon') {
      //           riskObject.deforestation.carbon[type] = { risk: RISK[category.risk] };
      //         }
      //       });
      //     break;
      //     case 'Peat':
      //       key = (type === 'concession' ? 'peat_concession' : 'peat_radius');
      //       riskObject.peat[key] = RISK[data.risk];
      //       arrayUtils.forEach(data.categories, function (category) {
      //         if (riskObject.peat[category.key]) {
      //           riskObject.peat[category.key][type] = { risk: RISK[category.risk] };
      //         }
      //       });
      //     break;
      //     case 'Deforestation':
      //       key = (type === 'concession' ? 'deforestation_concession' : 'deforestation_radius');
      //       riskObject.deforestation[key] = RISK[data.risk];
      //       arrayUtils.forEach(data.categories, function (category) {
      //         riskObject.deforestation[category.key][type] = { risk: RISK[category.risk] };
      //       });
      //     break;
      //   }

      // }

      arrayUtils.forEach(resultSets, function (resultObj) {

        // All these values need to be filled in
        riskObject = lang.clone(resultObj.results[0]);
        riskObject.id = resultObj.feature.millId;
        riskObject.rspo = { risk: resultObj.feature.isRSPO };

        // Temporary Fix, Get Alicia to Rename these and add in last values
        // TODO:  
        // 1. Change legality to legal
        // 2. Change fires to fire
        // 3. Add In Overall Priority Level
        //1
        riskObject.legal = {
          concession: { risk: riskObject.legality.concession.risk },
          radius: { risk: riskObject.legality.radius.risk }
        };
        //2
        riskObject.fire = {
          concession: { risk: riskObject.fires.concession.risk },
          radius: { risk: riskObject.fires.radius.risk }
        };
        //3
        riskObject.total_mill_priority_level = "N/A";
        riskObject.priority_level_concession = "N/A";
        riskObject.priority_level_radius = "N/A";

        mills.push(riskObject);

      });

      return mills;
    }

  };

  return Helper;

});
