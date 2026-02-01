# SkyNotes – YunoHost Deployment Guide

This document describes how SkyNotes is deployed on a YunoHost server: SSO disabling, `.env` setup, Nginx config, and common issues.

---

## Overview

- **Frontend:** `skynotes.borak.dev` → static files (`frontend/dist`)
- **Backend (API):** `api.skynotes.borak.dev` → Node.js (port 8001), Nginx reverse proxy
- **Database:** MongoDB Atlas (production uses `MONGODB_URI`)

---

## 1. Prerequisites

- Server with YunoHost installed
- Node.js 24 (project uses `.nvmrc`; on the server run `nvm use` in the repo or `nvm install 24` then `nvm use 24`)
- MongoDB Atlas account or accessible MongoDB instance
- Domains: `skynotes.borak.dev`, `api.skynotes.borak.dev` (DNS A records pointing to server IP)

---

## 2. Environment Variables (.env)

### 2.1 Backend (`backend/.env`)

Copy `backend/.env.example` to `.env`:

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

**Fields to fill:**

| Variable              | Description                                                 | Example                                                                                        |
| --------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `PORT`                | Port the backend listens on                                 | `8001`                                                                                         |
| `NODE_ENV`            | Environment                                                 | `production`                                                                                   |
| `MONGODB_URI`         | MongoDB connection string (Atlas: URL-encode user/password) | `mongodb+srv://user:encoded_password@cluster.mongodb.net/skynotes?retryWrites=true&w=majority` |
| `ACCESS_TOKEN_SECRET` | Strong random secret for JWT                                | Generate with `openssl rand -hex 32`                                                           |

**Important:** If the MongoDB password contains `@`, `#`, `:`, `/`, or `%`, URL-encode them (`@` → `%40`, `#` → `%23`, etc.). Otherwise you get `bad auth : authentication failed` and the backend will restart in a loop.

### 2.2 Frontend (`frontend/.env`)

Used at build time for the API URL:

```bash
cp frontend/.env.example frontend/.env
nano frontend/.env
```

**For production:**

| Variable        | Description                   | Example                          |
| --------------- | ----------------------------- | -------------------------------- |
| `VITE_API_URL`  | Public URL of the backend API | `https://api.skynotes.borak.dev` |
| `VITE_DEV_PORT` | Local `npm run dev` port only | `5174`                           |

Run `npm run build` (these values are baked into the build).

---

## 3. YunoHost / Nginx – Disabling SSO

YunoHost enables SSO (Single Sign-On) by default for domains. To serve SkyNotes directly (no SSO screen), comment out the SSO-related lines in the domain configs (same pattern as chord, itday).

### 3.1 Which files?

- **Frontend domain:** `/etc/nginx/conf.d/skynotes.borak.dev.conf`
- **API domain:** `/etc/nginx/conf.d/api.skynotes.borak.dev.conf`

### 3.2 Lines to comment out (both domains)

**In the port 80 server block:**

```nginx
#SSO
#access_by_lua_file /usr/share/ssowat/access.lua;
```

**In the port 443 server block:**

```nginx
#SSO
#access_by_lua_file /usr/share/ssowat/access.lua;

include /etc/nginx/conf.d/<domain>.borak.dev.d/*.conf;

#SSO
#include /etc/nginx/conf.d/yunohost_sso.conf.inc;
#include /etc/nginx/conf.d/yunohost_admin.conf.inc;
#include /etc/nginx/conf.d/yunohost_api.conf.inc;
include /etc/nginx/conf.d/yunohost_http_errors.conf.inc;
```

Keep the `include ... .d/*.conf;` line **uncommented**; only comment `access_by_lua_file` and the `yunohost_sso`, `yunohost_admin`, `yunohost_api` includes.

### 3.3 Edit commands

```bash
sudo nano /etc/nginx/conf.d/skynotes.borak.dev.conf
sudo nano /etc/nginx/conf.d/api.skynotes.borak.dev.conf
```

After saving:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Nginx – App Configs (.d directories)

### 4.1 Frontend (`skynotes.borak.dev`)

File: `/etc/nginx/conf.d/skynotes.borak.dev.d/skynotes-frontend.conf`

