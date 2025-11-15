import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const SiteHeader = () => {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith("/daily")) return "Daily";
    if (location.pathname.startsWith("/calendar")) return "Calendar";
    if (location.pathname.startsWith("/challenge")) return "Challenge";
    if (location.pathname.startsWith("/goal")) return "Goal";
    return "Home";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 p-2">
        <SidebarTrigger
          className="-ml-1"
          hovered={hovered}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getTitle()}</h1>
      </div>
    </header>
  );
};

export default SiteHeader;
