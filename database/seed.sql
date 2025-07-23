-- Database Seed Data for Incident Monitoring System
-- Run this in Supabase SQL Editor to populate with realistic test data

-- Clear existing data (optional - remove if you want to keep current data)
-- DELETE FROM incidents;
-- DELETE FROM cameras;

-- Insert cameras
INSERT INTO cameras (name, location, image_url, is_active) VALUES
('Camera - 01', 'Shop Floor A', '/images/cam1.gif', true),
('Camera - 02', 'Vault Area', '/images/cam2.gif', true),
('Camera - 03', 'Main Entrance', '/images/cam3.gif', true),
('Camera - 04', 'Loading Dock', '/images/cam1.gif', true),
('Camera - 05', 'Office Corridor', '/images/cam2.gif', true);

-- Insert incidents with realistic 24-hour timeline
INSERT INTO incidents (type, camera_location, start_time, end_time, thumbnail_url, status, metadata) VALUES

-- Early Morning (00:00 - 06:00)
('Unauthorised Access', 'Loading Dock Camera', '2025-01-23 02:15:00', '2025-01-23 02:17:30', '/images/cam1.gif', 'unresolved', '{"severity": "high", "confidence": 0.89, "person_count": 1}'),
('Motion Detection', 'Main Entrance Camera', '2025-01-23 03:45:00', '2025-01-23 03:46:15', '/images/cam3.gif', 'resolved', '{"severity": "low", "confidence": 0.65, "false_alarm": true}'),
('Face Recognised', 'Vault Area Camera', '2025-01-23 05:30:00', '2025-01-23 05:31:00', '/images/cam2.gif', 'resolved', '{"severity": "medium", "confidence": 0.92, "person_id": "employee_001"}'),

-- Morning Shift (06:00 - 12:00)
('Unauthorised Access', 'Shop Floor A Camera', '2025-01-23 07:20:00', '2025-01-23 07:23:45', '/images/cam1.gif', 'unresolved', '{"severity": "medium", "confidence": 0.78, "person_count": 2}'),
('Gun Threat', 'Main Entrance Camera', '2025-01-23 08:45:00', '2025-01-23 08:47:30', '/images/cam3.gif', 'unresolved', '{"severity": "critical", "confidence": 0.95, "weapon_type": "handgun"}'),
('Face Recognised', 'Office Corridor Camera', '2025-01-23 09:15:00', '2025-01-23 09:15:30', '/images/cam2.gif', 'resolved', '{"severity": "low", "confidence": 0.88, "person_id": "employee_045"}'),
('Loitering', 'Loading Dock Camera', '2025-01-23 10:30:00', '2025-01-23 10:35:20', '/images/cam1.gif', 'resolved', '{"severity": "medium", "confidence": 0.72, "duration_minutes": 5}'),
('Unauthorised Access', 'Vault Area Camera', '2025-01-23 11:45:00', '2025-01-23 11:48:15', '/images/cam2.gif', 'unresolved', '{"severity": "high", "confidence": 0.91, "access_attempt": "keypad"}'),

-- Afternoon Shift (12:00 - 18:00)
('Violence Detection', 'Shop Floor A Camera', '2025-01-23 13:20:00', '2025-01-23 13:22:45', '/images/cam1.gif', 'unresolved', '{"severity": "high", "confidence": 0.84, "person_count": 3}'),
('Gun Threat', 'Vault Area Camera', '2025-01-23 14:35:00', '2025-01-23 14:37:20', '/images/cam2.gif', 'unresolved', '{"severity": "critical", "confidence": 0.93, "weapon_type": "rifle"}'),
('Face Recognised', 'Main Entrance Camera', '2025-01-23 15:10:00', '2025-01-23 15:10:45', '/images/cam3.gif', 'resolved', '{"severity": "low", "confidence": 0.96, "person_id": "visitor_012"}'),
('Unauthorised Access', 'Office Corridor Camera', '2025-01-23 16:25:00', '2025-01-23 16:28:30', '/images/cam2.gif', 'unresolved', '{"severity": "medium", "confidence": 0.81, "door_forced": true}'),

-- Evening Shift (18:00 - 24:00)
('Theft Detection', 'Shop Floor A Camera', '2025-01-23 19:40:00', '2025-01-23 19:43:15', '/images/cam1.gif', 'unresolved', '{"severity": "high", "confidence": 0.87, "item_removed": "equipment"}'),
('Gun Threat', 'Loading Dock Camera', '2025-01-23 20:15:00', '2025-01-23 20:17:45', '/images/cam1.gif', 'unresolved', '{"severity": "critical", "confidence": 0.91, "weapon_type": "handgun"}'),
('Unauthorised Access', 'Main Entrance Camera', '2025-01-23 21:30:00', '2025-01-23 21:33:20', '/images/cam3.gif', 'unresolved', '{"severity": "high", "confidence": 0.86, "after_hours": true}'),
('Vandalism', 'Vault Area Camera', '2025-01-23 22:45:00', '2025-01-23 22:47:30', '/images/cam2.gif', 'resolved', '{"severity": "medium", "confidence": 0.79, "property_damage": true}'),

-- Late Night (Previous Day for Historical Data)
('Face Recognised', 'Office Corridor Camera', '2025-01-22 23:15:00', '2025-01-22 23:15:30', '/images/cam2.gif', 'resolved', '{"severity": "low", "confidence": 0.94, "person_id": "security_003"}'),
('Motion Detection', 'Shop Floor A Camera', '2025-01-22 23:50:00', '2025-01-22 23:51:15', '/images/cam1.gif', 'resolved', '{"severity": "low", "confidence": 0.68, "false_alarm": true}');

-- Update some incidents to resolved status with timestamps
UPDATE incidents SET 
  status = 'resolved', 
  resolved_at = start_time + INTERVAL '2 hours'
WHERE type IN ('Motion Detection', 'Face Recognised', 'Loitering', 'Vandalism')
  AND status = 'unresolved';

-- Create some additional historical resolved incidents
INSERT INTO incidents (type, camera_location, start_time, end_time, thumbnail_url, status, resolved_at, metadata) VALUES
('Unauthorised Access', 'Shop Floor A Camera', '2025-01-22 14:20:00', '2025-01-22 14:23:00', '/images/cam1.gif', 'resolved', '2025-01-22 16:30:00', '{"severity": "medium", "confidence": 0.75}'),
('Gun Threat', 'Main Entrance Camera', '2025-01-22 16:45:00', '2025-01-22 16:48:00', '/images/cam3.gif', 'resolved', '2025-01-22 17:15:00', '{"severity": "critical", "confidence": 0.88}'),
('Violence Detection', 'Vault Area Camera', '2025-01-22 18:30:00', '2025-01-22 18:33:00', '/images/cam2.gif', 'resolved', '2025-01-22 19:00:00', '{"severity": "high", "confidence": 0.82}');

-- Verify the data
SELECT 
  'SUMMARY' as info,
  COUNT(*) as total_incidents,
  COUNT(CASE WHEN status = 'unresolved' THEN 1 END) as unresolved,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
FROM incidents

UNION ALL

SELECT 
  'BY TYPE' as info,
  type as total_incidents,
  COUNT(*) as unresolved,
  '' as resolved
FROM incidents 
GROUP BY type
ORDER BY info, total_incidents;