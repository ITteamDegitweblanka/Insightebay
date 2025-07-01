import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Segments from './pages/Segments';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import EmployeePerformance from './pages/EmployeePerformance';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <div className="flex min-h-screen bg-background font-sans">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-performance" element={<EmployeePerformance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/segments" element={<Segments />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
