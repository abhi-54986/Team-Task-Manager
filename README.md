# Team Task Manager

A full-stack team task management app for coordinating projects, assigning work, and tracking delivery. The project uses React + Vite on the frontend, Express on the backend, MongoDB/Mongoose for persistence, JWT authentication, role-based access control, and Tailwind CSS for the UI.

Use Node.js `20.19.0` or newer.

## Features

- Professional login/signup landing screen with a product-style workflow preview
- JWT-based signup, login, logout, and session bootstrap
- `Admin` and `Member` roles
- Admin project creation and deletion
- Admin project member management
- Admin task creation, assignment, filtering, status updates, and deletion
- Member-only visibility for assigned projects and assigned tasks
- Dashboard metrics for total, completed, pending, overdue, and status breakdown
- Protected frontend routes
- Express validation, centralized errors, rate limiting, CORS, Helmet, and request logging

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios, Tailwind CSS, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Validation/security: express-validator, helmet, cors, express-rate-limit

## Project Structure

```text
Team Task Manager/
  client/
    src/
      api/
      components/
      context/
      layouts/
      pages/
      styles/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      validators/
```

## Local Setup

Install dependencies separately in both apps:

```bash
cd server
npm install

cd ../client
npm install
```

### Backend Environment

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start MongoDB locally or use a MongoDB Atlas connection string for `MONGODB_URI`.

Run the backend:

```bash
cd server
npm run dev
```

The API runs on `http://localhost:5000`.

Health check:

```bash
curl http://localhost:5000/health
```

### Frontend Environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
cd client
npm run dev
```

The app runs on `http://localhost:5173`.

## Usage Flow

1. Start MongoDB.
2. Start the backend from `server`.
3. Start the frontend from `client`.
4. Open `http://localhost:5173`.
5. Sign up as an `Admin` to create projects, add members, and assign tasks.
6. Sign up as a `Member` to view assigned work and update task status.

## Scripts

Backend:

```bash
npm run dev      # Start Express with nodemon
npm start        # Start Express with node
npm run lint     # Run ESLint on server/src
```

Frontend:

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production frontend
npm run preview  # Preview production build
```

## Data Models

`User`

- `name`
- `email`
- `password`, hashed with bcrypt
- `role`: `Admin` or `Member`

`Project`

- `name`
- `description`
- `members`: user references
- `createdBy`: admin user reference

`Task`

- `title`
- `description`
- `project`: project reference
- `assignedTo`: user reference
- `createdBy`: admin user reference
- `status`: `Todo`, `In Progress`, or `Done`
- `deadline`
- `isOverdue`: virtual field

## API Documentation

Base URL:

```bash
http://localhost:5000/api
```

Protected routes require:

```bash
Authorization: Bearer <jwt-token>
```

### Auth

`POST /auth/signup`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123",
  "role": "Admin"
}
```

`POST /auth/login`

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

`GET /auth/me`

Returns the authenticated user.

### Users

`GET /users`

Admin only. Returns all users.

`DELETE /users/:userId`

Admin only. Deletes a user, removes them from projects, and deletes assigned tasks.

### Projects

`GET /projects`

Admins receive all projects. Members receive projects they belong to.

`POST /projects`

Admin only.

```json
{
  "name": "Website Redesign",
  "description": "Refresh marketing pages",
  "members": ["USER_ID"]
}
```

`GET /projects/:projectId`

Returns project details and visible tasks. Admins see all project tasks. Members see only tasks assigned to them.

`DELETE /projects/:projectId`

Admin only. Deletes the project and related tasks.

`POST /projects/:projectId/members`

Admin only.

```json
{
  "userId": "USER_ID"
}
```

`DELETE /projects/:projectId/members`

Admin only.

```json
{
  "userId": "USER_ID"
}
```

### Tasks

`GET /tasks?projectId=&userId=&status=`

Admins can filter all tasks. Members only receive assigned tasks.

`POST /tasks`

Admin only.

```json
{
  "title": "Create wireframes",
  "description": "Draft desktop and mobile wireframes",
  "projectId": "PROJECT_ID",
  "assignedTo": "USER_ID",
  "status": "Todo",
  "deadline": "2026-05-15"
}
```

`PATCH /tasks/:taskId/status`

Admins can update any task. Members can update only tasks assigned to them.

```json
{
  "status": "In Progress"
}
```

`DELETE /tasks/:taskId`

Admin only.

### Dashboard

`GET /dashboard?projectId=&userId=`

Returns dashboard stats for all visible tasks or the selected filters.

```json
{
  "stats": {
    "totalTasks": 10,
    "completedTasks": 4,
    "pendingTasks": 6,
    "overdueTasks": 2,
    "statusBreakdown": {
      "Todo": 3,
      "In Progress": 3,
      "Done": 4
    }
  }
}
```

## Deployment Notes

### Backend on Railway

1. Create a Railway service from the repository.
2. Set the service root directory to `server`.
3. Set the build command:

```bash
npm install
```

4. Set the start command:

```bash
npm start
```

5. Add production environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<long-random-production-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your-frontend-public-url>
```

### Frontend on Railway

1. Create a second Railway service from the same repository.
2. Set the service root directory to `client`.
3. Set the build command:

```bash
npm install && npm run build
```

4. Set the start command:

```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

5. Add the frontend environment variable:

```env
VITE_API_URL=<your-backend-public-url>/api
```

6. After the frontend deploys, update backend `CLIENT_URL` with the frontend public URL and redeploy the backend so CORS accepts it.
