define([
  'lodash',
  'utils/assert',
  'utils/request',
  'report/config',
  'dojo/Deferred'
], function (_, assert, request, config, Deferred) {
  'use strict';

  /**
   * This process consists of a couple of steps
   * 1. getRangeHistograms 
   *   1.1. If no layer config is provided, sumCounts and return, else continue
   * 2. generateRanges
   * 3. getAreaHistograms
   *   3.1. If the request uses a simple rule, switch that into the main method
   * 4. decodeArea
   */

  var preferredPixelSize = 90;

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

  /**
  * Takes some geometry and a layer config and creates a new rendering rule and modifies it, then requests area
  * @param {object} geometry - Esri polygon
  * @param {array} ranges - Array of ranges
  * @param {object} layersConfig - object containing rasterIds and bounds for the two layers we are getting area for
  */
  function getAreaHistograms (geometry, ranges, layersConfig) {
    var deferred = new Deferred(),
        renderingRule = _.clone(config.rasterFunctions.combination),
        outputValues = [],
        content;

    // Update some necessary properties

    // If we aer using the simple rule, we have to modify the whole rule with a remap
    // NOTE the simple rule is only a piece of the original and then it has to be modified
    // make sure to handle that correctly
    if (layersConfig.simpleRule) {

      renderingRule.rasterFunctionArguments.RasterRange = [1, 2];
      renderingRule.rasterFunctionArguments.Raster = layersConfig.simpleRule;

    } else {
      // None of these layerConfig values exist yet, still deciding the best way to pass in 
      // all the possible options that are necessary
      var upperRangeLevel = (layersConfig.raster.bounds[1] * layersConfig.raster2.length[0]) + layersConfig.raster.bounds[1];

      renderingRule.rasterFunctionArguments.RasterRange = [1, upperRangeLevel];
      renderingRule.rasterFunctionArguments.Raster.rasterFunctionArguments = {
        'RasterRange': layersConfig.raster.bounds,
        'Raster2Length': layersConfig.raster2.length, // will be an array, so [10] for example
        'Raster': layersConfig.raster.id,
        'Raster2': layersConfig.raster2.id
      };
    }

    // Generate the OutputValues array, this is fairly trivial so need for its own method
    // if ranges is [950,950,951,951] then outputValues should be [1,2]
    for (var i = 0; i < ranges.length /2; i++) {
      outputValues.push(i + 1);
    }

    renderingRule.rasterFunctionArguments.Raster2.rasterFunctionArguments.InputRanges = ranges;
    renderingRule.rasterFunctionArguments.Raster2.rasterFunctionArguments.OutputValues = outputValues;

    content = {
      'geometryType': 'esriGeometryPolygon',
      'geometry': JSON.stringify(geometry),
      'renderingRule': JSON.stringify(renderingRule),
      'pixelSize': preferredPixelSize,
      'f': 'json'
    };

    function success (data) {
      console.log(data);
    }

    request.computeHistogram(config.urls.imageService, content, success, errback);
    return deferred;
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
          return;
        }

        ranges = generateRanges(rangeHistogram);
        getAreaHistograms(geometry, ranges, layerConfig).then(function (areaHistogram) {



        }, errback);
      }, errback);

      return deferred;
    }

  };

});
