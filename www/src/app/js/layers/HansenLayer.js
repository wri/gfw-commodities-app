define([
    'dojo/_base/declare',
    './EsriTileCanvasBase'
], function(declare, TileCanvasLayer) {

  function pad (num) {
    var str = '00' + num;
    return str.slice(str.length - 3);
  }

  return declare('HansenLayer', [TileCanvasLayer], {

    filter: function (data) {
      for (var i = 2; i < data.length + 2; i += 4) {
        // Decode the rgba/pixel so I can filter on confidence and date ranges
        var slice = [data[i], data[i + 1], data[i + 2]];
        var values = this.decodeDate(slice);
        //- Check against confidence, min date, and max date
        // if (i === 0) {
          // console.log(values);
          // console.log(slice);
          // console.log(data[i]); //--> year
          // console.log(data[i + 1]); //--> nada
          // console.log(data[i + 2]); //--> intensity


          // console.log('min Date:', this.options.minYear);
          // console.log('maxxx Date:', this.options.maxYear);
        // }
        if (
          values.year >= this.options.minYear &&
          values.year <= this.options.maxYear //&&
          //this.options.confidence.indexOf(values.confidence) > -1
        ) {
          // Set the alpha to the intensity
          // data[i + 3] = values.intensity;
          // Make the pixel pink for HANSEN alerts
          data[i] = 100; // R
          data[i + 1] = 100; // G
          data[i + 2] = 100; // B
          // data[i + 3] = 0;
          // data[i + 2] = 220;
          // data[i + 1] = 0;
          // data[i] = 0;
          if (i === 2) {
            // console.log('yessss');
            console.log(values.intensity);
          }
        } else {
          // Hide the pixel
          // data[i + 3] = 0;
          data[i + 2] = 0;
          data[i + 1] = 0;
          data[i] = 0;
          if (i === 2) {
            // console.log('nahhh');
            // console.log('minYear', this.options.minYear);
            // console.log('year', values.year);
          }
          // data[i + 3] = values.intensity;
          // data[i] = 220; // R
          // data[i + 1] = 102; // G
          // data[i + 2] = 153; // B
        }
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

      // // Find the total days of the pixel by multiplying the red band by 255 and adding the green band
      // var totalDays = (pixel[0] * 255) + pixel[1];
      // // Divide the total days by 365 to get the year offset, add 15 to this to get current year
      // // Example, parseInt(totalDays / 365) = 1, add 15, year is 2016
      // var yearAsInt = parseInt(totalDays / 365) + 15;
      // // Multiple by 1000 to get in YYDDD format, i.e. 15000 or 16000
      // var year = yearAsInt * 1000;
      // // Add the remaining days to get the julian day for that year
      // var julianDay = totalDays % 365;
      // // Add julian to year to get the data value
      // var date = year + julianDay;
      // // Convert the blue band to a string and pad with 0's to three digits
      // // It's rarely not three digits, except for cases where there is an intensity value and no date/confidence.
      // // This is due to bilinear resampling
      // var band3Str = pad(pixel[2]);
      // // Parse confidence, confidence is stored as 1/2, subtract 1 so it's values are 0/1
      // var confidence = parseInt(band3Str[0]) - 1;
      // // Parse raw intensity to make it visible, it is the second and third character in blue band, it's range is 1 - 55
      // var rawIntensity = parseInt(band3Str.slice(1, 3));
      // // Scale it to make it visible
      // var intensity = rawIntensity * 50;
      // // Prevent intensity from being higher then the max value
      // if (intensity > 255) { intensity = 255; }
      // // Return all components needed for filtering/labeling
      // return {
      //   confidence: confidence,
      //   intensity: intensity,
      //   date: date
      // };
    },

    setDateRange: function setDateRange (minYear, maxYear) {
      this.options.minYear = parseInt(minYear);
      this.options.maxYear = parseInt(maxYear);
      this.refresh();
    },

    setConfidenceLevel: function setConfidenceLevel (confidence) {
      //- Confidence can be 'all' or 'confirmed'
      this.options.confidence = confidence === 'all' ? [0, 1] : [1];
      this.refresh();
    }

  });

});
