# 🚀 Yadamah Rider App - Complete Setup Guide

## Step-by-Step Installation

### 1️⃣ Prerequisites Installation

#### Install Node.js
```bash
# Download from https://nodejs.org/ (v18 or higher)
# Verify installation
node --version
npm --version
```

#### Install React Native CLI
```bash
npm install -g react-native-cli
```

#### For Android Development
- Download and install [Android Studio](https://developer.android.com/studio)
- Install Android SDK (API 34)
- Set up Android environment variables:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

#### For iOS Development (macOS only)
- Install Xcode from App Store
- Install CocoaPods:
  ```bash
  sudo gem install cocoapods
  ```

---

### 2️⃣ Clone and Install

```bash
# Clone repository
git clone https://github.com/rehankhan993399-star/yadamah-rider-app.git
cd yadamah-rider-app

# Install dependencies
npm install

# For iOS, install pods
cd ios && pod install && cd ..
```

---

### 3️⃣ Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "Yadamah"
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Phone** sign-in method
4. Add test phone numbers (optional):
   - Phone: +966500000000
   - Code: 123456

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Test Mode** (for development)
4. Choose location (closest to your users)
5. Click "Enable"

#### Create Realtime Database
1. Go to **Realtime Database**
2. Click "Create Database"
3. Start in **Test Mode**
4. Click "Enable"

#### Download Configuration Files

**For Android:**
1. In Firebase Console, click ⚙️ → Project Settings
2. Scroll to "Your apps" → Click Android icon
3. Register app:
   - Package name: `com.yadamahrider`
   - App nickname: Yadamah Rider
4. Download `google-services.json`
5. Place in: `android/app/google-services.json`

**For iOS:**
1. In Firebase Console, click ⚙️ → Project Settings
2. Scroll to "Your apps" → Click iOS icon
3. Register app:
   - Bundle ID: `com.yadamahrider`
   - App nickname: Yadamah Rider
4. Download `GoogleService-Info.plist`
5. Place in: `ios/YadamahRider/GoogleService-Info.plist`

---

### 4️⃣ Google Maps Setup

#### Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Directions API
4. Go to **Credentials** → Create API Key
5. Copy the API key

#### Configure Android
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_ACTUAL_API_KEY_HERE"/>
```

#### Configure iOS
1. Open `ios/YadamahRider/AppDelegate.mm`
2. Add at the top:
```objc
#import <GoogleMaps/GoogleMaps.h>
```
3. Add in `didFinishLaunchingWithOptions`:
```objc
[GMSServices provideAPIKey:@"YOUR_ACTUAL_API_KEY_HERE"];
```

---

### 5️⃣ Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Riders collection
    match /riders/{riderId} {
      allow read, write: if request.auth != null && request.auth.uid == riderId;
    }
    
    // Rides collection
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.riderId || 
         request.auth.uid == resource.data.driverId);
    }
  }
}
```

### Realtime Database Rules

In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "activeRides": {
      "$rideId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

---

### 6️⃣ Run the App

#### Android
```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

#### iOS
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

---

### 7️⃣ Testing

#### Test Phone Authentication
1. Open the app
2. Enter name and phone number
3. Click "Send OTP"
4. Enter the OTP received
5. Click "Verify OTP"

#### Test Booking Flow
1. After login, you'll see the map
2. Click "Book a Ride"
3. Enter pickup and destination
4. Select vehicle type
5. Click "Confirm Booking"

---

### 8️⃣ Common Issues & Solutions

#### Issue: Metro bundler not starting
```bash
# Clear cache
npm start -- --reset-cache
```

#### Issue: Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

#### Issue: iOS build fails
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

#### Issue: Google Maps not showing
- Verify API key is correct
- Check if Maps SDK is enabled in Google Cloud Console
- Ensure billing is enabled (Google requires it)

#### Issue: Firebase authentication not working
- Check if Phone authentication is enabled
- Verify google-services.json / GoogleService-Info.plist are in correct locations
- Check Firebase project settings

---

### 9️⃣ Building for Production

#### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

#### Android AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
```
AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

#### iOS (App Store)
1. Open `ios/YadamahRider.xcworkspace` in Xcode
2. Select "Any iOS Device"
3. Product → Archive
4. Upload to App Store Connect

---

### 🔟 Environment Variables (Optional)

Create `.env` file in root:
```env
GOOGLE_MAPS_API_KEY=your_api_key_here
FIREBASE_API_KEY=your_firebase_api_key
```

---

### 📱 App Features Checklist

- ✅ Phone OTP Authentication
- ✅ Real-time Maps Integration
- ✅ Multiple Vehicle Types
- ✅ Fare Estimation
- ✅ Cash Payment
- ✅ Ride Booking
- ✅ Live Ride Tracking
- ✅ Ride History
- ✅ User Profile Management
- ✅ Logout Functionality

---

### 🎯 Next Steps

1. **Add Driver App**: Create companion driver app
2. **Payment Gateway**: Integrate Stripe/PayPal for card payments
3. **Push Notifications**: Add FCM for ride updates
4. **Rating System**: Implement driver/rider ratings
5. **Promo Codes**: Add discount system
6. **Multi-language**: Add Arabic language support
7. **Analytics**: Integrate Firebase Analytics

---

### 📞 Support

If you face any issues:
- Check the [README.md](README.md)
- Review Firebase Console for errors
- Check Metro bundler logs
- Email: rehan.khan993399@gmail.com

---

**Happy Coding! 🚕💨**
