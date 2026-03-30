# Deferred Issues - Phase 04

## Build Failure in src/index.css (Out of Scope for Plan 04-02)

**Issue**: Tailwind CSS 4 build fails with "Cannot apply unknown utility class `bg-soft-linen`"

**Details**:
- Error occurs in src/index.css due to custom utility definitions from Plan 04-01
- Custom utilities override Tailwind's built-in classes (bg-black, text-black, etc.)
- Pattern `@layer utilities` with custom color definitions conflicts with Tailwind CSS 4

**Files Involved**:
- src/index.css (modified by Plan 04-01)

**Error Message**:
```
Cannot apply unknown utility class `bg-soft-linen`
```

**Impact**:
- Full build fails, but TypeScript compilation passes
- Application functionality not affected during development (dev server works)
- Plan 04-02 changes (calculateDaysInUse, BinCard, Toast) are type-safe

**Root Cause**:
Plan 04-01 introduced custom Tailwind utilities using `@layer utilities` pattern that conflicts with Tailwind CSS 4's utility class resolution. The custom utilities attempt to override built-in classes like `bg-black` with custom colors.

**Recommended Resolution**:
Needs to be addressed in Plan 04-01 or a dedicated bug fix plan. Options:
1. Use Tailwind's official theme extension configuration (CSS variables or tailwind.config)
2. Use distinct utility names that don't conflict with built-in classes (e.g., `.bg-custom-black`)
3. Revert to standard Tailwind color palette

**Status**: Deferred - Not in scope for Plan 04-02
