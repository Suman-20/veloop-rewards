# VELOOP Rewards

A full-stack MERN application implementing a secure **Daily Streak
Rewards System** for VELOOP Rewards.

The application allows users to register/login, authenticate with
Google, maintain a daily reward streak, claim eligible rewards, view
wallet balance and reward transactions, and interact with a responsive
rewards dashboard.

------------------------------------------------------------------------

## 🌐 Live Demo

**Frontend:**\
https://veloop-rewards-chi.vercel.app

**Backend API:**\
https://veloop-rewards-qqsx.onrender.com

> The backend is deployed on Render and the frontend is deployed on
> Vercel.

------------------------------------------------------------------------

## 📌 Project Overview

VELOOP Rewards is a daily streak-based rewards platform.

The core idea is simple:

1.  A user creates an account or signs in with Google.
2.  The user enters the Rewards Dashboard.
3.  The backend determines the user's current streak and eligible
    reward.
4.  The user checks in/claims the available reward when eligible.
5.  The backend validates the claim.
6.  The wallet and transaction history are updated.
7.  The next reward becomes available according to the streak rules.

The frontend is treated as a presentation layer. Reward values,
eligibility, streak state, claim timing and wallet changes are
controlled by the backend.

------------------------------------------------------------------------

## ✨ Features

### Authentication

-   Email and password registration
-   Email and password login
-   Password hashing with bcrypt
-   JWT-based authentication
-   Google Login
-   Google account linking by email
-   Protected Dashboard route
-   Logout functionality
-   Persistent login using browser local storage

### Daily Streak System

-   Current streak tracking
-   Current streak day
-   Daily reward progression
-   24-hour reward eligibility
-   Next reward countdown
-   Missed-day/streak reset handling
-   Claimed/locked/available reward states
-   Backend-driven reward configuration

### Rewards

The configured 7-day reward cycle is:

  Day     Reward
  ------- ---------------------
  Day 1   +5 VEs
  Day 2   +10 VEs
  Day 3   +15 VEs
  Day 4   ₹1 Amazon Gift Card
  Day 5   ₹2 Amazon Gift Card
  Day 6   +30 VEs
  Day 7   ₹5 Amazon Gift Card

Reward values are managed on the backend/database rather than being
trusted from the frontend.

### Wallet

-   VEs wallet balance
-   Wallet updates after successful claims
-   Balance before/after transaction tracking

### Transaction History

-   Reward transaction records
-   Reward type
-   Amount
-   Currency
-   Streak day
-   Transaction/reference information
-   Transaction timestamps

### UI/UX

-   Responsive design
-   Desktop and mobile layouts
-   Responsive navigation
-   Profile dropdown
-   Logout
-   Streak card
-   Reward cards
-   Ultimate Day 7 reward section
-   Statistics section
-   Transaction history
-   Footer
-   Password visibility toggle
-   Clean dark rewards-dashboard design

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

-   React
-   Vite
-   React Router
-   Tailwind CSS
-   Axios
-   Lucide React
-   `@react-oauth/google`

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcryptjs
-   Google Auth Library
-   CORS
-   dotenv

### Deployment

-   Vercel --- Frontend
-   Render --- Backend
-   MongoDB Atlas --- Database
-   GitHub --- Source Control

------------------------------------------------------------------------

## 📁 Project Structure

``` text
veloop-rewards/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── streakController.js
│   │   └── rewardController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── OTP.js
│   │   ├── Streak.js
│   │   ├── Reward.js
│   │   ├── Wallet.js
│   │   └── Transaction.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── streakRoutes.js
│   │   └── rewardRoutes.js
│   │
│   ├── seedRewards.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── StreakCard.jsx
│   │   │   ├── RewardCard.jsx
│   │   │   ├── UltimateReward.jsx
│   │   │   ├── TransactionHistory.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── vercel.json
│   ├── package.json
│   ├── .env
│   └── vite.config.js
│
└── README.md
```

> `VerifyOTP.jsx` and the OTP authentication flow were removed from the
> active authentication flow when the application was changed to
> email/password + Google authentication.

------------------------------------------------------------------------

## 🔐 Authentication Flow

### Email/Password Registration

``` text
User
  ↓
Register Form
  ↓
POST /api/auth/register
  ↓
Validate input
  ↓
Hash password with bcrypt
  ↓
Create MongoDB User
  ↓
Generate JWT
  ↓
Return token + user
  ↓
Dashboard
```

