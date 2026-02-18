# Outdoor – Data Flow

## Visit Creation

1. User location sampled
2. Dwell threshold reached
3. VisitCreated event emitted
4. Visit persisted in Postgres
5. Redis counter incremented
6. Feed score recalculated

---

## Post Creation

1. Post stored in Postgres
2. Feed score calculated
3. Redis ZSET updated

---

## Hotspot Retrieval

1. API queries Redis H3 counters
2. Map heatmap generated
3. Returned to client
