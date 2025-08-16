import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import SiteHeader from "@/pages/home/SiteHeader.tsx";

const Layout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectDaily = (id: string) => {
    navigate(`/daily?id=${id}`);
  };

  return (
    <div className="flex w-screen h-screen bg-sky-100 relative">
      <div className="absolute inset-0 bg-sky-100" />
      <SidebarProvider>
        <div className="flex h-full w-full">
          <AppSidebar selectedId={selectedId} onSelect={handleSelectDaily} />
          <SidebarInset className="flex flex-col h-full flex-1">
            <header className="flex-shrink-0">
              <SiteHeader />
            </header>
            <main className="flex flex-col flex-1 w-full overflow-auto p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
