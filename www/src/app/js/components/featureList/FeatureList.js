define([
	'react',
	'analysis/config',
	'analysis/WizardStore',
	'utils/GeoHelper',
	'lodash'
], function (React, AnalyzerConfig, WizardStore, GeoHelper, _) {

	var FeatureList,
		getDefaultState,
		KEYS = AnalyzerConfig.STORE_KEYS,
		self = this;

	getDefaultState = function () {
		return {

		}
	}

	return React.createClass({

		propTypes: {
			features: React.PropTypes.array.isRequired
			// optional classes/styles
		},

		getInitialState: getDefaultState,

		componentDidMount: function () {
			console.log('FeatureList mount');
		},

		componentWillReceiveProps: function (newProps) {
			console.log('FeatureList receiving props');
		},

		render: function () {
			return (
				React.DOM.div(null,
					'FeatureList Header',
					this.props.features.map(this._featuresMapper, this)
				)
			);
		},

		_featuresMapper: function (feature, index) {
			return (
				React.DOM.div({
						'onClick': this._chooseFeature,
						// TODO: replace inline styling with classes
						'data-feature-index': index,
						'data-feature-id': feature.attributes.WRI_ID
					},
					React.DOM.input({
						'type': 'checkbox',
						'className': 'table-cell',
						'data-feature-index': index,
						'data-feature-id': feature.attributes.WRI_ID
					}),
					React.DOM.input({
						'type': 'text',
						'className': 'custom-feature-label table-cell',
						'placeholder': 'Feature name',
						'size': feature.attributes[AnalyzerConfig.stepTwo.labelField].length - 3,
						'value': feature.attributes[AnalyzerConfig.stepTwo.labelField],
						'data-feature-index': index,
						'data-feature-id': feature.attributes.WRI_ID,
						'onChange': this._renameFeature
					})
				)
			)
		},

		_removeFeature: function(evt) {
			var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
				spliceArgs = [index, 1]
				features = this.props.features,
				featureToRemove = Array.prototype.splice.apply(features, spliceArgs)[0];

			WizardStore.set(KEYS.customFeaturesSpliceArgs, spliceArgs);
			WizardStore.set(KEYS.customFeatures, features);
			return featureToRemove;
		},

		_renameFeature: function(evt) {
			var feature = this._removeFeature(evt)
				features = WizardStore.get(KEYS.customFeatures);

			feature.attributes[AnalyzerConfig.stepTwo.labelField] = evt.target.value;

			WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
			if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
				WizardStore.set(KEYS.selectedCustomFeatures, feature);
			}
		},

		_chooseFeature: function (evt) {
			var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
				features = this.props.features,
				featureToChoose = _.find(features, function(feature) {return feature.attributes.WRI_ID === id;}),
				self = this;

			if (featureToChoose) {
				GeoHelper.zoomToFeature(featureToChoose);
				WizardStore.set(KEYS.selectedCustomFeatures, featureToChoose);
			} else {
				throw new Error('Undefined Error: Could not find selected feature in WizardStore');
			}
		}
	})
})