import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import { useEffect, useState } from "react";
import type { CalendarCategory } from "@/types/calendar-category.ts";
import {
  createCalendarCategory,
  deleteCalendarCategory,
  getCalendarCategory,
  updateCalendarCategory,
} from "@/api/calendar-category.ts";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Pencil, Plus, Save, Tag, X } from "lucide-react";
import ColorPicker from "@/components/ColorPicker.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useCalendarCategoryStore } from "@/store/calendarCategoryStore.ts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CalendarCategoryManager = ({ open, onOpenChange }: Props) => {
  const [categories, setCategories] = useState<CalendarCategory[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#fca5a5");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#fca5a5");

  const triggerCalendarCategoryRefresh = useCalendarCategoryStore(
    (state) => state.triggerCalendarCategoryRefresh,
  );

  const fetchCategories = async () => {
    const data = await getCalendarCategory();
    setCategories(data);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    const finalColor = color === "#000000" ? "#fca5a5" : color;

    await createCalendarCategory(name, finalColor);

    triggerCalendarCategoryRefresh();

    setName("");
    setColor("#000000");

    await fetchCategories();
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!editName.trim()) return;

    await updateCalendarCategory(editingId, editName, editColor);

    triggerCalendarCategoryRefresh();

    setEditingId(null);
    setEditName("");
    setEditColor("#fca5a5");

    await fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await deleteCalendarCategory(id);

    triggerCalendarCategoryRefresh();

    await fetchCategories();
  };

  const startEditing = (category: CalendarCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setEditName("");
      setEditColor("#fca5a5");
    } else {
      fetchCategories();
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Calendar Category</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Card className="flex items-center space-x-2 p-4 my-6">
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

        <ScrollArea className="h-[500px] rounded-md border p-4 bg-white">
          <h2 className="flex items-center gap-2 my-3">
            {" "}
            <Tag /> Category{" "}
          </h2>
          <div className="h-4" />
          {categories.map((category) => (
            <Card key={category.id} className="w-full p-2 mb-2 shadow-sm">
              <div className="flex items-center gap-2 mx-2">
                {editingId === category.id ? (
                  <>
                    <ColorPicker value={editColor} onChange={setEditColor} />
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={handleUpdate}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis block max-w-[150px]">
                      {category.name}
                    </span>
                    <div className="ml-auto flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(category)}
                      >
                        <Pencil className="w-4 h-4 cursor-pointer" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
export default CalendarCategoryManager;
