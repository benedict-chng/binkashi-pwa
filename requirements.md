Build a complete React-based Progressive Web App (PWA) called **“Binkashi”** for tracking bokashi compost bins.

## 🧱 Tech Stack Requirements

* React (functional components + hooks)
* Vite (preferred) or Create React App
* PWA support (service worker + manifest)
* IndexedDB for storage using Dexie.js
* No backend (fully client-side)
* Must be deployable to Cloudflare Pages

---

## 📦 Core Features

### 1. Data Model

Each bin must contain:

* `id` (string, UUID)
* `name` (string)
* `state` (enum: "Empty" | "In Use" | "Fermenting")
* `inUseStartDate` (ISO string, nullable)
* `fermentingStartDate` (ISO string, nullable)
* `image` (Blob or base64 string)

---

### 2. Storage

* Use IndexedDB via Dexie.js
* Store bins in a table called `bins`
* Images must be stored inside IndexedDB (Blob preferred)

---

### 3. UI Requirements

#### Main Screen

* List all bins
* Display:

  * Name
  * State
  * Dates (if present)
  * Thumbnail image
* Buttons:

  * “Add Bin”
  * “Export Data”
  * “Import Data”

#### Add/Edit Bin Screen

* Form fields:

  * Name (text)
  * State (dropdown)
  * In Use Start Date (date picker)
  * Fermenting Start Date (date picker)
  * Image upload (camera or file picker)
* Save + Cancel buttons

---

### 4. State Transitions Logic

Enforce valid transitions:

* Empty → In Use

  * Set `inUseStartDate`
* In Use → Fermenting

  * Set `fermentingStartDate`
* Fermenting → Empty

  * Clear both dates

Prevent invalid transitions in UI.

---

### 5. Image Handling

* Allow upload from device camera or file system
* Store as Blob in IndexedDB
* Display preview thumbnails in list and full image in edit screen

---

### 6. Import / Export

#### Export:

* Export all bins as a JSON file
* Images must be converted to base64 for export
* Trigger download (`binkashi-export.json`)

#### Import:

* Upload JSON file
* Restore all bins into IndexedDB
* Convert base64 back to Blob
* Overwrite existing data (with confirmation)

---

### 7. PWA Requirements

* Add `manifest.json`
* Register service worker for offline usage
* App must be installable on mobile
* Cache static assets

---

### 8. Project Structure

* Clean folder structure:

  * components/
  * pages/
  * db/
  * utils/
* Separate IndexedDB logic into a dedicated module

---

### 9. Cloudflare Pages Deployment

* Ensure project builds with `npm run build`
* Output directory should be `dist`
* Include instructions for deploying to Cloudflare Pages
* Ensure routing works for SPA (fallback to index.html)

---

## 🎨 UX Expectations

* Simple, clean UI (no heavy styling required)
* Mobile-first design
* Fast and responsive
* Minimal dependencies

---

## 🧪 Bonus (if possible)

* Add simple validation
* Add confirmation dialogs for destructive actions
* Add lightweight toast notifications

---

## 📄 Deliverables

* Full working codebase
* Setup instructions
* Run instructions
* Deployment instructions (Cloudflare Pages)

---

Focus on simplicity, maintainability, and a clean developer experience. This is a single-user offline-first app.
