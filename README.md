# Placement Question Preparation Portal

A full-stack web application designed for campus placement preparation, featuring interactive problem solving across **C**, **C++**, **Java**, and **Unix**.

Built with:
- **Frontend**: React (Vite), modern CSS, Lucide icons
- **Backend**: Django & Django REST Framework (DRF) with CORS
- **Database**: MySQL 8.0 (with automatic database creation & SQLite fallback)

---

## Features

- **User Dashboard**:
  - Overview of all subjects: C, C++, Java, Unix
  - Live question counts per subject
  - One-click "Start Practice"
  - Summary metrics (Total questions, difficulty split)

- **Interactive Practice Mode**:
  - Subject and difficulty filtering
  - Interactive multiple-choice selection
  - Immediate feedback (correct/wrong highlighting)
  - Detailed explanation drawer
  - Real-time score tracking & question navigation

- **Question Bank**:
  - Searchable repository of interview questions
  - Filter by Subject and Difficulty
  - Expandable answers with solution explanations

- **Admin Portal**:
  - Live distribution statistics across subjects and difficulty levels
  - Data table of questions with live search & filtering
  - **Add Question**: Modal form to add new questions with options A–D, correct answer, and explanation
  - **Edit Question**: Inline modification of questions
  - **Delete Question**: Instant deletion with confirmation

---

## Project Structure

```text
placement-question-app/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── questions/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── management/commands/
│           └── seed_questions.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── QuestionModal.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Questions.jsx
│           ├── Practice.jsx
│           └── Admin.jsx
│
└── README.md
```

---

## Getting Started

### 1. Backend Setup (Django + MySQL)

Navigate to the `backend` directory:
```bash
cd backend
```

Ensure dependencies are installed:
```bash
pip install -r requirements.txt
```

Database credentials are preconfigured in `.env`:
```ini
DB_ENGINE=mysql
DB_NAME=placement_prep_db
DB_USER=root
DB_PASSWORD=Nithin@1538
DB_HOST=127.0.0.1
DB_PORT=3306
```

Run database migrations:
```bash
python manage.py makemigrations questions
python manage.py migrate
```

Seed the initial placement questions:
```bash
python manage.py seed_questions
```

Start the Django API server:
```bash
python manage.py runserver
```
The API is available at `http://127.0.0.1:8000/api/questions/`.

---

### 2. Frontend Setup (React + Vite)

In a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies (if not already installed):
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/questions/` | List all questions (supports `?subject=`, `?difficulty=`, `?search=`) |
| `GET` | `/api/questions/stats/` | Dashboard metrics & question counts |
| `POST` | `/api/questions/` | Create a new question |
| `GET` | `/api/questions/:id/` | Retrieve a single question |
| `PUT` | `/api/questions/:id/` | Update question details |
| `DELETE` | `/api/questions/:id/` | Delete question from MySQL |

