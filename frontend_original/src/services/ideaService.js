const API_BASE = 'http://localhost:5002/api/ideas';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user.token;
};

// Create a new idea
export async function createIdea(ideaData) {
  try {
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
  } catch (err) {
    console.error('Create idea error:', err);
    throw err;
  }
}

// Get all ideas for the current user
export async function getUserIdeas() {
  try {
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
  } catch (err) {
    console.error('Get ideas error:', err);
    throw err;
  }
}

// Get a specific idea by ID
export async function getIdeaById(ideaId) {
  try {
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
  } catch (err) {
    console.error('Get idea error:', err);
    throw err;
  }
}

// Update an idea
export async function updateIdea(ideaId, updates) {
  try {
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
  } catch (err) {
    console.error('Update idea error:', err);
    throw err;
  }
}

// Delete an idea
export async function deleteIdea(ideaId) {
  try {
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
  } catch (err) {
    console.error('Delete idea error:', err);
    throw err;
  }
}

// Export idea to PDF
export async function exportIdeaPdf(ideaId) {
  try {
    const response = await fetch(`${API_BASE}/${ideaId}/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to export idea');
    }

    return await response.json();
  } catch (err) {
    console.error('Export idea error:', err);
    throw err;
  }
}
