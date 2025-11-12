# Framez - Quick Testing Guide

## 🧪 Testing Checklist

This guide helps you systematically test all features of the Framez app.

---

## Prerequisites

### Before Testing
1. ✅ Supabase project created and configured
2. ✅ Database tables created (run SQL from SUPABASE_SETUP.md)
3. ✅ Storage bucket "posts" created and set to public
4. ✅ Credentials added to `src/config/supabase.js`
5. ✅ Dependencies installed (`npm install`)
6. ✅ App running (`npm start`)

---

## Test Cases

### 1. Authentication Tests

#### Test 1.1: User Registration
**Steps**:
1. Open app (should show Login screen)
2. Tap "Sign Up"
3. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
4. Tap "Sign Up" button

**Expected Result**:
- ✅ "Account created successfully!" alert appears
- ✅ User is automatically logged in
- ✅ Navigated to Feed screen
- ✅ User record created in Supabase `users` table

**Edge Cases**:
- [ ] Try with empty fields → Should show error
- [ ] Try with mismatched passwords → Should show error
- [ ] Try with short password (<6 chars) → Should show error
- [ ] Try with existing email → Should show error

#### Test 1.2: User Login
**Steps**:
1. If logged in, logout first
2. On Login screen, enter:
   - Email: "test@example.com"
   - Password: "password123"
3. Tap "Log In"

**Expected Result**:
- ✅ User is logged in
- ✅ Navigated to Feed screen
- ✅ Session token stored in AsyncStorage

**Edge Cases**:
- [ ] Wrong password → Should show error
- [ ] Non-existent email → Should show error
- [ ] Empty fields → Should show error

#### Test 1.3: Session Persistence
**Steps**:
1. Log in to the app
2. Close app completely
3. Reopen app

**Expected Result**:
- ✅ User remains logged in
- ✅ Directly shows Feed screen (not Login screen)
- ✅ User data loads correctly

#### Test 1.4: Logout
**Steps**:
1. Navigate to Profile tab
2. Tap "Log Out" button
3. Confirm in the alert dialog

**Expected Result**:
- ✅ User is logged out
- ✅ Navigated to Login screen
- ✅ Session cleared from AsyncStorage

---

### 2. Post Creation Tests

#### Test 2.1: Create Post with Image and Caption
**Steps**:
1. Navigate to Create tab (+ icon)
2. Tap "Tap to add photo"
3. Select an image from gallery
4. Enter caption: "My first post!"
5. Tap "Post" button

**Expected Result**:
- ✅ "Uploading..." indicator shows
- ✅ Image uploads to Supabase Storage
- ✅ "Post created successfully!" alert appears
- ✅ Navigated back to Feed
- ✅ New post appears in feed
- ✅ Post record created in `posts` table

**Edge Cases**:
- [ ] Cancel during upload → Should handle gracefully
- [ ] Network error → Should show error message

#### Test 2.2: Create Post with Caption Only
**Steps**:
1. Navigate to Create tab
2. Don't select an image
3. Enter caption: "Text only post"
4. Tap "Post"

**Expected Result**:
- ✅ Post created successfully
- ✅ Post appears in feed without image
- ✅ Caption displayed correctly

#### Test 2.3: Create Post with Image Only
**Steps**:
1. Navigate to Create tab
2. Select an image
3. Leave caption empty
4. Tap "Post"

**Expected Result**:
- ✅ Post created successfully
- ✅ Post appears in feed with image
- ✅ No caption section shown

#### Test 2.4: Cancel Post Creation
**Steps**:
1. Navigate to Create tab
2. Select image and/or enter caption
3. Tap "Cancel"

**Expected Result**:
- ✅ Returns to previous screen
- ✅ No post created
- ✅ Selected image discarded

#### Test 2.5: Empty Post Validation
**Steps**:
1. Navigate to Create tab
2. Don't select image or enter caption
3. Tap "Post"

**Expected Result**:
- ✅ Error alert: "Please add a caption or image"
- ✅ No post created

---

### 3. Feed Tests

#### Test 3.1: View Feed
**Steps**:
1. Navigate to Feed tab
2. Observe posts

**Expected Result**:
- ✅ All posts displayed
- ✅ Most recent posts at top
- ✅ Each post shows:
  - Author name
  - Author avatar/placeholder
  - Timestamp (relative)
  - Image (if available)
  - Caption (if available)

#### Test 3.2: Empty Feed State
**Steps**:
1. Use fresh database with no posts
2. View Feed tab

**Expected Result**:
- ✅ Shows "No posts yet" message
- ✅ Shows "Create your first post!" subtitle

#### Test 3.3: Pull to Refresh
**Steps**:
1. On Feed screen
2. Pull down from top
3. Release

