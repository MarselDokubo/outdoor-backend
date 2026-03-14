# Data Persistence Strategy

## Persistence Boundary

Application services must depend on repository interfaces, not raw Prisma client calls.

Current repository scope:

- UserRepository
- AuthIdentityRepository

Prisma implementations live in:

- `src/infrastructure/persistence/prisma/`

## Migration Workflow

### Local development

1. Update `prisma/schema.prisma`
2. Run:
   - `npm run db:migrate -- --name <change_name>`
   - `npm run db:generate`

### Source control

Always commit:

- updated `schema.prisma`
- generated migration folder under `prisma/migrations`

### CI / deployed environments

Use:

- `npm run db:deploy`

Do not use `migrate dev` in deployed environments.

## Seed Strategy

Seed data is for:

- local development bootstrap
- demo/dev convenience
- baseline internal test users

Current seed file:

- `prisma/seed.ts`

Run with:

- `npm run db:seed`
