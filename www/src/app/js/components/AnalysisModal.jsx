/** @jsx React.DOM */
define([
  'react',
  'components/ModalWrapper',
  'dojo/cookie',
  'dojo/on',
  'dojo/dom-class'
], function (React, ModalWrapper, cookie, on, domClass) {

  var AnalysisModal = React.createClass({

    getInitialState: function () {
      return ({
        checked: false
      });
    },

    toggleChecked: function () {
			this.setState({
        checked: !this.state.checked
      });
		},

    close: function () {
      if (this.state.checked === true) {
        //todo: add cookie reference and respect it somehow
        cookie('hideAnalysisModal', this.state.checked, {
            expires: 31
        });
      }
      domClass.add('analysis-modal', 'hidden');
    },

    show: function () {
      var splashScreen = cookie('hideAnalysisModal');
      if (!splashScreen) {
        domClass.remove('analysis-modal', 'hidden');
      }
    },

    render: function() {
      return (
        <div className='analysis-modal-window'>
        <div className='tooltipmap'></div>
          <div title='close' className='modal-close close-icon pointer' onClick={this.close}>
            <svg viewBox="0 0 25 25">
              <path d="M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"></path>
            </svg>
          </div>
          <div className='modal-wrapper custom-scroll'>
          <div className='modal-content'>
            <div className='modal-source'>
              <h2 className='analysis-modal-title'>Analysis</h2>

              <div className='modal-overview'>
                <p>
                  Create custom analysis of your area of interest, such as a commodity concession, a jurisdiction, the sourcing area around a palm mill, or a custom area of your choice.
                </p>
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
