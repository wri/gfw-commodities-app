define([
  'dojo/on',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'utils/Analytics',
  'map/LayerController'
], function (on, MapConfig, esriRequest, Deferred, Analytics, LayerController) {
  // "use strict";

  var playInterval,
      formaSlider,
      playButton;

  var config = {
    sliderSelector: '#forma-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 15 // 2015
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: 0
  };

  var getFormaLabels = function getFormaLabels () {
    var deferred = new Deferred(),
        labels = [],
        request;

    request = esriRequest({
      url: MapConfig.forma.url,
      callbackParamName: 'callback',
      content: { f: 'json' },
      handleAs: 'json'
    });

    request.then(function (res) {
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

  var FormaSlider = {

    init: function () {
      var self = this;
      if (formaSlider === undefined) {
        getFormaLabels().then(function (labels) {
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
          formaSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#formaPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
          //- set the state for change tracking
          state.to = labels.length - 1;
        });
      }
    },

    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.forma);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = data.from;
      state.to = data.to;
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
        endValue = formaSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        formaSlider.update({ from: formaSlider.result.from, to: formaSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = formaSlider.result.from;
          toValue = formaSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            formaSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1250);

        // Update the button html
        playButton.html(config.pauseHtml);
      }

      Analytics.sendEvent('Event', 'Forma Timeline', 'Play');
    }

  };

  return FormaSlider;

});
