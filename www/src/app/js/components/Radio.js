/** @jsx React.DOM */
define([
	"react",
	"dojo/topic",
  "dojo/dom-class",
	"utils/Hasher",
	"components/Check",
  "dijit/form/HorizontalSlider"
], function (React, topic, domClass, Hasher, Check, HorizontalSlider) {

	var Radio = React.createClass({displayName: "Radio",

    getInitialState: function () {
      return ({ active: this.props.active || false });
    },

    componentDidMount: function () {
      this.props.postCreate(this);
      var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.key) > -1,
          self = this;

			if (active) {
				topic.publish('showLayer', this.props.key);
				this.setState({
					active: active
				});
			}

      // Create the slider if the container exists
      if (document.getElementById(this.props.key + "_slider") && !this.props.noSlider) {
        new HorizontalSlider({
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 100,
          showButtons: false,
          intermediateChanges: false,
          onChange: function (value) {
            topic.publish('changeLayerTransparency', self.props.key, self.props.layerType, value);
          }
        }, this.props.key + "_slider").startup();
      }

    },

    toggle: function (synEvent) {
        if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
            synEvent.target.className.search('dijit') < 0){
            this.props.handle(this);
        }
    },

    showInfo: function (synEvent) {
        if(document.getElementsByClassName(this.props.infoDivClass).length){
            topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
        } else {
            topic.publish('showInfoPanel', this.props.infoDivClass);
        }
    },

    /* jshint ignore:start */
    render: function () {
      var className = 'layer-list-item ' +
                      this.props.filter + 
                      (this.state.active ? ' active' : '') +
                      (this.props.visible ? '' : ' hidden');

      return (
        React.createElement("li", {className: className, "data-layer": this.props.key, "data-name": this.props.filter}, 
          React.createElement("div", {onClick: this.toggle}, 
            React.createElement("span", {className: "radio-icon"}, 
              /* Used as an icon node */
              React.createElement("span", null)
            ), 
            React.createElement("a", {className: "layer-title"}, this.props.title), 
            /* If this condition is met, render a layer info icon, else, render nothing */ 
            
              this.props.title !== "None" && this.props.title !== "Loss" && this.props.title !== "Gain" && !this.props.noSlider ?
              React.createElement("span", {className: "layer-info-icon", onClick: this.showInfo}) : null, 
            
            React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle)
          ), 
          
            this.props.children ?
              React.createElement("ul", null, " ", this.props.children.map(this._mapper), " ") :
              this.props.layerType !== 'none' && !this.props.noSlider ?
                React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
                  React.createElement("div", {id: this.props.key + '_slider'})
                ) :
                null
          
        )
      );
    },

    /* jshint ignore:end */

    _mapper: function (item) {

      item.visible = this.state.active;
      item.handle = this.props.handle;
      item.postCreate = this.props.postCreate;
      item.useRadioCallback = true;

      if (item.type === "radio") {
        return new Radio(item);
      } else {
        return new Check(item);
      }
    }

  });

	return Radio;

});
