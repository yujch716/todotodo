import { type Goal, type GoalChecklistItem, GoalStatus } from "@/types/goal.ts";
import { Card } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import {
  ChevronDown,
  Flag,
  PartyPopper,
  Plus,
  SquareCheckBig,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useState, useRef } from "react";
import {
  createGoalChecklistItem,
  updateGoalChecklistItem,
  deleteGoalChecklistItem,
  checkItem,
} from "@/api/goal-checklist-item.ts";

interface GoalProps {
  goal: Goal;
}

const ChecklistGoalSheet = ({ goal }: GoalProps) => {
  const [goalChecklistItems, setGoalChecklistItems] = useState<
    GoalChecklistItem[]
  >(goal.goal_checklist_item || []);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const targetValue = goalChecklistItems.length;
  const completedValue = goalChecklistItems.filter(
    (item) => item.is_checked,
  ).length;
  const progressValue =
    targetValue > 0 ? Math.floor((completedValue / targetValue) * 100) : 0;
  const isComplete = goal.status === GoalStatus.completed;

  const handleCreateItem = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const newOrderIndex = goalChecklistItems.length > 0
        ? Math.max(...goalChecklistItems.map((item) => item.order_index)) + 1
        : 0;
      const newItem = await createGoalChecklistItem(goal.id, newOrderIndex, "");
      setGoalChecklistItems((prev) => [...prev, newItem]);

      setTimeout(() => {
        const input = inputRefs.current[newItem.id];
        if (input) {
          input.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Failed to create checklist item:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteGoalChecklistItem(id);
      setGoalChecklistItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete checklist item:", error);
    }
  };

  const handleUpdateItem = async (id: string, content: string) => {
    try {
      await updateGoalChecklistItem(id, content);
      setGoalChecklistItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, content } : item)),
      );
    } catch (error) {
      console.error("Failed to update checklist item:", error);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: GoalChecklistItem,
  ) => {
    const inputValue = (e.target as HTMLInputElement).value;

    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      inputValue.trim() === ""
    ) {
      e.preventDefault();
      try {
        const sortedItems = [...goalChecklistItems].sort(
          (a, b) => a.order_index - b.order_index,
        );
        const currentIndex = sortedItems.findIndex(
          (sortedItem) => sortedItem.id === item.id,
        );
        const previousItem =
          currentIndex > 0 ? sortedItems[currentIndex - 1] : null;

        await deleteGoalChecklistItem(item.id);
        setGoalChecklistItems((prev) =>
          prev.filter((existingItem) => existingItem.id !== item.id),
        );

        if (previousItem) {
          setTimeout(() => {
            const input = inputRefs.current[previousItem.id];
            if (input) {
              input.focus();
              input.setSelectionRange(input.value.length, input.value.length);
            }
          }, 100);
        }
      } catch (error) {
        console.error("Failed to delete checklist item:", error);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const sortedItems = [...goalChecklistItems].sort(
        (a, b) => a.order_index - b.order_index,
      );
      const currentIndex = sortedItems.findIndex(
        (sortedItem) => sortedItem.id === item.id,
      );
      const isLastItem = currentIndex === sortedItems.length - 1;

      if (isLastItem) {
        if (isCreating) return;

        setIsCreating(true);
        try {
          const newOrderIndex = item.order_index + 1;
          const updatedItems = goalChecklistItems.map((existingItem) =>
            existingItem.order_index >= newOrderIndex
              ? { ...existingItem, order_index: existingItem.order_index + 1 }
              : existingItem,
          );

          const newItem = await createGoalChecklistItem(
            goal.id,
            newOrderIndex,
            "",
          );
          const newItems = [...updatedItems, newItem].sort(
            (a, b) => a.order_index - b.order_index,
          );
          setGoalChecklistItems(newItems);

          setTimeout(() => {
            const input = inputRefs.current[newItem.id];
            if (input) {
              input.focus();
            }
          }, 100);
        } catch (error) {
          console.error("Failed to create new checklist item:", error);
        } finally {
          setIsCreating(false);
        }
      } else {
        const nextItem = sortedItems[currentIndex + 1];
        if (nextItem) {
          setTimeout(() => {
            const input = inputRefs.current[nextItem.id];
            if (input) {
              input.focus();
              input.setSelectionRange(0, input.value.length);
            }
          }, 0);
        }
      }
    }
  };

  const handleInputFocus = (itemId: string) => {
    setFocusedItemId(itemId);
  };

  const handleInputBlur = (item: GoalChecklistItem, value: string) => {
    setFocusedItemId(null);
    if (value !== item.content) {
      handleUpdateItem(item.id, value);
    }
  };

  const handleCheckboxChange = async (
    item: GoalChecklistItem,
    checked: boolean,
  ) => {
    try {
      setGoalChecklistItems((prev) =>
        prev.map((existingItem) =>
          existingItem.id === item.id
            ? { ...existingItem, is_checked: checked }
            : existingItem,
        ),
      );

      await checkItem(item.id, checked);
    } catch (error) {
      console.error("Failed to update checkbox:", error);

      setGoalChecklistItems((prev) =>
        prev.map((existingItem) =>
          existingItem.id === item.id
            ? { ...existingItem, is_checked: !checked }
            : existingItem,
        ),
      );
    }
  };

  const sortedItems = [...goalChecklistItems].sort(
    (a, b) => a.order_index - b.order_index,
  );

  return (
    <>
      <div className="w-full flex flex-col flex-1 min-h-0 gap-6">
        <Card className="w-full flex-none p-6">
          <div className="flex items-center gap-3 relative pt-8 pb-2">
            <div className="relative w-full">
              <Progress value={progressValue} className="w-full border-2" />
              {targetValue > 0 && (
                <div
                  className="absolute -top-9 transform -translate-x-1/2 bg-white border border-gray-300 text-xs px-2 py-1 rounded-full shadow-md"
                  style={{ left: `${(completedValue / targetValue) * 100}%` }}
                >
                  {completedValue}
                  <ChevronDown className="w-3 h-3 absolute top-full left-1/2 -translate-x-1/2" />
                </div>
              )}
            </div>

            <Label className="inline-flex items-center gap-1">
              <Flag
                className={`w-4 h-4 ${isComplete ? "text-sky-300" : "text-transparent"}`}
                stroke="black"
                fill={isComplete ? "currentColor" : "none"}
              />
              {targetValue}
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <Label
              className={`flex justify-end w-full p-1 transition-opacity duration-200 text-muted-foreground items-center gap-2 ${
                isComplete ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Complete! <PartyPopper />
            </Label>
          </div>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4 px-5 pt-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <SquareCheckBig />
              Checklist
            </h3>
            <Button
              onClick={handleCreateItem}
              variant="outline"
              size="icon"
              disabled={isCreating}
              className="flex items-center gap-2 bg-sky-200 hover:bg-sky-300 text-black disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-full px-4 pb-4">
            <div className="space-y-3 p-1">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2 px-4 border rounded-lg shadow"
                >
                  <Checkbox
                    checked={item.is_checked}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(item, checked as boolean)
                    }
                  />
                  <Input
                    ref={(el) => {
                      inputRefs.current[item.id] = el;
                    }}
                    defaultValue={item.content}
                    className={`flex-1 ${
                      focusedItemId === item.id
                        ? "border-input bg-background focus-visible:ring-0 border-0 p-1"
                        : "border-0 bg-transparent focus-visible:ring-0 shadow-none p-1"
                    } ${item.is_checked ? "line-through text-muted-foreground" : ""}`}
                    onKeyDown={(e) => handleKeyDown(e, item)}
                    onFocus={() => handleInputFocus(item.id)}
                    onBlur={(e) => handleInputBlur(item, e.target.value)}
                  />
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {sortedItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  체크리스트 항목이 없습니다. 새 항목을 추가해보세요.
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </>
  );
};
export default ChecklistGoalSheet;
