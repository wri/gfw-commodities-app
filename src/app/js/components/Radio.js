define([
	"react",
	"dojo/topic",
	"utils/Hasher",
	"components/Check"
], function (React, topic, Hasher, Check) {

	var Radio = React.createClass({

    getInitialState: function () {

      return ({
        active: this.props.active || false
      });

    },

    componentDidMount: function () {
      this.props.postCreate(this);
      var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.key) > -1;

			if (active) {
				topic.publish('showLayer', this.props.key);
				this.setState({
					active: active
				});
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
                      'data-layer': this.props.key,
                      'data-name': this.props.filter },
          React.DOM.div({'onClick': this.toggle},
            React.DOM.span({'className': 'radio-icon'},
              React.DOM.span({})
            ),
            React.DOM.a({'className': 'layer-title'}, this.props.title),
              (this.props.title !== "None" && this.props.title !== "Loss" && this.props.title !== "Gain" ?
                  React.DOM.span({'className': 'layer-info-icon', 'onClick': this.showInfo},"X")
                  : null
                  ),
            React.DOM.p({'className': 'layer-sub-title'}, this.props.subtitle)
          ),
          (this.props.children ? 
            React.DOM.ul({},
              this.props.children.map(this._mapper)
            ) : null
          )
        )
      );
    },

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