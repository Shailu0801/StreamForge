export interface BackendMetrics {
  status: string;
  service: string;
  total_events: number;
  average_temperature: number;
  average_speed: number;
  average_fuel: number;
}

export async function getMetrics(): Promise<BackendMetrics> {
  const response = await fetch("http://127.0.0.1:8000/metrics");

  if (!response.ok) {
    throw new Error("Failed to fetch backend metrics");
  }

  return response.json();
}