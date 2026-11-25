-- Server-only notification queue, explicit confirmation, no automatic sends.
alter table public.aoz_campaigns add column if not exists lease_until timestamptz, add column if not exists lease_id uuid;
create function public.aoz_notify_counts() returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
select jsonb_build_object('total',count(*) filter(where v3 or v1 or global_codes or news),'v3',count(*) filter(where v3),'v1',count(*) filter(where v1),'global',count(*) filter(where global_codes),'news',count(*) filter(where news)) from aoz_subscribers where consent_at is not null and blocked_at is null
$$;
create function public.aoz_notify_queue(p_category text,p_code text,p_expected integer) returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare cid uuid; n integer;
begin
 if p_category not in ('v3','v1','global') or p_code is null or p_code !~ '^[A-Za-z0-9_-]{1,64}$' or p_expected is null or p_expected<1 then raise exception 'invalid_campaign'; end if;
 perform pg_advisory_xact_lock(187433);
 -- Freeze recipient set in one transaction; do not add later subscribers.
 insert into aoz_campaigns(category,promo_code,status) values(p_category,p_code,'queued') on conflict do nothing returning id into cid;
 if cid is null then return jsonb_build_object('error','duplicate'); end if;
 insert into aoz_deliveries(campaign_id,telegram_id) select cid,telegram_id from aoz_subscribers where consent_at is not null and blocked_at is null and case p_category when 'v3' then v3 when 'v1' then v1 else global_codes end;
 get diagnostics n=row_count;
 if n<>p_expected then delete from aoz_campaigns where id=cid;return jsonb_build_object('error','audience_changed'); end if;
 return jsonb_build_object('id',cid,'total',n);
end $$;
create function public.aoz_notify_batch(p_id uuid) returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare c aoz_campaigns%rowtype; lease uuid; batch jsonb;
begin
 perform pg_advisory_xact_lock(187433);
 select * into c from aoz_campaigns where id=p_id for update;
 if not found or c.status not in ('queued','sending') then return jsonb_build_object('error','not_active'); end if;
 if exists(select 1 from aoz_campaigns where lease_until>now()) then return jsonb_build_object('error','busy'); end if;
 -- Interrupted sends are uncertain, never automatically retried.
 update aoz_deliveries set status='uncertain',updated_at=now() where campaign_id=p_id and status='sending';
 lease=gen_random_uuid();
 update aoz_campaigns set status='sending',lease_id=lease,lease_until=now()+interval '90 seconds' where id=p_id;
 with picked as (select telegram_id from aoz_deliveries where campaign_id=p_id and status='pending' order by telegram_id limit 3 for update), changed as (update aoz_deliveries d set status='sending',attempts=attempts+1,updated_at=now() from picked where d.campaign_id=p_id and d.telegram_id=picked.telegram_id returning d.telegram_id)
 select coalesce(jsonb_agg(telegram_id::text),'[]'::jsonb) into batch from changed;
 return jsonb_build_object('lease',lease,'category',c.category,'code',c.promo_code,'recipients',batch);
end $$;
create function public.aoz_notify_finish(p_id uuid,p_lease uuid) returns void language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 perform pg_advisory_xact_lock(187433);
 if not exists(select 1 from aoz_campaigns where id=p_id and lease_id=p_lease) then return; end if;
 update aoz_deliveries set status='uncertain',updated_at=now() where campaign_id=p_id and status='sending';
 update aoz_campaigns set lease_until=null,lease_id=null,status=case when exists(select 1 from aoz_deliveries where campaign_id=p_id and status='pending') then 'queued' else 'completed' end where id=p_id;
end $$;
create function public.aoz_notify_history() returns jsonb language sql stable security invoker set search_path=public,pg_temp as $$
select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc),'[]'::jsonb) from (select c.id,c.category,c.promo_code,c.status,c.created_at,(c.lease_until>now()) as busy,count(d.telegram_id) as total,count(*) filter(where d.status='sent') as sent,count(*) filter(where d.status='pending') as pending,count(*) filter(where d.status='failed') as failed,count(*) filter(where d.status='skipped') as skipped,count(*) filter(where d.status='uncertain') as uncertain,count(*) filter(where d.status='sending') as sending from aoz_campaigns c left join aoz_deliveries d on d.campaign_id=c.id group by c.id order by c.created_at desc limit 25)x
$$;
revoke all on function public.aoz_notify_counts(),public.aoz_notify_queue(text,text,integer),public.aoz_notify_batch(uuid),public.aoz_notify_finish(uuid,uuid),public.aoz_notify_history() from public,anon,authenticated;
grant execute on function public.aoz_notify_counts(),public.aoz_notify_queue(text,text,integer),public.aoz_notify_batch(uuid),public.aoz_notify_finish(uuid,uuid),public.aoz_notify_history() to service_role;
