/** @jsx React.DOM */
define([
	'react',
	'components/CalendarWrapper',
  'dojo/dom-class',
  'dojo/topic',
  'utils/DateHelper',
	'utils/Analytics',
	'map/config'
], function (React, CalendarWrapper, domClass, topic, DateHelper, Analytics, MapConfig) {

	// Variables
	var calendarConfig = MapConfig.calendars;

	var CalendarModal = React.createClass({

		getInitialState: function() {
			return {
				activeCalendar: '',
        startDate: new window.Kalendae.moment('01/01/2015'),
        endDate: new window.Kalendae.moment()
			};
		},

		componentDidMount: function () {
			var self = this;

			calendarConfig.forEach(function(calendar) {
				var configDate = calendar.selectedDate;
				var selectedDate;

				if (configDate) {
					selectedDate = new window.Kalendae.moment(configDate);
				} else {
					selectedDate = new window.Kalendae.moment();
				}
				var calendar_obj = new window.Kalendae(calendar.domId, {
					months: 1,
					mode: 'single',
					selected: selectedDate
				});
				calendar_obj.subscribe('change', self[calendar.method].bind(self));
			});

		},

		componentWillReceiveProps: function (newProps) {
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

      var formattedStart = new Date(date);

      playButton.html(DateHelper.getDate(formattedStart));
			this.close();
      this.setState({
        startDate: date
      });
			var endDate = this.state.endDate;
			if (endDate.format) {
				endDate = endDate.format('M/D/YYYY');
			}

      topic.publish('updateGladDates', [date, endDate]);
			Analytics.sendEvent('Event', 'Glad Timeline', 'Change start date');
		},

		changeGladEnd: function (date) {
      date = date.format('M/D/YYYY');
      var playButtonEnd = $('#gladPlayButtonEndClick');

      var formattedEnd = new Date(date);
      playButtonEnd.html(DateHelper.getDate(formattedEnd));
			this.close();
      this.setState({
        endDate: date
      });
			var startDate = this.state.startDate;
			if (startDate.format) {
				startDate = startDate.format('M/D/YYYY');
			}

      topic.publish('updateGladDates', [startDate, date]);
			Analytics.sendEvent('Event', 'Glad Timeline', 'Change end date');
		},

		changeHansenStart: function (date) {
      date = date.format('M/D/YYYY');
      var playButtonEnd = $('#hansenPlayButtonEndClick');

      var formattedEnd = new Date(date);
      playButtonEnd.html(DateHelper.getDate(formattedEnd));
			this.close();
      this.setState({
        endDate: date
      });
			var startDate = this.state.startDate;
			if (startDate.format) {
				startDate = startDate.format('M/D/YYYY');
			}

      topic.publish('updateHansenDates', [startDate, date]);
			Analytics.sendEvent('Event', 'Hansen Timeline', 'Change end date');
		},

		changeHansenEnd: function (date) {
      date = date.format('M/D/YYYY');
      var playButtonEnd = $('#hansenPlayButtonEndClick');

      var formattedEnd = new Date(date);
      playButtonEnd.html(DateHelper.getDate(formattedEnd));
			this.close();
      this.setState({
        endDate: date
      });
			var startDate = this.state.startDate;
			if (startDate.format) {
				startDate = startDate.format('M/D/YYYY');
			}

      topic.publish('updateHansenDates', [startDate, date]);
			Analytics.sendEvent('Event', 'Hansen Timeline', 'Change end date');
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(<CalendarModal {...props} />, document.getElementById(el));
		/* jshint ignore:end */
	};

});
