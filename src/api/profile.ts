import { supabase } from "@/lib/supabaseClient.ts";

export const upsertUserProfile = async (id: string, name: string) => {
  return supabase.from("user_profile").upsert([{ id, name }]);
};
