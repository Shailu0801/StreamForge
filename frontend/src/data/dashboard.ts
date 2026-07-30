import {
  Cpu,
  Activity,
  Database,
  ShieldCheck,
} from "lucide-react";

export const metrics = [
  {
    title: "Active Workers",
    value: 24,
    status: "+2 Running",
    icon: Cpu,
  },
  {
    title: "Events / Second",
    value: 124,
    suffix: "K",
    status: "Stable",
    icon: Activity,
  },
  {
    title: "Kafka Topics",
    value: 18,
    status: "Healthy",
    icon: Database,
  },
  {
    title: "Fault Tolerance",
    value: 99.9,
    suffix: "%",
    status: "Operational",
    icon: ShieldCheck,
  },
];