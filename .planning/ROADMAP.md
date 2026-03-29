# Binkashi Roadmap

**Created:** 2025-03-29
**Granularity:** Standard
**Project:** Single-user offline-first PWA for tracking bokashi compost bins

## Phases

- [ ] **Phase 1: PWA Foundation & Core Bin Management** - Offline-capable app with bin CRUD and state transitions
- [ ] **Phase 2: Image Handling & User Interface** - Camera capture, image display, and responsive mobile-first UI
- [ ] **Phase 3: Polish & User Experience** - Visual feedback refinements and edge case handling

## Phase Details

### Phase 1: PWA Foundation & Core Bin Management

**Goal**: Users can create, view, and manage bins offline with data persisting across sessions

**Depends on**: Nothing (first phase)

**Requirements**:
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

**Success Criteria** (what must be TRUE):
1. User can open the app without internet and see a working bin list after first visit
2. User can create a bin with all required fields and see it appear in the list
3. User can change a bin's state and dates, and the changes persist after app restart
4. User can install the app on their mobile device and launch it from home screen
5. User can sort bins by any field (name, state, date) and see the list reorder immediately

**Plans**: 3 plans

Plan list:
- [x] 01-01-PLAN.md — Foundation setup (Vite, React, TypeScript, PWA, Dexie)
- [ ] 01-02-PLAN.md — Bin types, data layer, and list component
- [ ] 01-03-PLAN.md — Bin forms, routing, and state transitions

### Phase 2: Image Handling & User Interface

**Goal**: Users can capture and view bin images with a responsive mobile-first interface

**Depends on**: Phase 1

**Requirements**:
- IMG-01: User can capture bin image via device camera
- IMG-02: User can upload bin image from file picker
- IMG-03: User can view full-size bin image when viewing bin details
- UI-01: App displays responsively on mobile, tablet, and desktop screens
- UI-02: App uses mobile-first design optimized for field use
- UI-03: App provides clear visual feedback for all user actions

**Success Criteria** (what must be TRUE):
1. User can capture a bin photo using their phone's camera or upload from gallery
2. User can see image thumbnails in the bin list that load reliably offline
3. User can tap a thumbnail to view the full-size image and close it to return
4. User can use the app comfortably on phone, tablet, or desktop with readable text and touch-friendly controls
5. User sees clear feedback (loading states, success messages, error alerts) for all interactions

**Plans**: TBD
**UI hint**: yes

### Phase 3: Polish & User Experience

**Goal**: Users experience a refined app with edge cases handled and smooth interactions

**Depends on**: Phase 2

**Requirements**:
- All v1 requirements are complete and working together seamlessly
- (No additional requirements - this is integration and polish)

**Success Criteria** (what must be TRUE):
1. App handles all error states gracefully (offline errors, storage quota exceeded, camera permission denied)
2. App performs smoothly even with dozens of bins and large images
3. User can complete end-to-end workflows (create bin, add image, change state, sort) without confusion or errors
4. App works reliably across different browsers (Chrome, Safari, Edge) on mobile and desktop
5. User interface feels polished with consistent spacing, typography, and visual hierarchy

**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. PWA Foundation & Core Bin Management | 0/3 | Planned | - |
| 2. Image Handling & User Interface | 0/0 | Not started | - |
| 3. Polish & User Experience | 0/0 | Not started | - |

## Coverage

**v1 Requirements:** 17 total
**Mapped to Phases:** 17 ✓
**Unmapped:** 0 ✓

**Requirement Distribution:**
- Phase 1: 11 requirements (Persistence, Offline, Bin Management, State Management)
- Phase 2: 6 requirements (Image Handling, User Interface)
- Phase 3: Integration and polish (all requirements validated together)

**Dependencies:**
- Phase 1 builds foundation (PWA infrastructure, database, core CRUD)
- Phase 2 adds visual capabilities (images, responsive UI)
- Phase 3 validates and polishes the complete experience

---
*Roadmap created: 2025-03-29*
