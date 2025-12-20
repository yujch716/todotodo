import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import SiteHeader from "@/pages/home/SiteHeader.tsx";

const Layout = () => {
  return (
    <div className="flex w-screen h-screen max-w-screen overflow-hidden bg-sky-100 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-sky-100" />
      <SidebarProvider>
        <div className="flex h-full w-full overflow-hidden">
          <AppSidebar/>
          <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden border-l-2 border-sky-100 bg-gradient-to-br from-slate-50 to-sky-50">
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
