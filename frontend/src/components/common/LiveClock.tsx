import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
      <Clock className="h-5 w-5 text-blue-400" />

      <div className="text-right">
        <p className="text-sm font-semibold text-white">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>

        <p className="text-xs text-slate-400">
          {time.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default LiveClock;