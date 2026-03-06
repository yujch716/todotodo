import DailyTodoGroup from "./DailyTodoGroup.tsx";
import { useCallback, useEffect, useState } from "react";
import EmptyDailyLog from "@/pages/daily-log/EmptyDailyLog.tsx";
import type { DailyTodoGroupType } from "@/types/daily-log.ts";
import {
  getDailyTodoGroupsWithTodos,
  createDailyTodoGroup,
} from "@/api/daily-todo-group.ts";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import { useDailyLogDetailStore } from "@/store/dailyLogDetailStore.ts";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { SquareCheckBig, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  getDailyTodoCheckedCount,
  getDailyTodoTotalCount,
} from "@/api/daily-todo.ts";

interface Props {
  dailyLogId: string;
}

const DailyTodoPanel = ({ dailyLogId }: Props) => {
  const [groups, setGroups] = useState<DailyTodoGroupType[]>([]);
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

  const loadData = useCallback(async () => {
    if (!dailyLogId) return;

    const [todoGroups, totalCount, checkedCount] = await Promise.all([
      getDailyTodoGroupsWithTodos(dailyLogId),
      getDailyTodoTotalCount(dailyLogId),
      getDailyTodoCheckedCount(dailyLogId),
    ]);

    setGroups(todoGroups);
    setTotalCount(totalCount);
    setCheckedCount(checkedCount);
  }, [dailyLogId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (refreshDailyLog) {
      loadData();
      resetDailyLogRefresh();
    }
  }, [loadData, refreshDailyLog, resetDailyLogRefresh]);

  const createEmptyGroup = async () => {
    if (!dailyLogId) return;

    const newGroup = await createDailyTodoGroup(
      dailyLogId,
      null,
      groups.length,
    );

    if (newGroup) {
      loadData();
      triggerSidebarRefresh();
    }
  };

  const handleGroupUpdate = () => {
    loadData();
    triggerSidebarRefresh();
    triggerDailyLogRefresh();
  };

  const progressValue = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  if (!dailyLogId)
    return (
      <div className="p-8">
        <EmptyDailyLog />
      </div>
    );

  return (
    <Card className="flex flex-col group h-full overflow-hidden shadow-lg border-1">
      <CardHeader>
        <CardTitle className="text-base">
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

              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={createEmptyGroup}
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {groups.map((group) => (
            <DailyTodoGroup
              key={group.id}
              group={group}
              onUpdate={handleGroupUpdate}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
            />
          ))}

          {groups.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-gray-500 mb-4">
                <FolderPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">아직 투두 그룹이 없습니다</p>
                <p className="text-xs text-gray-400 mt-1">
                  그룹을 만들어서 투두를 정리해보세요
                </p>
              </div>
              <Button
                variant="outline"
                onClick={createEmptyGroup}
                className="mt-2"
              >
                <FolderPlus className="w-4 h-4 mr-2" />첫 번째 그룹 만들기
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTodoPanel;
