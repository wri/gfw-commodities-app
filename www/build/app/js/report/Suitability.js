/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-05-01/ */define(["esri/request","esri/tasks/query","esri/tasks/QueryTask","esri/geometry/Polygon","report/config","dojo/Deferred","dojo/_base/lang","dojo/_base/array","dojo/promise/all"],function(a,b,c,d,e,f,g,h,i){return{getSuitabilityData:function(){function a(a){b.resolve(a)}var b=new f;return i([this.getSuitableAreas(),this.getLCHistogramData(),this.getRoadData(),this.getConcessionData(),this.computeLegalHistogram()]).then(a),b.promise},getSuitableAreas:function(){function a(a){a.histograms.length>0?(k.data=a.histograms[0],k.pixelSize=j.pixelSize,c.resolve(k)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==j.pixelSize?(j.pixelSize=500,i.getHistogram(h,j,a,b)):c.resolve(!1)}var c=new f,d=g.clone(report.suitable.renderRule),h=e.suitability.url,i=this,j={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry)},k={};return d.rasterFunction=e.suitability.rasterFunction,j.renderingRule=JSON.stringify(d),this.getHistogram(h,j,a,b),c.promise},getLCHistogramData:function(){function a(a){a.histograms.length>0?(k.data=a.histograms[0],k.pixelSize=j.pixelSize,c.resolve(k)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==j.pixelSize?(j.pixelSize=500,i.getHistogram(h,j,a,b)):c.resolve(!1)}var c=new f,d=e.suitability.lcHistogram,g=d.renderRule,h=e.suitability.url,i=this,j={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry),renderingRule:JSON.stringify(g)},k={};return this.getHistogram(h,j,a,b),c.promise},getRoadData:function(){function a(a){a.histograms.length>0?(k.data=a.histograms[0],k.pixelSize=j.pixelSize,c.resolve(k)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==j.pixelSize?(j.pixelSize=500,i.getHistogram(g,j,a,b)):c.resolve(!1)}var c=new f,d=e.suitability.roadHisto,g=e.suitability.url,h=d.mosaicRule,i=this,j={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry),mosaicRule:JSON.stringify(h)},k={};return this.getHistogram(g,j,a,b),c.promise},getConcessionData:function(){var a=new f,g=e.suitability.concessions,h=new b,i=new c(g.url+"/"+g.layer);return h.returnGeometry=!1,h.geometry=new d(report.geometry),i.executeForCount(h,function(b){a.resolve({value:b>0?"Yes":"No"})},function(){a.resolve(!1)}),a.promise},computeLegalHistogram:function(){function a(a){a.histograms.length>0?(m.data=a.histograms[0],m.pixelSize=l.pixelSize,c.resolve(m)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==l.pixelSize?(l.pixelSize=500,k.getHistogram(j,l,a,b)):c.resolve(!1)}var c=new f,d=g.clone(report.suitable.renderRule),h=e.suitability.lcHistogram,i=h.renderRuleSuitable,j=e.suitability.url,k=this,l={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry)},m={};return g.mixin(d.rasterFunctionArguments,i.rasterFunctionArguments),d.rasterFunction=i.rasterFunction,l.renderingRule=JSON.stringify(d),this.getHistogram(j,l,a,b),c.promise},getCompositionAnalysis:function(){var a=new f,b=this;return i([b.getElevationComposition(),b.getSlopeComposition(),b.getWaterComposition(),b.getConservationComposition()]).then(function(c){i([b.getSoilTypeComposition(),b.getSoilDepthComposition(),b.getPeatComposition(),b.getSoilAcidityComposition()]).then(function(d){i([b.getSoilDrainComposition(),b.getRainfallComposition(),b.getLandCoverComposition()]).then(function(b){a.resolve(c.concat(d.concat(b)))})})}),a.promise},getElevationComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$1","ElevInpR","ElevOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Elevation"),c.resolve(b)}),c.promise},getSlopeComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$2","SlopeInpR","SlopeOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Slope"),c.resolve(b)}),c.promise},getWaterComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$3","WaterInpR","WaterOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Water Resource Buffers"),c.resolve(b)}),c.promise},getConservationComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$4","ConsInpR","ConsOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Conservation Area Buffers"),c.resolve(b)}),c.promise},getSoilTypeComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$5","STypeInpR","STypeOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Soil Type"),c.resolve(b)}),c.promise},getSoilDepthComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$6","SDepthInpR","SDepthOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Soil Depth"),c.resolve(b)}),c.promise},getPeatComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$7","PeatInpR","PeatOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Peat Depth"),c.resolve(b)}),c.promise},getSoilAcidityComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$8","SAcidInpR","SAcidOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Soil Acidity"),c.resolve(b)}),c.promise},getSoilDrainComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$9","SDrainInpR","SDrainOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Soil Drainage"),c.resolve(b)}),c.promise},getRainfallComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$10","RainfallInpR","RainfallOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Rainfall"),c.resolve(b)}),c.promise},getLandCoverComposition:function(){var a,b,c=new f,d=this;return a=this.getCompositionRemapRule("$11","LCInpR","LCOutV"),this.queryComposition(a,function(a){b=d.formatCompositionResults(a,"Land Cover"),c.resolve(b)}),c.promise},getCompositionRemapRule:function(a,b,c){var d=g.clone(report.suitable.renderRule);return{rasterFunction:"Remap",rasterFunctionArguments:{InputRanges:d.rasterFunctionArguments[b],OutputValues:d.rasterFunctionArguments[c],Raster:a},outputPixelType:"U2"}},queryComposition:function(a,b){function c(a){var c;a.histograms.length>0?(c=a.histograms[0]&&a.histograms[0].counts||[0,0],b(c)):(c=[0,0],b(c))}function d(a){a.details&&"The requested image exceeds the size limit."===a.details[0]&&500!==g.pixelSize?(g.pixelSize=500,self.getHistogram(f,g,c,d)):b(!1)}var f=e.suitability.url,g={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry),renderingRule:JSON.stringify(a)};this.getHistogram(f,g,c,d)},formatCompositionResults:function(a,b){return{unsuitable:a[0]||0,suitable:a[1]||0,label:b}},getHistogram:function(b,c,d,e){var f=a({url:b+"/computeHistograms?",content:c,handleAs:"json",callbackParamName:"callback"});f.then(d,e)}}});