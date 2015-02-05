define([
],
function () {

  /**
   * Pane to display arcgis server legend contents
   * @param {object} config 
   * @param {string} config.url
   * @param {boolean} options.hideEsriLegend
   * @param {string} legendId dom id to append the pane beside
   */
  LegendContentPane = function(legendId, config, options ) {

    options = options || {};
    options.hideEsriLegend = options.hideEsriLegend == undefined ? true : options.hideEsriLegend;

    this.options = options;
    this.legendId = legendId;

    var response,
        content = '',
        legendRequest = new XMLHttpRequest(),
        id = legendId + '-legend-content-pane';
        

    legendRequest.onreadystatechange = function (res) {
        if (legendRequest.readyState === 4) {
            if (legendRequest.status === 200) {
                response = JSON.parse(legendRequest.response);

                content += '<div id="' + id + '" style="padding:10px;">';

                config.layers.forEach(function(layerConfig){
                  response.layers[layerConfig.index].legend.forEach(function(legendItem){
                    content += '<div>' +
                                '<img style="vertical-align:middle;" src="data:image/png;base64,' + legendItem.imageData + '" height="' + legendItem.height + 'px" width="' + legendItem.width + 'px">' + 
                                '<span style="vertical-align:middle;padding-left:10px;">' + legendItem.label + '</span style="vertical-align:middle;padding-left:10px;">' + 
                                '</div>';
                  });
                });

                content += '</div>';

                document.getElementById(legendId).parentNode.innerHTML += content;

            } else {
                console.debug('legend request failed');
            }
        }
    };

    legendRequest.addEventListener('error', function (error) {
      if (error) console.log(error);
    }, false);

    legendRequest.open('GET', config.url, true);
    legendRequest.send();

    return this;
  }

  LegendContentPane.prototype.show = function () {
    if (this.options.hideEsriLegend) {
      document.getElementById(this.legendId).style.display = 'none';
    }
    return this;
  };

  LegendContentPane.prototype.hide = function () {
    if (this.options.hideEsriLegend) {
      document.getElementById(this.legendId).style.display = 'block';
    }
    return this;
  };

  return LegendContentPane;

});
