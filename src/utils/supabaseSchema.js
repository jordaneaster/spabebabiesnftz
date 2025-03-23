/**
 * This file defines the database schema for the Space Babiez app.
 * Use this as a reference for table structure and relationships.
 * 
 * To implement this schema in Supabase:
 * 1. Go to your Supabase project
 * 2. Navigate to SQL Editor
 * 3. Create a new query and paste the SQL below
 * 4. Run the query to create the tables
 */

/*
SQL to create tables:

-- Users table
CREATE TABLE IF NOT EXISTS space_baby_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Space Babies table
CREATE TABLE IF NOT EXISTS space_babies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES space_baby_users(id),
  wallet_address TEXT NOT NULL,
  name TEXT,
  image_url TEXT,
  metadata_uri TEXT,
  metadata_url TEXT,
  attributes JSONB,
  soul_generation_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  transaction_hash TEXT
);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS space_babies_wallet_idx ON space_babies(wallet_address);
*/

// Helper functions to get schema info
export const TABLES = {
  USERS: 'space_baby_users',
  BABIES: 'space_babies'
};

export default TABLES;
