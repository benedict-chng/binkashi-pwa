# Phase 2: Image Handling & User Interface - Planning Notes

## Phase Context

**Goal**: Users can capture and view bin images with a responsive mobile-first interface

**Dependencies**: Phase 1 (PWA Foundation, Dexie database, basic bin CRUD)

**Requirements**:
- IMG-01: User can capture bin image via device camera
- IMG-02: User can upload bin image from file picker
- IMG-03: User can view full-size bin image when viewing bin details
- UI-01: App displays responsively on mobile, tablet, and desktop screens
- UI-02: App uses mobile-first design optimized for field use
- UI-03: App provides clear visual feedback for all user actions

## Technical Context from Phase 1

### Existing Foundation
- Dexie.js database with Bin schema (ready to add image field)
- BinForm component (ready to add image capture UI)
- BinCard component (ready to add image thumbnail display)
- Tailwind CSS 4.2 configured (ready for responsive improvements)
- React Router v7 with routes set up

### Known Patterns
- Type-only imports for TypeScript verbatimModuleSyntax
- useLiveQuery for reactive IndexedDB data
- State transitions with date auto-clear/set logic
- Form validation with inline error display

## Discovery Assessment

**Discovery Level**: Level 0 (Skip) - Internal work following established patterns

**Rationale**:
- Camera capture and file upload use standard HTML5 File API (no new libraries)
- IndexedDB Blob storage already covered in STACK.md research
- Responsive design uses Tailwind CSS utilities (already configured)
- Visual feedback patterns are standard React state management
- No external API integrations or architectural decisions

## Implementation Strategy

### Plan 1: Image Capture & Storage
- Add image Blob field to Bin schema
- Update BinForm to add file/camera inputs
- Store images as Blobs in IndexedDB
- Update Bin types to include image field

### Plan 2: Image Display & Thumbnails
- Update BinCard to show image thumbnails
- Add image modal/lightbox for full-size view
- Handle missing images gracefully
- Optimize thumbnail display

### Plan 3: Responsive UI & Visual Feedback
- Refine mobile layout with larger touch targets
- Add loading states for image operations
- Add success/error toasts for user feedback
- Improve spacing and visual hierarchy

## Key Considerations

From STACK.md research:
- **Image compression**: Browser built-in canvas compression (simple, no extra library)
- **Blob storage quota**: Desktop unlimited, mobile ~100MB-2GB
- **Memory leaks**: Must use URL.revokeObjectURL() for Blob URLs
- **Safari quirks**: May need separate camera/file inputs

From Phase 1 patterns:
- Use type-only imports
- Follow established component structure
- Maintain reactive updates via dexie-react-hooks
- Keep mobile-first design approach

## Files to Modify

**Database**:
- src/db/schema.ts (add image: Blob | null to Bin interface)
- src/db/index.ts (update schema version if needed)

**Types**:
- src/types/bin.ts (add image to Bin and BinFormData)

**Components**:
- src/components/BinForm.tsx (add image capture UI)
- src/components/BinCard.tsx (add thumbnail display)
- src/components/BinList.tsx (responsive grid improvements)

**New Components**:
- src/components/ImageModal.tsx (full-size image viewer)
- src/components/Toast.tsx (feedback notifications)

**Hooks** (if needed):
- src/hooks/useImageCompression.ts (optional, could inline)

## Task Breakdown (Initial)

### Plan 1: Image Capture & Storage
1. Task 1: Add image field to Bin schema and types
2. Task 2: Add image capture inputs to BinForm (camera + file picker)
3. Task 3: Store and retrieve image Blobs in Dexie

### Plan 2: Image Display & Thumbnails
1. Task 1: Display thumbnails in BinCard with Blob URL
2. Task 2: Create ImageModal component for full-size view
3. Task 3: Wire modal to BinCard thumbnail clicks

### Plan 3: Responsive UI & Visual Feedback
1. Task 1: Add loading states for image operations
2. Task 2: Create Toast component for success/error feedback
3. Task 3: Improve responsive layout and touch targets

## Success Criteria

From ROADMAP:
1. User can capture a bin photo using their phone's camera or upload from gallery
2. User can see image thumbnails in the bin list that load reliably offline
3. User can tap a thumbnail to view the full-size image and close it to return
4. User can use the app comfortably on phone, tablet, or desktop with readable text and touch-friendly controls
5. User sees clear feedback (loading states, success messages, error alerts) for all interactions
