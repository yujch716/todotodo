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
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Pencil, Plus, Save, X } from "lucide-react";
import ColorPicker from "@/components/ColorPicker.tsx";
import { Card } from "@/components/ui/card.tsx";

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

  const fetchCategories = async () => {
    const data = await getCalendarCategory();
    setCategories(data);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createCalendarCategory(name, color);
    setName("");
    setColor("#000000");
    await fetchCategories();
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!editName.trim()) return;

    await updateCalendarCategory(editingId, editName, editColor);

    setEditingId(null);
    setEditName("");
    setEditColor("#fca5a5");
    await fetchCategories();
  };

  const handleDelete = async (id: string) => {
    await deleteCalendarCategory(id);
    await fetchCategories();
  };

  const startEditing = (category: CalendarCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>캘린더 카테고리 관리</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex items-center space-x-2 my-6">
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
        </div>

        <ScrollArea className="h-[500px] rounded-md border p-4">
          <Label>카테고리</Label>
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
                    <span>{category.name}</span>
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
