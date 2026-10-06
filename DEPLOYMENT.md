# 🚀 PRISM – Vercel Deployment Guide

PRISM is pre-configured for seamless, zero-friction deployment on **Vercel** with full-stack support (Vite React Single Page Application + FastAPI Python Serverless Functions).

---

## ⚡ Option 1: Zero-Config Deploy from Repo Root (Recommended)

When importing this repository into Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." → "Project"**.
2. Select your `Prism` GitHub repository.
3. Keep the **Root Directory** as `./` (default).
4. Leave Build & Output settings default (the included [vercel.json](file:///c:/Prism/vercel.json) orchestrates everything).
5. Click **"Deploy"**.

Vercel will automatically:
- Install Python serverless dependencies from [`requirements.txt`](file:///c:/Prism/requirements.txt)
- Run `cd platform/frontend && npm install && npm run build`
- Deploy the React frontend from `platform/frontend/dist`
- Expose the FastAPI backend at `/api/*` via [`api/index.py`](file:///c:/Prism/api/index.py)

---

## 📁 Option 2: Deploying with `platform` Subdirectory

If you prefer pointing Vercel specifically to the `platform` folder:

1. Import the repository in Vercel.
2. In the project setup screen, under **"Root Directory"**, click **Edit** and choose `platform`.
3. Click **"Deploy"**.

The platform subdirectory contains its own standalone [`platform/vercel.json`](file:///c:/Prism/platform/vercel.json), [`platform/requirements.txt`](file:///c:/Prism/platform/requirements.txt), and [`platform/api/index.py`](file:///c:/Prism/platform/api/index.py).

---

## 🌐 Verifying the Deployment

Once deployed, your Vercel URL will provide:

- **Frontend App**: `https://<your-project>.vercel.app/`
- **Simulators**:
  - `https://<your-project>.vercel.app/simulations/solid-state`
  - `https://<your-project>.vercel.app/simulations/projectile-motion`
  - `https://<your-project>.vercel.app/simulations/function-explorer`
- **API Health Check**: `https://<your-project>.vercel.app/api/health`
- **Interactive Swagger Docs**: `https://<your-project>.vercel.app/api/docs`
- **API OpenAPI Schema**: `https://<your-project>.vercel.app/api/openapi.json`
- **Registry API**: `https://<your-project>.vercel.app/api/registry`

---

## 🛠 Local Development

```bash
# 1. Start FastAPI backend (port 8000)
cd platform/backend
python -m uvicorn main:app --reload --port 8000

# 2. Start Vite frontend dev server (port 5173, proxies /api -> :8000)
cd platform/frontend
npm install
npm run dev
```
