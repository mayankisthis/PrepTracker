# PrepTracker 🚀

A full-stack MERN application for tracking DSA preparation, monitoring consistency, and organizing solved problems for revision.

## 🌐 Live Demo
https://prep-tracker-8wve.vercel.app/


## ✨ Features

### 🔐 Authentication
- User Registration and Login
- JWT Authentication
- Protected Routes
- Persistent Sessions

### 📝 Problem Tracking
- Add solved problems
- Edit existing entries
- Delete problems
- Mark important problems as starred
- Add personal notes and observations

### 📊 Dashboard
- Total problems solved
- Current solving streak
- Problems solved today
- Average solve time
- Difficulty distribution
- Most solved topics

### 🔍 Search and Filtering
- Filter by difficulty
- Filter by topic
- Filter by platform
- Search problems by title

### 📚 Revision Tracking
- Track revision status
- Identify problems that need revisiting
- Organize revision lists

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose

---

## 📁 Project Structure

```text
PrepTracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/preptracker.git
cd preptracker
```

### Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

---

## ▶️ Running the Project

From the root directory:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 📌 Problem Schema

```javascript
{
  title: String,
  platform: String,
  difficulty: String,
  topic: String,
  solvedDate: Date,
  timeTaken: Number,
  attempts: Number,
  notes: String,
  revisionStatus: String,
  usedHints: Boolean,
  starred: Boolean
}
```

---

## 🎯 Motivation

Most DSA platforms only show solved counts and contest ratings. PrepTracker was built to provide a more personalized preparation workflow by helping users:

- Track progress over time
- Maintain consistency through streaks
- Organize revision schedules
- Record insights and observations
- Identify strengths and weaknesses

---

## 🔮 Future Improvements

- LeetCode profile integration
- Contest tracking
- Revision reminders
- Heatmap visualization
- Email notifications
- Export progress reports

---



## 👨‍💻 Author

**Mayank Vaishnav**

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ If you found this project useful, consider giving it a star!