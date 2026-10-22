import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Root Entry Pages
import Opening from '../pages/Opening';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Dashboard Pages (Intact & Preserved)
import Dashboard from '../pages/Dashboard/Dashboard';
import Overview from '../pages/Dashboard/Overview';
import AddExpense from '../pages/Dashboard/AddExpense';
import ExpenseHistory from '../pages/Dashboard/ExpenseHistory';
import Analysis from '../pages/Dashboard/Analysis';
import Prediction from '../pages/Dashboard/Prediction';
import Budget from '../pages/Dashboard/Budget';
import Reports from '../pages/Dashboard/Reports';
import Investments from '../pages/Dashboard/Investments';
import Profile from '../pages/Dashboard/Profile';

// Chat AI Assistant
import ChatView from '../pages/Chat/ChatView';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Entry Flow: Opening -> Login -> Dashboard */}
      <Route path="/" element={<Opening />} />
      <Route path="/opening" element={<Opening />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<ChatView />} />
      <Route path="/ai" element={<Navigate to="/chat" replace />} />

      {/* Dashboard Nested Routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="chat" element={<ChatView />} />
        <Route path="add-expense" element={<AddExpense />} />
        <Route path="history" element={<ExpenseHistory />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="budget" element={<Budget />} />
        <Route path="reports" element={<Reports />} />
        <Route path="investments" element={<Investments />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Direct Top-Nav Shortcuts Redirecting to Nested Dashboard Routes */}
      <Route path="/add-expense" element={<Navigate to="/dashboard/add-expense" replace />} />
      <Route path="/history" element={<Navigate to="/dashboard/history" replace />} />
      <Route path="/analysis" element={<Navigate to="/dashboard/analysis" replace />} />
      <Route path="/prediction" element={<Navigate to="/dashboard/prediction" replace />} />
      <Route path="/budget" element={<Navigate to="/dashboard/budget" replace />} />
      <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
      <Route path="/investments" element={<Navigate to="/dashboard/investments" replace />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
