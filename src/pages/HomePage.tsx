import ChecklistDetail from "../components/Checklist/ChecklistDetail.tsx";
import HomeSidebar from "@/components/HomeSidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { useSearchParams } from "react-router-dom";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectChecklist = (id: number) => {
    setSearchParams({ id: String(id) });
  };

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SidebarTrigger />
        <HomeSidebar
          selectedId={selectedId ? Number(selectedId) : null}
          onSelect={handleSelectChecklist}
        />
        <main className="flex-1">
          <ChecklistDetail />
        </main>
      </SidebarProvider>
    </div>
  );
}
