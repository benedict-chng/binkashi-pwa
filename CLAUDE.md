<!-- GSD:project-start source:PROJECT.md -->
## Project

**Binkashi**

Binkashi is a single-user offline-first Progressive Web App (PWA) for tracking bokashi compost bins. Users can manage multiple bins, track their state (Empty, In Use, Fermenting), store dates, capture photos, and import/export data—all from a mobile device with offline support.

**Core Value:** Users can quickly add and update bokashi compost bins on their phone without an internet connection, with automatic state transitions and image capture.

### Constraints

- **Tech Stack**: React + Vite + Dexie.js — Standard, well-supported stack with good PWA tooling
- **Deployment**: Cloudflare Pages — Static site hosting, easy deployment
- **No Backend**: Fully client-side — All data stored in IndexedDB
- **Offline**: Must work without internet — PWA requirements (service worker, manifest)
- **Mobile-First**: Designed for phone use — Responsive UI, camera capture support
- **Image Storage**: IndexedDB Blobs — Must store images locally, not external URLs
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI framework | Industry standard for modern web apps, excellent community support, concurrent rendering, server components ready for future scalability. React 19 includes improved hooks and performance optimizations. |
| Vite | 8.0.3 | Build tool & dev server | Lightning-fast HMR, instant server start, native ESM support, excellent TypeScript support. Standard choice in 2025 for React projects over CRA (deprecated). |
| TypeScript | 6.0.2 | Type safety | Catches errors at compile-time, better IDE support, self-documenting code. Essential for maintaining code quality as the app grows. |
### Database & Offline Storage
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Dexie.js | 4.4.1 | IndexedDB wrapper | Simplifies IndexedDB with Promise-based API, excellent developer experience. Used by WhatsApp Web, ChatGPT, GitHub Desktop. Native TypeScript support. |
| dexie-react-hooks | 4.4.0 | React integration for Dexie | Provides `useLiveQuery()` hook for reactive data queries. Automatically re-renders components when IndexedDB data changes (even from other tabs/workers). |
### PWA & Service Worker
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| vite-plugin-pwa | 1.2.0 | PWA plugin for Vite | Zero-config PWA setup, auto-generates service worker with Workbox, handles app manifest, offline support out-of-the-box. Actively maintained by Anthony Fu. |
| workbox-window | 7.4.0 | Service worker runtime | Runtime library for controlling service workers. Automatically installed by vite-plugin-pwa. Provides precaching, stale-while-revalidate, and network-strategy patterns. |
| @vite-pwa/assets-generator | 1.0.2 | PWA asset generator | Generates all PWA icons and splash screens from a single source image. Essential for mobile installability and polished look. |
### Routing
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-router-dom | 7.13.2 | Client-side routing | Standard routing solution for React apps. Supports lazy loading, route-based code splitting, and maintains history. React Router v7 has improved performance and data loading features. |
### Styling (Mobile-First PWA)
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tailwind CSS | 4.2.2 | Utility-first CSS | Perfect for mobile-first PWAs - responsive utilities built-in, small bundle size, great DX. Tailwind 4 has new performance improvements and simplified configuration. |
| autoprefixer | ^10.4.20 | CSS vendor prefixes | Automatically adds vendor prefixes to CSS. Required for Tailwind to work across browsers. |
| postcss | ^8.4.49 | CSS transformation | Required for Tailwind CSS processing. |
### Form Handling
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-hook-form | 7.72.0 | Form state management | Excellent performance, minimal re-renders, great validation support. Perfect for mobile apps where performance matters. Integrates well with IndexedDB persistence. |
### Date Handling
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| date-fns | 4.1.0 | Date manipulation | Lightweight, modular, tree-shakable. Better than moment.js (deprecated) and day.js (good but less functional). date-fns v4 has improved bundle size and TypeScript support. |
### Testing
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vitest | 4.1.2 | Test runner | Native Vite integration, blazing fast, Jest-compatible API. Standard choice for Vite projects. |
| @testing-library/react | 16.3.2 | React component testing | Encourages testing user behavior, not implementation details. Maintained by Testing Library team. |
| @testing-library/user-event | 14.6.1 | User interaction simulation | Simulates real user interactions more realistically than fireEvent. Essential for testing mobile interactions. |
| jsdom | ^25.0.1 | DOM implementation for tests | Provides browser-like environment for Node.js. Required by Testing Library. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Code linting | Use `eslint-plugin-react` and `eslint-plugin-react-hooks` for React best practices |
| Prettier | Code formatting | Enforce consistent code style across the team |
| TypeScript ESLint | Type-aware linting | Catches type errors and logic issues in your code |
## Installation
# Core framework
# Build tool (installed in project root)
# Database & offline storage
# PWA
# Routing
# Styling
# Form handling
# Date handling
# Testing
# Dev tools
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Build Tool** | Vite 8.0.3 | Next.js | Next.js is SSR-focused, adds complexity for a simple client-side PWA. Overkill for single-user offline app. |
| **Build Tool** | Vite 8.0.3 | Create React App | CRA is deprecated, slow, and unmaintained. Vite is actively developed and faster. |
| **Database** | Dexie.js | Raw IndexedDB | Raw IndexedDB is complex, callback-heavy, and error-prone. Dexie provides clean Promise-based API with TypeScript support. |
| **Database** | Dexie.js | PouchDB | PouchDB is larger and designed for CouchDB sync. Dexie is lighter and more performant for offline-first IndexedDB. |
| **Styling** | Tailwind CSS | Material UI | MUI is great but heavier (130KB+ gzipped) and opinionated. Tailwind gives full control with smaller bundle. |
| **Styling** | Tailwind CSS | CSS Modules | CSS Modules require separate files and more build configuration. Tailwind utilities are inline and faster to iterate. |
| **Forms** | react-hook-form | Formik | Formik is older and heavier. react-hook-form has better performance and simpler API. |
| **Testing** | Vitest | Jest | Jest requires extra configuration to work with Vite/ESM. Vitest is native to Vite ecosystem and faster. |
| **Routing** | react-router-dom | TanStack Router | TanStack Router is newer and more powerful but steeper learning curve. react-router-dom is well-established and sufficient. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Create React App** | Deprecated since 2023, slow build, no active development, poor TypeScript support | Vite |
| **moment.js** | Deprecated, large bundle (67KB), mutable API | date-fns |
| **Redux** | Overkill for single-user app, adds boilerplate, complex for simple state | React Context + useState for UI state, Dexie for persistent state |
| **Class Components** | Legacy pattern, harder to test, hooks are the standard | Functional Components with Hooks |
| **jQuery** | Antiquated, incompatible with modern React ecosystem | React + Vanilla DOM APIs when needed |
| **localStorage** | Synchronous (blocks UI), limited to 5MB, no indexes, no querying | IndexedDB via Dexie.js |
| **sessionStorage** | Same issues as localStorage, clears on tab close | IndexedDB via Dexie.js |
| **Webpack** | Slower dev server, more complex configuration than needed for this app | Vite (uses Rollup under the hood) |
| **PropTypes** | Runtime type checking is redundant with TypeScript | TypeScript for compile-time type safety |
| **Sass/SCSS** | Extra build step, unnecessary with Tailwind CSS | Tailwind CSS for styling, or plain CSS modules |
| **Fetch API for everything** | For offline-first, need offline queueing and sync | Dexie for local data, implement sync patterns with Workbox |
## Stack Patterns by Variant
- Add Dexie Cloud for real-time sync and authentication
- Because you need cross-device synchronization without building a backend
- Use Material UI instead of Tailwind
- Because MUI has built-in WAI-ARIA compliance and keyboard navigation
- Consider Next.js instead of Vite
- Because SSR improves SEO and initial load performance for content sites
- Skip react-router-dom
- Because conditional rendering is simpler for single-view apps
- Add Framer Motion
- Because it provides declarative animation API perfect for React
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react@19.2.4 | react-dom@19.2.4 | Must match major version |
| dexie@4.4.1 | dexie-react-hooks@4.4.0 | Hooks version must match Dexie version |
| vite-plugin-pwa@1.2.0 | vite@5.x or 6.x or 7.x or 8.x | Requires Vite 5+ |
| vitest@4.1.2 | vite@8.x | Version matching recommended |
| @testing-library/react@16.3.2 | react@18+ | Supports React 19 |
| tailwindcss@4.2.2 | postcss@8.4+ | Requires PostCSS 8+ |
## IndexedDB with Blobs: Critical Notes
- Desktop: Usually unlimited (with user permission prompts at ~50GB)
- Mobile: Varies (iOS: ~500MB-2GB, Android: ~100MB-500MB)
- Consider image compression before storage to manage space
- Blob storage is asynchronous and doesn't block UI
- Query performance unaffected by Blob size (stored separately from indexed properties)
- Large images may trigger storage quota prompts on mobile
- Static assets (JS, CSS, icons) are precached by vite-plugin-pwa
- User-uploaded images (stored in IndexedDB) are NOT precached
- This is intentional - user data lives in IndexedDB, static resources in Cache Storage
## PWA Best Practices
### Service Worker Strategy
- Use `StaleWhileRevalidate` for app assets (fast response, updates in background)
- Use `NetworkFirst` for API calls (fresh data, fallback to cache)
- Use `CacheFirst` for static assets (icons, fonts, images)
### Offline-First Data Flow
### Manifest Configuration
- `display: 'standalone'` (removes browser chrome)
- `orientation: 'portrait'` or `'any'` (depending on use case)
- `theme_color` and `background_color` (match your branding)
- Icons: 192x192, 512x512 minimum (generate with @vite-pwa/assets-generator)
## PWA-Specific Gotchas
| Issue | Cause | Solution |
|-------|-------|----------|
| Service worker updates not detected | Browser caches service worker | Use vite-plugin-pwa's built-in update prompt or auto-reload feature |
| Large IndexedDB slows startup | Too many Blobs loaded on init | Lazy load images, only fetch when needed |
| PWA not installable on iOS | Missing icons or manifest issues | Generate all required icon sizes, verify manifest validation |
| Images fail to store | Quota exceeded | Compress images before storage, implement soft delete |
| Service worker conflicts | Multiple service workers registered | Ensure only one service worker is active (vite-plugin-pwa handles this) |
## Testing Considerations
- Mock `window.indexedDB` in tests using `fake-indexeddb` or use Vitest's environment with jsdom
- Test offline scenarios by mocking `navigator.onLine`
- Test service worker registration with `@vite-pwa/testing` utilities
- Test Blob storage with actual Blob objects (not base64 strings)
## Sources
- **React 19**: https://react.dev - Latest React documentation (HIGH confidence)
- **Vite**: https://vitejs.dev - Official Vite documentation, current version 8.0.2 (HIGH confidence)
- **Dexie.js**: https://dexie.org - Official Dexie documentation, current version 4.4.1 (HIGH confidence)
- **Dexie React Tutorial**: https://dexie.org/docs/Tutorial/React - Official React integration guide (HIGH confidence)
- **vite-plugin-pwa**: https://github.com/vite-pwa/vite-plugin-pwa - Official GitHub repo, latest v1.2.0 (HIGH confidence)
- **Tailwind CSS 4**: https://tailwindcss.com - Official documentation (HIGH confidence)
- **react-hook-form**: https://react-hook-form.com - Official documentation (HIGH confidence)
- **date-fns**: https://date-fns.org - Official documentation (HIGH confidence)
- **Vitest**: https://vitest.dev - Official documentation (HIGH confidence)
- **Testing Library**: https://testing-library.com/react - Official React Testing Library docs (HIGH confidence)
- **IndexedDB MDN**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API - MDN Web Docs (HIGH confidence)
- **npm registry**: Verified all package versions via npm view commands (HIGH confidence)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
