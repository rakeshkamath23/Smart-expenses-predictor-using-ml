# ⚡ Smart Expenses — Intelligent Expense Tracking & Prediction Platform

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Scikit--Learn](https://img.shields.io/badge/scikit_learn-1.9-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Admin-Django_Unfold-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://github.com/unfoldadmin/django-unfold)

> **Smart Expenses** is a state-of-the-art, full-stack financial intelligence and expense management ecosystem. It bridges day-to-day transactional accounting with predictive Machine Learning modeling, interactive 3D smart card asset management, portfolio investment tracking, and a conversational AI financial copilot.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features Breakdown](#-key-features-breakdown)
   - [Secure Authentication Gateway](#1-secure-authentication-gateway)
   - [3D Smart Card & Multi-Card Wallet](#2-3d-smart-card--multi-card-wallet)
   - [Real-Time Transaction Logging & Shared Store](#3-real-time-transaction-logging--shared-store)
   - [Searchable Ledger & Expense History](#4-searchable-ledger--expense-history)
   - [Categorical Analysis & Bubble Breakdowns](#5-categorical-analysis--bubble-breakdowns)
   - [Predictive ML Forecasting & What-If Simulator](#6-predictive-ml-forecasting--what-if-simulator)
   - [Wealth & Investment Portfolio Manager](#7-wealth--investment-portfolio-manager)
   - [Monthly Budget Planning & Utilization](#8-monthly-budget-planning--utilization)
   - [AI Financial Assistant & Copilot (ChatView)](#9-ai-financial-assistant--copilot-chatview)
   - [Automated CSV Reporting & Auditing](#10-automated-csv-reporting--auditing)
   - [Django Unfold Modern Admin Dashboard](#11-django-unfold-modern-admin-dashboard)
3. [End-to-End Project Architecture & Flow](#-end-to-end-project-architecture--flow)
   - [User Experience & Navigation Flow](#user-experience--navigation-flow)
   - [System Architecture & Data Pipelines](#system-architecture--data-pipelines)
   - [Machine Learning Forecasting Pipeline](#machine-learning-forecasting-pipeline)
4. [Technology Stack](#-technology-stack)
5. [Repository Structure](#-repository-structure)
6. [Local Installation & Setup Guide](#-local-installation--setup-guide)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (Django)](#1-backend-setup-django)
   - [Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
   - [Supabase PostgreSQL Integration](#3-supabase-postgresql-integration)
7. [Environment Variables](#-environment-variables)
8. [Roadmap & Future Enhancements](#-roadmap--future-enhancements)

---

## 🌟 Project Overview

Managing personal finances often suffers from fragmented workflows: tracking expenses happens separately from budget planning, while predictive insights and investments remain isolated in complex spreadsheets.

**Smart Expenses** unifies these facets into a single platform:
- **Tracks** historical spending through high-precision categorizations and multi-card payment attribution.
- **Analyzes** distribution across food, commute, utilities, shopping, healthcare, and entertainment.
- **Forecasts** upcoming monthly cash flow using Scikit-learn regressors with dynamic **"What-If"** sensitivity levers to visualize potential savings before making spending cuts.
- **Monitors** growing wealth through a dedicated multi-asset investment portfolio manager (ETFs, Mutual Funds, Sovereign Gold Bonds, and Fixed Deposits).
- **Assists** decision-making via a full-featured conversational AI financial assistant.

---

## 🚀 Key Features Breakdown

### 1. Secure Authentication Gateway
- **Unified Auth Gateway**: Seamless user login and registration forms with validation, password visibility toggles, and direct dashboard routing upon authentication.
- **Fast Demo Access**: One-click quick demo sign-in for streamlined evaluation and testing.

### 2. 3D Smart Card & Multi-Card Wallet
- **Gyroscopic 3D Tilt Physics**: Real-time cursor-tracking perspective rendering for payment cards (`Interactive3DCard` with dynamic lighting glares, glossy specular reflections, and metallic card chips).
- **Multi-Card Management (`Profile.jsx`)**: Add, remove, set primary, and freeze/unfreeze payment cards with customizable luxury themes (**Sapphire, Violet, Obsidian, Emerald, Amber**).
- **Security & Convenience**: Masked 16-digit card formatting, PIN/CVV reveal toggles, and live balance counters synchronized across the entire application.

### 3. Automated Real-World Transaction Collection & Shared Store
- **Bank SMS & UPI Notification Parser (`smsParser.js`)**: Real-time parsing engine for bank SMS alerts (HDFC, SBI, ICICI, Axis, Kotak, GPay, PhonePe, Paytm). Automatically extracts debit/credit amounts, merchant/payee, date, reference/UTR IDs, payment mode, and auto-classifies categories with 98% confidence.
- **AI / OCR Receipt & Bill Scanner (`receiptParser.js` + `tesseract.js`)**: Neural Optical Character Recognition pipeline that scans photos of receipts and invoices. Extracts total payable amount, store name, date, and line-item breakdowns with interactive scan progress tracking.
- **1-Click Real-World Simulation Templates**: Includes pre-packaged templates for immediate evaluation (HDFC Swiggy, SBI Cult.fit, ICICI Electricity, Axis Uber, Starbucks Slip, Supermarket Grocery Bill, Apollo Pharmacy).
- **Dynamic Payment Attribution**: Automatically populates payment methods from the user's active smart cards saved in their Profile.
- **Cross-Component Reactivity**: Backed by a synchronized `transactionStore` with real-time `Event` dispatches (`smart_expenses_transactions_updated`) so overview cards, history ledgers, category bubbles, and budget gauges update simultaneously without page reloads.

### 4. Searchable Ledger & Expense History
- **Multi-Parameter Search**: Instant live filtering by merchant name, transaction notes, or category keyword.
- **Pill Category Selectors**: Filter by *All, Food & Groceries, Transport, Bills, Shopping, Health*, or *Entertainment*.
- **Porcelain Ledger Presentation**: Clean debit/credit color indicators (Crimson negative debits vs. Emerald positive credits), formatted Indian Rupee (`₹`) denominations, and human-readable relative timestamps.

### 5. Categorical Analysis & Bubble Breakdowns
- **Categorical Proportions**: Deep-dive analytics showcasing category percentages of total monthly burn.
- **Interactive Bubble Explorer**: Inspect itemized breakdowns (e.g., Groceries vs. Clothes vs. Gym & Supplements).
- **Month-over-Month Comparison**: Toggle between current month (September) and prior month (August) to examine variance across lifestyle buckets.

### 6. Predictive ML Forecasting & What-If Simulator
- **Scikit-Learn Regression Pipeline**: Machine Learning engine trained on historical spending patterns to forecast the upcoming month's total expenditure and category spreads.
- **Interactive "What-If" Sensitivity Simulator**:
  - Live percentage reduction steppers (`-5%`, `-10%`, `-25%`) across discretionary categories (Food, Shopping, Entertainment, Commute).
  - Instant re-calculation of **Potential Monthly Savings**, **Adjusted Total Outflow**, **Revised Daily Allowance**, and **Budget Headroom**.
- **Confidence Intervals & Error Metrics**: Statistical upper and lower confidence boundaries along with model performance indicators (MAE, RMSE, $R^2$).
- **Retraining Engine Simulation**: Trigger on-demand retraining passes when new transaction records are logged.

### 7. Wealth & Investment Portfolio Manager
- **Multi-Asset Allocation**: Tracks holdings across **Equities (ETFs)**, **Mutual Funds**, **Sovereign Gold Bonds (SGBs)**, and **High-Yield Fixed Deposits (FDs)**.
- **Live Performance & Returns**: Calculates invested value, current market value (CMP), absolute profit/loss ($\Delta$), and percentage gain.
- **SIP Schedule Tracker**: Keeps tabs on active monthly SIP execution dates and quarterly fixed-deposit interest distributions.

### 8. Monthly Budget Planning & Utilization
- **Custom Budget Limits**: Define and update monthly target spending caps.
- **Utilization Gauges**: Visual status meters alerting users when spending approaches or exceeds $75\%$ and $90\%$ of allocated caps.
- **Category Guardrails**: Monitor spending limits against specific category allocations to avoid lifestyle creep.

### 9. AI Financial Assistant & Copilot (`ChatView`)
- **Dedicated Conversational Interface**: Interactive AI assistant equipped with context-aware quick prompt pills:
  - *October 2026 Forecast Analysis*
  - *Dining vs. Commute Variance Checks*
  - *High-Value Transaction Audits (> ₹3,000)*
  - *Model Retraining Protocols*
  - *Discretionary Spending Reduction Strategies*
- **Productivity Controls**: Fullscreen workspace toggle, prompt history drawer, message search filter, speech input toggles, and live query counter.

### 10. Automated CSV Reporting & Auditing
- **Instant Client-Side Blob Export**: Download comprehensive CSV archives containing transaction IDs, timestamps, merchants, categories, amounts, payment types, and notes.
- **Audit Verification Status**: Quick financial year overview and transaction verification badges for tax filing preparation.

### 11. Django Unfold Modern Admin Dashboard
- **Tailwind CSS Admin UI**: Configured with `django-unfold` for an intuitive back-office experience.
- **Visual Pill Badges & Currency Formatting**: Color-coded category tags and formatted decimals.
- **Granular Filter Bars**: Date range selectors, numeric range sliders, dropdown filters, and fast autocomplete search on foreign keys.
- **Import / Export Support**: Native integration with `django-import-export` for bulk data manipulation across CSV, Excel, and JSON formats.

---

## 🔄 End-to-End Project Architecture & Flow

### User Experience & Navigation Flow

```mermaid
flowchart TD
    Start([User Visits App]) --> Opening[Opening Animation / Scroll Zoom]
    Opening --> Login[Login / Register Page]
    Login --> Dashboard[Dashboard Overview]
    Dashboard -. Click Logo .-> Opening

    subgraph Dashboard Ecosystem
        Dashboard --> Overview[Financial KPI Overview & 3D Cards]
        Dashboard --> AddExp[Add Expense / Income + Receipt]
        Dashboard --> History[Transaction Ledger & Filters]
        Dashboard --> Analysis[Category Breakdown & Bubbles]
        Dashboard --> Prediction[ML Forecast & What-If Simulator]
        Dashboard --> Investments[Asset Portfolio & SIP Tracker]
        Dashboard --> Budget[Budget Limits & Utilization]
        Dashboard --> Reports[CSV Report Generator]
        Dashboard --> Profile[Smart Card & Security Settings]
        Dashboard --> ChatAI[Conversational AI Financial Copilot]
    end

    AddExp -. Real-time Store Sync .-> Overview
    AddExp -. Updates Ledger .-> History
    AddExp -. Retrains Inputs .-> Prediction
```

### System Architecture & Data Pipelines

```mermaid
flowchart LR
    subgraph Frontend ["React 18 + Vite (Client Layer)"]
        UI[Glassmorphic UI & 3D Tilt Cards]
        Store[(Local Shared Store & Event Bus)]
        AxiosClient[Axios HTTP Client]
        UI <--> Store
        UI --> AxiosClient
    end

    subgraph Backend ["Django 5.2 (Application Layer)"]
        DRF[Django REST Framework APIs]
        Admin[Django Unfold Admin UI]
        AppUsers[Users App]
        AppExpenses[Expenses App]
        AppBudgets[Budgets App]
        AppML[Predictions App]
        
        DRF --> AppUsers
        DRF --> AppExpenses
        DRF --> AppBudgets
        DRF --> AppML
    end

    subgraph ML ["Machine Learning Pipeline"]
        Scikit[Scikit-learn Regressors]
        Pandas[Pandas Data Preprocessing]
        Joblib[Joblib Serialized Models]
        Scikit <--> Pandas
        Scikit --> Joblib
    end

    subgraph Database ["Persistence Layer"]
        Supabase[(Supabase Cloud PostgreSQL)]
        SQLite[(Local SQLite Fallback)]
    end

    AxiosClient --> DRF
    AppExpenses <--> Supabase
    AppBudgets <--> Supabase
    AppUsers <--> Supabase
    AppML <--> Scikit
```

### Machine Learning Forecasting Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Frontend as React Prediction View
    participant Engine as What-If Calculation Engine
    participant Model as Scikit-Learn ML Model
    participant DB as Expense Records (Supabase)

    User->>Frontend: Opens Predictive Forecast
    Frontend->>DB: Fetch Aggregated Historical Monthly Spends
    DB-->>Frontend: Return Normalized Time-Series Data
    Frontend->>Model: Feed Features (Category Weights, Lagged Spends, MoM Trend)
    Model-->>Frontend: Return Base Forecast (₹15,420 ± Confidence Interval)
    User->>Frontend: Adjusts What-If Reduction Slider (-15% Food)
    Frontend->>Engine: Run Real-Time Sensitivity Matrix
    Engine-->>Frontend: Output Adjusted Total, New Daily Run Rate, & Headroom
    Frontend-->>User: Render Synchronized Forecast Chart & Savings Cards
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** | Functional components, custom hooks, reactive state, dynamic context |
| **Build Tool & Bundler** | **Vite 6** | Ultra-fast HMR (Hot Module Replacement) and optimized bundling |
| **Routing** | **React Router v7** | Nested dashboard routes, dynamic redirection shortcuts, error boundaries |
| **HTTP Client** | **Axios** | Pre-configured API client with baseURL, credentials, and interceptors |
| **Icons & Visuals** | **Lucide React** | Clean, modern iconography across navigation bars and metric widgets |
| **Styling & Theme** | **Vanilla CSS + Glassmorphism** | Custom dark mode design system, HSL color tokens, 3D perspective tilt |
| **Backend Framework** | **Django 5.2 (Python 3.13)** | Modular MTV/MVC architecture, ORM, authentication, and security |
| **API Framework** | **Django REST Framework (DRF)** | Serializers, ViewSets, and RESTful HTTP endpoints |
| **Admin Interface** | **Django Unfold** | Tailwind CSS-driven administrative panel with KPI metrics & dark mode |
| **Data Import/Export** | **django-import-export** | Admin CSV, Excel, and JSON data pipelines |
| **Machine Learning** | **Scikit-learn, Pandas, NumPy** | Regression models, sensitivity matrix, feature engineering, and metrics |
| **Model Serialization**| **Joblib** | Model persistence and quick artifact loading |
| **Primary Database** | **PostgreSQL (Supabase)** | Cloud-hosted relational database with SSL connection pooling |
| **Development DB** | **SQLite 3** | Zero-configuration local database fallback |
| **Configuration** | **python-decouple & dj-database-url** | Secure `.env` environment isolation and database URL parsing |

---

## 📁 Repository Structure

```text
ML-project/
├── README.md                          # Root project documentation
├── backend/                           # Django Backend Project
│   ├── manage.py                      # Django CLI management script
│   ├── requirements.txt               # Pinned Python dependencies
│   ├── .env.example                   # Environment configuration template
│   ├── .env                           # Local environment secrets (ignored by git)
│   ├── db.sqlite3                     # Local development SQLite database
│   ├── config/                        # Django Project Configuration
│   │   ├── __init__.py
│   │   ├── settings.py                # Database, CORS, Unfold, DRF settings
│   │   ├── urls.py                    # Root URL router
│   │   ├── wsgi.py                    # WSGI deployment entrypoint
│   │   └── asgi.py                    # ASGI deployment entrypoint
│   └── apps/                          # Modular Django Applications
│       ├── core/                      # Shared utility models and helpers
│       ├── users/                     # Custom User model & auth administration
│       ├── expenses/                  # Expense tracking, models & Unfold admin
│       ├── budgets/                   # Budget caps & category limit models
│       └── predictions/               # ML prediction endpoints & pipelines
└── frontend/                          # React + Vite Frontend Application
    ├── index.html                     # HTML5 root with Google Inter typography
    ├── package.json                   # Node.js dependencies & build scripts
    ├── vite.config.js                 # Vite plugins and server configuration
    ├── .env.example                   # Frontend environment template
    ├── .env                           # Local frontend environment config
    └── src/
        ├── main.jsx                   # React root mount with BrowserRouter
        ├── App.jsx                    # Top-level shell with Navbar & Footer
        ├── index.css                  # Design system: royal sapphire theme, cards, utilities
        ├── api/
        │   └── axios.js               # Configured Axios instance
        ├── utils/
        │   └── transactionStore.js    # Shared reactive transaction store
        ├── components/
        │   ├── Navbar.jsx             # Top navigation bar with route highlights
        │   ├── Sidebar.jsx            # Dashboard sidebar with deep links
        │   ├── Footer.jsx             # Footer with brand notes & links
        │   ├── Interactive3DCard.jsx  # Physics-driven 3D tilt payment card
        │   ├── Interactive3DCard.css   # 3D perspective, glare, and specular styling
        │   └── ShowcaseModernCard.jsx # Modern card components
        ├── pages/
        │   ├── Opening.jsx            # Particle canvas intro page
        │   ├── Home.jsx               # Feature showcase landing page
        │   ├── Login.jsx              # User login authentication
        │   ├── Register.jsx           # User registration form
        │   ├── NotFound.jsx           # 404 handler
        │   ├── Chat/
        │   │   ├── ChatView.jsx       # Conversational AI financial copilot
        │   │   └── ChatView.css       # Chat styles & sidebar styling
        │   └── Dashboard/
        │       ├── Dashboard.jsx      # Layout container (Sidebar + Outlet)
        │       ├── Overview.jsx       # KPI metric cards & primary card display
        │       ├── AddExpense.jsx     # Transaction creation & receipt preview
        │       ├── ExpenseHistory.jsx # Searchable & filterable transaction ledger
        │       ├── Analysis.jsx       # Categorical bubble & percentage analysis
        │       ├── Prediction.jsx     # ML forecast, confidence interval & What-If simulator
        │       ├── Investments.jsx    # Equity, MF, Gold & FD portfolio tracker
        │       ├── Budget.jsx         # Monthly budget limit & utilization tracker
        │       ├── Reports.jsx        # Instant CSV data export & audit summary
        │       └── Profile.jsx        # Smart card manager, PIN reveal & settings
        └── routes/
            └── AppRoutes.jsx          # Route hierarchy & direct dashboard redirects
```

---

## 💻 Local Installation & Setup Guide

### Prerequisites
Make sure the following tools are installed on your machine:
- **Python**: `3.10` or higher ([Download Python](https://www.python.org/downloads/))
- **Node.js**: `18.x` or higher and `npm` ([Download Node.js](https://nodejs.org/))
- **Git**: ([Download Git](https://git-scm.com/))

---

### 1. Backend Setup (Django)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     python -m venv venv
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Prepare your environment file:
   ```bash
   cp .env.example .env
   ```
   *(By default, if `DATABASE_URL` is commented out or empty, Django will seamlessly use the included local `db.sqlite3` file).*

5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

6. Create an administrator account (for Django Unfold Admin):
   ```bash
   python manage.py createsuperuser
   ```

7. Start the backend development server:
   ```bash
   python manage.py runserver
   ```
   - Django Server: **`http://127.0.0.1:8000/`**
   - Unfold Admin Panel: **`http://127.0.0.1:8000/admin/`**

---

### 2. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - React Web Application: **`http://localhost:5173/`**

---

### 3. Supabase PostgreSQL Integration

To link the backend to a managed PostgreSQL database on **Supabase**:

1. Create a project at [Supabase](https://supabase.com/).
2. In your Supabase Project Settings, navigate to **Database** &rarr; **Connection parameters**.
3. Copy the **URI** connection string:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Open `backend/.env` and update the `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://postgres:YourActualPassword@db.abcdefghijklm.supabase.co:5432/postgres
   ```
5. Apply migrations directly to Supabase:
   ```bash
   python manage.py migrate
   ```
   All models (`users_user`, `expenses_expense`, `budgets_budget`, etc.) will be automatically created with SSL connection pooling.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SECRET_KEY` | Django cryptographic signing key | `django-insecure-smart-expenses-key...` |
| `DEBUG` | Enable/Disable Django debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hostnames | `127.0.0.1,localhost` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` (Leave empty for SQLite) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated client origins | `http://localhost:5173,http://127.0.0.1:5173` |

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API base address | `http://127.0.0.1:8000/api` |

---

## 🔮 Roadmap & Future Enhancements

- [ ] **OCR Receipt Parsing**: Automated extraction of merchant, date, and line-item amounts directly from uploaded invoice images.
- [ ] **Real-time Bank Feed Sync**: Account Aggregator (AA) framework integration for live UPI/bank statement synchronization.
- [ ] **Advanced ML Time-Series (Prophet / LSTM)**: Deep-learning multi-step forecasting incorporating seasonality and salary cycles.
- [ ] **Multi-Currency Support**: Dynamic currency switching ($ USD, € EUR, £ GBP, ¥ JPY) with real-time exchange rates.
- [ ] **Push Notification Alerts**: Automated webhooks warning users when approaching 90% of category budget limits.

---

## 📄 License & Attribution

Developed with passion by **Rakesh Kamath**. Built with Django, React, Vite, and Scikit-Learn.
Distributed under the [MIT License](LICENSE).
