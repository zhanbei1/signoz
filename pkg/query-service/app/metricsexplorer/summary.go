package metricsexplorer

import (
	"context"
	"encoding/json"
	"sort"
	"time"

	"go.uber.org/zap"

	"go.signoz.io/signoz/pkg/query-service/app/dashboards"
	"go.signoz.io/signoz/pkg/query-service/interfaces"
	"go.signoz.io/signoz/pkg/query-service/model"
	"go.signoz.io/signoz/pkg/query-service/model/metrics_explorer"
	v3 "go.signoz.io/signoz/pkg/query-service/model/v3"
	"golang.org/x/sync/errgroup"
)

type SummaryService struct {
	reader    interfaces.Reader
	querierV2 interfaces.Querier
}

func NewSummaryService(reader interfaces.Reader, querierV2 interfaces.Querier) *SummaryService {
	return &SummaryService{reader: reader, querierV2: querierV2}
}

func (receiver *SummaryService) FilterKeys(ctx context.Context, params *metrics_explorer.FilterKeyRequest) (*metrics_explorer.FilterKeyResponse, *model.ApiError) {
	var response metrics_explorer.FilterKeyResponse
	keys, apiError := receiver.reader.GetAllMetricFilterAttributeKeys(
		ctx,
		params,
		true,
	)
	if apiError != nil {
		return nil, apiError
	}
	response.AttributeKeys = *keys
	var availableColumnFilter []string
	for key := range metrics_explorer.AvailableColumnFilterMap {
		availableColumnFilter = append(availableColumnFilter, key)
	}
	response.MetricColumns = availableColumnFilter
	return &response, nil
}

func (receiver *SummaryService) FilterValues(ctx context.Context, params *metrics_explorer.FilterValueRequest) (*metrics_explorer.FilterValueResponse, *model.ApiError) {
	var response metrics_explorer.FilterValueResponse
	switch params.FilterKey {
	case "metric_name":
		var filterValues []string
		request := v3.AggregateAttributeRequest{DataSource: v3.DataSourceMetrics, SearchText: params.SearchText, Limit: params.Limit}
		attributes, err := receiver.reader.GetMetricAggregateAttributes(ctx, &request, true)
		if err != nil {
			return nil, model.InternalError(err)
		}
		for _, item := range attributes.AttributeKeys {
			filterValues = append(filterValues, item.Key)
		}
		response.FilterValues = filterValues
		return &response, nil
	case "unit":
		attributes, err := receiver.reader.GetAllMetricFilterUnits(ctx, params)
		if err != nil {
			return nil, err
		}
		response.FilterValues = attributes
		return &response, nil
	default:
		attributes, err := receiver.reader.GetAllMetricFilterAttributeValues(ctx, params)
		if err != nil {
			return nil, err
		}
		response.FilterValues = attributes
		return &response, nil
	}
}

func (receiver *SummaryService) GetMetricsSummary(ctx context.Context, metricName string) (metrics_explorer.MetricDetailsDTO, *model.ApiError) {
	var metricDetailsDTO metrics_explorer.MetricDetailsDTO
	g, ctx := errgroup.WithContext(ctx)

	// Call 1: GetMetricMetadata
	g.Go(func() error {
		metadata, err := receiver.reader.GetMetricMetadata(ctx, metricName, metricName)
		if err != nil {
			return &model.ApiError{Typ: "ClickHouseError", Err: err}
		}
		metricDetailsDTO.Name = metricName
		metricDetailsDTO.Unit = metadata.Unit
		metricDetailsDTO.Description = metadata.Description
		metricDetailsDTO.Type = metadata.Type
		metricDetailsDTO.Metadata.MetricType = metadata.Type
		metricDetailsDTO.Metadata.Description = metadata.Description
		metricDetailsDTO.Metadata.Unit = metadata.Unit
		return nil
	})

	// Call 2: GetMetricsDataPointsAndLastReceived
	g.Go(func() error {
		dataPoints, lastReceived, err := receiver.reader.GetMetricsDataPointsAndLastReceived(ctx, metricName)
		if err != nil {
			return err
		}
		metricDetailsDTO.DataPoints = dataPoints
		metricDetailsDTO.LastReceived = lastReceived
		return nil
	})

	// Call 3: GetTotalTimeSeriesForMetricName
	g.Go(func() error {
		totalSeries, err := receiver.reader.GetTotalTimeSeriesForMetricName(ctx, metricName)
		if err != nil {
			return err
		}
		metricDetailsDTO.TimeSeriesTotal = totalSeries
		return nil
	})

	// Call 4: GetActiveTimeSeriesForMetricName
	g.Go(func() error {
		activeSeries, err := receiver.reader.GetActiveTimeSeriesForMetricName(ctx, metricName, 120*time.Minute)
		if err != nil {
			return err
		}
		metricDetailsDTO.TimeSeriesActive = activeSeries
		return nil
	})

	// Call 5: GetAttributesForMetricName
	g.Go(func() error {
		attributes, err := receiver.reader.GetAttributesForMetricName(ctx, metricName)
		if err != nil {
			return err
		}
		if attributes != nil {
			metricDetailsDTO.Attributes = *attributes
		}
		return nil
	})

	// Call 6: GetDashboardsWithMetricName
	g.Go(func() error {
		data, err := dashboards.GetDashboardsWithMetricName(ctx, metricName)
		if err != nil {
			return err
		}
		if data != nil {
			jsonData, err := json.Marshal(data)
			if err != nil {
				zap.L().Error("Error marshalling data:", zap.Error(err))
				return &model.ApiError{Typ: "MarshallingErr", Err: err}
			}

			var dashboards []metrics_explorer.Dashboard
			err = json.Unmarshal(jsonData, &dashboards)
			if err != nil {
				zap.L().Error("Error unmarshalling data:", zap.Error(err))
				return &model.ApiError{Typ: "UnMarshallingErr", Err: err}
			}
			metricDetailsDTO.Dashboards = dashboards
		}
		return nil
	})

	// Wait for all goroutines and handle any errors
	if err := g.Wait(); err != nil {
		// Type assert to check if it's already an ApiError
		if apiErr, ok := err.(*model.ApiError); ok {
			return metrics_explorer.MetricDetailsDTO{}, apiErr
		}
		// If it's not an ApiError, wrap it in one
		return metrics_explorer.MetricDetailsDTO{}, &model.ApiError{Typ: "InternalError", Err: err}
	}

	return metricDetailsDTO, nil
}

