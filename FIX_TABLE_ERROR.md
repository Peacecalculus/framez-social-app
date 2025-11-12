# 🔧 FIXING: "Could not find table 'public.users'" Error

## ✅ Problem Identified

The error means:
- ✅ Your app is running correctly
- ✅ Supabase connection is working
- ❌ The `users` table doesn't exist in your Supabase database yet

**You need to create the database tables!**

---

## 🚀 Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Click on your **Framez** project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run This SQL
1. Click **"New query"**
2. **Copy and paste this ENTIRE script**:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caption TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  user_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- Anyone can read posts
CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can only update/delete their own posts
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
```

3. Click **"RUN"** (or press F5)
4. You should see: **"Success. No rows returned"** ✅

---

## ✅ Step 3: Verify Tables Were Created

1. In Supabase dashboard, click **"Table Editor"** (left sidebar)
2. You should now see:
   - ✅ `users` table
   - ✅ `posts` table

---

## ✅ Step 4: Enable Realtime (Important!)

1. Click **"Database"** → **"Replication"** (left sidebar)
2. Find the **`posts`** table
3. Toggle **"Realtime"** to **ON** 🟢

---

## ✅ Step 5: Create Storage Bucket

1. Click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Name: **`posts`** (exactly this!)
4. **Public bucket**: Toggle **ON** ✅
5. Click **"Create bucket"**

---

## ✅ Step 6: Add Storage Policies

1. Click on the **`posts`** bucket
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Add these 3 policies:

**Policy 1: View images**
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');
```
Click **"Review"** → **"Save policy"**

**Policy 2: Upload images**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');
```
Click **"Review"** → **"Save policy"**

**Policy 3: Delete own images**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
```
Click **"Review"** → **"Save policy"**

---

## ✅ Step 7: Disable Email Confirmation (For Testing)

1. Click **"Authentication"** → **"Providers"**
2. Click on **"Email"**
3. Find **"Confirm email"**
4. Toggle it **OFF** 🔴
5. Click **"Save"**

---

## 🚀 Step 8: Test Again!

1. Go back to your app (Metro bundler should still be running)
2. Shake your device or press **R** to reload
3. Try to register a new user

**It should work now!** ✅

---

## 🐛 If You Still Get Errors

### Error: "relation 'public.users' does not exist"
**Fix**: Make sure you ran the SQL in Step 2

### Error: "new row violates row-level security policy"
**Fix**: Make sure you ran ALL the policies in Step 2

### Error: "permission denied for table users"
**Fix**: 
1. Go to **Table Editor** → `users` table
2. Click **"RLS policies"** at the top
3. Make sure policies are enabled

### Error: "storage bucket not found"
**Fix**: Go back to Step 5 and create the `posts` bucket

---

## ✅ Quick Verification Checklist

After running the SQL, verify in Supabase:

- [ ] **Table Editor** shows `users` table
- [ ] **Table Editor** shows `posts` table
- [ ] **Database → Replication** shows `posts` with Realtime ON
- [ ] **Storage** shows `posts` bucket (public)
- [ ] **Storage → posts → Policies** shows 3 policies
- [ ] **Authentication → Providers → Email** has "Confirm email" OFF

---

## 🎉 Success Signs

After fixing, you should see:
- ✅ No more errors in Metro bundler
- ✅ Registration completes successfully
- ✅ "Account created successfully!" alert
- ✅ Redirected to Feed screen

---

## 📝 What Happened?

**The Issue**: 
You configured Supabase credentials in `supabase.js` but didn't create the database tables yet.

**The Fix**: 
Running the SQL script creates:
1. ✅ `users` table - stores user profiles
2. ✅ `posts` table - stores all posts
3. ✅ RLS policies - security rules
4. ✅ Indexes - faster queries
5. ✅ Storage bucket - for images

---

## 💡 Why This Matters

Without these tables:
- ❌ Can't store user data → Registration fails
- ❌ Can't store posts → Create post fails
- ❌ Can't upload images → Image upload fails

With these tables:
- ✅ Registration works
- ✅ Login works
- ✅ Posts work
- ✅ Images work
- ✅ Everything works!

---

## 🚀 After This is Fixed

Once the tables are created, your app will:
1. ✅ Let users register
2. ✅ Store user data in `users` table
3. ✅ Let users create posts
4. ✅ Store posts in `posts` table
5. ✅ Upload images to `posts` bucket
6. ✅ Show feed in real-time

---

## ⏱️ Time to Fix

**Total time**: 5 minutes
- Step 1-2: 2 min (Run SQL)
- Step 3-4: 1 min (Verify & enable Realtime)
- Step 5-6: 2 min (Storage setup)
- Step 7: 30 sec (Disable email confirmation)

---

## 📞 Still Having Issues?

If you get errors after running the SQL:

1. **Check the SQL ran successfully** - Should say "Success"
2. **Refresh Supabase dashboard** - Press F5
3. **Check Table Editor** - Tables should appear
4. **Try registration again** - Should work now

If none of this works, share the error message and I'll help!

---

**Now go run that SQL and your app will work! 🚀**

**Copy the SQL from Step 2 → Paste in Supabase SQL Editor → Click RUN → Done!** ✅
