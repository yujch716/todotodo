import { useState, useEffect, useCallback, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import TiptapToolbar from "@/components/tiptap/TiptapToolbar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import debounce from "lodash.debounce";
import type { Memo } from "@/types/memo";

interface MemoDetailProps {
  selectedMemo: Memo | null;
  onMemoUpdate: (memoId: string, title: string, content: string) => void;
}

const MemoDetail = ({ selectedMemo, onMemoUpdate }: MemoDetailProps) => {
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [heading, setHeading] = useState("paragraph");
  const [title, setTitle] = useState("");

  const debouncedUpdateMemo = useCallback(
    debounce((memoId: string, title: string, content: string) => {
      onMemoUpdate(memoId, title, content);
    }, 1000),
    [onMemoUpdate],
  );

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
    content: selectedMemo?.content || "",
    onUpdate({ editor }) {
      if (selectedMemo) {
        const newContent = editor.getHTML();
        debouncedUpdateMemo(selectedMemo.id, title, newContent);
      }
    },
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (selectedMemo) {
      const currentContent = editor?.getHTML() || selectedMemo.content;
      debouncedUpdateMemo(selectedMemo.id, newTitle, currentContent);
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    editor?.chain().focus().setFontFamily(family).run();
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  useEffect(() => {
    if (selectedMemo) {
      setTitle(selectedMemo.title);
      if (editor) {
        editor.commands.setContent(selectedMemo.content);
      }
    }
  }, [selectedMemo, editor]);

  useEffect(() => {
    const handleFocusOut = () => {
      if (selectedMemo && editor) {
        const content = editor.getHTML();
        onMemoUpdate(selectedMemo.id, title, content);
      }
    };

    const editorElement = document.querySelector(".tiptap");
    editorElement?.addEventListener("focusout", handleFocusOut);

    return () => {
      editorElement?.removeEventListener("focusout", handleFocusOut);
    };
  }, [selectedMemo, editor, title, onMemoUpdate]);

  return (
    <Card className="flex-1 m-4 ml-0 flex flex-col">
      {selectedMemo ? (
        <>
          <CardHeader className="space-y-3">
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="메모 제목을 입력하세요..."
              className="text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0"
            />
            <div className="text-sm text-gray-500">
              마지막 수정:{" "}
              {format(
                new Date(selectedMemo.updated_at),
                "yyyy년 MM월 dd일 HH:mm",
                { locale: ko },
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {editor && (
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
                <div className="flex-1 overflow-y-auto bg-white">
                  <EditorContent
                    editor={editor}
                    className="tiptap prose h-full p-4 overflow-y-auto [&>div]:min-h-full [&>p]:min-h-full [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-1"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      maxHeight: "100%",
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">메모를 선택해주세요</h3>
            <p className="text-sm">
              왼쪽에서 메모를 선택하거나 새 메모를 만들어보세요.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MemoDetail;
