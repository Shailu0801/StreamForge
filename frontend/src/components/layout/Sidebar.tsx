import {
  LayoutDashboard,
  Cpu,
  Database,
  Activity,
  GitBranch,
  Settings,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    icon: Cpu,
    label: "Workers",
  },
  {
    icon: Database,
    label: "Kafka",
  },
  {
    icon: Activity,
    label: "Metrics",
  },
  {
    icon: GitBranch,
    label: "Topology",
  },
  {
    icon: Settings,
    label: "Settings",
  },
];

const Sidebar = ({
  activePage,
  onPageChange,
}: SidebarProps) => {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col min-h-[calc(100vh-64px)]">

      {/* Logo */}
      <div className="px-6 py-8 border-b border-slate-800">
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/20 text-2xl">
            ⚡
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              StreamForge
            </h1>

            <p className="text-sm text-slate-400">
              Distributed Event Processor
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            activePage === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                onPageChange(item.label)
              }
              className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">

        <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3">

          <div>
            <p className="text-sm font-semibold text-white">
              Frontend
            </p>

            <p className="text-xs text-slate-400">
              React + TypeScript
            </p>
          </div>

          <ChevronLeft className="text-slate-500" />

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;