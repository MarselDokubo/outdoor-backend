# Outdoor – Container Diagram (C4 Level 2)

## Containers

1. API Server (Node.js / Express)
2. Background Worker (Node.js process)
3. PostgreSQL Database
4. Redis Cache Layer

---

## API Server Responsibilities

- Authentication
- Content creation
- Visit ingestion
- Feed retrieval
- Hotspot retrieval

---

## Background Worker Responsibilities

- Feed rebalance jobs
- Hotspot decay monitoring
- Redis recovery rehydration
- Ranking recalculation

---

## Data Flow

Client → API → Postgres  
Client → API → Redis  
Worker → Redis  
Worker → Postgres  