/** @jsx React.DOM */
define([
    'react',
    'analysis/config',
    'analysis/WizardStore',
    'components/wizard/StepOne',
    'components/wizard/StepTwo',
    'components/wizard/StepThree',
    'components/wizard/Intro',
    // Other Helpful Modules
    'dojo/topic',
    'dojo/_base/array',
    'map/config',
    'dojo/_base/lang',
    'esri/tasks/PrintTask',
    'map/Controls',
    'utils/Analytics',
    'utils/GeoHelper'
], function (React, AnalyzerConfig, WizardStore, StepOne, StepTwo, StepThree, Intro, topic, arrayUtils, MapConfig, lang, PrintTask, MapControls, Analytics, GeoHelper) {

    var breadcrumbs = AnalyzerConfig.wizard.breadcrumbs;
    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getDefaultState() {
        return {
            currentStep: WizardStore.get(KEYS.userStep) || 0,
            analysisArea: WizardStore.get(KEYS.selectedCustomFeatures),
            usersAreaOfInterest: WizardStore.get(KEYS.areaOfInterest)
        };
    }

    // This Component has some dynamic properties that get created to trigger refresh on the children or
    // keep track of items that effect some childrens rendering

    var Wizard = React.createClass({

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function() {
            // Register Callbacks for analysis area updates
            // Anytime the data in the store at these keys is updated, these callbacks trigger
            WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
            WizardStore.registerCallback(KEYS.userStep, this.currentUserStepUpdated);
            WizardStore.registerCallback(KEYS.areaOfInterest, this.areaOfInterestUpdated);
            // if we need to skip the intro, update the current step
            // else, store the current step in the store since this key needs a default value in the store
            if (this.props.skipIntro) {
                WizardStore.set(KEYS.userStep, 3);
            } else {
                WizardStore.set(KEYS.userStep, this.state.currentStep);
            }
        },

        /* Methods for reacting to store updates */
        analysisAreaUpdated: function () {
            var updatedArea = WizardStore.get(KEYS.selectedCustomFeatures);
            this.setState({ analysisArea: updatedArea });
        },

        currentUserStepUpdated: function () {
            var newStep = WizardStore.get(KEYS.userStep);
            this.setState({ currentStep: newStep });
        },

        areaOfInterestUpdated: function () {
            var newAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
            var adminUnitsLayer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (newAreaOfInterest === 'adminUnitOption' && adminUnitsLayer.visible === false) {
              adminUnitsLayer.show();
            } else if (newAreaOfInterest !== 'adminUnitOption') {
              adminUnitsLayer.hide();
            }
            this.setState({ usersAreaOfInterest: newAreaOfInterest });
        },
        /* Methods for reacting to store updates above */

        componentDidUpdate: function(prevProps, prevState) {
            if (this.props.isResetting) {
                // Reset the isResetting property so any future changes dont accidentally trigger a reset
                this.setProps({ isResetting: false });
            }

            // User returned to Step 1 so we need to reset some things.
            if (prevState.currentStep > 1 && this.state.currentStep === 1) {
              // Clear Graphics from Wizard Layer, it just shows the selection they made
              var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
              if (wizLayer) { wizLayer.clear(); }
            }
        },

        /* jshint ignore:start */
        render: function() {
            var props = this.props;
            // Mixin a callback to trigger the analysis when the user has completed the Wizard
            props.callback = {
                performAnalysis: this._performAnalysis
            };

            if (this.state.currentStep === 0) {
                $('.breadcrumbs').hide();
                $('.gfw .wizard-header').css('height', '-=45px');
                $('.gfw .wizard-body').css('top', '55px');
                $('.gfw .wizard-header .button.reset').hide();
            } else {
                $('.breadcrumbs').show();
                $('.gfw .wizard-header').css('height', '+=45px');
                $('.gfw .wizard-body').css('top', '');
                $('.gfw .wizard-header .button.reset').show();
                $('.gfw .wizard-header .button.reset').css('top', '0px');
            }

            // Hide legend content pane if appropriate
            if (['commercialEntityOption', 'certifiedAreaOption'].indexOf(this.state.usersAreaOfInterest) === -1 || this.props.currentStep === 1) {
                topic.publish('hideConcessionsLegend');
            }

            return (
              <div className='relative wizard-root'>
                <div className='wizard-header'>
                  <div className='title-section'>
                    <span className='title'>Analysis</span>
                    <span className='button reset' onClick={this._reset}>Reset</span>
                    <span className='button close' onClick={this._close}></span>
                  </div>
                  <div className='breadcrumbs'>
                    {breadcrumbs.map(this._breadcrumbMapper, this)}
                  </div>
                </div>
                <div className='wizard-body'>
                  <div className={this.state.currentStep !== 0 ? 'hidden' : ''}>
                    <Intro {...props} />
                  </div>
                  <div className={this.state.currentStep !== 1 ? 'hidden' : ''}>
                    <StepOne {...props} />
                  </div>
                  <div className={this.state.currentStep !== 2 ? 'hidden' : ''}>
                    <StepTwo {...props} />
                  </div>
                  <div className={this.state.currentStep !== 3 ? 'hidden' : ''}>
                    <StepThree {...props} />
                  </div>
                </div>
              </div>
            );
        },

        _breadcrumbMapper: function(item, index) {
            var className = index < (this.state.currentStep - 1) ? 'enabled' : '';
            className += (this.state.currentStep - 1) === index ? ' active' : '';

            return (
                <span className={className}>
                    <span className='piece' data-index={index} onClick={this._changeStep}>{item}</span>
                    {(index < breadcrumbs.length - 1) ? <span className='carat'> &gt; </span> : null}
                </span>
            );
        },
        /* jshint ignore:end */

        // UI Functions that affect internal properties only
        _changeStep: function(synEvent) {
            var targetIndex = synEvent.target.dataset ? synEvent.target.dataset.index : synEvent.target.getAttribute('data-index');

            targetIndex *= 1;

            if (targetIndex < (this.state.currentStep + 1)) {
                // Convert to Int, add 1 because adding intro added a new step
                WizardStore.set(KEYS.userStep, (1 * targetIndex) + 1);
            }
        },

        _reset: function() {
            // Call setProps to trigger reset on children
            this.replaceProps({
                isResetting: true
            });

            // Reset this components state
            WizardStore.set(KEYS.areaOfInterest, AnalyzerConfig.stepOne.option3.id, true);
            WizardStore.set(KEYS.selectedCustomFeatures, [], true);
            WizardStore.set(KEYS.userStep, 0, true);
            this.replaceState(getDefaultState());
            // Clear the WizardGraphicsLayer
            var layer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (layer) {
              layer.clear();
            }
            var layer = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
            if (layer) {
              layer.clear();
            }
            // Hide the Dynamic Layer Associated with the Wizard
            layer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (layer) {
              layer.hide();
            }
        },

        _close: function() {
            topic.publish('toggleWizard');
        },

        // Function that can be used in the Analyzer.js file to programmatically set which step it is on
        _externalSetStep: function(step) {
            if (step >= 0 || step <= 3) {
                WizardStore.set(KEYS.userStep, step);
            }
        },

        _performAnalysis: function() {
            var self = this,
                geometry = self._prepareGeometry(self.state.analysisArea),
                datasets = WizardStore.get(KEYS.analysisSets),
                labelField,
                suitableRule,
                readyEvent,
                payload,
                win;

            labelField = AnalyzerConfig.stepTwo.labelField;
            suitableRule = app.map.getLayer(MapConfig.suit.id).getRenderingRule();

            payload = {
                geometry: geometry,
                datasets: datasets,
                //types: self.state.analysisTypes,
                title: self.state.analysisArea.map(function (feature) {return feature.attributes.WRI_label;}).join(','),
                suitability: {
                    renderRule: suitableRule,
                    csv: MapControls._getSettingsCSV()
                }
            };

            win = window.open('report.html', '_blank', 'menubar=yes,titlebar=yes,scrollbars=yes,resizable=yes');

            if (localStorage) {
               localStorage.setItem('payload', JSON.stringify(payload));
            } else {
                win.payload = payload;
            }

            if (win === null || typeof(win) === undefined || win === undefined) {
                alert('You need to disable your popup blocker for this feature to work.');
            } else {
                win.focus();
                // Some browsers load really fast and are ready before the payload has been set
                // create a custom event that the new page can listen to
                if (win.document.createEvent) {
                    readyEvent = win.document.createEvent('Event');
                    readyEvent.initEvent('PayloadReady', true, true);
                    win.document.dispatchEvent(readyEvent);
                }
            }

            // Emit Event for Analytics
            Analytics.sendEvent('Event', 'Perform Analysis', 'User clicked perfrom analysis.');

            //- Create a list of types selected
            var checkboxes = AnalyzerConfig.stepThree.checkboxes;
            var types = checkboxes.filter(function (checkbox) {
              return datasets[checkbox.value];
            }).map(function (checkbox) { return checkbox.label; });
            //- Send Event for all types selected
            types.forEach(function (type) {
              Analytics.sendEvent('Analysis', 'Type of Analysis', type);
            });
        },

        _prepareGeometry: function(features) {
          // Get the point radius incase we need it, we may not
          // if it's not set for some reason, default to 50km
          var pointRadius = WizardStore.get(KEYS.analysisPointRadius) || 50;
          var geometries = [];

          // If its not an array, force it into an array so I dont need two separate
          // blocks of code to prepare the geometry, this can and should be removed once
          // we verify that features is always of type array
          if (Object.prototype.toString.call(features) !== '[object Array]') {
            features = [features];
          }

          // Helper function
          function getMillId (feature) {
            var areaOfInterest = WizardStore.get(KEYS.areaOfInterest),
                // id = feature.attributes.Entity_ID || feature.attributes.WRI_ID || undefined;
                id = feature.attributes.wri_id || feature.attributes.WRI_ID || undefined;

            return areaOfInterest === 'millPointOption' ? id : undefined;
          }

          features.forEach(function (feature) {
            var pointToPush;
            // If the feature is a point, cast as a circle with radius
            if (feature.geometry.type === 'point') {
              feature = GeoHelper.preparePointAsPolygon(feature, pointRadius);
            }

            if (getMillId(feature)) {
                pointToPush = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
                console.log(pointToPush);
            }

            geometries.push({
              geometry: feature.geometry,
              type: (feature.geometry.radius ? 'circle' : 'polygon'),
              isCustom: feature.attributes.WRI_ID !== undefined,
              label: feature.attributes.WRI_label || undefined,
              point: pointToPush,
              // Mill Point Specific Fields, Include them as undefined if the values are not present
              millId: getMillId(feature),
              isRSPO: feature.attributes.isRSPO || undefined,
              buffer: pointRadius
            });

          });

          return JSON.stringify(geometries);

        },

        // External Function to Help determine what state the wizard is in, could be useful
        // for handling various layers and other functions when toggling the wizard or jumping around
        // Leverage some of the published functions for layers, see delegator
        _getStepAndActiveArea: function() {
            return {
                currentStep: this.state.currentStep,
                selectedArea: this.state.usersAreaOfInterest || 'none'
            };
        }

    });

    return function(props, el) {
        /* jshint ignore:start */
        return React.render(<Wizard {...props} />, document.getElementById(el));
        /* jshint ignore:end */
    };

});
