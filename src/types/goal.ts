export const GoalItemStatus = {
  notStarted: "notStarted",
  inProgress: "inProgress",
  done: "done",
} as const;

export type GoalItemStatusType = keyof typeof GoalItemStatus;
