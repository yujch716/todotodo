import { Outlet } from "react-router-dom";
import SettingSidebar from "@/pages/setting/SettingSidebar.tsx";

const SettingContentLayout = () => {
  return (
    <div className="flex flex-row flex-1 min-h-0 justify-center">
      <SettingSidebar />
      <div className="flex flex-col flex-1 min-h-0 p-6">
        <Outlet />
      </div>
    </div>
  );
};
export default SettingContentLayout;
