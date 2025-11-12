# Framez - Complete Setup & Deployment Instructions

## 🎯 Quick Start Guide

Follow these steps to get Framez up and running on your device.

### Prerequisites Installation

1. **Install Node.js**
   - Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
   - Verify installation: `node --version` (should be 14.0+)

2. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **Install Expo Go App** (for testing on physical device)
   - iOS: Download from App Store
   - Android: Download from Google Play Store

### Project Setup

1. **Navigate to project directory**
   ```bash
   cd "C:\Users\Peace\Downloads\Social app\Framez"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (See FIREBASE_SETUP.md for detailed guide)
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/config/firebase.js`

### Running the App

#### Option 1: Using Expo Go (Easiest)
```bash
npm start
```
- Scan the QR code with your phone camera (iOS) or Expo Go app (Android)
- The app will load on your device

#### Option 2: Using Android Emulator
```bash
npm run android
```
- Requires Android Studio with an AVD configured

#### Option 3: Using iOS Simulator (Mac only)
```bash
npm run ios
```
- Requires Xcode installed on macOS

## 📱 Testing the App

### Test User Journey
1. **Registration**
   - Open the app → Click "Sign Up"
   - Enter: Name, Email, Password, Confirm Password
   - Click "Sign Up"

2. **Login**
   - Enter registered email and password
   - Click "Log In"

3. **Create a Post**
   - Tap the "+" icon in bottom navigation
   - Tap "Tap to add photo" to select an image
   - Add a caption
   - Tap "Post"

4. **View Feed**
   - Tap "Home" icon to see all posts
   - Pull down to refresh

5. **View Profile**
   - Tap "Profile" icon
   - See your user info and posts
   - Tap "Log Out" to sign out

## 🚀 Building for Production

### Building APK (Android)

1. **Configure app.json**
   - Already configured with package name: `com.framez.app`

2. **Build APK**
   ```bash
   expo build:android
   ```
   - Choose "apk" when prompted
   - Wait for build to complete (~10-20 minutes)
   - Download the APK when ready

3. **Test APK**
   - Transfer to Android device
   - Enable "Install from Unknown Sources"
   - Install and test

### Building for iOS

1. **Requirements**
   - Apple Developer Account ($99/year)
   - Mac computer

2. **Build IPA**
   ```bash
   expo build:ios
   ```
   - Enter Apple ID credentials
   - Wait for build to complete
   - Download IPA file

## 🌐 Deploying to Appetize.io

### Step-by-Step Appetize Deployment

1. **Build your app**
   ```bash
   # For Android
   expo build:android
   
   # For iOS  
   expo build:ios
   ```

2. **Download the build**
   - Wait for build to complete on Expo servers
   - Download the APK (Android) or IPA (iOS) file

3. **Upload to Appetize**
   - Go to [appetize.io](https://appetize.io/)
   - Click "Upload" button
   - Select your APK or IPA file
   - Wait for upload to complete

4. **Configure Settings**
   - Set device type (e.g., "iPhone 15 Pro" or "Pixel 7")
   - Set OS version
   - Enable "Launch URL" if needed

5. **Get Your Link**
   - Copy the public link provided
   - Share with testers or include in documentation
   - Example: `https://appetize.io/app/your_app_id`

### Appetize Best Practices
- Use latest OS versions for better compatibility
- Test on both iOS and Android if possible
- Free tier has usage limits (100 minutes/month)
- Paid plans available for more usage

## 📊 Firebase Configuration Checklist

Before running in production:

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firestore security rules updated
- [ ] Firebase Storage enabled
- [ ] Storage security rules updated
- [ ] Firebase config added to `src/config/firebase.js`
- [ ] App tested with real Firebase backend

## 🎥 Creating Demo Video

### Recording Tips
1. **Use screen recording**
   - iOS: Built-in screen recorder (Control Center)
   - Android: Built-in screen recorder or Google Play Games
   - Desktop: OBS Studio, QuickTime, or Loom

2. **Demo Script** (2-3 minutes)
   - **0:00-0:20**: Introduction to Framez
   - **0:20-0:40**: User registration process
   - **0:40-1:00**: Login demonstration
   - **1:00-1:40**: Creating a post with image
   - **1:40-2:00**: Browsing feed
   - **2:00-2:20**: Viewing profile and user posts
   - **2:20-2:40**: Logout process
   - **2:40-3:00**: Conclusion and features summary

3. **Editing Tools**
   - iMovie (Mac/iOS)
   - Adobe Premiere Rush
   - DaVinci Resolve (Free)
   - Online: Kapwing, Clipchamp

## 🐛 Common Issues & Solutions

### Issue: "Firebase not configured"
**Solution**: Update `src/config/firebase.js` with your Firebase credentials

### Issue: "Image picker not working"
**Solution**: Check `app.json` has expo-image-picker plugin configured

### Issue: "Cannot connect to Firebase"
**Solution**: 
- Check internet connection
- Verify Firebase project is active
- Check Firebase config credentials

### Issue: "App crashes on startup"
**Solution**:
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "Build failed on Expo"
**Solution**:
- Check app.json configuration
- Ensure all dependencies are compatible
- Check Expo SDK version compatibility

## 📈 Next Steps & Improvements

After basic deployment:

1. **Add Features**
   - Like functionality for posts
   - Comments on posts
   - Follow/unfollow users
   - Direct messaging
   - Push notifications

2. **Performance Optimization**
   - Image compression
   - Lazy loading
   - Pagination for posts
   - Caching strategies

3. **Security Enhancements**
   - Rate limiting
   - Input validation
   - Content moderation
   - Report functionality

4. **Analytics**
   - Firebase Analytics
   - User behavior tracking
   - Crash reporting

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Appetize.io Documentation](https://docs.appetize.io/)

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Firebase setup guide (FIREBASE_SETUP.md)
3. Check React Native and Expo documentation
4. Verify all dependencies are correctly installed

## ✅ Final Deployment Checklist

Before submitting:

- [ ] App builds successfully
- [ ] All features working correctly
- [ ] Firebase properly configured
- [ ] App tested on Android and/or iOS
- [ ] Demo video recorded (2-3 minutes)
- [ ] Appetize.io link generated
- [ ] README.md updated with instructions
- [ ] GitHub repository created with clean commits
- [ ] .gitignore properly configured (no secrets committed)

---

**Congratulations!** Your Framez app is ready to deploy! 🎉
