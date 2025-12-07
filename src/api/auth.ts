import { supabase } from "@/lib/supabaseClient.ts";

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email: email,
    password: password,
  });
};

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      throw new Error(
        "이메일 인증이 완료되지 않았거나, 이메일 또는 비밀번호가 올바르지 않습니다.",
      );

    return { data };
  } catch (err) {
    return { error: (err as Error).message };
  }
};

export const googleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/calendar`,
    },
  });

  if (error) throw new Error(error.message);
};

export const logout = async (): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("인증된 유저가 없습니다.");
  }
  return user;
};
