import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({
  children,
  activePage,
  onPageChange,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar
          activePage={activePage}
          onPageChange={onPageChange}
        />

        <main className="flex-1 p-6 bg-slate-800 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;