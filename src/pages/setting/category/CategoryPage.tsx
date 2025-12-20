import SettingSidebar from "@/pages/setting/SettingSidebar.tsx";
import CategoryPanel from "@/pages/setting/category/CategoryPanel.tsx";

const CategoryPage = () => {
  return (
    <div className="flex h-full w-full relative">
      <SettingSidebar />

      <div className="flex flex-1 justify-center py-6">
        <div className="w-full max-w-3xl">
          <CategoryPanel />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
