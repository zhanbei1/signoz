import dayjs from 'dayjs';
import { SeriesOptionsType } from 'highcharts';
import { HighchartsReactProps } from 'highcharts-react-official';
import { MetricRangePayloadV3 } from 'types/api/metrics/getQueryRange';
import { D3DataSet } from 'components/D3Graphs/LineGraph';
import uPlot from 'uplot';

export function transformForD3(
	apiResponse: MetricRangePayloadV3['data'],
): HighchartsReactProps['options'] {
	const transformedData: SeriesOptionsType[] = [];

	if (apiResponse.result && Array.isArray(apiResponse.result)) {
		apiResponse.result.forEach((resultItem) => {
			resultItem?.series?.forEach((seriesItem) => {
				const datasetName = seriesItem.labels.__name__;
				const datasetValues = seriesItem.values.map((valueItem) => ({
					date: dayjs(valueItem.timestamp),
					value: parseFloat(valueItem.value),
				}));

				transformedData.push({
					name: datasetName,
					data: datasetValues.map((valueItem) => valueItem.value),
					type: 'line',
				});
			});
		});
	}

	return {
		series: transformedData,
		yAxis: {
			type: 'linear',
		},
		xAxis: {
			type: 'datetime',
		},
	};
}

export const getD3ChartData = (
	apiResponse: MetricRangePayloadV3['data'],
): D3DataSet[] => {
	const transformedData: D3DataSet[] = [];

	if (apiResponse.result && Array.isArray(apiResponse.result)) {
		apiResponse.result.forEach((resultItem) => {
			resultItem?.series?.forEach((seriesItem) => {
				const datasetName = seriesItem.labels.__name__;
				const datasetValues = seriesItem.values.map((valueItem) => ({
					date: dayjs(valueItem.timestamp),
					value: parseFloat(valueItem.value),
				}));

				transformedData.push({
					name: datasetName,
					values: datasetValues,
				});
			});
		});
	}

	return transformedData;
};

export const getUPlotChartData = (
	apiResponse: MetricRangePayloadV3['data'],
): uPlot.AlignedData => {
	console.log({ apiResponse });
	// Extract the list of series
	const seriesList = apiResponse?.result[0]?.series || [];

	// Create an array to hold the uPlot data
	const uPlotData: uPlot.AlignedData = [];

	// Process timestamps only once as they are the same across series
	uPlotData.push(seriesList[0]?.values?.map((v) => v.timestamp));

	// Process each series
	for (const series of seriesList) {
		uPlotData.push(series.values.map((v) => parseFloat(v.value)));
	}

	return uPlotData;
};
