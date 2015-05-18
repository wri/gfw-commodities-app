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
      subscribe: 'Subscribe',
      subscriptionPlaceholder: 'Subscription name',
      emailPlaceholder: 'youremail@example.com',
      forma: 'Monthly Clearance Alerts',
      fires: 'Fire Alerts',
      bufferOptions: [
        ['50','50km'],
        ['40','40km'],
        ['30','30km'],
        ['20','20km'],
        ['10','10km']
      ]
    },
    messagesLabel: 'Please fill in the following:\n',
    messages: {
      invalidEmail: 'You must provide a valid email in the form.',
      noAreaSelection: 'You must select at least one area from the list.',
      noSelection: 'You must select at least one checkbox from the form.',
      noSelectionName: 'You must provide a name for your subscription area.',
      formaSuccess: 'Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.',
      formaFail: 'There was an error with your request to subscribe to Forma alerts.  Please try again later.',
      fireSuccess: 'Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.',
      fireFail: 'There was an error with your request to subscribe to Fires alerts.  Please try again later.'
    },
    requests: {
      fires: {
        url: 'https://gfw-fires.wri.org/subscribe_by_polygon',
        options: {
          method: 'POST',
          handleAs: 'json',
          headers: {
            'X-Requested-With': null
          },
          data: {
            msg_type: 'email',
            msg_addr: null,
            area_name: null,
            features: null
          }
        },
        successMessage: 'subscription successful'
      },
      forma: {
        url: 'http://gfw-apis.appspot.com/subscribe',
        options: {
          method: 'POST',
          data: {
            topic: 'updates/forma',
            geom: null,
            email: null
          }
        }
      }
    }
  }
});
