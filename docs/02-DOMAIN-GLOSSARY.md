# Domain Glossary

---

## User

An individual interacting with the platform.

Types:

- AnonymousUser
- RegisteredUser
- Creator
- Owner

---

## City

A geographic boundary that contains Places and activity.

---

## Place

A physical venue with geographic coordinates.

Examples:

- Club
- Restaurant
- Event venue
- Mall
- Game center

---

## Visit

A confirmed presence signal.

A Visit occurs when:

- User remains within 60m radius
- For ≥ 20 minutes

Immutable once recorded.

---

## Post

User-generated content attached to a Place.

---

## Engagement

Interaction with content or place:

- Like
- Comment
- Share
- Save

---

## ActivitySnapshot

A real-time energy representation of a Place.

Derived from:

- Recent visits
- Engagement

---

## ActivityPattern

Historical activity trend of a Place.

Used for informational display only.

---

## Hotspot

A spatial density projection across the city.

Derived from:

- Recent Visits
- Engagement
- Category weighting

Displayed as a heatmap.

## MediaAsset

A binary file (Image/Video) associated with a Post or Place.

States: > - PENDING: Upload started but not verified.

PROCESSING: Optimization/Transcoding in progress.

READY: Optimized and visible in the Discovery Engine.

CDN (Content Delivery Network)
The edge-cached layer for serving MediaAssets to users in Port Harcourt to minimize latency.
