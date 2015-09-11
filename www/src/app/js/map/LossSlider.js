define([
  "dojo/on",
  "map/config",
  "map/LayerController"
], function (on, MapConfig, LayerController) {
  "use strict";

  var playButton = $("#lossPlayButton"),
      playInterval,
      lossSlider;

  var config = {
    container: "treecover_change_toolbox",
    values: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
    sliderSelector: '.js-range-slider',
    baseValue: 2001,
    playHtml: "&#9658;",
    pauseHtml: "&#x25A0"
  };

  var state = {
    isPlaying: false,
    startValue: undefined
  };

  var LossSliderController = {

    show: function () {
      var self = this;
      if (lossSlider === undefined) {
        // Initialize the slider
        $(config.sliderSelector).ionRangeSlider({
          type: "double",
					values: config.values,
          grid: true,
          hide_min_max: true,
					onChange: self.change,
          onUpdate: self.update
				});
        // Save this instance to a variable ???
        lossSlider = $(config.sliderSelector).data("ionRangeSlider");
        // Attach Events related to this item
        on(playButton, "click", self.playToggle);
      }

    },

    hide: function () {

    },

    /**
    * Called when the user drags a thumb on the slider
    */
    change: function (data) {
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.loss);
    },

    /**
    * Called only when user hits the play button and we explicitly call update on lossSlider, state.startValue is set in playToggle function
    */
    update: function (data) {
      LayerController.updateImageServiceRasterFunction([state.startValue, data.from], MapConfig.loss);
    },

    playToggle: function () {
      var fromValue, toValue;

      function stopPlaying() {
        playButton.html(config.playHtml);
        state.isPlaying = false;
        state.startValue = undefined;
        clearInterval(playInterval);
      };

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        playButton.html(config.pauseHtml);
        state.isPlaying = true;
        state.startValue = lossSlider.result.from;
        // Trigger a change on the layer for the initial value
        LayerController.updateImageServiceRasterFunction([state.startValue, state.startValue], MapConfig.loss);
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = lossSlider.result.from;
          toValue = lossSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (fromValue >= toValue) {
            stopPlaying();
          } else {
            // Update the slider
            lossSlider.update({
              from: ++fromValue,
              to: toValue
            });
          }

        }, 1000);
      }


    }

  };

  return LossSliderController;

});
