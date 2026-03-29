# Project Research Summary

**Project:** Binkashi - React PWA Offline-First App
**Domain:** React PWA with IndexedDB storage
**Researched:** 2025-03-29
**Confidence:** HIGH

## Executive Summary

Binkashi is a single-user offline-first Progressive Web App (PWA) for tracking bokashi composting bins through state transitions (Empty → In Use → Fermenting → Empty). Experts build this type of app with React's modern UI framework, Vite's fast build tool, and Dexie.js for simplified IndexedDB database operations. The recommended stack prioritizes performance, offline capabilities, and mobile-first design, with the app shell precached via service workers and all data stored locally in the browser.

The recommended approach is a three-tier architecture: React components using `useLiveQuery()` hooks for reactive UI updates, Dexie.js for persistent IndexedDB storage with blob support for images, and a service worker implementing stale-while-revalidate caching strategies. This architecture eliminates the need for a backend while providing true offline functionality and instant perceived performance. Critical implementation details include versioned cache management, storage quota monitoring, and proper blob URL cleanup to prevent memory leaks.

Key risks center on browser-specific behaviors and storage limitations. Safari's aggressive 7-day cache eviction policy can silently delete user data for non-installed PWAs, while IndexedDB quota limits (60% of disk space) require careful image compression and quota error handling. Service worker update deadlocks can leave users stuck on old versions if tabs remain open indefinitely. Mitigation strategies include requesting persistent storage immediately, implementing cache versioning with atomic deletion, showing user prompts for updates, and compressing images before storage.

## Key Findings

### Recommended Stack

Modern React ecosystem with specialized PWA tools for offline-first single-user applications. All dependencies are actively maintained with excellent TypeScript support.

**Core technologies:**
- React 19.2.4 + Vite 8.0.3 + TypeScript 6.0.2 — Industry-standard foundation with concurrent rendering, lightning-fast HMR, and compile-time type safety
- Dexie.js 4.4.1 + dexie-react-hooks 4.4.0 — Promise-based IndexedDB wrapper with reactive `useLiveQuery()` hook for automatic UI updates
- vite-plugin-pwa 1.2.0 + workbox-window 7.4.0 — Zero-config service worker generation with precaching and runtime caching strategies
- Tailwind CSS 4.2.2 — Utility-first styling perfect for mobile-first PWAs with responsive utilities built-in

### Expected Features

Single-user bin tracking with offline-first architecture. MVP focuses on core CRUD operations with state machine enforcement.

**Must have (table stakes):**
- Create/View/Edit/Delete bins — users expect full CRUD functionality
- State transitions (Empty → In Use → Fermenting) — core workflow for bokashi composting
- Data persistence via IndexedDB — data must survive app restart
- Responsive design — mobile-first critical for field use
- Basic sorting (by name, date, state) — basic organization

**Should have (competitive):**
- Image capture and thumbnails — visual documentation differentiates from spreadsheets
- Search and filter — finding bins in large datasets
- Data export/import (JSON) — backup and migration capabilities
- Color-coded states — visual clarity at a glance
- Enforced state machine — prevents invalid transitions

**Defer (v2+):**
- Timeline/history view — nice-to-have after core value proven
- Bulk actions — once power users emerge
- Reminders/due dates — if users request time-based management
- Visual state transition diagram — UX enhancement after validation

### Architecture Approach

Layered architecture with reactive data flow. Singleton Dexie instance provides database abstraction, React components use `useLiveQuery()` hooks for automatic reactivity, and service worker handles offline caching. State machine validates transitions before database writes. Components are organized by feature (bin-related vs shared) with hooks encapsulating data fetching logic.

**Major components:**
1. **bin-db.ts (Dexie singleton)** — Database schema definition with version migrations, exports single DB instance
2. **BinList/BinForm/BinView components** — UI components consuming `useLiveQuery()` hooks for reactive data display and mutations
3. **Service Worker (vite-plugin-pwa)** — App shell precaching, stale-while-revalidate strategy, offline fallbacks
4. **state-machine.ts utility** — Valid transition definitions and validation logic
5. **ImageUploader component** — Camera/file picker with blob storage in IndexedDB

### Critical Pitfalls

Seven critical pitfalls identified, with the top three posing highest risk to data integrity and user experience.

