# ⚡ CodeSync – Real-Time Collaborative Code Editor

[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)](https://github.com/Tanay-Bhatt)  [![Backend](https://img.shields.io/badge/Backend-FastAPI%20+%20Socket.IO-blue?logo=python)](https://fastapi.tiangolo.com/)  [![React](https://img.shields.io/badge/React-18+-61dafb?logo=react)](https://reactjs.org/)  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178c6?logo=typescript)](https://www.typescriptlang.org/)  [![Vite](https://img.shields.io/badge/Vite-4+-646cff?logo=vite)](https://vitejs.dev/)  [![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis)](https://upstash.com/) [![Live Demo](https://img.shields.io/badge/Live%20App-%F0%9F%9A%80-green?style=flat&logo=vercel)](https://codesync.live) 

**CodeSync** is a full-stack collaborative code editor with live chat, participant tracking, multi-language support, and a beautiful responsive UI. Built with FastAPI, Socket.IO, Redis, and React + TypeScript + Vite.

---

## 🌐 Live App

👉 **Live Website**: [https://code-sync-gray-two.vercel.app/](https://code-sync-gray-two.vercel.app/)  
📺 **Preview Video**: [https://vimeo.com/1088234795](https://vimeo.com/1088234795?share=copy)

---

## 🌟 Features

- ⚡ **Real-time Code Sync** with Socket.IO + Redis
- 🌐 **Multi-language support** (JavaScript, Python, C++, Java, TypeScript, HTML, CSS)
- 💬 **Live Chat** per room, with smooth autoscroll and participant tagging
- 👨‍👩‍👧‍👦 **Participant Panel** with dynamic join/leave tracking
- 🆔 **Copy Room ID** to share and invite friends instantly
- 🌓 **Dark/Light Theme Toggle** for the code editor
- 📤 **Export Code** (copy to clipboard)
- 📱 **Mobile Responsive** — seamless tabbed UI (Editor, Chat, Participants)
- 🚀 **Debounced Code Updates** to avoid redundant traffic
- 🧠 **Redis-powered Room State**, even in disconnected scenarios

---

## 📦 Tech Stack

| Frontend                  | Backend                  | Real-Time Stack        | Infra / Hosting         |
|---------------------------|--------------------------|-------------------------|--------------------------|
| React + Vite + TypeScript | FastAPI (Python 3.11+)   | Socket.IO (async)       | Render (backend)         |
| Monaco Editor             | Uvicorn ASGI             | Redis (Upstash)         | Vercel (frontend)        |
| Custom CSS         | aiohttp + python-socketio|                         | GitHub                   |

---

## 🔧 Setup Instructions

### Redis Configuration
```bash
# Add environment variables to your terminal
REDIS_HOST=your_redis_host_or_ip 
REDIS_PASSWORD=your_redis_password  
```

### Vite Frontend Configuration
```bash
#Create a .env file in your /frontend and add
VITE_API_URL=http://localhost:8000/ # or your live API url
```
### 🔹 1. Backend (FastAPI + Socket.IO + Redis)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:main_app --host 0.0.0.0 --port 8000
```

### 🔹 2. Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install
npm run dev
```