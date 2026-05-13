# DevBoard — Complete Project Summary

## 📋 Project Overview

**DevBoard** = Self-hosted developer workspace combining Notion + Postman + Grafana features.

**Vision:** One unified platform where developers manage APIs, monitor services, write notes, secure env variables, and explore databases — without switching between 10 tabs.

---

## ✅ Completed Work

### Phase 1: Foundation (NestJS Backend)

#### Auth Module

- Register, Login endpoints
- JWT authentication (access_token + refresh_token)
- Token refresh mechanism
- Password hashing with bcrypt

#### Projects CRUD

- Full CRUD operations with user ownership verification
- REST API following best practices

#### Security & Architecture

- Global JWT Guard (protects all endpoints except @Public)
- JWT Strategy for token verification
- @Public() decorator for public endpoints
- @CurrentUser() custom decorator to inject authenticated user
- Response Interceptor (standardized format: `{ statusCode, message, data }`)
- Global exception handling
- Prisma ORM with PostgreSQL

### Phase 2: API Workspace (NestJS Backend)

#### Collections Module

- CRUD operations nested under projects
- Ownership verification (user → project → collection)
- REST route: `POST /projects/:projectId/collections`

#### Requests Module

- CRUD operations for HTTP requests
- Nested under collections: `POST /collections/:collectionId/requests`
- Flat routes for detail/edit/delete: `GET /requests/:id`, `PATCH /requests/:id`
- Ownership verification across multiple table relations

#### Environments Module

- CRUD for environment variables (dev, staging, production)
- Variables stored as Json array: `[{ key, value, enabled }]`
- Support for isActive flag to switch active environment

#### Core Feature — Send Request (POST /requests/:id/send)

- Execute HTTP requests to external APIs
- **Variable replacement:** Replace `{{base_url}}` with actual values from active environment
- **Request history:** Automatically save every request/response to `request_history` table
- Measure execution time (duration in milliseconds)
- Handle both success (2xx) and error (4xx, 5xx) responses
- Return response body, headers, status code

#### Request History (GET /requests/:id/history)

- Retrieve last 50 sends of a request
- Track statusCode, responseBody, responseHeaders, duration, sentAt timestamp

---

## 🛠️ Tech Stack (Current & Planned)

| Layer               | Technology                | Purpose                             | Status     |
| ------------------- | ------------------------- | ----------------------------------- | ---------- |
| **Frontend**        | React (Next.js 14)        | Web UI                              | ⬜ Phase 5 |
| **Frontend State**  | Redux Toolkit + RTK Query | State management & data fetching    | ⬜ Phase 5 |
| **Frontend UI**     | TailwindCSS + shadcn/ui   | Styling & components                | ⬜ Phase 5 |
| **Core API**        | NestJS                    | Authentication, CRUD, API workspace | ✅ Done    |
| **Database**        | PostgreSQL                | Main data storage                   | ✅ Done    |
| **Cache**           | Redis                     | Session/cache management            | ✅ Done    |
| **ORM**             | Prisma 5                  | Database abstraction layer          | ✅ Done    |
| **HTTP Client**     | Axios                     | Internal API calls                  | ✅ Done    |
| **Monitor Service** | Golang + Gin              | Uptime monitoring, health checks    | ⬜ Phase 3 |
| **DB Explorer**     | Laravel 11                | Database browser & query executor   | ⬜ Phase 4 |
| **Infrastructure**  | Docker Compose            | Local development & production      | ✅ Done    |

---

## 📁 Project Structure

