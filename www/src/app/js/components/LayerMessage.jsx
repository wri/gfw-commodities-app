/** @jsx React.DOM */
define([
	'react',
	'knockout',
	'dojo/topic',
  'dojo/dom-class'
], function (React, ko, topic, domClass) {

	var LayerMessage = React.createClass({

    componentDidMount: function () {
      this.props.postCreate(this);
    },

    /* jshint ignore:start */
    render: function () {
      var className = 'layer-list-item ' +
        this.props.filter +
				(this.props.parent ? ' indented' : '') +
        (this.props.forceUnderline ? ' newList' : '');

      var inlineStyle = {
        color: '#888',
        paddingRight: '5px'
      };

      return (
        <li style={inlineStyle} className={className} data-layer={this.props.id} data-name={this.props.filter}>
          <div>
            <p className='layer-message-title'>{this.props.title} <a target='_blank' href={this.props.hrefLocation}>{this.props.subtitle}</a></p>
          </div>
        </li>
      );
    }

    /* jshint ignore:end */

  });

	return LayerMessage;

});
