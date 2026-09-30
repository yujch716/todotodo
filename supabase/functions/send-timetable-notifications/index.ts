import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

interface DueNotification {
  timetable_id: string;
  daily_log_id: string;
  user_id: string;
  content: string;
  kind: "start" | "end";
}

interface Subscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// 크론이 몇 초 늦게 돌아도 놓치지 않도록 과거 2분까지 훑는다.
// 중복 발송은 start_notified_at / end_notified_at 으로 막히고,
// 하한이 2분이라 장시간 다운 후에도 과거 알림이 쏟아지지 않는다.
const LOOKBACK_MINUTES = 2;
const LOOKAHEAD_MINUTES = 1;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

const buildMessage = (item: DueNotification) => ({
  title: `🔔 ${item.content}`,
  body: item.kind === "start" ? "일정을 시작할 시간이에요" : "일정을 종료할 시간이에요",
  url: `/daily/${item.daily_log_id}`,
  tag: `${item.timetable_id}-${item.kind}`,
});

Deno.serve(async () => {
  const now = new Date();
  now.setSeconds(0, 0);

  const from = new Date(now.getTime() - LOOKBACK_MINUTES * 60_000);
  const to = new Date(now.getTime() + LOOKAHEAD_MINUTES * 60_000);

  const { data: due, error: dueError } = await supabase.rpc(
    "due_timetable_notifications",
    { p_from: from.toISOString(), p_to: to.toISOString() },
  );

  if (dueError) {
    console.error("due_timetable_notifications failed", dueError);
    return Response.json({ error: dueError.message }, { status: 500 });
  }

  const items = (due ?? []) as DueNotification[];
  if (items.length === 0) {
    return Response.json({ processed: 0, sent: 0, failed: 0, pruned: 0 });
  }

  const userIds = [...new Set(items.map((item) => item.user_id))];

  const { data: subscriptions, error: subscriptionError } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  if (subscriptionError) {
    console.error("push_subscriptions query failed", subscriptionError);
    return Response.json({ error: subscriptionError.message }, { status: 500 });
  }

  const byUser = new Map<string, Subscription[]>();
  for (const row of subscriptions ?? []) {
    const list = byUser.get(row.user_id) ?? [];
    list.push(row);
    byUser.set(row.user_id, list);
  }

  const expiredEndpoints = new Set<string>();
  const notifiedIds: Record<"start" | "end", string[]> = { start: [], end: [] };
  let sent = 0;
  let failed = 0;

  for (const item of items) {
    const targets = byUser.get(item.user_id) ?? [];
    const payload = JSON.stringify(buildMessage(item));

    const results = await Promise.all(
      targets.map(async (target) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: target.endpoint,
              keys: { p256dh: target.p256dh, auth: target.auth },
            },
            payload,
          );
          return true;
        } catch (error) {
          const statusCode = (error as { statusCode?: number }).statusCode;

          // 만료된 구독은 정리한다
          if (statusCode === 404 || statusCode === 410) {
            expiredEndpoints.add(target.endpoint);
          } else {
            console.error("send failed", target.endpoint, error);
          }
          return false;
        }
      }),
    );

    sent += results.filter(Boolean).length;
    failed += results.filter((ok) => !ok).length;

    // 한 건이라도 보냈거나, 보낼 구독이 아예 없으면 발송 완료로 표시한다.
    // (구독이 없는데 남겨두면 조회 구간 동안 매분 재시도하게 된다)
    if (results.some(Boolean) || targets.length === 0) {
      notifiedIds[item.kind].push(item.timetable_id);
    }
  }

  if (expiredEndpoints.size > 0) {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", [...expiredEndpoints]);

    if (error) console.error("prune failed", error);
  }

  for (const kind of ["start", "end"] as const) {
    if (notifiedIds[kind].length === 0) continue;

    const column = kind === "start" ? "start_notified_at" : "end_notified_at";
    const { error } = await supabase
      .from("daily_timetable")
      .update({ [column]: new Date().toISOString() })
      .in("id", notifiedIds[kind]);

    if (error) console.error(`${column} update failed`, error);
  }

  return Response.json({
    processed: items.length,
    sent,
    failed,
    pruned: expiredEndpoints.size,
  });
});
