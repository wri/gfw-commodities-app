define([
    'dojo/_base/declare',
    './EsriTileCanvasBase'
], function(declare, TileCanvasLayer) {

  // Power function to determine intensity
  var getScalePowFunc = function(exp) {
    // y = m * x ^ k + b
    var domain = [0, 256];
    var range = [0, 256];
    var b = range[0] - domain[0];
    var m = (range[1] - b) / (Math.pow(domain[1], exp));

    return function(x) {
      return Math.pow(x, exp) * m + b;
    };
  };

  var intensityBank = {};
  // Populate the intensity bank
  for (let z = 1; z < 21; z++) { //each zoom level on the map
    intensityBank[z] = [];
    var exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
    var lMoney = getScalePowFunc(exp);
    for (let f = 0; f < 256; f++) { //each potential intensity value
      intensityBank[z][f] = [];
      intensityBank[z][f].push((33 - z) + 153 - ((lMoney(f)) / z));
      intensityBank[z][f].push(z < 13 ? lMoney(f) : f);
      intensityBank[z][f].push(220);
      intensityBank[z][f].push((72 - z) + 102 - (3 * lMoney(f) / z));
    }
  }

  return declare('HansenLayer', [TileCanvasLayer], {

    setUrl: function (url) {
      this.options.url = url;
      // this.refresh();
    },

    filter: function(data) {
      var z = app.map.getZoom();

      for (let i = 0; i < data.length; i += 4) {
        // Decode the rgba/pixel so I can filter on date ranges
        var slice = [data[i], data[i + 1], data[i + 2]];
        var values = this.decodeDate(slice);

        if (!values.intensity) { values.intensity = 0; }
        if (values.year >= (this.options.minYear) && values.year <= (this.options.maxYear)) {
          data[i] = intensityBank[z][values.intensity][2];
          data[i + 1] = intensityBank[z][values.intensity][3];
          data[i + 2] = intensityBank[z][values.intensity][0];
          data[i + 3] = intensityBank[z][values.intensity][1];
        } else {
          // Hide the pixel
          data[i + 3] = 0;
          data[i + 2] = 0;
          data[i + 1] = 0;
          data[i] = 0;
        }
      }
      return data;
    },

    decodeDate: function(pixel) {
      var year = pixel[2];
      var intensity = pixel[0];
      return { intensity, year };
    },

    setDateRange: function setDateRange (minYear, maxYear) {
      this.options.minYear = parseInt(minYear) + 1;
      this.options.maxYear = parseInt(maxYear) + 1;
      this.refresh();
    },

    setConfidenceLevel: function setConfidenceLevel (confidence) {
      //- Confidence can be 'all' or 'confirmed'
      this.options.confidence = confidence === 'all' ? [0, 1] : [1];
      this.refresh();
    }

  });

});
