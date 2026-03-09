#!/usr/bin/env bash
set -euo pipefail

echo "===> 1. Docker services"
docker compose ps

echo
echo "===> 2. PostgreSQL readiness"
docker compose exec -T postgres pg_isready -U postgres

echo
echo "===> 3. Redis readiness"
docker compose exec -T redis redis-cli ping

echo
echo "===> 4. Prisma validation"
npx prisma validate

echo
echo "===> 5. Prisma migration status"
npx prisma migrate status

echo
echo "===> 6. Build check"
npm run build

echo
echo "===> 7. Port check"
ss -ltnp | grep -E '3000|5432|6379' || true

echo
echo "System check completed."
