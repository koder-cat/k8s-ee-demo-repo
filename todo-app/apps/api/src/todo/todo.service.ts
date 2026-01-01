import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_TOKEN, Database } from '../db/db.module';
import { todos, Todo } from '../db/schema';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(@Inject(DB_TOKEN) private readonly db: Database) {}

  async findAll(): Promise<Todo[]> {
    try {
      return await this.db.select().from(todos).orderBy(todos.createdAt);
    } catch (error) {
      this.logger.error('Failed to fetch todos', error);
      throw new InternalServerErrorException('Failed to fetch todos');
    }
  }

  async create(title: string): Promise<Todo> {
    try {
      const [todo] = await this.db.insert(todos).values({ title }).returning();

      if (!todo) {
        throw new InternalServerErrorException('Failed to create todo');
      }
      return todo;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error('Failed to create todo', error);
      throw new InternalServerErrorException('Failed to create todo');
    }
  }

  async update(
    id: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<Todo | null> {
    try {
      const [todo] = await this.db
        .update(todos)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(todos.id, id))
        .returning();
      return todo || null;
    } catch (error) {
      this.logger.error(`Failed to update todo ${id}`, error);
      throw new InternalServerErrorException('Failed to update todo');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(todos).where(eq(todos.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      this.logger.error(`Failed to delete todo ${id}`, error);
      throw new InternalServerErrorException('Failed to delete todo');
    }
  }
}
