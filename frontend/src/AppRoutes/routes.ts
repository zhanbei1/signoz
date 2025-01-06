import ROUTES from 'constants/routes';
import { RouteProps } from 'react-router-dom';

import {
	AlertHistory,
	AlertOverview,
	AllAlertChannels,
	AllErrors,
	APIKeys,
	BillingPage,
	CreateAlertChannelAlerts,
	CreateNewAlerts,
	CustomDomainSettings,
	DashboardPage,
	DashboardWidget,
	EditAlertChannelsAlerts,
	EditRulesPage,
	ErrorDetails,
	InfrastructureMonitoring,
	IngestionSettings,
	InstalledIntegrations,
	LicensePage,
	ListAllALertsPage,
	LiveLogs,
	Login,
	Logs,
	LogsExplorer,
	LogsIndexToFields,
	LogsSaveViews,
	MessagingQueues,
	MQDetailPage,
	MySettings,
	NewDashboardPage,
	OldLogsExplorer,
	Onboarding,
	OrganizationSettings,
	OrgOnboarding,
	PasswordReset,
	PipelinePage,
	ServiceMapPage,
	ServiceMetricsPage,
	ServicesTablePage,
	ServiceTopLevelOperationsPage,
	SettingsPage,
	ShortcutsPage,
	SignupPage,
	SomethingWentWrong,
	StatusPage,
	SupportPage,
	TraceDetail,
	TraceFilter,
	TracesExplorer,
	TracesSaveViews,
	UnAuthorized,
	UsageExplorerPage,
	WorkspaceBlocked,
	WorkspaceSuspended,
} from './pageComponents';

