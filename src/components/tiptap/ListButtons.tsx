import type { Editor } from "@tiptap/core";
import { List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface ListButtonsProps {
  editor: Editor;
}

const ListButtons = ({ editor }: ListButtonsProps) => {
  if (!editor) return null;

  const lists = [
    {
      name: "list",
      icon: <List size={18} />,
      toggle: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "ordered",
      icon: <ListOrdered size={18} />,
      toggle: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="flex gap-1">
      {lists.map(({ name, icon, toggle }) => (
        <Button
          key={name}
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={`
          hover:border-b hover:bg-slate-50
          ${editor.isActive(name) ? "border border-b bg-slate-50" : "border-transparent"}
        `}
          aria-label={name}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
};
export default ListButtons;
