# KeepBirr - Expense Tracker

KeepBirr is a full-stack expense tracking web application organized into dedicated `frontend` and `backend` services.

---

## Project Structure

```text
KeepBirr/
├── frontend/             # Next.js frontend application
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI components & shadcn components
│   ├── lib/              # Utility functions
│   ├── public/           # Static assets (images, icons)
│   ├── utils/            # Client utilities and database schema
│   ├── components.json   # shadcn-ui configuration
│   ├── drizzle.config.js # Frontend drizzle configuration
│   ├── jsconfig.json     # Path aliases (@/* -> ./*)
│   ├── next.config.mjs   # Next.js configuration
│   ├── package.json      # Frontend dependencies & scripts
│   ├── postcss.config.js # PostCSS config for Tailwind CSS
│   ├── tailwind.config.js# Tailwind CSS styling config
│   └── tsconfig.json     # TypeScript configuration
├── backend/              # Node.js + Express API backend
│   ├── controllers/      # Route request handlers
│   ├── data/             # Database connection pool
│   ├── db/               # Drizzle ORM setup & schema definitions
│   ├── middleware/       # Express middlewares (e.g. auth)
│   ├── routeres/         # Express API routes (auth, expenses)
│   ├── services/         # Business logic services
│   ├── drizzle.config.js # Backend drizzle configuration
│   ├── package.json      # Backend dependencies & scripts
│   └── server.js         # Express server entry point
├── package.json          # Root orchestration scripts
└── README.md             # Project documentation
```

---

## Quick Start

### 1. Install Dependencies
You can install dependencies for both frontend and backend from the root:
```bash
npm run install:all
```
Or install separately:
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Variables

- **Frontend (`frontend/.env.local`)**:
  Set your Clerk authentication keys and any API URL endpoints:
  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
  CLERK_SECRET_KEY=your_clerk_secret_key
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  ```

- **Backend (`backend/.env`)**:
  Configure your database credentials and JWT secret:
  ```env
  PORT=5000
  DATABASE_URL=postgresql://user:password@host:port/dbname
  JWT_SECRET=your_jwt_secret
  ```

### 3. Running the Applications

From the root directory:

- **Run Frontend (Next.js)** (defaults to [http://localhost:3000](http://localhost:3000)):
  ```bash
  npm run dev:frontend
  ```

- **Run Backend (Express API)** (defaults to [http://localhost:5000](http://localhost:5000)):
  ```bash
  npm run dev:backend
  ```

You can also `cd` into either directory and run `npm run dev`.
