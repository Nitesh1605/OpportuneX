// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventDetails from './pages/EventDetails'; // Import EventDetails
import Events from './pages/Events';
import Login from './pages/Login'; // Assuming you have a login page
import Dashboard from './pages/Dashboard'; // Assuming you have a dashboard page
import ProtectedRoute from './components/ProtectedRoute'; // Assuming this is your protected route component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Events />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Add a route for the event details page */}
        <Route path="/event/:id" element={<EventDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
