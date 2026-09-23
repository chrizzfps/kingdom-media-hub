-- Kingdom Media Hub CMS — schema, RLS, storage.
-- Fully isolated from Omni: every object is prefixed `kingdom_`, lives in `public`
-- alongside Omni's tables but touches none of them, and gets its own storage bucket.

-- ============================================================================
-- 1. Admin allowlist
-- ============================================================================
-- Being authenticated with Supabase Auth is NOT enough to edit Kingdom content.
-- Only emails pre-approved here (by the project owner, via SQL) can act as admins.
-- Rows start with user_id = null ("invited"); a trigger on auth.users links the
-- row to the real auth user the first time that email signs up.
create table public.kingdom_admins (
  email text primary key,
  user_id uuid unique references auth.users(id) on delete set null,
  invited_at timestamptz not null default now(),
  claimed_at timestamptz
);

alter table public.kingdom_admins enable row level security;

create policy "kingdom_admins_self_select"
  on public.kingdom_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Helper predicate reused by every other policy below. Plain SQL function
-- (SECURITY INVOKER, the default) — it only ever reads the caller's own
-- membership row, so no elevated privileges are required.
create function public.kingdom_is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.kingdom_admins
    where user_id = (select auth.uid())
  );
$$;

-- Auto-link a pre-invited admin row to the real auth user on first sign-up.
-- SECURITY DEFINER is required here: this runs as part of the auth.users
-- insert, before the new session exists, so it must bypass RLS to write the
-- link. It lives in `public` but is only ever invoked by the trigger below,
-- never callable directly with attacker-controlled input.
create function public.kingdom_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.kingdom_admins
  set user_id = new.id, claimed_at = now()
  where email = lower(new.email) and user_id is null;
  return new;
end;
$$;

create trigger kingdom_on_auth_user_created
  after insert on auth.users
  for each row execute function public.kingdom_handle_new_user();

-- Not meant to be called directly via PostgREST RPC — only by the trigger.
revoke execute on function public.kingdom_handle_new_user() from public, anon, authenticated;

