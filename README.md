# k8s-ee Demo Repository

This repository demonstrates the [k8s-ephemeral-environments](https://github.com/genesluna/k8s-ephemeral-environments) platform with a sample Todo application.

## Todo App

A full-stack todo list application showcasing PR preview environments.

### Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS 11, TypeScript, Drizzle ORM
- **Database:** PostgreSQL 16
- **Package Manager:** pnpm (monorepo)

### Local Development

```bash
cd todo-app

# Start everything (PostgreSQL + migrations + dev servers)
pnpm dev:local

# API: http://localhost:3000
# Web: http://localhost:5173

# Stop services
pnpm teardown
```

### PR Preview Environments

When you open a PR, the GitHub Action will automatically:

1. Build the Docker image
2. Deploy to the k3s cluster
3. Create a PostgreSQL database
4. Run migrations
5. Comment on the PR with the preview URL

Preview URL format: `https://todo-app-pr-{number}.k8s-ee.genesluna.dev`

When the PR is closed, the environment is automatically destroyed...
