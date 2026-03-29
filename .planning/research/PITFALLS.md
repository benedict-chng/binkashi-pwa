# Pitfalls Research

**Domain:** React PWA offline-first apps with IndexedDB and service workers
**Researched:** 2026-03-29
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Cache Inversion - Stale HTML With Fresh JavaScript

**What goes wrong:**
The service worker caches the `index.html` file but serves a stale version while loading fresh JavaScript from the network. When the old HTML tries to load the new JS bundle, the app breaks because the cached HTML references a non-existent JS file (or vice versa). Users see a blank screen or runtime errors that don't appear in development.

**Why it happens:**
Service workers implement a cache-first strategy for performance. HTML gets cached on first visit and stays cached indefinitely. When you deploy a new version, the service worker needs to detect the change, activate, and then clear the old cache. If the HTML cache is updated independently of the JS cache, you get version mismatch. The browser may serve cached HTML from the `install` event while serving updated JS from a subsequent fetch that hits the network.

**How to avoid:**
1. **Versioned caches** - Use cache names with versions (`v1`, `v2`) and always update both HTML and JS assets together in a single install event
2. **Precise activation control** - Use `skipWaiting()` and `clients.claim()` carefully to control when new service workers take over
3. **Delete old caches atomically** - In the `activate` event, delete ALL old caches before allowing the new one to serve requests
4. **Cache busting on deployment** - Include build hash or timestamp in asset URLs so new versions bypass old cache entries

```javascript
// GOOD: Versioned caches with atomic deletion
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        `/app-${buildHash}.js`, // Unique per build
        '/styles.css',
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== 'v2')
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
```

**Warning signs:**
- Users report "white screen" after updates
- Console errors about missing JS files or undefined functions
- "App works in dev but breaks after deploy"
- DevTools shows stale HTML cached despite new JS being loaded

**Phase to address:** Phase 1 (PWA Setup & Service Worker) - Implement proper cache versioning and activation strategy before adding offline capabilities

---

### Pitfall 2: QuotaExceededError - Failing Silently When Device Storage Fills

**What goes wrong:**
Users capture photos for their bins, but when IndexedDB hits the browser's storage quota, write operations fail with `QuotaExceededError`. If this error isn't caught, the app silently fails to save data. Users lose their newly created bins or edited information without any feedback. The app appears to work until the user reloads and sees the data is missing.

**Why it happens:**
Browser storage is limited (typically 60% of total disk space per origin in Chrome, less on mobile Safari). Image blobs consume significant space quickly. IndexedDB writes can fail for reasons outside developer control: device full, user in incognito mode (lower quotas), or browser storage eviction policies. Developers often don't implement error handling for every write operation, assuming "it will work." Without proper error handling, failed writes are silent.

**How to avoid:**
1. **Always catch write errors** - Wrap all IndexedDB/Dexie operations in try-catch blocks and handle `QuotaExceededError` specifically
2. **Check available space before writes** - Use `navigator.storage.estimate()` to check remaining quota before large operations
3. **Implement image compression** - Resize and compress images before storing as blobs (use Canvas API or libraries like `browser-image-compression`)
4. **Provide user feedback** - Show clear error messages when quota is exceeded and offer solutions (delete old bins, export data)
5. **Consider cache management** - Delete old thumbnail caches or implement LRU eviction for non-critical data

```javascript
// GOOD: Check quota before large operations
async function saveImage(blob) {
  const quota = await navigator.storage.estimate();
  const remaining = quota.quota - quota.usage;

  if (blob.size > remaining * 0.8) { // Keep 20% buffer
    throw new Error('Storage nearly full. Please delete some bins first.');
  }

  try {
    await db.bins.add({ image: blob });
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage full. Delete some bins or export your data.');
      // Offer to clear old data
    }
    throw error;
  }
}
```

**Warning signs:**
- App works on development machine but not on low-storage mobile devices
- "My bin disappeared after I added a photo"
- DevTools Application tab shows near-full storage
- No user-facing error messages but data not persisting

