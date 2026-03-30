# Binkashi Roadmap

**Created:** 2025-03-29
**Granularity:** Standard
**Project:** Single-user offline-first PWA for tracking bokashi compost bins

## Phases

### v1.1 Milestone (Current)

- [ ] **Phase 4: UI Visual Enhancements** - Apply new colour palette, display calculation, and toast notification positioning
- [ ] **Phase 5: Milestone Completion** - Final testing and deployment

### v1.0 Milestone (Complete)

- [x] **Phase 1: PWA Foundation & Core Bin Management** - Offline-capable app with bin CRUD and state transitions (completed 2026-03-29)
- [x] **Phase 2: Image Handling & User Interface** - Camera capture, image display, and responsive mobile-first UI (completed 2026-03-29)
- [x] **Phase 3: Polish & User Experience** - Visual feedback refinements and edge case handling (completed 2026-03-30)

## Phase Details

### Phase 4: UI Visual Enhancements

**Goal**: Users see a refreshed visual design with consistent colours, calculated bin information, and improved notification positioning

**Depends on**: Phase 3 (completed in v1.0)

**Requirements**:
- DES-01: App applies new colour palette to all UI elements (backgrounds, buttons, text, cards, containers)
- DES-02: Colour palette uses Black (#07020d), Sky Surge (#5db7de), Soft Linen (#f1e9db), Khaki Beige (#a39b8b), Dim Grey (#716a5c)
- DISP-01: Bin cards display "Days in Use" field
- DISP-02: Days in Use calculates days from inUseStartDate to current date
- DISP-03: Days in Use displays 0 when bin state is Empty
- UI-01: Toast notifications appear centered at top of screen (not top-right)

**Success Criteria** (what must be TRUE):
1. All UI elements (backgrounds, buttons, text, cards, containers) consistently use the new colour palette
2. Bin cards display "Days in Use" field showing the calculated days from inUseStartDate to current date
3. When bin state is Empty, "Days in Use" displays 0
4. Toast notifications appear centered at top of screen (not top-right)

**Plans**: 2 plans

**Plan list**:
- [ ] 04-01-PLAN.md — Apply new colour palette to all UI elements
- [x] 04-02-PLAN.md — Add Days in Use calculation and center toast notifications

**UI hint**: yes

### Phase 5: Milestone Completion

**Goal**: v1.1 milestone is ready for production deployment with all UI enhancements working correctly

**Depends on**: Phase 4

**Requirements**: (None - validation phase)

**Success Criteria** (what must be TRUE):
1. All v1.1 requirements are working as specified in user acceptance testing
2. App passes cross-browser verification (Chrome, Safari, Edge, Firefox)
3. Performance is not degraded (load times < 2s, smooth interactions)
4. No regressions in existing v1.0 functionality

**Plans**: TBD

**Plan list**: None yet

**UI hint**: yes

---

### Phase 1: PWA Foundation & Core Bin Management (Complete)

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

**Plan list**:
- [x] 01-01-PLAN.md — Foundation setup (Vite, React, TypeScript, PWA, Dexie)
- [x] 01-02-PLAN.md — Bin types, data layer, and list component
- [x] 01-03-PLAN.md — Bin forms, routing, and state transitions

### Phase 2: Image Handling & User Interface (Complete)

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

**Plans**: 3 plans

**Plan list**:
- [x] 02-01-PLAN.md — Image capture & storage (camera, file upload, Blob storage)
- [x] 02-02-PLAN.md — Image display & thumbnails (BinCard thumbnails, ImageModal)
- [x] 02-03-PLAN.md — Responsive UI & visual feedback (touch targets, toast notifications)

**UI hint**: yes

### Phase 3: Polish & User Experience (Complete)

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

**Plans**: 4 plans

**Plan list**:
- [x] 03-01-PLAN.md — Error handling & edge cases
- [x] 03-02-PLAN.md — Performance & cross-browser support
- [x] 03-03-PLAN.md — Visual polish & UX refinements
- [x] 03-04-PLAN.md — End-to-end testing & documentation

**UI hint**: yes

## Progress

### v1.1 Milestone

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. UI Visual Enhancements | 1/2 | In Progress|  |
| 5. Milestone Completion | 0/1 | Not started | - |

### v1.0 Milestone (Complete)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. PWA Foundation & Core Bin Management | 3/3 | Complete | 2026-03-29 |
| 2. Image Handling & User Interface | 3/3 | Complete | 2026-03-29 |
| 3. Polish & User Experience | 4/4 | Complete | 2026-03-30 |

## Coverage

### v1.1 Requirements

**v1.1 Requirements:** 6 total
**Mapped to Phases:** 6 ✓
**Unmapped:** 0 ✓

**Requirement Distribution:**
- Phase 4: 6 requirements (Visual Design, Data Display, UI Components)
- Phase 5: Integration and polish (all requirements validated together)

### v1.0 Requirements (Complete)

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
- Phase 4 applies v1.1 visual enhancements (colour palette, calculations, notifications)
- Phase 5 validates v1.1 milestone and prepares for deployment

**Phase Structure Rationale:**
- v1.1 contains 6 focused UI enhancement requirements that form a coherent delivery
- All requirements are visual and can be implemented independently without dependencies
- Single phase (Phase 4) is appropriate for standard granularity
- Phase 5 provides validation and deployment closure for the milestone

---
*Roadmap created: 2025-03-29*
*Updated: 2026-03-30 for v1.1 milestone*
