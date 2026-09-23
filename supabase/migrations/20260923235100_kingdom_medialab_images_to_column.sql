-- The generic seed walker treats every string leaf as a translatable text
-- field, so mediaLab's new `imageUrl` leaf landed as a kingdom_field_values
-- row instead of the dedicated kingdom_items.image_url column the admin
-- panel's image uploader reads/writes. Move it to the column (same value,
-- same locale-independent URL) so "Reemplazar imagen" in /admin shows the
-- current image instead of "Añadir imagen".
update public.kingdom_items i
set image_url = f.value, updated_at = now()
from public.kingdom_field_values f
where f.owner_type = 'item' and f.owner_id = i.id::text and f.field_key = 'imageUrl' and f.locale = 'en'
  and i.section_key = 'mediaLab' and i.group_key = 'projects';

delete from public.kingdom_field_values
where owner_type = 'item' and field_key = 'imageUrl'
  and owner_id in (select id::text from public.kingdom_items where section_key = 'mediaLab' and group_key = 'projects');

-- imageAlt defaults to each project's title so the <img alt> is never empty.
insert into public.kingdom_field_values (owner_type, owner_id, field_key, locale, value)
select 'item', i.id::text, 'imageAlt', t.locale, t.value
from public.kingdom_items i
join public.kingdom_field_values t
  on t.owner_type = 'item' and t.owner_id = i.id::text and t.field_key = 'title'
where i.section_key = 'mediaLab' and i.group_key = 'projects'
on conflict (owner_type, owner_id, field_key, locale) do nothing;
