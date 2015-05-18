define([
  'analysis/config'
], function (AnalysisConfig) {
  return {
    // Referenced configs
    STORE_KEYS: AnalysisConfig.STORE_KEYS,
    // Unique configs
    MOUNT_ID: 'subscription-modal',
    FORMA_ID: 'alerts-forma',
    FIRES_ID: 'alerts-fires',
    TEXT: {
      title: 'Subscribe to Alerts',
      forma: 'Monthly Clearance Alerts',
      fires: 'Fire Alerts',
      subscriptionPlaceholder: 'Subscription name',
      emailPlaceholder: 'youremail@example.com',
      subscribe: 'Subscribe',
      bufferOptions: [
        ['50','50km'],
        ['40','40km'],
        ['30','30km'],
        ['20','20km'],
        ['10','10km']
      ]
    }
  }
});
