# Outdoor Backend

Outdoor is a real-time urban discovery engine designed to surface the living pulse of a city.

It enables users to discover:

- Places
- Events
- Social activity
- Cultural hotspots
- Emerging venues
- Trending urban experiences

Outdoor is not a static directory.  
It is not Yelp.  
It is not a passive map.

Outdoor is a spatially anchored, energy-aware, real-time city intelligence layer.

---

## 🌆 Vision

Modern cities are information-dense but visibility-poor.

People struggle to answer:

- What is happening right now?
- Where is the energy?
- What places are actually active?
- What venues are rising?
- What is usually busy at this time?

Outdoor solves this by combining:

- Real-world dwell detection
- Geo-spatial clustering (H3)
- Engagement signals
- Real-time density computation
- Opinionated amplification toward vibrant venues

Phase 1 city: **Port Harcourt**

---

## 🏗 Architecture Overview

Outdoor backend is built as a **Hybrid Clean Modular Monolith**.

It combines:

- Clean Architecture principles (domain isolation)
- Layered application structure
- Real-time intelligence via Redis
- Persistent truth via PostgreSQL
- Spatial partitioning using Uber H3

---

## 🧠 Core Technical Stack

| Concern          | Technology     |
| ---------------- | -------------- |
| Language         | TypeScript     |
| Runtime          | Node.js        |
| API              | Express        |
| Database         | PostgreSQL     |
| ORM              | Prisma         |
| Real-Time Engine | Redis          |
| Geo Indexing     | Uber H3        |
| Containerization | Docker         |
| CI               | GitHub Actions |

---

## 🧩 System Architecture

### Source of Truth

PostgreSQL stores:

- Users
- Places
- Visits
- Posts
- Events
- Historical activity patterns

### Real-Time Intelligence Layer

Redis stores:

- Live hotspot counters
- H3 grid density
- Feed ranking (ZSET)
- Rolling TTL-based activity windows

### Background Worker

Handles:

- Feed rebalancing
- Hotspot rehydration
- Redis recovery
- Ranking recalculations

---

## 🔥 Hotspot Engine

Hotspots are computed using:

- 60m geo-radius
- 20-minute dwell threshold
- H3 spatial partitioning
- TTL-based rolling energy window
- Redis atomic counters

Redis persistence:

- AOF enabled
- RDB snapshots enabled

System can gracefully rebuild hotspot state if needed.

---

## 🧭 Feed Engine

Feed ranking score is derived from:

- Proximity
- Live density
- Engagement
- Recency
- Creator influence
- Vibrancy bias

Ranking is stored in Redis ZSET for millisecond retrieval.

---

## 🏛 Project Structure

src/
├── domain/ # Pure business logic
├── application/ # Use cases & orchestration
├── infrastructure/ # Prisma, Redis, H3
├── interfaces/ # HTTP controllers
├── workers/ # Background jobs
├── shared/ # Value objects
└── config/

Domain layer has no dependency on:

- Prisma
- Redis
- Express

This ensures long-term scalability.

---

## 🔁 Branch Strategy

- `main` → Production-ready
- `dev` → Integration branch
- `feature/*` → Short-lived feature branches

Pull request required for merges into `main`.

---

## 🚀 Local Development

### 1. Install dependencies

npm install

### 2. Start services

docker compose up -d

This starts:

- PostgreSQL
- Redis (with AOF persistence)

### 3. Prisma

npx prisma migrate dev

---

## 🧪 CI Pipeline

GitHub Actions automatically:

- Installs dependencies
- Spins up Postgres + Redis
- Type checks
- Builds project

Triggered on:

- Push to `dev`
- Push to `main`
- Pull requests

---

## 🛡 Privacy Model

- Dwell detection is policy transparent.
- Anonymous IDs supported.
- No raw location trails exposed.
- Live Mode required for public location broadcasting.
- Users control visibility of shared content.

Outdoor measures density — not individual tracking.

---

## 📈 Scaling Strategy

- Stateless API → Horizontal scaling ready
- Redis for real-time performance
- H3 for even spatial partitioning
- Logical city partitioning
- Managed database in production

No microservices (yet).
Modular monolith by design.

---

## 📚 Documentation

Detailed architecture and domain documents available in:

docs/

Includes:

- Vision
- Domain Model
- Business Rules
- C4 Architecture
- Data Flow
- Failure Recovery
- Scaling Strategy

---

## 🎯 Roadmap

Phase 1:

- Port Harcourt
- Core discovery engine
- Hotspot heatmap
- Feed ranking

Phase 2:

- Multi-city expansion
- Advanced personalization
- Event monetization
- Analytics layer

---

## 📄 License

Proprietary – Outdoor Platform
