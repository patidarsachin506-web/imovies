# IMovies — Full-stack movie ticket booking app

A React + Express + MongoDB movie-booking project with JWT authentication, movie/show APIs, seat selection, booking history, and Razorpay Checkout integration.

> **Payment safety:** Use Razorpay Test Mode first. This project does not store card/UPI credentials. The backend creates payment orders and verifies Razorpay signatures. For a real production launch, add Razorpay webhooks, seat-hold expiry/release jobs, cancellation/refund policies, monitoring, HTTPS, and stronger admin provisioning. Never commit `.env` files or use test credentials for live payments.

## Prerequisites
- Node.js 20 LTS or newer (Node 18+ may work; use a currently supported LTS)
- npm
- MongoDB Atlas (recommended) or local MongoDB configured as a **replica set** because booking creation uses a MongoDB transaction
- Razorpay account with test API keys
- VS Code and a modern browser

## Project structure

```text
imovies/
  client/                 React + Vite frontend
    src/pages/            Home, movie detail, seat selection, login, bookings
    src/components/       Navbar and movie card
  server/                 Express REST API
    src/models/           User, Movie, Show, Booking schemas
    src/routes/           Authentication, movies, shows, bookings/payment
    src/middleware/       JWT and admin authorization
    src/seed.js            Demo movies, shows and admin account
```

## Step 1 — Install Node.js and VS Code
1. Install Node.js LTS from https://nodejs.org/ (npm is included).
2. Install VS Code from https://code.visualstudio.com/.
3. Extract this ZIP and open the `imovies` folder in VS Code.
4. Open **Terminal → New Terminal**.

## Step 2 — Set up MongoDB
**Recommended:** create a free cluster at https://www.mongodb.com/atlas, create a database user, allow your development IP in Network Access, and copy the Node.js connection string. Replace the username/password placeholders in it. Do not share the connection string.

Alternatively, use local MongoDB configured as a replica set. The booking endpoint uses transactions to prevent two users from booking the same seat at once; a standalone local MongoDB instance will reject transactions.

## Step 3 — Configure the backend
In the terminal:

```bash
cd server
npm install
```

Copy `.env.example` to `.env` (Windows PowerShell: `Copy-Item .env.example .env`; macOS/Linux: `cp .env.example .env`). Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=put_a_long_random_secret_here
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

Get the Razorpay keys from the Razorpay Dashboard in **Test Mode → Account & Settings / API Keys** (menu labels may vary). Keep the key secret only in `server/.env`. If you want to test browsing/login before setting up Razorpay, leave the placeholders for now; payment order creation will show a clear configuration error until real test keys are added.

## Step 4 — Seed sample data
With `server` as the current directory:

```bash
npm run seed
```

This adds demo movies, future shows in Indore, and an admin account if they do not already exist. Demo admin credentials:

- Email: `admin@imovies.local`
- Password: `ChangeThisAdmin123!`

**Change/remove this demo admin immediately** before deploying anywhere public. Do not use the demo credentials on a public server.

## Step 5 — Start the backend
From `server`:

```bash
npm run dev
```

Check http://localhost:5000/api/health — it should return `{"status":"ok","app":"IMovies API"}`.

Keep this terminal open.

## Step 6 — Start the frontend
Open a **second terminal** in VS Code:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env` if you need a different API address. The default is `VITE_API_URL=http://localhost:5000/api`.

```bash
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Step 7 — Test the flow
1. Register a normal account from **Sign in → Create account**.
2. Open a movie and select one of the seeded showtimes.
3. Select seats. The seat map refreshes availability every 10 seconds.
4. Select **Pay**. Razorpay Checkout opens; use Razorpay's official test-mode payment details from its documentation/dashboard, not real money.
5. After the checkout returns, the backend verifies the payment signature and the booking appears under **My tickets**.
6. Try signing out/in and verify booking history persists.
7. Test unavailable seats by opening the same show in a second browser/session.

## Admin APIs (for creating/updating content)
Admin authorization is enforced by the API. Sign in as the seeded admin through `/api/auth/login`, then pass the returned JWT as `Authorization: Bearer <token>` in Postman. The sample frontend intentionally does not expose admin management screens yet.

- `POST /api/movies` — create a movie. JSON example:

```json
{
  "title": "Sample Film",
  "description": "A sample description",
  "genre": ["Drama"],
  "language": "Hindi",
  "duration": 120,
  "certificate": "UA",
  "poster": "https://example.com/poster.jpg",
  "rating": 8,
  "isActive": true
}
```

- `POST /api/shows` — create a show and generate its seat map:

```json
{
  "movie": "MOVIE_OBJECT_ID",
  "cinema": "Central Cinema",
  "screen": "Screen 1",
  "city": "Indore",
  "startsAt": "2027-01-15T19:30:00.000Z",
  "price": 200,
  "rows": 5,
  "seatsPerRow": 8
}
```

- `GET /api/movies` — list movies
- `GET /api/movies/:id/shows` — upcoming showtimes
- `GET /api/shows/:id/seats` — seat availability
- `GET /api/bookings/mine` — signed-in user's bookings

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/movies` | List/search movies |
| GET | `/api/movies/:id` | Movie detail |
| GET | `/api/movies/:id/shows` | Upcoming shows |
| GET | `/api/shows/:id/seats` | Current seat map |
| POST | `/api/bookings/create-order` | Validate seats and create Razorpay order |
| POST | `/api/bookings/verify-payment` | Verify payment signature and confirm booking |
| GET | `/api/bookings/mine` | Booking history |

## Troubleshooting
- **MongoDB connection error:** verify `MONGODB_URI`, Atlas IP access, database username/password, and network connection.
- **Transaction numbers are only allowed on a replica set member or mongos:** use MongoDB Atlas or configure local MongoDB as a replica set.
- **CORS error:** `CLIENT_URL` in `server/.env` must exactly match the frontend origin (normally `http://localhost:5173`); restart the server after editing `.env`.
- **No movies:** run `npm run seed` inside `server`.
- **Payment keys missing:** add Razorpay Test Mode keys to `server/.env`, restart backend.
- **Images missing:** demo poster URLs depend on an external image service; replace them with licensed image URLs you control.
- **Port in use:** change `PORT` in `server/.env` and update `VITE_API_URL` in `client/.env` accordingly.

## Before production
- Build frontend with `npm run build` inside `client`.
- Deploy frontend and backend separately; set production environment variables and HTTPS origins.
- Use a managed MongoDB replica set, unique indexes, backups and least-privilege database credentials.
- Implement Razorpay webhook verification and idempotency; reconcile orders from Razorpay server-side before confirming bookings.
- Add expiring seat holds and release seats after failed/cancelled/abandoned checkout. The demo currently marks seats booked when an order is created, so abandoned pending orders need operational cleanup before public use.
- Add email/SMS tickets, QR validation, cancellation/refund flow, admin UI, audit logs, accessibility checks, and automated tests.
