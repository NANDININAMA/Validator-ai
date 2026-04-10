const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}/api/ideas`;

// ✅ FIXED: get token directly
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create idea
export async function createIdea(ideaData) {
  const response = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(ideaData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create idea');
  }

  return await response.json();
}

// Get ideas
export async function getUserIdeas() {
  const response = await fetch(`${API_BASE}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch ideas');
  }

  return await response.json();
}

// Get idea by ID
export async function getIdeaById(ideaId) {
  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch idea');
  }

  return await response.json();
}

// Update idea
export async function updateIdea(ideaId, updates) {
  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update idea');
  }

  return await response.json();
}

// Delete idea
export async function deleteIdea(ideaId) {
  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete idea');
  }

  return await response.json();
}

// Export PDF
export async function exportIdeaPdf(ideaId) {
  const response = await fetch(`${API_BASE}/${ideaId}/export`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to export idea');
  }

  const blob = await response.blob();
  return blob;
}
