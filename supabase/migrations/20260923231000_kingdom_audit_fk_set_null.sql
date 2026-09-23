-- auth.users is shared with Omni. Audit columns must never block deleting a
-- user there, so they fall back to null instead of restricting the delete.
alter table public.kingdom_sections
  drop constraint kingdom_sections_updated_by_fkey,
  add constraint kingdom_sections_updated_by_fkey foreign key (updated_by) references auth.users(id) on delete set null;

alter table public.kingdom_items
  drop constraint kingdom_items_updated_by_fkey,
  add constraint kingdom_items_updated_by_fkey foreign key (updated_by) references auth.users(id) on delete set null;

alter table public.kingdom_field_values
  drop constraint kingdom_field_values_updated_by_fkey,
  add constraint kingdom_field_values_updated_by_fkey foreign key (updated_by) references auth.users(id) on delete set null;

alter table public.kingdom_publish_log
  drop constraint kingdom_publish_log_published_by_fkey,
  add constraint kingdom_publish_log_published_by_fkey foreign key (published_by) references auth.users(id) on delete set null;
