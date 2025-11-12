# Framez - Complete Deployment Guide

## 🚀 Deployment Checklist

This guide covers everything needed to deploy Framez to production.

---

## Phase 1: Pre-Deployment Setup

### ✅ Step 1: Supabase Configuration

#### 1.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - **Name**: Framez
   - **Database Password**: [Create strong password]
   - **Region**: Choose closest to your users
4. Wait for provisioning (~2 minutes)

#### 1.2 Configure Database
1. Go to **SQL Editor** in Supabase
2. Run the following SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

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

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

#### 1.3 Enable Realtime
1. Go to **Database** → **Replication**
2. Find `posts` table
3. Toggle "Realtime" ON

#### 1.4 Setup Storage
1. Go to **Storage**
2. Click "Create bucket"
3. Name: `posts`
4. Public: **YES**
5. Click "Create bucket"

#### 1.5 Storage Policies
Click on `posts` bucket → **Policies** → Add:

```sql
-- View policy
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- Upload policy
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

-- Delete policy
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### 1.6 Authentication Settings
1. Go to **Authentication** → **Settings**
2. For development: Disable email confirmations
3. For production: Enable email confirmations

#### 1.7 Get Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

#### 1.8 Update Configuration
Edit `src/config/supabase.js`:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace
const supabaseAnonKey = 'your-anon-key-here'; // Replace
```

---

## Phase 2: Local Testing

### ✅ Step 2: Test Locally

#### 2.1 Install Dependencies
```bash
cd Framez
npm install
```

#### 2.2 Start Development Server
```bash
npm start
```

#### 2.3 Test on Platform

**For iOS**:
```bash
npm run ios
# Or press 'i' in Metro bundler
```

**For Android**:
```bash
npm run android
# Or press 'a' in Metro bundler
```

**For Physical Device**:
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code from terminal

#### 2.4 Verify Features
Test all features from TESTING_GUIDE.md:
- ✅ Registration
- ✅ Login
- ✅ Create posts
- ✅ View feed
- ✅ View profile
- ✅ Logout
- ✅ Session persistence

---

## Phase 3: Demo Video Creation

### ✅ Step 3: Record Demo Video

#### 3.1 Preparation
- Clean database (fresh start) or use realistic test data
- Good lighting if recording device screen
- Quiet environment for narration
- Script your demo

#### 3.2 Recording Tools

**iOS**:
- Built-in Screen Recording (Control Center)
- QuickTime Player (Mac → File → New Screen Recording)

**Android**:
- Built-in Screen Recording (Quick Settings)
- AZ Screen Recorder (Play Store)

**Computer**:
- OBS Studio (free, cross-platform)
- Loom (web-based)

#### 3.3 Demo Script (2-3 minutes)

```
[0:00-0:15] Introduction
"Hi, I'm [Name], and this is Framez - a mobile social media app built with React Native and Supabase."

[0:15-0:45] Registration & Login
- Show registration screen
- Create new account with name, email, password
- Show successful registration
- (Optional) Logout and login again

[0:45-1:15] Create Post
- Navigate to Create tab
- Select an image from gallery
- Add caption
- Post and show upload process
- Show success confirmation

[1:15-1:45] View Feed
- Show feed with multiple posts
- Demonstrate pull-to-refresh
- Point out post details (author, timestamp, image)
- Scroll through feed

[1:45-2:15] Profile
- Navigate to Profile tab
- Show user information
- Show post count
- Show user's posts
- (Optional) Create another post to show real-time update

[2:15-2:30] Additional Features
- Mention real-time updates
- Mention session persistence
- Show smooth navigation

[2:30-2:45] Conclusion
"Framez demonstrates React Native best practices with complete authentication, real-time data, and a polished Instagram-inspired UI. Thank you!"
```

#### 3.4 Editing
- Trim beginning/end
- Add title card
- Add music (optional, low volume)
- Export in 1080p

#### 3.5 Upload
**YouTube** (Recommended):
1. Upload as Public or Unlisted
2. Title: "Framez - React Native Social Media App Demo"
3. Description: Include GitHub link
4. Add to README.md

**Alternative Platforms**:
- Vimeo
- Google Drive
- Dropbox

---

## Phase 4: Build for Deployment

### ✅ Step 4: Build the App

#### 4.1 Configure app.json

