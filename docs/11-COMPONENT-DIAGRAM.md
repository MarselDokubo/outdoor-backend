# Outdoor – Component Diagram (C4 Level 3)

## API Layer

- AuthController
- PlaceController
- VisitController
- FeedController
- HotspotController

---

## Application Layer

- AuthService
- PlaceService
- VisitService
- FeedService
- HotspotService

---

## Domain Layer

Entities:
- User
- Place
- Visit
- Post
- Event
- ActivitySnapshot
- ActivityPattern

Value Objects:
- GeoPoint
- H3Cell
- EnergyScore

---

## Infrastructure Layer

- PrismaPlaceRepository
- PrismaVisitRepository
- RedisHotspotRepository
- RedisFeedRepository