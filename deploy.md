# 🚀 cPanel Deployment Guide — Shyam Sevaa Project

> **Stack:** React (Vite) + Node.js (Express + Socket.io) + MySQL  
> **Frontend Domain:** `shyampuja.com` (or `www.shyampuja.com`)  
> **Backend Domain:** `serverr.shyampuja.com` (subdomain)

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1 — Prepare Your Database (MySQL)](#step-1--prepare-your-database-mysql)
3. [Step 2 — Setup Node.js Backend on cPanel](#step-2--setup-nodejs-backend-on-cpanel)
4. [Step 3 — Upload Backend Files](#step-3--upload-backend-files)
5. [Step 4 — Configure Environment Variables (.env)](#step-4--configure-environment-variables-env)
6. [Step 5 — Install Node.js Dependencies on Server](#step-5--install-nodejs-dependencies-on-server)
7. [Step 6 — Start the Node.js App (Application Manager)](#step-6--start-the-nodejs-app-application-manager)
8. [Step 7 — Build and Upload React Frontend](#step-7--build-and-upload-react-frontend)
9. [Step 8 — Configure .htaccess for React Router](#step-8--configure-htaccess-for-react-router)
10. [Step 9 — Test Everything](#step-9--test-everything)
11. [Common Errors & Fixes](#common-errors--fixes)

---

## 1. Prerequisites

Before starting, make sure you have:

- ✅ A **cPanel hosting account** that supports **Node.js** (e.g., Hostinger, A2Hosting, Namecheap)
- ✅ Your **domain** (`shyampuja.com`) pointed to this hosting
- ✅ A **subdomain** created: `serverr.shyampuja.com` (for the backend/API)
- ✅ **MySQL database** created in cPanel
- ✅ **File Manager** or **FTP client** (like FileZilla) access
- ✅ **SSH access** (Terminal) enabled in cPanel — highly recommended

> ⚠️ **IMPORTANT:** cPanel must have the **Node.js Selector** feature. Without it, you cannot run a Node.js backend. Check with your hosting provider.

---

## Step 1 — Prepare Your Database (MySQL)

### 1.1 Create a MySQL Database

1. Login to **cPanel** → scroll down → click **MySQL Databases**
2. Under **"Create New Database"**, type: `shyampuja` → click **Create Database**
3. Under **"MySQL Users"** → Create a new user:
   - Username: `myuser`
   - Password: `YourStrongPassword123!`
   - Click **Create User**
4. Under **"Add User to Database"**:
   - Select your user and database → click **Add**
   - Give **ALL PRIVILEGES** → click **Make Changes**

> 📝 Note down these credentials — you'll need them in the `.env` file.

---

### 1.2 Import Your Database

1. In cPanel → open **phpMyAdmin**
2. Click on your database `uqdkrkqq_shyampuja` on the left sidebar
3. Click the **Import** tab at the top
4. Click **Choose File** → select `shyamsevaa.sql` from your project root
5. Click **Go** at the bottom

> ✅ All your tables will be created automatically. The server's `initDB.js` will also handle any missing columns when the server starts.

---

## Step 2 — Setup Node.js Backend on cPanel

### 2.1 Create a Subdomain for the Backend

1. In cPanel → click **Subdomains**
2. Under **"Create a Subdomain"**:
   - Subdomain: `serverr`
   - Domain: `shyampuja.com`
   - Document Root: `serverr.shyampuja.com` (auto-filled)
   - Click **Create**

### 2.2 Setup Node.js Application

1. In cPanel → click **Node.js Selector** (or **Setup Node.js App**)
2. Click **"Create Application"**
3. Fill in the details:

| Field                        | Value                         |
| ---------------------------- | ----------------------------- |
| **Node.js Version**          | `18.x` or `20.x` (latest LTS) |
| **Application Mode**         | `Production`                  |
| **Application Root**         | `serverr.shyampuja.com`       |
| **Application URL**          | `serverr.shyampuja.com`       |
| **Application Startup File** | `server.js`                   |

4. Click **Create**

---

## Step 3 — Upload Backend Files

### 3.1 What files to upload

Upload these from your `server/` folder to `serverr.shyampuja.com/` directory on the server:

```
✅ server.js
✅ package.json
✅ package-lock.json
✅ src/  (entire folder)
✅ public/  (if any static files)
✅ uploads/  (create this empty folder on server)

❌ DO NOT upload:
   - node_modules/  (will be installed on server)
   - .env  (will be created manually on server)
   - src.zip
   - *.test.js files
```

### 3.2 How to Upload (Two methods)

**Method A — Using cPanel File Manager:**

1. cPanel → **File Manager** → navigate to `serverr.shyampuja.com/`
2. Click **Upload** → upload your files
3. For folders, compress them as `.zip` on your PC first, upload the `.zip`, then **Extract** in File Manager

**Method B — Using FTP (FileZilla):**

1. Open FileZilla → File → Site Manager → New Site
2. Host: `shyampuja.com`, Username/Password: your cPanel credentials
3. Navigate to `/serverr.shyampuja.com/` on the right panel
4. Drag and drop your files from left (your PC) to right (server)

---

## Step 4 — Configure Environment Variables (.env)

### 4.1 Create .env file on the Server

In **cPanel File Manager** → navigate to `serverr.shyampuja.com/` → click **+ File** → name it `.env`

### 4.2 Paste this content (update with your actual values)

```env
# Server Port (cPanel Node.js usually assigns a port automatically)
PORT=3000

# JWT Secrets — CHANGE THESE to strong random strings in production!
JWT_SECRET=your_super_strong_jwt_secret_here_change_this
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_super_strong_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# Database — Use the cPanel MySQL credentials you created in Step 1
DB_HOST=localhost
DB_USER=uqdkrkqq_myuser
DB_PASSWORD=YourStrongPassword123!
DB_NAME=uqdkrkqq_shyampuja
DB_PORT=3306

# Email (Nodemailer)
EMAIL_USER=mr.rathore1717@gmail.com
EMAIL_PASS=eoji slmt wtpf gfxx

# Razorpay — Switch to LIVE keys when going live!
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Client URL (for CORS)
CLIENT_URL=https://shyampuja.com
```

> ⚠️ **SECURITY WARNING:** Never commit your production `.env` to GitHub. It contains passwords and API keys!

> 💡 **cPanel DB naming:** cPanel prefixes all database names and usernames with your cPanel account name (e.g., `uqdkrkqq_`). So `shyampuja` becomes `uqdkrkqq_shyampuja`.

---

## Step 5 — Install Node.js Dependencies on Server

### Method A — Via SSH Terminal (Recommended)

1. In cPanel → click **Terminal** (or use SSH client like PuTTY)
2. Navigate to your backend folder:
   ```bash
   cd ~/serverr.shyampuja.com
   ```
3. Install dependencies:
   ```bash
   npm install --production
   ```
   > `--production` skips `devDependencies` like `nodemon` — we don't need them on the server.

### Method B — Via Node.js App Manager

1. In cPanel → **Node.js Selector** → click your app
2. Click **"Run NPM Install"** button (if available)

---

## Step 6 — Start the Node.js App (Application Manager)

1. In cPanel → **Node.js Selector** → find your app
2. Click the **Start** button (▶️)
3. The status should change to **"Running"**
4. Click **"Restart"** whenever you update the server files

> 💡 **What is `server.js`?** This is the entry point of your backend. It:
>
> - Starts Express on a port
> - Connects to MySQL via `db.js`
> - Sets up Socket.io for real-time notifications
> - Handles all your API routes under `/api/...`

---

## Step 7 — Build and Upload React Frontend

### 7.1 Update the API URL in the Frontend

Before building, update `client/vite.config.js`.

On production, the proxy is **not used** — Vite proxy only works during local development (`npm run dev`). On production, your React app talks directly to your backend domain.

Open `client/src/` and find where `axios` or `fetch` calls are made. Make sure your **base URL** points to the backend:

```js
// In your axios config or api.js file
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://serverr.shyampuja.com";
```

Create `client/.env.production` file:

```env
VITE_API_URL=https://serverr.shyampuja.com
```

### 7.2 Build the React App

On your **local PC**, open terminal in the `client/` folder:

```bash
# Step 1: Install dependencies (if not done)
npm install

# Step 2: Build for production
npm run build
```

This creates a `client/dist/` folder with all the optimized HTML, CSS, and JS files.

> 💡 **What does `npm run build` do?**  
> Vite compiles your React JSX components into plain HTML + CSS + JS that any browser can understand. It also minifies (shrinks) the code for faster loading.

### 7.3 Upload the `dist/` Folder Contents

1. Open cPanel → **File Manager** → navigate to `public_html/`
   - This is where your main domain `shyampuja.com` points
2. Upload ALL contents **inside** `client/dist/` to `public_html/`
   - Upload `index.html`, `assets/` folder, etc.
   - NOT the `dist/` folder itself — just its contents

```
public_html/
├── index.html          ← from dist/
├── assets/             ← from dist/assets/
│   ├── index-xxxx.js
│   └── index-xxxx.css
└── .htaccess           ← you'll create this next
```

---

## Step 8 — Configure .htaccess for React Router

React uses **client-side routing** (react-router-dom). Without this `.htaccess` file, refreshing any page (like `/admin`, `/pooja/123`) will give a **404 Not Found** error.

Create a file named `.htaccess` in `public_html/` with this content:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

> 💡 **What does this do?**  
> It tells Apache (the web server cPanel uses) that if a requested file doesn't exist on disk, serve `index.html` instead — and let React Router handle the URL.

---

## Step 9 — Test Everything

### ✅ Checklist

| Test                                             | Expected Result                 |
| ------------------------------------------------ | ------------------------------- |
| Visit `https://shyampuja.com`                    | React homepage loads            |
| Visit `https://shyampuja.com/admin`              | Admin page loads (not 404)      |
| Refresh any page                                 | Page still loads (not 404)      |
| Visit `https://serverr.shyampuja.com/api/health` | `{ "status": "ok" }` or similar |
| Login / Register                                 | Works, JWT assigned             |
| Image uploads                                    | Images appear correctly         |
| Payment (Razorpay)                               | Checkout opens                  |
| Real-time notifications                          | Socket.io events fire           |

---

## Common Errors & Fixes

### ❌ Error: `Cannot GET /api/...` on the frontend

**Cause:** The Vite proxy only works locally. On production, API calls need to go to `https://serverr.shyampuja.com`.  
**Fix:** Make sure `VITE_API_URL` is set and all API calls use it.

---

### ❌ Error: `502 Bad Gateway` on backend subdomain

**Cause:** Node.js app crashed or didn't start.  
**Fix:**

1. cPanel → Node.js Selector → check if app is running
2. SSH into server: `cd ~/serverr.shyampuja.com && node server.js` to see error messages
3. Check `.env` values are correct

---

### ❌ Error: MySQL connection refused

**Cause:** Wrong DB credentials in `.env`.  
**Fix:** Double-check `DB_USER`, `DB_PASSWORD`, `DB_NAME` — remember cPanel adds its prefix (e.g., `uqdkrkqq_`).

---

### ❌ Error: 404 on page refresh

**Cause:** Missing `.htaccess` file.  
**Fix:** Create the `.htaccess` file in `public_html/` as described in Step 8.

---

### ❌ Error: `CORS` blocked

**Cause:** Backend is not allowing requests from frontend domain.  
**Fix:** In `server/src/app.js`, make sure CORS is configured:

```js
app.use(
  cors({
    origin: ["https://shyampuja.com", "https://www.shyampuja.com"],
    credentials: true,
  }),
);
```

---

### ❌ Uploads folder not working

**Cause:** The `uploads/` folder doesn't exist on the server or has wrong permissions.  
**Fix:**

1. SSH: `mkdir -p ~/serverr.shyampuja.com/uploads`
2. Set permissions: `chmod 755 ~/serverr.shyampuja.com/uploads`

---

## 🔄 How to Redeploy After Code Changes

### Backend Update:

1. Upload changed files to `serverr.shyampuja.com/` via File Manager or FTP
2. cPanel → Node.js Selector → Click **Restart**

### Frontend Update:

1. On your PC: `cd client && npm run build`
2. Upload new contents of `dist/` to `public_html/`
3. Clear browser cache to see changes

---

## 📦 Summary of Folder Mapping

| Your Local Folder       | Goes to on cPanel                                  |
| ----------------------- | -------------------------------------------------- |
| `server/`               | `~/serverr.shyampuja.com/`                         |
| `client/dist/` contents | `~/public_html/`                                   |
| `server/.env`           | Created manually at `~/serverr.shyampuja.com/.env` |
| `shyamsevaa.sql`        | Imported via phpMyAdmin                            |

---

_Generated for: Shyam Sevaa Project | Stack: React + Vite + Node.js + Express + MySQL + Socket.io + Razorpay_
