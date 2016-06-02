/** @jsx React.DOM */
define([
  'react',
  'dojo/dom-class'
], function (React, domClass) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

  var SubmitWrapper = React.createClass({displayName: "SubmitWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "submit-background", onClick: this.close}), 
        React.createElement("div", {className: "modal-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }

  });

  // return function (props, el) {
  //   /* jshint ignore:start */
  //   return React.render(<ModalWrapper />, document.getElementById(el));
  //   /* jshint ignore:end */
  // };
  return SubmitWrapper;

});
