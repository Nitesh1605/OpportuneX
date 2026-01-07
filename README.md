# OpportuneX – Opportunity Discovery Platform

OpportuneX is a full‑stack platform to help students discover hackathons, internships, challenges and fests in one place, with personalization for students and admin tooling for organizers/recruiters.

## Features

### Student experience
- Browse curated opportunities (hackathons, internships, challenges, fests).
- Filter by type, mode, source platform and search by title/organization.
- Deadline range filters + tag chips help narrow down to what matters.
- View rich event details with deadlines, tags and external apply links.
- Save events to a personal list and manage them from Dashboard/Profile.
- Configure preferred types to power recommendations and in-app alerts.
- Receive reminders for saved deadlines plus new-match notifications.
- Generate polished LinkedIn posts from any event card in a click.

### Admin experience
- Secure login with JWT‑based authentication.
- Role‑based access control (admin vs normal user).
- Create, edit and delete events from an admin UI.
- View analytics in the Admin Dashboard (total users, total events,
  events by type and by source platform).

### Tech highlights
- **Frontend**: React, TypeScript, React Router, React Query, Axios.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT.
- **Quality**: Strong TypeScript typing, Joi validation, central error handler,
  protected/admin routes, rate limiting + Helmet, and alert engine.

## Project structure

High‑level layout (most important folders only):

```text
opportune-x/
  src/
    api/           # Typed API clients (auth, events, user, admin)
    components/    # Reusable UI, layout and event components
    pages/         # Route pages (Events, Dashboard, Admin, Auth, etc.)
    types/         # Shared TypeScript types (e.g. Event)
  public/

opportune-x-backend/
  src/
    config/        # DB connection
    models/        # Mongoose models (User, Event)
    controllers/   # Route handlers (auth, events, user, admin)
    routes/        # Express routers
    middleware/    # Auth, admin, validation, error handler
    validation/    # Joi schemas
```

For a detailed API reference, see `opportune-x-backend/API.md`.

## Running the project locally

### Prerequisites
- Node.js and npm installed.
- A MongoDB instance (local or hosted).

### 1. Backend setup

```bash
cd opportune-x-backend
npm install
```

Create a `.env` file in `opportune-x-backend`:

```bash
MONGO_URI="<your-mongo-connection-string>"
JWT_SECRET="change-me"
CLIENT_URL="http://localhost:3000"
```

Run the backend in development mode:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Frontend setup

In another terminal:

```bash
cd opportune-x
npm install
```

Create a `.env` file in `opportune-x` (or `.env.development`):

```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start the React dev server:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Available scripts

### `npm start` (frontend)

Runs the React app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

(If you add tests) Runs the test suite using `react-scripts test`.\
Update this section as you add Jest/RTL tests.

### `npm run build` (frontend)

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Builds the React frontend for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Backend scripts

# OpportuneX Backend API

This document summarizes the main HTTP endpoints exposed by the OpportuneX backend.

Base URL in development:

- `http://localhost:5000`

All JSON examples are illustrative and may be trimmed.

---

## Authentication

### POST /api/auth/register

Register a new user.

- **Auth**: Public
- **Body**
  - `name` (string, required)
  - `email` (string, required, valid email)
  - `password` (string, required, min 6 chars)

