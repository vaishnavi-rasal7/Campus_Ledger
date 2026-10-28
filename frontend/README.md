# Campus Ledger — Frontend (React 18 + Vite)

Deployment-ready React application for **Campus Ledger — Student Record Management System**.

---

## 🚀 Quick Deploy to Vercel (Recommended)

1. Push this folder to GitHub (either as root or inside monorepo).
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository:
   - If deploying from monorepo: set **Root Directory** to `frontend`.
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   ```env
   VITE_API_BASE_URL=https://your-backend-service.onrender.com
   ```
5. Click **Deploy**. Your app will be live at `https://your-app.vercel.app`!

> **Note on Client-side Routing:** The included `vercel.json` automatically rewrites all nested paths (`/students`, `/students/1`, etc.) to `index.html`, preventing 404 errors on browser refresh!

---

## 💻 Local Development

```bash
npm install
npm run dev
```

App starts at `http://localhost:5173`.
To run frontend tests:
```bash
npm test
```
