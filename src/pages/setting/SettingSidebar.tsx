import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { User, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SettingSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar
      side="left"
      variant="floating"
      collapsible="none"
      className="border-r p-2"
    >
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupLabel>Options</SidebarGroupLabel>
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

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/setting/user", { replace: true })}
                  isActive={location.pathname === "/setting/user"}
                  className="flex items-center hover:bg-sky-100 p-6"
                >
                  <User className="w-4 h-4" />
                  <span>User</span>
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
