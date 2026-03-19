# OUTDOOR Implementation Order

## Purpose

This document defines the recommended implementation order for the OUTDOOR platform and explains what each phase should contain, what it depends on, and why it should be built in that sequence.

The core principle is:

**Build source-of-truth business capabilities first. Build derived intelligence and rich presentation later.**

That means the system should be implemented in the following order:

1. Identity and access
2. Geo/location foundation
3. Places
4. Content and activity
5. Engagement signals
6. Discovery intelligence
7. Map visualization and richer UX
8. Analytics and dashboards

---

## Guiding Principles

### 1. Build facts before projections

Core records such as users, places, posts, events, and visits are source-of-truth facts.  
Hotspots, feeds, and recommendations are derived from those facts.

### 2. Build capabilities before polish

Location modeling and geo queries are more important than map skins early on.

### 3. Build dependencies in the right direction

Later features should depend on earlier foundational concepts, not the other way around.

### 4. Separate core business model from read models

The domain should own business truth. Discovery layers should read from it and compute useful outputs.

---

# Phase 1: Identity and Access

## Goal

Establish who is using the platform, what permissions they have, and how the application identifies them internally.

## Why this comes first

Almost every protected action depends on identity:

- creating places
- posting content
- creating events
- claiming ownership
- moderation
- notifications
- personalization

Without identity and role handling, the rest of the system lacks ownership and permission boundaries.

## What this phase includes

### Core concepts

- User
- AuthIdentity
- Role model

### Capabilities

- authentication
- authorization
- current user resolution
- internal user mapping
- role-based access control

### Typical responsibilities

- sign in
- resolve current user
- identify internal user from external identity provider
- protect routes and use cases

## Main outputs

- authenticated user context
- internal user record
- role source of truth

## Dependencies

None at the business level.

---

# Phase 2: Geo and Location Foundation

## Goal

Create the location model the platform depends on.

## Why this comes early

OUTDOOR is location-driven.  
The app cannot properly support nearby discovery, place relevance, hotspot logic, or map experiences without a consistent geo foundation.

## What this phase includes

### Core concepts

- GeoPoint
- Address
- Area / neighborhood concept if needed later

### Capabilities

- coordinates on places
- browser geolocation input
- distance calculations
- nearby/radius search
- geocoding and reverse-geocoding abstractions

### Important distinction

This phase is about **location truth**, not visual map rendering.

## Main outputs

- a stable representation of location
- geo-aware domain and query capability
- distance/proximity rules

## Dependencies

- identity may optionally enhance personalization, but geo foundation can exist without full social features

---

# Phase 3: Places

## Goal

Model places as one of the central aggregate roots of the platform.

## Why this comes early

Places are likely one of the strongest anchors in the OUTDOOR domain.  
Events, posts, visits, and hotspot logic will likely connect to places.

## What this phase includes

### Core concepts

- Place
- Place metadata
- Place category
- location attached to place
- maybe PlaceClaim later

### Capabilities

- create place
- edit place
- view place
- search places
- discover nearby places

### Supporting concepts

- place description
- contact details
- business type/category
- hours later
- claim flow later

## Main outputs

- source-of-truth place records
- place details page model
- place search/discovery inputs

## Dependencies

- identity
- geo/location foundation

---

# Phase 4: Media Capability

## Goal

Support photos and videos attached to domain concepts such as places, posts, and events.

## Why this comes after places

Media usually belongs to something.  
It should not be implemented as an isolated feature without ownership context.

## What this phase includes

### Core concepts

- Media as supporting entity or capability
- media ownership rules
- media metadata

### Capabilities

- upload media
- attach media to place
- attach media to post
- attach media to event
- manage media lifecycle

### Architectural note

Media is often a supporting subdomain rather than a top-level aggregate root.

## Main outputs

- media storage abstraction
- media attachment model
- media rendering support

## Dependencies

- place or content entities must exist first
- object storage decision may come here

---

# Phase 5: Content and Activity

## Goal

Introduce the primary activity facts that make the platform come alive.

## Why this comes here

Once users and places exist, the platform can begin to capture meaningful actions and public activity.

## What this phase includes

### Core concepts

- Event
- Post
- Visit

### Event responsibilities

- create event
- publish event
- relate event to place or area if applicable
- manage event state

### Post responsibilities

