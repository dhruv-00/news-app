# City News Search Platform

A full-stack application that allows users to search for daily news by city and enables administrators to monitor user activity and engagement. Built with React Native (Expo), Convex backend, and Google SERP API.

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Mobile app      | React Native (Expo)                         |
| Admin dashboard | Expo Web (React)                            |
| Backend         | Convex (auth + functions)                   |
| Database        | Convex (document store)                     |
| News API        | Google SERP API (SerpAPI)                   |
| Auth            | Convex Auth (email + password, token-based) |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh) or npm
- [Expo Go](https://expo.dev/go) (for mobile) or a browser (for web/admin)
- [Convex](https://convex.dev) account

### 1. Clone and install

```bash
git clone <repository-url>
cd convex-native
bun install
# or: npm install
```

### 2. Convex setup

```bash
# Login to Convex (if not already)
npx convex login

# Create a new project or link to existing
npx convex dev
```

This starts the Convex dev server and deploys your functions. Keep it running in a separate terminal.

### 3. Environment variables

Create `.env.local` in the project root with:

```env
# Convex (from Convex dashboard after `npx convex dev`)
CONVEX_DEPLOYMENT=dev:your-project-name
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://your-project.convex.site

# Google Places API – city autocomplete (https://console.cloud.google.com)
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

SerpAPI is used for news search. Get an API key from [serpapi.com](https://serpapi.com). The key is currently configured in `src/services/news-api-service.ts`; for production, move it to a Convex HTTP action and use environment variables.

---

## How to Run

### Backend (Convex)

```bash
npx convex dev
```

Runs the Convex dev server, syncs schema and functions, and streams logs.

### Mobile app (user app)

```bash
bun start
# or: npm start
# or: expo start
```

Then:

- **iOS Simulator**: press `i` in the terminal
- **Android Emulator**: press `a`
- **Physical device**: scan the QR code with Expo Go
- **Web**: press `w`

### Admin dashboard

1. Start the app as above.
2. Open `http://localhost:8081` (or the displayed web URL) in a browser.
3. The admin dashboard is shown on web; mobile and native apps show the user app.

---

## Test Admin Credentials

#### Existing admin user

```bash
email: admin@test.com
password: 12345678
```

### Creating an admin user

1. Register a normal user in the app (e.g. `admin@example.com`).
2. Promote them to admin from the terminal:

```bash
npx convex run seedAdmin:promoteToAdmin '{"email":"admin@example.com"}'
```

3. Sign in at the admin login page on web with that user.

### Example test admin

- **Email**: `admin@example.com`
- **Password**: (whatever you set during registration)

---

## Database Schema

### Entity relationship (conceptual)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│     users       │     │   userProfiles   │     │   searchLogs    │
│ (Convex Auth)   │────<│                  │     │                 │
├─────────────────┤     ├──────────────────┤     ├─────────────────┤
│ _id             │     │ _id              │     │ _id             │
│ name            │     │ userId ──────────┼────>│ userId ─────────┤
│ email           │     │ city             │     │ searchQuery     │
│ image           │     │ lastLoginAt      │     │ timestamp       │
│ ...             │     │ isAdmin          │     │ activeTimestamp │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                          │
        │                          │
        │                ┌─────────────────┐
        └───────────────>│  userSessions   │
                         ├─────────────────┤
                         │ _id             │
                         │ userId ─────────┤
                         │ loginTime       │
                         │ logoutTime      │
                         │ durationSeconds │
                         └─────────────────┘
```

### Table definitions

#### Auth tables (Convex Auth)

- **users** – `_id`, `name`, `email`, `image`, `emailVerificationTime`, etc.
- **authSessions** – `userId`, `expirationTime`
- **authAccounts** – `userId`, `provider`, `providerAccountId`, `secret`, etc.
- **authRefreshTokens**, **authVerificationCodes**, **authVerifiers**, **authRateLimits**

#### Application tables

| Table            | Fields                                                  | Description                    |
| ---------------- | ------------------------------------------------------- | ------------------------------ |
| **userProfiles** | `userId`, `city`, `lastLoginAt`, `isAdmin`              | User profile and admin flag    |
| **searchLogs**   | `userId`, `searchQuery`, `timestamp`, `activeTimestamp` | Search history and active time |
| **userSessions** | `userId`, `loginTime`, `logoutTime`, `durationSeconds`  | Session duration tracking      |

### Indexes

- `userProfiles`: `userId`, `isAdmin`
- `searchLogs`: `userId`, `timestamp`
- `userSessions`: `userId`, `loginTime`

---

## What Is Implemented

### Authentication

- [x] Email + password login and registration
- [x] Token-based auth (Convex Auth)
- [x] Protected routes (user app and admin)
- [x] Logout

### Mobile app (user)

- [x] **Login / Register** – Email and password auth
- [x] **User dashboard**
  - City selection via autocomplete (Google Places)
  - News search using `"latest news in {city}"` and optional custom query
  - Results from Google SERP API: title, description, source, published date, article link
  - Article links open in browser
- [x] **Search tracking** – Each search stored with `user_id`, `search_query`, `timestamp`, active time

### Session tracking

- [x] Session start (app active/foreground)
- [x] Session end (app background or logout)
- [x] Total session duration
- [x] Login and logout timestamps

### Admin dashboard (web)

- [x] **Users** – Name, email, city, last login
- [x] **Search logs** – User email, search query, date/time, active duration
- [x] **User sessions** – Login time, logout time, session duration
- [x] Admin login and `isAdmin` access control

### Backend

- [x] Convex functions for auth, profiles, search logs, sessions
- [x] SerpAPI integration for news (currently called from client)
- [x] Admin queries protected by `isAdmin` check

---

## Project Structure

```
convex-native/
├── app/
│   ├── (auth)/           # Login, register
│   ├── (app)/            # User dashboard (mobile)
│   ├── (admin)/          # Admin dashboard (web)
│   └── _layout.tsx
├── convex/
│   ├── auth.ts           # Convex Auth config
│   ├── schema.ts         # Database schema
│   ├── admin.ts          # Admin queries
│   ├── searchLogs.ts     # Search logging
│   ├── sessions.ts       # Session recording
│   ├── userProfiles.ts   # User profiles
│   ├── seedAdmin.ts      # Admin promotion
│   └── http.ts           # HTTP routes (auth)
├── src/
│   ├── components/       # UI components
│   ├── hooks/            # useSessionTracker, etc.
│   ├── services/         # News, tracking, Google API
│   ├── stores/           # Zustand (location)
│   └── types/
└── package.json
```

---

## Assumptions & Notes

1. **Admin dashboard** – Implemented as Expo Web; admin routes are shown when `Platform.OS === 'web'`.
2. **Database** – Convex document store instead of PostgreSQL/MySQL, as Convex is the backend.
3. **City input** – Google Places autocomplete instead of a plain text input for better UX.
4. **News API** – SerpAPI is called from the client. For production, move this to a Convex HTTP action and keep the API key server-side.
5. **Session timing** – Sessions are recorded when the app goes to background or the user logs out. Exact precision may vary with app lifecycle events.

---

## License

Private – interview assignment.
