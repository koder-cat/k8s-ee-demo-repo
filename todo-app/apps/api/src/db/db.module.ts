import {
  Global,
  Module,
  OnApplicationShutdown,
  Inject,
  Logger,
} from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DB_TOKEN = 'DB_CONNECTION';
export const POOL_TOKEN = 'PG_POOL';

export type Database = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: POOL_TOKEN,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL environment variable is not configured');
        }
        return new Pool({
          connectionString,
          max: parseInt(process.env.DB_POOL_MAX || '10', 10),
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
    },
    {
      provide: DB_TOKEN,
      inject: [POOL_TOKEN],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
  ],
  exports: [DB_TOKEN, POOL_TOKEN],
})
export class DbModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DbModule.name);

  constructor(@Inject(POOL_TOKEN) private readonly pool: Pool) {}

  async onApplicationShutdown() {
    this.logger.log('Closing database connections...');
    await this.pool.end();
    this.logger.log('Database connections closed');
  }
}
