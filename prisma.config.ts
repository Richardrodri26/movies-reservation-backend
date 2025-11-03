import dotenv from 'dotenv';
import { defineConfig, env } from "prisma/config";

// Load .env early so env("...") finds the variables when this file is imported by the Prisma CLI.
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
