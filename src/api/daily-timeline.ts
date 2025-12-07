import {supabase} from "@/lib/supabaseClient.ts";
import {toast} from "sonner";

export const createDailyTimeline = async (content: String, startAt: Date, endAt: Date) => {
  const {error} = await supabase
    .from("daily_timeline")
    .insert({
      content,
      start_at: startAt,
      end_at: endAt
    });

  if (error) toast.error("생성에 실패했습니다.");
};