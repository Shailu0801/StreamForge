import { useEffect, useState } from "react";

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

import {
  getEventChart,
  type EventChartPoint,
} from "../../api/backend";


const EventChart = () => {
  const [chartData, setChartData] = useState<EventChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const loadChartData = async () => {

      try {

        const data = await getEventChart();

        setChartData(data);
        setError("");

      } catch (err) {

        console.error("Event chart error:", err);

        setError("Unable to load event chart");

      } finally {

        setLoading(false);

      }

    };


    loadChartData();


    const interval = setInterval(
      loadChartData,
      5000
    );


    return () => {
      clearInterval(interval);
    };

  }, []);


  const peakRate =
    chartData.length > 0
      ? Math.max(
          ...chartData.map(
            (item) => item.events
          )
        )
      : 0;


  const totalChartEvents =
    chartData.reduce(
      (total, item) =>
        total + item.events,
      0
    );


  const averageRate =
    chartData.length > 0
      ? totalChartEvents /
        chartData.length
      : 0;


  return (
    <Card>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Event Processing Rate
          </h2>

          <p className="text-sm text-slate-400">
            Events processed by time
          </p>

        </div>


        <div className="rounded-lg bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
          Live
        </div>

      </div>


      {loading && chartData.length === 0 ? (

        <div className="flex h-80 items-center justify-center">

          <p className="text-slate-400">
            Loading event data...
          </p>

        </div>

      ) : error ? (

        <div className="flex h-80 items-center justify-center">

          <p className="text-red-400">
            {error}
          </p>

        </div>

      ) : chartData.length === 0 ? (

        <div className="flex h-80 items-center justify-center">

          <p className="text-slate-400">
            No event data available
          </p>

        </div>

      ) : (

        <>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />


                <XAxis
                  dataKey="time"
                  stroke="#94A3B8"
                  tick={{ fontSize: 11 }}
                />


                <YAxis
                  stroke="#94A3B8"
                  allowDecimals={false}
                />


                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />


                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

            <div>

              <p className="text-sm text-slate-400">
                Peak Rate
              </p>

              <h3 className="text-xl font-bold text-white">
                {peakRate}
              </h3>

            </div>


            <div>

              <p className="text-sm text-slate-400">
                Average
              </p>

              <h3 className="text-xl font-bold text-white">
                {averageRate.toFixed(2)}
              </h3>

            </div>


            <div>

              <p className="text-sm text-slate-400">
                Chart Events
              </p>

              <h3 className="text-xl font-bold text-white">
                {totalChartEvents}
              </h3>

            </div>

          </div>

        </>

      )}

    </Card>
  );
};


export default EventChart;