import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import DailyLogPage from "@/pages/daily-log/DailyLogPage.tsx";

const HomePage = () => {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar/>
        <main className="flex-1">
          <DailyLogPage />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default HomePage;
