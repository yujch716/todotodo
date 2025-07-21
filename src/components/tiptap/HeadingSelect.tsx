import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Heading1, Heading2, Heading3, Type } from "lucide-react";
import { Editor } from "@tiptap/core";

interface HeadingSelectProps {
  heading: string;
  setHeading: (value: string) => void;
  editor: Editor;
}

const HeadingSelect: React.FC<HeadingSelectProps> = ({
  heading,
  setHeading,
  editor,
}) => {
  return (
    <Select
      value={heading}
      onValueChange={(value) => {
        if (value === "paragraph") {
          editor.chain().focus().setParagraph().run();
        } else {
          editor
            .chain()
            .focus()
            .toggleHeading({ level: Number(value) as 1 | 2 | 3 })
            .run();
        }
        setHeading(value);
      }}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="서식" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="paragraph"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Type size={18} />
        </SelectItem>
        <SelectItem
          value="1"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Heading1 size={18} />
        </SelectItem>
        <SelectItem
          value="2"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Heading2 size={18} />
        </SelectItem>
        <SelectItem
          value="3"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Heading3 size={18} />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
export default HeadingSelect;
