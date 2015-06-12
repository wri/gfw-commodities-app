define([
  'analysis/config'
], function(AnalyzerConfig){
  return {
    // Referenced configs
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    customArea: {
      instructions: AnalyzerConfig.customArea.instructions,
      freehandLabel: AnalyzerConfig.customArea.freehandLabel,
      polyLabel: AnalyzerConfig.customArea.polyLabel,
      uploadLabel: AnalyzerConfig.customArea.uploadLabel
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS,
    // Unique configs
    MODAL_ID: 'subscription-modal',
    TEXT: {
      title: 'Alerts Subscription',
      selection: 'Current selection:',
      noSelection: 'none',
      modalTitle: 'Subscribe to Alerts',
      subscribe: 'Subscribe'
    }
  }
});
