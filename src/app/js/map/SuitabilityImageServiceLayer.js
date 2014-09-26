define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "esri/layers/RasterFunction",
  "esri/layers/ImageServiceParameters",
  "esri/layers/ArcGISImageServiceLayer",
  "map/MapModel"
], function (declare, lang, arrayUtils, RasterFunction, ImageServiceParameters, ArcGISImageServiceLayer, Model) {
    
  return declare("SuitabilityImageServiceLayer", ArcGISImageServiceLayer, {
    constructor: function () {
      // This line below is very important, without, printing will not know the layer type since this is a custom
      // layer and won't know how to serialize the JSON
      this.declaredClass = "esri.layers.ArcGISImageServiceLayer";

      // raster function arguments must be in same order as in image service moasic dataset
      this.rasterFunctionArguments = {};
      this.rasterFunctionArguments.ElevRaster = "$1";
      this.rasterFunctionArguments.SlopeRaster = "$2";
      this.rasterFunctionArguments.WaterRaster = "$3";
      this.rasterFunctionArguments.ConsRaster = "$4";
      this.rasterFunctionArguments.STypeRaster = "$5";
      this.rasterFunctionArguments.SDepthRaster = "$6";
      this.rasterFunctionArguments.PeatRaster = "$7";
      this.rasterFunctionArguments.SAcidRaster = "$8";
      this.rasterFunctionArguments.SDrainRaster = "$9";
      this.rasterFunctionArguments.RainfallRaster = "$10";
      this.rasterFunctionArguments.LCRaster = "$11";

      // scalars are harded-coded based on raster pre-processing scripts
      this.rasterFunctionScalars = {};
      this.rasterFunctionScalars.Elev = 10;
      this.rasterFunctionScalars.Slope = 1;
      this.rasterFunctionScalars.Water = 10;
      this.rasterFunctionScalars.Cons = 100;
      this.rasterFunctionScalars.SType = 1;
      this.rasterFunctionScalars.SDepth = 1;
      this.rasterFunctionScalars.Peat = 1;
      this.rasterFunctionScalars.SAcid = 1;
      this.rasterFunctionScalars.SDrain = 1;
      this.rasterFunctionScalars.Rainfall = 10;
      this.rasterFunctionScalars.LC = 1;

      this.renderingRule = {};

      var rasterFunction = new RasterFunction();
      rasterFunction.functionName = "RemapColormap2Prashant";
      rasterFunction.arguments = this.rasterFunctionArguments;

      var params = new ImageServiceParameters();
      params.noData = 0;
      params.renderingRule = rasterFunction;
      this.imageServiceParameters = params;

    },

    getExportUrl: function (extent, width, height, callback, options) {
        // function callback(url){
        //     return;
        // }
    },

    getRenderingRule: function () {
      var _self = this;
      var suitabilitySettings = _self.returnRasterSettingsAsObject();
      var render_rule = {};

      lang.mixin(render_rule, this.rasterFunctionArguments);

      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Elev', _self.rasterFunctionScalars, 'MAX');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Slope', _self.rasterFunctionScalars, 'MAX');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Water', _self.rasterFunctionScalars, 'MIN');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Cons', _self.rasterFunctionScalars, 'MIN');
      _self.addThresholdArgument(suitabilitySettings, render_rule, 'Rainfall', _self.rasterFunctionScalars, 'BETWEEN');
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SDepth', [0, 1, 2, 3, 4, 5, 6, 7]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'Peat', [0, 1, 2, 3, 4, 5, 6]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SAcid', [0, 1, 2, 3, 4, 5, 6, 7]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SDrain', [0, 1, 2, 3, 4]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'LC', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      _self.addMembershipArgument(suitabilitySettings, render_rule, 'SType', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      var rasterFunction = new RasterFunction();
      rasterFunction.rasterFunction = "PalmOilSuitabilityNew";
      rasterFunction.rasterFunctionArguments = render_rule;
      return rasterFunction;
    },

    getImageUrl: function (extent, width, height, callback,options) {
      var _self = this;
      extent = extent._normalize();

      var bbox = [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
          params,
          min,
          max,
          tempArray,
          membership_arguments;

      var rasterFunction = _self.getRenderingRule();
      if (options) {
        params = options;
        params.renderingRule = JSON.stringify(rasterFunction);
        params.bbox = bbox.join(",");
        _self.renderingRule = rasterFunction;
        callback(_self.url + "/exportImage?",params);
      } else {
        params = {
          noData: 0,
          noDataInterpretation: "esriNoDataMatchAny",
          interpolation: "RSP_BilinearInterpolation",
          renderingRule: JSON.stringify(rasterFunction),
          format: "png8",
          size: width + "," + height,
          imageSR: 3857,
          bboxSR: 3857,
          f: "image",
          pixelType: 'U8',
          bbox: bbox.join(",")
        };

        _self.renderingRule = rasterFunction;
        _self.renderingRule.toJson = function() {
          return _self.getRenderingRule();
        };

        callback(_self.url + "/exportImage?" + dojo.objectToQuery(params));
      }
      
    },

    returnRasterSettingsAsObject: function () {
      var result = {},
          settingsArray = Model.get('suitabilitySettings').computeBinaryRaster;

      arrayUtils.forEach(settingsArray, function (setting) {
        result[setting.name] = setting.values;
      });
      
      return result;
    },

    returnNumericArray : function (stringArray) {
        var temp = stringArray.split(",");
        var result = [];
        arrayUtils.forEach(temp, function (value) {
          result.push(parseInt(value, 10));
        });
        return result;
    },

    addThresholdArgument: function (suitabilitySettings, renderRule, variableName, scalars, breakType) {
      var _self = this;
      scalar = scalars[variableName];
      if (breakType === 'BETWEEN') {
          var tempArray = _self.returnNumericArray(suitabilitySettings[variableName + 'InpR']);
          var min = tempArray[0];
          var max = tempArray[tempArray.length - 1];
          renderRule[variableName + 'InpR'] = [0, min / scalar, min / scalar, max / scalar, max / scalar, 1000000];
          renderRule[variableName + 'OutV'] = [1, 1, 0];
      } else {
          var breakpoint = parseInt(suitabilitySettings[variableName + 'InpR'], 10);
          renderRule[variableName + 'InpR'] = [0, breakpoint / scalar, breakpoint / scalar, 1000000];
          renderRule[variableName + 'OutV'] = breakType === 'MIN' ? [0, 1] : [1, 0];
      }
    },

    addMembershipArgument: function (suitabilitySettings, renderRule, variableName, allValues) {
      var _self = this;
      var validValues = _self.returnNumericArray(suitabilitySettings[variableName + 'InpR']);
      var input_values = [];
      var output_values = [];
      var includeNulls = ["SDepth","SAcid","SDrain","LC"];
      var val;
      var i;

      if (includeNulls.indexOf(variableName) > -1 && validValues[0] !== 0)
        validValues.unshift(0);

      for (i = 0; i < allValues.length; i++) {
        val = allValues[i];
        input_values.push(val, val);
        if (validValues.indexOf(val) === -1) {
          output_values.push(0);
        } else {
          output_values.push(1);
        }
      }
      renderRule[variableName + 'InpR'] = input_values;
      renderRule[variableName + 'OutV'] = output_values;
    }

  });  // End return declare
}); // End define