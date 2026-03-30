# Binkashi

## What This Is

Binkashi is a single-user offline-first Progressive Web App (PWA) for tracking bokashi compost bins. Users can manage multiple bins, track their state (Empty, In Use, Fermenting), store dates, capture photos, and import/export data—all from a mobile device with offline support.

## Core Value

Users can quickly add and update bokashi compost bins on their phone without an internet connection, with automatic state transitions and image capture.

## Current Milestone: v1.1 UI Enhancements

**Goal:** Improve the app's visual identity and user experience with a new colour palette, display calculation, and better notification positioning.

**Target features:**
- Apply new colour palette (Black, Sky Surge, Soft Linen, Khaki Beige, Dim Grey) to all UI elements
- Display "Days in Use" field showing days from inUseStartDate to current date (0 when Empty)
- Center toast notifications at top of screen (currently top-right)

---

## Requirements

### Active (v1.1)

### Validated

- [x] User can create bins with name, state, dates, and image — Validated in Phase 2: Image Handling & User Interface
- [x] User can view all bins in a list with thumbnails — Validated in Phase 2: Image Handling & User Interface
- [x] User can edit existing bins — Validated in Phase 1: PWA Foundation & Core Bin Management
- [x] User can transition bins through valid states (Empty → In Use → Fermenting → Empty) — Validated in Phase 1: PWA Foundation & Core Bin Management
- [x] User can capture bin images via camera or file picker — Validated in Phase 2: Image Handling & User Interface
- [x] App works offline (PWA with service worker) — Validated in Phase 1: PWA Foundation & Core Bin Management
- [ ] User can export all bin data to JSON
- [ ] User can import bin data from JSON
- [x] Data persists across sessions (IndexedDB via Dexie.js) — Validated in Phase 1: PWA Foundation & Core Bin Management
- [x] App is installable on mobile devices (PWA manifest generated) — Validated in Phase 3: Polish & User Experience
- [x] App handles all error states gracefully (storage, camera, offline, IndexedDB) — Validated in Phase 3: Polish & User Experience
- [x] App performs smoothly with compressed images (<500KB), lazy loading, fast load times — Validated in Phase 3: Polish & User Experience
- [x] User can complete end-to-end workflows without confusion (create, edit, state, sort, image, delete, offline) — Validated in Phase 3: Polish & User Experience
- [x] App works reliably across all major browsers (Chrome, Safari, Edge, Firefox) — Validated in Phase 3: Polish & User Experience
- [x] User interface feels polished with consistent design, smooth transitions, clear feedback — Validated in Phase 3: Polish & User Experience

### Out of Scope

- Multi-user support — Single-user app
- Backend/cloud sync — Offline-first design
- Social features/sharing — Personal use only
- Advanced analytics — Simple tracking only
- Real-time notifications — Not needed for this use case

## Context

Bokashi composting involves managing multiple bins at different stages. The current method (paper, memory, or ad-hoc digital notes) leads to lost information, forgotten dates, and poor organization. This app solves the organization problem by providing a simple, mobile-first interface to track bins with images and enforce valid state transitions. The user needs to quickly add/update bins on their phone, often offline (in the garden/shed), so PWA support and local storage are critical.

## Constraints

- **Tech Stack**: React + Vite + Dexie.js — Standard, well-supported stack with good PWA tooling
- **Deployment**: Cloudflare Pages — Static site hosting, easy deployment
- **No Backend**: Fully client-side — All data stored in IndexedDB
- **Offline**: Must work without internet — PWA requirements (service worker, manifest)
- **Mobile-First**: Designed for phone use — Responsive UI, camera capture support
- **Image Storage**: IndexedDB Blobs — Must store images locally, not external URLs

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dexie.js for IndexedDB | Simplifies IndexedDB with Promise-based API, better developer experience than raw IndexedDB | Validated — database schema created with bins table, Blob storage working |
| Vite over Create React App | Faster build, better DX, built-in PWA plugin support, modern tooling | Validated — dev server, build pipeline, HMR working, 419ms build time |
| PWA over native app | Can be installed on mobile, offline support, no app store approval needed, web tech | Validated — service worker caching assets, manifest generated, PWA installable on mobile |
| JSON export/import (not backup services) | Simple data portability, user controls their data, no cloud dependencies | Deferred to future phase — not in v1 scope |
| HTML5 File API for image capture | Native browser API, no external libraries needed, works offline | Validated — camera and file upload working, Blob storage in IndexedDB |
| URL.createObjectURL for image display | Efficient Blob-to-URL conversion, no base64 overhead | Validated — thumbnails and modal working with memory leak protection |
| HTML5 Canvas API for image compression | Native browser API, no external libraries needed, reduces storage to ~500KB/bin | Validated — 85% compression ratio, smooth performance, faster uploads |
| Native lazy loading (loading="lazy") | Browser-native feature, minimal code, progressive enhancement for Safari < 15.4 | Validated — fast initial page load, IntersectionObserver fallback works |
| Error handling utilities (handleStorageError, handleCameraError, etc.) | Centralized error handling, user-friendly messages, graceful degradation | Validated — all edge cases handled, app never crashes on errors |
| Toast notification system | Simple, non-blocking feedback, works with React Context | Validated — all interactions show clear feedback, excellent UX |
| Reusable EmptyState and LoadingState components | Consistent UX across app, guides users to actions, clear feedback | Validated — professional polish, helpful empty states, loading indicators |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 starting v1.1 milestone*
