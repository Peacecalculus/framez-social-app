# Supabase Setup Guide for Framez

This guide will walk you through setting up Supabase for the Framez application.

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Enter project details:
   - Name: `Framez` (or any name you prefer)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (~2 minutes)

## Step 2: Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

## Step 3: Update Supabase Configuration

Replace the configuration in `src/config/supabase.js`:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## Step 4: Create Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy and paste this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caption TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT,
  user_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can only update/delete their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

4. Click **RUN** to execute the SQL

## Step 5: Enable Realtime

1. Go to **Database** → **Replication**
2. Find the `posts` table
3. Enable "Realtime" toggle
4. This allows real-time updates when new posts are created

## Step 6: Set Up Storage for Images

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Bucket settings:
   - Name: `posts`
   - Public bucket: **YES** (toggle on)
4. Click **Create bucket**

## Step 7: Set Storage Policies

1. Click on the `posts` bucket
2. Go to **Policies** tab
3. Click **New policy**
4. Add these policies:

**SELECT Policy (View images):**
```sql
-- Policy name: Anyone can view post images
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
IN storage.posts
USING (true);
```

**INSERT Policy (Upload images):**
```sql
-- Policy name: Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
IN storage.posts
WITH CHECK (auth.role() = 'authenticated');
```

**DELETE Policy (Delete own images):**
```sql
-- Policy name: Users can delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
IN storage.posts
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 8: Configure Authentication

1. Go to **Authentication** → **Providers**
2. **Email** provider is enabled by default
3. **Settings to configure:**
   - **Enable email confirmations**: Optional (disable for development)
   - **Minimum password length**: 6 characters (default)

### Disable Email Confirmation (for development):
1. Go to **Authentication** → **Settings**
2. Scroll to "Email Auth"
3. Toggle OFF "Enable email confirmations"
4. This allows instant registration without email verification

## Step 9: Database Structure Summary

Your Supabase database will have these tables:

### `users` Table
```
- id (UUID, Primary Key)
- email (TEXT)
- display_name (TEXT)
- photo_url (TEXT)
- created_at (TIMESTAMP)
```

### `posts` Table
```
- id (UUID, Primary Key)
- caption (TEXT)
- image_url (TEXT)
- user_id (UUID, Foreign Key → users.id)
- user_name (TEXT)
- user_photo (TEXT)
- created_at (TIMESTAMP)
```

### `posts` Storage Bucket
```
- Public bucket for post images
- Path structure: {user_id}/{timestamp}.jpg
```

## Step 10: Test Your Setup

1. Make sure you've updated `src/config/supabase.js`
2. Run the app: `npm start`
3. Try to register a new user
4. Check Supabase Dashboard:
   - **Authentication** → **Users** (should see new user)
   - **Table Editor** → `users` (should see user data)
5. Create a post with image
6. Check **Storage** → `posts` (should see uploaded image)
7. Check **Table Editor** → `posts` (should see post data)

## Troubleshooting

### "Invalid API key"
- Double-check your `supabaseUrl` and `supabaseAnonKey`
- Make sure there are no extra spaces or quotes
- Verify you're using the **anon/public** key, not the service_role key

### "Row Level Security policy violation"
- Make sure all RLS policies are created
- Check that users table policies allow reads
- Verify posts table policies allow inserts for authenticated users

### "Storage: Object does not exist"
- Verify the `posts` bucket is created
- Check that storage policies are set up
- Make sure bucket is set to **Public**

### "Cannot insert into users table"
- The users table is automatically populated on signup
- If errors persist, check RLS policies
- Verify foreign key relationship is correct

### "Realtime not working"
- Enable Realtime replication for `posts` table
- Check that Realtime is enabled in project settings
- Restart the app after enabling Realtime

## Security Best Practices

### Development vs Production

**Development (Current Setup):**
- Email confirmation: Disabled
- Public bucket: Enabled
- RLS: Enabled with permissive policies

**Production (Recommended Changes):**
1. Enable email confirmations
2. Add rate limiting for post creation
3. Implement content moderation
4. Add file size limits for images
5. Set up database backups
6. Enable 2FA for Supabase account

### Additional Security

```sql
-- Limit post creation rate (advanced)
CREATE OR REPLACE FUNCTION check_post_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM posts
    WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_rate_limit
  BEFORE INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION check_post_rate_limit();
```

## Supabase vs Firebase Comparison

| Feature | Firebase | Supabase | Winner |
|---------|----------|----------|--------|
| Database | Firestore (NoSQL) | PostgreSQL (SQL) | Supabase |
| Pricing | Pay-as-you-go | More generous free tier | Supabase |
| Open Source | No | Yes | Supabase |
| Realtime | Yes | Yes | Tie |
| Storage | Yes | Yes | Tie |
| Auth | Yes | Yes | Tie |
| Learning Curve | Easier | Moderate | Firebase |

## Advantages of Supabase

1. **Open Source**: Can self-host if needed
2. **PostgreSQL**: More powerful queries, relations, and data integrity
3. **Better Free Tier**: 
   - 500MB database
   - 1GB file storage
   - 50,000 monthly active users
4. **SQL**: Industry-standard database language
5. **Real-time**: Built on PostgreSQL's native capabilities
6. **Dashboard**: Excellent UI for managing data

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

## Quick Reference

### Common Supabase Commands in App

```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email, password
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Insert data
const { data, error } = await supabase
  .from('posts')
  .insert([{ caption, user_id }]);

// Query data
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// Real-time subscription
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, callback)
  .subscribe();

// Upload to storage
const { data, error } = await supabase.storage
  .from('posts')
  .upload(fileName, file);

// Get public URL
const { data } = supabase.storage
  .from('posts')
  .getPublicUrl(fileName);
```

---

**Important**: Never commit your actual Supabase credentials to a public repository! Use environment variables.

**Next Steps**: After setup, run `npm start` and test the app!
