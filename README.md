# OpportuneX 🚀

> **A full-stack opportunity discovery platform** for students — browse hackathons, jobs, internships, and challenges in one place, with an admin control panel.

**Live GitHub:** [github.com/Nitesh1605/OpportuneX](https://github.com/Nitesh1605/OpportuneX)

---

## 📌 What is OpportuneX?

Students often miss great opportunities because they're scattered across LinkedIn, Devfolio, Devpost, MLH, and company career pages. **OpportuneX solves that** by aggregating hackathons, jobs, internships, and challenges into a single platform — with filters, saved lists, and clean, responsive UI dashboards.

---

## ✨ Key Features

### For Students
- 🔍 **Browse & Search**: Filter by category, mode (Remote / Hybrid / In-Person), and text searches instantly.
- 💾 **Save Opportunities**: Bookmark opportunities and manage them directly from your personal Dashboard.
- 🔗 **Live Apply Links**: Every opportunity links directly to the official application pages.
- 💼 **1-Click LinkedIn Post**: Auto-generate a professional LinkedIn update to share your learning journey.

### For Admins
- 🛡️ **Role-Based Access**: Admin vs user roles secured at the API level using JSON Web Tokens (JWT).
- ➕ **Opportunity Control Panel**: Create, edit, and delete opportunities directly from a clean admin UI.
- 📊 **Platform Analytics**: View site statistics (total users, total opportunities, distributions by type).

---

## 🏗️ Tech Stack

### Frontend
- **React 19 + TypeScript**: Modular components with type safety.
- **React Router v7**: Client-side routing with clean nested layout guards.
- **Axios**: HTTP client configured with JWT interceptors.
- **Vanilla CSS**: Curated dark-mode design system without bulky frameworks.

### Backend
- **Node.js + Express 5**: REST API server.
- **TypeScript**: End-to-end type safety.
- **MongoDB + Mongoose**: Cloud NoSQL database with strict schemas.
- **JWT (jsonwebtoken)**: Stateless token authentication.
- **Joi**: Request body validation.
- **Helmet + rate-limit**: Express security hardening.

---

## 🗂️ Project Structure

```
OpportuneX/
├── opportune-x/                  # React Frontend
│   └── src/
│       ├── api/                  # API clients (auth, events, user, admin)
│       ├── components/           # UI Components
│       │   ├── events/           # EventCard, EventForm, EventFilters, LinkedInModal
│       │   └── layout/           # Navbar, Layout wrapper
│       ├── pages/                # Route pages (Events, Jobs, Internships, Dashboard)
│       └── App.tsx               # Central nested layout router (< 60 lines!)
│
└── opportune-x-backend/          # Express Backend
    └── src/
        ├── config/db.ts          # MongoDB connection with retry logic
        ├── models/               # Mongoose schemas
        ├── controllers/          # Request handlings
        └── routes/               # API endpoints
```

---

## 🔌 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/events` | Public | List opportunities (type, mode, search filters) |
| `GET` | `/api/events/:id` | Public | Single opportunity details |
| `POST` | `/api/events` | Admin | Create opportunity |
| `PUT` | `/api/events/:id` | Admin | Update opportunity |
| `DELETE` | `/api/events/:id` | Admin | Delete opportunity |
| `GET` | `/api/user/saved-events` | User | Get saved opportunities |
| `POST` | `/api/user/save-event` | User | Bookmark opportunity |
| `DELETE` | `/api/user/save-event/:id` | User | Remove bookmarked opportunity |
| `GET` | `/api/admin/stats` | Admin | Site analytics statistics |

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
npm run build
npm start
```

### 3. Seed sample data
```bash
npx ts-node --transpile-only seed_events.ts
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

---

## 🧠 Key Engineering Decisions

### 1. Centralized Axios Interceptors
All API requests flow through a unified Axios instance (`src/api/axiosInstance.ts`) that automatically attaches the user's JWT authorization token from `localStorage`. This keeps authentication unified and eliminates code repetition.

### 2. Lightweight Native Lifecycle States
To keep bundle sizes small and maintain full control over the rendering cycle, OpportuneX uses native React state (`useState`) and side-effect hooks (`useEffect`). This ensures that data retrieval patterns are simple, explicit, and easy to explain.

### 3. Nested Layout Routing
Leverages React Router's nested routing configuration. This allows the core pages to dynamically inherit the common navbar header layouts without writing repeated wrappers around each route in `App.tsx`.

### 4. Resilient Database Connections
The MongoDB connection module is built with an automatic retry block that attempts reconnection up to 5 times before exiting. This hardens the backend against network drops common with free NoSQL hosting.

---

## 👤 Author

**Nitesh Mali**  
[GitHub](https://github.com/Nitesh1605) · [LinkedIn](https://linkedin.com/in/nitesh-mali)
