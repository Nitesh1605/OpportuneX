# OpportuneX Backend API

This document summarizes the main HTTP endpoints exposed by the OpportuneX backend.

Base URL in development:

- `http://localhost:5000`

All JSON examples are illustrative and may be trimmed.

Rate limits: all `/api/*` routes are limited to 300 requests/minute per IP; `/api/auth/*` routes are additionally limited to 20 requests per 15 minutes per IP.

Request bodies validated by Joi respond with `400` and `{ "msg": "Validation failed", "details": ["..."] }` when invalid.

---

## Authentication

### POST /api/auth/register

Register a new user.

- **Auth**: Public
- **Body**
  - `name` (string, required, 2–50 chars)
  - `email` (string, required, valid email)
  - `password` (string, required, 6–100 chars)

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

**Errors**
- `400` – validation failed / email already exists

---

### POST /api/auth/login

Log an existing user in.

- **Auth**: Public
- **Body**
  - `email` (string, required, valid email)
  - `password` (string, required, 6–100 chars)

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
  - `type` – exact match filter (`All` is ignored).
  - `mode` – case-insensitive exact match (`All` is ignored).
  - `source` – case-insensitive partial match.
  - `search` – fuzzy search across `title` and `org`.
  - `tags` – comma-separated list (matches events containing every tag).
  - `deadlineFrom` / `deadlineTo` – ISO dates to constrain deadlines.
  - `preferredTypes` – comma-separated list to fetch recommended events (overrides `type`).
  - `featured` – set to `true` to fetch highlighted events only.
  - `limit` – maximum number of events to return.
  - `sortBy` – `newest` (createdAt desc), `featured` (featured first, then deadline asc); default is deadline asc, then createdAt desc.
  - `includeMeta` – set to `true` to include type/source counts.

**Response 200** – an array of event documents. When `includeMeta=true` the response is wrapped:

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
  - `sourceUrl` (string, optional, valid URL)
  - `mode` (string, optional – e.g. `Online`, `Offline`, `Hybrid`)
  - `location` (string, optional)
  - `deadline` (ISO date string or null, optional)
  - `tags` (string[], optional)
  - `description` (string, optional)
  - `featured` (boolean, optional)
  - `collectedAt` (ISO date string or null, optional – defaults to now when omitted)

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
  - Same shape as `POST /api/events` (`collectedAt` is not defaulted on update).

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

Read alert preferences only.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{
  "newMatches": true,
  "weeklyDigest": false,
  "deadlineReminderDays": 3,
  "lookbackDays": 7
}
```

---

### PUT /api/user/alerts/preferences

Update alert preferences.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`
- **Body** – any subset of:

```json
{
  "newMatches": true,
  "weeklyDigest": false,
  "deadlineReminderDays": 3,
  "lookbackDays": 7
}
```

**Response 200** – the updated preferences object (same shape as `GET /api/user/alerts/preferences`).

**Errors**
- `400` – `deadlineReminderDays` or `lookbackDays` is not a number ≥ 1

---

### GET /api/user/profile

Get the authenticated user's full profile, with `savedEvents` populated.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`

**Response 200**

```json
{
  "_id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "isAdmin": false,
  "savedEvents": [/* event documents */],
  "preferredTypes": ["Hackathon"],
  "alertPreferences": { "newMatches": true, "weeklyDigest": false, "deadlineReminderDays": 3, "lookbackDays": 7 },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### PUT /api/user/profile

Update the authenticated user's profile. Only provided fields are changed.

- **Auth**: Required (user)
- **Headers**
  - `Authorization: Bearer <jwt>`
- **Body** (all optional)
  - `name` (string)
  - `email` (string)
  - `password` (string)

**Response 200**

```json
{
  "_id": "...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "isAdmin": false
}
```

**Errors**
- `404` – user not found

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