**Expected Result**:
- ✅ Refresh spinner shows
- ✅ Posts reload
- ✅ New posts appear if any

#### Test 3.4: Real-time Updates
**Steps**:
1. Open app on two devices/simulators with different users
2. User A creates a post
3. Observe User B's feed

**Expected Result**:
- ✅ User B's feed automatically updates
- ✅ New post appears without manual refresh

#### Test 3.5: Image Loading
**Steps**:
1. View feed with posts containing images
2. Observe image loading

**Expected Result**:
- ✅ Images load correctly
- ✅ Aspect ratio maintained (1:1)
- ✅ Placeholder shown while loading

#### Test 3.6: Timestamp Display
**Steps**:
1. View posts of different ages
2. Check timestamp format

**Expected Result**:
- ✅ "Just now" for <1 minute
- ✅ "5m ago" for minutes
- ✅ "2h ago" for hours
- ✅ "3d ago" for days

---

### 4. Profile Tests

#### Test 4.1: View Profile
**Steps**:
1. Navigate to Profile tab
2. Observe profile information

**Expected Result**:
- ✅ User's display name shown
- ✅ User's email shown
- ✅ Avatar or letter placeholder shown
- ✅ Post count displayed correctly
- ✅ "My Posts" section shown
- ✅ User's posts listed

#### Test 4.2: Empty Profile (No Posts)
**Steps**:
1. View profile of user with no posts

**Expected Result**:
- ✅ Shows "No posts yet" message
- ✅ Shows "Create your first post!" subtitle
- ✅ Post count shows "0"

#### Test 4.3: Profile with Multiple Posts
**Steps**:
1. Create multiple posts (3-5)
2. View Profile tab

**Expected Result**:
- ✅ All user's posts displayed
- ✅ Post count accurate
- ✅ Posts in reverse chronological order
- ✅ Scrollable list

#### Test 4.4: Avatar Display
**Steps**:
1. View profile (user with no photo)

**Expected Result**:
- ✅ Circular placeholder with user's initial
- ✅ Blue background
- ✅ White letter

#### Test 4.5: Real-time Profile Updates
**Steps**:
1. On Profile tab
2. Create a new post (via Create tab)
3. Return to Profile tab

**Expected Result**:
- ✅ Post count increments automatically
- ✅ New post appears in list
- ✅ No manual refresh needed

---

### 5. Navigation Tests

#### Test 5.1: Tab Navigation
**Steps**:
1. Tap each tab icon in order:
   - Home (Feed)
   - Create (+)
   - Profile

**Expected Result**:
- ✅ Each tab loads correctly
- ✅ Active tab highlighted
- ✅ Smooth transitions
- ✅ Tab bar always visible

#### Test 5.2: Auth Flow Navigation
**Steps**:
1. From Login, tap "Sign Up"
2. From Register, tap "Log In"

**Expected Result**:
- ✅ Smooth transitions
- ✅ Back navigation works
- ✅ Form fields cleared appropriately

#### Test 5.3: Create Post Navigation
**Steps**:
1. Go to Create tab
2. Tap "Cancel"

**Expected Result**:
- ✅ Returns to previous tab
- ✅ Modal closed properly

---

### 6. UI/UX Tests

#### Test 6.1: Responsive Layout
**Steps**:
1. Test on different screen sizes:
   - iPhone SE (small)
   - iPhone 14 Pro (medium)
   - iPhone 14 Pro Max (large)
   - iPad (tablet)

**Expected Result**:
- ✅ UI adapts to screen size
- ✅ Text readable on all devices
- ✅ Images display correctly
- ✅ Buttons accessible

#### Test 6.2: Keyboard Handling
**Steps**:
1. On Login screen, tap email field
2. Observe keyboard behavior
3. Repeat for other text inputs

**Expected Result**:
- ✅ Keyboard appears smoothly
- ✅ Input fields not hidden by keyboard
- ✅ KeyboardAvoidingView works
- ✅ Can scroll to see all fields

#### Test 6.3: Loading States
**Steps**:
1. Test loading states in:
   - Login
   - Registration
   - Post creation
   - Feed loading
   - Profile loading

**Expected Result**:
- ✅ Loading indicators shown
- ✅ Buttons disabled during loading
- ✅ User can't trigger duplicate actions
- ✅ Clear visual feedback

#### Test 6.4: Error Handling
**Steps**:
1. Test error scenarios:
   - Wrong login credentials
   - Network errors
   - Upload failures
   - Empty form submissions

**Expected Result**:
- ✅ Clear error messages
- ✅ Alerts shown appropriately
- ✅ App doesn't crash
- ✅ User can retry

#### Test 6.5: Color Scheme
**Steps**:
1. Review app colors across all screens

