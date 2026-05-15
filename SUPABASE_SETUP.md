# Supabase Setup Guide for Atlas Prime Assets

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"** button
4. Fill in the project details:
   - **Name**: `atlas-prime-assets` (or your preferred name)
   - **Database Password**: Create a strong password (save this safely!)
   - **Region**: Choose the region closest to your users (e.g., `Europe (Ireland)`)
5. Click **"Create new project"** and wait for it to initialize (2-3 minutes)

## Step 2: Get Your Credentials

1. Once the project is created, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Key** (the public anonymous key)
3. Save these values safely

## Step 3: Configure Your Environment

1. In your project root, create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual credentials from Step 2.

## Step 4: Create Users Table (Optional)

For additional user data storage beyond Supabase Auth:

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query and paste:

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  investor_type TEXT,
  company_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only read their own data
CREATE POLICY "Users can read their own data" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Create policy so users can update their own data
CREATE POLICY "Users can update their own data" 
  ON users 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy so users can insert their own data
CREATE POLICY "Users can insert their own data" 
  ON users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

3. Click **Run** to execute the query

## Step 5: Update Your Signup Form (Already Done!)

The signup form in `src/components/SignupForm.jsx` is already configured to:
- Create a new user in Supabase Authentication
- Store additional metadata (first name, last name, phone, investor type)
- Handle errors gracefully
- Provide user feedback

## Step 6: Test the Signup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the signup page ("Espace Investisseur" button)
3. Fill in the form and submit
4. Check Supabase dashboard → **Authentication** to see the new user

## Available Functions

### Import Supabase Client

```javascript
import { supabase } from "../lib/supabaseClient";
```

### Common Operations

**Get current user:**
```javascript
const { data: { user } } = await supabase.auth.getUser();
```

**Sign out:**
```javascript
await supabase.auth.signOut();
```

**Sign in:**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123"
});
```

**Update user metadata:**
```javascript
await supabase.auth.updateUser({
  data: { investor_type: "new-type" }
});
```

## Troubleshooting

- **"Cannot connect to Supabase"**: Check your API URL and Anon Key in `.env.local`
- **"Email already registered"**: User already exists in the system
- **"Invalid email"**: Check email format
- **"CORS errors"**: This shouldn't happen with Supabase public API

## Next Steps

1. Create a login component using `supabase.auth.signInWithPassword()`
2. Create a password reset flow using `supabase.auth.resetPasswordForEmail()`
3. Add email verification flow
4. Create a profile edit page with user data management
5. Implement protected routes using authenticated user state

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
