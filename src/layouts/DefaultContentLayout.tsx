import { Outlet } from "react-router-dom";

const DefaultContentLayout = () => {
  return (
    <div className="flex flex-col flex-1 min-h-full p-6">
      <Outlet />
    </div>
  );
};
export default DefaultContentLayout;
