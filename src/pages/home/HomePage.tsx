import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { useSearchParams } from "react-router-dom";
import DailyLog from "@/pages/daily-log/DailyLog.tsx";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectDailyLog = (id: string) => {
    setSearchParams({ id: String(id) });
  };

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar selectedId={selectedId} onSelect={handleSelectDailyLog} />
        <main className="flex-1">
          <DailyLog />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default HomePage;
