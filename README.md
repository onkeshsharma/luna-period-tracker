# Luna – Period Tracker

A privacy-first, fully on-device menstrual cycle tracking Progressive Web App (PWA). All data is stored locally in the browser via `localStorage` and never sent to any server.

Built with **React 19**, **Vite**, **Tailwind CSS**, **Radix UI**, and **Recharts**.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [File-by-File Reference](#file-by-file-reference)
  - [Configuration Files](#configuration-files)
  - [Entry Points](#entry-points)
  - [Core Styling](#core-styling)
  - [Main Application](#main-application)
  - [Components](#components)
  - [UI Primitives](#ui-primitives)
  - [Hooks](#hooks)
  - [Utilities](#utilities)
  - [Public Assets](#public-assets)
- [Data Structures](#data-structures)
- [Theming](#theming)
- [PWA & Offline Support](#pwa--offline-support)
- [Notifications](#notifications)

---

## Features

- Log period start dates with optional duration (2–8 days)
- Track flow intensity, mood, and symptoms per cycle
- Predict next expected period based on personal cycle average
- Monthly calendar view with historical and predicted dates highlighted
- Cycle phase wheel (Menstrual → Follicular → Ovulation → Luteal)
- Bar chart of cycle length trends over the last 6 cycles
- Luna — an animated mascot moon that reacts to your cycle phase and interactions
- Two themes: **Cosmic** (dark purple) and **Sakura** (light pink)
- Browser push notifications for upcoming periods
- JSON export / import for data backup and restore
- Fully installable PWA — works offline after first visit

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
PeriodTrackingApp/
├── index.html                   # HTML entry point, PWA meta tags
├── vite.config.js               # Vite + PWA plugin configuration
├── tailwind.config.js           # Tailwind theme tokens and plugins
├── postcss.config.js            # PostCSS (autoprefixer, tailwindcss)
├── components.json              # shadcn/ui configuration
├── eslint.config.js             # ESLint rules
├── package.json                 # Dependencies and scripts
│
├── public/
│   ├── icons/
│   │   ├── icon-192.png         # PWA icon (192×192)
│   │   └── icon-512.png         # PWA icon (512×512)
│   └── sprites/
│       ├── luna-idle.png        # Pet sprite (idle)
│       ├── luna-happy.png       # Pet sprite (happy)
│       ├── luna-dance.png       # Pet sprite (dancing)
│       ├── luna-sleep.png       # Pet sprite (sleeping)
│       ├── luna-surprised.png   # Pet sprite (surprised)
│       └── luna-walk.png        # Pet sprite (walking)
│
└── src/
    ├── main.jsx                 # React bootstrap / DOM mount
    ├── App.jsx                  # Root component — global state + layout
    ├── index.css                # Global styles, CSS vars, animations
    │
    ├── components/
    │   ├── Header.jsx           # Top nav bar (theme, notifications, settings)
    │   ├── NextExpected.jsx     # "Next period" prediction card
    │   ├── CycleCalendar.jsx    # Monthly calendar with period highlights
    │   ├── CyclePhaseWheel.jsx  # SVG phase wheel visualization
    │   ├── AddDateForm.jsx      # Modal for logging a new cycle entry
    │   ├── HistoryCard.jsx      # Expandable card for each past cycle
    │   ├── NotificationPanel.jsx# Notification timing settings
    │   ├── StatsChart.jsx       # Recharts bar chart of cycle lengths
    │   ├── BackgroundOrbs.jsx   # Animated background blur orbs
    │   ├── Pet.jsx              # Luna mascot — animated, interactive
    │   └── ui/
    │       ├── button.jsx       # CVA-based button variants
    │       ├── calendar.jsx     # react-day-picker date picker
    │       ├── dialog.jsx       # Radix UI modal dialog
    │       ├── input.jsx        # Styled HTML input
    │       ├── label.jsx        # Radix UI label
    │       ├── popover.jsx      # Radix UI floating popover
    │       ├── select.jsx       # Radix UI dropdown select
    │       └── textarea.jsx     # Styled textarea
    │
    ├── hooks/
    │   ├── useTheme.js          # Theme state + toggle (cosmic / sakura)
    │   └── usePetState.js       # Pet happiness, mood, tap tracking
    │
    ├── utils/
    │   ├── index.js             # Re-exports all utility functions
    │   ├── dateUtils.js         # Date formatting, validation, diff helpers
    │   ├── cycleCalculations.js # Period prediction and cycle statistics
    │   └── storageUtils.js      # localStorage read/write helpers
    │
    └── lib/
        └── utils.js             # cn() — clsx + tailwind-merge helper
```

---

## File-by-File Reference

### Configuration Files

---

#### `index.html`
Entry point for the Vite build. Contains:
- Full PWA meta tags: `theme-color`, `apple-mobile-web-app-*`, `viewport` with `viewport-fit=cover` for notch-safe layout
- Icon references pointing to `/public/icons/`
- App title: "Luna – Period Tracker"
- Background color `#0f172a` (dark slate) set in `<meta name="theme-color">`
- `<div id="root">` mount point consumed by `src/main.jsx`
- `<script type="module" src="/src/main.jsx">` to bootstrap React

---

#### `vite.config.js`
Vite bundler configuration. Key settings:
- **React plugin** (`@vitejs/plugin-react`) — enables JSX transform
- **VitePWA plugin** — generates `manifest.json` and a service worker via Workbox:
  - App name: "Luna – Period Tracker"
  - Display: `standalone` (hides browser UI when installed)
  - Orientation: `portrait`
  - Icons: 192px + 512px, maskable
  - Runtime caching: `NetworkFirst` strategy for HTTPS requests, cache name `luna-api-cache`
- **Path alias**: `@` → `./src` for clean imports
- Dev server runs at default port 5173

---

#### `tailwind.config.js`
Tailwind CSS configuration. Key settings:
- **Dark mode**: `class` strategy using `[data-theme]` attribute on `<html>`
- **Content paths**: scans `./index.html` and all files in `./src/**`
- **Custom theme tokens**: maps CSS variable names (`--primary`, `--background`, etc.) to Tailwind color utilities — all defined in HSL format in `index.css`
- **Extended border-radius**: component-level radius values
- **Plugin**: `tailwindcss-animate` for transition and animation utilities

---

#### `postcss.config.js`
Minimal PostCSS setup. Enables:
- `tailwindcss` — processes Tailwind directives
- `autoprefixer` — adds vendor prefixes for browser compatibility

---

#### `components.json`
shadcn/ui CLI configuration. Defines:
- Style: `default`
- Base color: `slate`
- CSS variable usage: `true`
- Paths for aliases (`@/components`, `@/lib/utils`, etc.)
- Used by `npx shadcn add <component>` to scaffold new UI primitives

---

#### `package.json`
Project metadata and dependency manifest.

**Scripts:**

| Script | Description |
|--------|-------------|
| `dev` | Start Vite development server with HMR |
| `build` | Type-check and produce optimized production build |
| `lint` | Run ESLint across all source files |
| `preview` | Serve the production build locally |

**Key runtime dependencies:**

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework (v19) |
| `vite` | Build tool and dev server |
| `tailwindcss` | Utility CSS framework |
| `@radix-ui/*` | Accessible headless UI primitives |
| `recharts` | SVG chart library |
| `date-fns` | Date arithmetic and formatting |
| `canvas-confetti` | Confetti particle effect on cycle log |
| `lucide-react` | SVG icon set |
| `class-variance-authority` | Component variant definitions |
| `clsx` + `tailwind-merge` | Conditional class merging |
| `vite-plugin-pwa` | PWA manifest + service worker generation |
| `@fontsource-variable/geist` | Variable font (Geist) |

---

### Entry Points

---

#### `src/main.jsx`
React application bootstrap. Responsibilities:
- Imports global CSS (`index.css`)
- Mounts `<App />` into `#root` using `createRoot`
- Wraps in `<StrictMode>` for development-time warnings

---

### Core Styling

---

#### `src/index.css`

Global stylesheet. Organized into six sections:

**1. Tailwind Directives**
`@tailwind base`, `@tailwind components`, `@tailwind utilities` — required for Tailwind to inject its styles.

**2. CSS Theme Variables (`:root`)**
Three complete theme configurations declared as CSS custom properties in HSL format. Themes are activated by setting `data-theme` on `<html>`:

| Theme | Selector | Personality |
|-------|----------|-------------|
| Default/Cosmic | `:root` | Dark indigo + rose, space-like |
| Cosmic (explicit) | `[data-theme="cosmic"]` | Deep purple + magenta |
| Sakura | `[data-theme="sakura"]` | Light pink + rose |

Variables include: `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--border`, `--ring`, `--destructive`, plus three `--orb-*` colors for background animations.

**3. Base Styles**
- `*, *::before, *::after`: `box-sizing: border-box`, inherits `border-color`
- `html, body`: `min-height: 100vh`, `font-family: Inter, system-ui`, `-webkit-tap-highlight-color: transparent`

**4. Component Utility Classes**
- `.glass`: glassmorphism (`backdrop-blur`, semi-transparent background, thin border)
- `.luna-card`: glass card with standard padding/margin
- `input[type="date"]::-webkit-calendar-picker-indicator`: themed calendar icon

**5. Animation Utility Classes**

| Class | Effect |
|-------|--------|
| `.anim-fade-in-up` | Fade in while sliding up |
| `.anim-pulse-dot` | Scale pulsing dot |
| `.shimmer-text` | Moving gradient shine across text |
| `.pet-bubble` | Speech bubble pop-in |
| `.glow-pulse` | Radial glow expansion |

**6. Keyframe Definitions**
20+ `@keyframes` definitions covering:
- **UI**: `fadeInUp`, `pulseDot`, `shimmer`, `bubblePop`, `glowPulse`
- **Pet character**: `lunaBob`, `lunaJump`, `lunaSway`, `lunaDance`, `lunaShake`, `lunaWalkBob`
- **Background orbs**: `orbFloat1`, `orbFloat2`, `orbFloat3`
- **Pet extended**: `petIdle`, `petWalk`, `petWalkL`, `petSleep`, `petCelebrate`, `petZzz`, `petSparkle`, `petFloat`, `petBubble`

---

### Main Application

---

#### `src/App.jsx`

Root component. Owns all application-level state and renders the full page layout.

**State:**

| State | Type | Purpose |
|-------|------|---------|
| `cycles` | `Cycle[]` | All logged menstrual cycle entries |
| `notificationsEnabled` | `boolean` | Whether browser notifications are on |
| `expandedCardDate` | `string \| null` | Which HistoryCard is currently open |
| `notifDaysBefore` | `number` | Days before next period to send notification |
| `isAddModalOpen` | `boolean` | AddDateForm modal visibility |
| `selectedCalendarDate` | `string \| null` | Date pre-filled when opening modal from calendar |
| `showChart` | `boolean` | Toggle StatsChart visibility |
| `showPhase` | `boolean` | Toggle CyclePhaseWheel visibility |
| `showPet` | `boolean` | Toggle Pet mascot visibility |

**Effects:**
1. On mount: load `cycles` and notification settings from localStorage
2. On `cycles` change: persist to localStorage
3. Hourly interval: send browser notification if enabled and due
4. `visibilitychange` event: re-check notifications when tab becomes active

**Key Functions:**

`handleAddCycle(date, duration, trackingData)`
- Inserts new cycle entry (date, duration, flow, mood, symptoms) into state
- Sorts descending by date
- Fires `canvas-confetti` animation
- Dispatches custom event `luna:periodLogged` (consumed by Pet)

`handleUpdateCycle(originalDate, updated)`
- Replaces a specific cycle by original date, re-sorts

`handleDeleteCycle(date)`
- Filters out a cycle by date

`handleToggleNotifications()`
- Calls `Notification.requestPermission()`
- Saves preference to localStorage

`handleExportData()` / `handleImportData(e)`
- Export: serializes `cycles` to JSON and triggers `<a>` download
- Import: reads JSON file, validates entries, merges into state

`spawnConfetti()`
- Fires three confetti bursts (two corner origins + one center) using `canvas-confetti`
- Colors: rose, pink, violet, yellow, teal

**Cycle Phase Calculation** (inline, runs every render):
- Determines current phase from days since last period start
- Uses average duration + 14-day luteal phase + 4-day ovulation window
- Returns one of: `'Menstrual'`, `'Follicular'`, `'Ovulation'`, `'Luteal'`

**Layout:**
```
<BackgroundOrbs />
<Header />
[NotificationPanel]         — if notifications enabled
<NextExpected />
<CycleCalendar />
[CyclePhaseWheel]           — if showPhase
<AddDateForm />             — modal, always in DOM
[StatsChart]                — if showChart
[HistoryCards]              — if cycles.length > 0
[Pet]                       — if showPet
```

---

### Components

---

#### `src/components/Header.jsx`

Top navigation bar. Contains:
- **Left**: CalendarHeart icon + shimmer "Luna" text logo
- **Right button group**:
  - Theme toggle (Moon ↔ Flower2 icon) — calls `onCycleTheme`
  - Notifications toggle (Bell ↔ BellOff icon) — calls `onToggleNotifications`
  - Settings popover (Settings gear icon)

**Settings popover sections:**

*Display toggles* — each button shows ON/OFF badge:
- Chart, Phase Wheel, Pet visibility

*Data management:*
- Backup to JSON (Download icon) — calls `onExportData`
- Restore from JSON (Upload icon) — triggers hidden `<input type="file">` → `onImportData`

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `notificationsEnabled` | `boolean` | Controls Bell/BellOff icon |
| `onToggleNotifications` | `() => void` | Called on bell click |
| `theme` | `'cosmic' \| 'sakura'` | Current active theme |
| `onCycleTheme` | `() => void` | Called to switch theme |
| `onExportData` | `() => void` | Triggers JSON download |
| `onImportData` | `(e) => void` | Handles file input change |
| `showChart` / `onToggleChart` | `boolean / fn` | Chart visibility |
| `showPhase` / `onTogglePhase` | `boolean / fn` | Phase wheel visibility |
| `showPet` / `onTogglePet` | `boolean / fn` | Pet visibility |

---

#### `src/components/NextExpected.jsx`

Card showing the predicted next period date and a status badge.

**Logic:**
1. Calls `getNextExpectedDate(cycles)` from utils
2. Calls `getStatusInfo(nextExpectedDate)` to get label + color class
3. Status labels based on days offset:

| Condition | Label | Color |
|-----------|-------|-------|
| No cycles | "No data yet" | gray |
| Future | "In X day(s)" | blue |
| Today | "Expected today" | amber |
| 1–3 days late | "X day(s) late" | amber |
| 4+ days late | "Might want to check" | red |

**Props:** `cycles: Cycle[]`

---

#### `src/components/CycleCalendar.jsx`

Monthly grid calendar. Highlights period days and upcoming predictions.

**State:** `viewYear`, `viewMonth` — controls which month is displayed.

**Navigation:** prev/next month buttons. Clamped: minimum 2 years ago, maximum current month.

**Day Styling:**

| Type | Visual |
|------|--------|
| Period day (historical) | Rose-red filled circle with shadow |
| Predicted day | Glass background with dashed rose border |
| Today | Luna accent color with `.anim-pulse-dot` |
| Other days | Plain text |

**Interaction:** Clicking any non-future date calls `onDateClick(isoDate)` which opens AddDateForm pre-filled with that date.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `cycles` | `Cycle[]` | Source for period and prediction sets |
| `onDateClick` | `(isoDate: string) => void` | Opens add modal with date |

---

#### `src/components/CyclePhaseWheel.jsx`

SVG donut chart showing the four menstrual cycle phases, with the current phase highlighted.

**Phase Definitions:**

| Phase | Color | Duration |
|-------|-------|---------|
| Menstrual | Rose red | Days 1 → avg duration |
| Follicular | Amber | After menstrual → ovulation start |
| Ovulation | Teal | 4-day window mid-cycle |
| Luteal | Purple | Remainder of cycle |

**SVG Layout (200×200):**
- Circular arcs drawn for each phase proportional to day count
- Inactive phases rendered at 30% opacity
- Center text shows current cycle day number
- Phase name label below center

**Statistics section** (shown if 2+ cycles):
- Average cycle length
- Shortest cycle
- Longest cycle
- Average period duration

**Props:** `cycles: Cycle[]`. Returns `null` if fewer than 1 cycle.

---

#### `src/components/AddDateForm.jsx`

Modal dialog for logging a new cycle entry.

**State:**

| State | Description |
|-------|-------------|
| `date` | Selected start date |
| `selectedDuration` | Number of days (2–8) or null |
| `selectedFlow` | 'Light' / 'Medium' / 'Heavy' / 'Spotting' or null |
| `selectedMood` | 'Happy' / 'Sensitive' / 'Sad' / 'Anxious' / 'Energized' or null |
| `selectedSymptoms` | `string[]` — multi-select from preset list |
| `errorMessage` | Validation error string |
| `warnOverride` | `boolean` — second-tap confirmation for close-date entries |

**Validation Rules:**
1. Date is required and must not be in the future
2. No duplicate date entry
3. Minimum 15-day gap from other entries (warns first; overrides on second save attempt)

**Form Sections:**
- **Start Date**: Popover wrapping a `<Calendar>` component (past dates only)
- **Duration**: Chip buttons 2–8 with hint showing average duration
- **Flow**: Chip buttons (Light / Medium / Heavy / Spotting)
- **Mood**: Emoji pill buttons (😊 Happy, 😢 Sad, 😰 Anxious, ⚡ Energized, 😔 Sensitive)
- **Symptoms**: Multi-select tags (Cramps, Headache, Fatigue, Bloating, Acne, Tender Breasts)
- **Error area**: Red alert box with validation message

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Shows/hides modal |
| `onClose` | `() => void` | Dismiss handler |
| `defaultDate` | `string \| null` | Pre-fill date (from calendar click) |
| `onSave` | `(date, duration, trackingData) => void` | Save callback |
| `averageDuration` | `number` | Shown as hint text in duration section |
| `cycles` | `Cycle[]` | Used for duplicate/proximity validation |

---

#### `src/components/HistoryCard.jsx`

Expandable card for each logged cycle. Supports inline editing, quick duration updates, and delete with confirmation.

**State:**

| State | Type | Description |
|-------|------|-------------|
| `mode` | `'view' \| 'edit'` | Current display mode |
| `deleteArmed` | `boolean` | First tap arms delete; second tap confirms |
| `editValues` | `object` | Draft values for all editable fields |

**Collapsed header shows:**
- Date formatted (e.g., "March 12, 2026")
- Duration badge (e.g., "5 days")
- Days since previous cycle (e.g., "↔ 28 days")
- Chevron toggle icon

**Expanded — View Mode:**
- Duration quick-set buttons (1–10 days)
- "Period ended today" button — calculates duration from start date to today
- Notes display with inline edit toggle
- Tracking pills: flow emoji, mood emoji, symptom tags
- Edit button → switches to Edit Mode
- Delete button (double-tap required)

**Expanded — Edit Mode:**
- Date input (`<input type="date">`)
- Duration number input (1–14)
- Flow, Mood, Symptoms toggles (same UI as AddDateForm)
- Notes `<textarea>`
- Save Changes / Cancel buttons

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `cycle` | `Cycle` | The cycle entry to display |
| `previousCycle` | `Cycle \| undefined` | Used to compute interval |
| `onUpdate` | `(updated: Cycle) => void` | Save edit callback |
| `onDelete` | `() => void` | Delete callback |
| `isExpanded` | `boolean` | Controlled expansion state |
| `onToggle` | `() => void` | Toggle expansion callback |

---

#### `src/components/NotificationPanel.jsx`

Compact settings row for configuring reminder timing.

**Displays:**
- Dropdown (`<Select>`) with options: Day of / 1 day before / 3 days before / 5 days before / 1 week before
- "Next reminder" date calculated as: `nextExpectedDate - notifDaysBefore`
  - If in the future: formatted date shown
  - If passed: "Passed — will show at next cycle"
  - If no data: "No data yet"

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `notifDaysBefore` | `number` | Current setting (0–7) |
| `onChangeDaysBefore` | `(n: number) => void` | Update callback |
| `nextExpectedDate` | `string \| null` | ISO date of predicted next period |

---

#### `src/components/StatsChart.jsx`

Bar chart of cycle length history using Recharts.

**Render condition:** Returns `null` if fewer than 2 cycles.

**Data:** Last 6 cycle intervals computed from consecutive `cycle.date` values. Each bar labeled with abbreviated month name.

**Bar Colors:**

| Condition | Color |
|-----------|-------|
| Within ±5 days of average | Rose (`#f43f5e`) |
| More than +5 days above average | Amber (`#f59e0b`) |
| More than −5 days below average | Blue (`#3b82f6`) |

**Info badges above chart:**
- Average cycle length (days)
- Average period duration (days)

**Chart details:**
- Recharts `BarChart` inside `ResponsiveContainer`
- Custom tooltip showing month + cycle length
- Y-axis: 0 to `dataMax + 5`
- Max bar width: 40px

**Props:** `cycles: Cycle[]`

---

#### `src/components/BackgroundOrbs.jsx`

Three fixed-position blurred color orbs that float behind all content. Pure decoration, no interactivity (`pointer-events: none`).

**Orb Positions:**

| Orb | Position | Size | Blur | Animation |
|-----|----------|------|------|-----------|
| A | Top-left | 60vw max 520px | 80px | `orbFloat1` 22s |
| B | Bottom-right | 50vw max 420px | 70px | `orbFloat2` 28s |
| C | Center-right | 30vw max 260px | 60px | `orbFloat3` 18s |

Colors come from CSS variables `--orb-a`, `--orb-b`, `--orb-c` defined per theme.

---

#### `src/components/Pet.jsx`

Luna — an interactive animated moon mascot that reacts to cycle phase, time of day, and user interaction.

**State (managed via `usePetState`):**
- `happiness`: 0–100 score persisted to localStorage
- `mood`: `'ecstatic'` / `'happy'` / `'tired'` / `'sleepy'` derived from happiness
- `anim`: active animation (`'idle'`, `'happy'`, `'sleep'`, `'dance'`, `'surprised'`, `'walk'`)
- `walkDir`: walk direction (−1 = left, +1 = right)
- `posX`: horizontal screen position (8–80%)
- `bubble`: current speech bubble text
- `tapN`: rapid tap count

**Behaviors:**

| Trigger | Behavior |
|---------|----------|
| Every ~19–30s (idle) | Pet randomly walks to a new position |
| Every 10–24s | Pet shows a phase-appropriate idle message |
| `luna:periodLogged` event | Dance animation + "moon log! 🌙✨" bubble |
| 22:00–06:00 | Forced sleep animation |
| 1 tap | Random greeting or phase message, +4 happiness |
| 5+ rapid taps | Surprised animation |
| 2 days before period | "cycle coming soon 🌙" hint |
| Day of period | "day one! you got this 💗" hint |

**Phase messages:**

| Phase | Example messages |
|-------|-----------------|
| Menstrual | "rest easy 🌙", "cozy mode on 🫂" |
| Follicular | "fresh energy ⚡", "new beginnings 🌱" |
| Ovulation | "you're glowing! ✨", "peak power 💫" |
| Luteal | "chocolate is valid 🍫", "cozy season 🧸" |

**`LunaSVG` inner component:**
Custom hand-drawn SVG crescent moon character with:
- Radial golden gradient body
- Mood-driven eye expressions (dots / curved / wide / closed)
- Curved smile mouth
- Blush circles (happy mood only)
- Positional arms (up = happy, folded = sleep, down = default)
- Feet with toe bumps
- Floating "z" when sleeping
- Golden drop-shadow glow filter

**Layout:** Fixed bottom of screen, overlaid heart happiness bar (0–5 filled hearts).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `currentPhase` | `string` | Current menstrual phase name |
| `cycles` | `Cycle[]` | Used to detect upcoming/current period |

---

### UI Primitives

All UI primitives live in `src/components/ui/` and follow the shadcn/ui pattern — thin wrappers around Radix UI primitives with Luna-themed Tailwind classes.

---

#### `src/components/ui/button.jsx`

Reusable button using `class-variance-authority` (CVA).

**Variants:**

| Variant | Description |
|---------|-------------|
| `default` | Filled with primary color |
| `outline` | Border only, transparent background |
| `secondary` | Muted background |
| `ghost` | No border, hover background only |
| `destructive` | Red/error color |
| `link` | Underline text button |

**Sizes:** `default`, `sm`, `lg`, `icon`, `icon-sm`

**Props:** All standard `<button>` HTML attributes plus `variant` and `size`.

---

#### `src/components/ui/calendar.jsx`

Date picker built on `react-day-picker` v9.

**Features:**
- Single / range selection modes
- Disabled dates (e.g., no future dates)
- Chevron navigation icons
- Month/year dropdowns (if enabled via props)
- Custom `CalendarDayButton` sub-component for accessible day cells

**Key Props:**

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'single' \| 'range'` | Selection mode |
| `selected` | `Date \| DateRange` | Currently selected value |
| `onSelect` | `(date) => void` | Selection callback |
| `disabled` | `(date: Date) => boolean` | Disable individual dates |

---

#### `src/components/ui/dialog.jsx`

Modal dialog built on `@radix-ui/react-dialog`.

**Exported components:**

| Export | Role |
|--------|------|
| `Dialog` | Root state provider |
| `DialogTrigger` | Element that opens the dialog |
| `DialogContent` | Positioned modal container with close button |
| `DialogOverlay` | Blurred backdrop |
| `DialogHeader` | Header layout wrapper |
| `DialogTitle` | Accessible title |
| `DialogDescription` | Accessible description |
| `DialogClose` | Close trigger |
| `DialogPortal` | Portal mount |

**Animations:** fade + zoom in/out on open/close.

---

#### `src/components/ui/popover.jsx`

Floating popover built on `@radix-ui/react-popover`.

**Exported components:** `Popover`, `PopoverTrigger`, `PopoverContent`

**Features:** Portal rendering, fade/zoom animations, configurable alignment and side offset.

---

#### `src/components/ui/select.jsx`

Dropdown select built on `@radix-ui/react-select`.

**Exported components:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`

**Features:**
- Scrollable viewport with up/down scroll buttons
- Keyboard navigation
- Checkmark on selected item
- Glass-styled dropdown panel
- Disabled item support

---

#### `src/components/ui/input.jsx`

Simple styled `<input>` wrapper with Luna theme classes (border, focus ring, background).

---

#### `src/components/ui/label.jsx`

Accessible label built on `@radix-ui/react-label`. Inherits `cursor-pointer` and typography styles.

---

#### `src/components/ui/textarea.jsx`

Styled `<textarea>` wrapper with Luna theme classes, matching the `input` component aesthetic.

---

### Hooks

---

#### `src/hooks/useTheme.js`

Manages the active visual theme.

**State:** `theme` — `'cosmic'` or `'sakura'`, persisted to `localStorage` under key `luna-theme`.

**On mount:** reads saved theme and sets `document.documentElement.dataset.theme`.

**`cycleTheme()`:** toggles between `'cosmic'` and `'sakura'`, updates DOM attribute and persists.

**Returns:** `{ theme, cycleTheme }`

---

#### `src/hooks/usePetState.js`

Manages Luna's happiness score, daily tap quota, and mood.

**Storage key:** `luna-pet-v2`

**Persisted state shape:**
```js
{
  happiness: number,   // 0–100
  lastDate: string,    // ISO date of last save
  tapsToday: number,   // taps used today
  tapDate: string      // ISO date of last tap
}
```

**On load (day decay):** for each missed day since `lastDate`, happiness decreases by 5 (floor: 20). Keeps the pet "fading" if ignored.

**`tap()`:** increments `tapsToday` (max `MAX_TAPS_PER_DAY = 8`), adds +4 happiness (max 100) per tap within quota.

**Mood mapping:**

| Happiness | Mood |
|-----------|------|
| >= 80 | `'ecstatic'` |
| 55–79 | `'happy'` |
| 30–54 | `'tired'` |
| < 30 | `'sleepy'` |

**Event listener:** listens for `luna:periodLogged` → boosts happiness +20.

**Returns:** `{ happiness, mood, tap }`

---

### Utilities

---

#### `src/utils/index.js`

Barrel re-export file. Exports everything from:
- `./dateUtils`
- `./storageUtils`
- `./cycleCalculations`

Import any util via `import { fn } from '@/utils'`.

---

#### `src/utils/dateUtils.js`

Date helper functions.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTodayISO` | `() => string` | Returns today as `YYYY-MM-DD` |
| `isValidDate` | `(s) => boolean` | Validates ISO format + date overflow |
| `isValidCycle` | `(c) => boolean` | Validates cycle object structure |
| `formatDate` | `(s) => string` | `"March 12, 2026"` formatted string |
| `getDaysBetween` | `(d1, d2) => number` | Days between two ISO dates |
| `getDaysUntil` | `(s) => number` | Days from today to date (negative = past) |

---

#### `src/utils/cycleCalculations.js`

Cycle statistics and prediction engine.

**Constants:**
- `DEFAULT_CYCLE_DURATION = 5` days
- `DEFAULT_CYCLE_LENGTH = 28` days

| Function | Signature | Description |
|----------|-----------|-------------|
| `calculateAverageDuration` | `(cycles) => number` | Mean period length (cycles with `duration > 0`) |
| `getCycleIntervals` | `(cycles) => number[]` | Days between consecutive cycle starts |
| `calculateAverageCycleLength` | `(cycles) => number` | Mean of last 3 intervals (most recent preferred) |
| `getShortestCycle` | `(cycles) => number \| null` | Min interval |
| `getLongestCycle` | `(cycles) => number \| null` | Max interval |
| `getNextExpectedDate` | `(cycles) => string \| null` | Predicted next start date (ISO) |
| `getStatusInfo` | `(nextDate) => { label, colorClass }` | Status text + Tailwind class |
| `getCalendarDaySets` | `(cycles) => { periodDays, predictedDays }` | Sets of ISO dates for calendar highlighting |

---

#### `src/utils/storageUtils.js`

`localStorage` read/write helpers. All keys are defined as constants.

**Storage keys:**

| Constant | Key | Content |
|----------|-----|---------|
| `KEY_CYCLES` | `'cycle-data'` | JSON array of Cycle objects |
| `KEY_NOTIF` | `'notifications-enabled'` | Boolean |
| `KEY_LAST_NOTIF` | `'last-notified-date'` | ISO date string |
| `KEY_NOTIF_DAYS` | `'notif-days-before'` | Number (0–7) |

| Function | Description |
|----------|-------------|
| `saveCycles(cycles)` | Stringify and store cycle array |
| `loadCycles()` | Parse, validate, and return cycles (or `[]`) |
| `saveNotificationPreference(v)` | Store boolean |
| `loadNotificationPreference()` | Load boolean (default: `false`) |
| `saveLastNotifiedDate(d)` | Store last notification ISO date |
| `loadLastNotifiedDate()` | Load last notification date (or `null`) |
| `saveNotifDaysBefore(n)` | Store days-before number |
| `loadNotifDaysBefore()` | Load days-before (default: `1`) |

---

#### `src/lib/utils.js`

Single utility function used throughout the component library.

```js
cn(...inputs) => string
```

Combines `clsx` (conditional classes) with `tailwind-merge` (deduplication of conflicting Tailwind utilities). Use wherever dynamic `className` strings are built.

---

### Public Assets

---

#### `public/icons/`

PWA application icons:
- `icon-192.png` — Used for Android home screen shortcut and splash screen
- `icon-512.png` — Used for high-resolution displays and maskable icon support

Referenced in `vite.config.js` PWA manifest and in `index.html` Apple touch icon meta tags.

---

#### `public/sprites/`

Static PNG sprite images for the Luna pet character. Each represents a different animation state:

| File | State |
|------|-------|
| `luna-idle.png` | Default resting state |
| `luna-happy.png` | Happy/excited |
| `luna-dance.png` | Dancing celebration |
| `luna-sleep.png` | Sleeping |
| `luna-surprised.png` | Surprised reaction |
| `luna-walk.png` | Walking |

Note: The primary pet character is rendered as an inline SVG (`LunaSVG` in `Pet.jsx`); these sprites are supplementary assets.

---

## Data Structures

### Cycle Object

All cycle data is stored as an array of plain objects in `localStorage`:

```ts
interface Cycle {
  date: string;          // ISO 8601 date (YYYY-MM-DD) — REQUIRED
  duration?: number;     // Period length in days (1–14) — OPTIONAL
  flow?: string;         // 'Light' | 'Medium' | 'Heavy' | 'Spotting' — OPTIONAL
  mood?: string;         // 'Happy' | 'Sensitive' | 'Sad' | 'Anxious' | 'Energized' — OPTIONAL
  symptoms?: string[];   // e.g. ['Cramps', 'Fatigue'] — OPTIONAL
  notes?: string;        // Free text — OPTIONAL
}
```

Cycles are sorted descending by `date` (most recent first) in state; the array is serialized as-is to localStorage.

---

## Theming

Luna has two visual themes switchable at runtime from the Header:

| Theme | Attribute | Palette |
|-------|-----------|---------|
| **Cosmic** | `data-theme="cosmic"` | Dark indigo backgrounds, rose/pink accents, purple orbs |
| **Sakura** | `data-theme="sakura"` | Soft pink/white backgrounds, rose accents, pink orbs |

Theme is toggled via `cycleTheme()` from `useTheme.js`, which sets `document.documentElement.dataset.theme` and saves to `localStorage` key `luna-theme`.

All color values are CSS variables (`--background`, `--primary`, etc.) defined in `src/index.css`. Tailwind utilities reference these variables via `tailwind.config.js`.

---

## PWA & Offline Support

Luna is a fully installable Progressive Web App:

1. **Manifest** — generated by `vite-plugin-pwa` from `vite.config.js`:
   - Display: `standalone` (no browser chrome)
   - Orientation: `portrait`
   - Icons: 192px + 512px, maskable

2. **Service Worker** — Workbox-generated via `vite-plugin-pwa`:
   - Precaches all static build assets on install
   - Runtime cache (`luna-api-cache`) uses `NetworkFirst` for HTTPS requests
   - Enables offline use after first visit

3. **iOS Support** — `apple-mobile-web-app-capable` meta tag enables Add to Home Screen on Safari

---

## Notifications

Luna uses the browser **Notification API** (no external push service).

**Flow:**
1. User enables notifications in Header → `Notification.requestPermission()` called
2. App checks every hour (and on tab visibility change) whether a notification should fire
3. Notification fires if: notifications are enabled, next expected date is within `notifDaysBefore` days, and no notification has been sent today
4. Last notified date saved to localStorage to prevent duplicate notifications
5. `NotificationPanel` lets users adjust the lead time (day-of / 1 / 3 / 5 / 7 days before)

All logic is client-side — no server, no registration tokens, no external dependencies.
