/** @jsx React.DOM */
define([
	"react",
	"dojo/topic",
	"utils/Hasher",
	"actions/WizardActions",
	"components/RadioButton",
	"components/Check"
], function (React, topic, Hasher, WizardActions, RadioButton, Check) {

	var _components = [];

	var List = React.createClass({displayName: "List",

		getInitialState: function () {
			return ({
				title: this.props.title,
				filter: this.props.filter
			});

		},

		componentWillReceiveProps: function (newProps, oldProps) {
			this.setState(newProps);
		},

		/* jshint ignore:start */
		render: function () {

			return (
				React.createElement("div", {className: "smart-list"}, 
					React.createElement("div", {className: this.props.title}, 
							React.createElement("div", {className: "category-icon"})
					), 
					React.createElement("div", {className: "filter-list-title"}, this.props.title), 
					React.createElement("div", {className: "layer-line"}), 
					React.createElement("ul", {className: "filter-list"}, 
						this.props.items.map(this._mapper, this)
					)
				)
			);
		},

		_mapper: function (props) {
			props.visible = (this.state.filter === props.filter);
			props.handle = this._handle;
			props.postCreate = this._postCreate;

			if (props.type === 'radio') {
				return React.createElement(RadioButton, React.__spread({},  props));
			} else {
				return React.createElement(Check, React.__spread({},  props));
			}

		},
		/* jshint ignore:end */

		_handle: function (component) {
			console.log(component.props);
			if (component.props.type === 'radio') {
				this._radio(component);
			} else {
				this._check(component);
			}
		},

		_check: function (component) {
			console.log('_check');
			var newState = !component.state.active;
			component.setState({
				active: newState
			});

			if (component.props.layerType !== 'none') {
				Hasher.toggleLayers(component.props.id);
			}

			if (component.props.useRadioCallback || component.props.id === 'suit' || component.props.id === 'soy') {
				if (component.props.id === 'gladConfidence') {

					topic.publish('toggleGladConfidence', component.state.active);
					WizardActions.setGladConfidence(component.state.active);
				} else {
					topic.publish('toggleLayer', component.props.id);
				}
			} else {
				// Call this function on the next animation frame to give React time
				// to render the changes from its new state, the callback needs to read
				// the ui to update the layer correctly
				requestAnimationFrame(function () {
					topic.publish('updateLayer', component.props);
				});
			}

		},

		_radio: function (component) {

			var previous,	isNewSelection;

			_components.forEach(function (item, idx) {
				if (item.props.filter === component.props.filter) {
					if (item.state.active) {
						previous = item;
					}
				}
			});

			if (previous) {
				isNewSelection = (previous.props.id !== component.props.id);
				if (isNewSelection) {
					if (previous.props.type !== 'check') {
						previous.setState({
							active: false
						});

						// Remove Previous Hash but ignore it if None was previous
						if (previous.props.id.search("none_") === -1) {
							Hasher.toggleLayers(previous.props.id);
							topic.publish('hideLayer', previous.props.id);
						}

						// Toggle Children for Previous if it has any
						this._toggleChildren(previous, 'remove');
					}

					// Add New if None is not selected and isNew
					if (component.props.id.search("none_") === -1) {
						Hasher.toggleLayers(component.props.id);
						topic.publish('showLayer', component.props.id);
					}

				} else {
					// The Same button was clicked twice, just disable it
					component.setState({
						active: false
					});

					this._toggleChildren(component, 'remove');
					Hasher.removeLayers(component.props.id);
					topic.publish('hideLayer', component.props.id);

				}
			} else {
				// Add New if None is not selected and isNew
				if (component.props.id.search("none_") === -1) {
					Hasher.toggleLayers(component.props.id);
					topic.publish('showLayer', component.props.id);
				}
			}

			if (isNewSelection !== false) {
				component.setState({
					active: true
				});

				this._toggleChildren(component, 'add');
			}

		},

		_toggleChildren: function (component, action) {

			var childComponents = [];

			if (component.props.children) {
				component.props.children.forEach(function (child) {
					_components.forEach(function (comp) {
						if (comp.props.id === child.id) {
							childComponents.push(comp);
						}
					});
				});

				if (action === 'remove') {
					childComponents.forEach(function (child) {
						if (child.state.active) {
							topic.publish('hideLayer', child.props.id);
							Hasher.removeLayers(child.props.id);
						}
					});
				} else {
					childComponents.forEach(function (child) {
						if (child.state.active) {
							topic.publish('showLayer', child.props.id);
							Hasher.toggleLayers(child.props.id);
						}
					});
				}
			}

		},

		_postCreate: function (component) {
			_components.push(component);
		},

		toggleFormElement: function (id) {
			// Loop through the components
			// If the id matches, trigger the onChange callback (a.k.a. props.handle)
			_components.forEach(function (comp) {
				if (comp.props.id === id) {
					comp.props.handle(comp);
				}
			});
		}

	});

	return function (props, el) {
		/* jshint ignore:start */
		return React.render(React.createElement(List, React.__spread({},  props)), document.getElementById(el));
		/* jshint ignore:end */
	};

});
