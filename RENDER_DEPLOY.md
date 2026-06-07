# 🚀 Deploy to Render

## Step-by-Step Guide

### 1. Create a GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it `confronter-tech-wizard`
3. Upload these files to the repo:
   - server.js
   - package.json
   - index.html
   - styles.css
   - app.js
   - admin.html
   - .gitignore

### 2. Sign Up on Render
1. Go to [render.com](https://render.com) and create a free account
2. You can sign up with GitHub for easy integration

### 3. Create a New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `confronter-tech-wizard` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. Click **"Create Web Service"**

### 4. Add Persistent Disk (IMPORTANT!)
This step is **critical** for data to persist:

1. In your Render dashboard, click on your service
2. Go to **"Disks"** tab
3. Click **"Add Disk"**
4. Configure:
   - **Name**: `data`
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB (free tier max)
5. Click **"Save"**

> ⚠️ **Without this disk, your data will reset on every deploy!**

### 5. Your App is Live!
- **User Form**: `https://your-project.onrender.com`
- **Admin Panel**: `https://your-project.onrender.com/admin.html`
- **Admin Password**: `confronter1`

---

## 🔧 How to Change the Default Target (500)

### Option 1: Via Admin Panel
1. Log in to admin panel
2. Enter any number in "Target members" field
3. Click "Set Target"

### Option 2: Edit Server Code
In `server.js`, find this line:
```javascript
target: 500,
```
Change `500` to any number you want.

### Option 3: After First Deploy
The admin panel settings stick because data is saved to the persistent disk.

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| server.js | Node.js backend with persistent storage |
| package.json | Node.js configuration |
| index.html | User verification form |
| styles.css | Shared styles (dark/light mode) |
| app.js | Frontend API calls to backend |
| admin.html | Admin panel with delete, mark, download |
| .gitignore | Ignore node_modules and data.json |

---

## ✨ What's Fixed

| Issue | Fix |
|-------|-----|
| Counts reset on refresh | Data now fetches from server every time |
| Members disappear | Stored on Render's persistent disk |
| Admin settings don't stick | Saved to server, not browser |
| Can't delete users | Added 🗑️ delete button per row |
| Default target was 30 | Now defaults to 500 |

---

## ⚠️ Important Notes

1. **Persistent Disk**: Must add `/var/data` disk in Render dashboard
2. **Free Tier**: Render free tier spins down after 15 min idle — first request may take 30s to wake up
3. **Data.json**: The file `data.json` stores all data on the disk
4. **Backups**: Download CSV from admin panel regularly as backup

---

## 🔗 Quick Links
- Render: https://render.com
- Your App: `https://your-project-name.onrender.com`
- Admin: `https://your-project-name.onrender.com/admin.html`
