import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/types/category.ts";
import { createCategory, getCategory } from "@/api/category.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Plus, Tag } from "lucide-react";
import ColorPicker from "@/components/ColorPicker.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useCategoryStore } from "@/store/categoryStore.ts";
import CategoryItem from "@/pages/setting/category/CategoryItem.tsx";
import { ItemGroup } from "@/components/ui/item.tsx";

const CategoryPanel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#fecaca");

  const triggerCalendarCategoryRefresh = useCategoryStore(
    (state) => state.triggerCategoryRefresh,
  );

  const refreshCalendarCategory = useCategoryStore(
    (state) => state.refreshCategory,
  );
  const resetCalendarCategoryRefresh = useCategoryStore(
    (state) => state.resetCategoryRefresh,
  );

  const loadCategories = useCallback(async () => {
    const data = await getCategory();
    setCategories(data);
  }, []);

  const handleCreate = async () => {
    console.log("handleCreate called");
    if (!name.trim()) return;
    const finalColor = color === "#000000" ? "#fecaca" : color;

    await createCategory(name, finalColor);

    triggerCalendarCategoryRefresh();

    setName("");
    setColor("#000000");
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (refreshCalendarCategory) {
      loadCategories();
      resetCalendarCategoryRefresh();
    }
  }, [refreshCalendarCategory, loadCategories, resetCalendarCategoryRefresh]);

  return (
    <>
      <Card className="flex flex-col h-full w-full overflow-hidden shadow-lg border-1">
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center gap-2">
              <Tag /> Category
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden">
          <Card className="flex items-center space-x-2 p-4 mb-6">
            <ColorPicker
              value={color}
              onChange={(newColor) => {
                setColor(newColor);
              }}
            />
            <Input
              placeholder="예: 업무, 개인"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreate} className="h-10">
              <Plus className="w-4 h-4" />
            </Button>
          </Card>

          <ScrollArea className="flex h-full rounded-md border p-4 bg-white">
            <ItemGroup className="gap-4">
              {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </ItemGroup>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};
export default CategoryPanel;
