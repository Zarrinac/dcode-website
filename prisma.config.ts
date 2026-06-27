// Prisma CLI config. Prisma 7 reads the datasource URL from here (the schema's
// datasource has no `url` because the runtime client uses a driver adapter, see
// lib/db.ts). Loads `.env`, then `.env.local` (dev) / `.env.production` (prod) on top.
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

loadEnv();

if (process.env.NODE_ENV === 'production') {
  loadEnv({ path: '.env.production', override: true });
} else {
  loadEnv({ path: '.env.local', override: true });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
