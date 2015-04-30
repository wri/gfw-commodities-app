define([
	'dojo/_base/array'
], function (arrayUtils) {
	'use strict';

	/**
	* Take some data and encode it into base64 format, see comments in function
	*/
	function encodeToBase64 (data) {
		//  discuss at: http://phpjs.org/functions/base64_encode/
	  //  original by: Tyler Akins (http://rumkin.com)
	  //  improved by: Bayron Guevara
	  //  improved by: Thunder.m
	  //  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //  improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //  improved by: Rafał Kukawski (http://kukawski.pl)
	  //  bugfixed by: Pellentesque Malesuada
	  //   example 1: base64_encode('Kevin van Zonneveld');
	  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	  //   example 2: base64_encode('a');
	  //   returns 2: 'YQ=='
	  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	  var o1, o2, o3, h1, h2, h3, h4, bits, 
	  		i = 0,
		    ac = 0,
		    enc = '',
		    tmp_arr = [];

		if (!data) {
			return data;
		}

		do {
			// Pack three octets into four hexets
			o1 = data.charCodeAt(i++);
	    o2 = data.charCodeAt(i++);
	    o3 = data.charCodeAt(i++);

	    bits = o1 << 16 | o2 << 8 | o3;

	    h1 = bits >> 18 & 0x3f;
	    h2 = bits >> 12 & 0x3f;
	    h3 = bits >> 6 & 0x3f;
	    h4 = bits & 0x3f;

	    // Use hexets to index into b64 and append result to encoded string
	    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);

		} while (i < data.length);

		enc = tmp_arr.join('');

		var r = data.length % 3;

		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

	}

	/**
	* Take some base64 data and encode it into blob friendly format, this is needed to export the csv in the proper
	* format so Excel can read it correctly
	*/
	function base64ToBlob (base64Data, contentType) {
		// Taken From: http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {

			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			var i = 0;

			for (var offset = begin; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}

			byteArrays[sliceIndex] = new Uint8Array(bytes);

		}

		return new Blob(byteArrays, { type: contentType });

	}

	/**
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportCompositionAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [];
		// Create the headers first
    arrayUtils.forEach(series[0].data, function (dataObject) {
        values.push(dataObject.category);
    });
    // Push in those values with Suitability as the first Value
    csvData.push('Suitability,' + values.join(','));
    // Now push the data from the individual series in
    arrayUtils.forEach(series, function (serie) {
        values = [];
        values.push(serie.name);
        arrayUtils.forEach(serie.data, function (dataObject) {
            values.push(Math.abs(dataObject.y.toFixed(2)));
        });
        csvData.push(values.join(','));
    });

    return csvData;
	}

	/**
	* This works for bar charts, line charts, and column charts whose categories are on the xAxis
	* NOTE: Highcharts sometimes rotates charts so it may look like the yAxis but look where the data starts
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSimpleChartAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [],
				categories;

		categories = chart.xAxis[0].categories;
    // Push in the header categories
    arrayUtils.forEach(categories, function (category) {
        values.push(category);
    });
    // Add Name Catgory for First value and then join the headers
    csvData.push('Name,' + values.join(','));
    // Start creating a row for each series
    arrayUtils.forEach(series, function (serie) {
        values = [];
        values.push(serie.name);
        arrayUtils.forEach(serie.data, function (dataObject) {
            values.push(dataObject.y);
        });
        csvData.push(values.join(','));
    });

    return csvData;
	}

	/**
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSuitabilityByLegalClass (chart) {
		var unsuitable = ['Unsuitable'],
				suitable = ['Suitable'],
				series = chart.series,
				hptUnsuit = 0,
        hpkUnsuit = 0,
        aplUnsuit = 0,
        hptSuit = 0,
        hpkSuit = 0,
        aplSuit = 0,
				csvData = [],
				values = [],
				serie;

		// Push in the categories first
    csvData.push('Status,Total,HP/HPT,HPK,APL');
    // Handle Totals first
    serie = series[0];
    // There should only be two values here, if the ordering changes, function
    // will need to be updated to account for the serie being the the legal area data instead
    arrayUtils.forEach(serie.data, function (dataObject) {
        if (dataObject.name === 'Suitable') {
            suitable.push(dataObject.y);
        } else {
            unsuitable.push(dataObject.y);
        }
    });
    // Now Push in the Legal Areas
    serie = series[1];
    arrayUtils.forEach(serie.data, function (dataObject) {
        switch (dataObject.name) {
            case "HP/HPT":
                if (dataObject.parentId === "donut-Suitable") {
                    hptSuit = dataObject.y || 0;
                } else {
                    hptUnsuit = dataObject.y || 0;
                }
            break;
            case "APL":
                if (dataObject.parentId === "donut-Suitable") {
                    aplSuit = dataObject.y || 0;
                } else {
                    aplUnsuit = dataObject.y || 0;
                }
            break;
            case "HPK":
                if (dataObject.parentId === "donut-Suitable") {
                    hpkSuit = dataObject.y || 0;
                } else {
                    hpkUnsuit = dataObject.y || 0;
                }
            break;
        }
    });
    // Push these values into the appropriate array in the correct order
    suitable = suitable.concat([hptSuit, hpkSuit, aplSuit]);
    unsuitable = unsuitable.concat([hptUnsuit, hpkUnsuit, aplUnsuit]);
    // Push these arrays into the content array
    csvData.push(suitable.join(','));
    csvData.push(unsuitable.join(','));

    return csvData;
	}

	/**
	* @param {object} chart - Takes a HighChart chart object
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportClearanceAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [],
				categories;

		console.log(chart);

		return csvData;
	}


	var Exporter = {

		exportCSV: function (exportData) {

			var hrefType = 'data:application/vnd.ms-excel;base64,',
					blobType = 'text/csv;charset=utf-8',
					filename = 'data.csv',
					link = document.createElement('a'),
					blob;

			// If FileSaver loaded successfully and Blob's are supported
			if (saveAs && !!new Blob) {

				blob = base64ToBlob(encodeToBase64(exportData), blobType);
				saveAs(blob, filename);

			} else if (link.download === '') {

				link.href = hrefType + encodeToBase64(exportData);
				link.target = '_blank';
				link.download = filename;
				link.click();

			} else {

				window.open(hrefType + encodeToBase64(exportData));

			}

		},

		// Export Helper Functions
		exportSuitabilityByLegalClass: exportSuitabilityByLegalClass,
		exportCompositionAnalysis: exportCompositionAnalysis,
		exportSimpleChartAnalysis: exportSimpleChartAnalysis

	};

	return Exporter;

});