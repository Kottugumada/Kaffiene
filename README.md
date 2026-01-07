# Kaffiene ☕

A cross-platform mobile app for dialing in better espresso shots and brewing better coffee. Built with React Native, TypeScript, and SQLite.

## Features

- **Guided Dial-In Wizard**: Step-by-step process for dialing in new beans
- **Shot Logging**: Track your espresso shots with ratio-first design
- **Troubleshooting**: Questionnaire-based diagnosis for shot issues
- **Seed Data**: Comprehensive starting recipes based on origin and roast level
- **User Profile**: Tracks preferences for personalized recommendations (ML-ready)
- **Offline-First**: Works completely offline, sync ready for V2

## Tech Stack

- **Mobile**: React Native (Expo)
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: Zustand
- **Navigation**: React Navigation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (optional, included via npx)
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your phone

### Installation

```bash
cd mobile
npm install
```

### Running the App

```bash
# Start Expo development server
cd mobile
npm start

# Or run directly on iOS/Android
npm run ios
npm run android
```

## Project Structure

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── store/         # Zustand state management
│   ├── repositories/  # Data access layer
│   ├── database/      # SQLite schema & migrations
│   ├── services/      # Business logic & recommendations
│   ├── data/          # Seed data & user profiles
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── theme/         # Design system
│   └── navigation/    # Navigation setup
└── App.tsx            # Entry point
```

## Key Features

### Seed Data System

The app includes comprehensive seed data:
- **20+ pre-populated beans** (Ethiopian, Kenyan, Colombian, Brazilian, Central American, Indonesian, Blends)
- **Origin-based recipes** (Ethiopia, Kenya, Colombia, Brazil, Guatemala, Sumatra)
- **Roast level recipes** (Light, Medium, Dark, Espresso)
- **Processing method recipes** (Natural, Washed, Wet-hulled)
- **Automatic recommendations** based on bean origin, roast level, and processing method

### Guided Dial-In

9-step wizard that walks users through:
1. Set intention
2. Baseline recipe (auto-filled from seed data)
3. Dial grind first
4. Taste evaluation
5. Adjust ratio
6. Re-taste & confirm
7. Adjust dose (if needed)
8. Fine-tune temperature
9. Lock it in & log
10. Final feedback: "How Was Your Shot?"

### User Profile (V2 ML Ready)

Tracks:
- Preferred origins, roast levels, processing methods
- Successful ratios, doses, temperatures
- Taste preferences
- Shot history for ML training

## Design System

- **Colors**: Vibrant terracotta espresso (#E67E5A), golden caramel (#F0B574)
- **Typography**: Modern, readable with proper letter spacing
- **Shadows**: Multi-level elevation system
- **Spacing**: Generous whitespace, 16pt base unit

## Database Schema

- `beans` - Coffee beans (seed + user-added)
- `brew_logs` - Shot/brew logs with flexible parameters
- `recipes` - Saved recipes
- `user_preferences` - User settings
- `troubleshooting_sessions` - Troubleshooting history

## Roadmap (V2)

- Cloud sync
- Additional brew methods (pour over, filter coffee, Turkish, Indian filter coffee, etc.)
- ML-assisted insights using user profile
- Community recipes
- Camera-based troubleshooting

## License

Apache-2.0