**Expected Result**:
- ✅ Instagram blue (#3797f0) for primary actions
- ✅ Gray (#8e8e8e) for secondary text
- ✅ Black (#262626) for primary text
- ✅ Light gray (#dbdbdb) for borders
- ✅ Consistent throughout app

---

### 7. Platform-Specific Tests

#### Test 7.1: iOS Specific
**Steps**:
1. Test on iOS simulator/device

**Expected Result**:
- ✅ Safe area respected (notch/home indicator)
- ✅ Status bar configured correctly
- ✅ Image picker permissions work
- ✅ Keyboard behavior correct

#### Test 7.2: Android Specific
**Steps**:
1. Test on Android emulator/device

**Expected Result**:
- ✅ Back button works correctly
- ✅ Permissions requested properly
- ✅ Edge-to-edge display works
- ✅ Keyboard behavior correct

---

### 8. Performance Tests

#### Test 8.1: Feed Performance
**Steps**:
1. Create 20+ posts
2. Scroll through feed

**Expected Result**:
- ✅ Smooth scrolling (60 FPS)
- ✅ No lag or stuttering
- ✅ Images load efficiently
- ✅ Memory usage reasonable

#### Test 8.2: App Startup Time
**Steps**:
1. Close app completely
2. Reopen and measure time to interactive

**Expected Result**:
- ✅ Opens in <3 seconds
- ✅ Auth check completes quickly
- ✅ Initial feed loads promptly

#### Test 8.3: Image Upload Performance
**Steps**:
1. Upload various image sizes
2. Measure upload times

**Expected Result**:
- ✅ Compression works (0.8 quality)
- ✅ Upload completes in reasonable time
- ✅ Progress feedback shown

---

## 🐛 Bug Reporting Template

If you find issues, report them using this format:

```
**Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Device/Platform**:
- Device: iPhone 14 / Pixel 7
- OS: iOS 17 / Android 13
- App Version: 1.0.0

**Screenshots/Videos**:
[Attach if available]

**Severity**:
- [ ] Critical (app crashes)
- [ ] High (feature broken)
- [ ] Medium (UI issue)
- [ ] Low (cosmetic)
```

---

## ✅ Test Report Template

After completing tests, fill out:

```
# Framez Test Report

**Date**: [Date]
**Tester**: [Your Name]
**Platform**: iOS / Android
**Device**: [Device Model]

## Test Results

### Authentication: ✅ PASS / ❌ FAIL
- Registration: ✅
- Login: ✅
- Logout: ✅
- Session Persistence: ✅

### Posts: ✅ PASS / ❌ FAIL
- Create with image & caption: ✅
- Create with caption only: ✅
- Create with image only: ✅
- Validation: ✅

### Feed: ✅ PASS / ❌ FAIL
- Display posts: ✅
- Real-time updates: ✅
- Pull to refresh: ✅
- Empty state: ✅

### Profile: ✅ PASS / ❌ FAIL
- Display info: ✅
- Show posts: ✅
- Post count: ✅
- Real-time updates: ✅

### Navigation: ✅ PASS / ❌ FAIL
- Tab navigation: ✅
- Auth navigation: ✅
- Back navigation: ✅

### UI/UX: ✅ PASS / ❌ FAIL
- Responsive: ✅
- Loading states: ✅
- Error handling: ✅
- Color scheme: ✅

## Issues Found
1. [Issue description]
2. [Issue description]

## Overall Status: ✅ READY / ⚠️ NEEDS WORK / ❌ NOT READY

**Notes**: [Additional comments]
```

---

## 📱 Testing Tools

### Recommended Tools
- **iOS**: Xcode Simulator
- **Android**: Android Studio Emulator
- **Physical Device**: Expo Go app
- **Debugging**: React Native Debugger
- **Network**: Reactotron (optional)

### Useful Commands
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear app data (iOS)
xcrun simctl uninstall booted com.framez.app

# Clear app data (Android)
adb shell pm clear com.framez.app

# View logs (iOS)
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Framez"'

# View logs (Android)
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 🎯 Quick Pass/Fail Criteria

### Must Pass (Critical)
- [ ] User can register
- [ ] User can login
- [ ] User can create posts
- [ ] Posts appear in feed
- [ ] Profile shows user info
- [ ] App doesn't crash

### Should Pass (Important)
- [ ] Session persists
- [ ] Real-time updates work
- [ ] Images upload correctly
- [ ] Error messages clear
- [ ] Loading states shown

### Nice to Pass (Polish)
- [ ] Smooth animations
- [ ] Fast performance
- [ ] Consistent styling
- [ ] Good accessibility

---

**Remember**: Test on both iOS and Android if possible! 📱
