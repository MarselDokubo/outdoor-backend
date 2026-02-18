🔷 C4 MODEL – LEVEL 1
System Context Diagram
🎯 Purpose

Shows how Outdoor interacts with the world.

C4 Description

Primary Actors:

Visitor (Anonymous or Registered)

Creator

Place Owner

Admin

External Systems:

Map Provider (Google Maps / Mapbox)

Push Notification Service

Hosting Provider

Payment Gateway (future)

System Under Design:

Outdoor Platform

Mermaid (Level 1 – Context)

Copy this into docs/diagrams/system-context.md

C4Context
    title Outdoor - System Context

    Person(visitor, "Visitor", "Discovers places and hotspots")
    Person(creator, "Creator", "Creates location-based content")
    Person(owner, "Place Owner", "Manages venue presence")

    System(outdoor, "Outdoor Platform", "Urban discovery engine")

    System_Ext(map, "Map Provider", "Google Maps / Mapbox")
    System_Ext(push, "Push Service", "Push notifications")
    System_Ext(payment, "Payment Gateway", "Future monetization")

    Rel(visitor, outdoor, "Uses")
    Rel(creator, outdoor, "Creates content")
    Rel(owner, outdoor, "Manages place")

    Rel(outdoor, map, "Loads map data")
    Rel(outdoor, push, "Sends notifications")
    Rel(outdoor, payment, "Handles payments (future)")

🔷 C4 MODEL – LEVEL 2
Container Diagram
🎯 Purpose

Shows high-level runtime components.

Containers

API Server (Node / Express)

Background Worker

PostgreSQL

Redis

Mobile Client

Mermaid (Level 2 – Container)
C4Container
    title Outdoor - Container Diagram

    Person(user, "User")

    Container(mobile, "Mobile App", "Flutter/React Native", "Client interface")
    Container(api, "API Server", "Node.js / Express", "Handles requests")
    Container(worker, "Background Worker", "Node.js", "Processes async jobs")
    ContainerDb(postgres, "PostgreSQL", "Database", "Source of truth")
    Container(redis, "Redis", "In-memory store", "Real-time intelligence")

    Rel(user, mobile, "Uses")
    Rel(mobile, api, "Calls API")
    Rel(api, postgres, "Reads/Writes")
    Rel(api, redis, "Reads/Writes")
    Rel(worker, redis, "Processes counters")
    Rel(worker, postgres, "Reads/Writes")

🔷 C4 MODEL – LEVEL 3
Component Diagram (Inside API)
Components

Controllers

Application Services

Domain Layer

Repositories

Redis Adapter

Prisma Adapter

Mermaid (Level 3 – Component)
flowchart TB
    subgraph API Server
        Controller --> Service
        Service --> Domain
        Service --> Repository
        Repository --> Prisma
        Service --> RedisAdapter
    end


This reflects:

Controller → Service → Domain
Service → Repository → Prisma
Service → RedisAdapter

Clean but pragmatic.

🔷 H3 + Redis Hotspot Architecture Diagram
flowchart LR
    VisitEvent --> Postgres
    VisitEvent --> RedisPlaceCounter
    VisitEvent --> RedisH3Counter

    RedisH3Counter --> Heatmap
    RedisPlaceCounter --> FeedRanking

🔷 Feed Ranking Diagram
flowchart TB
    PostCreated --> ComputeScore
    VisitCreated --> ComputeScore
    EngagementUpdated --> ComputeScore

    ComputeScore --> RedisZSET
    RedisZSET --> FeedAPI

🔷 Visit Detection Sequence Diagram
sequenceDiagram
    participant User
    participant App
    participant API
    participant Redis
    participant Postgres

    User->>App: Opens app
    App->>App: Track location (60m radius)
    App->>App: 20 min dwell confirmed
    App->>API: Create Visit
    API->>Postgres: Persist Visit
    API->>Redis: INCR hotspot counter
    API->>Redis: Update H3 cell

🔷 Redis Key Design (Formal)

Document this in architecture docs.

hotspot:place:{placeId}
hotspot:h3:{resolution}:{cellId}
feed:city:{cityId}
feed:user:{userId}
density:history:{placeId}:{date}


All TTL-based except history.

🔷 Scaling Architecture (Visual)
flowchart LR
    Mobile --> API1
    Mobile --> API2
    Mobile --> API3

    API1 --> RedisCluster
    API2 --> RedisCluster
    API3 --> RedisCluster

    API1 --> PostgresPrimary
    API2 --> PostgresPrimary
    API3 --> PostgresPrimary


Stateless API scaling.
Shared Redis.
Shared DB.

🔷 Recovery Strategy Diagram
flowchart LR
    RedisRestart --> CheckAOF
    CheckAOF --> RestoreState
    RestoreState --> ResumeHotspot

    IfEmpty --> WorkerRehydrate
    WorkerRehydrate --> RedisRebuild