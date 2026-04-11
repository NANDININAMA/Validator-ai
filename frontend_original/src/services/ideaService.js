const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002'}/api/ideas`;

// ✅ FIXED: Consistent token retrieval - check both storage formats
const getAuthToken = () => {
  // First try the new format (currentUser)
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      if (user.token) return user.token;
    } catch (e) {
      console.error('Failed to parse currentUser:', e);
    }
  }
  
  // Fallback to old format (token)
  return localStorage.getItem("token");
};

// Create idea
export async function createIdea(ideaData) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
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
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
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
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}/${ideaId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
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
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const response = await fetch(`${API_BASE}/${ideaId}/export`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to export idea');
  }

  const blob = await response.blob();
  return { blob, filename: `idea-${ideaId}.pdf` };
}
