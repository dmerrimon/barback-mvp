# Barback Mobile - Bartender Dashboard

React Native mobile application for bartenders and bar staff to manage checkout-free bar tabs in real-time.

## 🚀 Features

### Core Functionality
- **Real-time Session Management**: View and manage active customer sessions
- **Quick Item Addition**: Add drinks and food to customer tabs instantly
- **Payment Processing**: Handle payments and tab closure
- **Push Notifications**: Send "drink ready" alerts to customers
- **QR Code Scanning**: Scan customer QR codes for new sessions

### Bartender Workflow
- **Dashboard Overview**: Key metrics, revenue, active sessions
- **Session Details**: Customer info, order history, payment status
- **Menu Integration**: Quick access to full beverage database
- **Real-time Updates**: Live sync with web dashboard and other devices

### Technical Features
- **Dark Mode UI**: Optimized for bar lighting conditions
- **Offline Capability**: Continue working during network issues
- **Touch-optimized**: Designed for iPad/tablet use at bar stations
- **Secure Authentication**: Role-based access for staff

## 📱 Screenshots

*Coming soon - app screenshots will be added here*

## 🛠 Installation

### Prerequisites
- Node.js 16+ 
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup
1. **Clone the repository**
   ```bash
   cd /Users/donmerriman/barback/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add logo assets**
   - Place `logo-dark.png` and `logo-light.png` in `/assets/` folder
   - Logos should be 512x512px for best quality

4. **Start development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   ```

## 🎨 Design System

### Color Palette
```javascript
// Light Mode
background: '#FCFCFC'
text: '#32302f'

// Dark Mode (Primary)
background: '#32302f'
text: '#fcfcfc'

// Accent Colors
primary: '#00D4AA'
secondary: '#0091FF'
success: '#51CF66'
warning: '#FFD43B'
error: '#FF6B6B'
```

### Logo Implementation
- **Light backgrounds**: Uses `logo-dark.png`
- **Dark backgrounds**: Uses `logo-light.png`
- Automatic switching based on theme
- Responsive sizing: small (24px), medium (32px), large (48px)

## 📖 Usage

### For Bartenders
1. **Login** with staff credentials
2. **View Dashboard** for real-time metrics
3. **Manage Sessions** - see all active customer tabs
4. **Add Items** to customer orders quickly
5. **Send Notifications** when drinks are ready
6. **Process Payments** when customers want to close tabs

### Key Workflows
- **New Customer**: Scan QR code → Start session
- **Add Order**: Select session → Add items from menu
- **Notify Customer**: Select session → Send "ready" notification
- **Close Tab**: Process payment → End session

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the mobile directory:
```
API_BASE_URL=http://localhost:3001
STRIPE_PUBLISHABLE_KEY=pk_test_...
WEBSOCKET_URL=ws://localhost:3001
```

### Push Notifications
- Configure Expo notifications
- Set up Firebase Cloud Messaging (FCM)
- Handle notification permissions

## 🏗 Architecture

### Screen Structure
```
src/
├── screens/
│   ├── LoginScreen.js          # Staff authentication
│   ├── DashboardScreen.js      # Main overview
│   ├── SessionsScreen.js       # Active customer sessions
│   ├── SessionDetailScreen.js  # Individual session management
│   ├── MenuScreen.js           # Menu browsing
│   ├── AddItemScreen.js        # Add items to orders
│   ├── PaymentsScreen.js       # Payment processing
│   └── SettingsScreen.js       # App settings
├── contexts/
│   ├── AuthContext.js          # Authentication state
│   ├── ThemeContext.js         # Dark/light mode
│   └── SocketContext.js        # Real-time updates
└── utils/
    └── theme.js                # Design system
```

### Navigation Flow
```
Login → Main Tabs → [Dashboard, Sessions, Menu, Payments, Settings]
         ↓
Session Detail → Add Items
         ↓
Payment Processing
```

## 🔐 Security

- **Role-based authentication**: Only authorized staff can access
- **Secure token storage**: JWT tokens stored securely
- **API encryption**: All communication encrypted
- **Session management**: Automatic logout on inactivity

## 🔄 Real-time Features

- **WebSocket integration**: Live updates across all devices
- **Session synchronization**: Changes reflect immediately
- **Notification delivery**: Real-time push notifications
- **Conflict resolution**: Handle multiple staff editing same session

## 📊 Performance

- **Optimized for tablets**: Primary target is iPad at bar stations
- **Efficient rendering**: FlatList for large session lists
- **Image optimization**: Compressed logos and assets
- **Memory management**: Proper cleanup of subscriptions

## 🧪 Testing

```bash
# Run tests
npm test

# E2E testing
npm run test:e2e

# Performance testing
npm run test:performance
```

## 🚀 Deployment

### Production Build
```bash
# Build for production
expo build:ios
expo build:android

# Or using EAS Build
eas build --platform ios
eas build --platform android
```

### App Store Deployment
1. Configure app signing
2. Build production version
3. Upload to App Store Connect
4. Submit for review

## 🤝 Integration

### Backend API
- Connects to main Barback backend
- RESTful API for CRUD operations
- WebSocket for real-time updates

### Web Dashboard Sync
- Shared data models
- Real-time synchronization
- Consistent user experience

## 📋 Roadmap

### Phase 1 (Current)
- ✅ Core bartender functionality
- ✅ Session management
- ✅ Real-time updates
- ✅ Payment processing

### Phase 2 (Future)
- [ ] Inventory management
- [ ] Advanced analytics
- [ ] Voice commands
- [ ] Apple Watch support

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build fails**: Ensure Xcode is updated
3. **Android build fails**: Check Android SDK configuration
4. **WebSocket connection**: Verify API_BASE_URL in environment

### Debug Mode
```bash
# Enable debug mode
npm start -- --dev-client

# View logs
npx react-native log-ios
npx react-native log-android
```

## 📝 License

Copyright © 2024 Barback. All rights reserved.

---

**Barback Mobile** - Streamlining bar operations, one tap at a time.