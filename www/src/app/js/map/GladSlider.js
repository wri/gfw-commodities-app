define([
  'dojo/on',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'map/LayerController'
], function (on, MapConfig, esriRequest, Deferred, LayerController) {
  // "use strict";

  var playInterval,
      gladSlider,
      playButton;

  var config = {
    sliderSelector: '#glad-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 15 // 2015
  };

  var state = {
    isPlaying: false
  };

  var getGladLabels = function getGladLabels () {
    var deferred = new Deferred(),
        labels = [],
        request;

    request = esriRequest({
      url: MapConfig.gladAlerts.url,
      callbackParamName: 'callback',
      content: { f: 'json' },
      handleAs: 'json'
    });

    request.then(function (res) {

      console.log('res', res)
      // Labels should be formatted like so: {month|numeric} - {year|two-digit}
      var min = res.minValues[0] || 1,
          max = res.maxValues[0] || 9,
          year;

      for (min; min <= max; min++) {
        year = config.baseYear + Math.floor(min / 12);
        labels.push(min + ' - ' + year);
      }

      deferred.resolve(labels);
    }, function () {
      deferred.reject();
    });

    return deferred;
  };

  var GladSlider = {

    init: function () {
      var self = this;
      if (gladSlider === undefined) {
        getGladLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          gladSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#gladPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
        });
      }
    },

    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.gladAlerts);
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = gladSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        gladSlider.update({ from: gladSlider.result.from, to: gladSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = gladSlider.result.from;
          toValue = gladSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            gladSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1250);

        // Update the button html
        playButton.html(config.pauseHtml);
      }
    }

  };

  return GladSlider;

});