-- ============================================================================
-- 2. Content model
-- ============================================================================
-- Sections: the fixed list of editable namespaces. Some map to a visible
-- homepage block (reorderable/hideable); others are cross-cutting text
-- (meta, common, nav, footer, cro) and are neither.
create table public.kingdom_sections (
  key text primary key,
  label text not null,
  section_group text not null check (section_group in ('homepage', 'global')),
  sort_order int not null default 0,
  is_visible boolean not null default true,
  is_hideable boolean not null default true,
  is_reorderable boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.kingdom_sections enable row level security;

create policy "kingdom_sections_admin_all"
  on public.kingdom_sections for all
  to authenticated
  using (public.kingdom_is_admin())
  with check (public.kingdom_is_admin());

-- Repeatable items: media lab projects, pricing plans (and their nested
-- features), FAQ entries, testimonials, comparison rows, stats, etc.
-- `flags` holds non-localized structured data (numbers/booleans) that isn't
-- translated text, e.g. a stat's numeric value or a pricing plan's
-- "popular" flag.
create table public.kingdom_items (
  id uuid primary key default gen_random_uuid(),
  section_key text not null references public.kingdom_sections(key) on delete cascade,
  parent_item_id uuid references public.kingdom_items(id) on delete cascade,
  group_key text not null default '',
  item_key text not null default '',
  sort_order int not null default 0,
  is_visible boolean not null default true,
  image_url text,
  flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index kingdom_items_section_group_idx
  on public.kingdom_items (section_key, group_key, parent_item_id, sort_order);

alter table public.kingdom_items enable row level security;

create policy "kingdom_items_admin_all"
  on public.kingdom_items for all
  to authenticated
  using (public.kingdom_is_admin())
  with check (public.kingdom_is_admin());

-- Field values: every piece of translatable text, whether it belongs to a
-- section directly (owner_type='section', owner_id=section key) or to a
-- repeatable item (owner_type='item', owner_id=item id).
create table public.kingdom_field_values (
  id bigint generated always as identity primary key,
  owner_type text not null check (owner_type in ('section', 'item')),
  owner_id text not null,
  field_key text not null,
  locale text not null check (locale in ('en', 'es')),
  value text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  unique (owner_type, owner_id, field_key, locale)
);

create index kingdom_field_values_owner_idx
  on public.kingdom_field_values (owner_type, owner_id);

alter table public.kingdom_field_values enable row level security;

create policy "kingdom_field_values_admin_all"
  on public.kingdom_field_values for all
  to authenticated
  using (public.kingdom_is_admin())
  with check (public.kingdom_is_admin());

-- ============================================================================
-- 3. Publishing: draft tables above are always live-editable by admins.
-- The public site only ever reads `kingdom_published`, a single snapshot row
-- swapped atomically on publish so a partial edit never leaves a section
-- empty. `kingdom_publish_log` keeps every past snapshot for rollback.
-- ============================================================================
create table public.kingdom_publish_log (
  id bigint generated always as identity primary key,
  snapshot jsonb not null,
  note text,
  published_by uuid references auth.users(id),
  published_at timestamptz not null default now()
);

alter table public.kingdom_publish_log enable row level security;

create policy "kingdom_publish_log_admin_all"
  on public.kingdom_publish_log for all
  to authenticated
  using (public.kingdom_is_admin())
  with check (public.kingdom_is_admin());

create table public.kingdom_published (
  id boolean primary key default true check (id),
  snapshot jsonb not null,
  log_id bigint references public.kingdom_publish_log(id),
  updated_at timestamptz not null default now()
);

alter table public.kingdom_published enable row level security;

-- The homepage (anon visitors) reads this table directly.
create policy "kingdom_published_public_read"
  on public.kingdom_published for select
  to anon, authenticated
  using (true);

create policy "kingdom_published_admin_write"
  on public.kingdom_published for insert
  to authenticated
  with check (public.kingdom_is_admin());

create policy "kingdom_published_admin_update"
  on public.kingdom_published for update
  to authenticated
  using (public.kingdom_is_admin())
  with check (public.kingdom_is_admin());

-- Explicit grants: table access via the Data API is separate from RLS.
grant select on public.kingdom_published to anon, authenticated;
grant select, insert, update, delete on
  public.kingdom_admins,
  public.kingdom_sections,
  public.kingdom_items,
  public.kingdom_field_values,
  public.kingdom_publish_log
  to authenticated;
grant update on public.kingdom_published to authenticated;

-- ============================================================================
-- 4. Storage — dedicated bucket, isolated from Omni's `product-images` /
-- `lead-files` buckets. Public read (images need to render on the public
-- homepage), admin-only write.
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kingdom-media',
  'kingdom-media',
  true,
  5242880, -- 5MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
);

create policy "kingdom_media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'kingdom-media');

create policy "kingdom_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'kingdom-media' and public.kingdom_is_admin());

create policy "kingdom_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'kingdom-media' and public.kingdom_is_admin())
  with check (bucket_id = 'kingdom-media' and public.kingdom_is_admin());

create policy "kingdom_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'kingdom-media' and public.kingdom_is_admin());

-- ============================================================================
-- 5. Seed the fixed section list (content itself is seeded separately).
-- ============================================================================
insert into public.kingdom_sections (key, label, section_group, sort_order, is_visible, is_hideable, is_reorderable) values
  ('meta',        'SEO / Metadatos',        'global',   0, true, false, false),
  ('common',      'Textos comunes',         'global',   0, true, false, false),
  ('nav',         'Navegación',             'global',   0, true, false, false),
  ('hero',        'Hero',                   'homepage', 1, true, false, false),
  ('trust',       'Cifras y confianza',     'homepage', 2, true, true,  true),
  ('ecosystem',   'Ecosistema',             'homepage', 3, true, true,  true),
  ('roi',         'Calculadora ROI',        'homepage', 4, true, true,  true),
  ('agency',      'Agency',                 'homepage', 5, true, true,  true),
  ('mediaLab',    'Media Lab',              'homepage', 6, true, true,  true),
  ('academy',     'Academy',                'homepage', 7, true, true,  true),
  ('howItWorks',  'Proceso',                'homepage', 8, true, true,  true),
  ('caseStudies', 'Resultados',             'homepage', 9, true, true,  true),
  ('socialProof', 'Testimonios',            'homepage', 10, true, true, true),
  ('comparison',  'Comparación',            'homepage', 11, true, true, true),
  ('faq',         'FAQ',                    'homepage', 12, true, true, true),
  ('pricing',     'Precios',                'homepage', 13, true, true, true),
  ('contact',     'Contacto',               'homepage', 14, true, false, true),
  ('footer',      'Footer',                 'global',   0, true, false, false),
  ('cro',         'CRO / WhatsApp',         'global',   0, true, false, false);

-- ============================================================================
-- 6. First admin invite. The owner can add more later with:
--   insert into public.kingdom_admins (email) values ('someone@example.com');
-- ============================================================================
insert into public.kingdom_admins (email) values ('contactokingdom.ve@gmail.com');
