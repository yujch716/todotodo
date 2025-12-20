import { Outlet } from "react-router-dom";

const SettingContentLayout = () => {
  return (
    <div className="flex flex-col flex-1 justify-center overflow-auto">
      <Outlet />
    </div>
  );
};
export default SettingContentLayout;
