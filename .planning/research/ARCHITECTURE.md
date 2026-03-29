# Architecture Research

**Domain:** React PWA Offline-First Application
**Researched:** 2026-03-29
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                     │
│                   (React Components)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │  BinList  │  │  BinForm  │  │  BinView  │       │
│  │ Component │  │ Component │  │ Component │       │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘       │
│        │              │              │                    │
│        └──────────────┴──────────────┘                    │
│                       ↓                                  │
│              ┌───────────────┐                         │
│              │ useLiveQuery   │                         │
│              │  (React Hook) │                         │
│              └───────┬───────┘                         │
└───────────────────────┼───────────────────────────────────┘
                        ↓
┌───────────────────────┴───────────────────────────────────┐
│                 State Management Layer                     │
│                   (Dexie.js + IndexedDB)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ bins     │  │ images   │  │ settings │            │
│  │  Table   │  │  Table   │  │  Table   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────┘
                        ↑
                        ↓
┌───────────────────────┴───────────────────────────────────┐
│                  Storage Layer                             │
│                  (IndexedDB)                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐  │
│  │            Persistent Storage (Browser)             │  │
│  │     - Structured data (bins, settings)            │  │
│  │     - Binary data (images as Blobs)               │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↑
                        ↓
┌───────────────────────┴───────────────────────────────────┐
│                  Service Worker Layer                       │
│                 (Vite PWA + Workbox)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐  │
│  │         Cache Strategy & Asset Management            │  │
│  │  - App shell precaching                          │  │
│  │  - Runtime caching (stale-while-revalidate)      │  │
│  │  - Asset versioning                              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **bin-db.ts** | Dexie database instance, schema definition, version migrations | Singleton Dexie class with `bins`, `images`, `settings` tables |
| **useLiveQuery()** | Reactive data binding between IndexedDB and React components | Dexie React Hook that observes query results and triggers re-renders |
| **BinList Component** | Display all bins with thumbnails, filter/search | `useLiveQuery(() => db.bins.toArray())` |
| **BinForm Component** | Create/edit bin, handle image upload, validate state transitions | Direct Dexie mutations (`db.bins.add()`, `db.bins.put()`) |
| **BinView Component** | Display single bin details, manage state changes | Query by ID, show image blob via `URL.createObjectURL()` |
| **Service Worker** | Cache static assets, handle offline navigation | Workbox-generated via Vite PWA plugin |
| **Import/Export** | JSON import/export for data portability | Read/write from IndexedDB, serialize/deserialize blobs |

## Recommended Project Structure

```
src/
├── db/                      # Database layer (Dexie.js)
│   ├── schema.ts            # Database schema definition & migrations
│   ├── bin-db.ts           # Dexie singleton instance
│   └── repositories/       # Optional: Repository pattern for complex queries
│       └── bin-repository.ts
├── components/              # React components
│   ├── bin/
│   │   ├── BinList.tsx
│   │   ├── BinForm.tsx
│   │   ├── BinView.tsx
│   │   └── BinThumbnail.tsx
│   ├── shared/
│   │   └── ImageUploader.tsx
│   └── layout/
│       ├── AppShell.tsx
│       └── Header.tsx
├── hooks/                  # Custom React hooks
│   ├── useBins.ts         # useLiveQuery wrapper for bin operations
│   ├── useBinImage.ts     # Image blob handling
│   └── useImportExport.ts # Import/export functionality
├── services/              # Business logic layer (optional)
│   ├── bin-service.ts     # State transition logic
│   └── image-service.ts   # Image compression/optimization
├── utils/                 # Utilities
│   ├── state-machine.ts   # Bin state transition validation
│   └── blob-utils.ts     # Blob to URL conversion
├── types/                 # TypeScript types
│   └── bin.ts            # Bin entity type definitions
├── assets/               # Static assets
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── manifest.json          # Web app manifest (generated)
```

### Structure Rationale

- **`db/`**: Encapsulates all IndexedDB/Dexie logic. Single source of truth for database schema. Separates data access from UI.
- **`components/`**: Organized by feature (bin-related vs shared). Keeps UI code modular and reusable.
- **`hooks/`**: Custom React hooks that encapsulate data fetching logic with `useLiveQuery()`. Makes components testable and separates concerns.
- **`services/`**: Business logic layer (optional for small apps). Useful for state machine logic and cross-table operations.
- **`utils/`**: Pure functions and utilities. No side effects, easy to test.
- **`types/`**: TypeScript definitions for type safety across the app.

## Architectural Patterns

### Pattern 1: Singleton Database Instance

**What:** One Dexie instance shared across the entire application.

**When to use:** Always. Dexie is designed to be a singleton per origin. Multiple instances cause issues.

**Trade-offs:**
- **Pros:** Consistent schema, shared transaction context, simpler debugging
- **Cons:** Global state (mitigated by React hooks encapsulation)

