# 🚀 Deploy to Vercel (NO DATA LOSS)

## ⚠️ THE PROBLEM

Vercel uses **serverless functions** — they reset on every request. Without proper storage, your data disappears on page refresh.

## ✅ THE SOLUTION: Vercel KV (Redis)

Vercel KV is a **free Redis database** that stores data permanently. It never resets.

---

## 📋 Step-by-Step Deployment

### Step 1: Create GitHub Repo
1. Go to [github.com](https://github.com)
2. Create new repository: `confronter-tech-wizard`
3. Upload these files:
   - `server.js` (use server-kv.js and rename it)
   - `package.json`
   - `vercel.json`
   - `index.html`
   - `styles.css`
   - `app.js`
   - `admin.html`
   - `.gitignore`

### Step 2: Sign Up on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your **GitHub account**

### Step 3: Create KV Database
1. In Vercel dashboard, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"KV"** (Redis)
4. Name it: `confronter-data`
5. Choose region closest to you (e.g., `us-east-1`)
6. Click **"Create"**

### Step 4: Connect KV to Your Project
1. After creating KV, click **"Connect Project"**
2. Select your GitHub repo `confronter-tech-wizard`
3. Click **"Connect"**

> Vercel will automatically add these environment variables:
> - `KV_URL`
> - `KV_REST_API_URL`
> - `KV_REST_API_TOKEN`
> - `KV_REST_API_READ_ONLY_TOKEN`

### Step 5: Deploy
1. Go to **"Projects"** tab
2. Click your project
3. Click **"Deploy"** (or push code to GitHub)
4. Done! Your app is live.

---

## 🔗 Your Live URLs

- **User Form**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin.html`
- **Admin Password**: `confronter1`

---

## 🎯 How to Change Default Target (500)

### Option 1: Admin Panel (Recommended)
1. Log in to admin panel
2. Enter number in **"Target members"** field
3. Click **"Set Target"**
4. Data persists forever!

### Option 2: Edit Code
In `server.js` or `server-kv.js`, find:
```javascript
target: 500,  // <-- Change this number
```

---

## 📁 Which Server File to Use?

| File | Use Case | Persistence |
|------|----------|-------------|
| `server.js` | Local development, testing | File-based |
| `server-kv.js` | Vercel production | **Vercel KV (permanent)** |

**For Vercel deployment:** Rename `server-kv.js` to `server.js` before uploading.

---

## 🆓 Vercel KV Free Tier Limits

| Limit | Value |
|-------|-------|
| Daily commands | 3,000 |
| Storage | 256 MB |
| Bandwidth | 5 GB/month |

For your use case (member list), this is **more than enough**.

---

## 🧪 Test Before Deploying

### Local Test (without KV):
```bash
npm install
node server.js
# Open http://localhost:3000
```

### With KV (requires env vars):
```bash
npm install
# Set KV_URL and KV_REST_API_TOKEN in .env file
node server-kv.js
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "KV not connected" | Go to Vercel dashboard → Storage → Connect to project |
| Data still resets | Make sure you're using `server-kv.js`, not `server.js` |
| "Module not found" | Run `npm install @vercel/kv` |
| Build fails | Check Node version is 18+ in package.json |

---

## 🔐 Environment Variables (if manual setup needed)

If Vercel doesn't auto-connect KV, add these manually:

1. Project Settings → Environment Variables
2. Add these from your KV dashboard:

```
KV_URL=redis://... (from KV dashboard)
KV_REST_API_URL=https://... (from KV dashboard)
KV_REST_API_TOKEN=... (from KV dashboard)
KV_REST_API_READ_ONLY_TOKEN=... (from KV dashboard)
```

---

## ✅ Data Persistence Checklist

- [ ] Created Vercel KV database
- [ ] Connected KV to project
- [ ] Using `server-kv.js` (renamed to `server.js`)
- [ ] `package.json` has `@vercel/kv` dependency
- [ ] Deployed successfully
- [ ] Tested adding a member → refresh → member still there

---

## 🎉 Done!

Your app now stores data **permanently** in Vercel KV. No more data loss on refresh!
