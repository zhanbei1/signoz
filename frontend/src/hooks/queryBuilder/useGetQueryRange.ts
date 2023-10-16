import { REACT_QUERY_KEY } from 'constants/reactQueryKeys';
import {
	GetMetricQueryRange,
	GetQueryResultsProps,
} from 'lib/dashboard/getQueryResults';
import { useMemo } from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { SuccessResponse } from 'types/api';
import { MetricRangePayloadV3 } from 'types/api/metrics/getQueryRange';

type UseGetQueryRange = (
	requestData: GetQueryResultsProps,
	options?: UseQueryOptions<SuccessResponse<MetricRangePayloadV3>, Error>,
) => UseQueryResult<SuccessResponse<MetricRangePayloadV3>, Error>;

export const useGetQueryRange: UseGetQueryRange = (requestData, options) => {
	const queryKey = useMemo(() => {
		if (options?.queryKey) {
			return [...options.queryKey];
		}
		return [REACT_QUERY_KEY.GET_QUERY_RANGE, requestData];
	}, [options?.queryKey, requestData]);

	return useQuery<SuccessResponse<MetricRangePayloadV3>, Error>({
		queryFn: async () => GetMetricQueryRange(requestData),
		...options,
		queryKey,
	});
};
