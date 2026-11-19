
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import ClientLayout from "./components/client/ClientLayout";
import FreelancerLayout from "./components/freelancer/FreelancerLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import ClientDashboard from "./pages/client/ClientDashboard";
import ClientApplications from "./pages/client/ClientApplications";
import PostJob from "./pages/client/PostJob";

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerApplications from "./pages/freelancer/FreelancerApplications";

import JobDetails from "./pages/jobs/JobDetails";
import MyProjects from "./pages/client/MyProjects";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />

          {/* Client routes - Shared Sidebar Layout */}
          <Route
            path="/client"
            element={
              <ProtectedRoute role="client">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<ClientDashboard />}
            />
            <Route path="projects" element={<MyProjects />} />
            <Route
              path="post-job"
              element={<PostJob />}
            />

            <Route
              path="applications"
              element={<ClientApplications />}
            />
          </Route>

          {/* Freelancer routes - Shared Sidebar Layout */}
          <Route
            path="/freelancer"
            element={
              <ProtectedRoute role="freelancer">
                <FreelancerLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<FreelancerDashboard />}
            />

            <Route
              path="applications"
              element={<FreelancerApplications />}
            />
          </Route>

          {/* Job Details */}
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
