# Outdoor – Failure & Recovery

## Redis Restart

Strategy:
- AOF persistence
- Graceful background rehydration
- No user-visible crash

---

## Postgres Failure

System becomes read-only.
Hotspots may temporarily degrade.
Visits are queued for retry.

---

## API Failure

Container restart.
Stateless recovery.