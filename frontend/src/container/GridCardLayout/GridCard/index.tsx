import 'uplot/dist/uPlot.min.css';

import { Card, Skeleton, Typography } from 'antd';
import D3LineChart from 'components/D3Graphs/LineGraph';
import { PANEL_TYPES } from 'constants/queryBuilder';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useGetQueryRange } from 'hooks/queryBuilder/useGetQueryRange';
import { useStepInterval } from 'hooks/queryBuilder/useStepInterval';
import useDebouncedFn from 'hooks/useDebouncedFunction';
import { getDashboardVariables } from 'lib/dashbaordVariables/getDashboardVariables';
import getChartData from 'lib/getChartData';
import {
	getD3ChartData,
	getUPlotChartData,
	transformForD3,
} from 'lib/getD3ChartData';
import isEmpty from 'lodash-es/isEmpty';
import { useDashboard } from 'providers/Dashboard/Dashboard';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { UpdateTimeInterval } from 'store/actions';
import { AppState } from 'store/reducers';
import { MetricRangePayloadV3 } from 'types/api/metrics/getQueryRange';
import { GlobalReducer } from 'types/reducer/globalTime';
import uPlot from 'uplot';

import EmptyWidget from '../EmptyWidget';
import { MenuItemKeys } from '../WidgetHeader/contants';
import UplotComponent from './Chart';
import { GridCardGraphProps } from './types';
import WidgetGraphComponent from './WidgetGraphComponent';

// const worker = new Worker(`/worker.js`);

// worker.onerror = (e) => {
// 	console.log(e);
// };

function GridCardGraph({
	widget,
	name,
	onClickHandler,
	headerMenuList = [MenuItemKeys.View],
	isQueryEnabled,
	threshold,
	variables,
}: GridCardGraphProps): JSX.Element {
	const dispatch = useDispatch();
	const [errorMessage, setErrorMessage] = useState<string>();

	// worker.onmessage = (e) => {
	// 	const { uPlotData, seriesConfigurations } = e.data;

	// 	console.log({ uPlotData, seriesConfigurations }, widget.id);
	// };
	const onDragSelect = (start: number, end: number): void => {
		const startTimestamp = Math.trunc(start);
		const endTimestamp = Math.trunc(end);

		if (startTimestamp !== endTimestamp) {
			dispatch(UpdateTimeInterval('custom', [startTimestamp, endTimestamp]));
		}
	};

	// const { ref: graphRef, inView: isGraphVisible } = useInView({
	// 	threshold: 0,
	// 	triggerOnce: true,
	// 	initialInView: false,
	// });

	const { minTime, maxTime, selectedTime } = useSelector<
		AppState,
		GlobalReducer
	>((state) => state.globalTime);

	const isEmptyWidget =
		widget?.id === PANEL_TYPES.EMPTY_WIDGET || isEmpty(widget);

	const queryResponse = useGetQueryRange(
		{
			selectedTime: widget?.timePreferance,
			graphType: widget?.panelTypes,
			query: useStepInterval(widget?.query),
			globalSelectedInterval: selectedTime,
			variables: getDashboardVariables(variables),
		},
		{
			queryKey: [
				maxTime,
				minTime,
				selectedTime,
				variables,
				widget?.query,
				widget?.panelTypes,
				widget.timePreferance,
			],
			keepPreviousData: true,
			enabled: !isEmptyWidget && isQueryEnabled,
			refetchOnMount: false,
			onError: (error) => {
				setErrorMessage(error.message);
			},
		},
	);

	if (queryResponse.isLoading) {
		return <Typography>Loading</Typography>;
	}

	// const chartDataFromD3 = transformForD3(
	// 	queryResponse?.data?.payload?.data || {
	// 		result: [],
	// 		resultType: '',
	// 	},
	// );
	// const d3 = getD3ChartData(
	// 	queryResponse?.data?.payload?.data || {
	// 		result: [],
	// 		resultType: '',
	// 	},
	// );

	const uplotData = getUPlotChartData(
		queryResponse?.data?.payload?.data || {
			result: [],
			resultType: '',
		},
	);

	// console.log({ asd, queryResponse, chartContainerRef });

	const isEmptyLayout = widget?.id === PANEL_TYPES.EMPTY_WIDGET;

	function generateSeriesConfigurations(data) {
		const configurations = [{ label: 'Timestamp', stroke: 'purple' }];

		// console.log({ data });

		// const seriesList = data?.data?.result[0]?.series || [];
		// const colors = [
		// 	'red',
		// 	'blue',
		// 	'green',
		// 	'orange',
		// 	'purple',
		// 	'cyan',
		// 	'magenta',
		// 	'yellow',
		// 	'brown',
		// 	'lime',
		// ];

		// for (let i = 0; i < seriesList?.length; i += 1) {
		// 	const color = colors[i % colors.length]; // Use modulo to loop through colors if there are more series than colors

		// 	configurations.push({ label: `Series ${i + 1}`, stroke: color });
		// }

		return configurations;
	}

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
		series: generateSeriesConfigurations(queryResponse.data?.payload),
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

	console.log({ options, uplotData });

	return (
		<>
			{/* <HighchartsReact highcharts={Highcharts} options={chartDataFromD3} /> */}
			{/* <div>
				<UplotComponent options={options} data={asd} />
			</div> */}

			<div>asd</div>

			{/* <Card>
				<D3LineChart data={d3} />
			</Card> */}

			{/* <WidgetGraphComponent
				widget={widget}
				queryResponse={queryResponse}
				errorMessage={errorMessage}
				data={chartData.data}
				isWarning={chartData.isWarning}
				name={name}
				onDragSelect={onDragSelect}
				threshold={threshold}
				headerMenuList={headerMenuList}
				onClickHandler={onClickHandler}
			/> */}

			{isEmptyLayout && <EmptyWidget />}
		</>
	);
}

export default memo(GridCardGraph);