**Phase to address:** Phase 1 (PWA Setup) - Implement quota checking and error handling before image capture feature

---

### Pitfall 3: Service Worker Update Deadlock - Users Stuck on Old Versions

**What goes wrong:**
You deploy a critical bug fix, but users continue running the old version for days or weeks because the service worker never updates. The new service worker is installed and waiting, but old tabs never close, so the new version never activates. Users can't access bug fixes or new features without explicitly reloading or clearing browser data.

**Why it happens:**
Service worker lifecycle requires ALL tabs controlled by the old worker to close before the new one activates. If a user keeps a tab open for days (common on mobile), the new service worker sits in "waiting" state indefinitely. Developers often forget to use `skipWaiting()` or don't inform users they need to reload. The "installing → waiting → active" transition gets stuck, creating a version split where some users are on old code.

**How to avoid:**
1. **Use `skipWaiting()` selectively** - For critical bug fixes, call `self.skipWaiting()` in the install event to force immediate activation
2. **Provide UI for updates** - Detect when a new service worker is waiting and show a "Refresh to update" banner
3. **Use message passing** - Send a message from the new service worker to clients to notify them of the update
4. **Test update paths** - Always test service worker updates across multiple tabs to ensure proper activation
5. **Version detection** - Compare current service worker version with expected version and prompt user if mismatched

```javascript
// GOOD: Notify clients of pending update
self.addEventListener('install', (event) => {
  // For critical updates, skip waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// In main thread:
const registration = await navigator.serviceWorker.register('/sw.js');

if (registration.waiting) {
  // Show update banner
  showUpdateBanner();
}
```

**Warning signs:**
- Support tickets from users on old versions despite recent deployments
- Different users experiencing different bugs from the same release
- DevTools shows "waiting" service worker that never activates
- Bug fixes reported as fixed but users still experiencing the issue

**Phase to address:** Phase 1 (PWA Setup) - Implement update detection and user notification before shipping to production

---

### Pitfall 4: IndexedDB Transaction Timeout - Race Conditions Between UI and Storage

**What goes wrong:**
The UI shows updated bin state (e.g., transition from "In Use" to "Fermenting"), but the IndexedDB transaction hasn't committed yet. If the user quickly navigates away or the browser closes, the update is lost. Users see the UI reflect a change that doesn't persist, leading to confusion about whether their action worked.

**Why it happens:**
IndexedDB transactions are asynchronous but have a lifetime tied to the event loop. If you make a transaction but return to the event loop without extending it (by making a request), the transaction becomes inactive and aborts. Developers often assume "await" means "committed," but the transaction may still be in-flight. Additionally, Dexie's promise-based API can mask the underlying transaction lifecycle, making it easy to lose track of when a transaction actually commits.

**How to avoid:**
1. **Never mix multiple async operations in one transaction without proper chaining** - Keep all database operations within a single transaction scope
2. **Listen for transaction completion** - Use `transaction.oncomplete` or Dexie's transaction completion events to ensure persistence
3. **Show loading states** - Disable UI interactions until the transaction commits
4. **Use Dexie's transaction API correctly** - Pass the correct scope and mode (`readwrite` vs `readonly`)
5. **Test rapid action scenarios** - Click quickly, navigate quickly, close tabs quickly to ensure data persists

```javascript
// GOOD: Ensure transaction completion
async function updateBinState(binId, newState) {
  await db.transaction('rw', db.bins, async () => {
    await db.bins.update(binId, { state: newState });
    // Transaction completes when this function resolves
  });
  // UI update only after transaction completes
  renderBins();
}

// BAD: Transaction may abort before await resolves
const transaction = db.transaction(['bins'], 'readwrite');
await transaction.objectStore('bins').put(binData);
// If we don't do anything else, transaction may abort
```

**Warning signs:**
- "I saved the change but it reverted when I refreshed"
- Console warnings about aborted transactions
- Data inconsistency between UI and actual storage
- Issues only appear on slow connections or low-end devices

