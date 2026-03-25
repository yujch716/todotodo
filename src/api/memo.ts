import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { getAuthenticatedUser } from "@/api/auth.ts";
import type { Memo } from "@/types/memo.ts";

export const getMemos = async (): Promise<Memo[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("memo")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    toast.error("메모 조회에 실패했습니다.");
    return [];
  }

  return data ?? [];
};

export const createMemo = async (
  title: string,
  content: string,
): Promise<Memo | null> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("memo")
    .insert([
      {
        user_id: user.id,
        title,
        content,
      },
    ])
    .select()
    .single();

  if (error) {
    toast.error("메모 생성에 실패했습니다.");
    return null;
  }

  toast.success("메모가 생성되었습니다.");
  return data;
};

export const updateMemo = async (
  id: string,
  title: string,
  content: string,
): Promise<void> => {
  const { error } = await supabase
    .from("memo")
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    toast.error("메모 수정에 실패했습니다.");
    return;
  }
};

export const deleteMemo = async (id: string): Promise<void> => {
  const { error } = await supabase.from("memo").delete().eq("id", id);

  if (error) {
    toast.error("메모 삭제에 실패했습니다.");
    return;
  }

  toast.success("메모가 삭제되었습니다.");
};
