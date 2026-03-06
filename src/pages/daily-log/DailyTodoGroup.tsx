import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  MoreHorizontal,
  Plus,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  SquarePlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useState, useEffect, useRef } from "react";
import DailyTodoItem from "./DailyTodoItem.tsx";
import type { DailyTodoGroupType, DailyTodoType } from "@/types/daily-log.ts";
import {
  createDailyTodo,
  updateDailyTodoContent,
  deleteDailyTodo,
  toggleDailyTodo,
} from "@/api/daily-todo.ts";
import {
  updateDailyTodoGroup,
  deleteDailyTodoGroup,
} from "@/api/daily-todo-group.ts";
import { toast } from "sonner";

interface Props {
  group: DailyTodoGroupType;
  onUpdate: () => void;
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
}

const DailyTodoGroup = ({
  group,
  onUpdate,
  editingItemId,
  setEditingItemId,
}: Props) => {
  const [todos, setTodos] = useState<DailyTodoType[]>(group.todos || []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(group.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // 그룹의 todos가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setTodos(group.todos || []);
  }, [group.todos]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = async () => {
    if (title.trim() === "") {
      setTitle(group.title);
      setIsEditingTitle(false);
      return;
    }

    const success = await updateDailyTodoGroup(group.id, {
      title: title.trim(),
    });
    if (success) {
      onUpdate();
    } else {
      setTitle(group.title);
    }
    setIsEditingTitle(false);
  };

  const handleDeleteGroup = async () => {
    if (todos.length > 0) {
      toast.error(
        "투두가 있는 그룹은 삭제할 수 없습니다. 먼저 투두를 모두 삭제해주세요.",
      );
      return;
    }

    const success = await deleteDailyTodoGroup(group.id);
    if (success) {
      onUpdate();
    }
  };

  const handleAddTodo = async () => {
    const newTodo = await createDailyTodo(group.daily_log_id, group.id, "");
    if (newTodo) {
      setTodos((prev) => [...prev, newTodo]);
      setEditingItemId(newTodo.id);
      onUpdate();
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newChecked = !todo.is_checked;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_checked: newChecked } : t)),
    );

    const success = await toggleDailyTodo(id, newChecked);
    if (success) {
      onUpdate();
    } else {
      // 실패시 롤백
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_checked: !newChecked } : t)),
      );
    }
  };

  const handleUpdateTodoContent = async (id: string, newContent: string) => {
    if (newContent.trim() === "") {
      const success = await deleteDailyTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        onUpdate();
      }
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, content: newContent } : todo,
      ),
    );

    const success = await updateDailyTodoContent(id, newContent);
    if (!success) {
      // 실패시 롤백
      setTodos(group.todos || []);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-grow">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {isCollapsed ? (
              <Folder className="w-4 h-4 text-blue-600" />
            ) : (
              <FolderOpen className="w-4 h-4 text-blue-600" />
            )}

            {isEditingTitle ? (
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleSave();
                  }
                  if (e.key === "Escape") {
                    setTitle(group.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="text-sm font-medium h-6 border-0 p-0 focus-visible:ring-0"
              />
            ) : (
              <span
                className="text-sm font-medium cursor-pointer hover:text-blue-600"
                onClick={() => setIsEditingTitle(true)}
              >
                {group.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddTodo}>
                  <Plus /> 투두 추가
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  그룹명 수정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleDeleteGroup}
                >
                  그룹 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {todos.map((todo) => (
              <DailyTodoItem
                key={todo.id}
                item={todo}
                onToggle={handleToggleTodo}
                onUpdateContent={handleUpdateTodoContent}
                isEditing={editingItemId === todo.id}
                setEditingItemId={setEditingItemId}
                onAddEmptyItem={handleAddTodo}
              />
            ))}

            {todos.length === 0 && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleAddTodo}
                >
                  <SquarePlus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DailyTodoGroup;
