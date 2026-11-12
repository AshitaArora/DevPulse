# DevPulse ⚡

> Smart Developer Productivity & Team Analytics Platform without toxic surveillance.

DevPulse is an ethical developer analytics and engineering intelligence platform built on the MERN stack with TypeScript. It provides transparent visibility into code review turnaround times, peer unblocking, and team delivery velocity while strictly guarding developer privacy and encrypting tokens at rest.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB
- **Security**: AES-256-GCM token encryption, CSRF state protection, HTTP-Only session cookies, JWT

---

## 📂 Project Structure

```text
DevPulse/
├── client/                     # Vite + React 18 Frontend
│   ├── src/
│   │   ├── components/         # ProtectedRoute and shared UI components
│   │   ├── context/            # AuthContext (user session & state)
│   │   ├── pages/              # PublicLandingPage, LoginPage, AuthCallbackPage, DevHealthPage
│   │   └── types/              # TypeScript interfaces
│   └── vite.config.ts          # Reverse proxy (/api -> http://localhost:5000)
├── server/                     # Express + TypeScript Backend API
│   ├── src/
│   │   ├── config/             # MongoDB, environment config & security validations
│   │   ├── controllers/        # Auth & OAuth controller logic
│   │   ├── middleware/         # Auth verification middleware
│   │   ├── models/             # User, Organization, OrganizationMember Mongoose schemas
│   │   ├── routes/             # Auth & health routes
│   │   ├── services/           # GitHub OAuth token exchange & profile API
│   │   └── utils/              # AES-256-GCM crypto & token generators
│   └── .env.example            # Environment variables template
└── package.json                # Root concurrently workspace scripts
```

---

## 🚀 Milestones Progress

- [x] **Milestone 1**: Project Foundation & Health Diagnostics (`/dev/health`)
- [x] **Milestone 2**: GitHub OAuth 2.0, AES-256-GCM Encryption, Identity Schema & Public Landing Page
- [ ] **Milestone 3**: Authenticated Workspace Dashboard & Organization/Team Management
- [ ] **Milestone 4**: GitHub Repository Integration & Webhook Ingestion
- [ ] **Milestone 5**: Analytics Engine & Ethical Delivery Metrics
- [ ] **Milestone 6**: Data Visualizations & Production Deployment

---

## 💻 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017`
- GitHub OAuth Application credentials

### Installation

```bash
# Install root, server, and client dependencies
npm run install:all
```

### Environment Configuration

1. Copy `.env.example` in `server/` to `server/.env`:
```bash
cp server/.env.example server/.env
```
2. Populate `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from [GitHub Developer Settings](https://github.com/settings/applications/new).
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

### Running the App

```bash
# Start both server and client concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Diagnostics**: http://localhost:5173/dev/health
