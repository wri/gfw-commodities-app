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

  var AnalysisModal = React.createClass({

    getInitialState: function () {
      return ({
        checked: false
      });
    },

    // componentWillReceiveProps: function (newProps, oldProps) {
		// 	this.setState(newProps);
		// },

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
        <div className='analysis-modal-window'>
        <div className='tooltipmap'></div>
          <div title='close' className='modal-close close-icon pointer' onClick={this.close}>
            <svg dangerouslySetInnerHTML={{ __html: closeSvg }}/>
          </div>
          <div className='modal-wrapper custom-scroll'>
          <div className='modal-content'>
            <div className='modal-source'>
              <h2 className='analysis-modal-title'>Analysis</h2>

              <div className='modal-overview'>
                <p>Create custom analysis of your area of interest - such as a commodity concession or group of concessions - considering factors such as:</p>
                <ul>
                  <li>Tree cover change</li>
                  <li>Fire activity</li>
                  <li>Primary or intact forest areas</li>
                  <li>Protected areas</li>
                  <li>Legal classification of land</li>
                </ul>
                <p>You can also:</p>
                <ul>
                  <li>Upload your own shapefiles for analysis</li>
                  <li>Draw an area of interest</li>
                  <li>Sign up for alerts for clearance activity</li>
                </ul>
                <div className='analysis-modal-hide'>Don't show this again<input checked={this.state.checked} onChange={this.toggleChecked} type='checkbox' /></div>
              </div>
            </div>
          </div>
        </div>
        </div>

     );
  }

  /* jshint ignore:end */

  });

  return function (props, el) {
    /* jshint ignore:start */
		return React.render(<AnalysisModal {...props} />, document.getElementById(el));
    /* jshint ignore:end */
	};

});
