# ✅ Testing Checklist

## How to Test All New Features

Use this checklist to verify all improvements are working correctly.

---

## 🧪 **Poojas.jsx Testing**

### **1. Search Functionality**
- [ ] Navigate to `/poojas` page
- [ ] Type in the search box
- [ ] Verify poojas filter in real-time
- [ ] Check results counter updates ("Showing X of Y poojas")
- [ ] Try searching for non-existent pooja
- [ ] Verify "No Poojas Found" message appears
- [ ] Click "Clear Search" button
- [ ] Verify search resets and all poojas show

**Expected Behavior:**
- Search should work instantly as you type
- Counter should update with each keystroke
- Clear button should only appear when there's text
- Empty state should show when no results found

---

### **2. Loading States**
- [ ] Refresh the page
- [ ] Observe skeleton cards while loading
- [ ] Verify 6 skeleton cards appear
- [ ] Check skeleton cards match actual card layout
- [ ] Verify smooth transition from skeleton to real cards

**Expected Behavior:**
- Skeleton cards should appear immediately
- Should show same grid layout as real cards
- Should have pulsing animation
- No layout shift when real data loads

---

### **3. Error Handling**
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Set throttling to "Offline"
- [ ] Refresh the page
- [ ] Verify error message appears
- [ ] Click "Try Again" button
- [ ] Set throttling back to "No throttling"
- [ ] Verify data loads successfully

**Expected Behavior:**
- Error UI should show with clear message
- Retry button should be visible and clickable
- Clicking retry should attempt to reload data
- Success should show poojas normally

---

### **4. Empty State**
- [ ] If you have no poojas in database, verify empty state shows
- [ ] Check icon, heading, and message are displayed
- [ ] Verify it's different from "no search results" state

**Expected Behavior:**
- Should show when database has no poojas
- Different message than search empty state
- Should have calendar icon and appropriate message

---

### **5. Responsive Design**
- [ ] Resize browser window
- [ ] Check mobile view (< 768px)
  - [ ] Search bar is full width
  - [ ] Cards stack in single column
  - [ ] Results counter is visible
- [ ] Check tablet view (768px - 1024px)
  - [ ] 2 columns of cards
  - [ ] Search bar and counter on same row
- [ ] Check desktop view (> 1024px)
  - [ ] 3-4 columns of cards
  - [ ] All elements properly aligned

**Expected Behavior:**
- Layout should adapt smoothly to all screen sizes
- No horizontal scrolling
- All text should be readable
- Touch targets should be large enough on mobile

---

## 🧪 **PoojaDetail.jsx Testing**

### **1. Breadcrumb Navigation**
- [ ] Navigate to any pooja detail page
- [ ] Verify breadcrumb shows: Home > Poojas > [Pooja Name]
- [ ] Click "Home" - should go to homepage
- [ ] Go back to pooja detail
- [ ] Click "Poojas" - should go to poojas listing
- [ ] Verify current pooja name is highlighted in breadcrumb

**Expected Behavior:**
- Breadcrumb should be visible at top
- All links should work correctly
- Current page should be highlighted
- Should truncate long pooja names

---

### **2. Share Functionality**

**On Mobile:**
- [ ] Open page on mobile device
- [ ] Click share button (top right of hero image)
- [ ] Verify native share sheet appears
- [ ] Try sharing to different apps
- [ ] Verify toast notification appears

**On Desktop:**
- [ ] Click share button
- [ ] Verify "Link copied to clipboard" toast appears
- [ ] Try pasting in notepad/text editor
- [ ] Verify correct URL is copied

**Expected Behavior:**
- Mobile: Native share dialog should open
- Desktop: Link should copy to clipboard
- Toast should appear confirming action
- Toast should auto-dismiss after 3 seconds

---

### **3. Toast Notifications**

**Test Validation Toast:**
- [ ] Scroll to bottom of page
- [ ] Click "PROCEED TO BOOK" without selecting variant
- [ ] Verify warning toast appears (yellow)
- [ ] Verify page scrolls to variants section
- [ ] Verify toast auto-dismisses after 3 seconds

**Test Share Toast:**
- [ ] Click share button
- [ ] Verify success toast appears (green)
- [ ] Wait 3 seconds
- [ ] Verify toast disappears

**Expected Behavior:**
- Toasts should appear in top-right corner
- Should have appropriate color (yellow=warning, green=success)
- Should show icon matching type
- Should auto-dismiss after 3 seconds
- Multiple toasts should stack vertically

---

### **4. Loading States**

**Main Content Loading:**
- [ ] Navigate to pooja detail page
- [ ] Observe loading spinner with message
- [ ] Verify "Loading divine details..." text shows
- [ ] Check smooth transition to content

**Similar Poojas Loading:**
- [ ] Scroll to "Similar Sacred Poojas" section
- [ ] Refresh page
- [ ] Observe skeleton cards in similar section
- [ ] Verify 4 skeleton cards appear
- [ ] Check smooth transition to real cards

**Expected Behavior:**
- Main loading should show centered spinner
- Similar poojas should show skeleton cards
- No layout shift when content loads
- Smooth fade-in animations

