import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { ArrowLeftIcon, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

const SettingSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="relative min-h-0"
    >
      <SidebarHeader className="px-0 mt-2">
        <SidebarGroupLabel className="gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Go Back"
            onClick={() => navigate("/", { replace: true })}
          >
            <ArrowLeftIcon />
          </Button>
          Options
        </SidebarGroupLabel>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() =>
                    navigate("/setting/category", { replace: true })
                  }
                  isActive={location.pathname === "/setting/category"}
                  className="flex items-center hover:bg-sky-100 p-6 data-[active=true]:bg-sky-100"
                >
                  <Tag className="w-4 h-4" />
                  <span>Category</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SettingSidebar;
