# Binkashi Project State

**Project:** Single-user offline-first PWA for tracking bokashi compost bins
**Created:** 2025-03-29
**Last Updated:** 2025-03-29 (roadmap creation)

## Project Reference

**Core Value:**
Users can quickly add and update bokashi compost bins on their phone without an internet connection, with automatic state transitions and image capture.

**Current Focus:**
Phase 1: PWA Foundation & Core Bin Management - Establish offline infrastructure and core bin CRUD functionality

**Tech Stack:**
- React 19.2.4 + Vite 8.0.3 + TypeScript 6.0.2
- Dexie.js 4.4.1 + dexie-react-hooks 4.4.0
- vite-plugin-pwa 1.2.0 + workbox-window 7.4.0
- Tailwind CSS 4.2.2

## Current Position

**Phase:** 1 of 3 (PWA Foundation & Core Bin Management)
**Plan:** TBD (waiting for phase planning)
**Status:** Not started
**Progress Bar:** ▱▱▱ (0/3 phases complete)

**Current Phase Goal:**
Users can create, view, and manage bins offline with data persisting across sessions

**Current Phase Requirements:**
- PERS-01: Bin data persists across app restarts and browser sessions
- PERS-02: App loads and functions without internet connection after initial visit
- PERS-03: App can be installed on mobile device via PWA install prompt
- PERS-04: App caches static assets for offline use
- BIN-01: User can create a bin with name, state, inUseStartDate, fermentingStartDate, and image
- BIN-02: User can view all bins in a list displaying name, state, dates, and image thumbnail
- BIN-03: User can sort bins by name, state, inUseStartDate, or fermentingStartDate
- STATE-01: User can set bin state to Empty, In Use, or Fermenting
- STATE-02: User can set inUseStartDate when creating or editing a bin
- STATE-03: User can set fermentingStartDate when creating or editing a bin
- STATE-04: User can clear inUseStartDate and fermentingStartDate when setting state to Empty

**Next Milestone:**
Complete Phase 1 (PWA Foundation & Core Bin Management)
Success: User can create, view, and manage bins offline with all state transitions working

## Performance Metrics

**Phase Progress:**
- Phase 1: 0/0 plans complete (0%)
- Phase 2: 0/0 plans complete (0%)
- Phase 3: 0/0 plans complete (0%)

**Requirements Progress:**
- v1 Requirements: 0/17 complete (0%)
  - Bin Management: 0/3
  - State Management: 0/4
  - Image Handling: 0/3
  - Persistence & Offline: 0/4
  - User Interface: 0/3

**Overall Progress:** 0% complete

## Accumulated Context

### Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dexie.js for IndexedDB | Simplifies IndexedDB with Promise-based API, better developer experience than raw IndexedDB | Pending validation in Phase 1 |
| Vite over Create React App | Faster build, better DX, built-in PWA plugin support, modern tooling | Pending validation in Phase 1 |
| PWA over native app | Can be installed on mobile, offline support, no app store approval needed, web tech | Pending validation in Phase 1 |
| JSON export/import (not backup services) | Simple data portability, user controls their data, no cloud dependencies | Deferred to v2 (not in v1 scope) |

### Design Decisions (To Be Recorded)

Record design and implementation decisions as they emerge during phase execution.

### Todos

- [ ] Plan Phase 1 (PWA Foundation & Core Bin Management)
- [ ] Execute Phase 1 plans
- [ ] Validate Phase 1 success criteria
- [ ] Plan Phase 2 (Image Handling & User Interface)
- [ ] Execute Phase 2 plans
- [ ] Validate Phase 2 success criteria
- [ ] Plan Phase 3 (Polish & User Experience)
- [ ] Execute Phase 3 plans
- [ ] Validate Phase 3 success criteria
- [ ] Complete v1 milestone

### Blockers

None currently identified.

### Known Risks

From research findings (from research/SUMMARY.md):

**Critical Pitfalls to Address:**
1. **Cache Inversion** (stale HTML with fresh JS) - Must use versioned caches in Phase 1
2. **QuotaExceededError** (silent data loss) - Must implement quota checking and error handling in Phase 1
3. **Service Worker Update Deadlock** (users stuck on old versions) - Must use skipWaiting() and update banners in Phase 1
4. **IndexedDB Transaction Timeout** (race conditions) - Must use Dexie's transaction API correctly in Phase 1
5. **Image Blob Memory Leaks** (growing memory) - Must implement URL.revokeObjectURL cleanup in Phase 2
6. **Safari 7-Day Cache Eviction** (disappearing data) - Must request persistent storage in Phase 1
7. **Offline Data Inconsistency** (merge conflicts) - Must implement timestamps on records in Phase 2

**Research Flags:**
- Phase 1 (Service Worker): PWA-specific caching strategies have browser-specific behaviors
- Phase 2 (Image Capture): Complex integration with IndexedDB Blob storage, needs compression strategy

## Session Continuity

**Last Action:** Roadmap created with 3 phases covering 17 v1 requirements

**Next Actions:**
1. Review ROADMAP.md with user for approval
2. Run `/gsd-plan-phase 1` to create execution plans for Phase 1

**Context Handoff:**
All requirements mapped to phases. Roadmap structure complete. Ready for phase planning.

---
*State initialized: 2025-03-29*
