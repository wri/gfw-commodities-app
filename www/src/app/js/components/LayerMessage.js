/** @jsx React.DOM */
define([
	'react',
	'knockout',
	'dojo/topic',
  'dojo/dom-class'
], function (React, ko, topic, domClass) {

	var LayerMessage = React.createClass({displayName: "LayerMessage",

    componentDidMount: function () {
      this.props.postCreate(this);
    },

    /* jshint ignore:start */
    render: function () {
      var className = 'layer-list-item ' +
        this.props.filter +
				(this.props.parent ? ' indented' : '') +
        (this.props.forceUnderline ? ' newList' : '') +
				(this.props.visible ? '' : ' hidden');

      var inlineStyle = {
        color: '#888',
        paddingRight: '5px'
      };

      return (
        React.createElement("li", {style: inlineStyle, className: className, "data-layer": this.props.id, "data-name": this.props.filter}, 
          React.createElement("div", null, 
            React.createElement("p", {className: "layer-message-title"}, this.props.title, " ", React.createElement("a", {target: "_blank", href: this.props.hrefLocation}, this.props.subtitle))
          )
        )
      );
    }

    /* jshint ignore:end */

  });

	return LayerMessage;

});