1. **Cache Inversion (stale HTML with fresh JS)** — Use versioned caches (v1, v2), delete old caches atomically in activate event, include build hash in asset URLs
2. **QuotaExceededError (silent data loss)** — Always catch write errors, check available space with `navigator.storage.estimate()`, compress images before storage, show clear error messages
3. **Service Worker Update Deadlock (users stuck on old versions)** — Use `skipWaiting()` for critical updates, show "Refresh to update" banner, test update paths across multiple tabs
4. **IndexedDB Transaction Timeout (race conditions)** — Never mix multiple async operations without proper chaining, use Dexie's transaction API correctly, show loading states until commit
5. **Image Blob Memory Leaks (growing memory)** — Always revoke object URLs with `useEffect` cleanup, limit concurrent blob URLs, monitor memory with DevTools profiler
6. **Safari 7-Day Cache Eviction (disappearing data)** — Request persistent storage with `navigator.storage.persist()`, encourage PWA installation, document the limitation
7. **Offline Data Inconsistency (merge conflicts)** — Implement timestamps on records, warn before destructive overwrites, version control with incrementing numbers

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: PWA Foundation & Core CRUD
**Rationale:** Must establish service worker, IndexedDB, and basic CRUD before adding complex features. Critical pitfalls (cache inversion, Safari eviction, quota errors) must be addressed in this phase to prevent data loss from day one.
**Delivers:** Offline-capable app with bin creation, viewing, editing, deletion, and state transitions
**Addresses:** Create bins, View bins, Edit bins, Delete bins, State transitions, Data persistence, Basic sorting, Responsive design
**Avoids:** Cache inversion (versioned caches), Safari 7-day eviction (persistent storage request), QuotaExceededError (quota checking)

### Phase 2: Enhanced Features & Data Portability
**Rationale:** Once core is stable, add features that enhance user experience. Image capture and thumbnails differentiate from competitors. Search/filter becomes necessary as users accumulate bins. Export/import provides data backup.
**Delivers:** Image capture with thumbnails, search/filter functionality, JSON export/import, color-coded states, enforced state machine
**Uses:** Camera API (File input), Dexie Blob storage, Dexie's query APIs for search
**Implements:** ImageUploader component, BinThumbnail component, useImportExport hook, state-machine validation
**Avoids:** Blob memory leaks (URL.revokeObjectURL cleanup), Offline data inconsistency (conflict detection on import)

### Phase 3: Advanced UX & Power User Features
**Rationale:** After validating core value, add features for power users. Timeline view provides historical context. Bulk actions improve efficiency. Quick actions reduce taps. These are nice-to-haves that can increase engagement.
**Delivers:** Timeline/history view, bulk actions (select multiple), quick actions from list (swipe/long-press), progress indicators
**Uses:** Dexie's transaction APIs for bulk operations, React gesture libraries for swipe actions

### Phase 4: Optimization & Polish
**Rationale:** Based on usage patterns and performance data, optimize the app. Address any technical debt, improve performance for large datasets, add requested features like reminders or templates.
**Delivers:** Performance optimizations (lazy loading, virtual scrolling), reminders/due dates (if requested), templates/presets (if requested)
**Uses:** Canvas API for image optimization, virtual scrolling libraries for large lists

### Phase Ordering Rationale

- **Phase 1 first** because PWA foundation (service worker, IndexedDB) is required for all subsequent features. Critical pitfalls must be addressed early to prevent data loss.
- **Phase 2 after core** because image capture and search depend on stable database schema and CRUD operations. Export/import provides backup strategy before users accumulate data.
- **Phase 3 later** because power user features (timeline, bulk actions) are not needed for initial validation and add complexity.
- **Phase 4 last** because optimization and polish depend on real usage data. Reminders and templates are speculative until validated.

**Grouping rationale:**
- Phase 1 groups infrastructure (PWA setup, database schema) with core CRUD functionality
- Phase 2 groups user experience enhancements (images, search) with data portability (export/import)
- Phase 3 groups efficiency features (bulk actions, quick actions) with analytics (timeline)
- Phase 4 groups optimizations and speculative features

