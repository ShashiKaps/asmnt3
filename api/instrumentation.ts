// Registers the OpenTelemetry Node SDK (traces + metrics) so Jaeger/Zipkin/Prometheus
// (via otel-collector) receive real data from this service. See Next.js instrumentation hook:
// https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { NodeSDK } = await import("@opentelemetry/sdk-node");
  const { OTLPTraceExporter } = await import("@opentelemetry/exporter-trace-otlp-http");
  const { OTLPMetricExporter } = await import("@opentelemetry/exporter-metrics-otlp-http");
  const { PeriodicExportingMetricReader } = await import("@opentelemetry/sdk-metrics");
  const { HttpInstrumentation } = await import("@opentelemetry/instrumentation-http");
  const { UndiciInstrumentation } = await import("@opentelemetry/instrumentation-undici");
  const { resourceFromAttributes } = await import("@opentelemetry/resources");
  const { ATTR_SERVICE_NAME } = await import("@opentelemetry/semantic-conventions");

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://otel-collector:4318";
  const serviceName = process.env.OTEL_SERVICE_NAME || "phoneme-lab-api";

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName }),
    traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
      exportIntervalMillis: 10000,
    }),
    instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()],
  });

  sdk.start();
}
