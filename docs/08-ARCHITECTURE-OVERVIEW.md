# Outdoor – Architecture Overview

## 1. Architecture Style

Outdoor is built as a **Hybrid Clean Modular Monolith**.

It combines:
- Clean Architecture principles (domain isolation)
- Layered application design (Controller → Service → Repository)
- Pragmatic startup velocity

This allows:
- Fast iteration
- Clear boundaries
- Replaceable infrastructure
- Future microservice extraction if needed

---

## 2. Core Philosophy

Postgres = Source of Truth  
Redis = Real-Time Intelligence Layer  
Domain = Business Logic Authority  

Infrastructure is replaceable.
Domain is protected.

---

## 3. High-Level System Components

- API Layer (Express)
- Application Services
- Domain Layer
- Repository Layer
- PostgreSQL
- Redis
- Background Worker
- H3 Spatial Engine

---

## 4. Key Technical Decisions

| Concern | Decision |
|----------|----------|
| Architecture Style | Hybrid Clean Monolith |
| Database | PostgreSQL |
| ORM | Prisma |
| Real-Time Layer | Redis |
| Geo Indexing | Uber H3 |
| Feed Ranking | Redis ZSET |
| Background Jobs | Separate worker process |
| Search | PostgreSQL FTS (Phase 1) |
| Auth | JWT-based custom auth |
| Visit Detection | 60m radius, 20 min dwell |
| Hotspot Model | TTL-based Redis counters |

---

## 5. City Scaling Strategy

Outdoor supports multi-city expansion via:

- Logical partitioning by city_id
- H3 cell grouping
- City-scoped feed keys
- No physical database separation in Phase 1

---

## 6. System Boundary

Outdoor is:

- A discovery engine
- A real-time density intelligence system
- A social amplification layer

It is not:
- A static directory
- A pure social network
- A passive map tool
