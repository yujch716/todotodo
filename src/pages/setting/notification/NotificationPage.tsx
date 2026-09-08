import NotificationPanel from "@/pages/setting/notification/NotificationPanel.tsx";

const NotificationPage = () => {
  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex flex-1 min-h-0 justify-center">
        <div className="w-full max-w-3xl">
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
