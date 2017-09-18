/** @jsx React.DOM */
define([
	'react',
	'knockout',
	'dojo/topic',
  'dojo/dom-class',
	'utils/Hasher',
	'map/MapModel',
	'map/TCDSlider',
	'components/Check',
  'dijit/form/HorizontalSlider'
], function (React, ko, topic, domClass, Hasher, MapModel, TCDSlider, Check, HorizontalSlider) {

	var RadioButton = React.createClass({displayName: "RadioButton",

    getInitialState: function () {
      return ({ active: this.props.active || false });
    },

    componentDidMount: function () {
      this.props.postCreate(this);
      var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.id) > -1,
          self = this;

			if (active) {
				topic.publish('showLayer', this.props.id);
				this.setState({
					active: active
				});
			}

      // Create the slider if the container exists
      if (document.getElementById(this.props.id + '_slider') && !this.props.noSlider) {
        new HorizontalSlider({
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 100,
          showButtons: false,
          intermediateChanges: false,
          onChange: function (value) {
            topic.publish('changeLayerTransparency', self.props.id, self.props.layerType, value);
          }
        }, this.props.id + '_slider').startup();
      }

			if (this.props.id === 'tcd') {
				ko.applyBindings(MapModel.get('model'), document.querySelector('.tcd-button-container'));
			}

    },

    toggle: function (synEvent) {
        if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
            synEvent.target.className.search('dijit') < 0){
            this.props.handle(this);
        }
    },

    showInfo: function () {
			// console.log('propssss', this.props);
        if(document.getElementsByClassName(this.props.infoDivClass).length){
            topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0], this.props.id);
        } else {
            topic.publish('showInfoPanel', this.props.infoDivClass, this.props.id);
        }
    },

		showTCDSlider: function () {
			TCDSlider.show();
		},

    /* jshint ignore:start */
    render: function () {
      var className = 'layer-list-item ' +
        this.props.filter +
        (this.state.active ? ' active' : '') +
				(this.props.parent ? ' indented' : '') +
        (this.props.forceUnderline ? ' newList' : '') +
        (this.props.visible ? '' : ' hidden');

      return (
        React.createElement("li", {className: className, "data-layer": this.props.id, "data-name": this.props.filter}, 
          React.createElement("div", {onClick: this.toggle}, 
            React.createElement("span", {className: "radio-icon"}, 
              /* Used as an icon node */
              React.createElement("span", null)
            ), 
						/* If this condition is met, render a layer info icon, else, render nothing */ 
            
              (this.props.title !== 'None' && this.props.id !== 'tcc' && !this.props.noSlider) ?
              React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}}) : null, 
            
            React.createElement("a", {className: "layer-title"}, this.props.title), 

            React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle)
          ), 
          
            this.props.children ?
              React.createElement("ul", null, " ", this.props.children.map(this._mapper), " ") :
              this.props.layerType !== 'none' && !this.props.noSlider ?
                React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
                  React.createElement("div", {id: this.props.id + '_slider'})
                ) :
                null, 
          
					
						this.props.id === 'tcd' ? (
							React.createElement("div", {className: 'tcd-button-container' + (this.state.active ? '' : ' hidden')}, 
										React.createElement("span", {className: "tcd-percentage-label"}, "Displaying at "), 
										React.createElement("span", {className: "tcd-percentage-button", onClick: this.showTCDSlider, "data-bind": "text: tcdDensityValue"}), 
										React.createElement("span", {className: "tcd-percentage-label"}, " density")
							)
						) : null
					
        )
      );
    },

    _mapper: function (item) {

      item.visible = this.state.active;
      item.handle = this.props.handle;
      item.postCreate = this.props.postCreate;
      item.useRadioCallback = true;

      if (item.type === 'radio') {
        return React.createElement(RadioButton, React.__spread({},  item));
      } else {
        return React.createElement(Check, React.__spread({},  item));
      }
    }

    /* jshint ignore:end */

  });

	return RadioButton;

});
