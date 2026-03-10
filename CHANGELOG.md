# Changelog

All notable changes to Luna are documented here.

## [Unreleased]

## [0.2.0] - 2026-03-10

### Added
- **Cycle stats card** — shows average, shortest, and longest cycle length plus average period duration; only appears once 2+ cycles are recorded
- `getShortestCycle()` and `getLongestCycle()` calculation helpers
- Configurable notification lead time — choose to be reminded on the day, or 1, 3, 5, or 7 days before
- Edit existing cycle entries (date, duration, notes) via expandable history cards
- Two-tap delete confirmation to prevent accidental data loss

### Changed
- History list is now collapsible — each entry expands on tap to reveal details and actions
- Notification reminder panel only shown when reminders are enabled

## [0.1.0] - 2026-03-10

### Added
- Initial release
- Track cycle start dates with optional duration (days) and free-text notes
- Next expected date prediction based on rolling 3-cycle average
- Color-coded status badge (on-track / expected today / late / overdue)
- Optional daily push notifications via the Web Notifications API
- PWA manifest and service worker for offline support and home screen installation
- All data stored in `localStorage` — nothing leaves the device
