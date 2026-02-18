# Outdoor – Scaling Strategy

## Horizontal Scaling

API server can scale horizontally because:

- No in-memory session dependency
- Redis used for shared state
- JWT stateless auth

---

## Hotspot Scaling

H3 grid ensures:

- Even distribution
- Efficient heatmap queries
- No heavy geospatial joins

---

## Feed Scaling

Redis ZSET allows:
- O(log N) ranking operations
- Instant top-N retrieval