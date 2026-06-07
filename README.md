# Confronter Tech Wizard - VCF Active Viewers

A full-stack verification system with Node.js backend, allowing users to verify themselves and join a WhatsApp group.

## 📁 Files

| File | Purpose |
|------|---------|
| `server.js` | Node.js backend server |
| `package.json` | Node.js dependencies & scripts |
| `index.html` | Main user verification form |
| `styles.css` | Shared styles (dark/light mode) |
| `app.js` | Frontend logic with API calls |
| `admin.html` | Admin panel with backend sync |

## 🚀 Quick Start (Local)

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org) (v14 or higher)

### 2. Run the Server
```bash
# Navigate to the project folder
cd confronter-tech-wizard

# Install dependencies (none needed for basic server)
npm install

# Start the server
npm start
```

### 3. Open in Browser
- **User Form**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **Admin Password**: `confronter1`

## 🌐 Deploy Online (Free)

### Option 1: Render (Recommended)
1. Go to [render.com](https://render.com) and create a free account
2. Click **New → Web Service**
3. Connect your GitHub repo or upload files
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Deploy**

### Option 2: Railway
1. Go to [railway.app](https://railway.app) and create a free account
2. Create a new project → Deploy from GitHub repo
3. Railway auto-detects Node.js apps
4. Your app will be live with a public URL

### Option 3: Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch`
3. Follow prompts to deploy

## ✨ Features

### User Form (`index.html`)
- Small font, awesome modern design
- Dark/Light mode toggle (☀️/🌙)
- Battery percentage + charging indicator
- Live date 📅 & time ⏲️
- 150+ countries with phone validation
- Email validation required
- VCF file download (when admin uploads)
- Members circle (verified vs remaining)
- 30-day countdown timer
- Speech: "You were verified successfully"
- 2-second redirect to WhatsApp group
- "Go Back" & "Add Another Number" buttons

### Admin Panel (`admin.html`)
- Password: `confronter1`
- Pure black/white themes
- Statistics dashboard
- Set target members & countdown days
- Upload VCF/CSV/TXT/PDF/DOC/XLS files
- Toggle file download on/off
- **Download** members as VCF, CSV, or Document
- Members table with full details
- Mark members: ✅ Verified / ⏳ Pending / ✕ Rejected
- Bulk select & bulk mark actions
- No deletion — only status marking

### Backend (`server.js`)
- REST API for members, stats, VCF
- Data persists in `data.json` file
- Serves static files (HTML, CSS, JS)
- CORS enabled for all origins
- Admin password protection on sensitive routes

## 🔗 WhatsApp Group
Users are redirected to: `https://chat.whatsapp.com/G9qtX0Yuq61JjrklH8k803?s=cl&p=a&ilr=1`

## 📱 Phone Validation Examples
| Country | Dial Code | Valid Example |
|---------|-----------|---------------|
| Kenya | +254 | +254793908671 |
| USA | +1 | +14155552671 |
| UK | +44 | +447700900123 |
| Nigeria | +234 | +2348012345678 |
| India | +91 | +919876543210 |

## ⚠️ Notes
- Data is stored in `data.json` on the server
- For production, consider adding a real database (MongoDB, PostgreSQL)
- The server uses in-memory + file storage — perfect for small projects
