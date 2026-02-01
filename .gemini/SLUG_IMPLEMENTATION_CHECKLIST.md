# ✅ Slug Implementation Checklist

## Quick Start Guide

Follow these steps to implement slugs in your application.

---

## 📋 Implementation Steps

### ✅ **Step 1: Utility File Created**
- [x] Created `client/src/utils/slugify.js`
- Contains all slug utility functions

---

### ⬜ **Step 2: Update Temples.jsx**

**File:** `client/src/pages/users/Temples.jsx`

**Add import at top:**
```javascript
import { generateSlug } from '../../utils/slugify';
```

**Update the link in UnifiedCard (around line 200):**
```javascript
// BEFORE:
link={`/temples/${t.id}`}

// AFTER:
link={`/temples/${generateSlug(t.title, t.id)}`}
```

---

### ⬜ **Step 3: Update Poojas.jsx**

**File:** `client/src/pages/users/Poojas.jsx`

**Add import at top:**
```javascript
import { generateSlug } from '../../utils/slugify';
```

**Update the link in UnifiedCard:**
```javascript
// BEFORE:
link={`/poojas/${p.id}`}

// AFTER:
link={`/poojas/${generateSlug(p.title, p.id)}`}
```

---

### ⬜ **Step 4: Update Chadawas.jsx**

**File:** `client/src/pages/users/Chadawas.jsx`

**Add import at top:**
```javascript
import { generateSlug } from '../../utils/slugify';
```

**Update the link in UnifiedCard:**
```javascript
// BEFORE:
link={`/chadawas/${c.id}`}

// AFTER:
link={`/chadawas/${generateSlug(c.title, c.id)}`}
```

---

### ⬜ **Step 5: Update TempleDetail.jsx**

**File:** `client/src/pages/users/TempleDetail.jsx`

**Add import at top:**
```javascript
import { extractIdFromSlug } from '../../utils/slugify';
```

**Update useParams and API call:**
```javascript
// BEFORE:
const { id } = useParams();

useEffect(() => {
    const fetchTemple = async () => {
        const res = await api.get(`/temples/${id}`);
        // ...
    };
    fetchTemple();
}, [id]);

// AFTER:
const { slug } = useParams();  // Changed from 'id' to 'slug'
const templeId = extractIdFromSlug(slug);  // Extract ID from slug

useEffect(() => {
    const fetchTemple = async () => {
        if (!templeId) return;  // Safety check
        const res = await api.get(`/temples/${templeId}`);  // Use extracted ID
        // ...
    };
    fetchTemple();
}, [templeId]);  // Changed dependency
```

---

### ⬜ **Step 6: Update PoojaDetail.jsx**

**File:** `client/src/pages/users/PoojaDetail.jsx`

**Add import at top:**
```javascript
import { extractIdFromSlug } from '../../utils/slugify';
```

**Update useParams and API call:**
```javascript
// BEFORE:
const { poojaId } = useParams();

// AFTER:
const { slug } = useParams();
const poojaId = extractIdFromSlug(slug);
```

**Update all API calls to use `poojaId` (extracted from slug)**

---

### ⬜ **Step 7: Update ChadawaDetail.jsx**

**File:** `client/src/pages/users/ChadawaDetail.jsx`

**Add import at top:**
```javascript
import { extractIdFromSlug } from '../../utils/slugify';
```

**Update useParams and API call:**
```javascript
// BEFORE:
const { chadawaId } = useParams();

// AFTER:
const { slug } = useParams();
const chadawaId = extractIdFromSlug(slug);
```

---

### ⬜ **Step 8: Update TempleChadawas.jsx**

**File:** `client/src/pages/users/TempleChadawas.jsx`

**Add import at top:**
```javascript
import { extractIdFromSlug } from '../../utils/slugify';
```

**Update useParams:**
```javascript
// BEFORE:
const { id } = useParams();

// AFTER:
const { slug } = useParams();
const id = extractIdFromSlug(slug);
```

---

### ⬜ **Step 9: Update Routes (Optional)**

**File:** `client/src/routes/AppRoutes.jsx`

