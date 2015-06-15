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
        <div className='step'>
          <div className='step-body'>
            <div className='step-title'>{config.title}</div>
            <div className='step-one-main-description'>
              <p>{config.beginningText}</p>
              <ul>
                {config.firstList.map(this._listMapper)}
              </ul>
              <p>{config.secondaryText}</p>
              <ul>
                {config.secondList.map(this._listMapper)}
              </ul>
            </div>
          </div>
          <div className='step-footer'>
            <div className='next-button-container' onClick={WizardActions.proceedToNextStep}>
              <div className='next-button'>Next</div>
            </div>
          </div>
        </div>
      );
    },

    _listMapper: function (item) {
        return <li>{item}</li>;
    }
    /* jshint ignore:end */

  });

});
