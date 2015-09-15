define([
  "dojo/on",
  "map/MapModel"
], function (on, MapModel) {
  "use strict";

  var tcdSlider,
      modal;

  var TCDSliderController = {

    show: function () {
      var self = this;
      if (tcdSlider === undefined) {
        tcdSlider = $("#tcd-density-slider").ionRangeSlider({
					values: [0, 10, 15, 20, 25, 30, 50, 75, 100],
					from_min: 1,
					from_max: 7,
          grid: true,
					from: 5,
					onFinish: self.change
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
      // Update the Value in the Model
      MapModel.set('tcdDensityValue', data.from_value);
    }

  };

  return TCDSliderController;

});
