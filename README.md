# Clothing Store

A React Native CLI mobile application for browsing clothing products and managing a small clothing store. The app uses TypeScript, React Navigation, and a local SQLite database.

## Features

### Customer

- Browse products with a rotating promotional banner.
- Filter by category and price range; search by product or category name.
- View product details and add products to a personal cart.
- Register, sign in, update account details, and sign out.
- Review the cart, place orders, and view order history.

### Administration

- Admin home and user/role management.
- Create, edit, and delete product categories.
- Create, edit, and delete products; add products directly to a selected category.
- Review orders and update their statuses.

## Technology

- React Native CLI (Expo is not used)
- React Native 0.87.1 and React 19.2.3
- TypeScript 6.0.3
- SQLite via `react-native-nitro-sqlite`
- React Navigation
- npm

## Project Structure

```text
.
├── android/                 # Android native project
├── ios/                     # iOS native project
├── src/
│   ├── assets/               # Local image assets
│   ├── components/           # Shared UI components
│   ├── contexts/             # Authentication state
│   ├── database/             # SQLite connection, schema, and seed data
│   ├── navigation/           # Authentication, user, and admin navigators
│   ├── repositories/         # SQLite queries
│   ├── screens/              # Authentication, customer, and admin screens
│   ├── services/             # Business logic and validation
│   └── types/                # Shared TypeScript types
├── App.tsx
├── app.json
├── index.js
├── package.json
└── package-lock.json
```

## Requirements

- Node.js `>= 22.11.0`
- npm
- Android Studio and Android SDK to build for Android
- macOS, Xcode, and CocoaPods to build for iOS

## Installation

```sh
npm ci
```

## Run on Android

Start Metro in one terminal:

```sh
npm start
```

In another terminal, build and launch the app on a connected device or emulator:

```sh
npm run android
```

To build a debug APK directly on Windows:

```powershell
.\android\gradlew.bat -p android :app:assembleDebug
```

## Run on iOS

iOS builds require macOS and Xcode. Install CocoaPods dependencies and run the app:

```sh
bundle install
bundle exec pod install
npm run ios
```

## Database

The app initializes a local SQLite database named `myDatabase.db` with `react-native-nitro-sqlite`. It creates tables for categories, products, users, cart items, orders, and order items. When the relevant tables are empty, the seed routine inserts sample clothing categories and products.

## Demo Admin Account

The source seed routine defines this local demo account:

- Username: `admin@gmail.com`
- Password: `Admin@123`

This account is for development/demo use only. The current seed routine reapplies the default password on every database initialization; replace this behavior and credential before production use.

## Screenshots

Screenshots are not available yet.

## Author

Author information has not been provided.

## Native Project Names

The app component is registered as `ClothingStore`, and the Android namespace/application ID and iOS bundle identifier are `com.dung.clothingstore`. Existing Android Gradle project and iOS Xcode project/scheme names remain unchanged to avoid unnecessary native project renames.
