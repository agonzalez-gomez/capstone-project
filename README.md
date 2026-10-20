# Troubleshooting App

An interactive help center for medical device users. Users work through step-by-step troubleshooting guides, report whether each step fixed their issue, and submit a support ticket if the guide did not help. Every visit is recorded as a session, so the team can see which guides resolve issues and where users get stuck.

UA Coding Bootcamp capstone project. See [PROPOSAL.md](PROPOSAL.md) for the project proposal and [IDEAS.md](IDEAS.md) for the original project ideas.

## Features

- **Accounts:** Sign up and log in with an email and password. Passwords are hashed with `bcrypt` and sessions use JWTs.
- **Article browsing:** Search articles by title, or browse them grouped by category with a category filter.
- **Step-by-step guides:** Each article is a series of pages. Every page asks "Did this fix it?"
  - **Yes:** The user rates the article (1-5 stars) and can leave a comment.
  - **No:** The user continues to the next step.
  - **On the last page:** "No" opens a support ticket form.
- **Session tracking:** A session is created when a user opens an article and updated as they move between pages, recording the page reached, whether the issue was resolved, and any rating and comments.
- **Support tickets:** Users describe their issue, and the ticket records which article and page they were on.
- **My Tickets:** A customer portal listing the user's tickets with status and submission date.
- **Article statistics:** Each article shows its average rating, resolution rate, number of uses, and the page that most often resolves the issue. Statistics are totals only and never include user ids or comments.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, MUI, React Router |
| Backend | Node.js, Express, TypeScript (run with `tsx`) |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcrypt` |

## Project Structure

```
capstone-project/
├── client/                 React frontend
│   └── src/
│       ├── components/     Layout, navigation, dialogs, stats footer
│       ├── context/        Auth context
│       ├── hooks/          useAuth
│       ├── pages/          Home, Article, Tickets, About, Login, SignUp
│       ├── services/api.ts All requests to the backend
│       └── router.tsx      Client routes
└── server/                 Express backend
    ├── db/                 MongoDB connection
    ├── middlewares/        JWT verification
    ├── models/             Users, Articles, Sessions, Tickets
    ├── routes/             One file per endpoint
    ├── scripts/            Article seed script and seed data
    └── server.ts           Route registration
```

## Getting Started

### Prerequisites

- Node.js (developed on v24)
- A MongoDB database, either running locally or on MongoDB Atlas

### 1. Install dependencies

From the project root:

```bash
npm run install-all
```

### 2. Configure environment variables

Copy the example files and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server (`server/.env`)**

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret used to sign login tokens. Use a long random string. |
| `PORT` | Port for the API server (defaults to `5050`) |

**Client (`client/.env`)**

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | URL of the API server, with no trailing slash (defaults to `http://localhost:5050`) |

### 3. Seed the articles

```bash
cd server
npm run seed:articles
```

This loads the articles in `server/scripts/articles.json`. It matches on each article's slug, so it is safe to run again after editing the file. Existing sessions and tickets are not affected.

### 4. Run the app

In two terminals:

```bash
# Terminal 1: API server on http://localhost:5050
cd server
npm run dev
```

```bash
# Terminal 2: frontend on the URL Vite prints (usually http://localhost:5173)
cd client
npm run dev
```

Open the frontend URL and create an account to get started.

## API Endpoints

All endpoints except `/register` and `/login` require an `Authorization: Bearer <token>` header.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/register` | Create an account |
| `POST` | `/login` | Log in and receive a token |
| `GET` | `/verify` | Check that a token is valid |
| `GET` | `/articles` | List all articles (title, subtitle, category, slug) |
| `GET` | `/articles/:slug` | Get one article with its pages |
| `GET` | `/articles/:slug/stats` | Get statistics for one article |
| `POST` | `/sessions` | Start a session for an article |
| `PATCH` | `/sessions/:id` | Update a session's page, resolved status, rating, or comments |
| `GET` | `/tickets` | List the current user's tickets |
| `POST` | `/tickets` | Submit a support ticket for a session |

## Scripts

**Server (`server/`)**

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with auto-reload, loading `.env` |
| `npm start` | Start the API (production) |
| `npm run seed:articles` | Load articles into the database |
| `npm run prettier` | Format the code |

**Client (`client/`)**

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run prettier` | Format the code |

## Deployment

The frontend and backend deploy as two separate services.

- **Backend:** Run `npm ci` then `npm start` from `server/`. Set `MONGODB_URI`, `DB_NAME`, and `JWT_SECRET` on the host. Most hosts set `PORT` automatically.
- **Frontend:** Set `VITE_API_URL` to the backend URL, then run `npm ci && npm run build` from `client/` and serve the `dist/` folder as a single-page app (for example, `npx serve -s dist`).

`VITE_API_URL` is built into the frontend at build time, so redeploy the frontend after changing it. If it is missing, the deployed site will try to reach `http://localhost:5050`, which shows up in the browser as a CORS or network error.

## Adding a New Endpoint

See [HOWTO.md](HOWTO.md) for the steps to add a route on the server and call it from the client.
