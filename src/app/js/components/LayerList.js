define([
	"react",
	"dojo/topic",
	"utils/Hasher",
	"components/ListItem"
], function (React, topic, Hasher, ListItem) {

	var _components = [];

	var List = React.createClass({

		getInitialState: function (properties) {

			var props = properties || this.props,
					self = this;

			return ({
				items: props.items,
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
					layerId: item.layerId,
					filterClass: item.filterClass,
					type: item.type,
					unique: item.unique,
					// Property for Display
					visible: (this.state.filter === item.filterClass),
					// Functions
					handle: this._handle,
					postCreate: this._postCreate
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

		},

		_handle: function (component) {
			if (component.props.type === 'check') {
				this._check(component);
			} else {
				this._radio(component);
			}
		},

		_postCreate: function (component) {
			_components.push(component);
		},

		_check: function (component) {

			Hasher.toggleLayers(component.props.unique);
			topic.publish('toggleLayer', component.props.layerId);

			component.setState({
				active: !component.state.active
			});

		},

		_radio: function (component) {
			var previous;

			_components.forEach(function (comp) {
				if (comp.props.filterClass === component.props.filterClass) {

					if (comp.state.active) {
						previous = comp;
					}

					comp.setState({
						active: false
					});
				}
			});

			if (previous) {
				if (previous.props.unique !== component.props.unique) {
					// Remove Previous
					Hasher.toggleLayers(previous.props.unique);
					topic.publish('toggleLayer', previous.props.layerId);
					// Add New
					Hasher.toggleLayers(component.props.unique);
					topic.publish('toggleLayer', component.props.layerId);
				}

				component.setState({
					active: true
				});

			} else {

				Hasher.toggleLayers(component.props.unique);
				topic.publish('toggleLayer', component.props.layerId);

				component.setState({
					active: true
				});

			}

		},

		_showChildren: function () {
			
		}

	});


	return function (props, el) {
		return React.renderComponent(new List(props), document.getElementById(el));
	};

});