**Response 201**

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "isAdmin": false
  }
}
```

---

### POST /api/auth/login

Log an existing user in.

- **Auth**: Public
- **Body**
  - `email` (string, required)
  - `password` (string, required)

**Response 200** – same shape as `/register`.

**Errors**
- `400` – invalid credentials
- `404` – user not found

---

## Events

### GET /api/events

List all events with optional filtering.

- **Auth**: Public
- **Query params** (all optional):
  - `type`, `mode`, `source` – exact match filters.
  - `search` – fuzzy search across `title` and `org`.
  - `tags` – comma-separated list (matches events containing every tag).
  - `deadlineFrom` / `deadlineTo` – ISO dates to constrain deadlines.
  - `preferredTypes` – comma-separated list to fetch recommended events.
  - `featured` – set to `true` to fetch highlighted events only.
  - `includeMeta` – set to `true` to include type/source counts.

**Response 200**

```json
{
  "events": [
    {
      "_id": "...",
      "title": "Google Summer of Code",
      "org": "Google",
      "type": "Internship",
      "source": "LinkedIn",
      "sourceUrl": "https://www.linkedin.com/...",
      "applyUrl": "https://...",
      "mode": "Online",
      "location": "Remote",
      "deadline": "2025-01-31T00:00:00.000Z",
      "tags": ["open source", "remote"],
      "featured": true,
      "collectedAt": "2024-12-01T09:00:00.000Z",
      "description": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": {
    "total": 120,
    "countsByType": { "Hackathon": 50, "Internship": 32 },
    "countsBySource": { "Unstop": 60, "LinkedIn": 35 }
  }
}
```

---

### GET /api/events/:id

Fetch full details for a single event.

- **Auth**: Public

**Response 200**

```json
{
  "_id": "...",
  "title": "...",
  "org": "...",
  "type": "...",
  "source": "...",
  "applyUrl": "https://...",
  "mode": "Online",
  "location": "Remote",
  "deadline": "2025-01-31T00:00:00.000Z",
  "tags": ["..."],
  "description": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors**
- `404` – event not found

---

### POST /api/events

Create a new event. Admin only.

- **Auth**: Required (admin)
- **Headers**
  - `Authorization: Bearer <jwt>` – token of an admin user
- **Body**
  - `title` (string, required)
  - `org` (string, required)
  - `applyUrl` (string, required, valid URL)
  - `type` (string, optional)
  - `source` (string, optional)
  - `mode` (string, optional – e.g. `Online`, `Offline`, `Hybrid`)
  - `location` (string, optional)
  - `deadline` (string or null, optional)
  - `tags` (string[], optional)
  - `description` (string, optional)

**Response 201** – created event document.

**Errors**
- `400` – validation failed (handled by Joi)
- `401` – missing/invalid token
- `403` – user is not admin

---

### PUT /api/events/:id

Update an existing event. Admin only.

- **Auth**: Required (admin)
- **Headers**
  - `Authorization: Bearer <jwt>`
- **Body**
  - Same shape as `POST /api/events`.

**Response 200** – updated event document.

**Errors**
- `400` – validation failed
- `401` – missing/invalid token
- `403` – user is not admin
- `404` – event not found

---

### DELETE /api/events/:id

Delete an event. Admin only.

- **Auth**: Required (admin)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{ "msg": "Event deleted" }
```

**Errors**
- `401` – missing/invalid token
- `403` – user is not admin
- `404` – event not found

---

## User

These endpoints operate on the authenticated user. All of them require a valid JWT.

### GET /api/user/saved-events

Get the list of events the user has saved.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
[
  {
    "_id": "...",
    "title": "...",
    "org": "...",
    "applyUrl": "https://..."
  }
]
```

---

### POST /api/user/save-event

Save an event to the user’s saved list.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`
- **Body**
  - `eventId` (string, required – MongoDB ObjectId of the event)

**Response 200**

```json
{ "msg": "Event saved" }
```

---

### DELETE /api/user/save-event/:eventId

Remove an event from the user’s saved list.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{ "msg": "Event removed" }
```

---

### GET /api/user/preferences

Get the user’s preferred event types.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{
  "preferredTypes": ["Hackathon", "Internship"]
}
```

---

### PUT /api/user/preferences

Update the user’s preferred event types (used for recommendations/highlighting).

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`
- **Body**
  - `preferredTypes` (string[], required)

**Response 200**

```json
{
  "preferredTypes": ["Hackathon", "Internship"]
}
```

**Errors**
- `400` – `preferredTypes` is not an array

---

### GET /api/user/alerts

Return alert buckets (new matches, saved deadlines, closing soon) together with the user’s alert preferences.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{
  "alerts": {
    "newMatches": { "count": 2, "events": [/* ... */] },
    "deadlineReminders": { "count": 1, "events": [/* ... */] },
    "closingSoon": { "count": 3, "events": [/* ... */] }
  },
  "preferences": {
    "newMatches": true,
    "weeklyDigest": false,
    "deadlineReminderDays": 3,
    "lookbackDays": 7
  }
}
```

---

### GET /api/user/alerts/preferences

Read alert preferences only. Same response shape as above (without alert buckets when cached).

---

### PUT /api/user/alerts/preferences

Update alert preferences. Body accepts any subset of:

```json
{
  "newMatches": true,
  "weeklyDigest": false,
  "deadlineReminderDays": 3,
  "lookbackDays": 7
}
```

---

## Admin

### GET /api/admin/stats

Return high‑level analytics for the platform (for admin dashboard).

- **Auth**: Required (admin)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{
  "userCount": 42,
  "eventCount": 120,
  "eventsByType": [
    { "_id": "Hackathon", "count": 50 },
    { "_id": "Internship", "count": 40 }
  ],
  "eventsBySource": [
    { "_id": "Unstop", "count": 60 },
    { "_id": "LinkedIn", "count": 30 }
  ]
}
```

**Errors**
- `401` – missing/invalid token
- `403` – user is not admin

From `opportune-x-backend`:

- `npm run dev` – start the TypeScript backend with nodemon/ts-node.
- `npm run build` – compile TypeScript to `dist/`.
- `npm start` – run the compiled backend from `dist/index.js`.

## How to talk about this project in interviews

When presenting OpportuneX, focus on:

1. **Problem & users** – Central place for students to discover opportunities,
   with personalization and admin tooling.
2. **Architecture** – React + TS SPA frontend, Express + TS + Mongo backend,
   JWT auth, role‑based routes, Axios API layer, Joi validation.
3. **Engineering decisions** – typed models and API responses, centralized
   axios instance, validation + error handling, protected/admin routes,
   analytics endpoint for admin.
4. **Future improvements** – httpOnly cookies for better security, more tests,
   Docker + CI/CD, more advanced recommendations.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
