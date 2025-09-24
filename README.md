# 🤖 HayDay Chat System

Modern Node.js chat backend that powers the HayDay Malzemeleri support widget. It combines a rule-based knowledge base, optional OpenAI fallbacks and secure admin tooling on top of a durable file-backed data layer.

## ✨ Features

- 🔐 **Secure admin access** – One-time Telegram codes with hashed session tokens stored in the database.
- 💬 **Chat intelligence** – Keyword driven responses with optional GPT-3.5 Turbo escalation when an API key is supplied.
- 🗂️ **Durable storage** – Append-only JSON log with per-file locking for transcripts, analytics counters and admin sessions.
- 📊 **Admin dashboard API** – Aggregated conversation statistics and active chat summaries.
- 📡 **Render-ready** – Includes `render.yaml` and `/ping` health endpoint for uptime monitoring.

## 🚀 Getting Started

1. **Clone & Install**
   ```bash
   git clone https://github.com/USERNAME/hayday-chat-system.git
   cd hayday-chat-system
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # then edit .env with your credentials
   ```

   | Variable | Description |
   | --- | --- |
   | `PORT` | HTTP port (defaults to `3000`). |
   | `OPENAI_API_KEY` | Optional key for AI escalation. Leave empty to disable. |
   | `TELEGRAM_BOT_TOKEN` / `ADMIN_TELEGRAM_ID` | Optional Telegram integration for 2FA + notifications. |
| `DATABASE_PATH` | Path prefix for persisted data files (defaults to `./data/hayday-chat.db`). |

3. **Run the server**
   ```bash
   npm run dev      # nodemon hot reload
   # or
   npm start        # production style run
   ```

4. **Quality checks**
   ```bash
   npm run lint
   npm test
   ```

## 📦 Project Structure

```
├── data/
│   └── database.js          # File-backed data store helpers & locking
├── server.js                # Express application
├── assets/                  # Front-end loader scripts
├── tests/server.test.js     # Node test runner API checks
└── render.yaml              # Render deployment config
```

## 🌐 Embedding the Widget

Add the loader script to the footer of any site that should host the chat widget:

```html
<script src="https://your-app.onrender.com/assets/js/chat-loader.js" defer></script>
```

## 📊 API Overview

| Method & Path | Description |
| --- | --- |
| `POST /api/chat/send` | Accepts `{ clientId, message }`, stores the message and returns the bot reply. |
| `GET /api/chat/history/:clientId` | Returns the full transcript for a client. |
| `GET /api/chat/poll/:clientId?after=timestamp` | Poll for new messages after a timestamp. |
| `POST /api/admin/request-code` | Initiate Telegram 2FA (requires Telegram credentials). |
| `POST /api/admin/verify-code` | Exchange the code for a Bearer token. |
| `GET /api/admin/dashboard` | Authenticated stats endpoint for admin UI. |
| `GET /ping` | Health probe used by Render/UptimeRobot. |

## 🚀 Deployment Tips

- Set all environment variables in your hosting provider (Render, Fly.io, etc.).
- Ensure the `data/` directory is persisted between deploys or point `DATABASE_PATH` to a mounted volume.
- UptimeRobot configuration: poll `https://your-app.onrender.com/ping` every 3 minutes with GET.

---

Made with ❤️ for HayDay Malzemeleri.
