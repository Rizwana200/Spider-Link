import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import LostReport from "./pages/LostReport";
import FoundReport from "./pages/FoundReport";
import MyLostReports from "./pages/MyLostReports";
import MyFoundReports from "./pages/MyFoundReports";
import MatchDetails from "./pages/MatchDetails";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= PROTECTED ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-lost"
          element={
            <ProtectedRoute>
              <LostReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-found"
          element={
            <ProtectedRoute>
              <FoundReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-lost-reports"
          element={
            <ProtectedRoute>
              <MyLostReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-found-reports"
          element={
            <ProtectedRoute>
              <MyFoundReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches/:id"
          element={
            <ProtectedRoute>
              <MatchDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;