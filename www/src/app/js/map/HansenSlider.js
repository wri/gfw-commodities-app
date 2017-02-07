define([
  'dojo/on',
  'dojo/dom-class',
  'map/config',
  'esri/request',
  'utils/DateHelper',
  'dojo/Deferred',
  'components/CalendarModal',
  'map/LayerController'
], function (on, domClass, MapConfig, esriRequest, DateHelper, Deferred, CalendarModal, LayerController) {
  // "use strict";

  var playInterval,
      hansenSlider;

  var config = {
    sliderSelector: '#hansen-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 15 // 2015
  };

  var state = {
    isPlaying: false
  };

  var HansenSlider = {

    init: function () {
      var self = this;
      if (hansenSlider === undefined) {

        var calendarModal = new CalendarModal({
        }, 'calendar-modal');

        var playButton = $('#hansenPlayButtonStartClick');
        var startDate = new window.Kalendae.moment('01/01/2015').format('M/D/YYYY');
        var formattedStart = new Date(startDate);
        playButton.html(DateHelper.getDate(formattedStart));

        on(playButton, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('hansenCalendarStart');
          domClass.remove(node.parentNode, 'hidden');
        });

        var playButtonEnd = $('#hansenPlayButtonEndClick');
        var endDate = new window.Kalendae.moment().format('M/D/YYYY');
        var formattedEnd = new Date(endDate);
        playButtonEnd.html(DateHelper.getDate(formattedEnd));

        on(playButtonEnd, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('hansenCalendarEnd');
          domClass.remove(node.parentNode, 'hidden');
        });

      }
    }

  };

  return HansenSlider;

});
