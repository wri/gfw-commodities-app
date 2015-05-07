define([
    "react",
    "analysis/config",
    "analysis/WizardStore",
    "components/wizard/StepOne",
    "components/wizard/StepTwo",
    "components/wizard/StepThree",
    "components/wizard/StepFive",
    // Other Helpful Modules
    "dojo/topic",
    "dojo/_base/array",
    "map/config",
    "dojo/_base/lang",
    "esri/tasks/PrintTask",
    "map/Controls"
], function(React, AnalyzerConfig, WizardStore, StepOne, StepTwo, StepThree, StepFive, topic, arrayUtils, MapConfig, lang, PrintTask, MapControls) {

    var breadcrumbs = AnalyzerConfig.wizard.breadcrumbs;
    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getDefaultState() {
        return {
            currentStep: WizardStore.get(KEYS.userStep) || 0,
            analysisArea: WizardStore.get(KEYS.selectedCustomFeatures),
            usersAreaOfInterest: WizardStore.get(KEYS.areaOfInterest),
            analysisSets: WizardStore.get(KEYS.analysisSets)
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
            WizardStore.registerCallback(KEYS.analysisSets, this.analysisSetsUpdated);

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
            this.setState({ usersAreaOfInterest: newAreaOfInterest });
        },

        analysisSetsUpdated: function () {
            var newAnalysisSets = WizardStore.get(KEYS.analysisSets);
            this.setState({ analysisSets: newAnalysisSets });
        },
        /* Methods for reacting to store updates above */

        componentDidUpdate: function(prevProps, prevState) {
            if (this.props.isResetting) {
                // Reset the isResetting property so any future changes dont accidentally trigger a reset
                this.setProps({ isResetting: false });
            }

            // User returned to Step 1 so we need to reset some things.
            if (prevState.currentStep > 1 && this.state.currentStep === 1) {
              // Reset the analysis area
              WizardStore.set(KEYS.selectedCustomFeatures, undefined);
              // Clear Graphics from Wizard Layer, it just shows the selection they made
              var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
              if (wizLayer) { wizLayer.clear(); }
            }
        },

        render: function() {
            var props = this.props;
            // Mixin a callback to trigger the analysis when the user has completed the Wizard
            props.callback = {
                performAnalysis: this._performAnalysis
            };

            if (this.state.currentStep === 0) {
                $(".breadcrumbs").hide();
                $(".gfw .wizard-header").css("height", "-=45px");
                $(".gfw .wizard-body").css("top", "55px");
                $(".gfw .wizard-header .button.reset").hide();
            } else {
                $(".breadcrumbs").show();
                $(".gfw .wizard-header").css("height", "+=45px");
                $(".gfw .wizard-body").css("top", "");
                $(".gfw .wizard-header .button.reset").show();
                $(".gfw .wizard-header .button.reset").css("top", "0px");
            }

            // Hide legend content pane if appropriate
            if (['commercialEntityOption','certifiedAreaOption'].indexOf(this.state.usersAreaOfInterest) === -1 || this.props.currentStep === 1) {
                topic.publish('hideConcessionsLegend');
            }
            
            return (
                React.DOM.div({
                        'className': 'relative wizard-root'
                    },
                    React.DOM.div({
                            'className': 'wizard-header'
                        },
                        React.DOM.div({
                                'className': 'title-section'
                            },
                            React.DOM.span({
                                'className': 'title'
                            }, "Analysis"),
                            React.DOM.span({
                                'className': 'button reset',
                                onClick: this._reset
                            }, "Reset"),
                            React.DOM.span({
                                'className': 'button close',
                                onClick: this._close
                            }, "")
                        ),
                        React.DOM.div({
                                'className': 'breadcrumbs'
                            },
                            breadcrumbs.map(this._breadcrumbMapper, this)
                        )
                    ),
                    React.DOM.div({
                            'className': 'wizard-body'
                        },
                        React.DOM.div({
                                'className': this.state.currentStep !== 0 ? 'hidden' : ''
                            },
                            new StepFive(props)
                        ),
                        React.DOM.div({
                                'className': this.state.currentStep !== 1 ? 'hidden' : ''
                            },
                            new StepOne(props)
                        ),
                        React.DOM.div({
                                'className': this.state.currentStep !== 2 ? 'hidden' : ''
                            },
                            new StepTwo(props)
                        ),
                        React.DOM.div({
                                'className': this.state.currentStep !== 3 ? 'hidden' : ''
                            },
                            new StepThree(props)
                        )
                    )
                )
            );
        },

        _breadcrumbMapper: function(item, index) {
            var className = index < (this.state.currentStep - 1) ? 'enabled' : '';
            className += (this.state.currentStep - 1) === index ? ' active' : '';

            return React.DOM.span({
                    'className': className
                },
                React.DOM.span({
                    'className': 'piece',
                    'data-index': index,
                    onClick: this._changeStep
                }, item), (index < breadcrumbs.length - 1) ? React.DOM.span({
                    'className': 'carat'
                }, ' > ') : null
            );
        },


        // UI Functions that affect internal properties only
        _changeStep: function(synEvent) {
            var targetIndex = synEvent.target.dataset ? synEvent.target.dataset.index : synEvent.target.getAttribute("data-index");

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
            this.replaceState(getDefaultState());
            // Clear the WizardGraphicsLayer
            var layer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
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
            topic.publish("toggleWizard");
        },

        // Function that can be used in the Analyzer.js file to programmatically set which step it is on
        _externalSetStep: function(step) {
            if (step >= 0 || step <= 3) {
                WizardStore.set(KEYS.userStep, step);
            }
        },

        _performAnalysis: function() {
            // Grab All Necessary Props from State and Pass them on
            // React updates state in the next available animation frame, wait until this component has 
            // performed any necessary state changes before beginning analysis
            // Call window.open here to make sure page opens correctly and can have multiple instances open
            // Calling window.open in the animationFrame triggers pop-up blocker and/or opens in new window
            // Something to do with calling window.open in a click handler allows it to work but animation frame
            // is asynchronous and not counted as part of the click handler
            var self = this,
                geometry = self._prepareGeometry(self.state.analysisArea),
                optionalLabel = WizardStore.get(KEYS.selectedCustomFeatureAlias),
                labelField,
                suitableRule,
                readyEvent,
                datasets,
                payload,
                win;

            labelField = AnalyzerConfig.stepTwo.labelField;
            suitableRule = app.map.getLayer(MapConfig.suit.id).getRenderingRule();
            datasets = self.state.analysisSets;

            payload = {
                geometry: geometry,
                datasets: self.state.analysisSets,
                //types: self.state.analysisTypes,
                title: (self.state.analysisArea.attributes ? self.state.analysisArea.attributes[labelField] : optionalLabel),
                suitability: {
                    renderRule: suitableRule,
                    csv: MapControls._getSettingsCSV()
                    //settings: MapControls.serializeSuitabilitySettings()
                }
            };

            win = window.open('./app/js/report/Report.html', '_blank', 'menubar=yes,titlebar=yes,scrollbars=yes,resizable=yes');

            if (localStorage) {
                localStorage.setItem('payload', JSON.stringify(payload));
            } else {
                win.payload = payload;
            }

            if (win === null || typeof(win) === undefined || win === undefined) {
                alert("You need to disable your popup blocker for this feature to work.");
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

        },

        _prepareGeometry: function(features) {
          var isCircle,
              outGeo; 

          if (Object.prototype.toString.call(features) === '[object Array]') {
            isCircle = (features[0].geometry.radius !== undefined);
            outGeo = [];
            if (isCircle) {
              features.forEach(function (feature) {
                outGeo.push({
                  label: feature.attributes.WRI_label,
                  id: feature.attributes.Entity_ID,
                  geometry: feature.geometry,
                  type: 'circle'
                });
              });
            } else if (features.length > 1) {
              // May be deprecated, left in here as will need to test to be able to tell 
              // if this is being used by exhaustively testing all paths to this
              // function and seeing if it's executed
              features.forEach(function (feature) {
                outGeo.push({
                  label: feature.attributes.WRI_label,
                  geometry: feature.geometry,
                  type: 'polygon'
                });
              });
            } else {
                outGeo = features[0].geometry;
            }
          } else {
            isCircle = (features.geometry.radius !== undefined);
            if (isCircle) {
                outGeo = [{
                  label: features.attributes.WRI_label,
                  id: features.attributes.Entity_ID,
                  geometry: features.geometry,
                  type: 'circle'
                }];
            } else {
                outGeo = features.geometry;
            }
          }

          return JSON.stringify(outGeo);

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
        return React.renderComponent(new Wizard(props), document.getElementById(el));
    };

});