-- Incident Monitoring System Database Schema
-- Supabase PostgreSQL Database

-- Create incidents table
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  camera_location VARCHAR(100) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  thumbnail_url TEXT,
  status VARCHAR(20) DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'resolved')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Create cameras table
CREATE TABLE cameras (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample camera data
INSERT INTO cameras (name, location, image_url) VALUES
('Camera - 01', 'Shop Floor A', '/images/cam1.gif'),
('Camera - 02', 'Shop Floor B', '/images/cam2.gif'),
('Camera - 03', 'Shop Floor C', '/images/cam3.gif');

-- Insert sample user data (password is 'admin123' hashed with bcrypt)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@securesight.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin'),
('user', 'user@securesight.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'user');

-- Insert sample incident data
INSERT INTO incidents (type, camera_location, start_time, end_time, thumbnail_url, metadata, status) VALUES
('Unauthorised Access', 'Shop Floor Camera A', '2025-07-07 14:35:00', '2025-07-07 14:37:00', '/images/cam1.gif', '{"severity": "medium", "confidence": 0.85}', 'unresolved'),
('Gun Threat', 'Shop Floor Camera A', '2025-07-07 14:35:00', '2025-07-07 14:37:00', '/images/cam2.gif', '{"severity": "high", "confidence": 0.92}', 'unresolved'),
('Unauthorised Access', 'Shop Floor Camera A', '2025-07-07 14:35:00', '2025-07-07 14:37:00', '/images/cam3.gif', '{"severity": "medium", "confidence": 0.78}', 'unresolved'),
('Unauthorised Access', 'Shop Floor Camera B', '2025-07-07 13:20:00', '2025-07-07 13:22:00', '/images/cam1.gif', '{"severity": "low", "confidence": 0.65}', 'unresolved'),
('Gun Threat', 'Shop Floor Camera C', '2025-07-07 12:15:00', '2025-07-07 12:17:00', '/images/cam2.gif', '{"severity": "high", "confidence": 0.95}', 'unresolved'),
('Accident', 'Shop Floor Camera A', '2025-07-08 09:10:00', '2025-07-08 09:15:00', '/images/cam1.gif', '{"severity": "medium", "confidence": 0.80}', 'unresolved'),
('Murder', 'Shop Floor Camera B', '2025-07-08 10:20:00', '2025-07-08 10:25:00', '/images/cam2.gif', '{"severity": "high", "confidence": 0.99}', 'unresolved'),
('Chain Snatching', 'Shop Floor Camera C', '2025-07-08 11:30:00', '2025-07-08 11:35:00', '/images/cam3.gif', '{"severity": "medium", "confidence": 0.75}', 'unresolved');

-- Create indexes for better performance
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incidents_type ON incidents(type);

-- Enable Row Level Security (RLS)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth requirements)
CREATE POLICY "Allow public read access on incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on incidents" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on incidents" ON incidents FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on cameras" ON cameras FOR SELECT USING (true);

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);

-- Create a function to automatically set resolved_at when status changes to resolved
CREATE OR REPLACE FUNCTION set_resolved_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
  ELSIF NEW.status != 'resolved' THEN
    NEW.resolved_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the resolved timestamp
CREATE TRIGGER trigger_set_resolved_timestamp
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION set_resolved_timestamp();