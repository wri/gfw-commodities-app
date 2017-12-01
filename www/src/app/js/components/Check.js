/** @jsx React.DOM */
define([
	'react',
	'knockout',
	'dojo/topic',
	'dojo/dom-class',
	'map/TCDSlider',
	'map/MapModel',
	'utils/Hasher',
	'dijit/form/HorizontalSlider'
], function(React, ko, topic, domClass, TCDSlider, MapModel, Hasher, HorizontalSlider) {


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

				if (this.props.useRadioCallback || this.props.id === 'suit' || this.props.id === 'soy') {
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
				if (document.getElementById(this.props.id + '_slider')) {
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
					}, this.props.id + '_slider').startup();
				}
			}

			if (this.props.id === 'hansenLoss') {
				ko.applyBindings(MapModel.get('model'), document.querySelector('.loss-button-container'));
			}

		},

		toggle: function(synEvent) {
			if (!domClass.contains(synEvent.target, 'layer-info-icon') &&
				synEvent.target.className.search('dijit') < 0) {
				this.props.handle(this);
			}
		},

		showInfo: function() {
			if (document.getElementsByClassName(this.props.infoDivClass).length) {
				topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0], this.props.id);
			} else {
				topic.publish('showInfoPanel', this.props.infoDivClass, this.props.id);
			}
		},

		showTCDSlider: function (evt) {
			TCDSlider.show();
			evt.stopPropagation();
		},

		/* jshint ignore:start */
		render: function() {
			var className = 'layer-list-item ' +
					this.props.filter +
					(this.state.active ? ' active' : '') +
					(this.props.parent ? ' indented' : '') +
					(this.props.kids ? ' newList' : '') +
					(this.props.visible ? '' : ' hidden');

			return (
				React.createElement("li", {className: className, "data-layer": this.props.id}, 
						React.createElement("div", {id: this.props.id + '_checkbox', onClick: this.props.kids ? null : this.toggle}, 

						
							this.props.kids ? null : React.createElement("span", {className: "custom-check"}, 
								/* Used as an icon node */
								React.createElement("span", null)
							), 
						
						/* If this condition is met, render a layer info icon, else, render nothing */ 
						
							this.props.infoDivClass !== undefined ?
								React.createElement("span", {onClick: this.showInfo, className: "layer-info-icon", dangerouslySetInnerHTML: {__html: "<svg class='info-icon-svg'><use xlink:href='#shape-info'></use></svg>"}}) : null, 
						
						React.createElement("a", {className: "layer-title"}, this.props.title), 

						React.createElement("p", {className: "layer-sub-title"}, this.props.subtitle), 
						
						this.props.kids || this.props.id === 'gladConfidence' ? null : React.createElement("div", {title: "Layer Transparency", className: 'sliderContainer' + (this.state.active ? '' : ' hidden')}, 
							React.createElement("div", {id: this.props.id + '_slider'})
						), 
						
						
							this.props.id === 'hansenLoss' ? (
								React.createElement("div", {className: 'loss-button-container' + (this.state.active ? '' : ' hidden')}, 
											React.createElement("span", {className: "tcd-percentage-label"}, "Displaying at "), 
											React.createElement("span", {className: "tcd-percentage-button", onClick: this.showTCDSlider, "data-bind": "text: tcdDensityValue"}), 
											React.createElement("span", {className: "tcd-percentage-label"}, " density")
								)
							) : null
						

					)
				)
			);
		}
		/* jshint ignore:end */

	});

});
