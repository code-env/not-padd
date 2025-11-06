# Notpadd

Buildtime CMS for your Next.js application.

## Prerequisites

Before setting up the project locally, make sure you have the following installed:

- Node.js version 18 or higher
- pnpm version 9.0.0 or higher

## Local Setup

Follow these steps to set up the project on your local machine:

1. Clone the repository:

```bash
git clone https://github.com/code-env/not-padd.git
cd not-padd
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create environment files in the root directory and in the apps directories as needed. Refer to the documentation or ask your team for the required environment variables.

4. Set up the database:

Run database migrations to set up the schema:

```bash
pnpm db:migrate
```

Alternatively, you can push the schema directly:

```bash
pnpm db:push
```

5. Start the development servers:

To start all apps and packages:

```bash
pnpm dev
```

To start a specific app, use filters:

```bash
pnpm dev --filter=web
pnpm dev --filter=api
```

The web application will be available at http://localhost:3001 and the API will run on its configured port.

## Project Structure

This is a Turborepo monorepo containing the following:

**Apps:**

- `apps/api` - Hono API server
- `apps/web` - Next.js web application

**Packages:**

- `packages/auth` - Authentication package
- `packages/core` - Core functionality package
- `packages/db` - Database package with migrations
- `packages/env` - Environment variable configuration
- `packages/integrations` - Integration packages
- `packages/notpadd` - Main notpadd package
- `packages/ui` - Shared React component library
- `packages/eslint-config` - ESLint configurations
- `packages/typescript-config` - TypeScript configurations

**Examples:**

- `examples/with-notpadd` - Example Next.js application using notpadd
- `examples/with-notpadd-published` - Example with published content

**Other:**

- `docs` - Project documentation
- `docker-compose.yml` - Docker configuration

## Development

All packages and apps are written in TypeScript. The project uses:

- TypeScript for static type checking
- ESLint for code linting
- Prettier for code formatting

Run linting:

```bash
pnpm lint
```

Run type checking:

```bash
pnpm check-types
```

Format code:

```bash
pnpm format
```

## Build

To build all apps and packages:

```bash
pnpm build
```

To build a specific package:

```bash
pnpm build --filter=web
pnpm build --filter=api
```

## Database Commands

Generate database migrations:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

Push schema changes:

```bash
pnpm db:push
```

Open database studio:

```bash
pnpm db:studio
```
