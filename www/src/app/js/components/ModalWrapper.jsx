/** @jsx React.DOM */
define([
  "react"
], function (React) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

  var ModalWrapper = React.createClass({

    /* jshint ignore:start */
    render: function() {
      return (
        <div className='modal-container'>
        <div className='modal-background' onClick={this.close} />
        <article className='modal shadow'>
          <div title='close' className='close-icon pointer' onClick={this.close} >
            <svg dangerouslySetInnerHTML={{ __html: closeSvg }}/>
          </div>
            <div className='modal-content custom-scroll'>
              {this.props.children}
            </div>
        </article>
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
