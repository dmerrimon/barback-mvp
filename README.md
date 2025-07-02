# Barback 🍻

Checkout-free bar tabs driven by web + BLE + analytics

## 🎯 Overview

Barback is a web-based platform that enables checkout-free bar experiences using QR codes and Bluetooth Low Energy (BLE) beacons. Patrons can open tabs by scanning QR codes, with automatic detection of entry/exit via BLE beacons.

## 🏗️ Architecture

- **Frontend**: React web app with dark theme
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL + Redis
- **Payments**: Stripe integration
- **Hardware**: BLE iBeacons for zone detection

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

## 📱 User Flow

1. **QR Scan**: Patron scans QR code at table/bar
2. **Payment Setup**: Enter payment info via Stripe Elements
3. **Zone Detection**: BLE beacons detect entry to bar zone
4. **Tab Management**: Bartender adds items to tab
5. **Auto Checkout**: Exit detection triggers payment with tip prompt

## 🛠️ Tech Stack

- React.js with TypeScript
- Node.js with Express
- PostgreSQL database
- Redis for sessions
- Stripe for payments
- Web Bluetooth API
- Socket.io for real-time updates

## 📊 Business Model

- Per-transaction fee (2-2.5%)
- Premium analytics dashboard
- Tip processing optimization

---

Built with ❤️ for the modern bar experience