import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState, useRef, useEffect } from "react";
import { showCelebration } from "@/lib/effects";
import type { DailyTodoType } from "@/types/daily-log.ts";
import { updateDailyTodoContent } from "@/api/daily-todo.ts";
import { Card } from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import CopyDailyTodoModal from "@/pages/daily-log/CopyDailyTodoModal.tsx";
import MoveDailyTodoModal from "@/pages/daily-log/MoveDailyTodoModal.tsx";

interface Props {
  item: DailyTodoType;
  onToggle: (id: string) => void;
  onUpdateContent: (id: string, newContent: string) => void;
  isEditing: boolean;
  setEditingItemId: (id: string | null) => void;
  onAddEmptyItem: () => void;
}

const DailyTodoItem = ({
  item,
  onToggle,
  onUpdateContent,
  isEditing,
  setEditingItemId,
  onAddEmptyItem,
}: Props) => {
  const [content, setContent] = useState(item.content);

  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (!item.is_checked) {
      showCelebration();
    }

    onToggle(item.id);
  };

  const handleSaveContent = async () => {
    const newContent = content.trim();

    if (newContent === "") {
      setEditingItemId(null);
      return;
    }

    await updateDailyTodoContent(item.id, newContent);

    onUpdateContent(item.id, newContent);
    setEditingItemId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      content.trim() === ""
    ) {
      e.preventDefault();
      onUpdateContent(item.id, "");
    }

    if (e.key === "Enter") {
      handleSaveContent();
      onAddEmptyItem();
      setEditingItemId(null);
    }
  };

  const handleOpenCopyModal = () => {
    setOpenCopyModal(true);
  };

  const handleOpenMoveModal = () => {
    setOpenMoveModal(true);
  };

  return (
    <Card
      className="w-full p-2 shadow-sm hover:shadow-md"
      onClick={() => setEditingItemId(item.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-grow">
          <Checkbox
            checked={item.is_checked}
            onCheckedChange={handleToggle}
            className=" shrink-0"
          />
          <div className="flex-grow">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSaveContent}
                onKeyDown={handleKeyDown}
                className="w-full border-b border-gray-300 focus:outline-none text-sm leading-6"
              />
            ) : (
              <span
                className={`w-full text-sm leading-6 cursor-text ${
                  item.is_checked ? "line-through text-gray-400" : ""
                }`}
              >
                {item.content || "\u00A0"}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="center">
            <DropdownMenuItem onClick={handleOpenCopyModal}>
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenMoveModal}>
              Move
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onUpdateContent(item.id, "")}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openCopyModal && (
        <CopyDailyTodoModal
          content={item.content}
          onClose={() => setOpenCopyModal(false)}
        />
      )}
      {openMoveModal && (
        <MoveDailyTodoModal
          id={item.id}
          content={item.content}
          onClose={() => setOpenMoveModal(false)}
        />
      )}
    </Card>
  );
};

export default DailyTodoItem;
