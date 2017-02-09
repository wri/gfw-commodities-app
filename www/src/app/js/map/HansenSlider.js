define([
  'dojo/on',
  'dojo/dom-class',
  'map/config',
  'esri/request',
  'utils/DateHelper',
  'dojo/Deferred',
  'components/CalendarModal'
], function (on, domClass, MapConfig, esriRequest, DateHelper, Deferred, CalendarModal) {
  // "use strict";

  var hansenSlider;


  var HansenSlider = {

    init: function () {
      if (hansenSlider === undefined) {

        var hansenStartDate, hansenEndDate;

        var calendarModal = new CalendarModal({
        }, 'calendar-modal');

        MapConfig.calendars.forEach(function(calendar) {
          if (calendar.domId === 'hansenCalendarStart') {
            hansenStartDate = calendar.selectedDate;
          } else if (calendar.domId === 'hansenCalendarEnd') {
            hansenEndDate = calendar.selectedDate;
          }
        });

        var playButton = $('#hansenPlayButtonStartClick');
        var startDate = new window.Kalendae.moment(hansenStartDate).format('M/D/YYYY');
        var formattedStart = new Date(startDate);
        playButton.html(DateHelper.getDate(formattedStart));

        on(playButton, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('hansenCalendarStart');
          domClass.remove(node.parentNode, 'hidden');
        });

        var playButtonEnd = $('#hansenPlayButtonEndClick');
        var endDate = new window.Kalendae.moment(hansenEndDate).format('M/D/YYYY');
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
