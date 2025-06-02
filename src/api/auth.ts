import { supabase } from "@/lib/supabaseClient.ts";

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

export const login = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const googleLogin = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/calendar`,
    },
  });
};

export const logout = async (): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
