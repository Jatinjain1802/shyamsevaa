/**
 * SLUGIFY UTILITIES
 * 
 * These functions help create SEO-friendly URLs by converting titles into "slugs"
 * 
 * Example:
 * "Siddhivinayak Temple, Mumbai!" → "siddhivinayak-temple-mumbai-3"
 */

/**
 * LEARNING: Slugify Function
 * Converts any string into a URL-friendly slug
 * 
 * @param {string} text - The text to convert
 * @returns {string} - URL-friendly slug
 * 
 * Example:
 * slugify("Ganesh Chaturthi Puja!") → "ganesh-chaturthi-puja"
 */
export function slugify(text) {
    if (!text) return '';

    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')                                    // Replace spaces with -
        .replace(/[^\p{L}\p{N}\-]/gu, '')                        // Remove all non-word chars (compatible with Unicode)
        .replace(/\-\-+/g, '-')                                  // Replace multiple - with single -
        .replace(/^-+/, '')                                      // Trim - from start
        .replace(/-+$/, '');                                     // Trim - from end
}

/**
 * LEARNING: Generate Unique Slug (WITH ID)
 * Combines title with ID to ensure uniqueness
 * Use this if you DON'T have slugs in your database
 * 
 * @param {string} title - The title to slugify
 * @param {string|number} id - The unique ID
 * @returns {string} - Complete slug with ID
 * 
 * Example:
 * generateSlug("Siddhivinayak Temple", 3) → "siddhivinayak-temple-3"
 * generateSlug("Ganesh Puja", "abc123") → "ganesh-puja-abc123"
 */
export function generateSlug(title, id) {
    const titleSlug = slugify(title);
    return `${titleSlug}-${id}`;
}

/**
 * LEARNING: Generate Pure Slug (WITHOUT ID) - NEW!
 * Creates a clean slug without ID
 * Use this if you HAVE slugs stored in your database
 * 
 * @param {string} title - The title to slugify
 * @returns {string} - Clean slug without ID
 * 
 * Example:
 * generatePureSlug("Siddhivinayak Temple, Mumbai") → "siddhivinayak-temple-mumbai"
 */
export function generatePureSlug(title) {
    return slugify(title);
}

/**
 * LEARNING: Use Slug from Database - NEW!
 * If your backend provides a slug field, use it directly
 * This is the BEST approach for clean URLs
 * 
 * @param {object} item - The item with slug field
 * @returns {string} - The slug from database or generated from title
 * 
 * Example:
 * useSlugFromDatabase({ slug: "siddhivinayak-temple" }) → "siddhivinayak-temple"
 * useSlugFromDatabase({ title: "Ganesh Puja", id: 3 }) → "ganesh-puja-3" (fallback)
 */
export function useSlugFromDatabase(item) {
    // If backend provides slug, use it
    if (item.slug) {
        return item.slug;
    }

    // Fallback: generate slug with ID
    return generateSlug(item.title, item.id);
}

/**
 * LEARNING: Extract ID from Slug
 * Gets the ID from the end of a slug (for numeric IDs)
 * 
 * @param {string} slug - The slug to extract from
 * @returns {string|null} - The extracted ID or null
 * 
 * Example:
 * extractIdFromSlug("siddhivinayak-temple-3") → "3"
 * extractIdFromSlug("ganesh-puja-12") → "12"
 */
export function extractIdFromSlug(slug) {
    if (!slug) return null;

    // Split by hyphen and get the last part
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];

    // Check if it's a number (for numeric IDs)
    if (/^\d+$/.test(lastPart)) {
        return lastPart;
    }

    return null;
}

/**
 * LEARNING: Get Slug or ID - NEW!
 * Returns the slug if it doesn't end with a number, otherwise extracts the ID
 * Use this when transitioning from ID-based to slug-based URLs
 * 
 * @param {string} slugOrId - The slug parameter from URL
 * @returns {object} - { type: 'slug' | 'id', value: string }
 * 
 * Example:
 * getSlugOrId("siddhivinayak-temple") → { type: 'slug', value: 'siddhivinayak-temple' }
 * getSlugOrId("siddhivinayak-temple-3") → { type: 'id', value: '3' }
 */
export function getSlugOrId(slugOrId) {
    const id = extractIdFromSlug(slugOrId);

    if (id) {
        return { type: 'id', value: id };
    }

    return { type: 'slug', value: slugOrId };
}

/**
 * LEARNING: Extract MongoDB ObjectId from Slug
 * Gets the MongoDB ObjectId from the end of a slug
 * Use this if your backend uses MongoDB with ObjectIds
 * 
 * @param {string} slug - The slug to extract from
 * @returns {string|null} - The extracted ObjectId or null
 * 
 * Example:
 * extractIdFromSlugMongo("ganesh-puja-507f1f77bcf86cd799439011") → "507f1f77bcf86cd799439011"
 */
export function extractIdFromSlugMongo(slug) {
    if (!slug) return null;

    // Split by hyphen and get the last part
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];

    // Check if it's a valid MongoDB ObjectId (24 hexadecimal characters)
    if (/^[a-f\d]{24}$/i.test(lastPart)) {
        return lastPart;
    }

    return null;
}

/**
 * LEARNING: Truncate Long Slugs
 * Limits slug length for very long titles
 * 
 * @param {string} slug - The slug to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} - Truncated slug
 * 
 * Example:
 * truncateSlug("very-long-temple-name-with-many-words", 20) → "very-long-temple-nam"
 */
export function truncateSlug(slug, maxLength = 50) {
    if (!slug || slug.length <= maxLength) return slug;

    // Truncate and remove trailing hyphen if any
    return slug.substring(0, maxLength).replace(/-+$/, '');
}

/**
 * LEARNING: Generate Slug with Truncation
 * Combines slugify with truncation for very long titles
 * 
 * @param {string} title - The title to slugify
 * @param {string|number} id - The unique ID
 * @param {number} maxLength - Maximum slug length before ID (default: 50)
 * @returns {string} - Truncated slug with ID
 * 
 * Example:
 * generateSlugWithLimit("Very Long Temple Name With Many Words", 3, 20)
 * → "very-long-temple-nam-3"
 */
export function generateSlugWithLimit(title, id, maxLength = 50) {
    const titleSlug = slugify(title);
    const truncated = truncateSlug(titleSlug, maxLength);
    return `${truncated}-${id}`;
}
