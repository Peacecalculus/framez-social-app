# ⚡ Quick Start Guide - Framez

Get Framez running in 5 minutes!

## 🚀 Fast Setup (3 Steps)

### Step 1: Install Dependencies (2 minutes)
```bash
cd "C:\Users\Peace\Downloads\Social app\Framez"
npm install
```

### Step 2: Configure Supabase (2 minutes)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project → Wait for provisioning
3. Go to **Settings** → **API** → Copy Project URL and anon key
4. Copy your config to `src/config/supabase.js`:
```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```
5. Go to **SQL Editor** → Run this query:
```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

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

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);
```
6. Go to **Storage** → Create bucket named `posts` → Make it **Public**

### Step 3: Run the App (1 minute)
```bash
npm start
```
- Scan QR code with Expo Go app
- Or press 'a' for Android emulator
- Or press 'i' for iOS simulator

## 📱 Test the App

1. **Sign Up**: Create account → Enter name, email, password
2. **Login**: Use your credentials
3. **Create Post**: Tap ➕ → Select image → Add caption → Post
4. **View Feed**: See your post in the feed
5. **Profile**: Tap 👤 → See your posts

## 🐛 Quick Fixes

### "Cannot connect to Supabase"
- Check internet connection
- Verify Supabase config in `src/config/supabase.js`

### "Expo not found"
```bash
npm install -g expo-cli
```

### "App won't start"
```bash
expo start -c  # Clear cache
```

### "Database error"
- Make sure you ran the SQL query to create tables
- Check that RLS policies are enabled

## 📚 Need More Help?

- Detailed Supabase setup: See `SUPABASE_SETUP.md`
- Complete guide: See `INSTRUCTIONS.md`
- Full docs: See `README.md`

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Database tables created (SQL query)
- [ ] Storage bucket created
- [ ] Supabase config updated
- [ ] App running (`npm start`)
- [ ] Test account created
- [ ] First post created

That's it! You're ready to go! 🎉
