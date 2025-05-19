import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./utils/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_U7DXkiJg4EPB@ep-young-forest-a50lz4vx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
});