- create post
- attach to place or experience
- publish post
- moderate post later

### Visit responsibilities

- record visit/check-in
- relate user to place in time
- create location-based activity signal

## Main outputs

- source-of-truth activity data
- user-generated and system-observed facts
- content the platform can later rank and recommend

## Dependencies

- identity
- places
- geo foundation
- media support if content needs visuals

---

# Phase 6: Engagement Signals

## Goal

Capture the interactions that indicate interest, quality, and momentum.

## Why this comes after content/activity

Engagement depends on something being present to engage with:

- places
- posts
- events
- visits

## What this phase includes

### Core concepts

- View / impression
- Comment
- Follow
- Reaction
- Save / bookmark

### Important note

“Engagement” is not one entity.  
It is a category of interaction signals.

### Capabilities

- count views
- add comments
- follow users, places, or creators if relevant
- react to posts/events
- save/bookmark content

## Main outputs

- interaction facts
- signal data that later powers ranking
- richer user behavior graph

## Dependencies

- identity
- places
- content/activity

---

# Phase 7: Discovery Intelligence

## Goal

Compute the derived models that help users discover what matters.

## Why this comes later

Hotspots, feeds, and recommendations depend on the existence of:

- places
- events
- posts
- visits
- engagement signals
- location logic

They are not raw business facts. They are derived intelligence.

## What this phase includes

### Derived models

- Hotspot
- Feed
- Recommendations

### Hotspot

A hotspot should usually be treated as:

- a computed signal
- a ranking result
- a read model
- a geospatial trend projection

It should not be assumed to be a primary aggregate root unless business rules demand that.

### Feed

Feed is usually:

- a projection
- ranking logic
- ordered query output
- personalized or non-personalized discovery stream

### Recommendations

Recommendations use:

- location
- trending signals
- engagement
- freshness
- role/user context if personalized

## Main outputs

- trending places
- discovery feed
- nearby recommendations
- hotspot ranking by place/area/zone

## Dependencies

- identity
- location
- places
- content/activity
- engagement

---

# Phase 8: Map Visualization and Rich Discovery UX

## Goal

Turn location and discovery intelligence into an engaging interface.

## Why this comes after geo and discovery

The visual map is not the source of truth.  
It should visualize and enhance already-meaningful data.

## What this phase includes

### Capabilities

- map provider integration
- markers/pins
- clusters
- area overlays
- hotspot visualization
- nearby place display
- map-based exploration UI

### Important distinction

Map presentation depends on:

- location truth
- places with coordinates
- optionally hotspot or recommendation outputs

It should not be the first location-related thing built.

## Main outputs

- interactive city map
- discovery-first landing experience
- map-enhanced browsing

## Dependencies

- geo foundation
- places
- discovery intelligence

---

# Phase 9: Notifications and Background Work

## Goal

Support asynchronous workflows and user/system messaging.

## Why this comes here

Once the core flows exist, the system can start reacting asynchronously to state changes.

## What this phase includes

### Capabilities

- notification queue
- background jobs
- retry/backoff
- worker processes
- deduplicated jobs
- event-driven follow-up behavior

### Examples

- welcome notification
- claim-submitted notification
- moderation notification
- cache invalidation
- cleanup jobs

## Main outputs

- async execution model
- non-blocking user flows
- operational background processing

## Dependencies

- identity
- domain events/use cases worth reacting to

---

# Phase 10: Analytics, Metrics, and Dashboards

## Goal

Measure system health and business behavior.

## Why this comes last

Dashboards and analytics become meaningful once the system has:

- users
- places
- content
- visits
- engagement
- discovery outputs

## What this phase includes

### Engineering metrics

- request rates
- latencies
- error rates
- queue metrics
- worker failures
- Redis health
- DB health

### Product/business analytics

- active users
- place views
- visits per area
- event performance
- engagement rates
- recommendation performance
- hotspot trends

### Dashboards

- operational dashboards
- business dashboards
- alerting rules

## Main outputs

- observability
- business intelligence
- decision support

## Dependencies

- real domain flows must already exist

---

# Dependency Summary

## High-level dependency chain

```text
Identity / Roles
→ Geo Foundation
→ Places
→ Media
→ Events / Posts / Visits
→ Engagement Signals
→ Hotspot / Feed / Recommendations
→ Map Visualization
→ Analytics / Dashboards
```
