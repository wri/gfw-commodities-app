/** @jsx React.DOM */
define([
  'react',
  'dojo/dom-class'
], function (React, domClass) {

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
            React.createElement("svg", {viewBox: "0 0 25 25"}, 
              React.createElement("path", {d: "M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"})
            )
          ), 
          React.createElement("div", {className: "modal-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }

  });

  return SubmitWrapper;

});
