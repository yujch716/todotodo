import SettingSidebar from "@/pages/setting/SettingSidebar.tsx";
import CategoryPanel from "@/pages/setting/category/CategoryPanel.tsx";

const CategoryPage = () => {
  return (
    <div className="flex h-full w-full -m-6">
      <SettingSidebar />
      <div className="flex flex-1 overflow-auto py-6 px-10">
        <CategoryPanel />
      </div>
    </div>
  );
};

export default CategoryPage;
