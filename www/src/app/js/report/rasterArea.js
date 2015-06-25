define([
  'lodash',
  'utils/assert',
  'utils/request',
  'report/config',
  'dojo/Deferred',
  'esri/SpatialReference',
  'esri/tasks/GeometryService'
], function (_, assert, request, config, Deferred, SpatialReference, GeometryService) {
  'use strict';

  /**
   * This process consists of a couple of steps
   * 1. getRangeHistograms 
   *   1.1. If no layer config is provided, sumCounts and return, else continue
   * 2. generateRanges
   * 3. getAreaHistograms
   * 4. decodeArea
   */

  var preferredPixelSize = 90;

  function reproject (geometry, callback) {
    var geometryService = new GeometryService(config.geometryServiceUrl),
        sr = new SpatialReference(54012);

    geometryService.project([geometry], sr, function(projectedGeometry) {
      callback(projectedGeometry);
    });

  }

  /**
  * Takes geometry and returns histograms of pixel counts in given geometry
  * @param {object} geometry - Esri Polygon Geometry
  * @return deferred
  */
  function getRangeHistograms (geometry) {
    var deferred = new Deferred();
    var content = {
      'geometryType': 'esriGeometryPolygon',
      'geometry': JSON.stringify(geometry),
      'renderingRule': JSON.stringify(config.rasterFunctions.range),
      'pixelSize': preferredPixelSize,
      'f': 'json'
    };

    function success (data) {
      if (data.histograms.length > 0) {
        deferred.resolve(data.histograms[0]);
      } else {
        deferred.reject();
      }
    }

    request.computeHistogram(config.urls.imageService, content, success, errback);
    return deferred;
  }

  /**
  * @param {object} histogram - histogram with counts and size
  * @return {number} area
  */
  function sumCounts (histogram) {
    var counts = histogram.counts;
    var firstValueIndex = _.findIndex(counts, function (val) { return val > 0; });
    var finalIndex = histogram.size;
    var totalArea = 0;

    while (firstValueIndex < finalIndex) {
      totalArea += (firstValueIndex * counts[firstValueIndex] * Math.pow((preferredPixelSize / 30),2));
      ++firstValueIndex;
    }
    // totalArea is currently meters squared, to get ha, return (totalArea / 10000)
    return totalArea;
  }

  /**
  * Takes a histogram and returns a range of values in a string format
  * @param {object} histogram - histogram with counts and size
  * @return {array} ranges
  * ex.  histogram.counts = [0,0,2,2,2] => 2,2,3,3,4,4
  */
  function generateRanges (histogram) {
    var firstValueIndex = _.findIndex(histogram.counts, function (val) { return val > 0; });
    var finalIndex = histogram.size;
    var ranges = [];

    while (firstValueIndex < finalIndex) {
      ranges.push(firstValueIndex);
      ranges.push(firstValueIndex);
      ++firstValueIndex;
    }
    return ranges;
  }

  function getAreaHistograms () {

  }

  function decodeArea () {

  }

  /**
  * Generic Error Handler for requests
  * @param {error} error
  */
  function errback (error) {
    console.error(error);
  }

  return {

    /**
    * Wrapper function to take some geomerty and return the area for the geometry
    * @param {polygon} geometry - Esri Polygon Geometry
    * @param {object} [layerConfig] - config object that has bounds and rasterID available (optional)
    * @return deferred
    */
    getArea: function (geometry, layerConfig) {
      assert(geometry && geometry.type === 'polygon', 'Invalid Parameter');
      var deferred = new Deferred(),
          ranges,
          area;

      getRangeHistograms(geometry).then(function (rangeHistogram) {
        // if no layerConfig options are presented, this is a simple area calculation so calculate area and bounce
        if (layerConfig === undefined) {
          area = sumCounts(rangeHistogram);
          deferred.resolve(area);
          console.log(area);
          return;
        }

        ranges = generateRanges(rangeHistogram);

      }, errback);

      return deferred;
    }

  };

});