**Phase to address:** Phase 1 (IndexedDB Setup) - Implement proper transaction handling and loading states

---

### Pitfall 5: Image Blob Memory Leaks - Growing Memory on Every Photo View

**What goes wrong:**
Each time a user views a bin image, the blob is read from IndexedDB and converted to a URL using `URL.createObjectURL()`. These URLs are never revoked, causing memory to grow indefinitely. Eventually the browser tab crashes or becomes unresponsive, especially on mobile devices with limited RAM.

**Why it happens:**
`URL.createObjectURL()` creates a unique reference to the blob in memory. These references must be explicitly revoked with `URL.revokeObjectURL()`, otherwise the blob cannot be garbage collected. Developers often create these URLs for image display but forget to clean them up. In a React app with component re-renders, this is especially problematic as URLs may be created multiple times without cleanup.

**How to avoid:**
1. **Always revoke object URLs** - Use `useEffect` cleanup functions to revoke URLs when components unmount
2. **Consider `FileReader` for small images** - For thumbnails, convert to data URLs instead (base64) - no cleanup needed but larger string size
3. **Limit concurrent blob URLs** - Only create URLs for visible images (lazy loading)
4. **Monitor memory usage** - Use Chrome DevTools Memory profiler to detect leaks during development
5. **Use canvas for display** - Draw blobs to canvas instead of creating object URLs where possible

```javascript
// GOOD: Cleanup object URLs in React
function BinImage({ bin }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let url;
    if (bin.image) {
      url = URL.createObjectURL(bin.image);
      setImageUrl(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [bin.image]);

  return imageUrl ? <img src={imageUrl} alt={bin.name} /> : null;
}
```

**Warning signs:**
- Browser tab becomes slower over time as user navigates the app
- "App works at first but gets laggy"
- Chrome DevTools Memory profiler shows increasing heap size
- Tab crashes on mobile devices after extended use

**Phase to address:** Phase 1 (Image Handling) - Implement proper blob URL management before image viewing feature

---

### Pitfall 6: Offline Data Inconsistency - Merging Conflicts After Reconnection

**What goes wrong:**
User edits bin data while offline, then reopens the app online. The app doesn't detect that local data has changed and overwrites with stale server data, or the user's local edits are lost entirely. For a single-user app with export/import, this manifests as: user exports data, makes changes, imports old export, and loses recent edits.

**Why it happens:**
Without a sync strategy, there's no version tracking or conflict resolution. When the app re-connects, it doesn't know which version is newer. For export/import, users might overwrite newer data with older exports. The app assumes "server" data (or import data) is authoritative, leading to data loss.

**How to avoid:**
1. **Implement timestamps** - Store `updatedAt` on all records and compare before overwriting
2. **Detect conflicts before overwriting** - Warn user when importing data that's older than current state
3. **Version control** - Maintain a data version number that increments with each change
4. **Show sync status** - Indicate to user whether data is local-only or synced (even if manual sync)
5. **Backup before destructive operations** - Auto-backup before imports or data resets

```javascript
// GOOD: Detect conflicts before overwriting
async function importData(importedBins) {
  const localBins = await db.bins.toArray();

  for (const imported of importedBins) {
    const existing = localBins.find(b => b.id === imported.id);

    if (existing && existing.updatedAt > imported.updatedAt) {
      const shouldOverwrite = confirm(
        `Local data for "${imported.name}" is newer. Overwrite?`
      );
      if (!shouldOverwrite) continue;
    }

    await db.bins.put(imported);
  }
}
```

**Warning signs:**
- "I lost my changes after exporting and importing"
- Data reverts to old state after device reconnects
- No indication in UI whether changes are saved or pending sync
- Users reporting data loss after specific actions (import, sync)

**Phase to address:** Phase 2 (Export/Import) - Implement conflict detection and user prompts

---

### Pitfall 7: Safari's 7-Day Cache Eviction - Disappearing Offline Data