---

### **5. Error Handling**

**Test Main Content Error:**
- [ ] Go offline (DevTools > Network > Offline)
- [ ] Navigate to pooja detail page
- [ ] Verify error UI appears
- [ ] Check error message is clear
- [ ] Verify "Try Again" button exists
- [ ] Verify "Back to Poojas" button exists
- [ ] Go online
- [ ] Click "Try Again"
- [ ] Verify content loads

**Test Similar Poojas Error:**
- [ ] Modify code to force similar poojas error
- [ ] Verify main content still loads
- [ ] Check that error doesn't break page
- [ ] Verify console shows error (not user-facing)

**Expected Behavior:**
- Main error should show full error UI
- Should have retry and back buttons
- Similar poojas error should be silent (console only)
- Page should remain functional

---

### **6. Smooth Scrolling**
- [ ] Scroll to bottom of page
- [ ] Click "PROCEED TO BOOK" without selecting variant
- [ ] Verify page smoothly scrolls to variants section
- [ ] Check scroll is smooth, not instant jump
- [ ] Verify variants section is highlighted/visible

**Expected Behavior:**
- Should scroll smoothly (animated)
- Should scroll to variants section
- Should not jump instantly
- User should clearly see what needs attention

---

### **7. Variant Selection**
- [ ] Click different variant options
- [ ] Verify selected variant shows checkmark
- [ ] Verify border color changes
- [ ] Check sticky bottom bar updates price
- [ ] Verify variant name shows in bottom bar

**Expected Behavior:**
- Only one variant can be selected
- Selected variant should be visually distinct
- Price should update immediately
- Bottom bar should reflect selection

---

### **8. Addon Selection**
- [ ] Click addon items to select
- [ ] Verify checkmark appears on selected addons
- [ ] Click again to deselect
- [ ] Verify checkmark disappears
- [ ] Check total price updates in bottom bar
- [ ] Select multiple addons
- [ ] Verify all prices add up correctly

**Expected Behavior:**
- Multiple addons can be selected
- Each addon should toggle on/off
- Price should update with each selection
- Visual feedback should be immediate

---

### **9. Sticky Bottom Bar**
- [ ] Scroll down the page
- [ ] Verify bottom bar stays fixed at bottom
- [ ] Check it doesn't cover content
- [ ] Verify all information is visible:
  - [ ] Selected variant name
  - [ ] Total price
  - [ ] "Proceed to Book" button
  - [ ] Security message (desktop only)

**Expected Behavior:**
- Should stick to bottom while scrolling
- Should be above all content (z-index)
- Should show on all screen sizes
- Should be easily accessible

---

### **10. Similar Poojas Navigation**
- [ ] Scroll to "Similar Sacred Poojas" section
- [ ] Click on a similar pooja card
- [ ] Verify page navigates to new pooja
- [ ] Verify page scrolls to top
- [ ] Verify new pooja details load
- [ ] Check breadcrumb updates

**Expected Behavior:**
- Should navigate to clicked pooja
- Should scroll to top of page
- Should load new pooja data
- Should update URL and breadcrumb

---

## 🎨 **Visual/UI Testing**

### **General Checks**
- [ ] All fonts load correctly
- [ ] All icons display properly (Material Symbols)
- [ ] Colors match design (sindoor, marigold, etc.)
- [ ] Hover effects work on interactive elements
- [ ] Transitions are smooth
- [ ] No layout shifts during loading
- [ ] No horizontal scrolling on any screen size

### **Accessibility Checks**
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Check ARIA labels are present
- [ ] Test with screen reader (if available)
- [ ] Verify color contrast is sufficient
- [ ] Check all images have alt text

---

## 🐛 **Common Issues to Watch For**

### **Poojas.jsx**
- ❌ Search not filtering correctly
- ❌ Skeleton cards don't match layout
- ❌ Error state not showing
- ❌ Empty state showing when it shouldn't
- ❌ Results counter showing wrong numbers

### **PoojaDetail.jsx**
- ❌ Toasts not appearing
- ❌ Share not working on mobile
- ❌ Breadcrumb links broken
- ❌ Smooth scroll not working
- ❌ Price calculation wrong
- ❌ Similar poojas not loading

---

## 📱 **Device Testing**

### **Desktop Browsers**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### **Mobile Devices**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile Firefox

### **Screen Sizes**
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1919px)
- [ ] Large Desktop (1920px+)

---

## ✅ **Final Checklist**

- [ ] All features tested and working
- [ ] No console errors
- [ ] No visual bugs
- [ ] Responsive on all screen sizes
- [ ] Accessible (keyboard navigation works)
- [ ] Performance is good (no lag)
- [ ] Code is clean and commented
- [ ] Documentation is complete

---

## 🎉 **Testing Complete!**

If all items are checked, congratulations! Your improvements are working perfectly.

If you found issues:
1. Note which test failed
2. Check the console for errors
3. Review the relevant code section
4. Refer to IMPROVEMENTS_SUMMARY.md for implementation details
5. Refer to REACT_PATTERNS_GUIDE.md for pattern explanations

**Happy Testing! 🚀**
