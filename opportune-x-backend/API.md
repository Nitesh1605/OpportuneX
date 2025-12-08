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