**Pitfall avoidance:**
- Phase 1 addresses 5 of 7 critical pitfalls (cache inversion, Safari eviction, quota errors, transaction timeout, service worker deadlock)
- Phase 2 addresses 2 critical pitfalls (blob memory leaks, data inconsistency)
- Phase 3 and 4 focus on UX refinements with lower-risk patterns

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Image Capture):** Complex integration with IndexedDB Blob storage, requires compression strategy research, needs mobile camera permission handling validation
- **Phase 1 (Service Worker):** PWA-specific caching strategies have browser-specific behaviors, needs testing across Chrome/Safari/Edge deployment targets

Phases with standard patterns (skip research-phase):
- **Phase 1 (Core CRUD):** Dexie.js and React patterns are well-documented with established examples
- **Phase 3 (Timeline View):** Standard UI component pattern with clear implementation path using Dexie's collection API

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified with official documentation and active maintenance |
| Features | MEDIUM | Domain knowledge derived from PROJECT.md and industry patterns, needs user research validation |
| Architecture | HIGH | Patterns from Dexie.js official tutorial and web.dev PWA architecture guidance |
| Pitfalls | HIGH | All pitfalls documented with official sources (MDN, web.dev), prevention strategies tested in community |

**Overall confidence:** HIGH

### Gaps to Address

- **Feature validation with real users:** Research derived from PROJECT.md and industry patterns for tracking apps. Needs validation that bokashi composters prioritize images over manual entry, whether timeline view adds value, and if reminders are needed for fermentation cycles.
- **Mobile camera compression strategy:** Multiple libraries available (browser-image-compression, Compressor.js). Need to choose based on bundle size impact, compression quality, and TypeScript support.
- **Safari persistent storage approval rates:** `navigator.storage.persist()` may be auto-approved based on engagement, but actual approval rates unknown. May need fallback strategy (encourage PWA installation, show periodic "data at risk" warnings).
- **Deployment platform specifics:** Cloudflare Pages hosting assumed, but cache headers and service worker registration may need platform-specific configuration. Test deployment workflow before production.

## Sources

### Primary (HIGH confidence)
- web.dev PWA Architecture — https://web.dev/learn/pwa/architecture/ — SPA vs MPA patterns, service worker lifecycles, cache strategies
- web.dev Service Workers — https://web.dev/learn/pwa/service-workers/ — Registration, capabilities, offline strategies
- web.dev Offline Data — https://web.dev/learn/pwa/offline-data/ — IndexedDB usage, storage management, persistence
- web.dev Storage quotas — https://web.dev/storage-for-the-web/ — Browser-specific limits, eviction policies, quota estimation
- Dexie.js Official Docs — https://dexie.org/ — Live queries, React hooks, Blob storage, transaction API
- Dexie React Tutorial — https://dexie.org/docs/Tutorial/React — useLiveQuery patterns, component examples
- Vite PWA Plugin — https://vite-pwa-org.netlify.app/ — Zero-config PWA generation, Workbox integration, update handling
- React 19 Docs — https://react.dev — Concurrent rendering, hooks, component patterns
- Vite Build Docs — https://vitejs.dev/guide/build.html — Build optimization, asset handling, code splitting
- Tailwind CSS 4 Docs — https://tailwindcss.com — Utility-first patterns, responsive utilities, mobile-first design
- MDN IndexedDB — https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API — IndexedDB API, transaction lifecycle, Blob storage
- npm registry — Verified all package versions (React 19.2.4, Vite 8.0.3, Dexie 4.4.1, etc.) via npm view commands

### Secondary (MEDIUM confidence)
- Shopify Inventory Management Guide — https://www.shopify.com/blog/inventory-management — Industry knowledge of tracking app patterns, feature expectations
- Testing Library Docs — https://testing-library.com/react — User-centric testing patterns for PWAs
- Vitest Docs — https://vitest.dev — Vite-native test runner configuration
- react-hook-form Docs — https://react-hook-form.com — Form validation patterns for mobile apps

### Tertiary (LOW confidence)
- PROJECT.md requirements — High confidence for domain, but feature priorities inferred from project description rather than user research
- Industry knowledge of tracking app patterns — General patterns identified but bokashi-specific use case may have unique needs
- Competitor analysis — Based on typical inventory/note apps, actual bokashi composting tools not researched

---
*Research completed: 2025-03-29*
*Ready for roadmap: yes*
