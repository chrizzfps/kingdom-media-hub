-- The seed script (20260923120200) only produced {en, es} for the initial
-- snapshot. The homepage also needs section order/visibility in the same
-- atomic document — backfill it here so publish/rollback always produce a
-- consistent shape from the first snapshot onward.
update public.kingdom_published
set snapshot = snapshot || jsonb_build_object(
  'sections',
  (
    select jsonb_agg(jsonb_build_object(
      'key', key,
      'label', label,
      'group', section_group,
      'sortOrder', sort_order,
      'isVisible', is_visible,
      'isHideable', is_hideable,
      'isReorderable', is_reorderable
    ) order by sort_order)
    from public.kingdom_sections
  )
)
where id = true and not (snapshot ? 'sections');

update public.kingdom_publish_log
set snapshot = snapshot || jsonb_build_object(
  'sections',
  (
    select jsonb_agg(jsonb_build_object(
      'key', key,
      'label', label,
      'group', section_group,
      'sortOrder', sort_order,
      'isVisible', is_visible,
      'isHideable', is_hideable,
      'isReorderable', is_reorderable
    ) order by sort_order)
    from public.kingdom_sections
  )
)
where not (snapshot ? 'sections');
