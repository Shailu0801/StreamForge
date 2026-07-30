import type { LucideIcon } from "lucide-react";

export interface Metric {
  title: string;
  value: number;
  suffix?: string;
  status: string;
  icon: LucideIcon;
}