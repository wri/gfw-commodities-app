define([],
    function() {

        SimpleLegend = function(config) {
            this.config = config;
            this.CLASS_NAME = 'simple-legend';
            this.onHide = function() {};
            this.onShow = function() {};
            this.items = [];

            return this;
        };

        SimpleLegend.prototype.init = function(callback) {

            var legendRequest = new XMLHttpRequest(),
                layerIndex = 0,
                content = '',
                configLayerIds,
                response,
                responseLayers,
                config = this.config,
                self = this;

            legendRequest.onreadystatechange = function(res) {
                if (legendRequest.readyState === 4) {
                    if (legendRequest.status === 200) {
                        response = JSON.parse(legendRequest.response);


                        // Root div setup
                        content += '<div id="' + config.id + '" class="' + self.CLASS_NAME + '">';

                        if (config.title) {
                            content += '<div id="' + config.id + '-title" class="simple-legend-title">' + config.title + '</div>';
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

                            responseLayer.legend.forEach(function(legendItem, i) {
                                var itemId = config.id + '-layer-' + layerIndex + '-' + i,
                                    itemLabel = legendItem.label;

                                self.items.push(itemId);

                                // Label overrides
                                if (config.layers[layerIndex].labels !== undefined && config.layers[layerIndex].labels[i]) {
                                    itemLabel = config.layers[layerIndex].labels[i];
                                }

                                content += '<div id="' + itemId + '" class="simple-legend-layer">' +
                                    '<img class="simple-legend-image" src="data:image/png;base64,' + legendItem.imageData + '" height="' + legendItem.height + 'px" width="' + legendItem.width + 'px">' +
                                    '<span class="simple-legend-label">' + itemLabel + '</span>' +
                                    '</div>';
                            });

                            layerIndex += 1;

                        });

                        // Root div cleanup
                        if (config.title) {
                            content += '</div>';
                        }

                        content += '</div>';

                        document.getElementById(config.parentId).insertAdjacentHTML('afterbegin', content);

                        if (callback) callback.bind(self)();

                    } else {
                        console.log('Error');
                    }
                }
            };

            legendRequest.addEventListener('error', function(error) {
                if (error) console.log(error);
            }, false);

            legendRequest.open('GET', config.url, true);
            legendRequest.send();

        }

        SimpleLegend.prototype.show = function() {
            document.getElementById(this.config.id).style.display = 'block';
            this.onShow();
            return this;
        };

        SimpleLegend.prototype.hide = function() {
            // console.log(this.config.id);
            document.getElementById(this.config.id).style.display = 'none';
            this.onHide();
            return this;
        };

        SimpleLegend.prototype.filterItem = function(index) {
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