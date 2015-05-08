define([
  'analysis/config'
], function(AnalyzerConfig){
  return {
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    customArea: {
      instructions: AnalyzerConfig.customArea.instructions,
      freehandLabel: AnalyzerConfig.customArea.freehandLabel,
      polyLabel: AnalyzerConfig.customArea.polyLabel,
      uploadLabel: AnalyzerConfig.customArea.uploadLabel
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS
  }
});
