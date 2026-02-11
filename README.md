# Personal Blog

A full-stack personal blog platform with categories: **tech**, **travel**, **food**, and **lifestyle**. Built as a full-stack backend project and deployed to the cloud using:

- Node.js & Express
- MongoDB Atlas (Cloud Database)
- JWT Authentication & Role-Based Access Control
- Render Cloud Deployment
- and vanilla HTML/CSS/JS.

## Project overview

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt, Joi validation
- **Frontend:** Pure HTML, CSS, and JavaScript (no frameworks)
- **Features:** User registration/login, profile, CRUD posts, categories, tags, draft/published status, role-based access (user, moderator, admin)

## 🌍 Live Demo

Backend API:  
https://personal-blog-api-ogcg.onrender.com

GitHub Repository:  
https://github.com/PinUpDeveloper/sidequest


## Screenshots

<!-- Add screenshots of index, dashboard, and post page here -->

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repo and install dependencies:

```bash
cd personal-blog
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Edit `.env` and set:

- `MONGO_URI` — MongoDB connection string (e.g. `mongodb://localhost:27017/personal-blog` or MongoDB Atlas URI)
- `JWT_SECRET` — Strong secret for JWT signing (change in production)
- `PORT` — Server port (default `3000`)

4. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in the browser.
   Base URL (production): https://personal-blog-api-ogcg.onrender.com

## API documentation

Base URL: `http://localhost:3000` (or your deployed URL).

### Public routes

| Method | Endpoint    | Description        |
|--------|-------------|--------------------|
| POST   | `/register` | Register new user  |
| POST   | `/login`    | Login, returns JWT |
| GET    | `/posts`    | List posts (published only when not authenticated) |
| GET    | `/posts/:id`| Get single post (published only, or own/draft with auth) |

### Protected routes (require `Authorization: Bearer <token>`)

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/users/profile`    | Get current profile  |
| PUT    | `/users/profile`    | Update username/email/password |
| POST   | `/posts`            | Create post          |
| GET    | `/posts?mine=true`  | Get current user's posts |
| GET    | `/posts/:id`        | Get post (incl. own drafts) |
| PUT    | `/posts/:id`        | Update post (author, moderator, admin) |
| PATCH  | `/posts/:id/status` | Change status draft ↔ published (author, moderator, admin) |
| DELETE | `/posts/:id`        | Delete post (author or admin) |

### Request/response examples

**POST /register**

```json
// Request
{ "username": "jane", "email": "jane@example.com", "password": "secret123" }

// Response 201
{ "success": true, "message": "User registered", "data": { "user": { "id", "username", "email", "role": "user" }, "token": "..." } }
```

**POST /login**

```json
// Request
{ "email": "jane@example.com", "password": "secret123" }

// Response 200
{ "success": true, "data": { "user": { "id", "username", "email", "role" }, "token": "..." } }
```

**POST /posts** (with Bearer token)

```json
// Request
{
  "title": "My trip to Japan",
  "content": "Full post content...",
  "category": "travel",
  "tags": ["japan", "travel"],
  "coverImageUrl": "https://example.com/cover.jpg",
  "status": "published"
}
```

### Query parameters

- **GET /posts**
  - `category` — tech | travel | food | lifestyle
  - `search` — search in title/content
  - `mine=true` — only current user's posts (requires auth)

### Error responses

- `400` — Bad Request (validation error)
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden (RBAC)
- `404` — Not Found
- `500` — Server Error

## Environment variables

| Variable      | Description                    | Default (if any)     |
|---------------|--------------------------------|----------------------|
| `PORT`        | Server port                    | `3000`               |
| `NODE_ENV`    | development / production       | `development`        |
| `MONGO_URI`   | MongoDB connection string      | local DB             |
| `JWT_SECRET`  | Secret for JWT signing         | (must set in prod)   |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d)     | `7d`                 |
| `SMTP_*`      | Optional: welcome email (see below) | —                |

## Deployment (Render / Railway / Replit)

### General

1. Set **build command:** `npm install` (or leave default).
2. Set **start command:** `npm start`.
3. Add environment variables in the dashboard:
   - `MONGO_URI` — e.g. MongoDB Atlas connection string
   - `JWT_SECRET` — random long string
   - `PORT` — often provided by the host (e.g. Render sets `PORT` automatically).

The app serves the frontend from the `public` folder via `express.static('public')`, so one service serves both API and static files.

### Render

1. New → Web Service → connect repo.
2. Build: `npm install`, Start: `npm start`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`. Use `PORT` from Render.
4. Deploy.

### Railway

1. New Project → Deploy from repo.
2. Add MongoDB plugin or external `MONGO_URI`.
3. Variables: `MONGO_URI`, `JWT_SECRET`. Railway sets `PORT`.
4. Deploy.

### Replit

1. Import repo, run `npm install` then `npm start`.
2. Set Secrets (env): `MONGO_URI`, `JWT_SECRET`.
3. Replit usually sets `PORT`; if not, set it in Secrets.

## Postman

Import the collection from `postman/Personal-Blog-API.postman_collection.json`.

1. Set collection variables:
   - `baseUrl`: `http://localhost:3000` (or your API URL)
   - `token`: paste JWT after **Login**
   - `postId`: paste a post ID for update/delete/status requests

2. Run **Login** and copy `data.token` into the `token` variable, then use **Get posts (my posts)**, **Create post**, etc.

## Optional: welcome email (SMTP)

To send a welcome email after registration:

1. Add to `.env` (e.g. SendGrid):

   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@yourblog.com
   ```

2. Uncomment and use the optional email helper in `backend/src/controllers/authController.js` (e.g. call a `sendWelcomeEmail(email, username)` after user create). Implement `sendWelcomeEmail` with Nodemailer using `config/env.js` SMTP settings.

## License

This project was created for educational purposes.
