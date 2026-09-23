-- Merges origin/feat/landing-page-layout into the CMS's draft tables: a new
-- "Marketing" section, mediaLab project images, and text updates across
-- several sections (AI Voice Agent -> AI Virtual Assistant rename, contact
-- form direct-contact block, form placeholders). See
-- 20260923120200_kingdom_content_seed.sql for the table shapes this extends.
--
-- The full generated field-value payload (~750 rows, upserted) lives outside
-- this file for size — see the "Kingdom CMS" section of the project handoff
-- notes for how to regenerate it from messages/{en,es}.json if ever needed.

insert into public.kingdom_sections (key, label, section_group, sort_order, is_visible, is_hideable, is_reorderable) values
  ('marketing', 'Marketing', 'homepage', 7, true, true, true)
on conflict (key) do nothing;

update public.kingdom_sections
set sort_order = sort_order + 1
where key in ('academy', 'howItWorks', 'caseStudies', 'socialProof', 'comparison', 'faq', 'pricing', 'contact');

-- agency.websites.priceLabel / agency.websites.price were removed from the
-- Agency section's featured "websites" card in the merged layout.
delete from public.kingdom_field_values
where owner_type = 'section' and owner_id = 'agency' and field_key in ('websites.priceLabel', 'websites.price');
