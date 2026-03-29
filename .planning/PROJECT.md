# Binkashi

## What This Is

Binkashi is a single-user offline-first Progressive Web App (PWA) for tracking bokashi compost bins. Users can manage multiple bins, track their state (Empty, In Use, Fermenting), store dates, capture photos, and import/export data—all from a mobile device with offline support.

## Core Value

Users can quickly add and update bokashi compost bins on their phone without an internet connection, with automatic state transitions and image capture.

## Requirements

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
- [ ] App is installable on mobile devices (requires PNG icons in vite.config.ts)

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
| PWA over native app | Can be installed on mobile, offline support, no app store approval needed, web tech | Validated — service worker caching assets, manifest generated, requires PNG icons for installability |
| JSON export/import (not backup services) | Simple data portability, user controls their data, no cloud dependencies | Deferred to Phase 3: Polish & User Experience |
| HTML5 File API for image capture | Native browser API, no external libraries needed, works offline | Validated — camera and file upload working, Blob storage in IndexedDB |
| URL.createObjectURL for image display | Efficient Blob-to-URL conversion, no base64 overhead | Validated — thumbnails and modal working with memory leak protection |

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
*Last updated: 2026-03-29 after Phase 2 completion*
