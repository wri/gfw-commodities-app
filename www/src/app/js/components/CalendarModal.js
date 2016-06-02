/** @jsx React.DOM */
define([
	'react',
	'components/CalendarWrapper',
	'map/config'
], function (React, CalendarWrapper, MapConfig) {

	// Variables
	var calendarConfig = MapConfig.calendars;

	var CalendarModal = React.createClass({displayName: "CalendarModal",

		componentDidMount: function () {

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

				// calendar_obj.subscribe('change', this[calendar.method].bind(this));
			});
			// var calendarStart = new Kalendae(calendarConfig.gladStart.domId, {
			//   months: 1,
			//   mode: 'single',
			//   selected: calendarConfig.gladStart.selectedDate
			// });

			// var calendarEnd = new Kalendae('gladPlayButtonStart', {
			//   months: 1,
			//   mode: 'single',
			//   selected: config.gladAlerts.endDate
			// });

			// calendarStart.subscribe('change', function (date) {
			// 	debugger
			// });

		},

		componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

		render: function() {
			console.log(this.props);
			return (
				React.createElement(CalendarWrapper, null, 
          calendarConfig.map(this.itemMapper, this)
				)
			);
		},

		itemMapper: function (item) {
			console.log(item);
			//<div className={`modal-content ${item.domClass}${this.state.calendarVisible === item.domId ? '' : ' hidden'}`}>
			return React.createElement("div", {className: ("calendar-window " + item.domClass)}, 
				React.createElement("div", {id: item.domId})
			);
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(React.createElement(CalendarModal, React.__spread({},  props)), document.getElementById(el));
		/* jshint ignore:end */
	};

});
