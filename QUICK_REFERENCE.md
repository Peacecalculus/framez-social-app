# Framez - Quick Reference Card

## 🚀 One-Page Setup Guide

### Prerequisites
```bash
✅ Node.js 14+ installed
✅ npm or yarn installed
✅ Expo CLI: npm install -g expo-cli
✅ Supabase account (free)
```

### 1. Install Dependencies (2 minutes)
```bash
cd Framez
npm install
```

### 2. Configure Supabase (20 minutes)

#### Create Project
1. Go to https://supabase.com/dashboard
2. Create new project
3. Get URL and anon key from Settings → API

#### Run SQL (Copy from SUPABASE_SETUP.md)
```sql
-- Users table
CREATE TABLE users (...);
-- Posts table  
CREATE TABLE posts (...);
-- Enable RLS & policies
```

#### Create Storage
1. Storage → Create bucket: `posts`
2. Make it public
3. Add policies

#### Update Config
Edit `src/config/supabase.js`:
```javascript
const supabaseUrl = 'https://YOUR-PROJECT.supabase.co';
const supabaseAnonKey = 'YOUR-KEY-HERE';
```

### 3. Run App (2 minutes)
```bash
npm start
# Then press 'i' for iOS, 'a' for Android, or scan QR
```

---

## 📱 App Features Checklist

### Authentication
- ✅ Register with name, email, password
- ✅ Login with email, password
- ✅ Logout with confirmation
- ✅ Session persists on restart

### Posts
- ✅ Create post with text
- ✅ Create post with image
- ✅ Upload to Supabase Storage
- ✅ Real-time feed updates

### Profile
- ✅ Display user info
- ✅ Show post count
- ✅ List user's posts
- ✅ Avatar with placeholder

### UI/UX
- ✅ Instagram-inspired design
- ✅ Smooth navigation
- ✅ Loading states
- ✅ Error handling

---

## 📝 Testing Quick List

### Must Test
1. [ ] Register new user
2. [ ] Login
3. [ ] Create post (text + image)
4. [ ] View feed
5. [ ] View profile
6. [ ] Logout
7. [ ] Reopen app (check persistence)

### Edge Cases
- [ ] Empty fields
- [ ] Wrong password
- [ ] No internet
- [ ] Image upload fail

---

## 🐛 Common Issues & Fixes

### "Supabase URL not configured"
→ Edit `src/config/supabase.js`

### "Permission denied on posts table"
→ Run RLS policies SQL

### "Storage bucket not found"
→ Create `posts` bucket, make it public

### "Metro bundler won't start"
→ `npm start -- --reset-cache`

### "App won't install on device"
→ Clear app data, reinstall

---

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| README.md | Overview & setup | Start here |
| SUPABASE_SETUP.md | Database config | During setup |
| TESTING_GUIDE.md | Test cases | Before testing |
| DEPLOYMENT_GUIDE.md | Build & deploy | Before submission |
| PROJECT_VERIFICATION.md | Requirements | Check completion |
| COMPLETE_PROJECT_SUMMARY.md | Everything | Final review |

---

## 🎥 Demo Video Outline (2-3 min)

```
[0:00] Intro - "This is Framez"
[0:15] Register new account
[0:30] Create post with image
[0:45] View feed
[1:00] Navigate to profile
[1:15] Show post count
[1:30] Logout
[1:45] Login again (persistence)
[2:00] Show real-time update
[2:30] Outro - Thanks!
```

---

## 🚢 Deployment Checklist

### Before Building
- [ ] Supabase configured
- [ ] All features tested
- [ ] No console errors
- [ ] Demo video recorded
- [ ] README updated

### Build
```bash
# Install EAS
npm install -g eas-cli

# Build for Android
eas build --platform android --profile preview

# Build for iOS (requires Apple account)
eas build --platform ios --profile production
```

### Upload to Appetize.io
1. Go to https://appetize.io/
2. Upload APK/IPA
3. Get public link
4. Add to README

### Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Framez app"
git remote add origin <your-repo>
git push -u origin main
```

---

## 🎯 Final Submission

### Required Items
- ✅ GitHub repo with code
- ✅ README with setup instructions
- ✅ Demo video (2-3 min)
- ✅ Appetize.io link

### Submission Format
```markdown
# Framez Submission

**GitHub**: https://github.com/username/framez
**Demo Video**: https://youtu.be/xxxxx
**Live Demo**: https://appetize.io/app/xxxxx

## Features
- Authentication with session persistence
- Post creation with image upload
- Real-time feed
- User profiles
```

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Files | 14 JS files |
| Screens | 5 screens |
| Documentation | 10 MD files (~100 pages) |
| Dependencies | 16 packages |
| Setup Time | ~30 minutes |
| Development Time | ~20 hours |

---

## 💡 Pro Tips

1. **Read README.md first** - Everything you need to know
2. **Follow SUPABASE_SETUP.md exactly** - Step by step
3. **Test on both iOS and Android** - Platform differences
4. **Record demo early** - Don't wait until last minute
5. **Keep Supabase credentials private** - Use .env
6. **Test session persistence** - Close and reopen app
7. **Check real-time updates** - Use two devices
8. **Document any issues** - Help others learn

---

## 🆘 Need Help?

### Check These First
1. README.md - General setup
2. SUPABASE_SETUP.md - Database issues
3. TESTING_GUIDE.md - Testing help
4. DEPLOYMENT_GUIDE.md - Deployment issues

### Still Stuck?
- Check Supabase dashboard for errors
- View Metro bundler logs
- Clear cache: `npm start -- --reset-cache`
- Reinstall: `rm -rf node_modules && npm install`

---

## 🏆 Success Criteria

### Must Have (Required)
- ✅ User can register & login
- ✅ Posts can be created
- ✅ Feed displays posts
- ✅ Profile shows user data
- ✅ Session persists
- ✅ App doesn't crash

### Nice to Have (Bonus)
- ✅ Real-time updates
- ✅ Pull-to-refresh
- ✅ Professional UI
- ✅ Error handling
- ✅ Loading states

---

## 📞 Quick Commands

```bash
# Install
npm install

# Run
npm start

# iOS
npm run ios

# Android
npm run android

# Clear cache
npm start -- --reset-cache

# Build (Android)
eas build --platform android --profile preview

# Build (iOS)
eas build --platform ios --profile production
```

---

## ✅ Pre-Submission Checklist

- [ ] Code complete
- [ ] Supabase configured
- [ ] All features tested
- [ ] Demo video recorded
- [ ] App built (APK/IPA)
- [ ] Uploaded to Appetize.io
- [ ] Pushed to GitHub
- [ ] README has all links
- [ ] Documentation complete
- [ ] Ready to submit!

---

**Time to Complete**: 30 min setup + 2 hours deployment = **2.5 hours total**

**Good luck! 🚀**

---

**Quick Links**:
- Supabase: https://supabase.com/dashboard
- Appetize.io: https://appetize.io/
- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
