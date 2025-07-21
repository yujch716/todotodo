import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button"; // shardcn Button 경로 맞게 조정

interface TextStyleButtonsProps {
  editor: Editor | null;
}

const TextStyleButtons = ({ editor }: TextStyleButtonsProps) => {
  if (!editor) return null;

  const styles = [
    {
      name: "bold",
      icon: <Bold size={18} />,
      toggle: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: "italic",
      icon: <Italic size={18} />,
      toggle: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "strike",
      icon: <Strikethrough size={18} />,
      toggle: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: "underline",
      icon: <UnderlineIcon size={18} />,
      toggle: () => editor.chain().focus().toggleUnderline().run(),
    },
  ];

  return (
    <div className="flex">
      {styles.map(({ name, icon, toggle }) => (
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

export default TextStyleButtons;
