define([
  'dojo/on',
  'dojo/dom-class',
  'map/config',
  'esri/request',
  'dojo/Deferred',
  'components/CalendarModal',
  'map/LayerController'
], function (on, domClass, MapConfig, esriRequest, Deferred, CalendarModal, LayerController) {
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

  var GladSlider = {

    init: function () {
      var self = this;
      if (gladSlider === undefined) {
        // debugger
        // console.log(Kalendae);
        // debugger


        var calendarModal = new CalendarModal({
        }, 'calendar-modal');

        playButton = $('#gladPlayButtonStartClick');
        on(playButton, 'click', function() {
          // $('#gladPlayButtonStart').show();
          var node = calendarModal.getDOMNode();
          domClass.remove(node.parentNode, 'hidden');
        });
        // CalendarModal.show();
        // var calendarEnd = new Kalendae('gladPlayButtonEnd', {
        //   months: 1,
        //   mode: 'single',
        //   selected: MapConfig.gladAlerts.endDate
        // });
        // console.log(MapConfig.gladAlerts);


        // calendarEnd.subscribe('change', function (date) {
        //   debugger
        // });


      }
    },

    change: function (data) {
      // debugger
      console.log(data.from, data.to)
      LayerController.updateImageServiceRasterFunction([data.from, data.to], MapConfig.gladAlerts);
    }

  };

  return GladSlider;

});
