// Shared metric instruments, used by the API routes to record counts/durations that
// flow through the OTel SDK -> otel-collector -> Prometheus.
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("phoneme-lab-api");

export const generationEventsCounter = meter.createCounter("phoneme_lab_generation_events_total", {
  description: "Count of puzzle-generation attempts, by activityType and status",
});

export const pageViewsCounter = meter.createCounter("phoneme_lab_page_views_total", {
  description: "Count of page views, by page",
});

export const pageViewDurationHistogram = meter.createHistogram("phoneme_lab_page_view_duration_ms", {
  description: "Time spent on a page before navigating away",
  unit: "ms",
});
