define([
	"react",
	"utils/Hasher"
], function (React, Hasher) {

	// Must Contain the following props
	// title - String
	// filterClass - String
	// subtitle - String
	// layerId - String
	// source - String
	// toggle - Function
	// active - Boolean
	// visible - Boolean

	return React.createClass({

		getInitialState: function () {

			var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.layerId) > -1;

			return ({
				active: active
			});
		},

		componentDidMount: function () {

		},

		componentDidUpdate: function () {
			
		},

		toggle: function (e) {
			var change = !this.state.active;

			Hasher.toggleLayers(this.props.layerId, change);

			this.setState({
				active: change
			});
		},

		render: function () {
			var newClass = 'layer-list-item ' + 
											this.props.filterClass + 
											(this.state.active ? ' active' : '') +
											(this.props.visible ? '' : ' hidden');			

			return (
				React.DOM.li({'className': newClass,
											'onClick': this.toggle,
											'data-layer': this.props.layerId },
					React.DOM.a({'className': 'layer-title'}, this.props.title),
					React.DOM.a({'className': 'layer-source', 'data-source': this.props.source }),
					React.DOM.p({'className': 'layer-sub-title'}, this.props.subtitle)
				)
			);

		}

	});

});