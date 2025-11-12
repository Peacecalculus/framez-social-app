# Framez 📸

A modern mobile social media application built with React Native and **Supabase**, allowing users to share photos and moments with their friends.

## 🌐 Live Demo

Try the app instantly in your browser: [**Launch Live Demo**](https://appetize.io/app/b_wogo6k4bfxlhnrvsceouvivbt4)

## 🎯 Features

### Core Features
- **User Authentication**: Secure sign-up, login, and logout functionality with persistent sessions
- **Create Posts**: Upload photos with captions to share with others
- **Feed**: View all posts from users in chronological order (most recent first)
- **User Profile**: View your own profile with all your posts and account information
- **Real-time Updates**: Posts update in real-time using Supabase Realtime

### Technical Features
- ✅ Supabase Authentication with AsyncStorage persistence
- ✅ PostgreSQL database for data storage
- ✅ Supabase Storage for image uploads
- ✅ React Navigation (Stack & Bottom Tabs)
- ✅ Image picker with permissions handling
- ✅ Responsive UI design inspired by Instagram
- ✅ Context API for state management
- ✅ Real-time data synchronization

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Supabase (Authentication, PostgreSQL, Storage, Realtime)
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **UI Components**: React Native core components
- **Image Handling**: Expo Image Picker
- **Storage**: AsyncStorage for auth persistence

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator / Physical device

### Setup Steps

1. **Clone the repository** (or navigate to the project folder)
   ```bash
   cd Framez
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Create a Supabase project at [Supabase Dashboard](https://supabase.com/dashboard) and:
   
   - Create a new project
   - Set up database tables (see SUPABASE_SETUP.md)
   - Enable Authentication
   - Create Storage bucket
   - Copy your Project URL and anon key

   Update `src/config/supabase.js` with your Supabase credentials:
   ```javascript
   const supabaseUrl = 'https://your-project.supabase.co';
   const supabaseAnonKey = 'your-anon-key-here';
   ```

4. **Follow the detailed Supabase setup**
   
   See **SUPABASE_SETUP.md** for complete step-by-step instructions including:
   - Database table creation (SQL scripts provided)
   - Row Level Security policies
   - Storage bucket configuration
   - Realtime setup

## 🚀 Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

### Platform-specific commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 App Structure

```
Framez/
├── src/
│   ├── components/
│   │   └── PostCard.js          # Reusable post component
│   ├── config/
│   │   └── supabase.js          # Supabase configuration
│   ├── contexts/
│   │   └── AuthContext.js       # Authentication context
│   ├── screens/
│   │   ├── LoginScreen.js       # Login page
│   │   ├── RegisterScreen.js    # Sign up page
│   │   ├── FeedScreen.js        # Home feed
│   │   ├── CreatePostScreen.js  # Create new post
│   │   └── ProfileScreen.js     # User profile
│   └── services/               # Additional services (if needed)
├── assets/                      # Images and icons
├── App.js                       # Main app entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── README.md                    # This file
├── SUPABASE_SETUP.md           # Supabase configuration guide
└── INSTRUCTIONS.md              # Detailed instructions
```

## 🎨 Design Inspiration

The UI design is inspired by Instagram, featuring:
- Clean, minimalist interface
- Instagram-like color scheme (#3797f0 primary blue)
- Card-based post layout
- Bottom tab navigation
- Profile page with avatar and stats

## 🔐 Authentication Flow

1. Users land on the Login screen
2. New users can navigate to Register screen
3. After successful authentication, users access the main app
4. Sessions persist using AsyncStorage
5. Users can log out from the Profile screen

## 📝 Data Models

### User Document (Supabase users table)
```javascript
{
  id: uuid,
  email: string,
  display_name: string,
  photo_url: string | null,
  created_at: timestamp
}
```

### Post Document (Supabase posts table)
```javascript
{
  id: uuid,
  caption: string,
  image_url: string | null,
  user_id: uuid,
  user_name: string,
  user_photo: string | null,
  created_at: timestamp
}
```

## 🧪 Testing

### On Expo Go
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `npm start` in your project directory
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

### On Simulator/Emulator
- **iOS**: Requires macOS with Xcode installed
- **Android**: Requires Android Studio with an AVD configured

## 🚢 Deployment

### Expo Publishing
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Publish to Expo
expo publish
```

### Appetize.io
1. Build your app using `expo build:android` or `expo build:ios`
2. Upload the APK/IPA file to [appetize.io](https://appetize.io/)
3. Share the generated link

## 📊 Acceptance Criteria Status

- ✅ User can register, log in, and log out successfully
- ✅ Auth session persists on app restart
- ✅ User can create new posts with text and images
- ✅ Posts display correctly in a feed
- ✅ User's profile displays correctly with their posts
- ✅ Smooth navigation and responsive layout
- ✅ App runs without errors on Android and iOS

## 🎥 Demo Video

Create a 2-3 minute demo video showing:
1. User registration
2. Login process
3. Creating a post with image and caption
4. Viewing the feed
5. Navigating to profile
6. Viewing user posts
7. Logout

## 🐛 Troubleshooting

### Common Issues

1. **Supabase configuration errors**: Make sure your supabase.js has correct credentials
2. **Image picker not working**: Check permissions in app.json
3. **Build errors**: Clear cache with `expo start -c`
4. **Authentication issues**: Verify Supabase Authentication is enabled

### Reset Cache
```bash
expo start -c
```

### Clear Node Modules
```bash
rm -rf node_modules
npm install
```

## 💡 Why Supabase?

We chose Supabase over Firebase because:
- ✅ **Open Source**: Complete control and transparency
- ✅ **PostgreSQL**: Powerful SQL database with better querying
- ✅ **Better Free Tier**: More generous limits for development
- ✅ **Real-time**: Built-in real-time subscriptions
- ✅ **Modern Stack**: Uses industry-standard technologies

## 📄 License

This project is for educational and demonstration purposes.

## 👤 Author

Built as a demonstration of React Native + Supabase integration for a social media application.

## 🙏 Acknowledgments

- React Native & Expo teams
- Supabase team for excellent documentation
- Instagram for UI/UX inspiration

---

**Note**: Remember to never commit your Supabase configuration with actual credentials to a public repository. Use environment variables or secure configuration management.
