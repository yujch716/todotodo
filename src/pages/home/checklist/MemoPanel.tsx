import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient.ts";
import debounce from "lodash.debounce";

const MemoPanel = () => {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");
  const [memo, setMemo] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  const memoRef = useRef("");
  const hasUnsavedChanges = useRef(false);

  const updateMemo = useCallback(
    async (newMemo: string) => {
      if (!checklistId || !hasUnsavedChanges.current) return;

      const { error } = await supabase
        .from("checklist")
        .update({ memo: newMemo })
        .eq("id", checklistId);

      if (error) {
        console.error("메모 저장 실패:", error.message);
      } else {
        hasUnsavedChanges.current = false;
      }
    },
    [checklistId],
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
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
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

  useEffect(() => {
    if (!checklistId) return;

    const fetchMemo = async () => {
      const { data, error } = await supabase
        .from("checklist")
        .select("memo")
        .eq("id", checklistId)
        .single();

      if (error) {
        console.error("메모 불러오기 실패:", error.message);
        return;
      }

      setMemo(data.memo || "");
      memoRef.current = data.memo || "";
      editor?.commands.setContent(data.memo || "");
    };

    fetchMemo();
  }, [checklistId, editor]);

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
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-2 border-b rounded-t-lg bg-slate-100 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "text-blue-500" : ""}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "text-blue-500" : ""}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "text-blue-500" : ""}
        >
          <Strikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "text-blue-500" : ""}
        >
          <UnderlineIcon size={18} />
        </button>
        <div className="border-l mx-2" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""
          }
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""
          }
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""
          }
        >
          <AlignRight size={18} />
        </button>
        <div className="border-l mx-2" />

        <select
          value={fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value)}
          className="p-1"
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>

        <div className="flex items-center gap-1">
          <span className="text-sm">
            <PaintBucket size={18} />
          </span>
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-6 h-8 p-0 border-0 cursor-pointer"
            title="Text color"
          />
        </div>
      </div>

      <div className="p-4 h-[800px] overflow-y-auto">
        <EditorContent
          editor={editor}
          className="tiptap w-full h-full [&>div]:min-h-full [&>p]:min-h-full"
          style={{ outline: "none", boxShadow: "none" }}
        />
      </div>
    </div>
  );

  function handleFontFamilyChange(family: string) {
    setFontFamily(family);
    editor?.chain().focus().setFontFamily(family).run();
  }

  function handleColorChange(color: string) {
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  }
};

export default MemoPanel;
