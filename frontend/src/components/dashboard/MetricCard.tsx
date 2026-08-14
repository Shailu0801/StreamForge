import type { LucideIcon } from "lucide-react";

interface Metric {
  title: string;
  value: number;
  suffix?: string;
  status: string;
  icon?: LucideIcon;
}

interface MetricCardProps {
  metric: Metric;
}

const MetricCard = ({ metric }: MetricCardProps) => {
  const Icon = metric.icon;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/70
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/40
        hover:shadow-xl
        hover:shadow-blue-500/10
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:bg-blue-500/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {metric.title}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white">
            {metric.value}
            {metric.suffix ?? ""}
          </h2>

          <p
            className={`mt-3 text-sm font-medium ${
              metric.status === "Live"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            ● {metric.status}
          </p>
        </div>

        {/* Icon */}
        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20">
            <Icon size={28} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;