# Contributing to Yadamah Rider App

First off, thank you for considering contributing to Yadamah Rider App! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Device/OS information**
- **App version**

**Example:**
```
Title: App crashes when selecting Premium vehicle

Description: The app crashes immediately after selecting the Premium vehicle type on the booking screen.

Steps to Reproduce:
1. Open the app and login
2. Click "Book a Ride"
3. Select "Premium" vehicle
4. App crashes

Expected: Premium vehicle should be selected
Actual: App crashes

Device: Samsung Galaxy S21
OS: Android 13
App Version: 1.0.0
```

### 💡 Suggesting Features

Feature suggestions are welcome! Please include:

- **Clear use case**
- **Expected behavior**
- **Why this feature is useful**
- **Mockups/examples** (if applicable)

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: New feature or functionality`
- `Fix: Bug fix`
- `Update: Improvements to existing features`
- `Refactor: Code restructuring`
- `Docs: Documentation changes`
- `Style: Code formatting, no logic changes`
- `Test: Adding or updating tests`

**Examples:**
```
Add: Cash payment confirmation screen
Fix: Map not centering on user location
Update: Improve ride booking UI
Refactor: Simplify authentication logic
Docs: Update Firebase setup guide
```

## Development Setup

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio / Xcode
- Firebase account
- Google Maps API key

### Setup Steps
1. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/yadamah-rider-app.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure Firebase (see FIREBASE_SETUP.md)
4. Add Google Maps API key
5. Run the app
   ```bash
   npm run android  # or npm run ios
   ```

## Code Style

### JavaScript/React Native
- Use **functional components** with hooks
- Follow **ESLint** rules
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep components **small and focused**

**Good:**
```javascript
const BookingScreen = ({ navigation, route }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('standard');
  
  const handleVehicleSelection = (vehicleType) => {
    setSelectedVehicle(vehicleType);
    calculateFare(vehicleType);
  };
  
  return (
    // Component JSX
  );
};
```

**Avoid:**
```javascript
const BookingScreen = (props) => {
  const [v, setV] = useState('standard');
  
  const f = (t) => {
    setV(t);
    calc(t);
  };
  
  return (
    // Component JSX
  );
};
```

### File Structure
```
src/
├── screens/          # Screen components
├── components/       # Reusable components
├── services/         # API and Firebase services
├── utils/            # Helper functions
├── constants/        # App constants
└── assets/           # Images, fonts, etc.
```

## Testing

Before submitting a PR:

- ✅ Test on both Android and iOS
- ✅ Test all affected features
- ✅ Check for console errors
- ✅ Verify Firebase integration
- ✅ Test with different screen sizes
- ✅ Check performance

## Areas for Contribution

### High Priority
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Push notifications
- [ ] Arabic language support
- [ ] Driver rating system
- [ ] In-app chat

### Medium Priority
- [ ] Ride scheduling
- [ ] Promo codes
- [ ] Saved addresses
- [ ] Trip sharing
- [ ] Dark/Light theme toggle

### Low Priority
- [ ] Animations improvements
- [ ] UI enhancements
- [ ] Performance optimizations
- [ ] Code refactoring
- [ ] Documentation improvements

## Questions?

Feel free to:
- Open an issue for discussion
- Email: rehan.khan993399@gmail.com
- Check existing documentation

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Our Standards
- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

### Unacceptable Behavior
- ❌ Harassment or discrimination
- ❌ Trolling or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the app (for major contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🚀**
