import { PaintBucket } from "lucide-react";
import type { Editor } from "@tiptap/react";

import TextStyleButtons from "./TextStyleButtons";
import HeadingSelect from "./HeadingSelect";
import FontFamilySelect from "./FontFamilySelect";
import TextAlignButtons from "./TextAlignButtons";
import ListButtons from "./ListButtons";

interface Props {
  editor: Editor;
  heading: string;
  setHeading: (value: string) => void;
  fontFamily: string;
  handleFontFamilyChange: (family: string) => void;
  textColor: string;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TiptapToolbar = ({
  editor,
  heading,
  setHeading,
  fontFamily,
  handleFontFamilyChange,
  textColor,
  handleColorChange,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-2 border-b rounded-t-lg bg-slate-100 p-2 shrink-0">
      <TextStyleButtons editor={editor} />
      <div className="border-l mx-2" />

      <HeadingSelect
        heading={heading}
        setHeading={setHeading}
        editor={editor}
      />
      <FontFamilySelect
        fontFamily={fontFamily}
        handleFontFamilyChange={handleFontFamilyChange}
      />
      <div className="border-l mx-2" />

      <TextAlignButtons editor={editor} />
      <div className="border-l mx-2" />

      <ListButtons editor={editor} />
      <div className="border-l mx-2" />

      <div className="flex items-center gap-1">
        <label className="cursor-pointer">
          <PaintBucket size={18} fill={textColor} />
          <input
            type="color"
            value={textColor}
            onChange={handleColorChange}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};

export default TiptapToolbar;
