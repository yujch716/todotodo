import DailyTodoItem from "./DailyTodoItem.tsx";
import { useCallback, useEffect, useState } from "react";
import EmptyDailyLog from "@/pages/daily-log/EmptyDailyLog.tsx";
import type { DailyTodoType } from "@/types/daily-log.ts";
import {
  createDailyTodo,
  deleteDailyTodo,
  getDailyTodoByDailyLogId,
  toggleDailyTodo,
  updateDailyTodoContent,
} from "@/api/daily-todo.ts";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import { useDailyLogDetailStore } from "@/store/dailyLogDetailStore.ts";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { SquareCheckBig, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

interface Props {
  dailyLogId: string;
}

const DailyTodoPanel = ({ dailyLogId }: Props) => {
  const [items, setItems] = useState<DailyTodoType[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);

  const triggerSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );
  const triggerDailyLogRefresh = useDailyLogDetailStore(
    (state) => state.triggerDailyLogRefresh,
  );
  const refreshDailyLog = useDailyLogDetailStore(
    (store) => store.refreshDailyLog,
  );
  const resetDailyLogRefresh = useDailyLogDetailStore(
    (store) => store.resetDailyLogRefresh,
  );

  const loadDailyTodo = useCallback(async () => {
    if (!dailyLogId) return;

    const dailyTodo = await getDailyTodoByDailyLogId(dailyLogId);

    setItems(dailyTodo.items ?? []);
    setTotalCount(dailyTodo.totalCount ?? 0);
    setCheckedCount(dailyTodo.checkedCount ?? 0);
  }, [dailyLogId]);

  useEffect(() => {
    loadDailyTodo();
  }, [loadDailyTodo]);

  useEffect(() => {
    if (refreshDailyLog) {
      loadDailyTodo();
      resetDailyLogRefresh();
    }
  }, [loadDailyTodo, refreshDailyLog, resetDailyLogRefresh]);

  const onUpdateItemContent = async (id: string, newContent: string) => {
    if (newContent.trim() === "") {
      await deleteItem(id);
      return;
    }

    setItems((prevItems) => {
      if (newContent.trim() === "") return prevItems;

      return prevItems.map((item) =>
        item.id === id ? { ...item, content: newContent } : item,
      );
    });

    await updateDailyTodoContent(id, newContent);
  };

  const deleteItem = async (id: string) => {
    await deleteDailyTodo(id);

    triggerDailyLogRefresh();
    triggerSidebarRefresh();

    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      if (index === -1) return prevItems;

      const newItems = prevItems.filter((item) => item.id !== id);

      const focusId = index > 0 ? prevItems[index - 1].id : null;
      setEditingItemId(focusId);

      return newItems;
    });
  };

  const onToggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.is_checked;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_checked: newChecked } : i)),
    );

    await toggleDailyTodo(id, newChecked);

    triggerDailyLogRefresh();
    triggerSidebarRefresh();
  };

  const createEmptyItem = async () => {
    if (!dailyLogId) return;

    if (items.some((item) => item.content.trim() === "")) return;

    const newItem = await createDailyTodo(dailyLogId);

    triggerDailyLogRefresh();
    triggerSidebarRefresh();

    setItems((prev) => [...prev, newItem]);
    setEditingItemId(newItem.id);
  };

  const progressValue = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  if (!dailyLogId)
    return (
      <div className="p-8">
        <EmptyDailyLog />
      </div>
    );

  return (
    <>
      <Card className="group">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <SquareCheckBig /> To do
              </div>

              <div className="flex items-center gap-2 w-2/3 justify-end">
                <Progress value={progressValue} className="w-full border-2" />
                <DailyLogStatusIcon
                  checkedCount={checkedCount}
                  totalCount={totalCount}
                  iconClassName="w-6 h-6"
                />
              </div>
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <DailyTodoItem
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onUpdateContent={onUpdateItemContent}
                isEditing={editingItemId === item.id}
                setEditingItemId={setEditingItemId}
                onAddEmptyItem={createEmptyItem}
              />
            ))}
          </div>
          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-opacity duration-200",
                items.length === 0
                  ? "visible"
                  : "invisible group-hover:visible",
              )}
              onClick={createEmptyItem}
            >
              <SquarePlus />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DailyTodoPanel;
