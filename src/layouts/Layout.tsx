import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import HomeSidebar from "@/pages/home/sidebar/HomeSidebar";

const Layout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedId = searchParams.get("id");

    const handleSelectChecklist = (id: string) => {
        navigate(`/checklist?id=${id}`);
    };

    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <SidebarTrigger />
                <HomeSidebar
                    selectedId={selectedId}
                    onSelect={handleSelectChecklist}
                />
                <main className="flex-1">
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    );
};

export default Layout;
