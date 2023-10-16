import { Card, Typography } from 'antd';
import { OPERATORS, PANEL_TYPES } from 'constants/queryBuilder';
import { QueryBuilder } from 'container/QueryBuilder';
import { useGetQueryRange } from 'hooks/queryBuilder/useGetQueryRange';
import {
	MetricRangePayloadProps,
	MetricRangePayloadV3,
} from 'types/api/metrics/getQueryRange';
import { DataTypes } from 'types/api/queryBuilder/queryAutocompleteResponse';
import { EQueryType } from 'types/common/dashboard';
import { DataSource, QueryBuilderData } from 'types/common/queryBuilder';
import uPlot from 'uplot';
import Uplot from './Uplot';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducers';
import AppReducer from 'types/reducer/app';
import { GlobalReducer } from 'types/reducer/globalTime';
import 'uplot/dist/uPlot.min.css';

function Charts(): JSX.Element {
	const maxTime = useSelector<AppState, GlobalReducer['maxTime']>(
		(state) => state.globalTime.maxTime,
	);
	const minTime = useSelector<AppState, GlobalReducer['minTime']>(
		(state) => state.globalTime.minTime,
	);
	const selectedTime = useSelector<AppState, GlobalReducer['selectedTime']>(
		(state) => state.globalTime.selectedTime,
	);

	const data = useGetQueryRange({
		selectedTime: 'GLOBAL_TIME',
		globalSelectedInterval: selectedTime,
		graphType: PANEL_TYPES.TIME_SERIES,
		params: { allowSelectedIntervalForStepGen: false },
		query: {
			builder: {
				queryData: [
					{
						filters: {
							items: [],
							op: '',
						},
						having: [],
						legend: '',
						limit: null,
						orderBy: [],
						queryName: 'A',
						groupBy: [],
						expression: 'A',
						reduceTo: 'sum',
						stepInterval: 60,
						// offset: 0,
						// pageSize: 0,
						disabled: false,
						dataSource: DataSource.METRICS,
						aggregateOperator: 'noop',
						aggregateAttribute: {
							key: 'signoz_latency_bucket',
							dataType: DataTypes.Float64,
							type: DataTypes.Float64,
							isColumn: true,
							isJSON: false,
							id: 'signoz_calls_total--float64----true',
						},
					},
				],
				queryFormulas: [],
			},
			clickhouse_sql: [],
			id: '1',
			promql: [],
			queryType: EQueryType.QUERY_BUILDER,
		},
		variables: {
			SIGNOZ_START_TIME: minTime,
			SIGNOZ_END_TIME: maxTime,
		},
	});

	const getUPlotChartData = (
		data: MetricRangePayloadV3['data'],
	): uPlot.AlignedData => {
		console.time('getUPlotChartData');
		const seriesList = data?.result[0]?.series?.slice(0, 300) || [];

		const uPlotData: uPlot.AlignedData = [];

		uPlotData.push(seriesList[0]?.values?.map((v) => v.timestamp) as any);

		seriesList.forEach((series) => {
			uPlotData.push(series?.values?.map((v) => parseFloat(v.value)) as any);
		});

		console.timeEnd('getUPlotChartData');

		return uPlotData;
	};

	function generateSeriesConfigurations(
		data: MetricRangePayloadV3['data'],
	): uPlot['series'] {
		const configurations: uPlot['series'] = [
			{ label: 'Timestamp', stroke: 'purple' },
		];

		const seriesList = data?.result[0]?.series?.slice(0, 300) || [];
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

	const selectedData = data.data?.payload?.data?.newResult?.data || {
		result: [],
		resultType: '',
	};

	console.log(data.data?.payload?.data);

	const options = {
		width: 300,
		height: 300,
		scales: {
			x: {
				time: true,
			},
		},
		legend: {
			show: false,
		},
		focus: {
			alpha: 1,
		},
		series: generateSeriesConfigurations(selectedData),
		axes: [
			{
				values: (u, vals, space) =>
					vals.map((v) => {
						const date = new Date(v);
						return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
					}),
				grid: { show: true },
				ticks: { show: true },
				space: 60, // minimum spacing (in pixels) between ticks
				label: 'Date',
				size: 80, // can be used to set fixed size
			},
			{},
		],
	};

	return (
		<div style={{ background: 'white' }}>
			{[1].map((item) => (
				<Uplot
					key={item}
					options={options}
					data={getUPlotChartData(selectedData)}
				/>
			))}
		</div>
	);
}

export default Charts;
