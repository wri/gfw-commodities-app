/** @jsx React.DOM */
define([
	'react',
	'components/SubmitWrapper',
  'dojo/dom-class',
  'map/config'
], function (React, SubmitWrapper, domClass, MapConfig) {

	// Variables
	var submitConfig = MapConfig.submitMessages;

	var SubmitModal = React.createClass({displayName: "SubmitModal",

		getInitialState: function() {
			return {
				activeMessage: ''
			};
		},

		render: function() {
			return (
				React.createElement(SubmitWrapper, null, 
					React.createElement("div", {className: "submit-window"}, 
            submitConfig.map(this.itemMapper, this)
					)
				)
			);
		},

    itemMapper: function (item) {
			return React.createElement("div", {className: item.domClass}, 
				React.createElement("div", {id: item.domId, className: ((this.state.activeMessage === item.domId ? '' : ' hidden'))}, item.message)
			);
		},

    // <div id='storyName' className={`${this.state.activeMessage === 'storyName' ? '' : ' hidden'}`}></div>
    // <div id='storyCompany' className={`${this.state.activeMessage === 'storyCompany' ? '' : ' hidden'}`}></div>
    // <div id='storyPosition' className={`${this.state.activeMessage === 'storyPosition' ? '' : ' hidden'}`}></div>

		close: function () {
			var node = React.findDOMNode(this).parentElement;
			domClass.add(node, 'hidden');
		},

    addError: function (area) {
      this.setState({
        activeMessage: area
      });
		},

		changeGladEnd: function (date) {
      var playButtonEnd = $('#gladPlayButtonEndClick');
      playButtonEnd.html('aa');
			this.close();
      this.setState({
        endDate: date
      });
		}

		/* jshint ignore:end */

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(React.createElement(SubmitModal, React.__spread({},  props)), document.getElementById(el));
		/* jshint ignore:end */
	};

});
