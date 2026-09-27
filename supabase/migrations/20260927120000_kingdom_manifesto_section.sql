-- New "Manifesto" homepage section: a full-bleed brand statement (shader
-- gradient background + slogan) placed right after the comparison table and
-- before the FAQ. Text fields mirror messages/{en,es}.json "manifesto".
--
-- Draft-only: does not touch kingdom_published, so the section shows up on
-- the live site once an admin publishes from the dashboard.

-- Make room right after `comparison`, relative to wherever it currently sits
-- (admins may have reordered sections since the seed).
update public.kingdom_sections
set sort_order = sort_order + 1
where section_group = 'homepage'
  and sort_order > (select sort_order from public.kingdom_sections where key = 'comparison')
  and not exists (select 1 from public.kingdom_sections where key = 'manifesto');

insert into public.kingdom_sections (key, label, section_group, sort_order, is_visible, is_hideable, is_reorderable)
select 'manifesto', 'Manifiesto', 'homepage', sort_order + 1, true, true, true
from public.kingdom_sections where key = 'comparison'
on conflict (key) do nothing;

insert into public.kingdom_field_values (owner_type, owner_id, field_key, locale, value) values
  ('section', 'manifesto', 'eyebrow', 'en', 'Our philosophy'),
  ('section', 'manifesto', 'eyebrow', 'es', 'Nuestra filosofía'),
  ('section', 'manifesto', 'titleLine1', 'en', 'Growth isn''t luck.'),
  ('section', 'manifesto', 'titleLine1', 'es', 'El crecimiento no es suerte.'),
  ('section', 'manifesto', 'titleAccent', 'en', 'It''s a system.'),
  ('section', 'manifesto', 'titleAccent', 'es', 'Es un sistema.'),
  ('section', 'manifesto', 'subtitle', 'en', 'Every visit, every message and every appointment runs through a process built to convert. Nothing is left to chance.'),
  ('section', 'manifesto', 'subtitle', 'es', 'Cada visita, cada mensaje y cada cita pasan por un proceso diseñado para convertir. Nada queda al azar.')
on conflict (owner_type, owner_id, field_key, locale) do nothing;
