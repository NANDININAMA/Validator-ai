// src/services/auth.js

const API_BASE = "http://localhost:5002/api/auth";

// Signup
export async function signup(signupData) {
  try {
    console.log('Attempting signup with:', { ...signupData, password: '***' });
    console.log('API_BASE:', API_BASE);
    
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Signup error:', errorData);
      throw new Error(errorData.message || "Signup failed");
    }
    
    const data = await res.json();
    console.log('Signup success:', data);
    return {
      user: data.user,
      token: data.token
    };
  } catch (err) {
    console.error('Signup catch error:', err);
    throw err;
  }
}

// Login
export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await res.json();
    return {
      user: data.user,
      token: data.token
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Local storage helpers
export function saveUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function getUser() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem("currentUser");
}

// Token validation (optional for frontend)
export function validateToken(token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1] || '{}'));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
