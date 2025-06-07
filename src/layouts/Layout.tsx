import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import SiteHeader from "@/pages/home/SiteHeader.tsx";

const Layout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectChecklist = (id: string) => {
    navigate(`/checklist?id=${id}`);
  };

  return (
    <div className="flex h-screen w-screen bg-sky-100 relative">
      <div className="absolute inset-0 bg-sky-100" />
      <SidebarProvider>
        <AppSidebar selectedId={selectedId} onSelect={handleSelectChecklist} />
        <SidebarInset className="flex flex-col h-full">
          <header>
            <SiteHeader />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
