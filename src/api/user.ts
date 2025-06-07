import { supabase } from "@/lib/supabaseClient.ts";

export const getUser = async () => {
  return (await supabase.auth.getUser()).data.user;
};

export const updateUser = async ({
  name,
  avatar_url,
}: {
  name: string;
  avatar_url: string;
}) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      name,
      picture: avatar_url,
    },
  });

  if (error) throw new Error(error.message);
};
