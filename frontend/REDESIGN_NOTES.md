# Smart Agriculture UI Redesign — What Changed

This is your original `smart-agri-frontend` project with a full UI/UX redesign layered
on top. All existing routes, backend API calls, WebSocket logic, and auth flow were
preserved — only the presentation layer and a handful of new pages were added.

## Setup
```bash
npm install
npm run dev      # local dev server (port 3000, proxies /api and /ws to :8080)
npm run build    # production build
```

## What's new

**Design system** (`src/index.css`)
- Refreshed green/white/natural color palette, new shadows, rounded corners, badges.
- Class-based dark mode (`@custom-variant dark`) toggled via the header sun/moon button,
  persisted to `localStorage`, and respects the OS preference on first visit.
- Skeleton-loading shimmer utility classes for async states.

**Layout**
- `Sidebar.jsx` — grouped navigation (Overview / Farm Management / Community / Tools /
  Account), collapsible on desktop, slide-in drawer on mobile, active-route indicator.
- `Header.jsx` — search, dark-mode toggle, notification center, profile menu.
- `Layout.jsx` — responsive shell tying them together.

**New pages** (all wired into `App.jsx`, all protected routes)
- `/live-monitoring` — real-time cards for all 6 sensors + live chart.
- `/sensor-details` — per-sensor detail view with a searchable/sortable reading history table.
- `/chatbot` — AI farming assistant (calls `chatbotAPI.sendMessage`, falls back to a local
  helpful reply if no backend endpoint is wired up yet).
- `/profile` — view/edit profile, change password, upload a profile picture.
- `/settings` — dark mode, notification preferences, units, language, danger zone.

**Dashboard (`/dashboard`)**
- Six sensor cards (Capacitive Soil Moisture, DHT22 Temp & Humidity, LDR Light, Rain,
  Water Level, BMP280 Pressure) with live sparklines and threshold-based status badges.
- KPI strip, moisture/temperature/humidity trend charts, weather & crop widgets, and the
  irrigation status panel — all preserved from the original and restyled.

**New shared components**
- `components/dashboard/SensorCard.jsx`, `components/common/SearchableTable.jsx`,
  `components/common/Skeleton.jsx` (loading skeletons), redesigned `Card`, `Button`,
  `Loader`, `StatsCard`.
- `hooks/useSensorFeed.js` — merges live WebSocket sensor pushes (via the existing
  `useWebSocket`/`useStore`) with a gentle simulated fallback so the dashboard is fully
  functional even without a live IoT gateway attached; maps legacy `moisture` field to
  the new `soilMoisture` sensor id for backward compatibility with the original API shape.
- `utils/constants.js` — added `sensorDefinitions`, the single source of truth for the
  six sensors' units, icons, thresholds and descriptions.
- `services/api.js` — added `chatbotAPI` and `userAPI` endpoint groups for future backend
  integration (profile update, password change, avatar upload, chatbot messages).

## Notes for hooking up your real backend
- Sensor field names: point your WebSocket payload's keys at `soilMoisture`, `temperature`,
  `humidity`, `lightIntensity`, `rainfall`, `waterLevel`, `pressure` (see
  `src/utils/constants.js:sensorDefinitions`) so `useSensorFeed` picks them up automatically
  in place of the simulated values.
- Chatbot: implement `POST /chatbot/message` returning `{ reply: string }` — the frontend
  already calls it and gracefully falls back if it 404s.
- Profile/password/avatar: `userAPI` in `src/services/api.js` has matching endpoints ready to
  swap in once your backend supports them (the pages currently save via the local
  `AuthContext`/localStorage mock, matching the rest of the app's existing auth pattern).

## Known limitation in this environment
This sandbox has no network access, so `npm install` / `npm run build` could not be run
here to produce a verified build. All files were reviewed statically (import resolution,
bracket/paren balance, unused-import checks) and are structured consistently with the
rest of the codebase, but please run `npm install && npm run build` locally as a final
sanity check before deploying.
