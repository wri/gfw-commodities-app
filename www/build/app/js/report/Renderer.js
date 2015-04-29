/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-04-28/ */define(["report/config","dojo/number","dijit/Dialog","dojo/_base/array","dojo/on","dojo/dom","dojo/dom-style"],function(a,b,c,d){"use strict";var e="url(../../css/images/download-icon.svg)";return{renderContainers:function(a){var b=document.createDocumentFragment(),c=document.createElement("div"),d=document.getElementById("print-map");c.id=a.rootNode,c.className="result-container",c.innerHTML="<div class='title'>"+a.title+"</div><div class='result-block total-loss'><div class='top-panel' id='"+a.rootNode+"_composition'></div><div class='left-panel'><div class='loss-chart' id='"+a.rootNode+"_loss'><div class='loader-wheel'>total loss</div></div></div><div class='right-panel'><div class='fires-chart' id='"+a.rootNode+"_fire'><div class='loader-wheel'>active fires</div></div></div></div><div class='result-block clearance-alerts'><div class='clearance-chart' id='"+a.rootNode+"_clearance'><div class='loader-wheel'>clearance alerts</div></div></div><div class='result-block mill-points'><div class='mill-table' id='"+a.rootNode+"_mill'></div></div>",b.appendChild(c),document.getElementById("report-results-section").insertBefore(b,d)},renderTotalLossContainer:function(a){var b=document.createDocumentFragment(),c=document.createElement("div"),d=document.getElementById("print-map");c.id=a.rootNode,c.className="result-container",c.innerHTML="<div class='title'>"+a.title+"</div><div class='result-block total-loss'><div class='top-panel' id='"+a.rootNode+"_composition'></div><div class='left-panel'><div class='loss-chart' id='"+a.rootNode+"_loss'><div class='loader-wheel'>total loss</div></div></div></div>",b.appendChild(c),document.getElementById("report-results-section").insertBefore(b,d)},renderRSPOContainer:function(a){var b=document.createDocumentFragment(),c=document.createElement("div"),d=document.getElementById("print-map");c.id=a.rootNode,c.className="result-container",c.innerHTML="<div class='title'>"+a.title+"</div><div class='rspo-table-container' id='"+a.rootNode+"_table'><div class='loader-wheel'>rspo analysis</div></div><div class='rspo-chart-container' id='"+a.rootNode+"_chart'></div>",b.appendChild(c),document.getElementById("report-results-section").insertBefore(b,d)},renderSuitabilityContainer:function(a){var b=document.createDocumentFragment(),c=document.createElement("div"),d=document.getElementById("print-map");c.id=a.rootNode,c.className="result-container",c.innerHTML="<div class='title'>"+a.title+"</div><div class='suitability-container'><div class='left-panel'><div id='"+a.rootNode+"_content' class='suitability-content'><div class='loader-wheel'>suitability</div></div></div><div class='right-panel'><div id='"+a.rootNode+"_chart' class='suitability-chart'><div class='loader-wheel'>suitability</div></div></div><div class='clearFix'></div><div class='left-panel'><div class='suitability-settings-table-header'>Suitability Settings</div><div id='suitability-settings-table'></div></div><div class='right-panel'><div id='suitability-composition-analysis'></div></div></div>",b.appendChild(c),document.getElementById("report-results-section").insertBefore(b,d)},renderMillContainer:function(a){var b=document.createDocumentFragment(),c=document.createElement("div"),d=document.getElementById("print-map");c.id=a.rootNode,c.className="result-container relative",c.innerHTML="<div class='title'>"+a.title+"</div><div class='mill-table-container' id='"+a.rootNode+"_table'><div class='loader-wheel'>risk assessment</div></div>",b.appendChild(c),document.getElementById("report-results-section").insertBefore(b,d)},renderCompositionAnalysisLoader:function(a){document.getElementById(a.rootNode+"_composition").innerHTML='<div class="loader-wheel">composition analysis</div>'},renderCompositionAnalysis:function(a,c,d){var e,f,g,h=document.createDocumentFragment(),i=document.createElement("div"),j=document.getElementById(d.rootNode+"_composition"),k=d.compositionAnalysis,l=k.title||d.title;return k.histogramSlice&&(g=a.slice(k.histogramSlice)),0===g.length?void this.renderAsUnavailable("composition",d):(g=g.reduce(function(a,b){return a+b})*c*c/1e4,e=b.format(g),void report.areaPromise.then(function(){f=b.format(g/report.area*100,{places:0}),i.className="composition-analysis-container",i.innerHTML="<div>Total "+l+" in selected area: "+e+" ha</div><div>Percent of total area comprised of "+l+": "+f+"%</div>",h.appendChild(i),j.innerHTML="",j.appendChild(h)}))},renderLossData:function(b,c,f,g,h){var i,j,k,l,m,n=a.totalLoss,o=f.labels,p=n.labels,q=f.bounds.fromBounds(),r=n.bounds.fromBounds(),s=function(a){return a*c*c/1e4},t=[],u=[];if(h){if(k=b.slice(1).map(s),k.length!==p.length)for(var v=0;v<p.length;v++)void 0===k[v]&&(k[v]=0);t.push({name:o[0],data:k}),u.push(f.colors[0])}else for(l=0;l<q.length;l++){for(k=[],m=0;m<r.length;m++)i=g.encode(r[m],q[l]),k.push(b[i]||0);t.push({name:o[l],data:k.map(s)}),u.push(f.colors[l])}f.lossChart.removeBelowYear&&(j=p.indexOf(f.lossChart.removeBelowYear),p=p.slice(j),d.forEach(t,function(a){a.data=a.data.slice(j)})),$("#"+f.rootNode+"_loss").highcharts({chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:null,type:"bar",events:{load:function(){}}},colors:u,title:{text:f.lossChart.title},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},xAxis:{categories:p,maxPadding:.35,title:{text:null}},yAxis:{stackLabels:{enabled:!0},title:{text:null}},legend:{enabled:!0,verticalAlign:"bottom"},plotOptions:{series:{stacking:"normal"}},series:t,credits:{enabled:!1}})},renderTreeCoverLossData:function(b,c,f){var g,h=a.totalLoss,i=f.labels,j=h.labels,k=(f.bounds.fromBounds(),h.bounds.fromBounds(),function(a){return a*c*c/1e4}),l=[],m=[];if(l.push({name:i[0],data:b.slice(1).map(k)}),m.push(f.color),f.lossChart.removeBelowYear&&(g=j.indexOf(f.lossChart.removeBelowYear),j=j.slice(g),d.forEach(l,function(a){a.data=a.data.slice(g)})),l[0].data.length!==j.length)for(var n=0;n<j.length;n++)void 0===l[0].data[n]&&(l[0].data[n]=0);$("#"+f.rootNode+"_loss").highcharts({chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:null,type:"bar",events:{load:function(){}}},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},colors:m,title:{text:f.lossChart.title},xAxis:{categories:j,maxPadding:.35,title:{text:null}},yAxis:{stackLabels:{enabled:!0},title:{text:null}},legend:{enabled:!1,verticalAlign:"bottom"},plotOptions:{series:{stacking:"normal"}},series:l,credits:{enabled:!1}})},renderClearanceData:function(a,b,c,d,f){var g,h,i,j,k=c.labels,l=c.bounds.fromBounds(),m=report.clearanceBounds.fromBounds(),n=[],o=[];if("pie"===c.clearanceChart.type){for(i=0;i<l.length;i++){for(h=0,o=[],j=0;j<m.length;j++)g=d.encode(m[j],l[i]),o.push(a[g]||0);n.push({name:k[i],data:o})}$("#"+c.rootNode+"_clearance").highcharts({chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:!1},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},colors:c.colors,title:{text:c.clearanceChart.title},xAxis:{categories:report.clearanceLabels},yAxis:{title:null,min:0},legend:{enabled:!0},credits:{enabled:!1},series:n})}else{if(f){if(n=a.slice(1),n.length!==m.length)for(var p=0;p<m.length;p++)void 0===n[p]&&(n[p]=0)}else for(i=0;i<m.length;i++){for(h=0,j=0;j<l.length;j++)g=d.encode(m[i],l[j]),h+=a[g]||0;n.push(h)}$("#"+c.rootNode+"_clearance").highcharts({chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:!1},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},colors:["#fb00b3"],title:{text:c.clearanceChart.title},xAxis:{categories:report.clearanceLabels},yAxis:{title:null,min:0},legend:{enabled:!1},credits:{enabled:!1},series:[{name:c.title,data:n}]})}},renderFireData:function(c,f){function g(a,c,d,e){var f=document.createDocumentFragment(),g=document.createElement("div"),h=document.getElementById(a+"_fire");g.className="active-fires-badge",g.innerHTML="<div>There are currently</div><div class='active-fires-label'><div>"+b.format(c)+"</div><span>active fires</span></div><div>"+e+"</div><div class='total-active-fires-label'><span>"+b.format(d)+" total active fires</span></div>",f.appendChild(g),h.innerHTML="",h.appendChild(f)}function h(a,c,d,e,f){for(var g=document.createDocumentFragment(),h=document.createElement("div"),i=document.getElementById(a+"_fire"),j=[],k=0;k<c.length;k++)k>=d[0]&&k<=d[1]&&j.push(c[k]);h.className="active-fires-badge special",h.innerHTML="<div>Active fires are detected in:</div><div class='active-fires-label'><span>"+e[0]+" Forests</span><div>"+b.format(j[0]||0)+"</div></div><div class='active-fires-label'><span>"+e[1]+" Forests</span><div>"+b.format(j[1]||0)+"</div></div><div class='total-active-fires-label'><span>out of "+b.format(f)+" total active fires</span></div></div>",g.appendChild(h),i.innerHTML="",i.appendChild(g)}function i(a,b,c,d,f,i,j){var k,l=[],m=0,n=[];for(k=0;k<b.length;k++)k>=f[0]&&k<=f[1]&&(0===b[k]||isNaN(b[k])||(l.push([c[m],b[k]]),n.push(d[m])),m++);0===l.length?g(a,0,0,j):2===c.length?h(a,b,f,c,o.length):$("#"+a+"_fire").highcharts({chart:{plotBackgroundColor:null,plotBorderWidth:null,plotShadow:null},colors:n,title:{text:"Active Fires"},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},plotOptions:{pie:{size:"75%",allowPointSelect:!0,cursor:"pointer",showInLegend:!0,dataLabels:{enabled:!1}}},credits:{enabled:!0},legend:{enabled:!1},series:[{type:"pie",name:"Fires",data:l}]})}var j,k,l,m,n,o=f[0].features;d.forEach(c,function(b){if(l=b.rootNode,m=a.fires[b.fireKey],f.length>1&&"indonesiaMoratorium"===b.fireKey){var c=0;return d.forEach(f[1].features,function(a){c+=+a.attributes[m.field]}),void g(l,c,o.length,m.badgeDesc)}if(0===o.length)g(l,0,0,m.badgeDesc);else if("pie"===m.type){for(k=[],n=0;n<=m.labels.length;n++)k[n]=0;d.forEach(o,function(a){k[a.attributes[m.field]]++}),i(l,k,m.labels,m.colors,m.bounds,m.title,m.badgeDesc)}else j=0,d.forEach(o,function(a){j+=isNaN(parseInt(a.attributes[m.field]))?0:parseInt(a.attributes[m.field])}),g(l,j,o.length,m.badgeDesc)})},renderRSPOData:function(c,d,e){var f=a.rspo.lossBounds.fromBounds();if(!(c.histograms.length>0))return void(document.getElementById(d.rootNode+"_table").innerHTML="<div class='data-not-available'>No RSPO Data Available for this Site.</div>");var g,h,i,j,k,l=2005,m=8,n="",o="",p="",q="",r="",s=[],t=[],u=[],v=[],w=[];for(n="<table class='rspo-results-table'><tr><th>Forest Type</th>",i=0;m>=i;i++)s.push(l+i),n+="<th>"+(l+i)+"</th>";for(n+="</tr>",h=c.histograms[0].counts,j=0;j<f.length;j++)g=e.encode(f[j],2),u.push(h[g]||0),g=e.encode(f[j],3),v.push(h[g]||0),g=e.encode(f[j],1),t.push(h[g]||0),g=e.encode(f[j],0),w.push(h[g]||0);for(p="<tr><td>Primary</td>",q="<tr><td>Secondary</td>",o="<tr><td>Agroforestry</td>",r="<tr><td>Non-Forest</td>",k=0;k<u.length;k++)p+="<td>"+(b.format(u[k])||0)+"</td>",q+="<td>"+(b.format(v[k])||0)+"</td>",o+="<td>"+(b.format(t[k])||0)+"</td>",r+="<td>"+(b.format(w[k])||0)+"</td>";p+="</tr>",q+="</tr>",o+="</tr>",r+="</tr>",n+=p+q+o+r+"</table>",n+="<div class='change-area-unit'>(Change in Hectares)</div>",document.getElementById(d.rootNode+"_table").innerHTML=n,this.renderRSPOChart(d,u,v,t,w,s)},renderRSPOChart:function(a,c,d,f,g,h){var i={color:"#000"},j={style:i};$("#"+a.rootNode+"_chart").highcharts({chart:{backgroundColor:"#FFF",type:"column"},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},colors:a.colors,title:{text:null},legend:{align:"center",verticalAlign:"top",enabled:!0},xAxis:{categories:h,labels:j},yAxis:{title:{text:"",style:i},labels:j},plotOptions:{column:{stacking:"normal"}},tooltip:{formatter:function(){return"<strong>"+this.key+"</strong><br/>"+this.series.name+": "+b.format(this.y)+"<br/>Total: "+b.format(this.point.stackTotal)}},credits:{enabled:!1},series:[{name:"Primary",data:c},{name:"Secondary",data:d},{name:"Agroforestry",data:f},{name:"Non-Forest",data:g}]})},renderSuitabilityData:function(a,c){var d,e,f,g,h,i,j,k,l,m=a.lcHistogram.classIndices,n="<table>";if(l=c[0],l?(d=Math.pow(l.pixelSize/100,2),l.data.counts[1]?(f=b.format(l.data.counts[1]*d)||l.data.counts[1],e=b.format(l.data.counts[0]*d)||l.data.counts[0]):(f=0,e=b.format(l.data.counts[0]*d))):(f="N/A",e="N/A"),l=c[1]){d=Math.pow(l.pixelSize/100,2);var o=function(a){for(var c=0,e=0;e<a.length;e++)l.data.counts[a[e]]&&(c+=l.data.counts[a[e]]*d);return b.format(c)};i=o(m.production),j=o(m.convertible),k=o(m.other)}else i="N/A",j="N/A",k="N/A";l=c[2],g=l?parseFloat(l.data.min/1e3).toFixed(1):"N/A",l=c[3],h=l?l.value:"N/A",n+="<tr><td>Suitable(ha):</td><td>"+f+"</td></tr>",n+="<tr><td>Unsuitable(ha):</td><td>"+e+"</td></tr>",n+="<tr><td>Distance to nearest road(km):</td><td>"+g+"</td></tr>",n+="<tr><td>Existing concessions(Yes/No):</td><td>"+h+"</td></tr>",n+="<tr><td>Legal Classification(ha):</td><td></td></tr>",n+="<tr><td class='child-row'>Production forest(HP/HPT):</td><td>"+i+"</td></tr>",n+="<tr><td class='child-row'>Convertible forest(HPK):</td><td>"+j+"</td></tr>",n+="<tr><td class='child-row'>Other land uses(APL):</td><td>"+k+"</td></tr>",n+="</table>",n+="<p>"+a.localRights.content+"</p>",n+="<div class='field-assessment-link'><a href='"+a.localRights.fieldAssessmentUrl+"'>"+a.localRights.fieldAssessmentLabel+"</a></div>",document.getElementById(a.rootNode+"_content").innerHTML=n,this.renderSuitabilityChart(a,c[4]),this.renderSuitabilitySettingsTable()},renderSuitabilitySettingsTable:function(){var a,b,c,e,f,g,h=payload&&payload.suitability&&payload.suitability.csv,i="<table><thead><tr>";h&&(c=h.split("\n"),a=c.splice(1),b=c[0].split(","),i+="<th>Parameter</th><th>Setting</th></tr></thead><tbody>",d.forEach(a,function(a){g=a.split(","),e=g[0],f=g[1],void 0!==e&&""!==e&&(i+="<tr><td>"+e+"</td><td>"+f.replace(/\;/g,",")+"</td></tr>")}),i+="</tbody></table>",$("#suitability-settings-table").html(i))},renderSuitabilityCompositionChart:function(a){var b,c=[],f=[],g=[];d.forEach(a,function(a){b=a.suitable+a.unsuitable,a.suitable=a.suitable/b*100,a.unsuitable=a.unsuitable/b*100*-1}),a.sort(function(a,b){return a.suitable>b.suitable?1:b.suitable>a.suitable?-1:0}),d.forEach(a,function(a){c.push(a.unsuitable),f.push(a.suitable),g.push(a.label)}),$("#suitability-composition-analysis").highcharts({chart:{type:"bar"},title:{text:"Suitability Composition Analysis"},colors:["#FDD023","#461D7C"],credits:{enabled:!1},xAxis:[{categories:g,reversed:!1},{labels:{enabled:!1},opposite:!0,reversed:!1,linkedTo:0,tickLength:0}],yAxis:{title:{text:null},min:-100,max:100,labels:{formatter:function(){return Math.abs(this.value)+(0!==this.value?"%":"")}}},tooltip:{formatter:function(){return"<b>"+this.point.category+"</b><br/><b>"+this.series.name+":</b>	"+Highcharts.numberFormat(Math.abs(this.point.y),2)+"%"}},plotOptions:{series:{stacking:"normal"}},series:[{name:"Unsuitable",data:c},{name:"Suitable",data:f}],exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}}})},renderSuitabilityChart:function(a,b){function c(a){for(var c={suitable:0,unsuitable:0},d=0;d<a.length;d++)b.data.counts[a[d]]&&(c.unsuitable+=b.data.counts[a[d]]*i,c.suitable+=b.data.counts[a[d]+10]*i);return c}if(!b)return void(document.getElementById(a.rootNode+"_chart").innerHTML="<div class='data-not-available'>No Suitability Data Available to chart for this Site.</div>");var d,f,g,h=a.lcHistogram.classIndices,i=Math.pow(b.pixelSize/100,2),j=a.chart,k=[],l=[],m=[];d=c(h.convertible),f=c(h.production),g=c(h.other),k.push({y:d.suitable+f.suitable+g.suitable,color:j.suitable.color,name:j.suitable.name,id:j.suitable.id,children:{categories:j.childrenLabels,colors:j.childrenColors,data:[f.suitable,d.suitable,g.suitable]}}),k.push({y:d.unsuitable+f.unsuitable+g.unsuitable,color:j.unsuitable.color,name:j.unsuitable.name,id:j.unsuitable.id,children:{categories:j.childrenLabels,colors:j.childrenColors,data:[f.unsuitable,d.unsuitable,g.unsuitable]}});for(var n=0;n<k.length;n++)if(k[n].y>0){l.push({color:k[n].color,name:k[n].name,id:k[n].id,y:k[n].y});for(var o=0;o<k[n].children.data.length;o++)k[n].children.data[o]>0&&m.push({name:k[n].children.categories[o],color:k[n].children.colors[o],y:k[n].children.data[o],parentId:k[n].id})}$("#"+a.rootNode+"_chart").highcharts({chart:{type:"pie",backgroundColor:"#FFF",plotBorderWidth:null},title:{text:j.title},tooltip:{valueSuffix:""},exporting:{buttons:{contextButton:{enabled:!1},exportButton:{menuItems:Highcharts.getOptions().exporting.buttons.contextButton.menuItems,symbol:e}}},plotOptions:{series:{point:{events:{legendItemClick:function(){var a=this.id,b=this.series.chart.series[1].data;b.forEach(function(b){b.parentId===a&&b.setVisible(b.visible?!1:!0)})}}}}},legend:{itemStyle:{color:"#000"}},credits:{enabled:!1},series:[{name:"Area",data:l,size:"60%",showInLegend:!0,dataLabels:{enabled:!1}},{name:"Legal Area",data:m,size:"80%",innerSize:"60%",dataLabels:{color:"black",distance:5}}]})},renderMillAssessment:function(a,b){function c(a,b,c){var d="data-row"+(c?" child "+c:""),e="<tr class='"+d+"'><td class='row-name'><span>"+a+"</span></td>";return e+="<td class='"+b.concession.risk+"'><span class='large-swatch'></span><span class='risk-label'>"+b.concession.risk+"</span></td>",e+="<td class='"+b.radius.risk+"'><span class='large-swatch'></span><span class='risk-label'>"+b.radius.risk+"</span></td>",e+="</tr>"}function e(a,b,c,d){var e="data-row parent",f="<tr class='"+e+"' data-class='"+c+"'><td class='row-name'><span class='toggle-icon'></span><span>"+a+"</span></td>";return f+="<td class='"+(b[d+"_concession"]||"N/A")+"'><span class='large-swatch'></span><span class='risk-label'>"+(b[d+"_concession"]||"N/A")+"</span></td>",f+="<td class='"+(b[d+"_radius"]||"N/A")+"'><span class='large-swatch'></span><span class='risk-label'>"+(b[d+"_radius"]||"N/A")+"</span></td>",f+="</tr>"}function f(a,b,c){var d="<tr class='data-row'><td class='row-name'><span>"+a+"</span></td>",e=c?b[c+"_concession"]:b.concession.risk,f=c?b[c+"_radius"]:b.radius.risk;return d+="<td class='"+e+"'><span class='large-swatch'></span><span class='risk-label'>"+e+"</span></td>",d+="<td class='"+f+"'><span class='large-swatch'></span><span class='risk-label'>"+f+"</span></td>",d+="</tr>"}function g(a){var b=a.currentTarget,c=b.dataset?b.dataset["class"]:b.getAttribute("data-class");$(".mill-table-container .data-row.child."+c).toggle(),$(b).toggleClass("open")}var h,i=[],j="";d.forEach(a,function(a){report.mills?(d.some(report.mills,function(b){return a.id===b.id?(h=b.label,!0):void 0}),void 0===h&&(h=window.payload.title)):h=window.payload.title,j="<div class='mill-header'><span class='mill-title'>"+h+"</span><span class='mill-risk-level "+a.total_mill_priority_level+"'><span class='large-swatch'></span>Total Mill Priority Level: <span class='overall-risk'>"+a.total_mill_priority_level+"</span></span><span class='mill-rspo-certification'>RSPO Certification: <span>"+(a.rspo.risk?"Yes":"No")+"</span></span></div>",j+="<table><tr><th></th><th>Concession<span class='info-icon' data-type='concession'></span></th><th>Radius<span class='info-icon' data-type='radius'></span></th></tr>",j+=f("Priority Level",a,"priority_level"),j+=e("Deforestation",a.deforestation,"deforest-"+a.id,"deforestation"),j+=c("Total tree cover loss",a.deforestation.umd_loss,"deforest-"+a.id),j+=c("Tree cover loss on primary forest",a.deforestation.umd_loss_primary,"deforest-"+a.id),j+=c("Total clearance alerts",a.deforestation.forma,"deforest-"+a.id),j+=c("Clearance alerts on primary forest",a.deforestation.forma_primary,"deforest-"+a.id),j+=c("Tree cover loss on carbon stock",a.deforestation.carbon,"deforest-"+a.id),j+=f("Legality",a.legal),j+=e("Peat",a.peat,"peat-"+a.id,"peat"),j+=c("Presence of peat",a.peat.presence,"peat-"+a.id),j+=c("Clearance on peat",a.peat.clearance,"peat-"+a.id),j+=f("Fires",a.fire),j+="</table>",i.push(j)}),document.getElementById(b.rootNode+"_table").innerHTML=i.join("<br />"),$(".mill-table-container tr.parent").click(g),$(".mill-table-container .info-icon").click(this.showMillPointInfo),$(".mill-table-container .data-row.child").toggle()},showMillPointInfo:function(b){var d,e=b.currentTarget,f=e.dataset?e.dataset.type:e.getAttribute("data-type"),g=a.millPointInfo[f];d=new c({title:g.title,content:g.content,style:"width: 300px;"}),d.show()},renderAsUnavailable:function(a,b){var c=document.getElementById(b.rootNode+"_"+a),d="";d="loss"===a?"No tree cover loss detected.":"clearance"===a?"No clearance alerts occured in this area.":"composition"===a?b.errors&&b.errors.composition||"No Composition Analysis Data Available for this site.":"No Mill Point Data Available for this site.",c&&(c.innerHTML=d)}}});