### Email/Password Login

``` text
User
  ↓
Login Form
  ↓
POST /api/auth/login
  ↓
Find user by email
  ↓
bcrypt.compare()
  ↓
Generate JWT
  ↓
Return token + user
  ↓
Dashboard
```

### Google Login

``` text
Google
  ↓
Google ID Token
  ↓
Frontend
  ↓
POST /api/auth/google
  ↓
Backend verifies Google token
  ↓
Find/create/link user
  ↓
Generate JWT
  ↓
Dashboard
```

------------------------------------------------------------------------

## 🔒 Security

The application follows several security principles:

-   Passwords are never stored as plain text.
-   Passwords are hashed using bcrypt.
-   JWT is used for authenticated API access.
-   Protected routes check for authentication tokens.
-   Google ID tokens are verified on the backend.
-   Client-supplied reward amounts are not trusted.
-   Reward eligibility is controlled by backend state.
-   Wallet balance is updated by the backend.
-   Reward transactions are created on successful claims.
-   Environment variables are used for secrets and deployment
    configuration.
-   `.env` files should not be committed to GitHub.

------------------------------------------------------------------------

## 🎁 Backend-Driven Rewards

The frontend does not act as the source of truth for:

-   Reward amount
-   Reward currency
-   Reward type
-   Current streak
-   Current streak day
-   Claim eligibility
-   Next claim time
-   Wallet balance
-   Transaction state

The backend retrieves reward configuration and determines whether a
claim is valid.

This prevents a user from simply modifying frontend JavaScript or API
payloads to claim a different reward.

------------------------------------------------------------------------

## ⏱️ Streak and Claim Logic

The backend controls the actual reward eligibility.

The frontend displays the countdown as a visual representation of the
backend-provided next claim time.

The backend is responsible for:

-   Current streak
-   Current day
-   Last claim time
-   Next eligible claim time
-   Missed-day handling
-   Reward lookup
-   Claim validation
-   Wallet update
-   Transaction creation

------------------------------------------------------------------------

## 🔌 API Structure

The backend exposes the following route groups:

``` text
/api/auth
/api/user
/api/streak
/api/rewards
```

### Authentication

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
```

### Other API groups

``` text
/api/user
/api/streak
/api/rewards
```

Protected endpoints use the JWT token in the Authorization header:

``` text
Authorization: Bearer <JWT_TOKEN>
```

------------------------------------------------------------------------

## ⚙️ Environment Variables

### Frontend `.env`

``` env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://your-backend-url.onrender.com
```

For local development:

``` env
VITE_API_URL=http://localhost:2005
```

### Backend `.env`

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

PORT=2005

FRONTEND_URL=https://your-frontend-url.vercel.app
```

> Never commit real secrets, MongoDB passwords, JWT secrets, or private
> credentials to GitHub.

------------------------------------------------------------------------

## 🚀 Local Setup

### 1. Clone the repository

``` bash
git clone https://github.com/Suman-20/veloop-rewards.git
cd veloop-rewards
```

------------------------------------------------------------------------

### 2. Backend setup

``` bash
cd backend
npm install
```

Create:

``` text
backend/.env
```

Add the required environment variables.

Run the backend:

``` bash
npm run dev
```

Backend will run on:

``` text
http://localhost:2005
```

------------------------------------------------------------------------

### 3. Seed reward data

From the `backend` folder:

``` bash
node seedRewards.js
```

This inserts the configured reward data into MongoDB.

------------------------------------------------------------------------

### 4. Frontend setup

Open another terminal:

``` bash
cd frontend
npm install
```

Create:

``` text
frontend/.env
```

Add:

``` env
VITE_API_URL=http://localhost:2005
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run:

``` bash
npm run dev
```

Frontend will normally run on:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🗄️ MongoDB

The application uses MongoDB through Mongoose.

The main database collections/models include:

-   Users
-   OTP records from the legacy authentication implementation
-   Streaks
-   Rewards
-   Wallets
-   Transactions

The active authentication flow uses email/password and Google
authentication.

------------------------------------------------------------------------

## 🌍 Deployment

### Frontend --- Vercel

The frontend is deployed using Vercel.

Production URL:

``` text
https://veloop-rewards-chi.vercel.app
```

The repository is connected to GitHub, so pushes to the configured
production branch can trigger automatic deployments.

A `vercel.json` file is included for React Router SPA routing:

``` json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows routes such as:

