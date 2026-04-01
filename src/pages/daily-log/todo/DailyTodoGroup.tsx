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
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";

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
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodos(group.todos || []);
  }, [group.todos]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleUpdateTodoGroupTitle = async () => {
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

  const handleDeleteTodoGroup = async () => {
    setIsAlertOpen(true);
  };

  const deleteTodoGroup = async () => {
    setIsAlertOpen(false);

    const success = await deleteDailyTodoGroup(group.id);
    if (success) {
      onUpdate();
    }
  };

  const handleTodoItemToggle = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newChecked = !todo.is_checked;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_checked: newChecked } : t)),
    );

    const success = await toggleDailyTodo(id, newChecked);

    if (!success) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_checked: !newChecked } : t)),
      );
    }
  };

  const handleCreateTodoItem = async () => {
    const newOrderIndex =
      todos.length > 0
        ? Math.max(...todos.map((item) => item.order_index)) + 1
        : 0;

    const newTodo = await createDailyTodo(
      group.daily_log_id,
      group.id,
      newOrderIndex,
      "",
    );
    if (newTodo) {
      setTodos((prev) => [...prev, newTodo]);
      setEditingItemId(newTodo.id);
      onUpdate();
    }
  };

  const handleCreateNextTodoItem = async (currentId: string) => {
    const newOrderIndex =
      todos.length > 0
        ? Math.max(...todos.map((item) => item.order_index)) + 1
        : 0;

    const newTodo = await createDailyTodo(
      group.daily_log_id,
      group.id,
      newOrderIndex,
      "",
    );

    if (!newTodo) return;

    setTodos((prev) => {
      const index = prev.findIndex((t) => t.id === currentId);

      const copy = [...prev];
      copy.splice(index + 1, 0, newTodo);
      return copy;
    });

    setEditingItemId(newTodo.id);
  };

  const handleTodoItemUpdate = async (id: string, content: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, content } : t)));

    const success = await updateDailyTodoContent(id, content);

    if (!success) {
      setTodos(group.todos || []);
    }
  };

  const handleDeleteTodoItem = async (id: string) => {
    const index = todos.findIndex((t) => t.id === id);
    const prev = todos;

    setTodos((prev) => prev.filter((t) => t.id !== id));

    const success = await deleteDailyTodo(id);

    if (!success) {
      setTodos(prev);
      return;
    }

    const prevTodo = prev[index - 1];
    if (prevTodo) {
      setEditingItemId(prevTodo.id);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="p-4">
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
                  onBlur={handleUpdateTodoGroupTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateTodoGroupTitle();
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
                  <DropdownMenuItem onClick={handleCreateTodoItem}>
                    <Plus /> 투두 추가
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    그룹명 수정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleDeleteTodoGroup}
                  >
                    그룹 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <DailyTodoItem
                  key={todo.id}
                  item={todo}
                  group={group}
                  isEditing={editingItemId === todo.id}
                  onToggle={handleTodoItemToggle}
                  onUpdate={handleTodoItemUpdate}
                  onDelete={handleDeleteTodoItem}
                  onCreateNext={handleCreateNextTodoItem}
                  setEditingItemId={setEditingItemId}
                  isLast={index === todos.length - 1}
                />
              ))}

              {todos.length === 0 && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handleCreateTodoItem}
                  >
                    <SquarePlus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <AlertConfirmModal
        open={isAlertOpen}
        message="이 그룹을 삭제하시겠습니까?"
        onConfirm={deleteTodoGroup}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default DailyTodoGroup;
