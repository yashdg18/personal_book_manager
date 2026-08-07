# Personal Book Manager

A full-stack personal reading tracker. Register, log your books, track status (Want to Read / Reading / Completed), filter and search your library, and see everything summarized on a dashboard.

## Features

**Authentication**
- Register / login / logout with JWT stored in an HTTP-only cookie
- Password hashing with bcrypt
- Persistent login across page refreshes
- Protected routes on both frontend (middleware) and backend (route middleware)

**Book management**
- Create, update, delete, and view books
- Filter by status and by tags
- Full-text search across title and author
- Instant inline status change from the book list or dashboard

**Dashboard**
- Total books, and per-status counts (Want to Read / Reading / Completed)
- 5 most recently added books

**UI**
- Responsive layout, dark mode, soft shadows, rounded cards, Lucide icons

## Tech Stack

**Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Axios, React Hook Form, Zod, next-themes, Lucide React

**Backend:** Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, bcryptjs, dotenv, cookie-parser, cors, morgan

**Deployment:** Frontend → Vercel · Backend → Render · Database → MongoDB Atlas

## Project Structure

```
personal-book-manager/
├── backend/
│   ├── config/db.js
│   ├── controllers/       # authController, bookController
│   ├── middlewares/       # authMiddleware, errorMiddleware
│   ├── models/            # User, Book
│   ├── routes/            # authRoutes, bookRoutes
│   ├── utils/             # generateToken, asyncHandler
│   ├── validators/        # authValidator, bookValidator
│   ├── app.js              # Express app config
│   └── server.js           # entry point
│
└── frontend/
    ├── app/
    │   ├── (auth)/login/, (auth)/register/
    │   ├── dashboard/
    │   └── books/, books/add/, books/[id]/edit/
    ├── components/         # ui/, books/, dashboard/
    ├── hooks/              # useAuth, useBooks
    ├── lib/                # axios instance, zod schemas
    ├── services/           # authService, bookService
    ├── types/              # user.ts, book.ts
    ├── context/AuthContext.tsx
    └── middleware.ts        # route protection
```

## Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your real values
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev              # http://localhost:3000
```

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. `https://your-app.vercel.app`) |

**frontend/.env.local**
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `https://your-api.onrender.com/api`) |

## API Endpoints

```
POST   /api/auth/register        Register a new user
POST   /api/auth/login           Log in
POST   /api/auth/logout          Log out                      (protected)
GET    /api/auth/me              Get current user              (protected)

GET    /api/books                List books  ?status=&tags=&search=
GET    /api/books/stats          Dashboard stats
GET    /api/books/:id            Get a single book
POST   /api/books                Create a book
PUT    /api/books/:id            Update a book
PATCH  /api/books/:id/status     Change only the status
DELETE /api/books/:id            Delete a book
```
All `/api/books` routes require authentication and are automatically scoped to the logged-in user.

## Deployment Steps

**1. MongoDB Atlas**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and allow network access from anywhere (0.0.0.0/0) for Render
3. Copy the connection string into `MONGO_URI`

**2. Backend → Render**
1. Push `backend/` to GitHub
2. New Web Service on Render → connect the repo → root directory `backend`
3. Build command: `npm install` · Start command: `node server.js`
4. Add env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV=production`
5. A `render.yaml` blueprint is included in `backend/` for one-click setup

**3. Frontend → Vercel**
1. Push `frontend/` to GitHub
2. Import project on Vercel → root directory `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL` = your Render backend URL + `/api`
4. Deploy

**4. Final step**
Update `CLIENT_URL` on Render to your live Vercel URL, and redeploy the backend so CORS allows it.

## Known tradeoffs

- Backend intentionally stays plain JavaScript (per assignment spec) rather than TypeScript.
- `next@15` is pinned per spec rather than `next@16` (latest); this means 3 high-severity advisories in Next's bundled build-time dependencies (`postcss`, `sharp`) remain unresolved upstream — these affect the build toolchain, not runtime request handling, and will be fixed automatically whenever the assignment scope allows moving to Next 16.
- Frontend middleware checks only for the *presence* of the JWT cookie (fast, edge-level UX guard); actual token validity is enforced on every API call by the backend's `authMiddleware` — the real security boundary.
