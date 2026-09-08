-- 웹 푸시 알림: 구독 저장 테이블 + 발송 대상 조회 함수

-- 1. 푸시 구독 정보
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "본인 구독만 조회" on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "본인 구독만 등록" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
-- endpoint 기준 upsert(insert ... on conflict do update)를 위해 update 정책이 필요하다
create policy "본인 구독만 수정" on public.push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "본인 구독만 삭제" on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- 2. 중복 발송 방지 컬럼
alter table public.daily_timetable
  add column if not exists start_notified_at timestamptz,
  add column if not exists end_notified_at timestamptz;

-- 3. daily_log.date + time -> 실제 시각(Asia/Seoul)
--    타임테이블 UI는 하루를 04:00 ~ 다음날 04:00으로 다루므로
--    (DailyTimetablePanel.tsx 의 timeToMinutes 참고)
--    04:00 이전 시각은 다음날로 해석한다.
--    24:00:00 은 postgres 가 date + 1일 00:00 으로 계산해주므로 별도 처리가 필요 없다.
create or replace function public.timetable_slot_at(p_date date, p_time time)
returns timestamptz
language sql
immutable
as $$
  select ((p_date::timestamp + p_time)
          + case when p_time < time '04:00' then interval '1 day' else interval '0' end)
         at time zone 'Asia/Seoul';
$$;

-- 4. [p_from, p_to) 구간에 알림을 보내야 할 일정 목록
create or replace function public.due_timetable_notifications(
  p_from timestamptz,
  p_to timestamptz
)
returns table (
  timetable_id uuid,
  daily_log_id uuid,
  user_id uuid,
  content text,
  kind text
)
language sql
security definer
set search_path = public
as $$
  select tt.id, tt.daily_log_id, dl.user_id, tt.content, 'start'::text
    from daily_timetable tt
    join daily_log dl on dl.id = tt.daily_log_id
   where tt.start_notified_at is null
     -- date 범위를 먼저 좁혀야 인덱스를 탄다 (함수 결과로만 필터하면 full scan)
     and dl.date between (p_from at time zone 'Asia/Seoul')::date - 1
                     and (p_to at time zone 'Asia/Seoul')::date
     and timetable_slot_at(dl.date, tt.start_time) >= p_from
     and timetable_slot_at(dl.date, tt.start_time) < p_to
  union all
  select tt.id, tt.daily_log_id, dl.user_id, tt.content, 'end'::text
    from daily_timetable tt
    join daily_log dl on dl.id = tt.daily_log_id
   where tt.end_notified_at is null
     and dl.date between (p_from at time zone 'Asia/Seoul')::date - 1
                     and (p_to at time zone 'Asia/Seoul')::date
     and timetable_slot_at(dl.date, tt.end_time) >= p_from
     and timetable_slot_at(dl.date, tt.end_time) < p_to;
$$;

-- 발송 서버(service_role)만 호출한다
revoke all on function public.due_timetable_notifications(timestamptz, timestamptz)
  from public, anon, authenticated;
