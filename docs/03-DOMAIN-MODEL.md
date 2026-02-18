# Domain Model

---

## Core Entities

### City
- id
- name
- boundaryPolygon

### Place
- id
- cityId
- name
- category
- latitude
- longitude
- createdAt

### User
- id
- type
- createdAt

### Visit
- id
- userId
- placeId
- startedAt
- endedAt
- confirmed (boolean)

Immutable.

### Post
- id
- userId
- placeId
- mediaUrl
- caption
- createdAt

### Engagement
- id
- userId
- targetType (Post | Place)
- targetId
- type (like, comment, save, share)
- createdAt

---

## Derived Projections

### ActivitySnapshot
- placeId
- visitCountRecent
- engagementScore
- energyScore
- updatedAt

Recalculated periodically.

---

### ActivityPattern
- placeId
- dayOfWeek
- hour
- averageVisitCount

Historical only.

---

### HotspotCell
- cityId
- gridLat
- gridLng
- densityScore
- heatLevel
- updatedAt

Aggregated from ActivitySnapshot.
