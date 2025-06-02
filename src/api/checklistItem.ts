import { supabase } from "@/lib/supabaseClient.ts";

export const fetchChecklistItems = async (checklistId: string) => {
  const { data, error } = await supabase
    .from("checklist_item")
    .select("id, content, is_checked, created_at")
    .eq("checklist_id", checklistId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const createChecklistItem = async (checklistId: string) => {
  const { data, error } = await supabase
    .from("checklist_item")
    .insert({ checklist_id: checklistId, content: "", is_checked: false })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updateChecklistItemContent = async (
  id: string,
  content: string,
) => {
  const { error } = await supabase
    .from("checklist_item")
    .update({ content })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const toggleChecklistItem = async (id: string, isChecked: boolean) => {
  const { error } = await supabase
    .from("checklist_item")
    .update({ is_checked: isChecked })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteChecklistItem = async (id: string) => {
  const { error } = await supabase.from("checklist_item").delete().eq("id", id);

  if (error) throw new Error(error.message);
};
