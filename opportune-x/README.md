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
