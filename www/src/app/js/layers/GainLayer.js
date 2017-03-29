define([
    'dojo/_base/declare',
    './EsriTileCanvasBase'
], function(declare, TileCanvasLayer) {

  return declare('GainLayer', [TileCanvasLayer], {

    filter: function (data) {
      for (var i = 0; i < data.length; i += 4) {
        var slice = [data[i], data[i + 1], data[i + 2]];
        var values = this.decodeDate(slice);

          if (data[i + 3] > 0) {

            data[i] = 0; // R
            data[i + 1] = 0; // G
            data[i + 2] = 255; // B
            data[i + 3] = values.intensity;
          } else {
            data[i] = 0; // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
            data[i + 3] = 0;
          }

      }
      return data;
    },

    decodeDate: function (pixel) {
      var intensity = pixel[2];

      return {
        intensity: intensity
      };

    }

  });

});
