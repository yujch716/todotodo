import { supabase } from "@/lib/supabaseClient.ts";
import { toast } from "sonner";
import { getAuthenticatedUser } from "@/api/auth.ts";
import type { PushSubscriptionKeys } from "@/lib/push.ts";

export const upsertPushSubscription = async (
  subscription: PushSubscriptionKeys,
): Promise<void> => {
  const user = await getAuthenticatedUser();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      user_agent: navigator.userAgent,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    toast.error("알림 등록에 실패했습니다.");
    throw error;
  }
};

export const deletePushSubscriptionByEndpoint = async (
  endpoint: string,
): Promise<void> => {
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) {
    toast.error("알림 해제에 실패했습니다.");
    throw error;
  }
};