**What goes wrong:**
On iOS Safari, users' cached app assets and IndexedDB data disappear after 7 days of non-use. When they return to the app, it appears as a fresh install with all data gone. This is particularly problematic for a compost tracking app that users might not open for weeks between gardening sessions.

**Why it happens:**
WebKit (Safari's engine) has a proactive eviction policy: if an origin has no user interaction for 7 days, all script-writable storage (including IndexedDB and Cache API) is automatically deleted. This doesn't apply to installed PWAs (added to home screen), but many users don't install—they just use the browser. The eviction happens silently without notification.

**How to avoid:**
1. **Request persistent storage** - Use `navigator.storage.persist()` to request non-evictable storage (may be auto-approved based on engagement)
2. **Encourage PWA installation** - Add "Install App" prompts and educate users on benefits
3. **Implement local storage indicators** - Show when data might be at risk and prompt users to install
4. **Set up background sync reminders** - If possible, use periodic background sync (limited on iOS)
5. **Document the limitation** - Inform users that non-installed PWAs on Safari may lose data after 7 days

```javascript
// GOOD: Request persistent storage on first load
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const persisted = await navigator.storage.persist();
    if (persisted) {
      console.log('Storage will not be cleared by normal cleanup processes');
    }
  }
}

// Call this early in app initialization
requestPersistentStorage();
```

**Warning signs:**
- iOS users reporting "my app is blank after not using it for a while"
- Data disappears specifically on Safari/iOS devices
- Users who don't "add to home screen" lose data more frequently
- No issues on Chrome/Android/Firefox

**Phase to address:** Phase 1 (PWA Setup) - Implement persistent storage request and installation prompts before production

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| **Skip cache versioning** | Faster initial implementation | Risk of cache inversion issues; difficult to update | Never - always use versioned caches |
| **Store full-size images without compression** | Simpler code; no processing delay | Fills storage quickly; hits quota limits sooner; slower app | Temporary for MVP only; must add compression before many users |
| **Ignore `skipWaiting()`** | More controlled updates; no forced refreshes | Users stuck on old versions; bug fixes don't reach everyone | Acceptable for non-critical apps; not for bug fixes |
| **Use localStorage for small data** | Simpler API; synchronous access | Blocks main thread; evicted by browser; no worker access | Only for truly ephemeral session data |
| **Skip `QuotaExceededError` handling** | Less code to write | Silent data loss; poor user experience | Never - always handle storage errors |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **IndexedDB with Dexie** | Not wrapping operations in proper transaction scope; assuming promises mean committed | Use Dexie's `db.transaction()` API and understand transaction lifecycle |
| **Service Worker with React Router** | Service worker caching route paths that don't match actual deployed assets | Cache all routes as fallbacks to `index.html` for SPA handling |
| **Camera/File Input** | Storing raw File objects without blob conversion | Convert files to Blob before storing; compress if large |
| **Export/Import** | Overwriting entire database without conflict detection | Compare timestamps; warn before destructive overwrites |
| **Cloudflare Pages deployment** | Not handling cache headers on deployment; service worker not updating | Ensure proper cache-control headers; include build hashes in asset names |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| **Large object storage** | Storing entire state tree or huge images as single records | Split data into smaller records; store images separately | At ~50-100 bins with images (depending on image size) |
| **Blocking main thread with sync storage** | App freezes during localStorage/sessionStorage access | Use async storage (IndexedDB) exclusively | Even at small scale; always use async |
| **N+1 queries in Dexie** | Fetching all bins then fetching each bin's image separately | Use Dexie's bulk operations or indexes for related data | At ~20+ bins with images |
| **No image caching strategy** | Re-creating object URLs or decoding images on every render | Cache blob URLs; implement image lazy loading | At ~10+ images visible on screen |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Not sanitizing export data** | User exports malicious JSON and re-imports; potential XSS | Validate and sanitize imported JSON before storing |
| **Storing sensitive data in IndexedDB** | Clear text passwords, tokens, personal info | Never store sensitive data; if required, encrypt at rest |
| **Exposing database schema in console** | Dev logs revealing IndexedDB structure | Remove console logs in production; use structured logging |
| **Ignoring content security policies** | Service worker injecting scripts that violate CSP | Test service worker with CSP headers enabled |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **No offline indicator** | User doesn't know if app is working online or offline | Show connectivity status; indicate when actions are offline-only |
| **Silent quota errors** | User assumes save worked; data lost | Show clear error message when storage is full; offer recovery options |
| **Confusing state transitions** | User doesn't know which states are valid | Implement state transition validation; show allowed next states |
| **No export confirmation** | Accidental overwrites without warning | Confirm destructive operations; show what will be affected |
| **Missing loading states** | User doesn't know if operation is still processing | Show spinner or skeleton; disable buttons during async operations |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Offline detection:** App "works offline" but doesn't notify user they're offline → Verify `window.addEventListener('offline')` handler shows indicator
- [ ] **Service worker updates:** Service worker updates work in dev → Test with multiple tabs open; verify old tabs get new version
- [ ] **Image persistence:** Images save and display → Test after page reload, app close/reopen, and quota limit simulation
- [ ] **Export/import roundtrip:** Export works, import works → Verify data integrity after import; test with conflicting timestamps
- [ ] **State transitions:** UI shows state options → Verify invalid transitions are blocked; test state machine
- [ ] **Cache busting:** New assets deploy → Verify users see new version without hard refresh; test cache invalidation
- [ ] **Quota handling:** App stores images fine → Test with storage limit set low in DevTools; verify error handling
- [ ] **Blob cleanup:** Images display correctly → Use DevTools memory profiler; verify no leak after 100+ image views

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Cache inversion** | HIGH | Increment cache version to `v3`, force `skipWaiting()`, clear all caches, prompt users to reload |
| **Quota exceeded data loss** | MEDIUM | Provide export option before clearing; implement selective deletion (oldest bins first) to free space |
| **Stuck service worker update** | LOW | Add "Update available" UI button calling `registration.waiting.postMessage({type: 'SKIP_WAITING'})` |
| **IndexedDB transaction abort** | MEDIUM | Implement operation replay queue; show user "unsaved changes detected" and offer retry |
| **Blob memory leak** | LOW | Force reload on memory pressure detection; implement automatic cleanup after N images viewed |
| **Safari data eviction** | HIGH | Prompt user to install PWA immediately; offer data recovery from last known good backup |
| **Offline data conflicts** | HIGH | Store both versions; show conflict resolution UI to user; let them choose which to keep |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Cache inversion | Phase 1 (PWA Setup) | Test cache versioning; deploy multiple times and verify users see updates |
| QuotaExceededError | Phase 1 (PWA Setup) | Test with DevTools storage quota simulator; verify error messages and recovery |
| Service worker update deadlock | Phase 1 (PWA Setup) | Test with multiple tabs; verify new version activates without manual reload |
| IndexedDB transaction timeout | Phase 1 (IndexedDB Setup) | Add integration tests for rapid actions; verify no data loss |
| Image blob memory leaks | Phase 1 (Image Handling) | Profile memory during image viewing; verify stable heap size |
| Offline data inconsistency | Phase 2 (Export/Import) | Test import/export roundtrips; verify conflict detection |
| Safari 7-day eviction | Phase 1 (PWA Setup) | Test on iOS simulator; verify persistent storage request works |

## Sources

- MDN Web Docs - Service Worker API and lifecycle (HIGH confidence)
- MDN Web Docs - IndexedDB API and Using IndexedDB (HIGH confidence)
- web.dev - Storage for the web (HIGH confidence)
- web.dev - Storage quotas and eviction criteria (HIGH confidence)
- web.dev - Best Practices for Persisting Application State with IndexedDB (HIGH confidence)
- MDN Web Docs - Storage API / Storage quotas and eviction criteria (HIGH confidence)
- Dexie.js Official Documentation (HIGH confidence)

---
*Pitfalls research for: React PWA offline-first apps with IndexedDB*
*Researched: 2026-03-29*
