import { supabase } from "@/lib/supabaseClient";
import type { ChecklistType } from "@/types/checklist";
import { format } from "date-fns";

export const fetchChecklists = async (): Promise<ChecklistType[]> => {
  const { data, error } = await supabase
    .from("checklist")
    .select(
      `
      *,
      checklist_item (*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((checklist) => {
    const items = checklist.checklist_item || [];
    const totalCount = items.length;
    const checkedCount = items.filter(
      (item: { is_checked: boolean }) => item.is_checked,
    ).length;

    return {
      ...checklist,
      totalCount,
      checkedCount,
    };
  });
};

export const fetchChecklistById = async (
  checklistId: string,
): Promise<ChecklistType> => {
  const { data, error } = await supabase
    .from("checklist")
    .select(
      `
        *,
        checklist_item (
          *,
          created_at
        )
      `,
    )
    .eq("id", checklistId)
    .order("created_at", { foreignTable: "checklist_item", ascending: true })
    .single();

  if (error) throw new Error(error.message);

  const totalCount = data.checklist_item.length;
  const checkedCount = data.checklist_item.filter(
    (item: { is_checked: boolean }) => item.is_checked,
  ).length;

  return {
    ...data,
    totalCount,
    checkedCount,
  };
};

export const fetchChecklistByDate = async (
  start: Date,
  end: Date,
): Promise<ChecklistType[]> => {
  const { data, error } = await supabase
    .from("checklist")
    .select(
      `
      *,
      checklist_item (*)
    `,
    )
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());

  if (error) throw new Error(error.message);

  return (data ?? []).map((checklist) => {
    const items = checklist.checklist_item || [];
    const totalCount = items.length;
    const checkedCount = items.filter(
      (item: { is_checked: boolean }) => item.is_checked,
    ).length;

    return {
      ...checklist,
      totalCount,
      checkedCount,
    };
  });
};

export const createChecklist = async (title: string, date: Date) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("유저 정보를 가져오지 못했어요:", userError);
    return;
  }

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const { error } = await supabase.from("checklist").insert([
    {
      title,
      date: formattedDate,
      user_id: user.id,
    },
  ]);

  if (error) throw new Error(error.message);
};

export const updateChecklistTitle = async (
  checklistId: string,
  title: string,
) => {
  const { error } = await supabase
    .from("checklist")
    .update({ title })
    .eq("id", checklistId);

  if (error) throw new Error(error.message);
};

export const updateChecklistMemo = async (
  checklistId: string,
  memo: string,
) => {
  const { error } = await supabase
    .from("checklist")
    .update({ memo })
    .eq("id", checklistId);

  if (error) throw new Error(error.message);
};

export const deleteChecklistById = async (checklistId: string) => {
  const { error } = await supabase
    .from("checklist")
    .delete()
    .eq("id", checklistId);

  if (error) throw new Error(error.message);
};
