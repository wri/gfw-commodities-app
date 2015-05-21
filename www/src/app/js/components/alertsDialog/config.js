define([
  'analysis/config'
], function (AnalysisConfig) {
  return {
    // Referenced configs
    STORE_KEYS: AnalysisConfig.STORE_KEYS,
    // Unique configs
    MAX_INPUT_CHARS: 70,
    IDS: {
      mount: 'subscription-modal',
      forma: 'alerts-forma',
      fires: 'alerts-fires',
      buffer: 'alerts-buffer',
      email: 'alerts-email',
      subscription: 'alerts-subscription',
    },
    TEXT: {
      title: 'Subscribe to Alerts',
      forma: 'Monthly Clearance Alerts',
      fires: 'Fire Alerts',
      selectionLabel: 'Selection:',
      noSelection: 'none',
      subscriptionPlaceholder: 'Subscription name',
      subscriptionDefaultLabel: 'Use selection',
      emailPlaceholder: 'your_email@example.com',
      subscribe: 'Subscribe',
      bufferLabel: 'Point data selected - buffer area(s) required.',
      bufferOptionsLabel: 'Buffer radius:',
      bufferOptions: [
        ['50','50km'],
        ['40','40km'],
        ['30','30km'],
        ['20','20km'],
        ['10','10km']
      ],
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
      requiredLabels: {
        alerts: '* Please select an alert service.',
        subscription: '* Please enter a subscription area name.',
        email: '* Please enter a valid email.'
      }
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
