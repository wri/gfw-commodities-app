define([
  'analysis/config'
], function(AnalyzerConfig){
  return {
    // Referenced configs
    stepTwo: {
      labelField: AnalyzerConfig.stepTwo.labelField
    },
    STORE_KEYS: AnalyzerConfig.STORE_KEYS,
    // Unique configs
    TEXT: {
      instruction: 'Select areas of interest using the left checkboxes.',
      noAreas: 'No current areas of interest, please draw or upload some.',
      clear: 'Clear Selection',
      headers: [
        'Type',
        'Area Name',
        'RSPO'
      ]
    }
  }
});
