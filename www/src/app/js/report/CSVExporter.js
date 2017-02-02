define([
	'dojo/number',
	'dojo/_base/array'
], function (number, arrayUtils) {

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
    csvData.push('Type,' + values.join(','));
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

	function exportAlternateChartAnalysis (chart) {
		var series = chart.series,
				csvData = [],
				values = [],
				lineEndings = '\r\n',
				output;

		csvData = ['Custom Feature #1 - Glad Alerts', 'Day,Glad Alerts'];

		series[0].processedXData.forEach(function(date, index) {
			const d = new Date(date);
			var datestring = (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
			values.push(datestring);
			values.push(series[0].processedYData[index]);
			csvData.push(values.join(','));
			values = [];
		});

		output = csvData.join(lineEndings);
		return output;

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
    csvData.push('Suitability,Total,HP/HPT,HPK,APL');
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
	* Very Specific for parsing data from a table
	* @return {array} - array of csv ready string data, each entry in the array represents one line in the csv export
	*/
	function exportSuitabilityStatistics () {
		var featureTitle = document.getElementById('title').innerHTML,
				rows = $("#suitabilityAnalysis_content tr"),
				csvData = [],
				temp;

		// Push in Type of Output, Feature Title, and Headers
		csvData.push('Suitability Statistics');
		csvData.push(featureTitle);
		csvData.push('Parameter, Value');

		arrayUtils.forEach(rows, function (row) {
			temp = row.cells[1].innerHTML.replace(',','');
			csvData.push(row.cells[0].innerHTML + ',' + temp);
		});

		return csvData;

	}

	/**
	* Takes Mill API Results and formats them into a CSV file
	* @param {object[]} mills - Array of mills from the response
	* @param {object[]} descriptors - Array of labels and infos
	* @param {string} - descriptors[n].label - Column header to be used in CSV output
	* @param {object} - descriptors[n].info - Info object containing info for parsing and formatting
	* @param {string} - descriptors[n].info.path - Path to data, e.g 'fire.risk' finds value in - { fire: { risk: 'value' }}
	* @param {number} - descriptors[n].info.precision - Precision for formatting the number
	* @return {string} results - Array of strings, each string represents one line in the CSV file
	*/
	function prepareMillAnalysis (mills, descriptors) {
		var lineEnding = '\r\n',
				unavailable = 'N/A',
				results = [],
				row;

		// Helper function to parse object at path, 12 = getValueForPath('a.b', {a: { b: 12}});
		// Info should have path and optionally a precision value
		// precision means data is expected to be a number and tells how many places it should round to
		function formatValueAtPath (info, item) {
			var keys = info.path.split('.');
			var result = keys.every(function (key) {
				if (item[key] !== undefined) {
					item = item[key];
					return true;
				}
			});
			// Format value here if necessary, check precision against undefined as precision can be 0 which is falsy
			return result ? (
				info.precision !== undefined ? number.round(item, info.precision) : item
			) : unavailable;
		}
		// Create the column headings by pushing in the labels to results
		row = descriptors.map(function (descriptor) { return descriptor.label; });
		// Push the row in to the results after each operation
		results.push(row.join(','));
		// Now grab the values
		mills.forEach(function (mill) {
			row = descriptors.map(function (descriptor) { return formatValueAtPath(descriptor.info, mill); });
			results.push(row.join(','));
		});
		return results.join(lineEnding);
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
		exportSuitabilityStatistics: exportSuitabilityStatistics,
		exportCompositionAnalysis: exportCompositionAnalysis,
		exportSimpleChartAnalysis: exportSimpleChartAnalysis,
		exportAlternateChartAnalysis: exportAlternateChartAnalysis,
		prepareMillAnalysis: prepareMillAnalysis

	};

	return Exporter;

});
