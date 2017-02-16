/** @jsx React.DOM */
define([
  'react',
  'dojo/dom-class'
], function (React, domClass) {

  var ModalWrapper = React.createClass({

    close () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    /* jshint ignore:start */
    render: function() {
      return (
        <div className='modal-container'>
        <div className='modal-background' onClick={this.close} />
        <div className='modal-window'>
          <div title='close' className='modal-close close-icon pointer' onClick={this.close}>
            <svg viewBox="0 0 25 25">
              <path d="M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"></path>
            </svg>
          </div>
          <div className={`modal-wrapper custom-scroll ${(this.props.children && this.props.children[0]) || !this.props.downloadData ? '' : 'has-footer'}`}>
            {this.props.children}
            {(this.props.children && this.props.children[0]) || !this.props.downloadData ? null :
              <div className='modal-footer'>
                <div className="m-btncontainer is-center">
                  <a href={this.props.downloadData} onClick={this.sendDownloadAnalytics} target="_blank" className="btn green uppercase download-mobile-link">Learn more or download data</a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      );

    }

  });

  return ModalWrapper;

});
