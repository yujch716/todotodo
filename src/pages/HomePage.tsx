import HomeSidebar from "@/components/HomeSidebar.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { useSearchParams } from "react-router-dom";
import Main from "@/components/Checklist/Checklist.tsx";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");

  const handleSelectChecklist = (id: string) => {
    setSearchParams({ id: String(id) });
  };

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SidebarTrigger />
        <HomeSidebar selectedId={selectedId} onSelect={handleSelectChecklist} />
        <main className="flex-1">
          <Main />
        </main>
      </SidebarProvider>
    </div>
  );
}
