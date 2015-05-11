/** @jsx React.DOM */

define([
  // libs
  'react',
  'lodash',
  // src
  'components/featureList/config',
  'analysis/WizardStore',
  'utils/GeoHelper'
], function (React, _, FeatureListConfig, WizardStore, GeoHelper) {

  var FeatureList,
    getDefaultState,
    KEYS = FeatureListConfig.STORE_KEYS,
    self = this;

  return React.createClass({

    propTypes: {
      features: React.PropTypes.array.isRequired,
      selectedFeatures: React.PropTypes.array.isRequired
      // TODO: optional classes/styles
      // TODO: handle generic column registration w/ parent callback for events (rspo checkbox)
    },

    render: function () {
      var allFeaturesSelected = false,
          featureIds,
          selectedFeatureIds,
          allFeaturesSelected;

      if (this.props.selectedFeatures) {
        featureIds = this.props.features.map(function (feature) {return feature.attributes.WRI_ID});
        selectedFeatureIds = this.props.selectedFeatures.map(function (selectedFeature) {return selectedFeature.attributes.WRI_ID});
        allFeaturesSelected = featureIds.length > 0 && _.difference(featureIds, selectedFeatureIds).length === 0;
      }

      return (
        React.DOM.div(null, 
          React.DOM.button({className: "float-right margin__right"}, " Clear "), 
          React.DOM.div({className: "padding__wide"}, " FeatureList instruction "), 
          React.DOM.table({className: "no-border-spacing fill__wide"}, 
            React.DOM.tr({className: "text-white back-orange"}, 
              React.DOM.td(null, React.DOM.input({type: "checkbox", onClick: this._toggleAllFeaturesSelection, checked: allFeaturesSelected})), 
              React.DOM.td(null, " Area Name ")
            ), 
            this.props.features.map(this._featuresMapper, this)
          )
        )
      );
    },

    _featuresMapper: function (feature, index) {
      var className = index % 2 === 0 ? 'back-light-gray' : '',
          isSelected = _.find(this.props.selectedFeatures, function (selectedFeature) { return feature.attributes.WRI_ID === selectedFeature.attributes.WRI_ID}) || false;

      return (
        React.DOM.tr({className: className}, 
          React.DOM.td(null, 
            React.DOM.input({type: "checkbox", onClick: this._toggleFeatureSelection, checked: isSelected, 'data-feature-index': index, 'data-feature-id': feature.attributes.WRI_ID})
          ), 
          React.DOM.td(null, 
            React.DOM.input({className: "custom-feature-label", type: "text", onChange: this._renameFeature, value: feature.attributes[FeatureListConfig.stepTwo.labelField], 'data-feature-index': index, 'data-feature-id': feature.attributes.WRI_ID})
          )
        )
      )
    },

    _toggleFeatureSelection: function (evt) {
      var index,
          id,
          filteredSelectedFeatures;

      if (evt.target.checked) {
        index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index"));
        filteredSelectedFeatures = this.props.selectedFeatures.concat(this.props.features[index]);
      } else {
        id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
        filteredSelectedFeatures = _.filter(this.props.selectedFeatures, function (selectedFeature) { return selectedFeature.attributes.WRI_ID !== id })
      }

      WizardStore.set(KEYS.selectedCustomFeatures, filteredSelectedFeatures);
    },

    _toggleAllFeaturesSelection: function (evt) {
      var features = this.props.features,
          featureIds = features.map(function (feature) {return feature.attributes.WRI_ID}),
          selectedFeatureIds,
          featuresToSelect,
          updatedSelectedFeatureIds;

      if (evt.target.checked) {
        selectedFeatureIds = this.props.selectedFeatures.map(function (feature) {return feature.attributes.WRI_ID}),
        featuresToSelect = _.difference(featureIds, selectedFeatureIds).map(function (id) { return _.find(features, function (feature) {return feature.attributes.WRI_ID === id}) }),
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).concat(featuresToSelect);
      } else {
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).filter(function (feature) { return featureIds.indexOf(feature.attributes.WRI_ID) < 0 });
      }

      WizardStore.set(KEYS.selectedCustomFeatures, updatedSelectedFeatureIds);
    },

    _removeFeature: function (evt) {
      var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
        spliceArgs = [index, 1]
        features = this.props.features,
        featureToRemove = Array.prototype.splice.apply(features, spliceArgs)[0];

      WizardStore.set(KEYS.customFeaturesSpliceArgs, spliceArgs);
      WizardStore.set(KEYS.customFeatures, features);
      return featureToRemove;
    },

    _renameFeature: function (evt) {
      var index = parseInt(evt.target.dataset ? evt.target.dataset.featureIndex : evt.target.getAttribute("data-feature-index")),
          features = WizardStore.get(KEYS.customFeatures);
      
      features[index].attributes[FeatureListConfig.stepTwo.labelField] = evt.target.value;

      WizardStore.set(KEYS.customFeatures, features);
      if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
        WizardStore.set(KEYS.selectedCustomFeatures, feature);
      }
    },

    // TODO: replace chooseFeature with selectFeature respecting multiple feature selection
    _chooseFeature: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
        features = this.props.features,
        featureToChoose = _.find(features, function (feature) {return feature.attributes.WRI_ID === id;}),
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
