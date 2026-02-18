# Outdoor – System Context Diagram

## Actors

1. Visitor (Anonymous or Registered)
2. Creator
3. Place Owner
4. Admin

---

## External Systems

- Map Provider (Google Maps / Mapbox)
- Push Notification Service
- Payment Provider (future)
- Mobile App Client

---

## System Context (C4 Level 1)

User → Outdoor API → Postgres  
User → Outdoor API → Redis  
Worker → Redis  
Worker → Postgres  

Map SDK → Outdoor API  

Outdoor does NOT expose raw visit trails.

---

## Responsibility Boundaries

Outdoor owns:
- Visit intelligence
- Feed ranking
- Hotspot detection
- Place lifecycle

External systems handle:
- Base map rendering
- Navigation routing