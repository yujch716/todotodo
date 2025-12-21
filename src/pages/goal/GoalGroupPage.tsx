import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Ellipsis, Folder } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { deleteGoalGroupById, getGoalGroups } from "@/api/goal-group.ts";
import type { GoalGroup } from "@/types/goal.ts";
import { useCallback, useEffect, useState } from "react";
import CreateGoalGroupModal from "@/pages/goal/CreateGoalGroupModal.tsx";
import { useGoalGroupStore } from "@/store/goalGroupStore.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import UpdateGoalGroupModal from "@/pages/goal/UpdateGoalGroupModal.tsx";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";

const GoalGroupPage = () => {
  const navigate = useNavigate();

  const [goalGroups, setGoalGroups] = useState<GoalGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GoalGroup | null>(null);
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const refreshGoalGroup = useGoalGroupStore((state) => state.refreshGoalGroup);
  const resetGoalGroupRefresh = useGoalGroupStore(
    (state) => state.resetGoalGroupRefresh,
  );
  const triggerGoalGroupRefresh = useGoalGroupStore(
    (state) => state.triggerGoalGroupRefresh,
  );

  const loadGoalGroups = useCallback(async () => {
    const goalGroups = await getGoalGroups();
    setGoalGroups(goalGroups);
  }, []);

  const handleMoveGoal = (id: string) => {
    navigate(`/goal-groups/${id}`);
  };

  const handleOpenEditModal = (group: GoalGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setModalType("edit");
  };

  const handleCloseEditModal = () => {
    setSelectedGroup(null);
    setModalType(null);
  };

  const handleDelete = (group: GoalGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setModalType("delete");
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroup) return;

    await deleteGoalGroupById(selectedGroup.id);

    triggerGoalGroupRefresh();

    setSelectedGroup(null);
    setModalType(null);
  };

  const handleCancelDelete = () => {
    setSelectedGroup(null);
    setModalType(null);
  };

  useEffect(() => {
    loadGoalGroups();
  }, [loadGoalGroups]);

  useEffect(() => {
    if (refreshGoalGroup) {
      loadGoalGroups();
      resetGoalGroupRefresh();
    }
  }, [refreshGoalGroup, resetGoalGroupRefresh, loadGoalGroups]);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <header className="flex w-full items-center justify-end mb-4">
          <CreateGoalGroupModal />
        </header>

        <div className="flex flex-grow overflow-hidden">
          <ScrollArea className="h-full max-h-full w-full">
            <div className="flex flex-wrap gap-4">
              {goalGroups.map((group) => (
                <Card
                  key={group.id}
                  className="w-[150px] h-[150px] hover:shadow-lg  cursor-pointer"
                  onClick={() => {
                    handleMoveGoal(group.id);
                  }}
                >
                  <CardHeader className="flex flex-row justify-end px-1 pt-1 pb-0">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          aria-label="Open menu"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={(e) => handleOpenEditModal(group, e)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => handleDelete(group, e)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-1 w-full">
                    <Folder
                      className="w-14 h-14"
                      style={{
                        stroke: "#fde68a",
                        fill: "#fde68a",
                      }}
                    />
                    <div className="w-full text-center truncate">
                      {group.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {selectedGroup && modalType === "edit" && (
        <UpdateGoalGroupModal
          id={selectedGroup.id}
          initialName={selectedGroup.name}
          onClose={handleCloseEditModal}
        />
      )}

      {selectedGroup && modalType === "delete" && (
        <AlertConfirmModal
          open={true}
          message="이 그룹을 삭제하시겠습니까?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};
export default GoalGroupPage;
