-- PubPal Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stops table
CREATE TABLE stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lon DECIMAL(11, 8),
  rule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores table
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  stop_id UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  strokes INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, stop_id)
);

-- Chat rooms table
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT event_or_team CHECK (
    (event_id IS NOT NULL AND team_id IS NULL) OR
    (event_id IS NULL AND team_id IS NOT NULL)
  )
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  body TEXT,
  attachment_url TEXT,
  reactions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teams_event_id ON teams(event_id);
CREATE INDEX idx_members_team_id ON members(team_id);
CREATE INDEX idx_stops_event_id ON stops(event_id);
CREATE INDEX idx_scores_event_id ON scores(event_id);
CREATE INDEX idx_scores_team_id ON scores(team_id);
CREATE INDEX idx_scores_stop_id ON scores(stop_id);
CREATE INDEX idx_chat_rooms_event_id ON chat_rooms(event_id);
CREATE INDEX idx_chat_rooms_team_id ON chat_rooms(team_id);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for now - customize based on auth requirements)
CREATE POLICY "Allow all on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on stops" ON stops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on scores" ON scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on chat_rooms" ON chat_rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on chat_messages" ON chat_messages FOR ALL USING (true) WITH CHECK (true);

-- Function to generate random join codes
CREATE OR REPLACE FUNCTION generate_join_code(length INTEGER DEFAULT 6)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on events
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
