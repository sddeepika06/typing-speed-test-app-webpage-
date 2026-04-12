# Full Stack Typing Speed Test App

A full-stack typing speed test app built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

---

## 📁 Project Structure

```
typing-app/
├── backend/          ← Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── results.js
│   │   └── leaderboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/         ← React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx          ← Typing test (Page 1)
    │   │   ├── Login.jsx         ← Login & Signup (Page 2)
    │   │   ├── Leaderboard.jsx   ← Rankings (Page 3)
    │   │   ├── History.jsx       ← My history + chart (Page 4)
    │   │   └── Profile.jsx       ← User profile (Page 5)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ResultModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── api/
    │   │   └── axios.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v16+)
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas connection string

---

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env if needed (change MONGO_URI or JWT_SECRET)

# Start the backend server
npm run dev       # with nodemon (auto-restart)
# OR
npm start         # without nodemon
```

Backend runs on: **http://localhost:5000**

---

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login |

### Results
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/results` | Save test result | ✅ |
| GET | `/api/results/:userId` | Get user's history | ✅ |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Top 20 users by score |

---

## 📊 Ranking Formula

```
Score = (WPM × 0.7) + (Accuracy × 0.3)
```

Leaderboard shows the **best score per user**, sorted descending.

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home / Typing Test | `/` | Main typing test with difficulty selector |
| Login / Signup | `/login` | Authentication |
| Leaderboard | `/leaderboard` | Global rankings |
| History | `/history` | Your test history + progress chart |
| Profile | `/profile` | Profile overview + achievements |

---

## 🔐 Auth

- JWT-based authentication
- Passwords hashed with bcryptjs
- Token stored in `localStorage`, auto-attached to all API requests

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router v6 |
| Charts | Chart.js + react-chartjs-2 |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts — Poppins |
