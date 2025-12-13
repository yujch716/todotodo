import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import type { Category } from "@/types/category.ts";
import { getAuthenticatedUser } from "@/api/auth.ts";

export const getCategory = async (): Promise<Category[]> => {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("user_id", user.id);

  if (error) toast.error("조회에 실패했습니다.");

  return data ?? [];
};

export const createCategory = async (
  name: string,
  color: string,
): Promise<void> => {
  const user = await getAuthenticatedUser();

  const { error } = await supabase.from("category").insert([
    {
      user_id: user.id,
      name,
      color,
    },
  ]);

  if (error) toast.error("생성에 실패했습니다.");
};

export const updateCategory = async (
  id: string,
  name: string,
  color: string,
): Promise<void> => {
  const { error } = await supabase
    .from("category")
    .update({ name, color })
    .eq("id", id);

  if (error) toast.error("수정에 실패했습니다.");
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from("category").delete().eq("id", id);

  if (error) toast.error("삭제에 실패했습니다.");
};
