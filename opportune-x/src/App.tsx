import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageEvents from "./pages/ManageEvents";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/events/:id"
          element={
            <Layout>
              <EventDetails />
            </Layout>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

        {/* Admin Event Management */}
        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <Layout>
                <ManageEvents />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events/create"
          element={
            <AdminRoute>
              <Layout>
                <CreateEvent />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events/:id/edit"
          element={
            <AdminRoute>
              <Layout>
                <EditEvent />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
               element={
                 <ProtectedRoute>
                   <Layout>
                     <Profile />
                   </Layout>
                 </ProtectedRoute>
               }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
