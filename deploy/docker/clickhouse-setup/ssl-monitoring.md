

SSL certificate expiry and uptime monitoring using SigNoz


## Run blackbox exporter

Run blackbox exporter as a part of the SigNoz deployment. The default configuration is decent enough for most use cases.

```yaml
modules:
  http_2xx:
    prober: http
    http:
     preferred_ip_protocol: ip4
  http_post_2xx:
    prober: http
    http:
      method: POST
  tcp_connect:
    prober: tcp
  pop3s_banner:
    prober: tcp
    tcp:
      query_response:
      - expect: "^+OK"
      tls: true
      tls_config:
        insecure_skip_verify: false
  grpc:
    prober: grpc
    grpc:
      tls: true
      preferred_ip_protocol: "ip4"
  grpc_plain:
    prober: grpc
    grpc:
      tls: false
      service: "service1"
  ssh_banner:
    prober: tcp
    tcp:
      query_response:
      - expect: "^SSH-2.0-"
      - send: "SSH-2.0-blackbox-ssh-check"
  irc_banner:
    prober: tcp
    tcp:
      query_response:
      - send: "NICK prober"
      - send: "USER prober prober prober :prober"
      - expect: "PING :([^ ]+)"
        send: "PONG ${1}"
      - expect: "^:[^ ]+ 001"
  icmp:
    prober: icmp
  icmp_ttl5:
    prober: icmp
    timeout: 5s
    icmp:
      ttl: 5
```


## Configure OTel Collector to scrape metrics from blackbox exporter

Add scrape job for blackbox exporter in the otel-collector-metrics.yaml

Example:
```yaml
- job_name: 'blackbox'
  metrics_path: /probe
  params:
    module: [http_2xx]
  static_configs:
  - targets:
    - https://signoz.io
    - https://google.com
  relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - source_labels: [__param_target]
      target_label: endpoint
    - target_label: __address__
      replacement: blackbox:9115
```

The above scrape job will scrape metrics from the 'blackbox:9115/probe' endpoint of the blackbox exporter. The receiver
sends a request to `blackbox:9115/probe?target=https://example.com&module=http_2xx` for each target in the static
config. The blackbox exporter returns the metrics for the probe.

Note: the `__address__` value is the host:post of the real blackbox exporter used by the receiver.

This will create a bunch of metrics for each target. The metrics are prefixed with `probe_` and have labels like `endpoint`,
`phase`. 

We are interested in the `probe_ssl_earliest_cert_expiry` metric. This metric has a value of the earliest expiry date of the
certificates in the chain. The value is in unix timestamp format. We can use this metric to create a dashboard in SigNoz.

## Create a dashboard in SigNoz

Create a dashboard in SigNoz to monitor the expiry of the certificates. The dashboard will show the earliest expiry date of
the certificates in the chain for each target.

The dashboard will have a value widget to show the earliest expiry date of the certificates in the chain. The widget will
have a filter for the target. The filter will be a dropdown with the list of targets.

```sql
SELECT DISTINCT JSONExtractString(labels, 'endpoint') AS endpoint
FROM signoz_metrics.time_series_v2
WHERE metric_name = 'probe_ssl_earliest_cert_expiry'
```

The above query will return the list of targets. The query will be used to populate the dropdown filter.

PromQL Expression for the value widget:

```bash
probe_ssl_earliest_cert_expiry{endpoint="{{.endpoint}}"} - time()
```

And set the unit to `seconds`.


## Create an alert

Create an alert to notify when the certificate is about to expire. The alert will be triggered when the earliest expiry date
of the certificates in the chain is less than 90 days.

PromQL Expression for the alert:

```
probe_ssl_earliest_cert_expiry{endpoint="{{.endpoint}}"} - time() < 7776000
```

## Uptime monitoring

The blackbox exporter can also be used to monitor the uptime of the targets.

PromQL Expression for the alert:

```
probe_success{endpoint="{{.endpoint}}"} == 0
```
