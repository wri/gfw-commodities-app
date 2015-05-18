/** @jsx React.DOM */
define([
  // libs
  'react',
  'lodash',
  // src
  'components/alertsDialog/config',
  'analysis/WizardStore',
  // esri/dojo
  'dojo/dom-class'
], function (React, _, Config, WizardStore, domClass) {

  var AlertsDialog,
      getDefaultState,
      KEYS = Config.STORE_KEYS,
      TEXT = Config.TEXT,
      self = this;

  // NOTE: form attributes/text
  var pbVal,
      pbId1,
      pbId2,
      formaId = Config.FORMA_ID,
      firesId = Config.FIRES_ID,
      emailId = _.uniqueId(),
      subscriptionNameId = _.uniqueId();

  getDefaultState = function () {
    return {
      features: []
    };
  }

  AlertsDialog = React.createClass({
    getInitialState: getDefaultState,

    componentDidMount: function () {
      // NOTE: for live developing, remove when finished
      WizardStore.registerCallback(KEYS.alertsDialogActive, function () {
        this.setState(this.getInitialState({temp:'temp'}));
      }.bind(this));

      if (WizardStore.get(KEYS.alertsDialogActive) === true) {
        domClass.add(Config.MOUNT_ID, 'active');
      }
    },

    render: function () {
      var temp = true,
          radiusSelect;

      if (temp) {
        radiusSelect = (
          <div className='margin__bottom'>
            <span className='margin__left'>Buffer size:</span>
            <select className='margin__left'>
              {TEXT.bufferOptions.map(function (option) {
                return <option value={option[0]}>{option[1]}</option>
              })}
            </select>
          </div>
        )
      }

      return (
        <div>
          <div className='close-icon'></div>
          <div className='modal-content'>
            <div className='alerts-form__form no-wide border-box'>
              <div className='modal-header'>{TEXT.title}</div>
              <div className='margin__bottom'>
                <input className='vertical-middle' type='checkbox' onChange={this._checkboxChange} />
                <label className='vertical-middle'>{TEXT.forma}</label>
              </div>
              <div className='margin__bottom'>
                <input className='vertical-middle' type='checkbox' onChange={this._checkboxChange} />
                <label className='vertical-middle'>{TEXT.fires}</label>
              </div>
              <div className='pooh-bear text-center'>
                <div className='pooh-bear'>Please leave this blank</div>
                <input className='pooh-bear' type='text' name='name' />
              </div>
              {radiusSelect}
              <div className='text-center margin__bottom'>
                <input className='border-medium-gray border-radius' type='text' placeholder={TEXT.subscriptionPlaceholder} />
              </div>
              <div className='text-center margin__bottom'>
                <input className='border-medium-gray border-radius' type='text' placeholder={TEXT.emailPlaceholder} />
              </div>
              <div className='pooh-bear text-center'>
                <div className='pooh-bear'>Please do not change this field</div>
                <input className='pooh-bear' type='text' name='address' />
              </div>
              <div className='text-right margin__bottom'>
                <button className='text-white back-orange no-border border-radius font-16px'>{TEXT.subscribe}</button>
              </div>
            </div>
          </div>
        </div>
      )
    },

    _checkboxChange: function () {
      console.debug('TODO: _checkboxChange');
    }
  });

  return function () {
    return React.renderComponent(new AlertsDialog, document.getElementById(Config.MOUNT_ID));
  };
});
