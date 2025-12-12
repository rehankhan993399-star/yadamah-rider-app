# 🔥 Firebase Configuration Guide

## Firebase Project Setup

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter Project Name: **Yadamah**
4. Click Continue
5. Disable Google Analytics (optional for development)
6. Click **"Create Project"**

---

### 2. Enable Phone Authentication

1. In Firebase Console, navigate to **Authentication**
2. Click **"Get Started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Phone"**
5. Toggle to **Enable**
6. Click **"Save"**

#### Add Test Phone Numbers (Optional for Development)
- Phone: `+966500000000`
- Verification Code: `123456`

---

### 3. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (for development)
4. Choose location: **asia-south1** (or closest to Saudi Arabia)
5. Click **"Enable"**

#### Firestore Collections Structure

Create these collections manually or they'll be auto-created:

**Collection: `riders`**
```
riders/
  └── {userId}/
      ├── name: string
      ├── phoneNumber: string
      ├── email: string
      ├── totalRides: number
      ├── rating: number
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

**Collection: `rides`**
```
rides/
  └── {rideId}/
      ├── riderId: string
      ├── pickup: string
      ├── destination: string
      ├── vehicleType: string
      ├── estimatedFare: number
      ├── status: string
      ├── paymentMethod: string
      ├── pickupLocation: geopoint
      ├── createdAt: timestamp
      └── completedAt: timestamp
```

---

### 4. Create Realtime Database

1. Navigate to **Realtime Database**
2. Click **"Create Database"**
3. Select **"Start in test mode"**
4. Click **"Enable"**

#### Realtime Database Structure

```json
{
  "activeRides": {
    "{rideId}": {
      "riderId": "user_uid",
      "pickup": "Location Name",
      "destination": "Destination Name",
      "status": "searching",
      "vehicleType": "standard",
      "estimatedFare": 50,
      "createdAt": 1234567890,
      "driverLocation": {
        "latitude": 24.7136,
        "longitude": 46.6753
      },
      "driver": {
        "name": "Driver Name",
        "vehicle": "Toyota Camry",
        "plateNumber": "ABC 1234"
      }
    }
  }
}
```

---

### 5. Security Rules

#### Firestore Rules

Navigate to **Firestore Database → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Riders collection - users can only read/write their own data
    match /riders/{riderId} {
      allow read: if request.auth != null && request.auth.uid == riderId;
      allow create: if request.auth != null && request.auth.uid == riderId;
      allow update: if request.auth != null && request.auth.uid == riderId;
      allow delete: if false; // Prevent deletion
    }
    
    // Rides collection
    match /rides/{rideId} {
      // Anyone authenticated can read rides
      allow read: if request.auth != null;
      
      // Only authenticated users can create rides
      allow create: if request.auth != null && 
                      request.resource.data.riderId == request.auth.uid;
      
      // Riders and drivers can update their rides
      allow update: if request.auth != null && 
                      (request.auth.uid == resource.data.riderId || 
                       request.auth.uid == resource.data.driverId);
      
      // Prevent deletion
      allow delete: if false;
    }
  }
}
```

Click **"Publish"**

#### Realtime Database Rules

Navigate to **Realtime Database → Rules** and paste:

```json
{
  "rules": {
    "activeRides": {
      "$rideId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Click **"Publish"**

---

### 6. Download Configuration Files

#### For Android

1. In Firebase Console, click ⚙️ (Settings) → **Project Settings**
2. Scroll to **"Your apps"** section
3. Click **Android icon** (or "Add app" if not added)
4. Fill in:
   - **Android package name**: `com.yadamahrider`
   - **App nickname**: Yadamah Rider (optional)
   - **Debug signing certificate SHA-1**: (optional for now)
5. Click **"Register app"**
6. Download **`google-services.json`**
7. Place file in: `android/app/google-services.json`

#### For iOS

1. In Firebase Console, click ⚙️ → **Project Settings**
2. Scroll to **"Your apps"** section
3. Click **iOS icon** (or "Add app")
4. Fill in:
   - **iOS bundle ID**: `com.yadamahrider`
   - **App nickname**: Yadamah Rider (optional)
5. Click **"Register app"**
6. Download **`GoogleService-Info.plist`**
7. Place file in: `ios/YadamahRider/GoogleService-Info.plist`

---

### 7. Firebase Indexes (Optional but Recommended)

For better query performance, create these indexes:

Navigate to **Firestore Database → Indexes**

**Index 1: Rides by Rider**
- Collection: `rides`
- Fields:
  - `riderId` (Ascending)
  - `createdAt` (Descending)

**Index 2: Rides by Status**
- Collection: `rides`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

---

### 8. Test Firebase Connection

After setup, test the connection:

```javascript
// Test Firestore
import firestore from '@react-native-firebase/firestore';

firestore()
  .collection('riders')
  .get()
  .then(() => console.log('Firestore connected!'));

// Test Realtime Database
import database from '@react-native-firebase/database';

database()
  .ref('/')
  .once('value')
  .then(() => console.log('Realtime Database connected!'));

// Test Auth
import auth from '@react-native-firebase/auth';

console.log('Auth initialized:', auth().currentUser);
```

---

### 9. Production Security Rules

Before going to production, update rules:

#### Firestore Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /riders/{riderId} {
      allow read: if request.auth != null && request.auth.uid == riderId;
      allow create: if request.auth != null && 
                      request.auth.uid == riderId &&
                      request.resource.data.keys().hasAll(['name', 'phoneNumber']);
      allow update: if request.auth != null && 
                      request.auth.uid == riderId &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['totalRides']);
      allow delete: if false;
    }
    
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.resource.data.riderId == request.auth.uid &&
                      request.resource.data.status == 'searching';
      allow update: if request.auth != null && 
                      (request.auth.uid == resource.data.riderId || 
                       request.auth.uid == resource.data.driverId) &&
                      request.resource.data.riderId == resource.data.riderId;
      allow delete: if false;
    }
  }
}
```

#### Realtime Database Production Rules

```json
{
  "rules": {
    "activeRides": {
      "$rideId": {
        ".read": "auth != null",
        ".write": "auth != null && 
                  (data.child('riderId').val() == auth.uid || 
                   data.child('driverId').val() == auth.uid)"
      }
    }
  }
}
```

---

### 10. Firebase Quotas & Limits

**Free Tier (Spark Plan):**
- Firestore: 50K reads, 20K writes, 20K deletes per day
- Realtime Database: 100 simultaneous connections, 1GB storage
- Authentication: Unlimited

**Paid Tier (Blaze Plan):**
- Pay as you go
- Required for production apps
- Enable in Firebase Console → ⚙️ → Usage and billing

---

### 🎯 Checklist

- ✅ Firebase project created
- ✅ Phone authentication enabled
- ✅ Firestore database created
- ✅ Realtime database created
- ✅ Security rules configured
- ✅ `google-services.json` downloaded and placed
- ✅ `GoogleService-Info.plist` downloaded and placed
- ✅ Test connection successful

---

### 📞 Troubleshooting

**Issue: "Default Firebase app not initialized"**
- Ensure config files are in correct locations
- Rebuild the app completely

**Issue: "Phone authentication not working"**
- Check if Phone auth is enabled in Firebase Console
- Verify phone number format (+966xxxxxxxxx)
- Check Firebase Console → Authentication → Users for errors

**Issue: "Permission denied" errors**
- Review security rules
- Ensure user is authenticated
- Check if user UID matches document ID

---

**Firebase Setup Complete! 🎉**
