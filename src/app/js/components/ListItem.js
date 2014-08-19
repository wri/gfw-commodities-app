define([
	"react"
], function (React) {

	// Must Contain the following props
	// title - String
	// filterClass - String
	// subtitle - String
	// layerId - String
	// source - String
	// toggle - Function

	return React.createClass({

		toggle: function (e) {
			alert("Toggle");
			e.currentTarget.classList.toggle("active");
		},

		render: function () {
			return (
				React.DOM.li({'className': 'layer-list-item ' + this.props.filterClass,
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