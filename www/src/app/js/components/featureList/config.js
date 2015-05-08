define([
  'analysis/config'
], function(AnalyzerConfig){
  return {
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS
  }
});
