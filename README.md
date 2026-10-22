# SupaNova — Modern Full-Stack Supabase Platform

An end-to-end full-stack platform featuring a self-hosted **Supabase (PostgreSQL 17.6 + PostgREST + GoTrue Auth)** backend paired with an attractive **React 19 + Tailwind CSS** dark-mode dashboard.

---

## ⚡ Features

- **Self-Hosted Supabase Cluster:**
  - PostgreSQL 17.6 engine
  - PostgREST for automatic REST APIs
  - GoTrue Auth for User Sign In, Sign Up, and Password Reset
  - Supavisor connection pooling
  - Realtime WebSockets for instant live UI sync
  - Studio visual administration panel at `http://localhost:8000`
- **SupaNova Modern Frontend:**
  - Dark glassmorphism UI with emerald glow accents
  - Real-time CRUD operations on `public.tasks` table
  - Live metric and health cards
  - Dedicated Auth Modal with 1-click Auto-fill default credentials, Sign In, Sign Up, and Forgot Password flows

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/) installed and running
- [Node.js](https://nodejs.org/) (v20+ recommended)

### 2. Start the Backend (Docker)
```bash
cd docker
cp .env.example .env
docker compose up -d
```
- **Studio Dashboard:** [http://localhost:8000](http://localhost:8000)
  - Default User: `supabase`
  - Default Password: `this_password_is_insecure_and_should_be_updated`
- **Postgres Database:** `localhost:5432` / `localhost:6543`

### 3. Initialize the Database Schema
```bash
# Apply initial schema & sample data to PostgreSQL:
docker exec -i supabase-db psql -U postgres -d postgres < docker/init_schema.sql
```

### 4. Start the Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📁 Project Structure

```
├── docker/                 # Official Supabase self-hosted Docker Compose stack
│   ├── docker-compose.yml  # Multi-container service definitions
│   ├── init_schema.sql     # Database schema, RLS policies, and seed data
│   └── volumes/            # Configuration templates (Envoy, functions, logs)
├── frontend/               # Modern React 19 + Tailwind CSS application
│   ├── src/
│   │   ├── components/     # Navbar, TaskCard, StatsGrid, AuthModal, etc.
│   │   ├── lib/supabase.js # Supabase JS client configuration
│   │   ├── App.jsx         # Main dashboard layout with Realtime subscriptions
│   │   └── main.jsx        # App entry point
│   └── package.json
└── README.md
```

---

## 🛡️ License
Licensed under Apache 2.0.
