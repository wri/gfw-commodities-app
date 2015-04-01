define([
    "react",
    "analysis/config",
    "components/wizard/StepOne",
    "components/wizard/StepTwo",
    "components/wizard/StepThree",
    "components/wizard/StepFour",
    "components/wizard/StepFive",
    // Other Helpful Modules
    "dojo/topic",
    "dojo/_base/array",
    "map/config",
    "dojo/_base/lang",
    "esri/tasks/PrintTask",
    "map/Controls"
], function(React, AnalyzerConfig, StepOne, StepTwo, StepThree, StepFour, StepFive, topic, arrayUtils, MapConfig, lang, PrintTask, MapControls) {

    var breadcrumbs = AnalyzerConfig.wizard.breadcrumbs;

    function getDefaultState() {
        return {
            currentStep: 0,
            analysisArea: undefined,
            analysisSets: undefined,
            analysisTypes: undefined
        };
    }

    // This Component has some dynamic properties that get created to trigger refresh on the children or
    // keep track of items that effect some childrens rendering

    var Wizard = React.createClass({

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function() {
            if (this.props.skipIntro) {
                this.setState({
                    currentStep: 3
                });
            }
        },

        componentDidUpdate: function(prevProps, prevState) {
            if (this.props.isResetting) {
                // Reset the isResetting property so any future changes dont accidentally trigger a reset
                this.setProps({
                    isResetting: false
                });
            }

            // User returned to Step 1 so we need to reset some things.
            if (prevState.currentStep > 1 && this.state.currentStep === 1) {
              // Reset the analysis area
              this.setState({
                analysisArea: undefined
              });
              // Clear Graphics from Wizard Layer, it just shows the selection they made
              var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
              if (wizLayer) {
                wizLayer.clear();
              }
            }
        },

        render: function() {
            var props = this.props;

            // Mixin any state/props that need to be mixed in here
            props.analysisArea = this.state.analysisArea;
            props.currentStep = this.state.currentStep;
            if (props.currentStep === 0) {
                $(".breadcrumbs").hide();
                $(".gfw .wizard-header").css("height", "-=45px");
                $(".gfw .wizard-body").css("top", "55px");
                $(".gfw .wizard-header .button.reset").hide();
            } else {
                $(".breadcrumbs").show();
                $(".gfw .wizard-header").css("height", "+=45px");
                $(".gfw .wizard-body").css("top", "95px");
                $(".gfw .wizard-header .button.reset").show();
                $(".gfw .wizard-header .button.reset").css("top", "0px");
            }
            props.callback = {
                nextStep: this._nextStep,
                update: this._updateSelectedArea,
                updateAnalysisArea: this._updateAnalysisArea,
                updateAnalysisType: this._updateAnalysisType,
                updateAnalysisDatasets: this._updateAnalysisDatasets,
                performAnalysis: this._performAnalysis
            };

            // Hide legend content pane if appropriates
            if (['commercialEntityOption','certifiedAreaOption'].indexOf(this.props.selectedArea) === -1 || this.props.currentStep === 1) {
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
                        // React.DOM.div({'className': this.state.currentStep !== 3 ? 'hidden' : ''},
                        //   new StepFour(props)
                        // )
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
                this.setState({
                    currentStep: (1 * targetIndex) + 1 // Convert to Int, add 1 because adding intro added a new step
                });
            }
        },

        _nextStep: function() {
            this.setState({
                currentStep: this.state.currentStep + 1
            });
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

        _updateSelectedArea: function(value) {
            this.setProps({
                selectedArea: value
            });
        },

        _updateAnalysisArea: function(feature, optionalLabel) {
            // If optional label exists, pass it down as props, it will exist when feature is not
            // a graphic but instead an array of graphics
            if (optionalLabel) {
                this.setProps({
                    optionalLabel: optionalLabel
                });
            }

            this.setState({
                analysisArea: feature
            });
        },

        _updateAnalysisType: function(typesOfAnalysis) {
            this.setState({
                analysisTypes: typesOfAnalysis
            });
        },

        _updateAnalysisDatasets: function(datasets) {
            this.setState({
                analysisSets: datasets
            });
        },

        // Function that can be used in the Analyzer.js file to programmatically set which step it is on
        _externalSetStep: function(step) {
            if (step >= 0 || step <= 3) {
                this.setState({
                    currentStep: step
                });
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
                labelField,
                suitableRule,
                readyEvent,
                datasets,
                win = window.open('./app/js/report/Report.html', '_blank', 'menubar=yes,titlebar=yes');

            //setTimeout(function () {
            if (win === null || typeof(win) === undefined || win === undefined) {
                alert("Popup blocker needs to be off");
            } else {
                win.focus();
                labelField = AnalyzerConfig.stepTwo.labelField;
                suitableRule = app.map.getLayer(MapConfig.suit.id).getRenderingRule();
                datasets = self.state.analysisSets;
                printTask = new PrintTask();
                var printJson = printTask._getPrintDefinition(app.map);
                printJson.exportOptions = {"outputSize": [850, 850],"dpi": 96};
                win.payload = {
                    geometry: geometry,
                    datasets: self.state.analysisSets,
                    //types: self.state.analysisTypes,
                    title: (self.state.analysisArea.attributes ? self.state.analysisArea.attributes[labelField] : self.props.optionalLabel),
                    suitability: {
                        renderRule: suitableRule,
                        settings: MapControls.serializeSuitabilitySettings()
                    },
                    webMapJson: JSON.stringify(printJson)
                };
                // Some browsers load really fast and are ready before the payload has been set
                // create a custom event that the new page can listen to
                readyEvent = win.document.createEvent('Event');
                readyEvent.initEvent('PayloadReady', true, true);
                win.document.dispatchEvent(readyEvent);
            }
            //}, 0);

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
            } else {
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

          // Original Version

          // var outGeo;
          // if (Object.prototype.toString.call(features) === '[object Array]') {
          //   if (features.length === 1) {
          //       if (!features[0].geometry.radius) {
          //         outGeo = features[0].geometry;
          //       } else {
          //         outGeo = [{
          //           label: features[0].attributes.WRI_label,
          //           id: features[0].attributes.Entity_ID,
          //           geometry: features[0].geometry
          //         }];
          //       }
          //   } else {
          //     if (!features[0].geometry.radius) {
          //       console.log("here");
          //       outGeo = lang.clone(features[0].geometry);
          //       arrayUtils.forEach(features, function(feature, index) {
          //         // Skip the first one, geometry alerady grabbed above
          //         if (index > 0) {
          //           arrayUtils.forEach(feature.geometry.rings, function(ring, index) {
          //             outGeo.addRing(ring);
          //           });
          //         }
          //       });
          //     } else {
          //       // I have an array of circles and need labels, geometry, and ids
          //       outGeo = [];
          //       arrayUtils.forEach(features, function (feature) {
          //         outGeo.push({
          //           label: feature.attributes.WRI_label,
          //           id: feature.attributes.Entity_ID,
          //           geometry: feature.geometry
          //         });
          //       });
          //     }
          //   }
          // } else {
          //   outGeo = features.geometry;
          // }
          // return JSON.stringify(outGeo);
        },

        // External Function to Help determine what state the wizard is in, could be useful 
        // for handling various layers and other functions when toggling the wizard or jumping around
        // Leverage some of the published functions for layers, see delegator
        _getStepAndActiveArea: function() {
            return {
                currentStep: this.state.currentStep,
                selectedArea: this.props.selectedArea || 'none'
            };
        }

    });

    return function(props, el) {
        return React.renderComponent(new Wizard(props), document.getElementById(el));
    };

});