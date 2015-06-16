/** @jsx React.DOM */
define([
  "react",
  "analysis/config",
  "actions/WizardActions"
], function (React, AnalyzerConfig, WizardActions) {

  // Variables
  var config = AnalyzerConfig.intro;

  return React.createClass({
    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "step"}, 
          React.createElement("div", {className: "step-body"}, 
            React.createElement("div", {className: "step-title"}, config.title), 
            React.createElement("div", {className: "step-one-main-description"}, 
              React.createElement("p", null, config.beginningText), 
              React.createElement("ul", null, 
                config.firstList.map(this._listMapper)
              ), 
              React.createElement("p", null, config.secondaryText), 
              React.createElement("ul", null, 
                config.secondList.map(this._listMapper)
              )
            )
          ), 
          React.createElement("div", {className: "step-footer"}, 
            React.createElement("div", {className: "next-button-container", onClick: WizardActions.proceedToNextStep}, 
              React.createElement("div", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },

    _listMapper: function (item) {
        return React.createElement("li", null, item);
    }
    /* jshint ignore:end */

  });

});
