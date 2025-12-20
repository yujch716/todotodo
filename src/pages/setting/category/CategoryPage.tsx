import SettingSidebar from "@/pages/setting/SettingSidebar.tsx";
import CategoryPanel from "@/pages/setting/category/CategoryPanel.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PanelLeftOpen } from "lucide-react";

const CategoryPage = () => {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full w-full -m-6 relative">
      <SettingSidebar />

      {isMobile && (
        <Button
          size="icon"
          variant="outline"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="fixed top-1/2 -translate-y-1/2 z-50 bg-background bg-sky-100 border border-sky-300"
        >
          <PanelLeftOpen />
        </Button>
      )}

      <div className="flex flex-1 justify-center overflow-auto py-6 px-10">
        <div className="w-full max-w-3xl">
          <CategoryPanel />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
