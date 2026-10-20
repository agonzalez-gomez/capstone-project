# Troubleshooting App

An interactive help center for medical device users. Users work through step-by-step troubleshooting guides, report whether each step fixed their issue, and submit a support ticket if it didn't.

**Live demo:** https://capstone-project-2fwb.onrender.com/

> The backend is hosted on Render's free tier and goes to sleep when idle, so the first load after a while may take up to a minute.

UA Coding Bootcamp capstone project. See [PROPOSAL.md](PROPOSAL.md) for the proposal and [IDEAS.md](IDEAS.md) for the original ideas.

## Features

- Sign up and log in (JWT, `bcrypt`)
- Search and browse articles by category
- Multi-page guides with a "Did this fix it?" prompt on each page
- Ratings and comments when an issue is resolved
- Support tickets when it isn't, listed under My Tickets
- Session tracking and per-article statistics

## Tech Stack

React, TypeScript, Vite, MUI, Express, MongoDB (Mongoose)

## Getting Started

Requires Node.js and a MongoDB database.

```bash
npm run install-all
cp server/.env.example server/.env   # set MONGODB_URI, DB_NAME, JWT_SECRET
cp client/.env.example client/.env   # set VITE_API_URL

cd server && npm run seed:articles
```

Then run the server and client in separate terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

## Tests

Server tests use Mocha, Chai, and Supertest against an in-memory MongoDB, so they don't need a database connection.

```bash
cd server && npm test
```

## API

All endpoints except `/register` and `/login` require a bearer token.

| Method | Path |
| --- | --- |
| `POST` | `/register`, `/login` |
| `GET` | `/verify` |
| `GET` | `/articles`, `/articles/:slug`, `/articles/:slug/stats` |
| `POST` | `/sessions` |
| `PATCH` | `/sessions/:id` |
| `GET`, `POST` | `/tickets` |

## Deployment

- **Backend:** `npm ci && npm start` from `server/`, with the server environment variables set.
- **Frontend:** `npm ci --include=dev && npm run build` from `client/`, then serve `dist/` as a single-page app. Set `VITE_API_URL` before building.

See [HOWTO.md](HOWTO.md) for adding a new endpoint.
