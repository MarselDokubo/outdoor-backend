# Outdoor – Vision & Product Philosophy

---

## 1. Purpose

Outdoor is a real-time urban discovery engine that surfaces city energy through verified behavioral signals.

Outdoor enables users to discover:

- Active places
- Events
- Social venues
- Cultural activity
- Trending neighborhoods
- Emerging urban experiences

Outdoor is not a directory.
It is not Yelp.
It is not a static event calendar.

Outdoor is a living behavioral map of the city.

---

## 2. Core Problem

Modern cities are information-dense but visibility-poor.

Users struggle to answer:

- What is happening right now?
- Where are people gathering?
- Which venues are truly active?
- What places are rising?
- What neighborhoods are alive?

Existing systems fail in different ways:

### Google Maps
- Static
- Review-based
- Not energy-aware

### TikTok / Instagram
- Content-heavy but geographically noisy
- Globalized feeds dilute local discovery

### Event Listings
- Fragmented
- Often outdated
- No live density awareness

There is no real-time, energy-aware, spatially grounded urban layer.

Outdoor fills that gap.

---

## 3. Core Identity

Outdoor is:

- Signal-driven
- Spatially anchored
- Behavior-based
- Socially amplified
- Ecosystem-aware
- Intentionally opinionated toward energy

Outdoor amplifies confirmed presence, not marketing claims.

Primary signal: Visit.
Secondary signals: Engagement and content.

Energy is earned, not declared.

---

## 4. Strategic Bias

Outdoor intentionally promotes energetic and social experiences.

This includes:

- Clubs
- Events
- Restaurants
- Games
- Social venues
- Pop-ups
- Cultural gatherings

Bias is applied through ranking multipliers.

However:
- Exposure dampening prevents monopolization.
- New venues must have a path to visibility.
- The ecosystem must remain healthy.

Outdoor promotes activity, not dominance.

---

## 5. Temporal Intelligence

Outdoor models energy across two independent layers.

### 5.1 Real-Time Energy (ActivitySnapshot)

Used for:
- Feed ranking
- Hotspot heatmap
- Trending display

Driven by:
- Recent visits
- Engagement signals
- Category weighting

Continuously recalculated.

---

### 5.2 Historical Pattern (ActivityPattern)

Used for:
- Informational display
- Planning insights
- Habit visualization

Examples:
- “Usually busy at 9PM”
- “Peak hours: Friday 10PM”

Does NOT influence ranking.

---

## 6. Spatial Intelligence – Hotspot

Hotspot is a spatial density projection across a city.

It visualizes:
- Concentration of recent visits
- Engagement-weighted activity
- Category-influenced intensity

Rendered as a heatmap.

Hotspot is:
- Aggregated
- Derived
- Recalculated periodically
- Not user-editable

---

## 7. Visit Definition

A Visit is confirmed when:

- User remains within 60 meters of a Place
- For at least 20 continuous minutes
- With stable GPS confirmation

Visits are immutable.

Visits are the foundational authenticity signal.

---

## 8. Phase 1 Scope

City: Port Harcourt  
Architecture: Modular monolith  
Database: PostgreSQL  
ORM: Prisma  
Partitioning: Logical city-based partition  

Future cities will expand via logical boundaries.

---

## 9. Long-Term Vision

Outdoor becomes:
- A city energy index
- A spatial-social intelligence layer
- A behavioral urban signal network

It becomes the operating system of urban discovery.
