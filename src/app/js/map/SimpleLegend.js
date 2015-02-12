define([
  "dojo/Deferred"
],
function (Deferred) {

  /**
   * Pane to display arcgis server legend contents
   * @param {object} config 
   * @param {string} config.url
   * @param {boolean} options.hideEsriLegend
   * @param {string} legendId dom id to append the pane beside
   */
  SimpleLegend = function(config) {
    this.config = config;
    this.CLASS_NAME = 'simple-legend';
    this.onHide = function(){};
    this.onShow = function(){};
    
    return this;
  };

  SimpleLegend.prototype.init = function () {
    this.items = [];

    var deferred = new Deferred(),
        legendRequest = new XMLHttpRequest(),
        content = '',
        configLayerIds,
        response,
        responseLayers,
        itemId,
        config = this.config;
        self = this;

    legendRequest.onreadystatechange = function (res) {
        if (legendRequest.readyState === 4) {
            if (legendRequest.status === 200) {
                response = JSON.parse(legendRequest.response);


                // Root div setup
                content += '<div id="' + config.id + '" class="' + self.CLASS_NAME + '">';

                if (config.title) {
                  content += '<div>' + config.title + '</dvi>';
                }

                // Legend items
                configLayerIds = config.layers.map(function(layer) {
                  return layer.id
                });


                responseLayers = response.layers.filter(function(responseLayer) {
                  return configLayerIds.indexOf(responseLayer.layerId) > -1;
                });

                responseLayers.forEach(function(responseLayer) {

                  responseLayer.config = config.layers.filter(function(config) {
                    return config.id === responseLayer.layerId;
                  }, this)[0];

                  responseLayer.legend.forEach(function(legendItem, i){
                    itemId = config.id + '-item-' + i;
                    self.items.push(itemId);
                    content += '<div id="' + itemId + '">' +
                                '<img style="vertical-align:middle;" src="data:image/png;base64,' + legendItem.imageData + '" height="' + legendItem.height + 'px" width="' + legendItem.width + 'px">' + 
                                '<span style="vertical-align:middle;padding-left:10px;">' + legendItem.label + '</span style="vertical-align:middle;padding-left:10px;">' + 
                                '</div>';

                  });
                  
                });

                // Root div cleanup
                if (config.title) {
                  content += '</div>';
                }

                content += '</div>';

                document.getElementById(config.parentId).insertAdjacentHTML('afterbegin',content);

                deferred.resolve(self);

            } else {
              deferred.resolve(null, true);
            }
        }
    };

    legendRequest.addEventListener('error', function (error) {
      if (error) console.log(error);
      deferred.resolve(null, true);
    }, false);

    legendRequest.open('GET', config.url, true);
    legendRequest.send();

    return deferred.promise;
  }  

  SimpleLegend.prototype.show = function () {
    document.getElementById(this.config.id).style.display = 'block';
    this.onShow();
    return this;
  };

  SimpleLegend.prototype.hide = function () {
    document.getElementById(this.config.id).style.display = 'none';
    this.onHide();
    return this;
  };

  SimpleLegend.prototype.filterItem = function (index) {
    this.items.forEach(function(elementId, elementIndex) {
      if (elementIndex === index) {
        document.getElementById(elementId).style.display = 'block';
      } else {
        document.getElementById(elementId).style.display = 'none';
      }
    });
    return this;
  };

  return SimpleLegend;

});
