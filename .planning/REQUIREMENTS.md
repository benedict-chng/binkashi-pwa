# Requirements: Binkashi

**Defined:** 2025-03-29
**Core Value:** Users can quickly add and update bokashi compost bins on their phone without an internet connection, with automatic state transitions and image capture.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Bin Management

- [x] **BIN-01**: User can create a bin with name, state, inUseStartDate, fermentingStartDate, and image
- [x] **BIN-02**: User can view all bins in a list displaying name, state, dates, and image thumbnail
- [x] **BIN-03**: User can sort bins by name, state, inUseStartDate, or fermentingStartDate

### State Management

- [x] **STATE-01**: User can set bin state to Empty, In Use, or Fermenting
- [x] **STATE-02**: User can set inUseStartDate when creating or editing a bin
- [x] **STATE-03**: User can set fermentingStartDate when creating or editing a bin
- [x] **STATE-04**: User can clear inUseStartDate and fermentingStartDate when setting state to Empty

### Image Handling

- [x] **IMG-01**: User can capture bin image via device camera
- [x] **IMG-02**: User can upload bin image from file picker
- [x] **IMG-03**: User can view full-size bin image when viewing bin details

### Persistence & Offline

- [x] **PERS-01**: Bin data persists across app restarts and browser sessions
- [x] **PERS-02**: App loads and functions without internet connection after initial visit
- [x] **PERS-03**: App can be installed on mobile device via PWA install prompt
- [x] **PERS-04**: App caches static assets for offline use

### User Interface

- [x] **UI-01**: App displays responsively on mobile, tablet, and desktop screens
- [x] **UI-02**: App uses mobile-first design optimized for field use
- [x] **UI-03**: App provides clear visual feedback for all user actions

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Bin Management

- **BIN-04**: User can edit existing bins
- **BIN-05**: User can delete bins with confirmation dialog

### State Management

- **STATE-05**: App enforces valid state transitions (Empty → In Use → Fermenting → Empty)
- **STATE-06**: App displays color-coded states for visual clarity

### Data Management

- **DATA-01**: User can export all bin data to JSON file
- **DATA-02**: User can import bin data from JSON file
- **DATA-03**: User can search bins by name
- **DATA-04**: User can filter bins by state

### Visual Enhancements

- **VISL-02**: App displays image thumbnails in bin list

### User Interface

- **UI-04**: App provides toast notifications for success/error feedback

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-user support | Single-user app scope |
| Real-time sync across devices | Offline-first architecture |
| Social sharing | Personal use only |
| Cloud backup services | User controls data via export/import |
| Barcode/QR scanning | Adds complexity for limited benefit |
| Voice input | Speech recognition unreliable offline |
| Push notifications | Overkill for simple tracking app |
| Advanced analytics | Not core to bin tracking |
| Custom themes | Single clean theme sufficient |
| Rich text formatting | Plain text sufficient for notes |
| Timeline/history view | Defer to v2+, not core value |
| Bulk actions | Defer to v2+, for power users |
| Visual state transition diagram | Defer to v2+, UX enhancement |
| Progress indicators | Defer to v2+, gamification |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PERS-01 | Phase 1 | Complete |
| PERS-02 | Phase 1 | Complete |
| PERS-03 | Phase 1 | Complete |
| PERS-04 | Phase 1 | Complete |
| BIN-01 | Phase 1 | Complete |
| BIN-02 | Phase 1 | Complete |
| BIN-03 | Phase 1 | Complete |
| STATE-01 | Phase 1 | Complete |
| STATE-02 | Phase 1 | Complete |
| STATE-03 | Phase 1 | Complete |
| STATE-04 | Phase 1 | Complete |
| IMG-01 | Phase 2 | Complete |
| IMG-02 | Phase 2 | Complete |
| IMG-03 | Phase 2 | Complete |
| UI-01 | Phase 2 | Complete |
| UI-02 | Phase 2 | Complete |
| UI-03 | Phase 2 | Complete |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

**Phase Distribution:**
- Phase 1 (PWA Foundation & Core Bin Management): 11 requirements
- Phase 2 (Image Handling & User Interface): 6 requirements
- Phase 3 (Polish & User Experience): Integration and polish

---
*Requirements defined: 2025-03-29*
*Last updated: 2025-03-29 after roadmap creation*
