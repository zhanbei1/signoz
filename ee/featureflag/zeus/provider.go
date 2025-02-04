package zeus

import (
	"context"

	"go.signoz.io/signoz/pkg/factory"
	"go.signoz.io/signoz/pkg/featureflag"
)

type Provider struct {
}

func NewFactory() factory.ProviderFactory[featureflag.FeatureFlag, featureflag.Config] {
	return factory.NewProviderFactory(factory.MustNewName("zeus"), New)
}

func New(ctx context.Context, providerSettings factory.ProviderSettings, config featureflag.Config) (featureflag.FeatureFlag, error) {
	return &Provider{}, nil
}

func (p *Provider) GetFeatures(orgId string) []featureflag.Feature {
	// TODO : get the features from zeus
	return basePlanFeatures
}
