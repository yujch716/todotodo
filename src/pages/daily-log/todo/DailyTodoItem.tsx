import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState, useRef, useEffect } from "react";
import { showCelebration } from "@/lib/effects";
import type { DailyTodoGroupType, DailyTodoType } from "@/types/daily-log.ts";
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
import CopyDailyTodoModal from "@/pages/daily-log/todo/CopyDailyTodoModal.tsx";
import MoveDailyTodoModal from "@/pages/daily-log/todo/MoveDailyTodoModal.tsx";

interface Props {
  item: DailyTodoType;
  group: DailyTodoGroupType;
  isEditing: boolean;

  onToggle: (id: string) => void;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreateNext: (id: string) => Promise<void>;

  setEditingItemId: (id: string | null) => void;
  isLast: boolean;
}

const DailyTodoItem = ({
  item,
  group,
  isEditing,
  onToggle,
  onUpdate,
  onDelete,
  onCreateNext,
  setEditingItemId,
  isLast,
}: Props) => {
  const [content, setContent] = useState(item.content);
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const isSubmittingRef = useRef(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setContent(item.content);
  }, [item.content]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (!item.is_checked) showCelebration();
    onToggle(item.id);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSubmittingRef.current) return;

    if (e.key === "Backspace" && content.trim() === "") {
      e.preventDefault();
      isSubmittingRef.current = true;
      try {
        await onDelete(item.id);
      } finally {
        isSubmittingRef.current = false;
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      isSubmittingRef.current = true;

      try {
        const newContent = content.trim();
        if (newContent !== "") {
          await onUpdate(item.id, newContent);
        }

        if (isLast) {
          await onCreateNext(item.id);
        } else {
          setEditingItemId(null);
        }
      } finally {
        isSubmittingRef.current = false;
      }
    }
  };

  const handleBlur = async () => {
    if (isSubmittingRef.current) return;

    const newContent = content.trim();
    if (newContent === "") return;

    await onUpdate(item.id, newContent);
  };

  return (
    <Card
      className="w-full p-2 shadow-sm hover:shadow-md h-12"
      onClick={() => setEditingItemId(item.id)}
    >
      <div className="flex items-center justify-between gap-2 h-full">
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
                onBlur={handleBlur}
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
            <DropdownMenuItem onClick={() => setOpenCopyModal(true)}>
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenMoveModal(true)}>
              Move
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openCopyModal && (
        <CopyDailyTodoModal
          content={item.content}
          groupTitle={group.title}
          onClose={() => setOpenCopyModal(false)}
        />
      )}
      {openMoveModal && (
        <MoveDailyTodoModal
          id={item.id}
          content={item.content}
          groupTitle={group.title}
          onClose={() => setOpenMoveModal(false)}
        />
      )}
    </Card>
  );
};

export default DailyTodoItem;
