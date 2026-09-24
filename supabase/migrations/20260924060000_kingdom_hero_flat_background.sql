-- Hero redesign: drop the eyebrow badge and trust chips (too "AI-generated
-- SaaS" looking), and let admins pick a flat hero background color instead
-- of the ambient gradient blobs. Additive/cleanup only.
--
-- Draft-only: does not touch kingdom_published, so nothing changes on the
-- live site until an admin publishes from the dashboard.

-- Text fields the component no longer renders — removed so the admin editor
-- doesn't keep showing stray "Eyebrow" / "Trust → A..D" inputs.
delete from public.kingdom_field_values
where owner_type = 'section'
  and owner_id = 'hero'
  and field_key in ('eyebrow', 'trust.a', 'trust.b', 'trust.c', 'trust.d');

-- `backgroundColor` on the existing hero media item, empty by default (site
-- falls back to its flat dark color). The admin's ItemFlags renderer now
-- shows this as a color picker.
update public.kingdom_items
set flags = flags || jsonb_build_object('backgroundColor', '')
where section_key = 'hero' and group_key = 'media' and item_key = 'primary';