**Example:**
```typescript
// src/db/bin-db.ts
import { Dexie, type EntityTable } from 'dexie'

interface Bin {
  id?: number
  name: string
  state: 'Empty' | 'In Use' | 'Fermenting'
  startDate: string
  endDate?: string
  image?: Blob
}

const db = new Dexie('BinkashiDatabase') as Dexie & {
  bins: EntityTable<Bin, 'id'>
}

db.version(1).stores({
  bins: '++id, name, state, startDate' // Primary key "id", indexed props
})

export { db, type Bin }
```

### Pattern 2: Live Queries with React Hooks

**What:** Use `useLiveQuery()` from `dexie-react-hooks` to automatically re-render components when IndexedDB data changes.

**When to use:** For any component displaying database data. Eliminates manual state synchronization.

**Trade-offs:**
- **Pros:** Automatic reactivity, no manual state updates, works across tabs/windows
- **Cons:** Slight overhead from query observation (negligible for small apps)

**Example:**
```typescript
// src/hooks/useBins.ts
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/bin-db'

export function useBins() {
  // Automatically re-renders when bins table changes
  return useLiveQuery(() => db.bins.toArray(), [])
}

export function useBin(id: number) {
  return useLiveQuery(() => db.bins.get(id), [id])
}

export function useBinsByState(state: string) {
  return useLiveQuery(() => db.bins.where('state').equals(state).toArray(), [state])
}
```

### Pattern 3: App Shell with Service Worker

**What:** Precache the minimal HTML/CSS/JS needed to render the app shell (layout, navigation). Load dynamic content from IndexedDB.

**When to use:** For any offline-first PWA. Ensures instant loading on repeat visits.

**Trade-offs:**
- **Pros:** Instant perceived performance, works offline, simpler than full-page caching
- **Cons:** Requires careful asset organization, slightly more complex service worker

**Example:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      strategies: 'networkFirst', // For HTML/CSS/JS
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
})
```

### Pattern 4: State Machine for Transitions

**What:** Define valid state transitions (Empty → In Use → Fermenting → Empty) and enforce them in a validation layer.

**When to use:** When business logic requires strict state control. Prevents invalid data entry.

**Trade-offs:**
- **Pros:** Type-safe transitions, prevents bugs, testable business logic
- **Cons:** Additional layer of abstraction (worth it for state-heavy apps)

**Example:**
```typescript
// src/utils/state-machine.ts
export type BinState = 'Empty' | 'In Use' | 'Fermenting'

const VALID_TRANSITIONS: Record<BinState, BinState[]> = {
  'Empty': ['In Use'],
  'In Use': ['Fermenting', 'Empty'],
  'Fermenting': ['Empty']
}

