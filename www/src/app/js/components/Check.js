/** @jsx React.DOM */
define([
  "react",
  "dojo/topic",
  "dojo/dom-class",
  "utils/Hasher",
  "dijit/form/HorizontalSlider"
], function(React, topic, domClass, Hasher, HorizontalSlider) {


  return React.createClass({

    getInitialState: function() {
      return ({
        active: this.props.active || false
      });
    },

    componentDidMount: function() {
      this.props.postCreate(this);
      var layerArray = Hasher.getLayers(),
          active = layerArray.indexOf(this.props.key) > -1,
          self = this;

      // If layer is activated from the hash in the url
      if (active) {
        this.setState({ active: active });

        if (this.props.useRadioCallback || this.props.key === 'suit') {
          topic.publish('toggleLayer', this.props.key);
        } else {
          // Call these functions on the next animation frame to give React time 
          // to render the changes from its new state, the callback needs to read
          // the ui to update the layer correctly
          requestAnimationFrame(function() {
            topic.publish('updateLayer', self.props);
          });
        }
      }

      // Create the slider
      if (document.getElementById(this.props.key + "_slider")) {
        new HorizontalSlider({
          value: 100,
          minimum: 0,
          maximum: 100,
          discreteValues: 100,
          showButtons: false,
          intermediateChanges: false,
          onChange: function(value) {
            topic.publish('changeLayerTransparency', self.props.key, self.props.layerType, value);
          }
        }, this.props.key + "_slider").startup();
      }
    },

    toggle: function(synEvent) {
      if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
        synEvent.target.className.search('dijit') < 0) {
        this.props.handle(this);
      }
    },

    showInfo: function(synEvent) {
      if (document.getElementsByClassName(this.props.infoDivClass).length) {
        topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
      } else {
        topic.publish('showInfoPanel', this.props.infoDivClass);
      }
    },

    /* jshint ignore:start */
    render: function() {
      var className = 'layer-list-item ' +
          this.props.filter +
          (this.state.active ? ' active' : '') +
          (this.props.visible ? '' : ' hidden');

      return (
        React.createElement("li", {className: className, "data-layer": this.props.key}, 
          React.createElement("div", {id: this.props.key + '_checkbox', onClick: this.toggle}, 
            React.createElement("span", {className: "custom-check"}, 
              /* Used as an icon node */
              React.createElement("span", null)
            ), 
            React.createElement("a", {className: "layer-title"}, this.props.title), 
            /* If this condition is met, render a layer info icon, else, render nothing */ 
            
              this.props.title !== 'Loss' && this.props.title !== 'Gain' && this.props.infoDivClass !== undefined ?
                React.createElement("span", {className: "layer-info-icon", onClick: this.showInfo}) : null, 
            
            React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle), 
            React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
              React.createElement("div", {id: this.props.key + '_slider'})
            )
          )
        )
      );
    }
    /* jshint ignore:end */

  });

});
