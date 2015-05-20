/** @jsx React.DOM */

define([
  // libs
  'react',
  'lodash',
  // src
  'components/featureList/config',
  'analysis/WizardStore',
  'utils/GeoHelper',
  'map/config'
], function (React, _, FeatureListConfig, WizardStore, GeoHelper, MapConfig) {

  var FeatureList,
      getDefaultState,
      TEXT = FeatureListConfig.TEXT,
      KEYS = FeatureListConfig.STORE_KEYS,
      self = this;

  return React.createClass({

    propTypes: {
      features: React.PropTypes.array.isRequired,
      selectedFeatures: React.PropTypes.array.isRequired,
      rspoChecks: React.PropTypes.bool,
      showClear: React.PropTypes.bool
    },

    render: function () {
      var allFeaturesSelected = false,
          featureIds,
          selectedFeatureIds,
          allFeaturesRSPO,
          clearButton,
          rspoChecksHeader = '';

      if (this.props.selectedFeatures) {
        featureIds = this.props.features.map(this._featuresIdMapper);
        selectedFeatureIds = this.props.selectedFeatures.map(function (selectedFeature) {return selectedFeature.attributes.WRI_ID});
        allFeaturesSelected = featureIds.length > 0 && _.difference(featureIds, selectedFeatureIds).length === 0;
      }

      if (this.props.rspoChecks) {
        allFeaturesRSPO = this.props.features.length > 0 ? _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}) : false;
        rspoChecksHeader = <th><label><input type='checkbox' onChange={this._toggleAllFeaturesRSPO} checked={allFeaturesRSPO} disabled={this.props.features.length === 0}/>{TEXT.headers[2]}</label></th>;
      }

      if (this.props.selectedFeatures.length === 0 || (this.props.showClear !== undefined && this.props.showClear === false)) {
        clearButton = '';
      } else {
        clearButton = <button className='button-link float-right margin__right no-padding__right' onClick={this._removeFeatureSelection}>{TEXT.clear}</button>;
      }

      return (
        <div className='feature-list'>
          {clearButton}
          <div className='padding__wide margin__bottom instructions'>{TEXT.instruction}</div>
          <table className='feature-list__table no-border-spacing fill__wide border-box border-orange'>
            <thead>
              <tr className='text-white text-center back-orange'>
                <th><input type='checkbox' onChange={this._toggleAllFeaturesSelection} checked={allFeaturesSelected} disabled={this.props.features.length === 0} /></th>
                <th>{TEXT.headers[0]}</th>
                <th>{TEXT.headers[1]}</th>
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
          rspoChecks = this.props.rspoChecks ? <td className='text-center'><input type='checkbox' onChange={this._toggleFeatureRSPO} checked={feature.attributes.isRSPO} data-feature-id={feature.attributes.WRI_ID}/></td> : '',
          typeIcon = 'app/css/images/icon_' + (feature.geometry.type === 'polygon' ? 'triangle_' : 'circle_') + (isSelected ? 'white' : 'gray') + '.png';

      return (
        <tr key={index} className={className}>
          <td className='text-center'>
            <input type='checkbox' onChange={this._toggleFeatureSelection} checked={isSelected} data-feature-index={index} data-feature-id={feature.attributes.WRI_ID} />
          </td>
          <td className='text-center'>
            <img className='vertical-middle' width='15px' height='15px' src={typeIcon} />
          </td>
          <td>
            <input className='custom-feature-label text-inherit-color vertical-middle feedback-outline-orange' type='text' onChange={this._renameFeature} value={feature.attributes[FeatureListConfig.stepTwo.labelField]} data-feature-index={index} data-feature-id={feature.attributes.WRI_ID} />
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
          <td className='text-center text-medium-gray' colSpan={colSpan}><i>{TEXT.noAreas}</i></td>
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

      this.addHighlightFeatures(filteredSelectedFeatures);
      WizardStore.set(KEYS.selectedCustomFeatures, filteredSelectedFeatures);

    },

    _toggleAllFeaturesSelection: function (evt) {
      var features = this.props.features,
          featureIds = features.map(this._featuresIdMapper),
          selectedFeatureIds,
          featuresToSelect,
          updatedSelectedFeatures;

      if (evt.target.checked) {
        selectedFeatureIds = this.props.selectedFeatures.map(this._featuresIdMapper),
        featuresToSelect = _.difference(featureIds, selectedFeatureIds).map(function (id) { return _.find(features, function (feature) {return feature.attributes.WRI_ID === id}) }),
        updatedSelectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures).concat(featuresToSelect);
      } else {
        updatedSelectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures).filter(function (feature) { return featureIds.indexOf(feature.attributes.WRI_ID) < 0 });
      }

      this.addHighlightFeatures(updatedSelectedFeatures);
      WizardStore.set(KEYS.selectedCustomFeatures, updatedSelectedFeatures);
    },

    addHighlightFeatures: function (features) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);

      if (wizardGraphicsLayer) {
        // Clear Previous Selection Features
        wizardGraphicsLayer.clear();
        features.forEach(function (feature) {
          feature = GeoHelper.applySelectionSymbolToFeature(feature);
          wizardGraphicsLayer.add(feature);
        });
      }

    },

    _toggleAllFeaturesRSPO: function () {
      if (this.props.features.length === 0) {
        return;
      } 

      var feature,
          features = WizardStore.get(KEYS.customFeatures),
          featureIdsToUpdate = this.props.features.map(this._featuresIdMapper),
          allFeaturesRSPO = _.every(this.props.features, function (feature) {return feature.attributes.isRSPO === true}),
          shouldFeaturesRSPO = !allFeaturesRSPO;

      featureIdsToUpdate.forEach(function (id) {
        feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});
        if (feature) {
          feature.attributes.isRSPO = shouldFeaturesRSPO;
        }
      });
      WizardStore.set(KEYS.customFeatures, features);
    },

    _toggleFeatureRSPO: function (evt) {
      var id = parseInt(evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id")),
          features = WizardStore.get(KEYS.customFeatures),
          feature = _.find(features, function (feature) {return feature.attributes.WRI_ID === id});

      if (feature) {
        feature.attributes.isRSPO = !feature.attributes.isRSPO;
        WizardStore.set(KEYS.customFeatures, features);
      } else {
        throw new Error('Could not find feature to update rspo based on id');
      }
    },

    _removeFeatureSelection: function () {
      var featureIdsToRemove = this.props.selectedFeatures.map(this._featuresIdMapper),
          idsToRemoveFilter = function (feature) {return featureIdsToRemove.indexOf(feature.attributes.WRI_ID) < 0;},
          features = _.filter(WizardStore.get(KEYS.customFeatures), idsToRemoveFilter),
          selectedFeatures = _.filter(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          removedFeatures = _.reject(WizardStore.get(KEYS.selectedCustomFeatures), idsToRemoveFilter),
          wizardGraphicsLayer;

      WizardStore.set(KEYS.removedCustomFeatures, removedFeatures);
      WizardStore.set(KEYS.customFeatures, features);
      WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);

      // Clear The Wizard Graphics Layer so no selected features are showing
      wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
      if (wizardGraphicsLayer) { wizardGraphicsLayer.clear(); }
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
  
