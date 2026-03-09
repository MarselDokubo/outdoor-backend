# Outdoor – Project Structure

## Architectural Principle

Outdoor follows a **Clean Architecture / Layered Modular Monolith** approach.

The goal is:

- Strict separation of concerns
- Infrastructure independence
- Long-term scalability
- Testability of business logic
- Clear evolution path toward service extraction

The inner layers must never depend on outer layers.

Dependencies always flow inward.

---

# Layer Overview

interfaces → application → domain
infrastructure → application → domain
workers → application → domain


Domain is the core.
Everything depends on it.
It depends on nothing.

---

# 1️⃣ domain/

This is the **pure business core** of Outdoor.

This layer is sacred.

No:
- Express
- Prisma
- Redis
- H3 libraries
- Infrastructure imports

Only pure domain concepts.

## Contains

- Entities
- Value Objects
- Domain Events
- Domain Services
- Repository Interfaces (contracts only)

## Example Entities

- User
- Place
- Event
- Visit
- Post
- ActivitySnapshot
- ActivityPattern
- Hotspot

## Example Value Objects

- GeoPoint
- H3Cell
- EnergyScore
- VisitDuration
- PlaceCategory

## Example Domain Events

- VisitRecorded
- PlaceEnergyUpdated
- PostCreated
- HotspotComputed

## Responsibility

Encapsulates:
- Business rules
- Invariants
- Core algorithms
- Energy computation logic

It must be possible to test this entire layer without a database or web server.

---

# 2️⃣ application/

This layer orchestrates domain logic.

Implements use cases.

It coordinates:

- Domain objects
- Repository interfaces
- Transaction boundaries

It does NOT:

- Talk directly to Express
- Talk directly to Redis
- Import Prisma client

## Contains

- Use Cases
- Application Services
- DTOs
- Input/Output Models

## Example Use Cases

- CreateVisitUseCase
- GenerateFeedUseCase
- ComputeEnergyScoreService
- CreatePostUseCase
- CreatePlaceUseCase
- ComputeHotspotUseCase

## Knows About

- Domain layer
- Repository interfaces (contracts only)

It does NOT know about concrete implementations.

---

# 3️⃣ infrastructure/

This layer implements technical details.

It depends on everything.
Nothing depends on it.

## Contains

- Prisma repository implementations
- Redis adapters
- H3 utilities
- Postgres configurations
- External API integrations
- Caching strategies
- Database migrations
- Event queue implementations

## Examples

- PrismaPlaceRepository
- RedisHotspotCache
- H3IndexService
- PostgresVisitRepository

This layer can be swapped without touching domain logic.

---

# 4️⃣ interfaces/

This is the HTTP layer.

Responsible for:

- Controllers
- Request validation
- Routing
- Serialization
- HTTP response formatting
- Authentication middleware

## Converts

HTTP Request → Use Case  
Use Case Result → HTTP Response

This layer knows:

- Express (or Fastify)
- Request schemas
- Authentication logic

It does NOT contain business logic.

---

# 5️⃣ workers/

This is a separate runtime process.

Still part of the same monolith.
Still in the same repository.

Runs background jobs.

## Responsibilities

- Feed rebalance jobs
- Redis rehydration
- ActivitySnapshot generation
- Hotspot recomputation
- Aggregation tasks
- Cleanup jobs

Workers depend on:

application → domain

They may use infrastructure adapters.

---

# Dependency Rules

| Layer | Can Depend On |
|-------|--------------|
| domain | Nothing |
| application | domain |
| infrastructure | application + domain |
| interfaces | application + domain |
| workers | application + domain |

---

# Why This Structure?

1. Protect business logic from framework churn.
2. Allow fast iteration.
3. Enable easy testing.
4. Prepare for horizontal scaling.
5. Enable gradual extraction into microservices if needed.
6. Maintain architectural clarity from day one.

---

# Long-Term Evolution

Because this is a modular monolith:

- Visit logic can later become its own service.
- Feed generation can later become a feed service.
- Hotspot engine can later become a streaming processor.

But today, we move fast inside one deployable unit.

---

# Architectural Identity

Outdoor is:

- Clean at the core
- Modular in structure
- Scalable by design
- Startup-fast in execution
- Enterprise-ready in discipline

This structure allows both speed and control.