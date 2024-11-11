import './HostMetricsDetail.styles.scss';

import { Color, Spacing } from '@signozhq/design-tokens';
import {
	Button,
	Divider,
	Drawer,
	Progress,
	Radio,
	Tag,
	Typography,
} from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import { QueryParams } from 'constants/query';
import {
	initialQueryBuilderFormValuesMap,
	initialQueryState,
} from 'constants/queryBuilder';
import ROUTES from 'constants/routes';
import {
	CustomTimeType,
	Time,
} from 'container/TopNav/DateTimeSelectionV2/config';
import { useIsDarkMode } from 'hooks/useDarkMode';
import useUrlQuery from 'hooks/useUrlQuery';
import GetMinMax from 'lib/getMinMax';
import {
	BarChart2,
	ChevronsLeftRight,
	Compass,
	DraftingCompass,
	Package2,
	ScrollText,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppState } from 'store/reducers';
import { DataTypes } from 'types/api/queryBuilder/queryAutocompleteResponse';
import { IBuilderQuery } from 'types/api/queryBuilder/queryBuilderData';
import { GlobalReducer } from 'types/reducer/globalTime';
import { v4 as uuidv4 } from 'uuid';

import { VIEW_TYPES, VIEWS } from './constants';
import Containers from './Containers';
import { HostDetailProps } from './HostMetricDetail.interfaces';
import HostMetricLogsDetailedView from './HostMetricsLogs/HostMetricLogsDetailedView';
import HostMetricTraces from './HostMetricTraces/HostMetricTraces';
import Metrics from './Metrics/Metrics';
import Processes from './Processes';

