# 🔗 Implementing URL Slugs - Complete Guide

## What are Slugs?

A **slug** is a URL-friendly version of a title or name. It's used to create clean, readable, and SEO-friendly URLs.

### Examples:

**Current (ID-based URLs):**
- ❌ `http://localhost:5173/temples/3`
- ❌ `http://localhost:5173/poojas/12`
- ❌ `http://localhost:5173/chadawas/5`

**Better (Slug-based URLs):**
- ✅ `http://localhost:5173/temples/siddhivinayak-temple-mumbai`
- ✅ `http://localhost:5173/poojas/ganesh-chaturthi-puja`
- ✅ `http://localhost:5173/chadawas/prasad-offering`

---

## 📚 Benefits of Using Slugs

1. **SEO Friendly** - Search engines prefer descriptive URLs
2. **User Friendly** - Users can understand what the page is about
3. **Shareable** - URLs are more meaningful when shared
4. **Professional** - Looks more polished and modern
5. **Memorable** - Easier to remember than numbers

---

## 🛠️ Implementation Steps

### **Step 1: Create Slug Utility Function**

Create a file: `client/src/utils/slugify.js`

```javascript
/**
 * LEARNING: Slugify Function
 * Converts a string into a URL-friendly slug
 * 
 * Example:
 * "Siddhivinayak Temple, Mumbai" → "siddhivinayak-temple-mumbai"
 */

export function slugify(text) {
    if (!text) return '';
    
    return text
        .toString()                     // Convert to string
        .toLowerCase()                  // Convert to lowercase
        .trim()                         // Remove whitespace from both ends
        .replace(/\s+/g, '-')          // Replace spaces with -
        .replace(/[^\w\-]+/g, '')      // Remove all non-word chars except -
        .replace(/\-\-+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')            // Trim - from start
        .replace(/-+$/, '');           // Trim - from end
}

/**
 * LEARNING: Generate Unique Slug
 * Combines title with ID to ensure uniqueness
 * 
 * Example:
 * generateSlug("Siddhivinayak Temple", 3) → "siddhivinayak-temple-3"
 */

export function generateSlug(title, id) {
    const titleSlug = slugify(title);
    return `${titleSlug}-${id}`;
}

/**
 * LEARNING: Extract ID from Slug
 * Gets the ID from the end of a slug
 * 
 * Example:
 * extractIdFromSlug("siddhivinayak-temple-3") → "3"
 */

export function extractIdFromSlug(slug) {
    if (!slug) return null;
    
    // Get the last part after the last hyphen
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    
    // Check if it's a number
    if (/^\d+$/.test(lastPart)) {
        return lastPart;
    }
    
    return null;
}

/**
 * LEARNING: Alternative - Extract ID from Slug (MongoDB ObjectId)
 * If your backend uses MongoDB ObjectIds, use this instead
 */

export function extractIdFromSlugMongo(slug) {
    if (!slug) return null;
    
    // MongoDB ObjectId is 24 characters
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (/^[a-f\d]{24}$/i.test(lastPart)) {
        return lastPart;
    }
    
    return null;
}
```

---

### **Step 2: Update Backend (Optional but Recommended)**

Add a `slug` field to your database models:

**Temple Model Example:**
```javascript
const templeSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        unique: true,
        index: true
    },
    // ... other fields
});

// Generate slug before saving
templeSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title) + '-' + this._id;
    }
    next();
});
```

**Or generate slug on the fly in your API:**
```javascript
// GET /api/temples/:slug
router.get('/temples/:slug', async (req, res) => {
    const { slug } = req.params;
    
    // Extract ID from slug
    const id = extractIdFromSlug(slug);
    
    // Find temple by ID
    const temple = await Temple.findById(id);
    
    res.json({ data: temple });
});
```

---

### **Step 3: Update Frontend Routes**

**Current Routes:**
```javascript
<Route path="/temples/:id" element={<TempleDetail />} />
<Route path="/poojas/:poojaId" element={<PoojaDetail />} />
<Route path="/chadawas/:chadawaId" element={<ChadawaDetail />} />
```

