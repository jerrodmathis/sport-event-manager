SELECT e.*, ev.* FROM events e
LEFT JOIN event_venues ev ON ev.event_id = e.id
ORDER BY e.starts_at DESC;