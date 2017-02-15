define([
    'dojo/_base/declare',
    './EsriTileCanvasBase'
], function(declare, TileCanvasLayer) {

  return declare('GainLayer', [TileCanvasLayer], {

    filter: function (data) {
      // console.log(data);
      for (var i = 0; i < data.length; i += 4) {
        // Decode the rgba/pixel so I can filter on confidence and date ranges
        var slice = [data[i], data[i + 1], data[i + 2]];
        // console.log(slice);
        var values = this.decodeDate(slice);
        //- Check against confidence, min date, and max date

          // Set the alpha to the intensity
          // data[i + 3] = values.intensity;
          // Make the pixel pink for HANSEN alerts
          // data[i] = 220; // R
          // // data[i + 1] = 102; // G
          // data[i + 1] = values.intensity; // G --> Yo this is intensity!!
          // data[i + 2] = 153; // B
          // data[i + 3] = 0;
          if (data[i + 3] > 0) {
            if (i === 0) {
              console.log('onnn');
              console.log(data[i + 3]); //--> intensity
            }
            data[i] = 89; // R
            data[i + 1] = 82; // G
            data[i + 2] = 222; // B
            data[i + 3] = values.intensity / 2;
          } else {
            if (i === 0) {
              console.log('off');
            }
            data[i] = 0; // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
            data[i + 3] = 0;
          }

          //89,82,222

          // if (i === 2) {
          //   // console.log('yessss');
          //   console.log(values.intensity);
          // }

      }
      return data;
    },

    decodeDate: function (pixel) {
      // console.log(pixel);
      // [255, 255, 14]

      var year = pixel[0];
      var intensity = pixel[2];

      return {
        intensity: intensity,
        year: year
      };

    }

  });

});