**New Routes (with slug):**
```javascript
<Route path="/temples/:slug" element={<TempleDetail />} />
<Route path="/poojas/:slug" element={<PoojaDetail />} />
<Route path="/chadawas/:slug" element={<ChadawaDetail />} />
```

**Note:** The route stays the same! We just change how we use the parameter.

---

### **Step 4: Update Card Links**

**File: `client/src/pages/users/Temples.jsx`**

**Before:**
```javascript
<UnifiedCard
    key={t.id}
    link={`/temples/${t.id}`}  // ❌ Using ID
    // ... other props
/>
```

**After:**
```javascript
import { generateSlug } from '../../utils/slugify';

<UnifiedCard
    key={t.id}
    link={`/temples/${generateSlug(t.title, t.id)}`}  // ✅ Using slug
    // ... other props
/>
```

**Same for Poojas.jsx:**
```javascript
import { generateSlug } from '../../utils/slugify';

<UnifiedCard
    key={p.id}
    link={`/poojas/${generateSlug(p.title, p.id)}`}  // ✅ Using slug
    // ... other props
/>
```

**Same for Chadawas.jsx:**
```javascript
import { generateSlug } from '../../utils/slugify';

<UnifiedCard
    key={c.id}
    link={`/chadawas/${generateSlug(c.title, c.id)}`}  // ✅ Using slug
    // ... other props
/>
```

---

### **Step 5: Update Detail Pages**

**File: `client/src/pages/users/TempleDetail.jsx`**

**Before:**
```javascript
import { useParams } from 'react-router-dom';

export default function TempleDetail() {
    const { id } = useParams();  // ❌ Getting ID
    
    useEffect(() => {
        const fetchTemple = async () => {
            const res = await api.get(`/temples/${id}`);  // ❌ Using ID
            // ...
        };
        fetchTemple();
    }, [id]);
}
```

**After:**
```javascript
import { useParams } from 'react-router-dom';
import { extractIdFromSlug } from '../../utils/slugify';

export default function TempleDetail() {
    const { slug } = useParams();  // ✅ Getting slug
    const id = extractIdFromSlug(slug);  // ✅ Extract ID from slug
    
    useEffect(() => {
        const fetchTemple = async () => {
            const res = await api.get(`/temples/${id}`);  // ✅ Using extracted ID
            // ...
        };
        fetchTemple();
    }, [id]);
}
```

**Same pattern for:**
- `PoojaDetail.jsx`
- `ChadawaDetail.jsx`
- `TempleChadawas.jsx`

---

## 🎯 Complete Example

### **1. Create Utility File**

**File: `client/src/utils/slugify.js`**
```javascript
export function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function generateSlug(title, id) {
    const titleSlug = slugify(title);
    return `${titleSlug}-${id}`;
}

export function extractIdFromSlug(slug) {
    if (!slug) return null;
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart)) {
        return lastPart;
    }
    return null;
}
```

---

### **2. Update Temples.jsx**

```javascript
import { generateSlug } from '../../utils/slugify';

// In the map function:
{filteredTemples.map((t) => (
    <UnifiedCard
        key={t.id}
        image={t.image}
        title={t.title}
        location={t.city && t.state ? `${t.city}, ${t.state}` : t.city || t.state}
        description={t.description}
        link={`/temples/${generateSlug(t.title, t.id)}`}  // ✅ Using slug
        buttonText="View Temple"
    />
))}
```

---

### **3. Update TempleDetail.jsx**

```javascript
import { useParams } from 'react-router-dom';
import { extractIdFromSlug } from '../../utils/slugify';

export default function TempleDetail() {
    const { slug } = useParams();  // Changed from 'id' to 'slug'
    const templeId = extractIdFromSlug(slug);  // Extract ID
    
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemple = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/temples/${templeId}`);  // Use extracted ID
                setTemple(res.data.data);
            } catch (err) {
                console.error("Failed to load temple", err);
            } finally {
                setLoading(false);
            }
        };

        if (templeId) {  // Only fetch if we have a valid ID
            fetchTemple();
        }
    }, [templeId]);

    // ... rest of component
}
```

---

### **4. Update Routes (AppRoutes.jsx)**

**Change parameter names for clarity:**

```javascript
<Route path="/temples/:slug" element={<TempleDetail />} />
<Route path="/poojas/:slug" element={<PoojaDetail />} />
<Route path="/chadawas/:slug" element={<ChadawaDetail />} />
<Route path="/temples/:slug/chadawas" element={<TempleChadawas />} />
```

---

## 🧪 Testing

### **Test URLs:**

1. **Temple:**
   - Old: `http://localhost:5173/temples/3`
   - New: `http://localhost:5173/temples/siddhivinayak-temple-3`