const routes: AppRoutes[] = [
	{
		component: SignupPage,
		path: ROUTES.SIGN_UP,
		exact: true,
		isPrivate: false,
		key: 'SIGN_UP',
	},
	{
		path: ROUTES.GET_STARTED,
		exact: false,
		component: Onboarding,
		isPrivate: true,
		key: 'GET_STARTED',
	},
	{
		path: ROUTES.ONBOARDING,
		exact: false,
		component: OrgOnboarding,
		isPrivate: true,
		key: 'ONBOARDING',
	},
	{
		component: LogsIndexToFields,
		path: ROUTES.LOGS_INDEX_FIELDS,
		exact: true,
		isPrivate: true,
		key: 'LOGS_INDEX_FIELDS',
	},
	{
		component: ServicesTablePage,
		path: ROUTES.APPLICATION,
		exact: true,
		isPrivate: true,
		key: 'APPLICATION',
	},
	{
		path: ROUTES.SERVICE_METRICS,
		exact: true,
		component: ServiceMetricsPage,
		isPrivate: true,
		key: 'SERVICE_METRICS',
	},
	{
		path: ROUTES.SERVICE_TOP_LEVEL_OPERATIONS,
		exact: true,
		component: ServiceTopLevelOperationsPage,
		isPrivate: true,
		key: 'SERVICE_TOP_LEVEL_OPERATIONS',
	},
	{
		path: ROUTES.SERVICE_MAP,
		component: ServiceMapPage,
		isPrivate: true,
		exact: true,
		key: 'SERVICE_MAP',
	},
	{
		path: ROUTES.LOGS_SAVE_VIEWS,
		component: LogsSaveViews,
		isPrivate: true,
		exact: true,
		key: 'LOGS_SAVE_VIEWS',
	},
	{
		path: ROUTES.TRACE_DETAIL,
		exact: true,
		component: TraceDetail,
		isPrivate: true,
		key: 'TRACE_DETAIL',
	},
	{
		path: ROUTES.SETTINGS,
		exact: true,
		component: SettingsPage,
		isPrivate: true,
		key: 'SETTINGS',
	},
	{
		path: ROUTES.USAGE_EXPLORER,
		exact: true,
		component: UsageExplorerPage,
		isPrivate: true,
		key: 'USAGE_EXPLORER',
	},
	{
		path: ROUTES.ALL_DASHBOARD,
		exact: true,
		component: DashboardPage,
		isPrivate: true,
		key: 'ALL_DASHBOARD',
	},
	{
		path: ROUTES.DASHBOARD,
		exact: true,
		component: NewDashboardPage,
		isPrivate: true,
		key: 'DASHBOARD',
	},
	{
		path: ROUTES.DASHBOARD_WIDGET,
		exact: true,
		component: DashboardWidget,
		isPrivate: true,
		key: 'DASHBOARD_WIDGET',
	},
	{
		path: ROUTES.EDIT_ALERTS,
		exact: true,
		component: EditRulesPage,
		isPrivate: true,
		key: 'EDIT_ALERTS',
	},
	{
		path: ROUTES.LIST_ALL_ALERT,
		exact: true,
		component: ListAllALertsPage,
		isPrivate: true,
		key: 'LIST_ALL_ALERT',
	},
	{
		path: ROUTES.ALERTS_NEW,
		exact: true,
		component: CreateNewAlerts,
		isPrivate: true,
		key: 'ALERTS_NEW',
	},
	{
		path: ROUTES.ALERT_HISTORY,
		exact: true,
		component: AlertHistory,
		isPrivate: true,
		key: 'ALERT_HISTORY',
	},
	{
		path: ROUTES.ALERT_OVERVIEW,
		exact: true,
		component: AlertOverview,
		isPrivate: true,
		key: 'ALERT_OVERVIEW',
	},
	{
		path: ROUTES.TRACE,
		exact: true,
		component: TraceFilter,
		isPrivate: true,
		key: 'TRACE',
	},
	{
		path: ROUTES.TRACES_EXPLORER,
		exact: true,
		component: TracesExplorer,
		isPrivate: true,
		key: 'TRACES_EXPLORER',
	},
	{
		path: ROUTES.TRACES_SAVE_VIEWS,
		exact: true,
		component: TracesSaveViews,
		isPrivate: true,
		key: 'TRACES_SAVE_VIEWS',
	},
	{
		path: ROUTES.CHANNELS_NEW,
		exact: true,
		component: CreateAlertChannelAlerts,
		isPrivate: true,
		key: 'CHANNELS_NEW',
	},
	{
		path: ROUTES.CHANNELS_EDIT,
		exact: true,
		component: EditAlertChannelsAlerts,
		isPrivate: true,
		key: 'CHANNELS_EDIT',
	},
	{
		path: ROUTES.ALL_CHANNELS,
		exact: true,
		component: AllAlertChannels,
		isPrivate: true,
		key: 'ALL_CHANNELS',
	},
	{
		path: ROUTES.ALL_ERROR,
		exact: true,
		isPrivate: true,
		component: AllErrors,
		key: 'ALL_ERROR',
	},
	{
		path: ROUTES.ERROR_DETAIL,
		exact: true,
		component: ErrorDetails,
		isPrivate: true,
		key: 'ERROR_DETAIL',
	},
	{
		path: ROUTES.VERSION,
		exact: true,
		component: StatusPage,
		isPrivate: true,
		key: 'VERSION',
	},
	{
		path: ROUTES.ORG_SETTINGS,
		exact: true,
		component: OrganizationSettings,
		isPrivate: true,
		key: 'ORG_SETTINGS',
	},
	{
		path: ROUTES.INGESTION_SETTINGS,
		exact: true,
		component: IngestionSettings,
		isPrivate: true,
		key: 'INGESTION_SETTINGS',
	},
	{
		path: ROUTES.API_KEYS,
		exact: true,
		component: APIKeys,
		isPrivate: true,
		key: 'API_KEYS',
	},
	{
		path: ROUTES.MY_SETTINGS,
		exact: true,
		component: MySettings,
		isPrivate: true,
		key: 'MY_SETTINGS',
	},
	{
		path: ROUTES.CUSTOM_DOMAIN_SETTINGS,
		exact: true,
		component: CustomDomainSettings,
		isPrivate: true,
		key: 'CUSTOM_DOMAIN_SETTINGS',
	},
	{
		path: ROUTES.LOGS,
		exact: true,
		component: Logs,
		key: 'LOGS',
		isPrivate: true,
	},
	{
		path: ROUTES.LOGS_EXPLORER,
		exact: true,
		component: LogsExplorer,
		key: 'LOGS_EXPLORER',
		isPrivate: true,
	},
	{
		path: ROUTES.OLD_LOGS_EXPLORER,
		exact: true,
		component: OldLogsExplorer,
		key: 'OLD_LOGS_EXPLORER',
		isPrivate: true,
	},
	{
		path: ROUTES.LIVE_LOGS,
		exact: true,
		component: LiveLogs,
		key: 'LIVE_LOGS',
		isPrivate: true,
	},
	{
		path: ROUTES.LOGS_PIPELINES,
		exact: true,
		component: PipelinePage,
		key: 'LOGS_PIPELINES',
		isPrivate: true,
	},
	{
		path: ROUTES.LOGIN,
		exact: true,
		component: Login,
		isPrivate: false,
		key: 'LOGIN',
	},
	{
		path: ROUTES.UN_AUTHORIZED,
		exact: true,
		component: UnAuthorized,
		key: 'UN_AUTHORIZED',
		isPrivate: true,
	},
	{
		path: ROUTES.PASSWORD_RESET,
		exact: true,
		component: PasswordReset,
		key: 'PASSWORD_RESET',
		isPrivate: false,
	},
	{
		path: ROUTES.SOMETHING_WENT_WRONG,
		exact: true,
		component: SomethingWentWrong,
		key: 'SOMETHING_WENT_WRONG',
		isPrivate: false,
	},
	{
		path: ROUTES.BILLING,
		exact: true,
		component: BillingPage,
		key: 'BILLING',
		isPrivate: true,
	},
	{
		path: ROUTES.WORKSPACE_LOCKED,
		exact: true,
		component: WorkspaceBlocked,
		isPrivate: true,
		key: 'WORKSPACE_LOCKED',
	},
	{
		path: ROUTES.WORKSPACE_SUSPENDED,
		exact: true,
		component: WorkspaceSuspended,
		isPrivate: true,
		key: 'WORKSPACE_SUSPENDED',
	},
	{
		path: ROUTES.SHORTCUTS,
		exact: true,
		component: ShortcutsPage,
		isPrivate: true,
		key: 'SHORTCUTS',
	},
	{
		path: ROUTES.INTEGRATIONS,
		exact: true,
		component: InstalledIntegrations,
		isPrivate: true,
		key: 'INTEGRATIONS',
	},
	{
		path: ROUTES.MESSAGING_QUEUES,
		exact: true,
		component: MessagingQueues,
		key: 'MESSAGING_QUEUES',
		isPrivate: true,
	},
	{
		path: ROUTES.MESSAGING_QUEUES_DETAIL,
		exact: true,
		component: MQDetailPage,
		key: 'MESSAGING_QUEUES_DETAIL',
		isPrivate: true,
	},
	{
		path: ROUTES.INFRASTRUCTURE_MONITORING_HOSTS,
		exact: true,
		component: InfrastructureMonitoring,
		key: 'INFRASTRUCTURE_MONITORING_HOSTS',
		isPrivate: true,
	},
];

