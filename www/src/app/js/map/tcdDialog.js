define([
  "dojo/on"
], function (on) {
  "use strict";

  var tcdSlider;

  var Controller = {

    show: function () {
      var self = this;
      if (tcdSlider === undefined) {
        tcdSlider = $("#tcd-density-slider").ionRangeSlider({
					values: [0, 10, 15, 20, 25, 30, 50, 75, 100],
					from_min: 1,
					from_max: 7,
					from: 5,
					onFinish: self.update
				});
      }

      $("#tcd-modal").addClass("active");
      on.once($("#tcd-modal .close-icon"), "click", this.hide);
    },

    hide: function () {
      $("#tcd-modal").removeClass("active");
    },

    update: function () {

    }

  };

  return Controller;

});
