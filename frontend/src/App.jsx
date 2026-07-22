import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Nosotros from "./pages/Nosotros";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import "./styles/app.css";

function PublicLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content auth-layout">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />
          <Route
            path="/nosotros"
            element={
              <PublicLayout>
                <Nosotros />
              </PublicLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <PublicLayout>
                <Marketplace />
              </PublicLayout>
            }
          />

          {/* AUTH ROUTES */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
