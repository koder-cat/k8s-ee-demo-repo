import { pgTable, serial, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const todos = pgTable(
  'todos',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('todos_created_at_idx').on(table.createdAt)],
);

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