export function canTransition(from: BinState, to: BinState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

export function getNextStates(currentState: BinState): BinState[] {
  return VALID_TRANSITIONS[currentState] ?? []
}
```

## Data Flow

### Request Flow (Create/Update Bin)

```
[User Action: Fill Form]
    ↓
[Component: BinForm]
    ↓
[Handler: handleSubmit()]
    ↓
[Service: validateStateTransition()]
    ↓
[Dexie: db.bins.add() / db.bins.put()]
    ↓
[IndexedDB: Write Transaction]
    ↓
[Dexie React Hooks: useLiveQuery observes change]
    ↓
[Component: Re-render with new data]
```

### Read Flow (Display Bin List)

```
[Component Mount: BinList]
    ↓
[Hook: useBins()]
    ↓
[Dexie React: useLiveQuery(() => db.bins.toArray())]
    ↓
[IndexedDB: Query Transaction]
    ↓
[Dexie: Return bin array]
    ↓
[Component: Render bins with thumbnails]
```

### Image Storage Flow

```
[User Action: Upload Image]
    ↓
[Component: ImageUploader (File Input)]
    ↓
[Handler: handleImageSelect()]
    ↓
[Service: Optional compression/optimization]
    ↓
[Dexie: db.bins.put({ ...bin, image: blob })]
    ↓
[IndexedDB: Store as Blob]
    ↓
[Component: Read blob, URL.createObjectURL()]
    ↓
[Render: Display image from object URL]
```

### Key Data Flows

1. **Reactive Query Flow:** `useLiveQuery()` observes IndexedDB changes → Triggers React re-render → UI updates automatically. No manual state updates needed.
2. **Transaction Flow:** Dexie operations (`add`, `put`, `update`) run in transactions → Atomic writes → Live queries detect changes → UI updates.
3. **Offline Flow:** Service worker intercepts requests → Serves from cache if offline → App functions without network → IndexedDB stores all user data.
4. **Sync Flow (N/A for Binkashi):** No sync architecture needed (single-user, no backend). If added later, Dexie Cloud provides sync.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Single-user app - No scaling needed. Browser handles IndexedDB efficiently for thousands of records. |
| 1k-100k users | Not applicable (single-user app). If multi-user added: Add Dexie Cloud sync, authentication, and access control. |
| 100k+ users | Not applicable (single-user app). If added: Partition data by user, implement server-side filtering, add pagination to queries. |

### Scaling Priorities

1. **First bottleneck:** IndexedDB quota limits (browser-specific, typically 60% of disk space).
   - **Fix:** Compress images, lazy-load thumbnails, implement storage quota monitoring with `navigator.storage.estimate()`.

2. **Second bottleneck:** Image memory usage (large blobs in memory).
   - **Fix:** Store optimized versions (thumbnails), dispose object URLs with `URL.revokeObjectURL()`, consider virtual scrolling for large lists.

## Anti-Patterns

### Anti-Pattern 1: Multiple Dexie Instances

**What people do:** Creating new Dexie instances in multiple files or components.

**Why it's wrong:** Dexie is designed as a singleton. Multiple instances create separate database connections, causing schema conflicts, version issues, and transaction isolation problems.

**Do this instead:** Export a single Dexie instance from a dedicated module (`db/bin-db.ts`) and import it everywhere.

### Anti-Pattern 2: Manual State Synchronization

**What people do:** Using `useState` to mirror IndexedDB data, manually updating state on database changes.

**Why it's wrong:** Creates synchronization bugs (stale state, race conditions). Duplicates data in memory. `useLiveQuery()` handles this automatically.

**Do this instead:** Use `useLiveQuery()` directly in components. It automatically updates when the database changes, even from other tabs/windows.

### Anti-Pattern 3: Synchronous IndexedDB Operations

**What people do:** Not using `await` on Dexie operations, assuming immediate completion.

**Why it's wrong:** IndexedDB is asynchronous. Assuming synchronous behavior leads to race conditions, incomplete transactions, and data loss.

**Do this instead:** Always `await` Dexie operations. Use transactions for atomic operations when updating multiple tables.

### Anti-Pattern 4: Caching Everything Indiscriminately

**What people do:** Caching all assets with the same strategy (e.g., `CacheFirst` for everything).

**Why it's wrong:** Stale content persists forever. User doesn't get updates. Some resources (HTML, CSS) need network validation.

**Do this instead:** Use appropriate caching strategies:
- **App shell:** `CacheFirst` with versioning
- **HTML:** `NetworkFirst` (always get latest)
- **API calls:** `StaleWhileRevalidate` (show cached, update in background)
- **Images:** `CacheFirst` with expiration

### Anti-Pattern 5: Not Validating State Transitions

**What people do:** Allowing any state change (e.g., Empty → Fermenting without intermediate steps).

**Why it's wrong:** Invalid data corrupts business logic. User can create impossible bin states. Breaks downstream logic (e.g., date calculations).

**Do this instead:** Implement a state machine with `VALID_TRANSITIONS`. Validate transitions before updating the database.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Vite PWA Plugin** | Configuration in `vite.config.ts` | Generates service worker, manifest, and Workbox runtime. Zero-config defaults work well. |
| **File System (Camera)** | HTML5 File API | Use `<input type="file" accept="image/*" capture="environment">` for camera access. Handle Blob storage in IndexedDB. |
| **Browser Storage** | IndexedDB via Dexie.js | Primary storage for all data. No external cloud services needed for single-user app. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **db/ ↔ components** | Direct imports + `useLiveQuery()` | Components import hooks, which call Dexie. Keep database schema encapsulated in `db/` layer. |
| **services/ ↔ components** | Function calls | Optional service layer for business logic. Keeps components focused on UI. |
| **components/ ↔ hooks** | Hook return values | Hooks expose query results and mutation functions. Components call hooks, not Dexie directly. |
| **service worker ↔ app** | Cache API intercepts | Service worker is separate thread. Communicates via `postMessage()` for updates (if needed). |

## Sources

- **web.dev PWA Architecture** (HIGH confidence): https://web.dev/learn/pwa/architecture/ — Official Chrome team guidance on SPA vs MPA, service worker patterns, domains/scopes
- **web.dev Service Workers** (HIGH confidence): https://web.dev/learn/pwa/service-workers/ — Lifecycle, registration, capabilities, offline strategies
- **web.dev Offline Data** (HIGH confidence): https://web.dev/learn/pwa/offline-data/ — IndexedDB usage, storage management, persistence
- **Dexie.js React Tutorial** (HIGH confidence): https://dexie.org/docs/Tutorial/React — Live queries, React hooks, database patterns
- **Vite PWA Plugin** (HIGH confidence): https://vite-pwa-org.netlify.app/ — Zero-config PWA generation, Workbox integration
- **Vite Build Docs** (HIGH confidence): https://vitejs.dev/guide/build.html — Build optimization, asset handling

---
*Architecture research for: React PWA Offline-First Application*
*Researched: 2026-03-29*