```
devboard/
├── docker-compose.yml                    # PostgreSQL + Redis
├── .gitignore
├── LICENSE (MIT)
│
├── backend/                              # NestJS API
│   ├── src/
│   │   ├── main.ts                       # App entry, Swagger setup
│   │   ├── app.module.ts                 # Root module, APP_GUARD
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts        # Register, Login, Refresh, Me
│   │   │   ├── auth.service.ts           # JWT token logic
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts       # Verify token & fetch user
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts     # Check @Public() decorator
│   │   │   ├── decorators/
│   │   │   │   ├── public.decorator.ts   # Mark endpoints as public
│   │   │   │   └── current-user.decorator.ts # Inject user from request
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   ├── projects/
│   │   │   ├── projects.module.ts
│   │   │   ├── projects.controller.ts    # GET, POST, PATCH, DELETE
│   │   │   ├── projects.service.ts       # CRUD + ownership check
│   │   │   └── dto/
│   │   ├── collections/
│   │   │   ├── collections.module.ts
│   │   │   ├── collections.controller.ts # Nested routes
│   │   │   ├── collections.service.ts
│   │   │   └── dto/
│   │   ├── requests/
│   │   │   ├── requests.module.ts
│   │   │   ├── requests.controller.ts    # Nested + flat routes
│   │   │   ├── request-actions.controller.ts # POST :id/send, GET :id/history
│   │   │   ├── requests.service.ts       # send(), getHistory()
│   │   │   ├── helpers/
│   │   │   │   └── variable-replacer.ts  # Replace {{key}} with values
│   │   │   └── dto/
│   │   ├── environments/
│   │   │   ├── environments.module.ts
│   │   │   ├── environments.controller.ts
│   │   │   ├── environments.service.ts
│   │   │   └── dto/
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts          # @Global() module
│   │   │   └── prisma.service.ts         # Database client
│   │   └── common/
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts
│   │       ├── interceptors/
│   │       │   └── transform.interceptor.ts  # Response wrapper
│   │       ├── decorators/
│   │       │   └── (auth decorators)
│   │       └── types/
│   ├── prisma/
│   │   └── schema.prisma                 # Database models
│   ├── .env.example
│   └── package.json
│
├── frontend/                             # React (Next.js) — ⬜ To Build
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── projects/
│   │   │   ├── workspace/
│   │   │   ├── environments/
│   │   │   ├── notes/
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── store.ts                      # Redux store configuration
│   │   └── utils.ts
│   ├── store/                            # Redux Toolkit slices
│   │   ├── authSlice.ts
│   │   ├── projectsSlice.ts
│   │   ├── api.ts                        # RTK Query endpoints
│   │   └── (other slices)
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   └── shared/                       # Custom components
│   ├── types/
│   │   └── index.ts
│   └── package.json
│
├── monitor-service/                      # Golang — ⬜ Phase 3
│   ├── cmd/server/
│   │   └── main.go
│   ├── internal/
│   │   ├── api/
│   │   ├── ping/
│   │   ├── alert/
│   │   └── models/
│   └── go.mod
│
├── db-explorer/                          # Laravel — ⬜ Phase 4
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   └── composer.json
│
└── README.md
```

---

## 💾 Database Schema (Prisma)

```
User → Project → Collection → Request → RequestHistory
               ↓
            Environment
```

### Models

**User**

- id (Int, primary key)
- email (String, unique)
- password (String, hashed)
- name (String)
- projects (Project[])
- refreshTokens (RefreshToken[])
- createdAt, updatedAt

**Project**

- id (Int, primary key)
- name (String)
- description (String, optional)
- color (String, default: "#3b82f6")
- userId (Int, foreign key)
- user (User)
- collections (Collection[])
- environments (Environment[])
- createdAt, updatedAt

**Collection**

- id (Int, primary key)
- projectId (Int, foreign key)
- project (Project)
- name (String)
- description (String, optional)
- order (Int)
- requests (Request[])
- createdAt, updatedAt

**Request**

- id (Int, primary key)
- collectionId (Int, foreign key)
- collection (Collection)
- name (String)
- method (String: GET, POST, PATCH, DELETE, PUT)
- url (String)
- headers (Json, optional)
- body (Json, optional)
- bodyType (String, optional)
- params (Json, optional)
- order (Int)
- requestHistories (RequestHistory[])
- createdAt, updatedAt

**Environment**

- id (Int, primary key)
- projectId (Int, foreign key)
- project (Project)
- name (String)
- variables (Json array: [{ key, value, enabled }])
- isActive (Boolean, default: false)
- createdAt, updatedAt

**RefreshToken**

- id (Int, primary key)
- token (String, unique)
- userId (Int, foreign key)
- user (User)
- expiresAt (DateTime)
- createdAt (DateTime)

