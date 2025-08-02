import { PaintBucket } from "lucide-react";
import type { Editor } from "@tiptap/react";

import TextStyleButtons from "./TextStyleButtons";
import HeadingSelect from "./HeadingSelect";
import FontFamilySelect from "./FontFamilySelect";
import TextAlignButtons from "./TextAlignButtons";
import ListButtons from "./ListButtons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Separator } from "@/components/ui/separator.tsx";

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
      <Accordion type="single" className="w-full" collapsible>
        <AccordionItem value="item-1" className="w-full border-none">
          <div className="flex items-center w-full gap-2">
            <TextStyleButtons editor={editor} />
            <Separator orientation="vertical" className="h-10 mx-2" />

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

            <div className="ml-auto">
              <AccordionTrigger className="p-1 w-8 h-8 flex items-center justify-center" />
            </div>
          </div>

          <AccordionContent className="flex flex-wrap gap-2 pt-2">
            <HeadingSelect
              heading={heading}
              setHeading={setHeading}
              editor={editor}
            />
            <Separator orientation="vertical" className="h-10 mx-2" />

            <FontFamilySelect
              fontFamily={fontFamily}
              handleFontFamilyChange={handleFontFamilyChange}
            />
            <Separator orientation="vertical" className="h-10 mx-2" />

            <TextAlignButtons editor={editor} />
            <Separator orientation="vertical" className="h-10 mx-2" />

            <ListButtons editor={editor} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TiptapToolbar;