```nginx
location / {
    root /home/bora/Projeler/skynotes/frontend/dist;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

Adjust the `root` path to your server user and project path.

### 4.2 API (`api.skynotes.borak.dev`)

File: `/etc/nginx/conf.d/api.skynotes.borak.dev.d/api-backend.conf`

```nginx
location / {
    proxy_pass http://127.0.0.1:8001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 5. Adding Domains (YunoHost)

- **skynotes.borak.dev:** Main domain (frontend).
- **api.skynotes.borak.dev:** API subdomain. In YunoHost the subdomain field **does not accept dots** (only lowercase letters, digits, hyphens). So the subdomain is entered as `api.skynotes`; the full hostname becomes `api.skynotes.borak.dev`.

For both domains:

1. Add DNS A record (server IP).
2. YunoHost Admin → Domains → Add domain (or subdomain).
3. Install Let’s Encrypt certificate.

---

## 6. Running on the Server

### Backend (PM2)

The repo has `.nvmrc` (Node 24) at the root and in `backend/`. If you use nvm, run `nvm use` in the project so the correct Node version is active.

```bash
cd /home/bora/Projeler/skynotes/backend
nvm use                 # if using nvm (reads .nvmrc)
npm install --omit=dev
cp .env.example .env   # if not already done
nano .env              # MONGODB_URI, ACCESS_TOKEN_SECRET, PORT=8001, NODE_ENV=production
pm2 start index.js --name skynotes-api
pm2 save
pm2 startup            # run the command it outputs (systemd)
```

### Frontend (build)

```bash
cd /home/bora/Projeler/skynotes/frontend
npm install
cp .env.example .env
nano .env              # VITE_API_URL=https://api.skynotes.borak.dev
npm run build
```

The `dist/` output must be the directory Nginx serves as `root` (see `skynotes-frontend.conf` above).

---

## 7. Troubleshooting

### 502 Bad Gateway (api.skynotes.borak.dev)

- **Cause:** Nginx proxies to 8001 but the backend is not responding or keeps crashing.
- **Check:**  
  `pm2 list` → is skynotes-api **online** and restart count stable?  
  `curl -s http://127.0.0.1:8001/` → should return `{"data":"hello"}`.
- **Common cause:** MongoDB connection error → backend starts then exits, PM2 restarts it (restart loop).  
  Run `pm2 logs skynotes-api --lines 50`; if you see `MongoDB Connection Error: bad auth` etc., fix **MONGODB_URI** (user/password and URL-encode special characters in the password).

### skynotes.borak.dev still shows SSO screen

- Was SSO commented out in the main config?  
  Check with `sudo cat /etc/nginx/conf.d/skynotes.borak.dev.conf`; you should see `#access_by_lua_file` and `#include ... yunohost_sso.conf.inc` like in chord/itday.
- Is the frontend config present in `.d`?  
  `sudo cat /etc/nginx/conf.d/skynotes.borak.dev.d/skynotes-frontend.conf` → verify `root` and `try_files`.

### MongoDB “bad auth : authentication failed”

- Does the Database User password in Atlas match the password in `MONGODB_URI` in `.env`?
- Are special characters in the password URL-encoded?
- If needed, reset the user password in Atlas and update `.env`.

### PM2 keeps restarting (↺ increasing)

- Usually a MongoDB connection issue. Apply the “bad auth” steps above; fix `.env` (especially `MONGODB_URI`) until logs show `MongoDB Connected!`.

---

## 8. Deployment Workflow Summary

1. **DNS:** Point skynotes.borak.dev and api.skynotes.borak.dev to the server IP.
2. **YunoHost:** Add both domains, install Let’s Encrypt.
3. **SSO:** Comment out SSO lines in both domain configs (as above).
4. **Nginx .d:** Add `skynotes.borak.dev.d/skynotes-frontend.conf` and `api.skynotes.borak.dev.d/api-backend.conf`.
5. **Backend:** Set `backend/.env` (PORT=8001, NODE_ENV, MONGODB_URI, ACCESS_TOKEN_SECRET), `npm install`, PM2 start.
6. **Frontend:** Set `frontend/.env` (VITE_API_URL=https://api.skynotes.borak.dev), `npm run build`.
7. **Test:** `curl -s https://api.skynotes.borak.dev/` → `{"data":"hello"}`; open https://skynotes.borak.dev in a browser → app loads.

For code updates: on the server run `git pull`, `npm install` in backend if needed, `npm run build` in frontend (keep VITE_API_URL), then `pm2 restart skynotes-api`.

---

## 9. GitHub Actions Workflow (YunoHost-compatible)

The `.github/workflows/deploy-yunohost.yml` workflow:

- **Triggers:** Push to `master` (when backend or frontend changes) or manual (workflow_dispatch). Uses Node 24 (from `.nvmrc`). Concurrency: only one deploy at a time (new push cancels the previous run).
- **Actions:** Builds frontend (with VITE_API_URL), runs backend `npm ci`, rsyncs backend and frontend/dist to the server, then (if deploy succeeded) SSHs to the server and runs `npm install --omit=dev` in backend and `pm2 restart skynotes-api` (uses nvm if `~/.nvm/nvm.sh` exists). It **does not** modify nginx or .env on the server.

### Required GitHub Secrets (for deploy)

| Secret            | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| `DEPLOY_HOST`     | Server hostname or IP (e.g. `borak.dev`)                                                          |
| `DEPLOY_USER`     | SSH username (e.g. `bora`)                                                                        |
| `SSH_PRIVATE_KEY` | SSH private key used for deploy (matching a public key in `~/.ssh/authorized_keys` on the server) |
| `DEPLOY_PATH`     | (Optional) Project path on server (default: `/home/bora/Projeler/skynotes`)                       |
| `DEPLOY_PORT`     | (Optional) SSH port (default: 22)                                                                 |
| `VITE_API_URL`    | (Optional) API URL used in frontend build (default: `https://api.skynotes.borak.dev`)             |

The workflow runs `npm install --omit=dev` and `pm2 restart skynotes-api` on the server after rsync. If that SSH step fails or you run the workflow without deploy secrets, on the server run: `cd backend && nvm use && npm install --omit=dev && pm2 restart skynotes-api`. Frontend only updates `dist`; nginx already serves that directory.
