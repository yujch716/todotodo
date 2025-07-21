import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import type { Editor } from "@tiptap/core";

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
        <button
          key={name}
          onClick={() => editor.chain().focus().setTextAlign(name).run()}
          className={
            editor.isActive({ textAlign: name }) ? "text-blue-500" : ""
          }
          type="button"
          aria-label={`Align ${name}`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};
export default TextAlignButtons;
