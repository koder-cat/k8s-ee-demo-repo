import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Pool, PoolClient } from 'pg';
import { POOL_TOKEN } from '../db/db.module';

interface HealthCheckResponse {
  status: string;
  database: string;
}

@Controller('health')
@SkipThrottle()
export class HealthController {
  private readonly timeout = 5000;

  constructor(@Inject(POOL_TOKEN) private readonly pool: Pool) {}

  @Get()
  async check(): Promise<HealthCheckResponse> {
    try {
      const client = await Promise.race<PoolClient>([
        this.pool.connect(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Database connection timeout')),
            this.timeout,
          ),
        ),
      ]);
      try {
        await client.query('SELECT 1');
        return { status: 'ok', database: 'connected' };
      } finally {
        client.release();
      }
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'disconnected',
      });
    }
  }
}
