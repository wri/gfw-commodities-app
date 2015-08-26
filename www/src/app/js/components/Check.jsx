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
          active = layerArray.indexOf(this.props.id) > -1,
          self = this;

      // If layer is activated from the hash in the url
      if (active) {
        this.setState({ active: active });

        if (this.props.useRadioCallback || this.props.id === 'suit') {
          topic.publish('toggleLayer', this.props.id);
        } else {
          // Call these functions on the next animation frame to give React time 
          // to render the changes from its new state, the callback needs to read
          // the ui to update the layer correctly
          requestAnimationFrame(function() {
            topic.publish('updateLayer', self.props);
          });
        }
      }
      if (!this.props.kids) {

        // Create the slider
        if (document.getElementById(this.props.id + "_slider")) {
          new HorizontalSlider({
            value: 100,
            minimum: 0,
            maximum: 100,
            discreteValues: 100,
            showButtons: false,
            intermediateChanges: false,
            onChange: function(value) {
              topic.publish('changeLayerTransparency', self.props.id, self.props.layerType, value);
            }
          }, this.props.id + "_slider").startup();
        }
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
          (this.props.parent ? ' indented' : '') +
          (this.props.kids ? ' newList' : '') +
          (this.props.forceUnderline ? ' newList' : '') +
          (this.props.visible ? '' : ' hidden');

          if (this.props.id == 'forma') {
            debugger
          }


      return (        
        <li className={className} data-layer={this.props.id}>
          <div id={this.props.id + '_checkbox'} onClick={this.toggle}>
            
            <span className='custom-check'>
              {/* Used as an icon node */}
              <span />
            </span>
            
            <a className='layer-title'>{this.props.title}</a>
            { /* If this condition is met, render a layer info icon, else, render nothing */ }
            {
              this.props.infoDivClass !== undefined ?
                <span onClick={this.showInfo} className='layer-info-icon' dangerouslySetInnerHTML={{__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}} /> : null
            }

            <p className='layer-sub-title'>{this.props.subtitle}</p>
            {
            this.props.kids ? null : <div title='Layer Transparency' className={'sliderContainer' + (this.state.active ? '' : ' hidden')}>
              <div id={this.props.id + '_slider'} />
            </div>
            }
            

          </div>
        </li>
      );
    }
    /* jshint ignore:end */

  });

});
