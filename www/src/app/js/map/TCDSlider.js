define([
  "dojo/on",
  "map/MapModel",
  "map/config",
  "map/LayerController"
], function (on, MapModel, MapConfig, LayerController) {
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

        var treeCoverLoss = app.map.getLayer(MapConfig.loss.id);
        var densityRange = [data.from_value, data.to_value];
        var from = treeCoverLoss.renderingRule.functionArguments.min_year - 2001;
        var to = treeCoverLoss.renderingRule.functionArguments.max_year - 2001;
        LayerController.updateLossImageServiceRasterFunction([from, to], MapConfig.loss, densityRange);
      }
    }

  };

  return TCDSliderController;

});
