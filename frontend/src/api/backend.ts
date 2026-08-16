const API_BASE_URL = "http://127.0.0.1:8000";

export interface Metrics {
  status: string;
  service: string;
  total_events: number;
  average_temperature: number;
  average_speed: number;
  average_fuel: number;
}

export interface KafkaHealth {
  status: string;
  brokers: {
    id: number;
    host: string;
    port: number;
  }[];
  topics: number;
  topic_names: string[];
  partitions: number;
}

export interface BackendStatus {
  backend: string;
  database: string;
  kafka: string;
  consumer: string;
  service: string;
  api_version: string;
}

export interface EventChartPoint {
  time: string;
  events: number;
}


// ============================================================
// PROMETHEUS METRICS
// ============================================================

export interface PrometheusMetrics {
  status: string;
  events_processed: number;
  events_per_second: number;
  processing_lag: number;
  processing_errors: number;
  consumer_running: number;
}


// ============================================================
// DATABASE METRICS
// ============================================================

export async function getMetrics(): Promise<Metrics> {
  const response = await fetch(
    `${API_BASE_URL}/metrics`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch metrics"
    );
  }

  return response.json();
}


// ============================================================
// KAFKA HEALTH
// ============================================================

export async function getKafkaHealth(): Promise<KafkaHealth> {
  const response = await fetch(
    `${API_BASE_URL}/kafka-health`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch Kafka health"
    );
  }

  return response.json();
}


// ============================================================
// BACKEND STATUS
// ============================================================

export async function getBackendStatus(): Promise<BackendStatus> {
  const response = await fetch(
    `${API_BASE_URL}/status`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch backend status"
    );
  }

  return response.json();
}


// ============================================================
// EVENT CHART
// ============================================================

export async function getEventChart(): Promise<EventChartPoint[]> {
  const response = await fetch(
    `${API_BASE_URL}/events/chart`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch event chart"
    );
  }

  return response.json();
}


// ============================================================
// PROMETHEUS METRICS
// ============================================================

export async function getPrometheusMetrics(): Promise<PrometheusMetrics> {
  const response = await fetch(
    `${API_BASE_URL}/prometheus`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch Prometheus metrics"
    );
  }

  return response.json();
}