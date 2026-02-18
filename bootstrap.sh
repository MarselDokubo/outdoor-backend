#!/usr/bin/env bash

set -e

echo "🚀 Bootstrapping Outdoor Backend..."

# --- Folder Structure ---
mkdir -p src/{core,modules,shared,config}
mkdir -p prisma
mkdir -p docs
mkdir -p infra

# --- Base Files ---
touch README.md
touch .gitignore
touch docker-compose.yml
touch Dockerfile

# --- Initialize Node ---
if [ ! -f package.json ]; then
  npm init -y
fi

# --- Install Dependencies ---
npm install express cors dotenv @prisma/client
npm install -D typescript ts-node-dev @types/node @types/express prisma

# --- Initialize TypeScript ---
npx tsc --init

# --- Initialize Prisma ---
npx prisma init --datasource-provider postgresql

echo "✅ Bootstrap complete."
echo ""
echo "Next steps:"
echo "1. Configure docker-compose.yml"
echo "2. Configure .env with DATABASE_URL"
echo "3. Define Prisma schema"