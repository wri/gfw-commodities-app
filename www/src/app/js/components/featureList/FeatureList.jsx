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
      selectedFeatures: React.PropTypes.array.isRequired,
      // TODO: optional classes/styles
      rspoChecks: React.PropTypes.bool
      // TODO: handle generic column registration w/ parent callback for events (rspo checkbox)
    },

    render: function () {
      var allFeaturesSelected = false,
          featureIds,
          selectedFeatureIds,
          allFeaturesSelected,
          rspoChecksHeader = this.props.rspoChecks ? <th><label><input type='checkbox' />RSPO</label></th> : '';

      if (this.props.selectedFeatures) {
        featureIds = this.props.features.map(this._featuresIdMapper);
        selectedFeatureIds = this.props.selectedFeatures.map(function (selectedFeature) {return selectedFeature.attributes.WRI_ID});
        allFeaturesSelected = featureIds.length > 0 && _.difference(featureIds, selectedFeatureIds).length === 0;
      }

      return (
        <div>
          <button className='float-right margin__right' onClick={this._removeFeatureSelection}>Clear</button>
          <div className='padding__wide'>Select your areas of interest using the left checkboxes.</div>
          <table className='no-border-spacing fill__wide border-box border-orange'>
            <thead>
              <tr className='text-white text-center back-orange'>
                <th><input type='checkbox' onChange={this._toggleAllFeaturesSelection} checked={allFeaturesSelected} /></th>
                <th> Type </th>
                <th> Area Name </th>
                {rspoChecksHeader}
              </tr>
            </thead>
            <tbody>
              {this._noFeatures()}
              {this.props.features.map(this._featuresMapper, this)}
            </tbody>
          </table>
        </div>
      );
    },

    _featuresMapper: function (feature, index) {
      var isSelected = _.find(this.props.selectedFeatures, function (selectedFeature) { return feature.attributes.WRI_ID === selectedFeature.attributes.WRI_ID}) || false,
          className = index % 2 === 0 ? 'back-light-gray' : '',
          className = isSelected ? 'text-white back-medium-gray' : className,
          rspoChecks = this.props.rspoChecks ? <td className='text-center' onClick={this._toggleAllFeaturesRSPO}><input type='checkbox' /></td> : '',
          typeIcon = feature.geometry.type === 'polygon' ? '/' : '.' ;

      return (
        <tr className={className}>
          <td className='text-center'>
            <input type='checkbox' onClick={this._toggleFeatureSelection} checked={isSelected} data-feature-index={index} data-feature-id={feature.attributes.WRI_ID} />
          </td>
          <td className='text-center'>
            {typeIcon}
          </td>
          <td>
            <input className='custom-feature-label text-inherit-color' type='text' onChange={this._renameFeature} value={feature.attributes[FeatureListConfig.stepTwo.labelField]} data-feature-index={index} data-feature-id={feature.attributes.WRI_ID} />
          </td>
          {rspoChecks}
        </tr>
      )
    },

    _noFeatures: function () {
      var colSpan = this.props.rspoChecks ? '4' : '3';

      if (this.props.features.length > 0) {
        return <tr className='text-center'></tr>;
      }

      return (
        <tr>
          <td className='text-center text-medium-gray padding' colSpan={colSpan}><i>No current areas of interest, please upload or draw some.</i></td>
        </tr>
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
          featureIds = features.map(this._featuresIdMapper),
          selectedFeatureIds,
          featuresToSelect,
          updatedSelectedFeatureIds;

      if (evt.target.checked) {
        selectedFeatureIds = this.props.selectedFeatures.map(this._featuresIdMapper),
        featuresToSelect = _.difference(featureIds, selectedFeatureIds).map(function (id) { return _.find(features, function (feature) {return feature.attributes.WRI_ID === id}) }),
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).concat(featuresToSelect);
      } else {
        updatedSelectedFeatureIds = WizardStore.get(KEYS.selectedCustomFeatures).filter(function (feature) { return featureIds.indexOf(feature.attributes.WRI_ID) < 0 });
      }

      WizardStore.set(KEYS.selectedCustomFeatures, updatedSelectedFeatureIds);
    },

    _toggleAllFeaturesRSPO: function () {
      console.debug('// TODO: _toggleAllFeaturesRSPO')
    },

    _removeFeatureSelection: function () {
      var featureIdsToRemove = this.props.selectedFeatures.map(this._featuresIdMapper),
          idsToRemoveFilter = function (feature) {return featureIdsToRemove.indexOf(feature.attributes.WRI_ID) < 0;},
          features = _.filter(WizardStore.get(KEYS.customFeatures), idsToRemoveFilter),
          selectedFeatures = _.filter(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          removedFeatures = _.reject(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter);

      WizardStore.set(KEYS.customFeatures, features);
      WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
      WizardStore.set(KEYS.removedFeatures, selectedFeatures);
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

    _featuresIdMapper: function(feature) {
      return feature.attributes.WRI_ID;
    }

  })
})
  