export const SUPPORT_ROUTE: AppRoutes = {
	path: ROUTES.SUPPORT,
	exact: true,
	component: SupportPage,
	key: 'SUPPORT',
	isPrivate: true,
};

export const LIST_LICENSES: AppRoutes = {
	path: ROUTES.LIST_LICENSES,
	exact: true,
	component: LicensePage,
	isPrivate: true,
	key: 'LIST_LICENSES',
};

export const oldRoutes = [
	'/pipelines',
	'/logs-explorer',
	'/logs-explorer/live',
	'/logs-save-views',
	'/traces-save-views',
	'/settings/access-tokens',
];

export const oldNewRoutesMapping: Record<string, string> = {
	'/pipelines': '/logs/pipelines',
	'/logs-explorer': '/logs/logs-explorer',
	'/logs-explorer/live': '/logs/logs-explorer/live',
	'/logs-save-views': '/logs/saved-views',
	'/traces-save-views': '/traces/saved-views',
	'/settings/access-tokens': '/settings/api-keys',
};

export const ROUTES_NOT_TO_BE_OVERRIDEN: string[] = [
	ROUTES.WORKSPACE_LOCKED,
	ROUTES.WORKSPACE_SUSPENDED,
];

export interface AppRoutes {
	component: RouteProps['component'];
	path: RouteProps['path'];
	exact: RouteProps['exact'];
	isPrivate: boolean;
	key: keyof typeof ROUTES;
}

export default routes;
