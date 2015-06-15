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
        React.DOM.div({className: "step"}, 
          React.DOM.div({className: "step-body"}, 
            React.DOM.div({className: "step-title"}, config.title), 
            React.DOM.div({className: "step-one-main-description"}, 
              React.DOM.p(null, config.beginningText), 
              React.DOM.ul(null, 
                config.firstList.map(this._listMapper)
              ), 
              React.DOM.p(null, config.secondaryText), 
              React.DOM.ul(null, 
                config.secondList.map(this._listMapper)
              )
            )
          ), 
          React.DOM.div({className: "step-footer"}, 
            React.DOM.div({className: "next-button-container", onClick: WizardActions.proceedToNextStep}, 
              React.DOM.div({className: "next-button"}, "Next")
            )
          )
        )
      );
    },

    _listMapper: function (item) {
        return React.DOM.li(null, item);
    }
    /* jshint ignore:end */

  });

});
