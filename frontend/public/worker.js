const getUPlotChartData = (apiResponse) => {
	// Extract the list of series
	const seriesList = apiResponse.result[0].series || [];

	// Create an array to hold the uPlot data
	const uPlotData = [];

	// Process timestamps only once as they are the same across series
	uPlotData.push(seriesList[0].values.map((v) => v.timestamp));

	// Process each series
	for (const series of seriesList) {
		uPlotData.push(series.values.map((v) => parseFloat(v.value)));
	}

	return uPlotData;
};

function generateSeriesConfigurations(data) {
	const configurations = [{ label: 'Timestamp', stroke: 'purple' }];

	const seriesList = data.result[0].series || [];
	const colors = [
		'red',
		'blue',
		'green',
		'orange',
		'purple',
		'cyan',
		'magenta',
		'yellow',
		'brown',
		'lime',
	];

	for (let i = 0; i < seriesList?.length; i += 1) {
		const color = colors[i % colors.length]; // Use modulo to loop through colors if there are more series than colors

		configurations.push({ label: `Series ${i + 1}`, stroke: color });
	}

	return configurations;
}

onmessage = function (e) {
	const { data } = e.data;

	const uPlotData = getUPlotChartData(data);
	const seriesConfigurations = generateSeriesConfigurations(data);

	postMessage({ uPlotData, seriesConfigurations });
};
