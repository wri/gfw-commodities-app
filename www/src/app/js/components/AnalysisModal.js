/** @jsx React.DOM */
define([
  "react",
  "components/ModalWrapper",
  "dojo/cookie",
  "main/config",
  'dojo/on',
  'dojo/dom-class'
], function (React, ModalWrapper, cookie, MainConfig, on, domClass) {

  // Variables
  var config = MainConfig.analysisModal;
  var closeSvg = '<use xlink:href="#shape-close" />';
  var closeHandle;

  var AnalysisModal = React.createClass({displayName: "AnalysisModal",

    getInitialState: function () {
      return ({
        checked: false
      });
    },

    // componentWillReceiveProps: function (newProps, oldProps) {
		// 	this.setState(newProps);
		// },

    componentDidMount: function () {
      debugger
    },

    toggleChecked: function () {
			this.setState({
        checked: !this.state.checked
      });
		},

    close: function () {
      if (this.state.checked === true) {
        //todo: add cookie reference and respect it somehow
      }
      domClass.add('analysis-modal', 'hidden');
    },

    show: function () {
      domClass.remove('analysis-modal', 'hidden');

    },

    render: function() {
      return (
        React.createElement("div", {className: "analysis-modal-window"}, 
        React.createElement("div", {className: "tooltipmap"}), 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("div", {className: "modal-source"}, 
              React.createElement("h2", {className: "analysis-modal-title"}, "Analysis"), 

              React.createElement("div", {className: "modal-overview"}, 
                React.createElement("p", null, "Create custom analysis of your area of interest - such as a commodity concession or group of concessions - considering factors such as:"), 
                React.createElement("ul", null, 
                  React.createElement("li", null, "Tree cover change"), 
                  React.createElement("li", null, "Fire activity"), 
                  React.createElement("li", null, "Primary or intact forest areas"), 
                  React.createElement("li", null, "Protected areas"), 
                  React.createElement("li", null, "Legal classification of land")
                ), 
                React.createElement("p", null, "You can also:"), 
                React.createElement("ul", null, 
                  React.createElement("li", null, "Upload your own shapefiles for analysis"), 
                  React.createElement("li", null, "Draw an area of interest"), 
                  React.createElement("li", null, "Sign up for alerts for clearance activity")
                ), 
                React.createElement("div", {className: "analysis-modal-hide"}, "Don't show this again", React.createElement("input", {checked: this.state.checked, onChange: this.toggleChecked, type: "checkbox"}))
              )
            )
          )
        )
        )

     );
  }

  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(React.createElement(AnalysisModal, React.__spread({},  props)), document.getElementById(el));
    /* jshint ignore:end */
	};

});
