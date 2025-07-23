import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { updateDailyLogMemo } from "@/api/daily-log.ts";
import TiptapToolbar from "@/components/tiptap/TiptapToolbar.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {NotebookPen} from "lucide-react";

interface Props {
  dailyLogId: string;
  memo: string;
  setMemo: (value: string) => void;
}

const MemoPanel = ({ dailyLogId, memo, setMemo }: Props) => {
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [heading, setHeading] = useState("paragraph");

  const memoRef = useRef("");
  const hasUnsavedChanges = useRef(false);

  const updateMemo = useCallback(
    async (newMemo: string) => {
      if (!dailyLogId || !hasUnsavedChanges.current) return;

      try {
        await updateDailyLogMemo(dailyLogId, newMemo);
        hasUnsavedChanges.current = false;
      } catch (error) {
        console.error("메모 저장 실패:", error);
      }
    },
    [dailyLogId],
  );

  const debouncedUpdateMemo = useRef(
    debounce((newMemo: string) => {
      updateMemo(newMemo);
    }, 1000),
  );

  useEffect(() => {
    debouncedUpdateMemo.current = debounce((newMemo: string) => {
      updateMemo(newMemo);
    }, 1000);
  }, [updateMemo]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph", "listItem"] }),
      FontFamily.configure({ types: ["textStyle"] }),
      Color.configure({ types: ["textStyle"] }),
    ],
    content: memo,
    onUpdate({ editor }) {
      const newMemo = editor.getHTML();
      setMemo(newMemo);
      memoRef.current = newMemo;
      hasUnsavedChanges.current = true;
      debouncedUpdateMemo.current(newMemo);
    },
  });

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    editor?.chain().focus().setFontFamily(family).run();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== memo) {
      const { from, to } = editor.state.selection;

      editor.commands.setContent(memo, false);

      setTimeout(() => {
        editor.commands.setTextSelection({ from, to });
      }, 0);
    }
  }, [memo, editor]);

  useEffect(() => {
    const handleBlur = () => {
      if (hasUnsavedChanges.current) {
        updateMemo(memoRef.current);
      }
    };

    window.addEventListener("blur", handleBlur);
    const editorElement = document.querySelector(".tiptap");
    editorElement?.addEventListener("focusout", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
      editorElement?.removeEventListener("focusout", handleBlur);
    };
  }, [updateMemo]);

  if (!editor) return null;

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><NotebookPen />Memo</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          <div className="flex flex-col h-full border rounded-lg overflow-hidden">
            <TiptapToolbar
              editor={editor}
              heading={heading}
              setHeading={setHeading}
              fontFamily={fontFamily}
              handleFontFamilyChange={handleFontFamilyChange}
              textColor={textColor}
              handleColorChange={handleColorChange}
            />

            <div className="flex-grow overflow-y-auto bg-white p-4">
              <EditorContent
                editor={editor}
                className="tiptap prose h-full [&>div]:min-h-full [&>p]:min-h-full [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-1"
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default MemoPanel;