Verify these settings in `app.json`:
```json
{
  "expo": {
    "name": "Framez",
    "slug": "framez",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.framez.app"
    },
    "android": {
      "package": "com.framez.app"
    }
  }
}
```

#### 4.2 Build for Android

**Option A: EAS Build (Recommended)**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build APK (for Appetize.io)
eas build --platform android --profile preview

# Or build AAB (for Play Store)
eas build --platform android --profile production
```

**Option B: Classic Build**
```bash
# Install Expo CLI
npm install -g expo-cli

# Build APK
expo build:android -t apk

# Build AAB
expo build:android -t app-bundle
```

#### 4.3 Build for iOS

```bash
# EAS Build
eas build --platform ios --profile production

# Or classic
expo build:ios
```

**Note**: iOS builds require Apple Developer account ($99/year)

#### 4.4 Download Builds
```bash
# For EAS Build
eas build:list
# Click URL to download

# For Classic Build
# Download from Expo dashboard
```

---

## Phase 5: Deploy to Appetize.io

### ✅ Step 5: Appetize.io Deployment

#### 5.1 Sign Up
1. Go to https://appetize.io/
2. Create account (free tier available)
3. Verify email

#### 5.2 Upload App

1. Click "Upload App"
2. Select platform: **Android** or **iOS**
3. Upload your APK/IPA file
4. Configure settings:
   - **Device**: Google Pixel 7 or iPhone 14
   - **OS Version**: Latest
   - **Orientation**: Portrait
   - **Device Language**: English
   - **Timezone**: Your timezone

#### 5.3 Advanced Settings (Optional)
```json
{
  "launchUrl": "framez://",
  "note": "Framez Social Media App",
  "disableHome": false,
  "debug": false
}
```

#### 5.4 Get Public Link
1. After upload, you'll get a public URL
2. Format: `https://appetize.io/app/[unique-id]`
3. Test the link in browser
4. Share link or embed on website

#### 5.5 Update README
Add to README.md:
```markdown
## 🌐 Live Demo

Try the app online: [Appetize.io Demo](https://appetize.io/app/your-app-id)

**Note**: Click "Tap to Play" and wait for app to load (~30 seconds)
```

#### 5.6 Free Tier Limits
- **Minutes/month**: 100 minutes
- **Concurrent sessions**: 1
- **App uploads**: Unlimited
- **Storage**: 30 days

---

## Phase 6: GitHub Repository

### ✅ Step 6: Setup GitHub

#### 6.1 Create Repository
1. Go to https://github.com/new
2. Repository name: `framez-social-app`
3. Description: "A mobile social media app built with React Native and Supabase"
4. Visibility: Public
5. Don't initialize with README (already have one)
6. Click "Create repository"

#### 6.2 Initialize Git

```bash
cd Framez

# Initialize git (if not already)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Framez social media app

- Complete authentication flow with Supabase
- Post creation with image upload
- Real-time feed with pull-to-refresh
- User profile with post history
- Instagram-inspired UI design
- Comprehensive documentation"

# Add remote
git remote add origin https://github.com/your-username/framez-social-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 6.3 Verify .gitignore

Ensure `.gitignore` includes:
```
node_modules/
.expo/
.expo-shared/
*.log
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.orig.*
web-build/
.env
```

#### 6.4 Update README with Links

Add to README.md:
```markdown
## 🔗 Links

