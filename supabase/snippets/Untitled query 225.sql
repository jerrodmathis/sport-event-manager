WITH inserted_event AS (
  INSERT INTO events (
    created_by,
    name,
    starts_at,
    description,
    sport_type_id,
    sport_type_text
  )
  VALUES (
    'b58981f8-5823-4e75-a1e1-964612aa7288'::uuid,
    'Saturday Pickup Basketball',
    '2026-02-07 18:30:00-05',
    'Casual 5v5 pickup. Bring a dark and a light shirt.',
    (SELECT id FROM sport_types WHERE name = 'Basketball'),
    'Basketball'
  )
  RETURNING id
)
INSERT INTO event_venues (
  event_id,
  name,
  address_text,
  details
)
SELECT
  id,
  'Downtown Recreation Center',
  '123 Main St, Springfield, MA 01103',
  'Use the south entrance; parking is free after 6pm.'
FROM inserted_event;