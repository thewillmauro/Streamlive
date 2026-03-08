-- Add is_admin column to profiles for Mission Control access
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Grant admin access to Will Mauro
UPDATE profiles SET is_admin = true WHERE email = 'will@vantagemode.com';

-- Allow service role to read is_admin (no RLS change needed since service role bypasses RLS)
