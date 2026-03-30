# v1.1 Milestone User Acceptance Testing Checklist

**Purpose:** Verify all v1.1 visual enhancements work correctly from the user's perspective before deployment

**Testing Environment Setup:**

Before starting UAT, ensure:
- [ ] App built successfully (`npm run build`)
- [ ] App previewed successfully (`npm run preview` or visit deployed URL)
- [ ] Browser: Chrome/Safari/Edge/Firefox (note which you're using)
- [ ] Device: Mobile/Tablet/Desktop (note which you're using)

**Testing URL:** http://localhost:4173 (or deployed URL)

---

## Test Cases

### DES-01: Colour Palette Application

**Test Steps:**
1. Load app in browser (http://localhost:4173 or deployed URL)
2. Observe the overall color scheme
3. Check backgrounds, buttons, text, cards, and containers

**Expected Result:**
App displays with Soft Linen background (#f1e9db), all UI elements use the new color palette consistently

**Verification Method:** Visual inspection - backgrounds, buttons, text, cards, containers all use new palette

---

### DES-02: Specific Color Values

**Test Steps:**
1. Inspect specific UI elements using DevTools or visual inspection
2. Check main text color
3. Check secondary text color
4. Check button colors
5. Check background colors
6. Check border colors

**Expected Result:**
- Main text: Black (#07020d)
- Secondary text: Dim Grey (#716a5c)
- Buttons: Sky Surge (#5db7de)
- Backgrounds: Soft Linen (#f1e9db)
- Borders: Khaki Beige (#a39b8b)

**Verification Method:** Compare against color values in src/index.css

---

### DISP-01: Days in Use Field Display

**Test Steps:**
1. Click "Add Bin" button
2. Create a new bin with name "Test Bin"
3. Set state to "In Use"
4. Set inUseStartDate to today's date
5. Save the bin
6. Observe the bin card in the list

**Expected Result:**
Bin card displays "Days in Use: X" field where X is a number (should show "Days in Use: 0" for today)

**Verification Method:** Visual inspection of bin card after creation

---

### DISP-02: Days in Use Calculation

**Test Steps:**
1. Click "Add Bin" button
2. Create a new bin with name "10 Days Old Bin"
3. Set state to "In Use"
4. Set inUseStartDate to 10 days ago (calculate: today's date minus 10 days)
5. Save the bin
6. Observe the "Days in Use" field on the bin card

**Expected Result:**
"Days in Use" shows the correct number of days (e.g., 10)

**Verification Method:** Compare displayed days with actual date difference

---

### DISP-03: Days in Use for Empty State

**Test Steps:**
1. Click "Add Bin" button
2. Create a new bin with name "Empty Bin"
3. Set state to "Empty"
4. Leave inUseStartDate blank or set it to any date
5. Save the bin
6. Observe the "Days in Use" field on the bin card

**Expected Result:**
"Days in Use: 0" displays regardless of date values

**Verification Method:** Visual inspection shows "Days in Use: 0"

---

### UI-01: Toast Notification Positioning

**Test Steps:**
1. Click "Add Bin" button
2. Create a bin to trigger success toast
3. Alternatively, perform any action that shows a toast (delete bin, edit bin, etc.)
4. Observe where the toast notification appears

**Expected Result:**
Toast appears centered horizontally at the top of the screen (not top-right)

**Verification Method:**
- Visual inspection - toast should be centered
- Toast should not overlap with the header
- Toast should be clearly visible at the top of the viewport

---

## UAT Results

| Test Case | Test Step Summary | Expected Result | Actual Result | Status | Notes |
|-----------|------------------|-----------------|---------------|--------|-------|
| DES-01: Colour Palette Application | Load app and observe color scheme | All UI elements use new palette | | Pass/Fail | |
| DES-02: Specific Color Values | Inspect element colors | Correct hex codes used | | Pass/Fail | |
| DISP-01: Days in Use Field Display | Create bin and check display | "Days in Use: X" displays | | Pass/Fail | |
| DISP-02: Days in Use Calculation | Create bin with old date | Shows correct day count | | Pass/Fail | |
| DISP-03: Days in Use for Empty State | Create bin with Empty state | Shows "Days in Use: 0" | | Pass/Fail | |
| UI-01: Toast Notification Positioning | Trigger toast notification | Toast centered at top | | Pass/Fail | |

---

## Summary

**Total Test Cases:** 6

**Passed:** [fill in after testing]

**Failed:** [fill in after testing]

**Pass Rate:** [fill in after testing]%

---

## Issues Found

*(Leave blank if no issues)*

| Test Case | Issue Description | Severity | Suggested Resolution |
|-----------|------------------|----------|----------------------|
| | | Low/Medium/High | |

---

## Sign-off

**Date of Testing:** [fill in]

**Tester:** [fill in]

**Overall Approval:** [ ] Approve  [ ] Reject  [ ] Conditional

**Comments/Notes:**

[fill in]

**Signature:** [fill in]

---

_UAT Checklist Created: 2026-03-30_
_Phase: 05-milestone-completion, Plan: 05-01_