``` text
/register
/login
/dashboard
```

to continue working after a browser refresh.

------------------------------------------------------------------------

### Backend --- Render

The backend is deployed on Render.

Production API:

``` text
https://veloop-rewards-qqsx.onrender.com
```

Render configuration:

``` text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

The backend starts with:

``` bash
npm start
```

which runs:

``` bash
node server.js
```

------------------------------------------------------------------------

## 🔄 Git Workflow

After making changes:

``` bash
git add .
git commit -m "Update project"
git push
```

The GitHub repository acts as the source repository for deployment.

------------------------------------------------------------------------

## 🧪 Testing Checklist

### Authentication

-   [ ] Register with email/password
-   [ ] Login with email/password
-   [ ] Incorrect password is rejected
-   [ ] Duplicate email is rejected
-   [ ] Google Login works
-   [ ] Protected Dashboard cannot be accessed without a token
-   [ ] Logout removes the local authentication session
-   [ ] Logout does not delete the MongoDB user

### Streak

-   [ ] New user receives initial streak state
-   [ ] Current streak is displayed
-   [ ] Current reward day is displayed
-   [ ] Reward status is displayed
-   [ ] Countdown is displayed
-   [ ] Claim validation is performed by backend
-   [ ] Missed-day logic works
-   [ ] Day 7 reward is displayed correctly

### Wallet

-   [ ] Wallet balance is displayed
-   [ ] Successful reward claim updates wallet
-   [ ] Transaction is created
-   [ ] Transaction history is displayed

### Deployment

-   [ ] Vercel production build works
-   [ ] Render backend is reachable
-   [ ] Production frontend can communicate with backend
-   [ ] CORS allows production frontend
-   [ ] React Router routes work after refresh
-   [ ] Google OAuth production origin is configured

------------------------------------------------------------------------

## 🤖 AI Usage

AI tools were used during development as development assistance.

### AI-assisted areas

-   Project architecture planning
-   React component planning
-   UI implementation assistance
-   Authentication flow implementation
-   Backend API structure
-   Debugging frontend/backend errors
-   CORS troubleshooting
-   Deployment troubleshooting
-   Vercel and Render configuration guidance
-   Responsive UI improvements
-   Code explanation and debugging

### Manual modifications

The developer manually:

-   Integrated the generated/recommended code into the project
-   Modified UI and component layouts
-   Connected frontend components with backend APIs
-   Configured environment variables
-   Configured MongoDB Atlas
-   Configured Google OAuth
-   Configured Vercel and Render deployments
-   Tested APIs and authentication flows
-   Debugged deployment-specific issues
-   Verified the application locally and in production

AI was used as a development assistant; final integration, testing,
configuration and project decisions were performed manually.

------------------------------------------------------------------------

## 📱 Responsive Design

The application is designed for:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

The dashboard includes responsive navigation and mobile-friendly reward
cards.

------------------------------------------------------------------------

## 🧭 Application Routes

### Public Routes

``` text
/
 /register
 /login
```

### Protected Route

``` text
/dashboard
```

The root route redirects users to the registration page.

The Dashboard is protected using a JWT token check.

------------------------------------------------------------------------

## 📦 Important Commands

### Backend

``` bash
cd backend
npm install
npm run dev
```

Production:

``` bash
npm start
```

Seed rewards:

``` bash
node seedRewards.js
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

Production build:

``` bash
npm run build
```

Preview production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

## 🐛 Common Deployment Issues

### CORS error

Make sure the backend allows both development and production frontend
origins.

Example:

``` text
http://localhost:5173
https://veloop-rewards-chi.vercel.app
```

### Vercel 404 after refreshing `/register` or `/login`

Make sure `frontend/vercel.json` contains:

``` json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Google Login origin error

Make sure the production frontend URL is added to the Google OAuth
client's authorized JavaScript origins.

------------------------------------------------------------------------

## 👨‍💻 Developer

**Suman Raul**

Computer Science / Engineering Student\
Full Stack / MERN Developer

GitHub:

https://github.com/Suman-20

------------------------------------------------------------------------

## 📄 License

This project was developed as part of the VELOOP Rewards
internship/assignment project.

If this repository is being submitted for evaluation, please refer to
the assignment requirements and evaluation instructions provided by the
VELOOP Rewards team.
