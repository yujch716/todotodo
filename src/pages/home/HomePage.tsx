import AppSidebar from "@/pages/home/sidebar/AppSidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { useSearchParams } from "react-router-dom";
import Checklist from "@/pages/home/checklist/Checklist.tsx";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectChecklist = (id: string) => {
    setSearchParams({ id: String(id) });
  };

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SidebarTrigger />
        <AppSidebar selectedId={selectedId} onSelect={handleSelectChecklist} />
        <main className="flex-1">
          <Checklist />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default HomePage;
