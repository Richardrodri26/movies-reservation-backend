import 'dotenv/config';
import { z } from 'zod';

// Schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  POSTGRES_USER: z.string().nonempty().optional(),
  POSTGRES_DB: z.string().nonempty().optional(),
  POSTGRES_PASSWORD: z.string().nonempty().optional(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().optional(),
  JWT_SECRET: z.string().nonempty(),
});

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  // Print detailed errors and throw to fail fast
  const tree = z.treeifyError(_env.error);
  console.error(
    'Invalid or missing environment variables:',
    JSON.stringify(tree, null, 2),
  );
  throw new Error('Environment validation failed');
}

// Export a strongly-typed env object
export const envs = {
  databaseUrl: _env.data.DATABASE_URL,
  postgresUser: _env.data.POSTGRES_USER,
  postgresDb: _env.data.POSTGRES_DB,
  postgresPassword: _env.data.POSTGRES_PASSWORD,
  nodeEnv: _env.data.NODE_ENV,
  port: _env.data.PORT ?? 3000,
  jwtSecret: _env.data.JWT_SECRET,
};

export type Env = typeof envs;
