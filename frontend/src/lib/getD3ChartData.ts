import { D3DataSet } from 'components/D3Graphs';
import dayjs from 'dayjs';
import { MetricRangePayloadV3 } from 'types/api/metrics/getQueryRange';

export function transformForD3(
	apiResponse: MetricRangePayloadV3['data'],
): D3DataSet[] {
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
}
