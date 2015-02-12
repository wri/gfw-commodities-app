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
  LegendContentPane = function(id, config, options ) {

    options = options || {};

    var self = this;

    self.options = options;
    self.id = id;
    self.items = [];

    var response,
        content = '',
        legendRequest = new XMLHttpRequest(),
        itemId;

    legendRequest.onreadystatechange = function (res) {
        if (legendRequest.readyState === 4) {
            if (legendRequest.status === 200) {
                response = JSON.parse(legendRequest.response);

                config.layers.forEach(function(layerConfig){
                  response.layers[layerConfig.index].legend.forEach(function(legendItem,i){
                    itemId = self.id + '-item-' + i;
                    self.items.push(itemId);
                    content += '<div id="' + itemId + '">' +
                                '<img style="vertical-align:middle;" src="data:image/png;base64,' + legendItem.imageData + '" height="' + legendItem.height + 'px" width="' + legendItem.width + 'px">' + 
                                '<span style="vertical-align:middle;padding-left:10px;">' + legendItem.label + '</span style="vertical-align:middle;padding-left:10px;">' + 
                                '</div>';
                  });
                });

                document.getElementById(id).innerHTML += content;

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
    document.getElementById(this.id).parentNode.style.display = 'block';
    return this;
  };

  LegendContentPane.prototype.hide = function () {
    document.getElementById(this.id).parentNode.style.display = 'none';
    return this;
  };

  LegendContentPane.prototype.filterItem = function (index) {
    this.items.forEach(function(elementId, elementIndex) {
      if (elementIndex === index) {
        document.getElementById(elementId).style.display = 'block'    
      } else {
        document.getElementById(elementId).style.display = 'none';
      }
    });
    return this;
  };

  return LegendContentPane;

});
