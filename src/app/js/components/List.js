define([
	"react",
	"components/ListItem"
], function (React, ListItem) {

	var List = React.createClass({

		getInitialState: function (properties) {

			var props = properties || this.props,
					self = this;

			return ({
				filter: props.filter
			});

		},

		componentDidMount: function () {
			
		},

		componentDidUpdate: function () {
			
		},

		componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(this.getInitialState(newProps));
		},

		render: function () {
			var createListItems = function (item) {				
				return new ListItem({
					title: item.title,
					subtitle: item.subtitle,
					source: item.source,
					toggle: item.toggle,
					layerId: item.layerId,
					filterClass: item.filterClass,
					visible: (this.state.filter === item.filterClass)
				});
			};

			return (
				React.DOM.div({},
					React.DOM.div({'className': 'filter-list-title'}, this.props.title),
					React.DOM.div({'className': 'layer-line'}),
					React.DOM.ul({'className': 'filter-list'},
						this.props.items.map(createListItems, this)
					)
				)
			);

		}

	});


	return function (props, el) {
		return React.renderComponent(new List(props), document.getElementById(el));
	};

});