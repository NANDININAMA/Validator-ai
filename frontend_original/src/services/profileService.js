// src/services/profileService.js

const API_BASE = "http://localhost:5002/api/auth";

// Get user profile
export async function getProfile() {
  try {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if (!token) throw new Error('No authentication token found');

    const res = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('getProfile error:', err);
    throw err;
  }
}

// Update user profile
export async function updateProfile(profileData) {
  try {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if (!token) throw new Error('No authentication token found');

    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('updateProfile error:', err);
    throw err;
  }
}

// Change password
export async function changePassword(passwordData) {
  try {
    const token = JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    if (!token) throw new Error('No authentication token found');

    const res = await fetch(`${API_BASE}/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('changePassword error:', err);
    throw err;
  }
}
