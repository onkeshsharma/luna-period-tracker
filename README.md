# Luna — Period Tracking PWA

A discreet period tracking app that presents itself as a generic "Luna" app. All data is stored locally in `localStorage` — nothing leaves your device.

## File Structure

```
PeriodTrackingApp/
├── index.html              # Entry point — loads all dependencies + registers SW
├── manifest.json           # PWA manifest (name: "Luna")
├── service-worker.js       # Offline caching (cache-first strategy)
├── icons/
│   ├── icon-192.png        # App icon (192×192)
│   └── icon-512.png        # App icon (512×512)
```

## Running Locally

You **must** serve the files over HTTP (not `file://`) for the service worker and PWA features to work.

**Option 1 — npx serve (recommended):**
```bash
npx serve .
```
Then open http://localhost:3000

**Option 2 — Python:**
```bash
python -m http.server 8080
```
Then open http://localhost:8080

**Option 3 — VS Code Live Server** — right-click `index.html` → "Open with Live Server"

## Deploying

Drop the entire folder into any static host:

- **Vercel** — `vercel .` or drag-and-drop at vercel.com
- **Netlify** — drag-and-drop the folder at app.netlify.com
- **GitHub Pages** — push to a repo, enable Pages from the root of `main`

No build step required — all dependencies load from CDN.

## Installing as an App

### iOS (Safari)
1. Open the app URL in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. The app will appear as "Luna" on your home screen

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap the **three-dot menu** (⋮)
3. Tap **Install App** or **Add to Home Screen**
4. The app will appear as "Luna" on your home screen

## Features

- Track cycle start dates
- Automatically calculates average cycle length from the last 3 cycles
- Shows next expected date with color-coded status (on-track / late / very late)
- Cycle stats card: average, shortest, and longest cycle length + average period duration
- Edit any past entry (date, duration, notes)
- Two-tap delete confirmation
- Optional discreet daily reminders with configurable lead time (uses generic messages — no medical terminology)
- Fully offline after first load
- All data stays on your device (localStorage only)