**Change parameter names for clarity:**
```javascript
// BEFORE:
<Route path="/temples/:id" element={<TempleDetail />} />
<Route path="/poojas/:poojaId" element={<PoojaDetail />} />
<Route path="/chadawas/:chadawaId" element={<ChadawaDetail />} />
<Route path="/temples/:id/chadawas" element={<TempleChadawas />} />

// AFTER:
<Route path="/temples/:slug" element={<TempleDetail />} />
<Route path="/poojas/:slug" element={<PoojaDetail />} />
<Route path="/chadawas/:slug" element={<ChadawaDetail />} />
<Route path="/temples/:slug/chadawas" element={<TempleChadawas />} />
```

---

## 🧪 Testing Checklist

After implementation, test these scenarios:

### **Temples:**
- [ ] Go to `/temples` page
- [ ] Click on a temple card
- [ ] Check URL shows slug (e.g., `/temples/siddhivinayak-temple-3`)
- [ ] Verify temple details load correctly
- [ ] Test browser back button
- [ ] Copy URL and paste in new tab - should work

### **Poojas:**
- [ ] Go to `/poojas` page
- [ ] Click on a pooja card
- [ ] Check URL shows slug
- [ ] Verify pooja details load correctly

### **Chadawas:**
- [ ] Go to `/chadawas` page
- [ ] Click on a chadawa card
- [ ] Check URL shows slug
- [ ] Verify chadawa details load correctly

### **Edge Cases:**
- [ ] Test with special characters in title (e.g., "Ganesh Puja!")
- [ ] Test with very long titles
- [ ] Test with titles containing numbers
- [ ] Test direct URL access (paste slug URL)
- [ ] Test with titles in different languages (if applicable)

---

## 🐛 Common Issues & Solutions

### **Issue 1: "Cannot read property 'id' of undefined"**
**Solution:** Add null checks:
```javascript
const templeId = extractIdFromSlug(slug);

if (!templeId) {
    // Handle error - redirect or show error message
    return <div>Invalid URL</div>;
}
```

### **Issue 2: "Page not found" when clicking cards**
**Solution:** Make sure you imported `generateSlug` correctly:
```javascript
import { generateSlug } from '../../utils/slugify';
```

### **Issue 3: Slug shows "undefined" in URL**
**Solution:** Check that the title exists:
```javascript
// Add fallback
link={`/temples/${generateSlug(t.title || 'temple', t.id)}`}
```

### **Issue 4: API returns 404**
**Solution:** Make sure you're using the extracted ID, not the slug:
```javascript
// WRONG:
const res = await api.get(`/temples/${slug}`);

// CORRECT:
const templeId = extractIdFromSlug(slug);
const res = await api.get(`/temples/${templeId}`);
```

---

## 📊 Before & After Examples

### **Temples:**
- Before: `http://localhost:5173/temples/3`
- After: `http://localhost:5173/temples/siddhivinayak-temple-mumbai-3`

### **Poojas:**
- Before: `http://localhost:5173/poojas/12`
- After: `http://localhost:5173/poojas/ganesh-chaturthi-puja-12`

### **Chadawas:**
- Before: `http://localhost:5173/chadawas/5`
- After: `http://localhost:5173/chadawas/prasad-offering-5`

---

## 🎯 Quick Reference

### **Generating Slugs (in list pages):**
```javascript
import { generateSlug } from '../../utils/slugify';

link={`/temples/${generateSlug(temple.title, temple.id)}`}
```

### **Extracting IDs (in detail pages):**
```javascript
import { extractIdFromSlug } from '../../utils/slugify';

const { slug } = useParams();
const id = extractIdFromSlug(slug);
```

---

## ✅ Completion Checklist

- [ ] Created `slugify.js` utility file
- [ ] Updated `Temples.jsx` with `generateSlug()`
- [ ] Updated `Poojas.jsx` with `generateSlug()`
- [ ] Updated `Chadawas.jsx` with `generateSlug()`
- [ ] Updated `TempleDetail.jsx` with `extractIdFromSlug()`
- [ ] Updated `PoojaDetail.jsx` with `extractIdFromSlug()`
- [ ] Updated `ChadawaDetail.jsx` with `extractIdFromSlug()`
- [ ] Updated `TempleChadawas.jsx` with `extractIdFromSlug()`
- [ ] Updated routes in `AppRoutes.jsx` (optional)
- [ ] Tested all pages
- [ ] Tested edge cases
- [ ] Verified URLs are SEO-friendly

---

## 🎉 Success!

Once all checkboxes are complete, your URLs will be:
- ✅ SEO-friendly
- ✅ User-friendly
- ✅ Professional
- ✅ Shareable

**Your application now has production-quality URLs! 🚀**
