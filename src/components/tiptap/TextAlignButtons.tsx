import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import type { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button.tsx";

interface TextAlignButtonsProps {
  editor: Editor;
}

const TextAlignButtons = ({ editor }: TextAlignButtonsProps) => {
  if (!editor) return null;

  const alignments = [
    { name: "left", icon: <AlignLeft size={18} /> },
    { name: "center", icon: <AlignCenter size={18} /> },
    { name: "right", icon: <AlignRight size={18} /> },
  ];

  return (
    <div className="flex gap-1">
      {alignments.map(({ name, icon }) => (
        <Button
          key={name}
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign(name).run()}
          className={`hover:border-b hover:bg-slate-50
          ${editor.isActive({ textAlign: name }) ? "border border-b bg-slate-50" : "border-transparent"}`}
          type="button"
          aria-label={`Align ${name}`}
        >
          {icon}
        </Button>
      ))}
    </div>
  );
};
export default TextAlignButtons;
