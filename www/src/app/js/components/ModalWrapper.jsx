/** @jsx React.DOM */
define([
  "react",
  "dojo/dom-class"
], function (React, domClass) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

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
            <svg dangerouslySetInnerHTML={{ __html: closeSvg }}/>
          </div>
          <div className='modal-wrapper custom-scroll has-footer'>
            {this.props.children}
            <div className='modal-footer'>
              <div className="m-btncontainer is-center">
                <a href="http://earthenginepartners.appspot.com/science-2013-global-forest" target="_blank" className="btn green uppercase download-mobile-link">Learn more or download data</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      );

    }

  });

  // return function (props, el) {
  //   /* jshint ignore:start */
  //   return React.render(<ModalWrapper />, document.getElementById(el));
  //   /* jshint ignore:end */
  // };
  return ModalWrapper;

});
