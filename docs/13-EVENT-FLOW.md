# Outdoor – Event Flow

## Core Domain Events

- VisitCreated
- PostCreated
- EngagementUpdated
- PlaceRegistered
- PlaceAutoDiscovered

---

## Event Handling

VisitCreated triggers:

- Redis counter increment
- H3 cell increment
- Feed boost recalculation
