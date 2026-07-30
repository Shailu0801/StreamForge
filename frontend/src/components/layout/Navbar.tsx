import {
  Bell,
  Moon,
  Search,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import LiveClock from "../common/LiveClock";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-8 backdrop-blur-xl">

      {/* Left Section */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="relative w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search workers, topics, brokers..."
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              py-3
              pl-11
              pr-4
              text-sm
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-300
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* System Health */}
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2">
          <ShieldCheck className="h-5 w-5 text-green-400" />

          <span className="text-sm font-medium text-green-400">
            System Healthy
          </span>
        </div>

        {/* Notification */}
        <button
          className="
            relative
            rounded-xl
            bg-slate-900
            p-3
            transition-all
            duration-300
            hover:bg-slate-800
          "
        >
          <Bell className="h-5 w-5 text-slate-300" />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            3
          </span>
        </button>

        {/* Theme Button */}
        <button
          className="
            rounded-xl
            bg-slate-900
            p-3
            transition-all
            duration-300
            hover:bg-slate-800
          "
        >
          <Moon className="h-5 w-5 text-slate-300" />
        </button>

        {/* Live Clock */}
        <LiveClock />

        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 transition hover:border-blue-500/40">

          <UserCircle className="h-10 w-10 text-blue-400" />

          <div>
            <p className="text-sm font-semibold text-white">
              Fidha
            </p>

            <p className="text-xs text-slate-400">
              Frontend Developer
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;