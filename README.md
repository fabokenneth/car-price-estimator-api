# car-price-estimator-api

A REST API built with NestJS that allows users to submit car sale reports and get estimated prices based on approved historical data filtered by make, model, year, mileage, and location.

## Tech Stack

- **Framework:** NestJS 11 + TypeScript
- **Database:** SQLite (development/test) · PostgreSQL (production)
- **ORM:** TypeORM 0.3
- **Auth:** Cookie-session + scrypt password hashing
- **Validation:** class-validator · class-transformer

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.development` file at the project root:

```env
COOKIE_KEY=your_secret_key
```

For production, create `.env.production`:

```env
COOKIE_KEY=your_secret_key
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Running the App

```bash
# development (SQLite, watch mode)
npm run start:dev

# production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## API Reference

### Auth — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Register a new user |
| `POST` | `/auth/signin` | — | Sign in |
| `POST` | `/auth/signout` | Required | Sign out |
| `GET` | `/auth/whoami` | Required | Get current user |
| `GET` | `/auth/:id` | — | Get user by ID |
| `GET` | `/auth?email=` | — | Find users by email |
| `PATCH` | `/auth/:id` | — | Update user |
| `DELETE` | `/auth/:id` | — | Delete user |

**Signup / Signin body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

### Reports — `/reports`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/reports` | — | Get price estimate |
| `POST` | `/reports` | Required | Submit a new report |
| `PATCH` | `/reports/:id` | Admin | Approve / reject a report |

**Create report body:**
```json
{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "mileage": 30000,
  "lng": -73.935242,
  "lat": 40.730610,
  "price": 18000
}
```

**Get estimate query params:**
```
GET /reports?make=Toyota&model=Corolla&year=2020&mileage=30000&lng=-73.9&lat=40.7
```

Returns `{ "price": "17500.00" }` — the average of up to 3 approved reports closest in mileage, within ±5° location and ±3 years.

## Testing

```bash
# unit tests
npm run test

# unit tests in watch mode
npm run test:watch

# e2e tests (spins up full app with test SQLite DB)
npm run test:e2e

# coverage
npm run test:cov
```

## Database Migrations

```bash
# generate migration from entity changes
npm run typeorm -- migration:generate migrations/<name> -d data-source.ts

# run pending migrations
npm run typeorm -- migration:run -d data-source.ts

# revert last migration
npm run typeorm -- migration:revert -d data-source.ts
```

> Migrations run automatically on startup in `test` and `production` environments (`migrationsRun: true`).

## Deployment (Vercel)

1. Add a `vercel.json` at the root pointing builds to `dist/main.js`
2. Set `NODE_ENV=production`, `DATABASE_URL`, and `COOKIE_KEY` in Vercel environment variables
3. Use a hosted Postgres provider (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/
├── app.module.ts          # Root module — global config, TypeORM, cookie-session
├── main.ts                # Bootstrap
├── config/
│   └── database.config.ts # Environment-based DB config
├── guards/
│   ├── auth.guard.ts      # Checks session.userId
│   └── admin.guard.ts     # Checks currentUser.admin
├── interceptors/
│   └── serialize.interceptor.ts  # @Serialize() DTO filter
├── users/                 # Auth + user management
└── reports/               # Car reports + price estimation
migrations/                # TypeORM migration files
```

## License

MIT
