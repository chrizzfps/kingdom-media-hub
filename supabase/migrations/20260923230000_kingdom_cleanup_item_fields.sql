-- kingdom_field_values.owner_id is polymorphic (section key or item id), so it
-- can't carry a foreign key. Remove an item's text rows when the item goes,
-- including nested items removed by the parent_item_id cascade.
create function public.kingdom_delete_item_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.kingdom_field_values
  where owner_type = 'item' and owner_id = old.id::text;
  return old;
end;
$$;

revoke execute on function public.kingdom_delete_item_fields() from public, anon, authenticated;

create trigger kingdom_on_item_deleted
  after delete on public.kingdom_items
  for each row execute function public.kingdom_delete_item_fields();
