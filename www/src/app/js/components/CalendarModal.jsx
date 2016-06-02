/** @jsx React.DOM */
define([
	'react',
	'components/CalendarWrapper',
  'dojo/dom-class',
  'dojo/topic',
  'utils/DateHelper',
	'map/config'
], function (React, CalendarWrapper, domClass, topic, DateHelper, MapConfig) {

	// Variables
	var calendarConfig = MapConfig.calendars;

	var CalendarModal = React.createClass({

		getInitialState: function() {
			return {
				activeCalendar: '',
        startDate: new window.Kalendae.moment('01/01/2015'),
        endDate: new window.Kalendae.moment().format('M/D/YYYY')
			};
		},

		componentDidMount: function () {

			var self = this;

			calendarConfig.forEach(function(calendar) {
				var calendar_obj = new window.Kalendae(calendar.domId, {
					months: 1,
					mode: 'single',
					// direction: calendar.direction,
					// blackout: function (date) {
					// 	if (date.yearDay() >= calendar.startDate.yearDay()) {
					// 		return false;
					// 	} else {
					// 		return true;
					// 	}
					// },
					selected: calendar.selectedDate
				});
				console.log(self);

				calendar_obj.subscribe('change', self[calendar.method].bind(self));
			});

			// calendarStart.subscribe('change', function (date) {
			// 	debugger
			// });

		},

		componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

		render: function() {
			return (
				<CalendarWrapper>
					<div className='calendar-window'>
						{calendarConfig.map(this.itemMapper, this)}
					</div>
				</CalendarWrapper>
			);
		},

		itemMapper: function (item) {
			return <div className={item.domClass}>
				<div id={item.domId} className={`${this.state.activeCalendar === item.domId ? '' : ' hidden'}`}></div>
			</div>;
		},

		setCalendar: function (calendar) {
			this.setState({
				activeCalendar: calendar
			});
		},

		close: function () {
			var node = React.findDOMNode(this).parentElement;
			domClass.add(node, 'hidden');
		},

		changeGladStart: function (date) {
      date = date.format('M/D/YYYY');
      var playButton = $('#gladPlayButtonStartClick');
      // playButton.html(date);
      var formattedStart = new Date(date);
      playButton.html(DateHelper.getDate(formattedStart));
			this.close();
      this.setState({
        startDate: date
      });
      topic.publish('updateGladDates', [date, this.state.endDate]);
		},

		changeGladEnd: function (date) {
      date = date.format('M/D/YYYY');
      var playButtonEnd = $('#gladPlayButtonEndClick');
      // playButtonEnd.html(date);
      var formattedEnd = new Date(date);
      playButtonEnd.html(DateHelper.getDate(formattedEnd));
			this.close();
      this.setState({
        endDate: date
      });
      topic.publish('updateGladDates', [this.state.startDate, date]);
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(<CalendarModal {...props} />, document.getElementById(el));
		/* jshint ignore:end */
	};

});
