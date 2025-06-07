import { supabase } from "@/lib/supabaseClient.ts";

export const getUser = async () => {
  return (await supabase.auth.getUser()).data.user;
};
