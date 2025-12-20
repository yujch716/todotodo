import CategoryPanel from "@/pages/setting/category/CategoryPanel.tsx";

const CategoryPage = () => {
  return (
    <div className="flex flex-row h-full w-full">
      <div className="flex flex-1 min-h-0 justify-center py-6">
        <div className="w-full max-w-3xl">
          <CategoryPanel />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
