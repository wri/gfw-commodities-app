define([
  'dojo/on',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'map/LayerController'
], function (on, MapConfig, esriRequest, Deferred, LayerController) {

  // TODO: replace all forma's with prodes
  // 'use strict';

  var playInterval,
      prodesSlider,
      playButton;

  var config = {
    sliderSelector: '#prodes-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 1999
  };

  var state = {
    isPlaying: false
  };

  var getProdesLabels = function getProdesLabels () {
    var deferred = new Deferred(),
        labels = [],
        request;

    request = esriRequest({
      url: MapConfig.prodes.url,
      callbackParamName: 'callback',
      content: { f: 'json' },
      handleAs: 'json'
    });

    request.then(function (res) {
      // Labels should be formatted like so: {month|numeric} - {year|two-digit}
      var min = res.minValues[0],
          max = res.maxValues[0],
          year;

      for (min; min <= max; min++) {
        year = config.baseYear + min;
        labels.push(year);
      }

      deferred.resolve(labels);
    }, function () {
      deferred.reject();
    });

    return deferred;
  };

  var ProdesSlider = {

    init: function () {
      var self = this;
      if (prodesSlider === undefined) {
        getProdesLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            prettify_enabled: false,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          prodesSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#prodesPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
        });
      }
    },

    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.prodes);
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
        endValue = prodesSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        prodesSlider.update({ from: prodesSlider.result.from, to: prodesSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = prodesSlider.result.from;
          toValue = prodesSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            prodesSlider.update({
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

  return ProdesSlider;

});
