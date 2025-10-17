import React, { useState, useEffect } from "react";
import { 
  fetchAllIdeas, 
  submitFeedback, 
  deleteIdea, 
  updateIdea,
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  fetchSystemStats,
  exportIdeasToCSV,
  exportUsersToCSV,
  verifyExpert,
  toggleExpertStatus,
  bulkDeleteIdeas,
  bulkUpdateUserRoles,
  getAllExperts,
  getPendingExperts
} from "../services/adminService";
import { useTheme } from "../contexts/ThemeContext";
import RadarChart from "./RadarChart";
import UserProfile from "./UserProfile";

function AdminDashboard({ user, onLogout, onUserUpdate }) {
  const { theme, toggleTheme } = useTheme();
  const [ideas, setIdeas] = useState([]);
  const [experts, setExperts] = useState([]);
  const [pendingExperts, setPendingExperts] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingFeedback, setPendingFeedback] = useState({});
  const [activeTab, setActiveTab] = useState('ideas');
  const [showProfile, setShowProfile] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterClassification, setFilterClassification] = useState("all");
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [messageUser, setMessageUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ideasData, expertsData, pendingData, usersData, statsData] = await Promise.all([
          fetchAllIdeas(),
          getAllExperts().catch(() => []),
          getPendingExperts().catch(() => []),
          fetchAllUsers().catch(() => []),
          fetchSystemStats().catch(() => null)
        ]);
        setIdeas(ideasData);
        setExperts(expertsData);
        setPendingExperts(pendingData);
        setUsers(usersData);
        setSystemStats(statsData);
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChangeFeedback = (id, value) => {
    setPendingFeedback({ ...pendingFeedback, [id]: value });
  };

  const onSubmitFeedback = async (id) => {
    try {
      const text = (pendingFeedback[id] || '').trim();
      if (!text) return;
      const res = await submitFeedback(id, text);
      const updatedIdea = res.idea;
      setIdeas(ideas.map(i => i._id === id ? updatedIdea : i));
      setPendingFeedback({ ...pendingFeedback, [id]: '' });
    } catch (e) {
      setError(e.message || 'Failed to submit feedback');
    }
  };

  const handleVerifyExpert = async (expertId, isVerified) => {
    try {
      const notes = verificationNotes[expertId] || '';
      await verifyExpert(expertId, { isVerified, verificationNotes: notes });
      
      // Update the pending experts list
      setPendingExperts(pendingExperts.filter(expert => expert._id !== expertId));
      
      // If verified, add to experts list
      if (isVerified) {
        const verifiedExpert = pendingExperts.find(expert => expert._id === expertId);
        if (verifiedExpert) {
          setExperts([...experts, { ...verifiedExpert, isVerified: true }]);
        }
      }
      
      setVerificationNotes({ ...verificationNotes, [expertId]: '' });
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to verify expert');
    }
  };

  const handleVerificationNotesChange = (expertId, notes) => {
    setVerificationNotes({ ...verificationNotes, [expertId]: notes });
  };

  const handleProfileUpdate = (updatedUser) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    setShowProfile(false);
  };

  // Idea management handlers
  const handleDeleteIdea = async (ideaId) => {
    if (!window.confirm('Are you sure you want to delete this idea?')) return;
    try {
      await deleteIdea(ideaId);
      setIdeas(ideas.filter(idea => idea._id !== ideaId));
    } catch (e) {
      setError(e.message || 'Failed to delete idea');
    }
  };

  const handleUpdateIdea = async (ideaId, updates) => {
    try {
      const updatedIdea = await updateIdea(ideaId, updates);
      setIdeas(ideas.map(idea => idea._id === ideaId ? updatedIdea.idea : idea));
      setEditingIdea(null);
    } catch (e) {
      setError(e.message || 'Failed to update idea');
    }
  };

  // User management handlers
  const handleUpdateUserRole = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setUsers(users.map(user => user._id === userId ? { ...user, role } : user));
    } catch (e) {
      setError(e.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (e) {
      setError(e.message || 'Failed to delete user');
    }
  };

  // Expert management handlers
  const handleToggleExpertStatus = async (expertId, isActive) => {
    try {
      await toggleExpertStatus(expertId, isActive);
      setExperts(experts.map(expert => 
        expert._id === expertId ? { ...expert, isActive } : expert
      ));
    } catch (e) {
      setError(e.message || 'Failed to update expert status');
    }
  };

  // Bulk operations handlers
  const handleBulkDeleteIdeas = async () => {
    if (selectedIdeas.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIdeas.length} ideas?`)) return;
    try {
      await bulkDeleteIdeas(selectedIdeas);
      setIdeas(ideas.filter(idea => !selectedIdeas.includes(idea._id)));
      setSelectedIdeas([]);
      setShowBulkActions(false);
    } catch (e) {
      setError(e.message || 'Failed to delete ideas');
    }
  };

  const handleBulkUpdateUserRoles = async (role) => {
    if (selectedUsers.length === 0) return;
    if (!window.confirm(`Are you sure you want to update ${selectedUsers.length} users to ${role}?`)) return;
    try {
      const updates = selectedUsers.map(userId => ({ userId, role }));
      await bulkUpdateUserRoles(updates);
      setUsers(users.map(user => 
        selectedUsers.includes(user._id) ? { ...user, role } : user
      ));
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (e) {
      setError(e.message || 'Failed to update user roles');
    }
  };

  // Selection handlers
  const handleSelectIdea = (ideaId) => {
    setSelectedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllIdeas = () => {
    if (selectedIdeas.length === filteredIdeas.length) {
      setSelectedIdeas([]);
    } else {
      setSelectedIdeas(filteredIdeas.map(idea => idea._id));
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Filter functions
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchTerm || 
      idea.problem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.solution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClassification = filterClassification === "all" || 
      idea.classification === filterClassification;
    
    return matchesSearch && matchesClassification;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🛠️ Admin Dashboard</h1>
          <p>Welcome back, {user?.name || user?.email}! Review and give expert feedback.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowProfile(true)}
            className="btn-secondary"
          >
            👤 Profile
          </button>
          <button onClick={onLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          💡 Ideas ({ideas.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👤 Users ({users.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'experts' ? 'active' : ''}`}
          onClick={() => setActiveTab('experts')}
        >
          👥 Verified Experts ({experts.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'pending-experts' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending-experts')}
        >
          ⏳ Pending Verification ({pendingExperts.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        
      </div>

      {activeTab === 'ideas' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>💡 Submitted Ideas ({filteredIdeas.length})</h2>
            <div className="section-controls">
              <div className="filter-controls">
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterClassification}
                  onChange={(e) => setFilterClassification(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Classifications</option>
                  <option value="High">High Potential</option>
                  <option value="Moderate">Moderate Potential</option>
                  <option value="Low">Low Potential</option>
                </select>
              </div>
              <button 
                className="btn-secondary export-btn"
                onClick={() => exportIdeasToCSV(filteredIdeas)}
                title="Export ideas to CSV"
              >
                📊 Export CSV
              </button>
            </div>
          </div>
        {filteredIdeas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No ideas yet</h3>
            <p>New ideas will appear here as users submit them.</p>
          </div>
        ) : (
          <div className="ideas-grid">
            {filteredIdeas.map((idea) => (
              <div key={idea._id} className="idea-card">
                <div className="idea-header">
                  <h3>{idea.title || idea.problem?.slice(0, 60) || 'Idea'}</h3>
                  <div className="idea-score">
                    <span className="score-badge">{idea.score}/100</span>
                    <span className="classification-badge">{idea.classification}</span>
                  </div>
                </div>
                <div className="idea-content">
                  <div className="idea-field">
                    <strong>By</strong>
                    <p>{idea.user?.name || idea.user?.email || 'User'}</p>
                  </div>
                  <div className="idea-field">
                    <strong>Problem</strong>
                    <p>{idea.problem}</p>
                  </div>
                  <div className="idea-field">
                    <strong>Solution</strong>
                    <p>{idea.solution}</p>
                  </div>
                  <div className="idea-field">
                    <strong>Market</strong>
                    <p>{idea.market}</p>
                  </div>
                  <div className="idea-field">
                    <strong>Revenue Model</strong>
                    <p>{idea.revenueModel}</p>
                  </div>
                  <div className="idea-field">
                    <strong>Team</strong>
                    <p>{idea.team}</p>
                  </div>
                  
                  {idea.breakdown && (
                    <div className="idea-field breakdown-section">
                      <strong>Analysis Breakdown</strong>
                      <div className="breakdown-chart">
                        <RadarChart breakdown={idea.breakdown} size={200} showLabels={true} showValues={false} />
                      </div>
                    </div>
                  )}
                  
                  {idea.suggestions && idea.suggestions.length > 0 && (
                    <div className="idea-field">
                      <strong>Suggestions</strong>
                      <ul>
                        {idea.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {idea.feedback && (
                    <div className="idea-field">
                      <strong>Existing Feedback</strong>
                      <p>{idea.feedback}</p>
                    </div>
                  )}
                  
                  {idea.expertReviews && idea.expertReviews.length > 0 && (
                    <div className="idea-field">
                      <strong>Expert Reviews ({idea.totalExpertReviews})</strong>
                      <div className="expert-reviews">
                        {idea.expertReviews.map((review, idx) => (
                          <div key={idx} className="expert-review-card">
                            <div className="review-header">
                                <div className="expert-info">
                                  <span className="expert-name">
                                    {review.expert?.user?.name || review.expert?.specialization || 'Expert'}
                                    {review.expert?.isVerified && (
                                      <span className="verified-badge" title="Verified Expert">✅</span>
                                    )}
                                  </span>
                                  {review.expert?.specialization && (
                                    <span className="expert-specialization">
                                      ({review.expert.specialization})
                                    </span>
                                  )}
                                </div>
                              <div className="review-meta">
                                <span className="review-rating">
                                  {'★'.repeat(review.rating)}
                                  {'☆'.repeat(5 - review.rating)}
                                </span>
                                <span className="rating-number">({review.rating}/5)</span>
                              </div>
                            </div>
                            <div className="review-content">
                              <p className="review-text">{review.review}</p>
                              {review.feedback && (
                                <div className="expert-feedback">
                                  <strong>Additional Feedback:</strong>
                                  <p>{review.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="idea-footer">
                  <small>Submitted: {new Date(idea.createdAt).toLocaleString()}</small>
                  <div className="idea-actions">
                    <button 
                      className="btn-small btn-secondary"
                      onClick={() => setEditingIdea(idea)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteIdea(idea._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="feedback-editor">
                  <textarea
                    placeholder="Write expert feedback..."
                    value={pendingFeedback[idea._id] ?? ''}
                    onChange={(e)=> onChangeFeedback(idea._id, e.target.value)}
                    rows={3}
                  />
                  <button className="btn-primary" onClick={()=> onSubmitFeedback(idea._id)}>Send Feedback</button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>👤 User Management ({filteredUsers.length})</h2>
            <div className="section-controls">
              <div className="filter-controls">
                <div className="search-container">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input enhanced"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select enhanced"
                >
                  <option value="all">All Roles ({users.length})</option>
                  <option value="user">Users ({users.filter(u => u.role === 'user').length})</option>
                  <option value="expert">Experts ({users.filter(u => u.role === 'expert').length})</option>
                  <option value="admin">Admins ({users.filter(u => u.role === 'admin').length})</option>
                </select>
              </div>
              <div className="action-controls">
                <button 
                  className="btn-secondary export-btn"
                  onClick={() => exportUsersToCSV(filteredUsers)}
                  title="Export users to CSV"
                >
                  📊 Export CSV
                </button>
                <button 
                  className="btn-primary add-user-btn"
                  onClick={() => setShowAddUser(true)}
                  title="Add new user"
                >
                  ➕ Add User
                </button>
              </div>
            </div>
          </div>
          
          {/* User Statistics */}
          <div className="user-stats-bar">
            <div className="stat-item">
              <span className="stat-icon">👤</span>
              <div className="stat-content">
                <span className="stat-number">{users.filter(u => u.role === 'user').length}</span>
                <span className="stat-label">Regular Users</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <div className="stat-content">
                <span className="stat-number">{users.filter(u => u.role === 'expert').length}</span>
                <span className="stat-label">Experts</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🛠️</span>
              <div className="stat-content">
                <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
                <span className="stat-label">Admins</span>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📅</span>
              <div className="stat-content">
                <span className="stat-number">{users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</span>
                <span className="stat-label">New (30d)</span>
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="empty-state enhanced">
              <div className="empty-icon">👤</div>
              <h3>No users found</h3>
              <p>No users match your current search criteria.</p>
              <button className="btn-primary" onClick={() => setSearchTerm('')}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="enhanced-users-grid">
              {filteredUsers.map((user) => {
                const userIdeas = ideas.filter(idea => idea.user?._id === user._id || idea.user?.email === user.email);
                const joinedDays = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
                const isNewUser = joinedDays <= 7;
                
                return (
                  <div key={user._id} className="enhanced-user-card">
                    <div className="user-card-header">
                      <div className="user-avatar">
                        <span className="avatar-text">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                        {isNewUser && <span className="new-badge">NEW</span>}
                      </div>
                      <div className="user-info">
                        <h3 className="user-name">{user.name || 'Unnamed User'}</h3>
                        <p className="user-email">{user.email}</p>
                        <div className="user-meta">
                          <span className="join-date">Joined {joinedDays === 0 ? 'today' : `${joinedDays} days ago`}</span>
                        </div>
                      </div>
                      <div className="user-role-section">
                        <span className={`role-badge enhanced ${user.role}`}>
                          {user.role === 'user' && '👤'}
                          {user.role === 'expert' && '👥'}
                          {user.role === 'admin' && '🛠️'}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="user-card-content">
                      <div className="user-stats">
                        <div className="user-stat">
                          <span className="stat-value">{userIdeas.length}</span>
                          <span className="stat-label">Ideas</span>
                        </div>
                        <div className="user-stat">
                          <span className="stat-value">
                            {userIdeas.length > 0 ? Math.round(userIdeas.reduce((sum, idea) => sum + idea.score, 0) / userIdeas.length) : 0}
                          </span>
                          <span className="stat-label">Avg Score</span>
                        </div>
                        <div className="user-stat">
                          <span className="stat-value">
                            {user.role === 'expert' ? 
                              experts.find(e => e.user?._id === user._id)?.totalReviews || 0 : 
                              userIdeas.filter(idea => idea.expertReviews?.length > 0).length
                            }
                          </span>
                          <span className="stat-label">{user.role === 'expert' ? 'Reviews' : 'Reviewed'}</span>
                        </div>
                      </div>
                      
                      <div className="user-actions-section">
                        <div className="role-management">
                          <label className="role-label">Role:</label>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                            className="role-select enhanced"
                            disabled={user._id === user._id} // Prevent self-role change
                          >
                            <option value="user">👤 User</option>
                            <option value="expert">👥 Expert</option>
                            <option value="admin">🛠️ Admin</option>
                          </select>
                        </div>
                        
                        <div className="quick-actions">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => setViewingUser(user)}
                            title="View user details"
                          >
                            👁️
                          </button>
                          <button 
                            className="action-btn message-btn"
                            onClick={() => setMessageUser(user)}
                            title="Send message"
                          >
                            💬
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user._id === user._id}
                            title="Delete user"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="user-card-footer">
                      <div className="activity-indicator">
                        <span className={`activity-dot ${userIdeas.some(idea => new Date(idea.createdAt) > new Date(Date.now() - 7*24*60*60*1000)) ? 'active' : 'inactive'}`}></span>
                        <span className="activity-text">
                          {userIdeas.some(idea => new Date(idea.createdAt) > new Date(Date.now() - 7*24*60*60*1000)) ? 'Active this week' : 'Inactive'}
                        </span>
                      </div>
                      <div className="user-id">
                        ID: {user._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="admin-section">
          <h2>👥 Expert Management ({experts.length})</h2>
          {experts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No experts yet</h3>
              <p>Experts will appear here once they create their profiles.</p>
            </div>
          ) : (
            <div className="experts-grid">
              {experts.map((expert) => (
                <div key={expert._id} className="expert-card">
                  <div className="expert-header">
                    <h3>{expert.user?.name || expert.user?.email}</h3>
                    <div className="expert-status">
                      <span className={`status-badge ${expert.isActive ? 'active' : 'inactive'}`}>
                        {expert.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="expert-content">
                    <div className="expert-field">
                      <strong>Specialization</strong>
                      <p>{expert.specialization}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Experience</strong>
                      <p>{expert.experience} years</p>
                    </div>
                    <div className="expert-field">
                      <strong>Bio</strong>
                      <p>{expert.bio}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Expertise</strong>
                      <div className="expertise-tags">
                        {expert.expertise.map((skill, idx) => (
                          <span key={idx} className="expertise-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="expert-stats">
                      <div className="stat">
                        <span className="stat-value">{expert.totalReviews}</span>
                        <span className="stat-label">Reviews</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{expert.rating.toFixed(1)}</span>
                        <span className="stat-label">Rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="expert-footer">
                    <small>Joined: {new Date(expert.createdAt).toLocaleString()}</small>
                    <div className="expert-actions">
                      <button 
                        className={`btn-small ${expert.isActive ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleExpertStatus(expert._id, !expert.isActive)}
                      >
                        {expert.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending-experts' && (
        <div className="admin-section">
          <h2>⏳ Expert Verification ({pendingExperts.length})</h2>
          {pendingExperts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No pending verifications</h3>
              <p>All expert applications have been reviewed.</p>
            </div>
          ) : (
            <div className="pending-experts-grid">
              {pendingExperts.map((expert) => (
                <div key={expert._id} className="pending-expert-card">
                  <div className="expert-header">
                    <h3>{expert.user?.name || expert.user?.email}</h3>
                    <div className="expert-status">
                      <span className="status-badge pending">Pending Review</span>
                    </div>
                  </div>
                  <div className="expert-content">
                    <div className="expert-field">
                      <strong>Email</strong>
                      <p>{expert.user?.email}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Specialization</strong>
                      <p>{expert.specialization}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Profession</strong>
                      <p>{expert.profession}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Experience</strong>
                      <p>{expert.experience} years</p>
                    </div>
                    <div className="expert-field">
                      <strong>Current Company</strong>
                      <p>{expert.company || 'Not specified'}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Bio</strong>
                      <p>{expert.bio}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Expertise</strong>
                      <div className="expertise-tags">
                        {expert.expertise.map((skill, idx) => (
                          <span key={idx} className="expertise-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="expert-field">
                      <strong>LinkedIn</strong>
                      <p>
                        {expert.linkedin ? (
                          <a href={expert.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                            {expert.linkedin}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div className="expert-field">
                      <strong>GitHub</strong>
                      <p>
                        {expert.github ? (
                          <a href={expert.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                            {expert.github}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div className="expert-field">
                      <strong>Education</strong>
                      <p>{expert.education || 'Not specified'}</p>
                    </div>
                    <div className="expert-field">
                      <strong>Certifications</strong>
                      <div className="expertise-tags">
                        {expert.certifications.length > 0 ? expert.certifications.map((cert, idx) => (
                          <span key={idx} className="expertise-tag">{cert}</span>
                        )) : <span className="no-data">None specified</span>}
                      </div>
                    </div>
                    <div className="expert-field">
                      <strong>Previous Companies</strong>
                      <div className="expertise-tags">
                        {expert.previousCompanies.length > 0 ? expert.previousCompanies.map((company, idx) => (
                          <span key={idx} className="expertise-tag">{company}</span>
                        )) : <span className="no-data">None specified</span>}
                      </div>
                    </div>
                    <div className="expert-field">
                      <strong>Achievements</strong>
                      <div className="expertise-tags">
                        {expert.achievements.length > 0 ? expert.achievements.map((achievement, idx) => (
                          <span key={idx} className="expertise-tag">{achievement}</span>
                        )) : <span className="no-data">None specified</span>}
                      </div>
                    </div>
                    <div className="expert-field">
                      <strong>Applied</strong>
                      <p>{new Date(expert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="verification-section">
                    <div className="verification-notes">
                      <label>Verification Notes:</label>
                      <textarea
                        value={verificationNotes[expert._id] || ''}
                        onChange={(e) => handleVerificationNotesChange(expert._id, e.target.value)}
                        placeholder="Add notes for verification decision..."
                        rows="3"
                      />
                    </div>
                    <div className="verification-actions">
                      <button
                        onClick={() => handleVerifyExpert(expert._id, false)}
                        className="btn-reject"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => handleVerifyExpert(expert._id, true)}
                        className="btn-approve"
                      >
                        ✅ Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="admin-section">
          <h2>📊 Analytics Dashboard</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-icon">💡</div>
              <div className="analytics-content">
                <h3>{systemStats?.totalIdeas || ideas.length}</h3>
                <p>Total Ideas</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">👤</div>
              <div className="analytics-content">
                <h3>{systemStats?.totalUsers || users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">👥</div>
              <div className="analytics-content">
                <h3>{systemStats?.activeExperts || experts.filter(e => e.isActive).length}</h3>
                <p>Active Experts</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-icon">📈</div>
              <div className="analytics-content">
                <h3>{systemStats?.averageScore ? systemStats.averageScore.toFixed(1) : '0.0'}</h3>
                <p>Avg Score</p>
              </div>
            </div>
          </div>
          
          <div className="analytics-charts">
            <div className="chart-card">
              <h3>Ideas by Classification</h3>
              <div className="classification-chart">
                {['High', 'Moderate', 'Low'].map(classification => {
                  const count = ideas.filter(idea => idea.classification === classification).length;
                  const percentage = ideas.length > 0 ? (count / ideas.length) * 100 : 0;
                  return (
                    <div key={classification} className="chart-bar">
                      <div className="bar-label">{classification}</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="bar-value">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {systemStats?.ideasByMonth && systemStats.ideasByMonth.length > 0 && (
              <div className="chart-card">
                <h3>Ideas Submitted Over Time</h3>
                <div className="monthly-chart">
                  <div className="chart-container">
                    {systemStats.ideasByMonth.map((month, index) => {
                      const maxCount = Math.max(...systemStats.ideasByMonth.map(m => m.count));
                      const height = (month.count / maxCount) * 100;
                      const monthName = new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'short' });
                      return (
                        <div key={index} className="month-bar">
                          <div 
                            className="month-bar-fill"
                            style={{ height: `${height}%` }}
                            title={`${monthName} ${month._id.year}: ${month.count} ideas`}
                          ></div>
                          <div className="month-label">{monthName}</div>
                          <div className="month-value">{month.count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="chart-card">
              <h3>User Distribution</h3>
              <div className="user-distribution">
                <div className="distribution-item">
                  <div className="distribution-icon">👤</div>
                  <div className="distribution-content">
                    <h4>{users.filter(u => u.role === 'user').length}</h4>
                    <p>Regular Users</p>
                  </div>
                </div>
                <div className="distribution-item">
                  <div className="distribution-icon">👥</div>
                  <div className="distribution-content">
                    <h4>{users.filter(u => u.role === 'expert').length}</h4>
                    <p>Experts</p>
                  </div>
                </div>
                <div className="distribution-item">
                  <div className="distribution-icon">🛠️</div>
                  <div className="distribution-content">
                    <h4>{users.filter(u => u.role === 'admin').length}</h4>
                    <p>Admins</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Score Distribution</h3>
              <div className="score-distribution">
                {['0-20', '21-40', '41-60', '61-80', '81-100'].map(range => {
                  const [min, max] = range.split('-').map(Number);
                  const count = ideas.filter(idea => idea.score >= min && idea.score <= max).length;
                  const percentage = ideas.length > 0 ? (count / ideas.length) * 100 : 0;
                  return (
                    <div key={range} className="score-range">
                      <div className="score-range-label">{range}</div>
                      <div className="score-range-bar">
                        <div 
                          className="score-range-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="score-range-value">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      

      {showProfile && (
        <UserProfile
          user={user}
          onProfileUpdate={handleProfileUpdate}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Idea Edit Modal */}
      {editingIdea && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Idea</h2>
              <button 
                className="btn-close"
                onClick={() => setEditingIdea(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updates = {
                problem: formData.get('problem'),
                solution: formData.get('solution'),
                market: formData.get('market'),
                revenueModel: formData.get('revenueModel'),
                team: formData.get('team')
              };
              handleUpdateIdea(editingIdea._id, updates);
            }}>
              <div className="form-group">
                <label>Problem</label>
                <textarea name="problem" defaultValue={editingIdea.problem} rows={3} />
              </div>
              <div className="form-group">
                <label>Solution</label>
                <textarea name="solution" defaultValue={editingIdea.solution} rows={3} />
              </div>
              <div className="form-group">
                <label>Market</label>
                <textarea name="market" defaultValue={editingIdea.market} rows={2} />
              </div>
              <div className="form-group">
                <label>Revenue Model</label>
                <textarea name="revenueModel" defaultValue={editingIdea.revenueModel} rows={2} />
              </div>
              <div className="form-group">
                <label>Team</label>
                <textarea name="team" defaultValue={editingIdea.team} rows={2} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditingIdea(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default AdminDashboard;