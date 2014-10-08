define([
	"react",
	"dojo/topic",
	"utils/Hasher"
], function (React, topic, Hasher) {

	return React.createClass({

    getInitialState: function () {
      return ({
        active: this.props.active || false
      });
    },

    componentDidMount: function () {
    	this.props.postCreate(this);
    	var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.key) > -1,
          self = this;

      // If layer is activated from the hash in the url
			if (active) {
				this.setState({
					active: active
				});

        if (this.props.useRadioCallback || this.props.key === 'suit') {
          topic.publish('toggleLayer', this.props.key);
        } else {
          // Call these functions on the next animation frame to give React time 
          // to render the changes from its new state, the callback needs to read
          // the ui to update the layer correctly
          requestAnimationFrame(function () {
            topic.publish('updateLayer', self.props);
          });
        }
			}
    },

    toggle: function (synEvent) {
        if(!synEvent.target.classList.contains('layer-info-icon')){
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

    render: function () {

      var className = 'layer-list-item ' +
                      this.props.filter + 
                      (this.state.active ? ' active' : '') +
                      (this.props.visible ? '' : ' hidden');

      return (
        React.DOM.li({'className': className,
                      'data-layer': this.props.key},
            React.DOM.div({'onClick': this.toggle},
            React.DOM.span({'className': 'custom-check'},
                React.DOM.span({})
            ),
            React.DOM.a({'className': 'layer-title'}, this.props.title),
            (this.props.title !== "None" && this.props.title !== "Loss" && this.props.title !== "Gain" ?
                React.DOM.span({'className': 'layer-info-icon', 'onClick': this.showInfo})
                : null
            ),
            React.DOM.p({'className': 'layer-sub-title'}, this.props.subtitle)
          )
        )
      );
    }

  });

});