func (receiver *SummaryService) ListMetricsWithSummary(ctx context.Context, params *metrics_explorer.SummaryListMetricsRequest) (*metrics_explorer.SummaryListMetricsResponse, *model.ApiError) {
	return receiver.reader.ListSummaryMetrics(ctx, params)
}

func (receiver *SummaryService) GetMetricsTreemap(ctx context.Context, params *metrics_explorer.TreeMapMetricsRequest) (*metrics_explorer.TreeMap, *model.ApiError) {
	var response metrics_explorer.TreeMap
	switch params.Treemap {
	case metrics_explorer.CardinalityTreeMap:
		cardinality, apiError := receiver.reader.GetMetricsTimeSeriesPercentage(ctx, params)
		if apiError != nil {
			return nil, apiError
		}
		response.Cardinality = *cardinality
		return &response, nil
	case metrics_explorer.DataPointsTreeMap:
		dataPoints, apiError := receiver.reader.GetMetricsSamplesPercentage(ctx, params)
		if apiError != nil {
			return nil, apiError
		}
		response.DataPoints = *dataPoints
		return &response, nil
	default:
		return nil, nil
	}
}

func (receiver *SummaryService) GetRelatedMetrics(ctx context.Context, params *metrics_explorer.RelatedMetricsRequest) (*metrics_explorer.RelatedMetricsResponse, *model.ApiError) {
	var relatedMetricsResponse metrics_explorer.RelatedMetricsResponse
	nameScores := map[string]float64{}
	attributeScores := map[string]float64{}
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		var err error
		nameScores, err = receiver.reader.GetNameSimilarityMetrics(ctx, params.CurrentMetricName, params.Start, params.End)
		return err
	})
	g.Go(func() error {
		var err error
		attributeScores, err = receiver.reader.GetAttributeKeyValueScoreForMetrics(ctx, params.CurrentMetricName, params.Start, params.End)
		return err
	})

	// Wait for both goroutines to finish
	if err := g.Wait(); err != nil {
		return nil, &model.ApiError{Typ: "Error", Err: err}
	}
	finalScores := make(map[string]float64)

	// Add name similarity scores
	for metric, score := range nameScores {
		finalScores[metric] = score * .5 // Weight by x
	}

	// Add attribute similarity scores
	for metric, score := range attributeScores {
		if _, exists := finalScores[metric]; exists {
			finalScores[metric] += score * .5 // Weight by y
		} else {
			finalScores[metric] = score * .5 // If not already present, just add it
		}
	}

	// Sort the final scores
	type metricScore struct {
		Name  string
		Score float64
	}

	var sortedScores []metricScore
	for name, score := range finalScores {
		sortedScores = append(sortedScores, metricScore{Name: name, Score: score})
	}

	sort.Slice(sortedScores, func(i, j int) bool {
		return sortedScores[i].Score > sortedScores[j].Score // Sort descending
	})

	// Create a final sorted map
	finalSortedMap := make(map[string]float64)
	var metricNames []string
	for _, item := range sortedScores {
		finalSortedMap[item.Name] = item.Score
		metricNames = append(metricNames, item.Name)
	}

	dashboardsInfo, err := dashboards.GetDashboardsWithMetricNames(ctx, metricNames)
	if err != nil {
		return nil, err
	}

	for _, metricName := range sortedScores {
		dashboards := make([]metrics_explorer.Dashboard, 0)

		for _, dashInfo := range dashboardsInfo[metricName.Name] {
			dashboards = append(dashboards, metrics_explorer.Dashboard{
				DashboardName: dashInfo["dashboard_title"],
				DashboardID:   dashInfo["dashboard_id"],
				WidgetID:      dashInfo["widget_id"],
				WidgetName:    dashInfo["widget_title"],
			})
		}

		relatedMetric := metrics_explorer.RelatedMetrics{
			Name:       metricName.Name,
			Dashboards: dashboards,
		}

		relatedMetricsResponse.RelatedMetrics = append(relatedMetricsResponse.RelatedMetrics, relatedMetric)
	}

	return &relatedMetricsResponse, nil

}