- **GitHub Repository**: https://github.com/your-username/framez-social-app
- **Live Demo**: https://appetize.io/app/your-app-id
- **Demo Video**: https://youtu.be/your-video-id
- **Supabase**: https://supabase.com/
```

---

## Phase 7: Final Touches

### ✅ Step 7: Polish & Document

#### 7.1 Update Documentation
- ✅ README.md - Complete with all links
- ✅ SUPABASE_SETUP.md - Detailed setup guide
- ✅ TESTING_GUIDE.md - Complete test cases
- ✅ PROJECT_VERIFICATION.md - Requirements checklist

#### 7.2 Add Badges to README

```markdown
# Framez 📸

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)
![Supabase](https://img.shields.io/badge/Supabase-2.80-green)
![License](https://img.shields.io/badge/license-MIT-blue)
```

#### 7.3 Create GitHub Release

```bash
# Tag the release
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0
```

On GitHub:
1. Go to **Releases** → **Create new release**
2. Tag: `v1.0.0`
3. Title: "Framez v1.0.0 - Initial Release"
4. Description:
```markdown
## Features
- 🔐 Complete authentication system
- 📸 Post creation with image upload
- 📱 Real-time feed with live updates
- 👤 User profiles with post history
- 🎨 Instagram-inspired UI

## Downloads
- [Android APK](link-to-apk)
- [iOS IPA](link-to-ipa)

## Demo
- [Live Demo on Appetize.io](your-link)
- [Demo Video](your-video-link)
```

#### 7.4 Add Topics to GitHub Repo
Add these topics:
- `react-native`
- `expo`
- `supabase`
- `social-media`
- `mobile-app`
- `instagram-clone`
- `javascript`
- `typescript`

---

## Phase 8: Submission

### ✅ Step 8: Prepare Submission Package

#### 8.1 Create SUBMISSION.md

```markdown
# Framez - Project Submission

## Student Information
- **Name**: [Your Name]
- **Email**: [Your Email]
- **Date**: [Submission Date]

## Project Links
- **GitHub**: https://github.com/your-username/framez-social-app
- **Live Demo**: https://appetize.io/app/your-app-id
- **Demo Video**: https://youtu.be/your-video-id

## Technology Stack
- **Frontend**: React Native 0.81, Expo 54
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: React Context API
- **Navigation**: React Navigation v7

## Features Implemented
✅ User registration and login
✅ Session persistence with AsyncStorage
✅ Create posts with text and images
✅ Real-time feed with pull-to-refresh
✅ User profile with post history
✅ Instagram-inspired UI design
✅ Cross-platform (iOS & Android)

## Acceptance Criteria Status
✅ User can register, log in, and log out
✅ Auth session persists on app restart
✅ User can create new posts
✅ Posts display correctly in feed
✅ Profile displays with user posts
✅ Smooth navigation and responsive layout
✅ Runs without errors on Android and iOS

## Documentation
- README.md - Complete setup guide
- SUPABASE_SETUP.md - Database configuration
- TESTING_GUIDE.md - Test cases
- PROJECT_VERIFICATION.md - Requirements checklist

## Demo Video
[Link to video]

Duration: 2:47
Content: Registration, login, post creation, feed viewing, profile display, logout

## Additional Notes
[Any extra features or challenges faced]

## Time Spent
- Setup & Planning: 2 hours
- Development: 12 hours
- Testing: 3 hours
- Documentation: 3 hours
- Total: ~20 hours
```

#### 8.2 Final Checklist

Before submitting:
- [ ] All code committed to GitHub
- [ ] README.md includes all links
- [ ] Demo video uploaded and linked
- [ ] Appetize.io app working
- [ ] Supabase project configured
- [ ] No placeholder credentials in code
- [ ] .gitignore properly configured
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Clean commit history

---

## Troubleshooting Common Issues

### Issue: Build Fails

**Solution**:
```bash
# Clear cache
rm -rf node_modules
npm install
expo start -c
```

### Issue: Appetize.io App Won't Start

**Solution**:
- Ensure APK/IPA is correct format
- Check app size (<100MB for free tier)
- Wait 30-60 seconds for loading
- Try different device/OS version

### Issue: Supabase Connection Error

**Solution**:
- Verify URL and anon key correct
- Check RLS policies enabled
- Ensure tables created
- Test in Supabase dashboard first

### Issue: Images Not Uploading

**Solution**:
- Verify storage bucket is public
- Check storage policies
- Ensure bucket name is "posts"
- Test with small image first

---

## 🎉 Congratulations!

Your Framez app is now:
- ✅ Fully functional
- ✅ Documented
- ✅ Tested
- ✅ Deployed
- ✅ Submitted

## Next Steps (Optional)

1. **Add Features**:
   - Like/comment on posts
   - Follow/unfollow users
   - Direct messaging
   - Push notifications
   - Story feature

2. **Improve Performance**:
   - Image caching
   - Lazy loading
   - Pagination

3. **Enhance Security**:
   - Rate limiting
   - Content moderation
   - Report functionality

4. **Analytics**:
   - User engagement tracking
   - Crash reporting
   - Performance monitoring

5. **Monetization** (If applicable):
   - In-app purchases
   - Advertisements
   - Premium features

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Appetize.io Docs](https://docs.appetize.io/)

---

**Need Help?** Check the documentation files or open an issue on GitHub!
