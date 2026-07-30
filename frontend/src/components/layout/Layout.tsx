import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 bg-slate-800 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;