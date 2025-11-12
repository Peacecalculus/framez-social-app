# 🚀 Quick Start Guide - Run Framez Locally

**Start Here!** This is your step-by-step guide to run the app on your local machine.

---

## ⚡ Fast Track (30 Minutes)

Follow these 5 steps in order:

### **Step 1: Install Prerequisites** (5 minutes)

```bash
# 1. Check Node.js is installed (need v14 or higher)
node --version

# 2. Install Expo CLI globally
npm install -g expo-cli

# 3. Install EAS CLI (for building later)
npm install -g eas-cli
```

If Node.js is not installed, download from: https://nodejs.org/

---

### **Step 2: Install App Dependencies** (2 minutes)

```bash
# Navigate to project folder
cd "C:\Users\Peace\Downloads\Social app\Framez"

# Install all dependencies
npm install
```

Wait for installation to complete...

---

### **Step 3: Setup Supabase Backend** (20 minutes)

This is the most important step! Your app won't work without it.

#### 3.1 Create Supabase Account
1. Go to https://supabase.com/dashboard
2. Click **"Sign Up"** (it's free!)
3. Sign up with GitHub or email

#### 3.2 Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Organization**: Choose or create one
   - **Name**: `Framez` (or any name)
   - **Database Password**: Create strong password (SAVE THIS!)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. **Wait 2 minutes** for provisioning ⏳

#### 3.3 Create Database Tables
1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. **Copy EVERYTHING** from the code below and paste:

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

-- Users can view all profiles
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

4. Click **"RUN"** (or press F5)
5. You should see **"Success. No rows returned"**

#### 3.4 Enable Realtime
1. Click **"Database"** → **"Replication"** (left sidebar)
2. Find the **`posts`** table in the list
3. Toggle **"Realtime"** to **ON** ✅

#### 3.5 Create Storage Bucket
1. Click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `posts` (must be exactly this)
   - **Public bucket**: **YES** (toggle ON)
4. Click **"Create bucket"**

#### 3.6 Add Storage Policies
1. Click on the **`posts`** bucket you just created
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Click **"Create a policy from scratch"**
5. Add these 3 policies one by one:

**Policy 1: Anyone can view images**
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');
```

**Policy 2: Authenticated users can upload**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');
```

**Policy 3: Users can delete own images**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### 3.7 Disable Email Confirmation (for testing)
1. Click **"Authentication"** → **"Providers"** (left sidebar)
2. Click on **"Email"**
3. Scroll down to **"Confirm email"**
4. Toggle it **OFF** ⚠️ (makes testing easier)
5. Click **"Save"**

#### 3.8 Get Your Credentials
1. Click **"Settings"** → **"API"** (left sidebar)
2. Copy these two values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

#### 3.9 Update App Configuration
1. Open file: `C:\Users\Peace\Downloads\Social app\Framez\src\config\supabase.js`
2. Replace placeholders with YOUR values:

```javascript
const supabaseUrl = 'https://xxxxx.supabase.co'; // ← YOUR PROJECT URL
const supabaseAnonKey = 'eyJhbGc...'; // ← YOUR ANON KEY
```

3. **Save the file!** (Ctrl+S)

---

### **Step 4: Run the App** (1 minute)

```bash
# Start Expo development server
npm start
```

You'll see a QR code and options to run on different platforms.

---

### **Step 5: Choose Your Platform** (2 minutes)

#### **Option A: Android Emulator**
1. Open Android Studio
2. Start an emulator (AVD)
3. In terminal, press **`a`**

#### **Option B: iOS Simulator** (Mac only)
1. Make sure Xcode is installed
2. In terminal, press **`i`**

#### **Option C: Physical Device** (Easiest!)
1. Install **"Expo Go"** app from Play Store or App Store
2. Open Expo Go
3. Scan the QR code from terminal
4. App will load on your device!

#### **Option D: Web Browser** (for quick testing)
1. In terminal, press **`w`**
2. App opens in browser (limited functionality)

---

## ✅ Testing Checklist

Once the app loads, test these features in order:

### 1. Registration ✅
- [ ] Tap **"Sign Up"**
- [ ] Enter:
  - Full Name: `Test User`
  - Email: `test@test.com`
  - Password: `password123`
  - Confirm: `password123`
- [ ] Tap **"Sign Up"** button
- [ ] Should see success message
- [ ] Should land on Feed screen

### 2. Logout & Login ✅
- [ ] Go to **Profile** tab (bottom right)
- [ ] Tap **"Log Out"**
- [ ] Confirm logout
- [ ] Should return to Login screen
- [ ] Enter email and password
- [ ] Tap **"Log In"**
- [ ] Should return to Feed

### 3. Create Post ✅
- [ ] Tap **Create** tab (+ icon in middle)
- [ ] Tap **"Tap to add photo"**
- [ ] Allow photo permissions if asked
- [ ] Select a photo
- [ ] Type a caption: `My first post!`
- [ ] Tap **"Post"**
- [ ] Should see success message
- [ ] Should return to Feed
- [ ] Your post should appear!

### 4. View Feed ✅
- [ ] Go to **Feed** tab (Home icon)
- [ ] See your post displayed
- [ ] Pull down to refresh
- [ ] Post should reload

### 5. View Profile ✅
- [ ] Go to **Profile** tab
- [ ] See your name and email
- [ ] See post count (should be 1)
- [ ] See your post in the list

### 6. Session Persistence ✅
- [ ] Close the app completely
- [ ] Reopen the app
- [ ] Should still be logged in!
- [ ] Should see Feed screen immediately

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to Metro bundler"
**Fix**:
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Issue: "Supabase URL not configured"
**Fix**: 
- Make sure you updated `src/config/supabase.js` with YOUR credentials
- Check for typos in URL and key
- Make sure you saved the file!

### Issue: "Network request failed"
**Fix**:
- Check your internet connection
- Verify Supabase project is running (go to dashboard)
- Make sure URL and key are correct

### Issue: "Permission denied on table posts"
**Fix**:
- Go back to Step 3.3 and run the SQL again
- Make sure RLS policies were created
- Check in Supabase: Authentication → Policies

### Issue: "Storage bucket not found"
**Fix**:
- Go back to Step 3.5
- Make sure bucket is named exactly `posts`
- Make sure it's set to **Public**

### Issue: Image picker not working
**Fix**:
- On physical device: Allow photo permissions when asked
- On emulator: Make sure emulator has some photos

### Issue: App crashes on Android
**Fix**:
```bash
# Clear app data
adb shell pm clear com.framez.app

# Then restart app
npm run android
```

---

## 📚 Need More Help?

### Detailed Guides (In Order of Use)
1. **START HERE**: `QUICK_START.md` (this file)
2. **Detailed Supabase**: `SUPABASE_SETUP.md` (if Step 3 needs more detail)
3. **Complete Testing**: `TESTING_GUIDE.md` (after app is running)
4. **Deployment**: `DEPLOYMENT_GUIDE.md` (when ready to deploy)
5. **Full Overview**: `COMPLETE_PROJECT_SUMMARY.md` (understand everything)

### Quick Commands Reference
```bash
# Start app
npm start

# Start on Android
npm run android

# Start on iOS
npm run ios

# Clear cache
npm start -- --reset-cache

# Reinstall dependencies
rm -rf node_modules && npm install
```

---

## ⏱️ Time Breakdown

| Step | Time | Status |
|------|------|--------|
| Install Prerequisites | 5 min | ⏳ |
| Install Dependencies | 2 min | ⏳ |
| Setup Supabase | 20 min | ⏳ |
| Run App | 1 min | ⏳ |
| Choose Platform | 2 min | ⏳ |
| **TOTAL** | **30 min** | |

---

## 🎉 Success!

If you can:
- ✅ Register a new account
- ✅ Login and logout
- ✅ Create a post with image
- ✅ See posts in feed
- ✅ View your profile

**You're done!** The app is working perfectly on your local machine! 🎊

---

## 🚀 Next Steps

Once everything works locally:

1. **Test Thoroughly** - Use `TESTING_GUIDE.md`
2. **Record Demo Video** - Show all features (2-3 minutes)
3. **Build for Deployment** - Follow `DEPLOYMENT_GUIDE.md`
4. **Deploy to Appetize.io** - Share with others
5. **Push to GitHub** - Version control
6. **Submit Project** - You're done!

---

## 💡 Pro Tips

1. **Keep Supabase Dashboard Open** - Monitor database in real-time
2. **Use Expo Go on Real Device** - Best testing experience
3. **Test on Both Platforms** - iOS and Android if possible
4. **Check Console for Errors** - Look at Metro bundler output
5. **Create Multiple Users** - Test with different accounts

---

## 📞 Still Stuck?

1. Check `BUG_REPORT.md` - See if your issue is listed
2. Check `SUPABASE_SETUP.md` - More detailed backend setup
3. Check Metro bundler logs - Red error messages
4. Check Supabase dashboard - Database → Logs
5. Clear everything and start fresh:
   ```bash
   rm -rf node_modules
   npm install
   npm start -- --reset-cache
   ```

---

**You're all set!** Follow these steps in order and you'll have the app running in 30 minutes! 🚀

**Current Time**: It's 5:17 AM - Perfect time to get this running! ☕

**Good luck!** 🎯