2. **Pooja:**
   - Old: `http://localhost:5173/poojas/12`
   - New: `http://localhost:5173/poojas/ganesh-chaturthi-puja-12`

3. **Chadawa:**
   - Old: `http://localhost:5173/chadawas/5`
   - New: `http://localhost:5173/chadawas/prasad-offering-5`

### **Test Checklist:**

- [ ] Click on a temple card
- [ ] Check URL in browser (should show slug)
- [ ] Verify page loads correctly
- [ ] Check breadcrumb navigation
- [ ] Test direct URL access (copy/paste slug URL)
- [ ] Test with special characters in title
- [ ] Test with very long titles
- [ ] Test browser back/forward buttons

---

## 📚 How Slugs Work

### **Example Breakdown:**

**Title:** `"Siddhivinayak Temple, Mumbai!"`
**ID:** `3`

**Step-by-step transformation:**

1. **Original:** `"Siddhivinayak Temple, Mumbai!"`
2. **Lowercase:** `"siddhivinayak temple, mumbai!"`
3. **Trim:** `"siddhivinayak temple, mumbai!"`
4. **Replace spaces:** `"siddhivinayak-temple,-mumbai!"`
5. **Remove special chars:** `"siddhivinayak-temple-mumbai"`
6. **Add ID:** `"siddhivinayak-temple-mumbai-3"`

**Final Slug:** `siddhivinayak-temple-mumbai-3`

---

## 🎯 Advanced: Backend Slug Support

If you want to store slugs in the database:

### **1. Add Slug Field to Model**

```javascript
const templeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { 
        type: String, 
        unique: true,
        index: true  // For faster queries
    },
    // ... other fields
});
```

### **2. Generate Slug on Save**

```javascript
templeSchema.pre('save', async function(next) {
    if (this.isModified('title')) {
        // Generate base slug
        let baseSlug = slugify(this.title);
        let slug = baseSlug;
        let counter = 1;
        
        // Check for duplicates
        while (await mongoose.models.Temple.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        
        this.slug = slug;
    }
    next();
});
```

### **3. Update API Endpoint**

```javascript
// GET /api/temples/:slug
router.get('/temples/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Try to find by slug first
        let temple = await Temple.findOne({ slug });
        
        // Fallback to ID (for backward compatibility)
        if (!temple) {
            temple = await Temple.findById(slug);
        }
        
        if (!temple) {
            return res.status(404).json({ message: 'Temple not found' });
        }
        
        res.json({ data: temple });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
```

---

## 💡 Best Practices

1. **Always include ID in slug** - Ensures uniqueness
2. **Keep slugs short** - Truncate very long titles
3. **Use hyphens** - Not underscores (SEO best practice)
4. **Lowercase only** - Easier to type and remember
5. **Remove special characters** - Avoid encoding issues
6. **Index slug field** - For faster database queries
7. **Handle duplicates** - Add numbers if needed

---

## 🚀 Summary

**What you'll implement:**

1. ✅ Create `slugify.js` utility file
2. ✅ Update card links to use `generateSlug()`
3. ✅ Update detail pages to use `extractIdFromSlug()`
4. ✅ Update route parameter names (optional)
5. ✅ Test all URLs

**Result:**
- ✅ SEO-friendly URLs
- ✅ User-friendly URLs
- ✅ Professional appearance
- ✅ Better shareability

**Your URLs will transform from:**
`/temples/3` → `/temples/siddhivinayak-temple-mumbai-3` 🎉
