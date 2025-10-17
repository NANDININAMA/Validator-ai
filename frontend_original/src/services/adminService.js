const API_BASE = 'http://localhost:5002/api/admin';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user.token;
};

export async function fetchAllIdeas() {
  const res = await fetch(`${API_BASE}/ideas`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load ideas');
  const data = await res.json();
  return data.ideas || [];
}

export async function submitFeedback(ideaId, feedback) {
  const res = await fetch(`${API_BASE}/ideas/${ideaId}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ feedback })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to submit feedback');
  return res.json();
}

// User Management
export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load users');
  const data = await res.json();
  return data.users || [];
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_BASE}/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ role })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update user role');
  return res.json();
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete user');
  return res.json();
}

// Idea Management
export async function deleteIdea(ideaId) {
  const res = await fetch(`${API_BASE}/ideas/${ideaId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete idea');
  return res.json();
}

export async function updateIdea(ideaId, updates) {
  const res = await fetch(`${API_BASE}/ideas/${ideaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update idea');
  return res.json();
}

// Expert Management
export async function getAllExperts() {
  const res = await fetch(`${API_BASE}/experts`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load experts');
  const data = await res.json();
  return data.experts || [];
}

export async function getPendingExperts() {
  const res = await fetch(`${API_BASE}/experts/pending`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load pending experts');
  const data = await res.json();
  return data.experts || [];
}

export async function verifyExpert(expertId, verificationData) {
  const res = await fetch(`${API_BASE}/experts/${expertId}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(verificationData)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to verify expert');
  return res.json();
}

export async function toggleExpertStatus(expertId, isActive) {
  const res = await fetch(`${API_BASE}/experts/${expertId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ isActive })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update expert status');
  return res.json();
}

// Bulk Operations
export async function bulkDeleteIdeas(ideaIds) {
  const res = await fetch(`${API_BASE}/ideas/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ ideaIds })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete ideas');
  return res.json();
}

export async function bulkUpdateUserRoles(updates) {
  const res = await fetch(`${API_BASE}/users/bulk-update-roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({ updates })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update user roles');
  return res.json();
}

// System Monitoring and Analytics
export async function fetchSystemStats() {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load system stats');
  return res.json();
}

export async function getSystemHealth() {
  const res = await fetch(`${API_BASE}/health`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load system health');
  return res.json();
}

export async function getRecentActivity() {
  const res = await fetch(`${API_BASE}/activity`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load recent activity');
  return res.json();
}

// CSV Export functions
export function exportIdeasToCSV(ideas) {
  const headers = ['Title', 'Problem', 'Solution', 'Market', 'Revenue Model', 'Team', 'Score', 'Classification', 'User', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...ideas.map(idea => [
      `"${(idea.title || idea.problem?.slice(0, 50) || 'Idea').replace(/"/g, '""')}"`,
      `"${(idea.problem || '').replace(/"/g, '""')}"`,
      `"${(idea.solution || '').replace(/"/g, '""')}"`,
      `"${(idea.market || '').replace(/"/g, '""')}"`,
      `"${(idea.revenueModel || '').replace(/"/g, '""')}"`,
      `"${(idea.team || '').replace(/"/g, '""')}"`,
      idea.score || 0,
      idea.classification || '',
      `"${(idea.user?.name || idea.user?.email || 'User').replace(/"/g, '""')}"`,
      new Date(idea.createdAt).toLocaleString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `ideas_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportUsersToCSV(users) {
  const headers = ['Name', 'Email', 'Role', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      `"${(user.name || 'Unnamed User').replace(/"/g, '""')}"`,
      `"${(user.email || '').replace(/"/g, '""')}"`,
      user.role || 'user',
      new Date(user.createdAt).toLocaleString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


