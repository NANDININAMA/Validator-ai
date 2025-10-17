const API_BASE = 'http://localhost:5002/api/expert';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user.token;
};

export async function fetchAllIdeasForReview() {
  const res = await fetch(`${API_BASE}/ideas`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load ideas');
  const data = await res.json();
  return data.ideas || [];
}

export async function getExpertProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load expert profile');
  const data = await res.json();
  return data.expert;
}

export async function createOrUpdateExpertProfile(profileData) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to save expert profile');
  return res.json();
}

export async function updateExpertProfile(profileData) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update expert profile');
  return res.json();
}

export async function submitExpertReview(ideaId, reviewData) {
  const res = await fetch(`${API_BASE}/ideas/${ideaId}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to submit review');
  return res.json();
}

export async function getMyReviews() {
  const res = await fetch(`${API_BASE}/my-reviews`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load reviews');
  const data = await res.json();
  return data.ideas || [];
}

// Get verification status
export async function getVerificationStatus() {
  const res = await fetch(`${API_BASE}/verification-status`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load verification status');
  return res.json();
}
