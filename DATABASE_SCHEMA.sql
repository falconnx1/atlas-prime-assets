-- ========================================
-- ATLAS PRIME ASSETS - COMPLETE DATABASE
-- ========================================
-- Run this in Supabase SQL Editor

-- 1. USERS TABLE (already created from signup)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  investor_type TEXT,
  company_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  has_off_market_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT,
  terrain_type TEXT NOT NULL, -- urbain, agricultural, industrial, touristic
  surface_area TEXT NOT NULL,
  description TEXT,
  potential TEXT,
  price TEXT,
  status TEXT DEFAULT 'available', -- available, compromised, sold
  is_off_market BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. LISTING IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. LISTING DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.listing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  document_url TEXT NOT NULL,
  document_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. OFF MARKET ACCESS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(investor_id, listing_id)
);

-- 6. CONTACT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  request_type TEXT NOT NULL, -- contact, property_info, off_market_access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. PARTNERSHIP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.partnership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  partnership_type TEXT NOT NULL, -- joint_venture, property_management, agent_network
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. LAND SUBMISSION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.land_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  terrain_type TEXT NOT NULL,
  surface_area TEXT,
  description TEXT,
  price_expectation TEXT,
  documents_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- USERS TABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE
  );

-- LISTINGS TABLE RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published listings are public" ON public.listings;
CREATE POLICY "Published listings are public" ON public.listings
  FOR SELECT USING (is_published = TRUE AND is_off_market = FALSE);

DROP POLICY IF EXISTS "Admins can manage own listings" ON public.listings;
CREATE POLICY "Admins can manage own listings" ON public.listings
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

DROP POLICY IF EXISTS "Approved investors can see off market" ON public.listings;
CREATE POLICY "Approved investors can see off market" ON public.listings
  FOR SELECT USING (
    is_off_market = FALSE OR 
    (SELECT has_off_market_access FROM public.users WHERE id = auth.uid()) = TRUE
  );

-- LISTING IMAGES RLS
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read listing images" ON public.listing_images;
CREATE POLICY "Everyone can read listing images" ON public.listing_images
  FOR SELECT USING (TRUE);

-- LISTING DOCUMENTS RLS
ALTER TABLE public.listing_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read listing documents" ON public.listing_documents;
CREATE POLICY "Everyone can read listing documents" ON public.listing_documents
  FOR SELECT USING (TRUE);

-- ACCESS REQUESTS RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own requests" ON public.access_requests;
CREATE POLICY "Users can read own requests" ON public.access_requests
  FOR SELECT USING (investor_id = auth.uid());

DROP POLICY IF EXISTS "Users can create requests" ON public.access_requests;
CREATE POLICY "Users can create requests" ON public.access_requests
  FOR INSERT WITH CHECK (investor_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage requests" ON public.access_requests;
CREATE POLICY "Admins can manage requests" ON public.access_requests
  USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- OTHER TABLES - Allow everyone to insert
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can create contact requests" ON public.contact_requests;
CREATE POLICY "Everyone can create contact requests" ON public.contact_requests
  FOR INSERT WITH CHECK (TRUE);

ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can create partnership requests" ON public.partnership_requests;
CREATE POLICY "Everyone can create partnership requests" ON public.partnership_requests
  FOR INSERT WITH CHECK (TRUE);

ALTER TABLE public.land_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Everyone can create land submissions" ON public.land_submissions;
CREATE POLICY "Everyone can create land submissions" ON public.land_submissions
  FOR INSERT WITH CHECK (TRUE);

-- ========================================
-- STORAGE BUCKETS
-- ========================================

-- Create buckets for images and documents
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('listing-documents', 'listing-documents', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('land-submissions', 'land-submissions', true)
ON CONFLICT DO NOTHING;

-- ========================================
-- TRIGGER FOR NEW USER PROFILE
-- ========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, phone, investor_type, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'investor_type',
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
