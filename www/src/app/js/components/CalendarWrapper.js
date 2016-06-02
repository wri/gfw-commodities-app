define([
	'react',
	'components/ModalWrapper',
  'dojo/dom-class'
], function (React, ModalWrapper, domClass) {

  var closeSvg = '<use xlink:href="#shape-close" />';

  var CalendarWrapper = React.createClass({displayName: "CalendarWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "calendar-background", onClick: this.close}), 
        React.createElement("div", {className: "calendar-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
          React.createElement("div", {className: "calendar-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }
  });

  return CalendarWrapper;

});
