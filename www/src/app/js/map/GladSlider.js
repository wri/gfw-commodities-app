define([
  'dojo/on',
  'dojo/dom-class',
  'map/config',
  'esri/request',
  'utils/DateHelper',
  'dojo/Deferred',
  'components/CalendarModal'
], function (on, domClass, MapConfig, esriRequest, DateHelper, Deferred, CalendarModal) {

  var gladSlider;

  var GladSlider = {

    init: function () {
      if (gladSlider === undefined) {

        var gladStartDate, gladEndDate;

        var calendarModal = new CalendarModal({
        }, 'calendar-modal');

        MapConfig.calendars.forEach(function(calendar) {
          if (calendar.domId === 'gladCalendarStart') {
            gladStartDate = calendar.selectedDate;
          } else if (calendar.domId === 'gladCalendarEnd') {
            gladEndDate = calendar.selectedDate;
          }
        });

        var playButton = $('#gladPlayButtonStartClick');
        var startDate = new window.Kalendae.moment(gladStartDate).format('M/D/YYYY');
        var formattedStart = new Date(startDate);
        playButton.html(DateHelper.getDate(formattedStart));

        on(playButton, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('gladCalendarStart');
          domClass.remove(node.parentNode, 'hidden');
        });

        var playButtonEnd = $('#gladPlayButtonEndClick');
        var endDate = new window.Kalendae.moment().format('M/D/YYYY');
        var formattedEnd = new Date(endDate);
        playButtonEnd.html(DateHelper.getDate(formattedEnd));

        on(playButtonEnd, 'click', function() {
          var node = calendarModal.getDOMNode();
          calendarModal.setCalendar('gladCalendarEnd');
          domClass.remove(node.parentNode, 'hidden');
        });

      }
    }

  };

  return GladSlider;

});
