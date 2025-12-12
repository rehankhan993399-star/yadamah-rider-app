# 🚕 Yadamah Rider App

A modern, feature-rich taxi booking mobile application built with React Native and Firebase.

## ✨ Features

- 📱 **Cross-Platform**: Works on both Android and iOS
- 🔐 **OTP Authentication**: Secure phone number-based login
- 🗺️ **Real-time Maps**: Live location tracking with Google Maps
- 🚗 **Multiple Vehicle Types**: Standard, Comfort, and Premium options
- 💰 **Cash Payment**: Simple cash payment system
- 📊 **Ride History**: Track all your past rides
- 👤 **User Profile**: Manage your personal information
- 🔔 **Real-time Updates**: Live ride status and driver tracking
- 📍 **GPS Integration**: Accurate pickup and destination tracking

## 🛠️ Tech Stack

- **React Native** 0.73.0
- **Firebase**
  - Authentication (Phone OTP)
  - Firestore (Database)
  - Realtime Database (Live tracking)
- **React Navigation** 6.x
- **React Native Maps**
- **Geolocation Services**
- **Vector Icons**

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Firebase account

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/rehankhan993399-star/yadamah-rider-app.git
cd yadamah-rider-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Phone Authentication** in Firebase Authentication
3. Create **Firestore Database** and **Realtime Database**
4. Download configuration files:
   - For Android: `google-services.json` → Place in `android/app/`
   - For iOS: `GoogleService-Info.plist` → Place in `ios/YadamahRider/`

### 4. Google Maps Setup

#### Android
1. Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

#### iOS
1. Add to `ios/YadamahRider/AppDelegate.mm`:
```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
  // ... rest of the code
}
```

### 5. Install iOS Pods (iOS only)

```bash
cd ios
pod install
cd ..
```

## 📱 Running the App

### Android

```bash
npm run android
# or
yarn android
```

### iOS

```bash
npm run ios
# or
yarn ios
```

## 📂 Project Structure

```
yadamah-rider-app/
├── src/
│   └── screens/
│       ├── SplashScreen.js      # App loading screen
│       ├── LoginScreen.js       # OTP authentication
│       ├── HomeScreen.js        # Main map view
│       ├── BookingScreen.js     # Ride booking
│       ├── RideTrackingScreen.js # Live ride tracking
│       ├── RideHistoryScreen.js  # Past rides
│       └── ProfileScreen.js      # User profile
├── App.js                        # Main app component
├── index.js                      # Entry point
└── package.json                  # Dependencies
```

## 🔥 Firebase Collections Structure

### Firestore Collections

#### `riders` Collection
```javascript
{
  name: "User Name",
  phoneNumber: "+966xxxxxxxxx",
  email: "user@example.com",
  totalRides: 0,
  rating: 5.0,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `rides` Collection
```javascript
{
  riderId: "user_uid",
  pickup: "Pickup Location",
  destination: "Destination",
  vehicleType: "standard",
  estimatedFare: 50,
  status: "searching|accepted|started|completed|cancelled",
  paymentMethod: "cash",
  pickupLocation: {
    latitude: 24.7136,
    longitude: 46.6753
  },
  createdAt: timestamp,
  completedAt: timestamp
}
```

### Realtime Database Structure

```
activeRides/
  └── {rideId}/
      ├── riderId
      ├── pickup
      ├── destination
      ├── status
      ├── driverLocation
      │   ├── latitude
      │   └── longitude
      └── driver
          ├── name
          ├── vehicle
          └── plateNumber
```

## 🎨 App Screens

1. **Splash Screen** - App loading
2. **Login Screen** - Phone OTP authentication
3. **Home Screen** - Map view with current location
4. **Booking Screen** - Select vehicle and book ride
5. **Ride Tracking** - Real-time ride monitoring
6. **Ride History** - View past rides
7. **Profile** - Manage user settings

## 🔧 Configuration

### Update App Name
Edit `app.json`:
```json
{
  "name": "YadamahRider",
  "displayName": "Yadamah Rider"
}
```

### Update Package Name (Android)
1. Edit `android/app/build.gradle`
2. Change `applicationId`

### Update Bundle Identifier (iOS)
1. Open `ios/YadamahRider.xcworkspace` in Xcode
2. Update Bundle Identifier in project settings

## 🚀 Deployment

### Android APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS App Store

1. Open Xcode
2. Select "Any iOS Device"
3. Product → Archive
4. Upload to App Store Connect

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Created by **RAHMATULLAH ANSARI**

## 📞 Support

For support, email: rehan.khan993399@gmail.com

---

**Happy Coding! 🚕💨**
