-- 매 1분마다 send-timetable-notifications Edge Function 호출
--
-- 사전 준비: service_role 키가 Vault 에 'service_role_key' 이름으로 저장되어 있어야 한다.
--   select vault.create_secret('<service_role_key>', 'service_role_key');
-- 키를 SQL/저장소에 평문으로 남기지 않기 위해 Vault 를 경유한다.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'send-timetable-notifications',
  '* * * * *',
  $job$
  select net.http_post(
    url := 'https://xyxnjiwjjtqfdwhplzjf.supabase.co/functions/v1/send-timetable-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 8000
  );
  $job$
);
