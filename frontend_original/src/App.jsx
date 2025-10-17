import React, { useState, useEffect } from "react";
import "./App.css";
import { getUser, saveUser, logout, validateToken } from "./services/auth";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthForm from "./components/AuthForm";
import EntrepreneurDashboard from "./components/EntrepreneurDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ExpertDashboard from "./components/ExpertDashboard";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showHome, setShowHome] = useState(true);
  const [authPreset, setAuthPreset] = useState(undefined); // { mode: 'signup'|'signin', role: 'admin'|'expert'|'user' }

  // restore user on reload
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser && validateToken(storedUser.token)) {
      setUser(storedUser);
    } else {
      logout();
      setUser(null);
    }
  }, []);

  // ----------- AUTH HANDLERS -----------
  const handleAuthSuccess = (authenticatedUser) => {
    if (authenticatedUser) {
      setUser(authenticatedUser);
      saveUser(authenticatedUser);
      setError(null);
      setShowHome(false);
    } else {
      setError("Authentication failed");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowHome(true);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  // ----------- ENTREPRENEUR DASHBOARD -----------
  const renderEntrepreneur = () => (
    <EntrepreneurDashboard user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
  );

  // ----------- ADMIN DASHBOARD -----------
  const renderAdmin = () => (
    <AdminDashboard user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
  );

  // ----------- EXPERT DASHBOARD -----------
  const renderExpert = () => (
    <ExpertDashboard user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
  );

  // ----------- MAIN VIEW SWITCH -----------
  if (!user) {
    if (showHome) {
      return (
        <Home
          onGetStarted={() => { setAuthPreset(undefined); setShowHome(false); }}
          onAdminLogin={() => { setAuthPreset({ mode: 'signup', role: 'admin' }); setShowHome(false); }}
          onExpertLogin={() => { setAuthPreset({ mode: 'signup', role: 'expert' }); setShowHome(false); }}
        />
      );
    }
    return <AuthForm onAuthSuccess={handleAuthSuccess} preset={authPreset} />;
  }

  if (user.role === "user" || user.role === "entrepreneur") return renderEntrepreneur();
  if (user.role === "admin") return renderAdmin();
  if (user.role === "expert") return renderExpert();

  return <div>Access Denied ❌</div>;
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
