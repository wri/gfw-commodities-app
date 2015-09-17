define([
  "dojo/on",
  "map/MapModel",
  "map/LayerController"
], function (on, MapModel, LayerController) {
  "use strict";

  var tcdSlider,
      modal;

  var TCDSliderController = {

    show: function () {
      var self = this;
      if (tcdSlider === undefined) {
        tcdSlider = $("#tcd-density-slider").ionRangeSlider({
          type: 'double',
					values: [0, 10, 15, 20, 25, 30, 50, 75, 100],
          hide_min_max: true,
					from_min: 1,
					from_max: 7,
          to_fixed: true,
          grid: true,
          grid_snap: true,
					from: 5,
					onFinish: self.change,
          prettify: function (value) { return value + '%'; }
				});
      }

      // Cache the dom query operation
      modal = $("#tcd-modal");
      modal.addClass("active");
      on.once($("#tcd-modal .close-icon")[0], "click", self.hide);
    },

    hide: function () {
      if (modal) { modal.removeClass("active"); }
    },

    change: function (data) {
      var value = data.from_value;
      if (value) {
        // Update the Value in the Model
        MapModel.set('tcdDensityValue', data.from_value);
        LayerController.updateTCDRenderingRule(data.from_value);
      }
    }

  };

  return TCDSliderController;

});
