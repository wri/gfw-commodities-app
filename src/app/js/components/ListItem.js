define([
	"react",
	"dojo/topic",
	"utils/Hasher"
], function (React, topic, Hasher) {

	// Must Contain the following props
	// title - String
	// filterClass - String
	// subtitle - String
	// layerId - String
	// source - String
	// active - Boolean
	// visible - Boolean
	// type - String (radio or check)
	// unique - String (Unique Identifier)
	// Functions
	// handle - from parent
	// postCreate - from parent

	return React.createClass({

		getInitialState: function () {

			var layerArray = Hasher.getLayers(),
					active = layerArray.indexOf(this.props.unique) > -1;

			if (active) {
				topic.publish('toggleLayer', this.props.layerId);
			}

			// Pass A reference of this component to the parent
			this.props.postCreate(this);

			return ({
				active: active
			});
		},

		componentDidMount: function () {

		},

		componentDidUpdate: function (newProps, oldProps) {

		},

		toggle: function (e) {	
			this.props.handle(this);
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