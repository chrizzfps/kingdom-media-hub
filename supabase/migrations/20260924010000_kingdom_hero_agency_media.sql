-- Optional media for Hero (video/image) and the three Agency service blocks
-- (image). Additive only: no column or RLS changes — `kingdom_items.image_url`
-- and `flags` already exist and the admin's ItemImage/ItemFlags controls
-- already render for any item. This only (1) lets the existing storage
-- bucket accept a small MP4 alongside images, and (2) seeds one singleton
-- item per media slot so the upload UI has something to attach to.
--
-- Draft-only: does not touch kingdom_published, so nothing changes on the
-- live site until an admin publishes from the dashboard.

update storage.buckets
set
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4'],
  file_size_limit = 20971520 -- 20MB, video needs more headroom than the 5MB image cap
where id = 'kingdom-media';

-- `flags` keys are pre-populated (rather than left `{}`) so the admin's
-- generic ItemFlags renderer has something to render immediately: `videoUrl`
-- gets a video upload control, `mobileImageUrl` an image upload control, and
-- `focus` a crop/position select. Empty string means "not set".
insert into public.kingdom_items (section_key, group_key, item_key, sort_order, flags) values
  ('hero', 'media', 'primary', 0, jsonb_build_object('videoUrl', '', 'mobileImageUrl', '', 'focus', 'center'));

-- Agency service images: plain items, no extra flags — image_url + imageAlt
-- (via the existing ItemImage control) is all each service needs.
insert into public.kingdom_items (section_key, group_key, item_key, sort_order, flags) values
  ('agency', 'voice.media', 'primary', 0, '{}'::jsonb),
  ('agency', 'automation.media', 'primary', 0, '{}'::jsonb),
  ('agency', 'websites.media', 'primary', 0, '{}'::jsonb);
