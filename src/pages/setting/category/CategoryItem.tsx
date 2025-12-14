import { Button } from "@/components/ui/button.tsx";
import { Pencil, Save, X } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx";
import type { Category } from "@/types/category.ts";
import ColorPicker from "@/components/ColorPicker.tsx";
import { Input } from "@/components/ui/input.tsx";
import { deleteCategory, updateCategory } from "@/api/category.ts";
import { useState } from "react";
import { useCategoryStore } from "@/store/categoryStore.ts";

interface Props {
  category: Category;
}

const CategoryItem = ({ category }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#fecaca");

  const triggerCalendarCategoryRefresh = useCategoryStore(
    (state) => state.triggerCategoryRefresh,
  );

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!editName.trim()) return;

    await updateCategory(editingId, editName, editColor);

    setEditingId(null);
    setEditName("");
    setEditColor("#fecaca");

    triggerCalendarCategoryRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);

    triggerCalendarCategoryRefresh();
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  return (
    <Item variant="outline" role="listitem" className="flex items-center hover:bg-gradient-to-br hover:from-white hover:to-slate-100 ">
      {editingId === category.id ? (
        <>
          <ItemMedia>
            <ColorPicker value={editColor} onChange={setEditColor} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUpdate();
                  }
                }}
              />
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" className="border border-transparent hover:border-slate-300" onClick={handleUpdate}>
              <Save className="w-4 h-4" />
            </Button>
          </ItemActions>
        </>
      ) : (
        <>
          <ItemMedia>
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: category.color }}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{category.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button
              variant="ghost"
              size="icon"
              className="border border-transparent hover:border-slate-300"
              onClick={() => startEditing(category)}
            >
              <Pencil className="w-4 h-4 cursor-pointer" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="border border-transparent hover:border-slate-300"
              onClick={() => handleDelete(category.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </ItemActions>
        </>
      )}
    </Item>
  );
};
export default CategoryItem;
