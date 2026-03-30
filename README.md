# Binkashi

A single-user offline-first Progressive Web App (PWA) for tracking bokashi compost bins. Manage multiple bins, track their state, capture photos, and keep your composting organized—all from your mobile device without an internet connection.

## Features

- 🗑️ **Bin Management**: Create, edit, and delete bokashi compost bins
- 📷 **Image Capture**: Add photos using your phone's camera or upload from gallery
- 🔄 **State Transitions**: Track bin states (Empty → In Use → Fermenting) with automatic date handling
- 📅 **Date Tracking**: Set in-use and fermenting start dates
- 📊 **Days in Use**: View calculated days for bins in use (helps track fermentation progress)
- 🔢 **Sorting**: Sort bins by name, state, date, or days in use
- 🎨 **Earthy Color Palette**: Warm, nature-inspired design with Soft Linen backgrounds and Sky Surge accents
- 💾 **Offline-First**: Works without internet after first visit
- 📱 **PWA Installable**: Install on mobile devices for quick access
- 🎯 **Mobile-First Design**: Optimized for use in the garden or shed

## Tech Stack

- **Frontend**: React 19.2.4 + TypeScript 6.0.2
- **Build Tool**: Vite 8.0.3
- **Database**: IndexedDB via Dexie.js 4.4.1
- **Styling**: Tailwind CSS 4.2.2
- **PWA**: vite-plugin-pwa 1.2.0 + Workbox 7.4.0
- **Routing**: react-router-dom 7.13.2

## Installation for Users

### Access the App

The app is accessible through its deployment URL (when deployed) or locally for development.

### Install as PWA (Mobile)

**iOS (iPhone/iPad):**
1. Open Safari and navigate to the app URL
2. Tap the **Share** button (square with arrow up)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** in the top-right corner
5. The app icon will appear on your home screen

**Android:**
1. Open Chrome and navigate to the app URL
2. Tap the **Menu** button (three dots)
3. Tap **Add to Home Screen** or **Install App**
4. Tap **Add** or **Install**
5. The app icon will appear on your home screen

### Requirements

- Modern browser (Chrome, Safari, Edge, Firefox)
- Internet connection for first visit (to cache the app)
- Camera permissions (for capturing bin photos)
- Storage space (for storing bin images)

## Usage Guide

### Creating a Bin

1. Tap the **+ Add Bin** button
2. Enter a **bin name** (e.g., "Kitchen Bin", "Garden Bin")
3. Select the **state**:
   - **Empty**: Bin is ready to be filled
   - **In Use**: Bin is currently being filled
   - **Fermenting**: Bin is sealed and fermenting
4. Optional: Set **In Use Start Date** (when you started filling the bin)
5. Optional: Set **Fermenting Start Date** (when you sealed the bin)
6. Add an **image**:
   - Tap **Camera** to capture a photo using your phone's camera
   - Tap **Upload** to select an image from your gallery
7. Tap **Create Bin** button
8. Success! The bin appears in your list with a thumbnail

### Editing a Bin

1. Tap the **Edit** button on any bin card (blue button)
2. Update any fields:
   - Bin name
   - State (dates will auto-clear if changed to "Empty")
   - Start dates
   - Image (capture new or upload replacement)
3. Tap **Save Changes** button
4. Changes persist across app restarts

### Changing Bin State

When changing a bin's state:
- **Empty → In Use**: Set the **In Use Start Date**
- **In Use → Fermenting**: Set the **Fermenting Start Date**
- **Any → Empty**: Both dates are automatically cleared (ready for new cycle)

### Sorting Bins

Use the **Sort By** dropdown to reorder your bins:
- **Name**: Sort alphabetically (A-Z)
- **State**: Group by state (Empty, In Use, Fermenting)
- **Created**: Newest bins first
- **In Use Date**: Bins with in-use dates first
- **Fermenting Date**: Bins with fermenting dates first
- **Days in Use**: Most days in use first (descending)

### Viewing Images

- **Thumbnail**: See a preview of the bin image on the card
- **Full-size**: Tap the thumbnail to view the full image
- **Close**: Tap outside the image or press **Escape** to close

### Deleting a Bin

1. Tap the **Delete** button on a bin card
2. Confirm deletion (if prompted)
3. The bin is removed from your list
4. Image storage is freed up

### Offline Use

The app works without internet after your first visit:
1. Load the app with internet once (to cache assets)
2. Go offline (airplane mode, no WiFi, etc.)
3. Refresh the page
4. All features work normally
5. Create new bins, edit existing ones
6. Reconnect internet later—no data is lost

## Features in Detail

