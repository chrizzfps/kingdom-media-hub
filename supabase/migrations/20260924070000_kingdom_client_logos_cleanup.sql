-- The clientLogos placeholder items shipped with fake company names as their
-- single 'value' text field, which the CMS's generic buildItemNode collapses
-- into bare strings (see lib/cms/build-snapshot.ts). Real client logos are
-- images, not text: drop the fake names, give each item an empty imageAlt
-- field instead (that's what makes buildItemNode treat the item as
-- {id, imageUrl, imageAlt} instead of collapsing it to a string, and it's the
-- template "+ Añadir" copies for new items in /admin), clear any leftover
-- image_url, and hide every item until a real logo is uploaded.
delete from public.kingdom_field_values
where owner_type = 'item' and field_key = 'value'
  and owner_id in (
    select id::text from public.kingdom_items
    where section_key = 'common' and group_key = 'clientLogos'
  );

insert into public.kingdom_field_values (owner_type, owner_id, field_key, locale, value)
select 'item', i.id::text, 'imageAlt', l.locale, ''
from public.kingdom_items i
cross join (values ('en'), ('es')) as l(locale)
where i.section_key = 'common' and i.group_key = 'clientLogos'
on conflict (owner_type, owner_id, field_key, locale) do nothing;

update public.kingdom_items
set is_visible = false, image_url = null, updated_at = now()
where section_key = 'common' and group_key = 'clientLogos';