**RequestHistory**

- id (Int, primary key)
- requestId (Int, foreign key)
- request (Request)
- statusCode (Int)
- responseBody (String)
- responseHeaders (Json)
- duration (Int, milliseconds)
- sentAt (DateTime)

---

## 🔐 Authentication Flow

```
1. User registers (POST /auth/register)
   → Hash password → Create user → Return user info

2. User logs in (POST /auth/login)
   → Verify email + password → Sign JWT tokens → Save refresh_token to DB

3. Access token expires
   → User sends refresh_token (POST /auth/refresh)
   → Verify in DB + sign new tokens → Return new tokens

4. Request protected endpoint
   → Global Guard checks @Public() decorator
   → If not public → JwtStrategy verifies token → Fetches user from DB
   → Attaches user to request → Controller can access via @CurrentUser()
```

---

## 🔄 Send Request Flow

```
User clicks "Send" button on request:

1. Frontend POST /requests/:id/send
2. Backend:
   a. Verify user owns request (via collection → project chain)
   b. Find active environment for this project
   c. Replace variables: {{base_url}} → http://localhost:3000
   d. Make HTTP call with axios (method, url, headers, body)
   e. Catch both success (2xx) and error (4xx, 5xx) responses
   f. Save to RequestHistory immediately
   g. Return response + duration to frontend
3. Frontend displays response body, headers, status, timing
4. User can view history anytime via GET /requests/:id/history
```

### Variable Replacement Logic

```typescript
// Input
url: "{{base_url}}/api/users"
variables: [
  { key: "base_url", value: "http://localhost:3000", enabled: true }
]

// Processing
1. Filter enabled variables only
2. For each variable: Replace {{key}} with value using regex
   regex: /\{\{base_url\}\}/g
3. Return replaced string

// Output
"http://localhost:3000/api/users"
```

---

## 🎯 Remaining Phases

| Phase | Name          | Tech      | Purpose                                   | Status  |
| ----- | ------------- | --------- | ----------------------------------------- | ------- |
| 1     | Foundation    | NestJS    | Auth + Projects                           | ✅ Done |
| 2     | API Workspace | NestJS    | Collections, Requests, Environments, Send | ✅ Done |
| 3     | Monitor       | Golang    | Uptime monitoring, alerts                 | ⬜ Next |
| 4     | Database      | Laravel   | DB explorer, query builder                | ⬜      |
| 5     | Integration   | React+RTK | Full frontend UI                          | ⬜      |
| 6     | Tech Notes    | NestJS    | Markdown knowledge base                   | ⬜      |
| 7     | Ship          | All       | Deploy, polish, launch                    | ⬜      |

### Phase 3: Monitor Service (Golang)

- **Purpose:** Health check pinger, uptime monitoring, alert dispatcher
- **Features:**
  - Schedule requests to monitor endpoints
  - Track uptime/downtime history
  - Send alerts (Telegram, webhooks, email)
  - Public status page
- **Learn:** goroutines, channels, worker pools, concurrency

### Phase 4: Database Explorer (Laravel)

- **Purpose:** Connect and browse databases, execute queries
- **Features:**
  - Support PostgreSQL, MySQL, SQLite
  - Schema introspection
  - Execute SQL queries
  - Export results CSV/JSON
- **Learn:** Eloquent ORM, query builder, database drivers

### Phase 5: Integration (React/Next.js)

- **Purpose:** Complete frontend UI for all features
- **Features:**
  - Authentication pages (login, register)
  - Projects dashboard
  - Workspace (collections, requests, environments, send)
  - Request history viewer
  - Settings
- **Learn:** Next.js App Router, Redux Toolkit, RTK Query, shadcn/ui patterns

### Phase 6: Tech Notes (NestJS)

- **Purpose:** Knowledge base and code snippets library
- **Features:**
  - Markdown editor with preview
  - Full-text search
  - Link with projects/requests
  - Code snippet syntax highlighting
- **Learn:** Full-text search, markdown parsing, rich editors

### Phase 7: Ship & Polish