// eslint-disable-next-line sonarjs/cognitive-complexity
function HostMetricDetail({
	host,
	onClose,
	isModalTimeSelection,
}: HostDetailProps): JSX.Element {
	const { maxTime, minTime } = useSelector<AppState, GlobalReducer>(
		(state) => state.globalTime,
	);

	const startMs = useMemo(() => Math.floor(Number(minTime) / 1000000000), [
		minTime,
	]);
	const endMs = useMemo(() => Math.floor(Number(maxTime) / 1000000000), [
		maxTime,
	]);

	const timeRange = useMemo(
		() => ({
			startTime: startMs * 1000,
			endTime: endMs * 1000,
		}),
		[startMs, endMs],
	);

	const urlQuery = useUrlQuery();

	const [modalTimeRange, setModalTimeRange] = useState(timeRange);
	const [selectedInterval, setSelectedInterval] = useState<Time>(
		urlQuery.get(QueryParams.relativeTime) as Time,
	);

	const [selectedView, setSelectedView] = useState<VIEWS>(VIEWS.METRICS);
	const isDarkMode = useIsDarkMode();
	const history = useHistory();

	const initialFilters = useMemo(
		() => ({
			op: 'AND',
			items: [
				{
					id: uuidv4(),
					key: {
						key: 'host.name',
						dataType: DataTypes.String,
						type: 'resource',
						isColumn: false,
						isJSON: false,
						id: 'host.name--string--resource--false',
					},
					op: '=',
					value: host?.hostName || '',
				},
			],
		}),
		[host?.hostName],
	);

	const [logFilters, setLogFilters] = useState<IBuilderQuery['filters']>(
		initialFilters,
	);
	const [tracesFilters, setTracesFilters] = useState<IBuilderQuery['filters']>(
		initialFilters,
	);

	// Update filters when initialFilters changes
	useEffect(() => {
		setLogFilters(initialFilters);
		setTracesFilters(initialFilters);
	}, [initialFilters]);

	const handleModeChange = (e: RadioChangeEvent): void => {
		setSelectedView(e.target.value);
	};

	const handleTimeChange = useCallback(
		(interval: Time | CustomTimeType, dateTimeRange?: [number, number]): void => {
			setSelectedInterval(interval as Time);
			if (interval === 'custom' && dateTimeRange) {
				setModalTimeRange({
					startTime: Math.floor(dateTimeRange[0] / 1000),
					endTime: Math.floor(dateTimeRange[1] / 1000),
				});
			} else {
				const { maxTime, minTime } = GetMinMax(interval);
				setModalTimeRange({
					startTime: Math.floor(minTime / 1000000),
					endTime: Math.floor(maxTime / 1000000),
				});
			}
		},
		[],
	);

	const handleChangeLogFilters = useCallback(
		(value: IBuilderQuery['filters']) => {
			setLogFilters((prevFilters) => ({
				op: 'AND',
				items: [...prevFilters.items, ...value.items],
			}));
		},
		[],
	);

	const handleChangeTracesFilters = useCallback(
		(value: IBuilderQuery['filters']) => {
			setTracesFilters((prevFilters) => ({
				op: 'AND',
				items: [...prevFilters.items, ...value.items],
			}));
		},
		[],
	);

	const handleCompassClick = (): void => {
		if (selectedInterval !== 'custom') {
			urlQuery.set(QueryParams.relativeTime, selectedInterval);
		} else {
			urlQuery.delete(QueryParams.relativeTime);
			urlQuery.set(QueryParams.startTime, modalTimeRange.startTime.toString());
			urlQuery.set(QueryParams.endTime, modalTimeRange.endTime.toString());
		}

		if (selectedView === VIEW_TYPES.LOGS) {
			const compositeQuery = {
				...initialQueryState,
				queryType: 'builder',
				builder: {
					...initialQueryState.builder,
					queryData: [
						{
							...initialQueryBuilderFormValuesMap.logs,
							filters: logFilters,
						},
					],
				},
			};

			urlQuery.set('compositeQuery', JSON.stringify(compositeQuery));

			history.push({
				pathname: ROUTES.LOGS_EXPLORER,
				search: urlQuery.toString(),
			});
		} else if (selectedView === VIEW_TYPES.TRACES) {
			const compositeQuery = {
				...initialQueryState,
				queryType: 'builder',
				builder: {
					...initialQueryState.builder,
					queryData: [
						{
							...initialQueryBuilderFormValuesMap.traces,
							filters: tracesFilters,
						},
					],
				},
			};

			urlQuery.set('compositeQuery', JSON.stringify(compositeQuery));

			history.push({
				pathname: ROUTES.TRACES_EXPLORER,
				search: urlQuery.toString(),
			});
		}
	};

	return (
		<Drawer
			width="70%"
			title={
				<>
					<Divider type="vertical" />
					<Typography.Text className="title">{host?.hostName}</Typography.Text>
				</>
			}
			placement="right"
			onClose={onClose}
			open={!!host}
			style={{
				overscrollBehavior: 'contain',
				background: isDarkMode ? Color.BG_INK_400 : Color.BG_VANILLA_100,
			}}
			className="host-detail-drawer"
			destroyOnClose
			closeIcon={<X size={16} style={{ marginTop: Spacing.MARGIN_1 }} />}
		>
			{host && (
				<>
					<div className="host-detail-drawer__host">
						<div className="host-details-grid">
							<div className="labels-row">
								<Typography.Text type="secondary">STATUS</Typography.Text>
								<Typography.Text type="secondary">OPERATING SYSTEM</Typography.Text>
								<Typography.Text type="secondary">CPU USAGE</Typography.Text>
								<Typography.Text type="secondary">MEMORY USAGE</Typography.Text>
							</div>
							<div className="values-row">
								<Tag
									color={host.active ? 'success' : 'default'}
									bordered
									className="infra-monitoring-tags"
								>
									{host.active ? 'ACTIVE' : 'INACTIVE'}
								</Tag>
								<Tag className="infra-monitoring-tags" bordered>
									{host.os}
								</Tag>
								<div className="progress-container">
									<Progress
										percent={Number((host.cpu * 100).toFixed(1))}
										size="small"
										strokeColor={((): string => {
											const cpuPercent = Number((host.cpu * 100).toFixed(1));
											if (cpuPercent >= 90) return Color.BG_SAKURA_500;
											if (cpuPercent >= 60) return Color.BG_AMBER_500;
											return Color.BG_FOREST_500;
										})()}
										className="progress-bar"
									/>
								</div>
								<div className="progress-container">
									<Progress
										percent={Number((host.memory * 100).toFixed(1))}
										size="small"
										strokeColor={((): string => {
											const memoryPercent = Number((host.memory * 100).toFixed(1));
											if (memoryPercent >= 90) return Color.BG_CHERRY_500;
											if (memoryPercent >= 60) return Color.BG_AMBER_500;
											return Color.BG_FOREST_500;
										})()}
										className="progress-bar"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="views-tabs-container">
						<Radio.Group
							className="views-tabs"
							onChange={handleModeChange}
							value={selectedView}
						>
							<Radio.Button
								className={
									// eslint-disable-next-line sonarjs/no-duplicate-string
									selectedView === VIEW_TYPES.METRICS ? 'selected_view tab' : 'tab'
								}
								value={VIEW_TYPES.METRICS}
							>
								<div className="view-title">
									<BarChart2 size={14} />
									Metrics
								</div>
							</Radio.Button>
							<Radio.Button
								className={
									selectedView === VIEW_TYPES.LOGS ? 'selected_view tab' : 'tab'
								}
								value={VIEW_TYPES.LOGS}
							>
								<div className="view-title">
									<ScrollText size={14} />
									Logs
								</div>
							</Radio.Button>
							<Radio.Button
								className={
									selectedView === VIEW_TYPES.TRACES ? 'selected_view tab' : 'tab'
								}
								value={VIEW_TYPES.TRACES}
							>
								<div className="view-title">
									<DraftingCompass size={14} />
									Traces
								</div>
							</Radio.Button>
							<Radio.Button
								className={
									selectedView === VIEW_TYPES.CONTAINERS ? 'selected_view tab' : 'tab'
								}
								value={VIEW_TYPES.CONTAINERS}
							>
								<div className="view-title">
									<Package2 size={14} />
									Containers
								</div>
							</Radio.Button>
							<Radio.Button
								className={
									selectedView === VIEW_TYPES.PROCESSES ? 'selected_view tab' : 'tab'
								}
								value={VIEW_TYPES.PROCESSES}
							>
								<div className="view-title">
									<ChevronsLeftRight size={14} />
									Processes
								</div>
							</Radio.Button>
						</Radio.Group>

						{(selectedView === VIEW_TYPES.LOGS ||
							selectedView === VIEW_TYPES.TRACES) && (
							<Button
								icon={<Compass size={18} />}
								className="compass-button"
								onClick={handleCompassClick}
							/>
						)}
					</div>

					{selectedView === VIEW_TYPES.CONTAINERS && <Containers />}
					{selectedView === VIEW_TYPES.PROCESSES && <Processes />}
					{selectedView === VIEW_TYPES.METRICS && (
						<Metrics
							hostName={host.hostName}
							timeRange={timeRange}
							isModalTimeSelection={isModalTimeSelection}
						/>
					)}
					{selectedView === VIEW_TYPES.LOGS && (
						<HostMetricLogsDetailedView
							timeRange={modalTimeRange}
							isModalTimeSelection={isModalTimeSelection}
							handleTimeChange={handleTimeChange}
							handleChangeLogFilters={handleChangeLogFilters}
							logFilters={logFilters}
						/>
					)}
					{selectedView === VIEW_TYPES.TRACES && (
						<HostMetricTraces
							timeRange={modalTimeRange}
							isModalTimeSelection={isModalTimeSelection}
							handleTimeChange={handleTimeChange}
							handleChangeTracesFilters={handleChangeTracesFilters}
							tracesFilters={tracesFilters}
						/>
					)}
				</>
			)}
		</Drawer>
	);
}

export default HostMetricDetail;
