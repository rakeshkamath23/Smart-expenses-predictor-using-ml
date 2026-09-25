# ⚡ Smart Expenses — Intelligent Expense Tracking & Prediction App

**Smart Expenses** is a full-stack financial management and predictive analysis platform. It empowers users to track day-to-day transactions across multiple categories and payment methods, set and monitor monthly budgets, and forecast future expenditure trends using a Machine Learning pipeline powered by Scikit-learn.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.2 (Python 3.13)
- **Admin Panel**: **Django Unfold** (Tailwind CSS, Dark Mode, KPI Metrics, Alpine.js)
- **Data Import/Export**: `django-import-export` (Excel, CSV, JSON integration)
- **API**: Django REST Framework (DRF)
- **CORS**: `django-cors-headers`
- **Database Driver**: `psycopg2-binary` (PostgreSQL) + SQLite (local development fallback)
- **Configuration**: `python-decouple` + `dj-database-url` (.env based)
- **Machine Learning**: `scikit-learn`, `pandas`, `numpy`, `joblib`

### Frontend
- **Framework**: React 18 (JavaScript)
- **Build Tool**: Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **HTTP Client**: Axios (pre-configured instance with baseURL & credentials)
- **Styling**: Vanilla CSS Design System with CSS variables and responsive glassmorphic cards

### Cloud Database
- **Provider**: PostgreSQL hosted on **Supabase**

---

## 📁 Repository Folder Structure

```text
ML-project/
├── README.md                          # Root project documentation
├── backend/
│   ├── manage.py                      # Django management script
│   ├── requirements.txt               # Pinned Python dependencies
│   ├── .env.example                   # Environment variable template
│   ├── .env                           # Local environment config
│   ├── .gitignore                     # Git ignore rules for backend
│   ├── db.sqlite3                     # Local SQLite database (fallback)
│   ├── config/                        # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py                # Database, CORS, apps, auth configuration
│   │   ├── urls.py                    # Root URL routing
│   │   ├── wsgi.py                    # WSGI entrypoint
│   │   └── asgi.py                    # ASGI entrypoint
│   └── apps/                          # Modular Django applications
│       ├── __init__.py
│       ├── core/                      # Shared utilities & base helpers
│       │   ├── __init__.py
│       │   ├── apps.py
│       │   └── utils.py
│       ├── users/                     # Custom User model & admin
│       │   ├── __init__.py
│       │   ├── apps.py
│       │   ├── models.py              # User(AbstractUser) w/ phone_number, bio
│       │   ├── admin.py               # Registered UserAdmin
│       │   └── migrations/
│       │       ├── __init__.py
│       │       └── 0001_initial.py
│       ├── expenses/                  # Expense tracking module
│       │   ├── __init__.py
│       │   ├── apps.py
│       │   ├── models.py              # Expense model with CATEGORY & PAYMENT choices
│       │   ├── admin.py               # Registered ExpenseAdmin
│       │   └── migrations/
│       │       ├── __init__.py
│       │       ├── 0001_initial.py
│       │       └── 0002_initial.py
│       ├── budgets/                   # Budgeting and limits module
│       │   ├── __init__.py
│       │   ├── apps.py
│       │   ├── models.py              # Budget & CategoryBudget models
│       │   ├── admin.py               # Registered BudgetAdmin & CategoryBudgetAdmin
│       │   └── migrations/
│       │       ├── __init__.py
│       │       ├── 0001_initial.py
│       │       └── 0002_initial.py
│       └── predictions/               # ML Prediction module (skeleton)
│           ├── __init__.py
│           ├── apps.py
│           ├── models.py
│           └── admin.py
└── frontend/
    ├── index.html                     # HTML5 root with Google Inter font
    ├── package.json                   # NPM dependencies & scripts
    ├── vite.config.js                 # Vite bundler configuration
    ├── .env.example                   # Frontend environment template
    ├── .env                           # Local frontend environment
    ├── .gitignore                     # Git ignore rules for frontend
    └── src/
        ├── main.jsx                   # React entrypoint with BrowserRouter
        ├── App.jsx                    # Root App shell with Navbar, Footer & Routes
        ├── index.css                  # Modern design system & styles
        ├── api/
        │   └── axios.js               # Configured Axios instance
        ├── components/
        │   ├── Navbar.jsx             # Top responsive navigation
        │   ├── Sidebar.jsx            # Dashboard sidebar navigation
        │   └── Footer.jsx             # Application footer
        ├── pages/
        │   ├── Home.jsx               # Landing page with hero banner & features
        │   ├── Login.jsx              # Controlled user authentication form
        │   ├── Register.jsx           # User registration form
        │   ├── NotFound.jsx           # 404 error page
        │   └── Dashboard/             # Dashboard section
        │       ├── Dashboard.jsx      # Dashboard layout with Sidebar & Outlet
        │       ├── Overview.jsx       # Financial stat cards & model status
        │       ├── AddExpense.jsx     # Expense creation form
        │       ├── ExpenseHistory.jsx # Searchable & filterable expense table
        │       ├── Analysis.jsx       # Categorical breakdown & chart placeholder
        │       ├── Prediction.jsx     # ML prediction KPI & evaluation metrics
        │       ├── Budget.jsx         # Monthly budget progress & adjustment
        │       ├── Reports.jsx        # Data summaries & CSV export
        │       └── Profile.jsx        # User profile information
        └── routes/
            └── AppRoutes.jsx          # Route definitions & nested route hierarchy
```

---

## 🚀 Running the Project Locally

### Prerequisites
- Python 3.10+ (Installed on your system)
- Node.js 18+ and npm

---

### 1. Backend Setup (Django)

1. Open a terminal and navigate to `backend/`:
   ```powershell
   cd backend
   ```

2. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```

3. Verify dependencies are installed:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```powershell
   python manage.py migrate
   ```
   *(By default, this applies migrations to the local `db.sqlite3` database if `DATABASE_URL` in `.env` is empty).*

5. Create an administrative superuser (optional):
   ```powershell
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```powershell
   python manage.py runserver
   ```
   The backend API and Admin panel will be available at **`http://127.0.0.1:8000/`** (Admin at `/admin/`).

---

### 2. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   ```

2. Install Node dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   The React web application will start at **`http://localhost:5173/`**.

---

## ☁️ Connecting to Supabase PostgreSQL

To switch from the local SQLite fallback to your live PostgreSQL database on Supabase:

### Step 1: Obtain the Connection String from Supabase
1. Log in to your [Supabase Dashboard](https://app.supabase.com/).
2. Select or create your project for **Smart Expenses**.
3. In the left navigation menu, click **Project Settings** (gear icon) &rarr; **Database**.
4. Scroll down to the **Connection parameters** section or **Connection string** tab:
   - Select the **URI** format.
   - Choose **Mode: Session** (port 5432) or **Transaction** (port 6543 for pooler).
   - The connection string will resemble:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
5. Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

### Step 2: Configure `backend/.env`
Open `backend/.env` and update the `DATABASE_URL` line:
```env
DATABASE_URL=postgresql://postgres:YourActualPassword@db.abcdefghijklm.supabase.co:5432/postgres
```

### Step 3: Apply Migrations to Supabase
With the virtual environment activated, run:
```powershell
python manage.py migrate
```
Django will connect directly to Supabase via SSL, create all tables (`users_user`, `expenses_expense`, `budgets_budget`, `budgets_categorybudget`, etc.), and you will see the tables appear immediately in your Supabase Table Editor!
