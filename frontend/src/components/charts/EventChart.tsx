import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Card from "../common/Card";
import { chartData } from "../../data/chartData";

const EventChart = () => {
  return (
    <Card>

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Event Processing Rate
          </h2>

          <p className="text-slate-400 text-sm">
            Real-time events processed every second
          </p>

        </div>

        <div className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
          Last 24 Hours
        </div>

      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="time"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="events"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <div>

          <p className="text-slate-400 text-sm">
            Peak Rate
          </p>

          <h3 className="text-white text-xl font-bold">
            140K/s
          </h3>

        </div>

        <div>

          <p className="text-slate-400 text-sm">
            Average
          </p>

          <h3 className="text-white text-xl font-bold">
            121K/s
          </h3>

        </div>

        <div>

          <p className="text-slate-400 text-sm">
            Total Events
          </p>

          <h3 className="text-white text-xl font-bold">
            12.4M
          </h3>

        </div>

      </div>

    </Card>
  );
};

export default EventChart;