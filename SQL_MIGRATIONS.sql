-- Supabase Database Migrations for Telugu Astrology App
-- Run these in Supabase SQL Editor

-- Users Profile Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  gender TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  birth_latitude DECIMAL(10, 8),
  birth_longitude DECIMAL(11, 8),
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved Kundalis/Charts
CREATE TABLE IF NOT EXISTS saved_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  birth_data JSONB NOT NULL,
  chart_type TEXT DEFAULT 'kundali',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved Matchmaking Reports
CREATE TABLE IF NOT EXISTS saved_matchings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  person_1_chart_id UUID REFERENCES saved_charts(id),
  person_2_chart_id UUID REFERENCES saved_charts(id),
  matching_data JSONB NOT NULL,
  guna_score INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_matchings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for saved_charts
CREATE POLICY "Users can read own charts"
  ON saved_charts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charts"
  ON saved_charts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts"
  ON saved_charts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts"
  ON saved_charts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for saved_matchings
CREATE POLICY "Users can read own matchings"
  ON saved_matchings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own matchings"
  ON saved_matchings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own matchings"
  ON saved_matchings FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_charts_user_id ON saved_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_matchings_user_id ON saved_matchings(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