- **Purpose:** Deploy, optimize, launch
- **Features:**
  - Docker production build
  - Nginx reverse proxy
  - SSL certificates (Let's Encrypt)
  - Landing page
  - Documentation
  - Performance optimization

---

## 📚 Key Concepts Learned

### NestJS/Backend

- Module architecture, Dependency Injection
- Guards (JWT), Strategies (Passport), Decorators
- Custom decorators (@Public, @CurrentUser)
- Interceptors (response wrapping)
- Prisma ORM with Json fields, migrations
- Nested route design (RESTful)
- Ownership verification across multiple relations
- Error handling & standardized responses
- Axios for HTTP requests
- Regex for variable replacement

### Database

- One-to-many relations with Cascade delete
- Json fields for dynamic arrays
- Composite queries with include/select
- Migration management

### Frontend (Next.js/React)

- App Router structure
- Redux Toolkit for state management
- RTK Query for data fetching & caching
- shadcn/ui component library
- TailwindCSS for styling
- TypeScript for type safety

### DevOps

- Docker Compose for local development
- Environment variables management
- Multi-service orchestration

---

## 🚀 Next Steps

### Choose One:

**Option 1: Phase 3 (Golang) — Monitor Service**

- Start building background job scheduler
- Learn goroutines and concurrency patterns
- Implement health check pinger

**Option 2: Phase 5 (React/Next.js) — Frontend**

- Setup Next.js project with Redux Toolkit
- Build authentication pages
- Create dashboard UI

**Option 3: Phase 6 (NestJS) — Tech Notes**

- Create knowledge base module
- Implement markdown editor
- Add search functionality

**Option 4: Deploy & Polish**

- Dockerize production setup
- Setup Nginx and SSL
- Deploy to server

---

## 📝 Development Workflow

### Code Style

- **Naming:** camelCase for variables/functions, PascalCase for classes/interfaces
- **Commits:** Conventional Commits format
  ```
  feat(auth): add JWT strategy
  fix(requests): fix variable replacement regex
  docs(readme): update setup instructions
  ```

### Git Workflow

```bash
# Before starting new feature
git pull origin main

# Make changes in feature branch
git checkout -b feature/module-name
git add .
git commit -m "feat(module): description"

# Push and create PR
git push origin feature/module-name
```

### Testing Endpoints

- Use Thunder Client or Postman
- Keep Bearer token handy
- Test both success and error cases
- Verify database changes

### Environment Setup

```bash
# Backend .env
DATABASE_URL="postgresql://root:password@localhost:5432/devboard"
JWT_ACCESS_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3000

# Start
npm run start:dev

# Docker
docker compose up -d
```

---

## 📊 API Endpoints Summary

### Auth

```
POST   /auth/register          # Sign up
POST   /auth/login             # Sign in, get tokens
POST   /auth/refresh-token     # Refresh access token
GET    /auth/me                # Get current user
```

### Projects

```
POST   /projects               # Create project
GET    /projects               # List user's projects
GET    /projects/:id           # Get project details
PATCH  /projects/:id           # Update project
DELETE /projects/:id           # Delete project
```

### Collections

```
POST   /projects/:projectId/collections
GET    /projects/:projectId/collections
PATCH  /collections/:id
DELETE /collections/:id
```

### Requests

```
POST   /collections/:collectionId/requests
GET    /collections/:collectionId/requests
PATCH  /requests/:id
DELETE /requests/:id
POST   /requests/:id/send      # Execute HTTP request
GET    /requests/:id/history   # View request history
```

### Environments

```
POST   /projects/:projectId/environments
GET    /projects/:projectId/environments
PATCH  /environments/:id
DELETE /environments/:id
```

---

## 🔗 Resources

- **NestJS Docs:** https://docs.nestjs.com
- **Prisma Docs:** https://www.prisma.io/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Redux Toolkit:** https://redux-toolkit.js.org
- **Next.js Docs:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## 📄 License

MIT License — Free to use and modify

---

**Last Updated:** May 12, 2026

**Status:** Phase 2 Complete, Ready for Phase 3

**GitHub:** https://github.com/namthanhtran/devboard
