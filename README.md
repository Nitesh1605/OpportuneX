# OpportuneX 🚀

> **A full-stack opportunity discovery platform** for students — browse hackathons, jobs, internships, and challenges in one place, with smart personalization and an admin control panel.

**Live GitHub:** [github.com/Nitesh1605/OpportuneX](https://github.com/Nitesh1605/OpportuneX)

---

## 📌 What is OpportuneX?

Students often miss great opportunities because they're scattered across LinkedIn, Devfolio, Devpost, MLH, and company career pages. **OpportuneX solves that** by aggregating hackathons, jobs, internships, and challenges into a single platform — with filters, saved lists, personalized recommendations, and deadline alerts.

---

## ✨ Key Features

### For Students
| Feature | Description |
|---|---|
| 🔍 **Browse & Search** | Filter by type (Job / Internship / Hackathon), mode (Remote / Hybrid), tags, source, and deadline range |
| 💾 **Save Opportunities** | Bookmark events and manage them from your personal Dashboard |
| 🎯 **Personalized Recommendations** | Set preferred types (e.g. Hackathons, Internships) and get matched suggestions |
| 🔔 **Smart Alerts** | Deadline reminders, new-match alerts, and "closing soon" notifications |
| 🔗 **Live Apply Links** | Every opportunity links directly to the official apply page |
| 💼 **LinkedIn Post Generator** | Auto-generate a professional LinkedIn post for any opportunity in one click |

### For Admins
| Feature | Description |
|---|---|
| 🛡️ **Role-Based Access** | Admin vs user roles enforced at the API level using JWT |
| ➕ **Event Management** | Create, edit, and delete opportunities from an admin UI |
| 📊 **Analytics Dashboard** | View total users, events by type, events by source platform |

---

## 🏗️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| **React 19 + TypeScript** | Component-based UI with full type safety |
| **React Router v7** | Client-side routing (protected routes, admin routes) |
| **TanStack React Query** | Server-state management, caching, background refetching |
| **Axios** | Centralized HTTP client with JWT interceptor |
| **Vanilla CSS** | Custom dark-mode design system (no Tailwind) |

### Backend
| Tool | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **TypeScript** | End-to-end type safety |
| **MongoDB + Mongoose** | NoSQL database with typed schemas |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **Joi** | Request body validation |
| **Helmet + express-rate-limit** | Security hardening |
| **bcryptjs** | Password hashing |

---

## 🗂️ Project Structure

```
OpportuneX/
├── opportune-x/                  # React Frontend
│   └── src/
│       ├── api/                  # Axios API clients (auth, events, user, admin)
│       ├── components/           # Reusable UI components
│       │   ├── events/           # EventCard, EventList, EventFilters, LinkedInModal
│       │   ├── layout/           # Navbar, Footer, Layout
│       │   └── routes/           # ProtectedRoute, AdminRoute
│       ├── pages/                # Route-level pages
│       │   ├── Events.tsx        # All opportunities
│       │   ├── Jobs.tsx          # Jobs listing
│       │   ├── Internships.tsx   # Internships listing
│       │   ├── Dashboard.tsx     # User dashboard + saved events
│       │   ├── AdminDashboard.tsx
│       │   ├── Login / Register
│       │   └── Profile.tsx
│       └── types/                # Shared TypeScript interfaces
│
└── opportune-x-backend/          # Express Backend
    └── src/
        ├── config/db.ts          # MongoDB connection with retry logic
        ├── models/               # Mongoose models (User, Event)
        ├── controllers/          # Business logic (auth, events, user, admin)
        ├── routes/               # Express routers
        ├── middleware/           # Auth, admin guard, Joi validation, error handler
        └── validation/           # Joi schemas
```

---

## 🔌 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/events` | Public | List events (type, mode, search, tags, deadline filters) |
| `GET` | `/api/events/:id` | Public | Single event details |
| `POST` | `/api/events` | Admin | Create event |
| `PUT` | `/api/events/:id` | Admin | Update event |
| `DELETE` | `/api/events/:id` | Admin | Delete event |
| `GET` | `/api/user/saved-events` | User | Get saved events |
| `POST` | `/api/user/save-event` | User | Save an event |
| `DELETE` | `/api/user/save-event/:id` | User | Remove saved event |
| `GET/PUT` | `/api/user/preferences` | User | Get/update preferred types |
| `GET` | `/api/user/alerts` | User | Get deadline & match alerts |
| `GET` | `/api/admin/stats` | Admin | Platform analytics |

> Full API reference: [`opportune-x-backend/API.md`](./opportune-x-backend/API.md)

---

## 🚀 Running Locally

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/Nitesh1605/OpportuneX.git
cd OpportuneX
```

### 2. Backend setup
```bash
cd opportune-x-backend
npm install
```

Create `.env` in `opportune-x-backend/`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

Build and start:
```bash
npm run build     # compile TypeScript → dist/
npm start         # run compiled server
```

> **Dev mode:** `npm run dev` (uses ts-node + nodemon)

### 3. Seed sample data
```bash
# Seed hackathons/challenges
npx ts-node --transpile-only seed_events.ts

# Seed jobs & internships
npx ts-node --transpile-only seed_jobs_internships.ts
```

### 4. Frontend setup
```bash
cd ../opportune-x
npm install
```

Create `.env` in `opportune-x/`:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm start
```

**App is live at → [http://localhost:3000](http://localhost:3000)**

---

## 🔐 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens |
| `PORT` | Backend | Server port (default: 5000) |
| `CLIENT_URL` | Backend | Allowed CORS origins |
| `REACT_APP_API_BASE_URL` | Frontend | Backend API base URL |

> ⚠️ Never commit `.env` files. They are in `.gitignore`.

---

## 🧠 Key Engineering Decisions

### 1. Centralized Axios Instance
All API calls go through a single Axios instance (`src/api/axiosInstance.ts`) that automatically attaches the JWT `Authorization` header from `localStorage`. This means auth logic is written once — not repeated in every component.

### 2. React Query for Server State
Instead of `useEffect` + `useState` for data fetching, React Query handles caching, background refetching, and loading/error states. This keeps components clean and gives users a fast, stale-while-revalidate experience.

### 3. Role-Based Route Protection
Two middleware layers on the backend:
- `authMiddleware` — verifies JWT, attaches user to `req.user`
- `adminMiddleware` — checks `req.user.isAdmin`, returns `403` if not admin

On the frontend, `<ProtectedRoute>` and `<AdminRoute>` redirect unauthenticated/unauthorized users before rendering.

### 4. Joi Validation at the API Layer
Every admin write request is validated against a Joi schema before reaching the controller. Invalid payloads return structured `400` errors — protecting the database from malformed data.

### 5. Retry Logic on MongoDB Connection
The DB connection function retries up to 5 times with a 2-second delay before crashing — making the backend resilient to transient network issues (common on free-tier cloud databases).

---

## 💡 What I'd Add Next

- **httpOnly cookie auth** instead of `localStorage` to prevent XSS token theft
- **Docker + docker-compose** for one-command local setup
- **CI/CD pipeline** (GitHub Actions) to lint, test, and deploy on push
- **Pagination** on the events list for large datasets
- **Email notifications** for deadline reminders using Nodemailer
- **More test coverage** — Jest + React Testing Library for components

---

## 👤 Author

**Nitesh Mali**  
[GitHub](https://github.com/Nitesh1605) · [LinkedIn](https://linkedin.com/in/nitesh-mali)
