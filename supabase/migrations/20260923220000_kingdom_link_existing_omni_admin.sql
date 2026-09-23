-- The owner's admin account (contactokingdom.ve@gmail.com) already existed in
-- auth.users from Omni before kingdom_on_auth_user_created was created, so the
-- trigger (which only fires on INSERT) never linked it. One-time backfill —
-- safe to re-run, only touches rows still pending (user_id is null).
update public.kingdom_admins ka
set user_id = u.id, claimed_at = now()
from auth.users u
where ka.user_id is null
  and lower(u.email) = ka.email;