### Earthy Colour Palette

The app uses a warm, nature-inspired color scheme designed to align with composting themes:

- **Soft Linen (#f1e9db)** - Background color across the entire app
- **Black (#07020d)** - Main text color for high readability
- **Sky Surge (#5db7de)** - Primary button and accent color
- **Khaki Beige (#a39b8b)** - Border color for cards and containers
- **Dim Grey (#716a5c)** - Secondary text color for labels

All UI elements consistently use this palette for a cohesive visual experience that feels natural and professional.

### Days in Use Calculation

Bin cards automatically display "Days in Use" to help you track fermentation progress:

- **Calculates** days from inUseStartDate to current date
- **Shows 0** for bins in Empty state (ready for new cycle)
- **Handles** null dates gracefully (shows 0)
- **Updates** dynamically as time passes
- **Prevents** negative values for future dates

This feature helps you monitor bin usage patterns and plan your composting schedule effectively.

### Offline Support

- Service worker caches app assets (JS, CSS, icons)
- All data stored locally in IndexedDB
- Create, edit, delete bins without internet
- Images stored as Blobs (not external URLs)
- Persistent storage requested to prevent Safari 7-day eviction

### Image Capture

- **Camera**: Native camera access with `<input type="file" capture="environment">`
- **Gallery**: File picker with `<input type="file" accept="image/*">`
- **Compression**: Images automatically compressed to ~500KB for storage efficiency
- **Quality**: Max 1200px width (maintains detail while reducing size)
- **Display**: Efficient Blob-to-URL conversion with memory leak protection

### State Transitions

Automatic date clearing when state changes to "Empty":
```typescript
Empty → In Use → Fermenting → Empty
```

### Responsive Design

- **Mobile**: Single column, touch-friendly (44px minimum targets)
- **Tablet**: 2 columns, larger touch targets
- **Desktop**: 3-4 columns, spacious layout

### Visual Feedback

- Toast notifications for success/error messages (centered at top of screen)
- Loading states during image compression
- Empty state when no bins exist
- Smooth transitions and animations
- Centered toast positioning for better mobile visibility

## Troubleshooting

### Storage Quota Exceeded

**Problem**: Can't create bins or upload images

**Solution**:
1. Delete old bins you no longer need
2. Remove images from bins (edit → remove image)
3. Clear browser data (warning: deletes all bins)
4. Use smaller image files

**Prevention**: Images are automatically compressed to ~500KB each

### Camera Permission Denied

**Problem**: Can't capture photos from camera

**Solution**:
1. Check browser settings: Site settings → Camera → Allow
2. Refresh the page
3. Try using the "Upload" option instead (gallery)
4. Ensure you're using HTTPS (required for camera access)

**iOS Safari**:
- Settings → Safari → Camera → Ask/Allow
- Or Settings → Privacy → Camera → Browser app

**Android Chrome**:
- Settings → Site Settings → Camera → Allow
- Tap the lock icon in address bar → Camera → Allow

### Images Not Loading

**Problem**: Image thumbnails or full-size images show blank/error

**Solution**:
1. Check internet connection (first load requires internet)
2. Refresh the page to retry loading
3. Check browser permissions (camera, storage)
4. Clear browser cache and reload
5. Verify image file format (JPEG, PNG, WebP supported)

### Offline Not Working

**Problem**: App shows error when offline

**Solution**:
1. Visit the app with internet first (to cache service worker)
2. Refresh the page to ensure service worker is active
3. Check browser developer tools:
   - Console for errors
   - Application → Service Workers to verify status
4. Clear cache and reload the app with internet
5. Verify PWA manifest is loading correctly

### PWA Not Installable

**Problem**: "Add to Home Screen" option doesn't appear

**Solution**:
1. Ensure site is served over HTTPS
2. Visit the site with internet at least once
3. Verify PWA manifest is loading (DevTools → Application → Manifest)
4. Check for required icon sizes (192x192, 512x512)
5. Refresh the page
6. Try incognito/private mode (rules out extension conflicts)

### Bin Not Saving

**Problem**: Create/edit bin doesn't persist

**Solution**:
1. Check for error toast messages
2. Verify all required fields are filled (name is required)
3. Check browser console for errors
4. Ensure IndexedDB is enabled (DevTools → Application → IndexedDB)
5. Clear browser data and reload (warning: deletes all bins)

### Image Upload Fails

**Problem**: Can't upload or capture image

**Solution**:
1. Check file size (should be under 50MB before compression)
2. Verify file type (image/jpeg, image/png, image/webp)
3. Check browser permissions (camera, storage)
4. Try a different image file
5. Clear browser cache and retry

### Date Input Issues

**Problem**: Date fields not working or showing wrong format

**Solution**:
1. Dates are stored in DD/MM/YYYY format (UK/European style)
2. Use the browser's native date picker (tap the date field)
3. Dates are optional unless you need to track them
4. Dates auto-clear when state changes to "Empty"

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (comes with Node.js)
- Git (for cloning the repository)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/binkashi.git
   cd binkashi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   - Visit `http://localhost:5173` in your browser
   - Or use the QR code in the terminal (if available)

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Tests the production build locally at `http://localhost:4173`.

### Linting

```bash
npm run lint
```

Checks code for potential issues and style violations.

### Project Structure

```
binkashi/
├── src/
│   ├── components/       # React components (BinCard, BinForm, etc.)
│   ├── db/              # IndexedDB schema and utilities
│   ├── hooks/           # Custom React hooks (useBinActions, etc.)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (dates, errors, compression)
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets (PWA icons, manifest)
├── .planning/           # Project planning and documentation
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

### Key Technologies

- **Dexie.js**: IndexedDB wrapper for local data storage
- **vite-plugin-pwa**: PWA configuration and service worker generation
- **react-hook-form**: Form state management (if used)
- **date-fns**: Date manipulation and formatting
- **Tailwind CSS**: Utility-first styling

### Development Tips

1. **Service Worker Testing**:
   - Use Chrome DevTools → Application → Service Workers
   - "Update on reload" for faster iteration
   - "Bypass for network" to test offline behavior

2. **IndexedDB Inspection**:
   - DevTools → Application → IndexedDB
   - View stored bins and images
   - Delete data for testing

3. **PWA Testing**:
   - Chrome DevTools → Application → Manifest
   - Verify all required fields are present
   - Test install prompt on mobile devices

4. **Performance Testing**:
   - Lighthouse audit (DevTools → Lighthouse)
   - Check load times and image sizes
   - Test with 50+ bins

## Contributing

Contributions are welcome! Here's how to get started:

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use functional components with hooks
- Write clear, self-documenting code
- Add comments for complex logic

### Testing

1. Test all workflows:
   - Create bin
   - Edit bin
   - Delete bin
   - Change state
   - Add/edit images
   - Sort bins
   - Offline use

2. Test cross-browser:
   - Chrome (desktop and Android)
   - Safari (macOS and iOS)
   - Edge (desktop)
   - Firefox (desktop)

3. Test responsive design:
   - Mobile (375px and up)
   - Tablet (768px and up)
   - Desktop (1024px and up)

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

## Performance

### Benchmarks

- **Page Load Time** (10 bins): < 2s
- **Page Load Time** (50 bins): < 3s
- **Image Compression**: ~500KB max per image
- **Storage per Bin**: ~500KB (with image)
- **Storage without Image**: ~1KB

### Optimization Features

- Image compression (Canvas API)
- Lazy loading for images
- Service worker asset caching
- IndexedDB efficient querying
- React memoization where needed

## Known Limitations

- Single-user only (no sharing)
- No cloud sync (offline-first design)
- Images stored locally (not backed up to cloud)
- No data export/import (deferred to v2)
- No analytics or notifications

## Browser Support

- Chrome 90+ (desktop and Android)
- Safari 14+ (macOS and iOS)
- Edge 90+
- Firefox 88+

## License

[Add your license here]

## Version History

### v1.1.0 (March 2026)

**UI Visual Enhancements Milestone**

✨ New Features:
- Added Days in Use calculation and display on bin cards
- Added sorting by "Days in Use" (descending order)
- Implemented centered toast notifications for improved mobile UX
- Applied earthy colour palette across entire app

🎨 Visual Improvements:
- Soft Linen (#f1e9db) backgrounds for warm, natural feel
- Sky Surge (#5db7de) buttons and accents
- Consistent color usage across all components
- Enhanced visual hierarchy with proper contrast

✅ Quality:
- 100% cross-browser compatibility (Chrome, Safari, Edge, Firefox)
- Performance targets met (load times < 2s, smooth 60fps animations)
- All regression tests passed (no v1.0 feature breakage)
- Comprehensive UAT completed and approved

### v1.0.0 (Initial Release)

Core features including:
- Bin CRUD operations
- Image capture and storage
- State transitions
- Date tracking
- Offline-first PWA support
- Multiple sorting options

## Support

For issues, questions, or feedback:
- [GitHub Issues](https://github.com/yourusername/binkashi/issues)
- [Documentation](https://github.com/yourusername/binkashi/wiki)

---

Made with ❤️ for composting enthusiasts
