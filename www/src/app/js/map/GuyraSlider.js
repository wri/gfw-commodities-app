define([
  'dojo/on',
  'map/config',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dojo/Deferred',
  'utils/Analytics',
  'map/LayerController'
], function (on, MapConfig, Query, QueryTask, Deferred, Analytics, LayerController) {

  var playInterval,
      guyraSlider,
      playButton;

  var config = {
    sliderSelector: '#guyra-alert-slider',
    playHtml: '&#9658;',
    pauseHtml: '&#x25A0',
    baseYear: 1999
  };

  var state = {
    isPlaying: false,
    from: 0,
    to: 0
  };

  var getGuyraLabels = function getGuyraLabels () {
    var deferred = new Deferred(),
        query, queryTask;

    query = new Query();
    query.returnGeometry = false;
    query.outFields = ['date'];
    query.returnDistinctValues = true;
    query.where = '1=1';

    queryTask = new QueryTask(MapConfig.granChaco.url + '/' + MapConfig.granChaco.defaultLayers[0]);

    queryTask.execute(query, function(res) {
      var labels = [], date, month, year;

      res.features.sort(function(a, b){
        return new Date(b.attributes.date) - new Date(a.attributes.date);
      });

      res.features.reverse();

      // var max = new Date(res.features[0].attributes.date);
      // var min = new Date(res.features[res.features.length - 1].attributes.date);

      for (var j = 0; j < res.features.length; j++) {
        date = new Date(res.features[j].attributes.date);
        year = date.getFullYear().toString().substr(2, 2);
        month = ('0' + (date.getMonth() + 1)).slice(-2);
        labels.push(month + '-' + year);

      }
      deferred.resolve(labels);

    });

    return deferred;
  };

  var GuyraSlider = {

    init: function () {
      var self = this;
      if (guyraSlider === undefined) {
        getGuyraLabels().then(function (labels) {
          $(config.sliderSelector).ionRangeSlider({
            type: 'double',
            values: labels,
            grid: true,
            prettify_enabled: false,
            hide_min_max: true,
            hide_from_to: true,
            onFinish: self.change,
            onUpdate: self.change
          });
          // Save this instance to a variable ???
          guyraSlider = $(config.sliderSelector).data('ionRangeSlider');
          // Cache query for play button
          playButton = $('#guyraPlayButton');
          // Attach Events related to this item
          on(playButton, 'click', self.playToggle);
          //- set the state for change tracking
          state.to = labels.length - 1;
        });
      }
    },

    change: function (data) {

      var fromData = data.from_value.split('-');
      var toData = data.to_value.split('-');

      var fromDate = new Date(fromData[0] + '/1/20' + fromData[1]);
      var toDate = new Date(toData[0] + '/1/20' + toData[1]);

      LayerController.updateGuyraDates([fromDate, toDate]);
      //- Determine which handle changed and emit the appropriate event
      if (!state.isPlaying) {
        if (data.from !== state.from) {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change start date');
        } else {
          Analytics.sendEvent('Event', 'Forma Timeline', 'Change end date');
        }
      }
      //- Update the state value
      state.from = fromDate;
      state.to = toDate;
    },

    playToggle: function () {
      var fromValue, toValue, endValue;

      function stopPlaying() {
        state.isPlaying = false;
        clearInterval(playInterval);
        playButton.html(config.playHtml);
      }

      if (state.isPlaying) {
        stopPlaying();
      } else {
        // Update some state
        state.isPlaying = true;
        endValue = guyraSlider.result.to;
        // Trigger a change on the layer for the initial value, with both handles starting at the same point
        guyraSlider.update({ from: guyraSlider.result.from, to: guyraSlider.result.from });
        // Start the interval
        playInterval = setInterval(function () {
          // We will be incrementing the from value to move the slider forward
          fromValue = guyraSlider.result.from;
          toValue = guyraSlider.result.to;
          // Quit if from value is equal to or greater than the to value
          if (toValue >= endValue) {
            stopPlaying();
          } else {
            // Update the slider
            guyraSlider.update({
              from: fromValue,
              to: ++toValue
            });
          }

        }, 1000);

        // Update the button html
        playButton.html(config.pauseHtml);
      }
      Analytics.sendEvent('Event', 'Guyra Timeline', 'Play');
    }

  };

  return GuyraSlider;

});
