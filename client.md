# 📸 Image Upload Guidelines (Admin Panel)

Welcome to the **Shyamsevaa** Admin Content Guide. To maintain a premium and consistent look across our platform, please follow these guidelines when uploading images for various sections.

---

## 🏗️ Quick Reference Table

| Section | Ideal Aspect Ratio | Recommended Size (PX) | File Format |
| :--- | :--- | :--- | :--- |
| **Temple Banners (Hero)** | 21:9 or 16:9 | 1920 x 1080 (Full HD) | WebP / JPG |
| **Puja Service Cards** | 4:3 | 1200 x 900 | WebP |
| **Chadawa / Offerings** | 16:10 | 1280 x 800 | WebP |
| **Products (Shop)** | 4:3 | 1200 x 900 | WebP |
| **Gallery Images** | 3:2 or 4:3 | 1200 x 800 | WebP |

---

## 🔍 Detailed Specifications

### 1. Temple Banners (Main Slider)
These are the large images shown at the top of the Home page and Temple Detail pages.
- **Why?**: They span the full width of the screen.
- **Ratio**: Wide (21:9 is best for large screens, 16:9 is standard).
- **Tip**: Keep the main subject (deity/temple) centered, as the sides might get cropped on smaller mobile screens.

### 2. Puja & Product Cards
Used in lists where multiple items are shown together.
- **Why?**: A **4:3 aspect ratio** ensures all cards look uniform and professional.
- **Tip**: Use clear, bright lighting. Products should have minimal background distractions.

### 3. Chadawa (Offerings)
These use a slightly wider **16:10 ratio**.
- **Why?**: It allows more space for horizontal elements while keeping the "Sacred Heritage" aesthetic.

---

## 🚀 SEO & Accessibility

Google and other search engines cannot "see" images. They read the **Description** and **Title** fields you fill in the Admin Panel.

1.  **Alt Text**: When you upload an image for a Temple, ensure the **Description** field contains keywords like "Ancient Shiva Temple in Varanasi".
2.  **Naming Convention**: Before uploading, rename your file from `IMG_1234.jpg` to something descriptive like `kashi-vishwanath-temple-main.webp`. This helps with Google Image Search!

---

## ⚡ Performance Optimization (Very Important)

To keep the website fast (Lighthouse Score 90+), please follow these technical rules:

1.  **Format**: Use **.webp** if possible. It provides high quality with significantly smaller file sizes.
2.  **File Size**: 
    - **Banners**: Try to keep under **500 KB**.
    - **Cards/Products**: Try to keep under **150 KB**.
3.  **Tool Recommendation**: Use [Squoosh.app](https://squoosh.app/) or [TinyJPG](https://tinyjpg.com/) to compress your images before uploading.

---

## 🎓 Learning Corner for Developers (The "Why" Behind Code)

### How the Frontend Handles Your Images

- **`aspect-4/3`**: This forces a fixed ratio. If you upload a square image, it will be cropped automatically.
- **`object-cover`**: This is a CSS property that ensures the image fills the container without stretching. It zooms in slightly rather than distorting the image.
- **`object-center`**: We keep images centered by default so that important parts aren't cut off.

### The "Asset" Utility
All images go through our `getAssetUrl` helper in `src/utils/assets.js`. This ensures that whether we are on Localhost or Production, the images load correctly from the server.

---