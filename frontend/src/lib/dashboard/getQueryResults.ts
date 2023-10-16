/* eslint-disable  */
// @ts-ignore
// @ts-nocheck

import { getMetricsQueryRange } from 'api/metrics/getQueryRange';
import { PANEL_TYPES } from 'constants/queryBuilder';
import { timePreferenceType } from 'container/NewWidget/RightContainer/timeItems';
import { Time } from 'container/TopNav/DateTimeSelection/config';
import { Pagination } from 'hooks/queryPagination';
import { convertNewDataToOld } from 'lib/newQueryBuilder/convertNewDataToOld';
import { isEmpty } from 'lodash-es';
import { SuccessResponse } from 'types/api';
import { MetricRangePayloadProps } from 'types/api/metrics/getQueryRange';
import { Query } from 'types/api/queryBuilder/queryBuilderData';

import { prepareQueryRangePayload } from './prepareQueryRangePayload';

export async function GetMetricQueryRange(
	props: GetQueryResultsProps,
): Promise<SuccessResponse<MetricRangePayloadV3>> {
	const { queryPayload } = prepareQueryRangePayload(props);

	const response = await getMetricsQueryRange(queryPayload);

	if (response.statusCode >= 400) {
		throw new Error(
			`API responded with ${response.statusCode} -  ${response.error}`,
		);
	}
	return response;
}

export interface GetQueryResultsProps {
	query: Query;
	graphType: PANEL_TYPES;
	selectedTime: timePreferenceType;
	globalSelectedInterval: Time;
	variables?: Record<string, unknown>;
	params?: Record<string, unknown>;
	tableParams?: {
		pagination?: Pagination;
		selectColumns?: any;
	};
}
