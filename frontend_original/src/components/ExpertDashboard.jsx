import React, { useState, useEffect } from "react";
import { 
  fetchAllIdeasForReview, 
  getExpertProfile, 
  createOrUpdateExpertProfile, 
  submitExpertReview,
  getMyReviews,
  getVerificationStatus
} from "../services/expertService";
import { useTheme } from "../contexts/ThemeContext";
import UserProfile from "./UserProfile";

function ExpertDashboard({ user, onLogout, onUserUpdate }) {
  const { theme, toggleTheme } = useTheme();
  const [ideas, setIdeas] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('ideas');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [pendingReview, setPendingReview] = useState({ rating: 5, review: '', feedback: '' });
  const [profileData, setProfileData] = useState({
    specialization: '',
    experience: 0,
    bio: '',
    expertise: [],
    profession: '',
    linkedin: '',
    location: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileData, verificationData] = await Promise.all([
          getExpertProfile().catch(() => null),
          getVerificationStatus().catch(() => null)
        ]);
        
        setExpertProfile(profileData);
        setVerificationStatus(verificationData);
        
        if (profileData) {
          setProfileData({
            specialization: profileData.specialization || '',
            experience: profileData.experience || 0,
            bio: profileData.bio || '',
            expertise: profileData.expertise || [],
            profession: profileData.profession || '',
            linkedin: profileData.linkedin || '',
            location: profileData.location || ''
          });
        }

        // Only load ideas and reviews if expert is verified
        if (verificationData && verificationData.isVerified) {
          const [ideasData, reviewsData] = await Promise.all([
            fetchAllIdeasForReview().catch(() => []),
            getMyReviews().catch(() => [])
          ]);
          setIdeas(ideasData);
          setMyReviews(reviewsData);
        }
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createOrUpdateExpertProfile(profileData);
      setExpertProfile(result.expert);
      setShowProfileModal(false);
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to save profile');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enhance the review with expert information
      const enhancedReview = {
        ...pendingReview,
        review: `${pendingReview.review}\n\n---\nReviewed by: ${expertProfile?.user?.name || user?.name || 'Expert'} ${expertProfile?.isVerified ? '✅' : ''}\nSpecialization: ${expertProfile?.specialization || 'N/A'}\nProfession: ${expertProfile?.profession || 'N/A'}${expertProfile?.expertise && expertProfile.expertise.length > 0 ? `\nExpertise: ${expertProfile.expertise.join(', ')}` : ''}`
      };
      
      await submitExpertReview(selectedIdea._id, enhancedReview);
      // Refresh ideas and reviews
      const [ideasData, reviewsData] = await Promise.all([
        fetchAllIdeasForReview(),
        getMyReviews()
      ]);
      setIdeas(ideasData);
      setMyReviews(reviewsData);
      setShowReviewModal(false);
      setSelectedIdea(null);
      setPendingReview({ rating: 5, review: '', feedback: '' });
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to submit review');
    }
  };

  const openReviewModal = (idea) => {
    setSelectedIdea(idea);
    setPendingReview({ rating: 5, review: '', feedback: '' });
    setShowReviewModal(true);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'High': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleUserProfileUpdate = (updatedUser) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    setShowUserProfile(false);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading expert dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎯 Expert Dashboard</h1>
          <p>Welcome back, {user?.name || user?.email}! Review and rate startup ideas.</p>
          {expertProfile && (
            <div className="expert-info">
              <span className="expert-specialization">{expertProfile.specialization}</span>
              <span className="expert-experience">{expertProfile.experience} years experience</span>
              {expertProfile.profession && (
                <span className="expert-profession">{expertProfile.profession}</span>
              )}
              {expertProfile.company && (
                <span className="expert-company">at {expertProfile.company}</span>
              )}
            </div>
          )}
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowProfileModal(true)} 
            className="btn-secondary"
          >
            {expertProfile ? 'Edit Profile' : 'Setup Profile'}
          </button>
          <button
            onClick={() => setShowUserProfile(true)}
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

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div className={`verification-banner ${verificationStatus.isVerified ? 'verified' : 'pending'}`}>
          <div className="banner-content">
            <div className="verification-icon">
              {verificationStatus.isVerified ? '✅' : '⏳'}
            </div>
            <div className="verification-text">
              <h3>
                {verificationStatus.isVerified 
                  ? 'Expert Account Verified' 
                  : 'Verification Pending'
                }
              </h3>
              <p>
                {verificationStatus.isVerified 
                  ? 'Your expert account has been verified. You can now review ideas.'
                  : 'Your expert application is under review. You\'ll be notified once verified.'
                }
              </p>
              {verificationStatus.verificationNotes && (
                <p className="verification-notes">
                  <strong>Admin Notes:</strong> {verificationStatus.verificationNotes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!expertProfile && (
        <div className="profile-setup-banner">
          <div className="banner-content">
            <h3>🎯 Complete Your Expert Profile</h3>
            <p>Set up your expert profile to start reviewing ideas and helping entrepreneurs.</p>
            <button 
              onClick={() => setShowProfileModal(true)} 
              className="btn-primary"
            >
              Setup Profile
            </button>
          </div>
        </div>
      )}

      <div className="expert-tabs">
        <button 
          className={`tab-button ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          💡 Ideas to Review ({ideas.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ My Reviews ({myReviews.length})
        </button>
      </div>

      {activeTab === 'ideas' && (
        <div className="ideas-section">
          {!verificationStatus || !verificationStatus.isVerified ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Verification Required</h3>
              <p>Your expert account is pending verification. You'll be able to review ideas once an admin verifies your profile.</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No ideas to review</h3>
              <p>New ideas will appear here as entrepreneurs submit them.</p>
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map((idea) => (
                <div key={idea._id} className="idea-card">
                  <div className="idea-header">
                    <h3>{idea.title || idea.problem?.slice(0, 60) || 'Idea'}</h3>
                    <div className="idea-score">
                      <span className="score-badge">{idea.score}/100</span>
                      <span 
                        className="classification-badge"
                        style={{ backgroundColor: getClassificationColor(idea.classification) }}
                      >
                        {idea.classification}
                      </span>
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
                    <button 
                      className="btn-primary"
                      onClick={() => openReviewModal(idea)}
                    >
                      Review Idea
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="reviews-section">
          {!verificationStatus || !verificationStatus.isVerified ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <h3>Verification Required</h3>
              <p>Your expert account is pending verification. You'll be able to see your reviews once an admin verifies your profile.</p>
            </div>
          ) : myReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h3>No reviews yet</h3>
              <p>Your reviews will appear here once you start reviewing ideas.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {myReviews.map((idea) => {
                const myReview = idea.expertReviews.find(
                  review => review.expert?.user?.toString() === user._id
                );
                return (
                  <div key={idea._id} className="review-card">
                    <div className="review-header">
                      <h3>{idea.title || idea.problem?.slice(0, 60) || 'Idea'}</h3>
                      <div className="review-rating">
                        {getRatingStars(myReview?.rating || 0)}
                      </div>
                    </div>
                    <div className="review-content">
                      <p><strong>By:</strong> {idea.user?.name || idea.user?.email}</p>
                      <p><strong>Your Review:</strong> {myReview?.review}</p>
                      {myReview?.feedback && (
                        <p><strong>Your Feedback:</strong> {myReview.feedback}</p>
                      )}
                    </div>
                    <div className="review-footer">
                      <small>Reviewed: {myReview?.createdAt ? new Date(myReview.createdAt).toLocaleString() : 'Recently'}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Expert Profile Setup</h2>
              <button 
                className="close-button"
                onClick={() => setShowProfileModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Specialization *</label>
                  <input
                    type="text"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                    placeholder="e.g., Technology, Finance, Marketing"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Profession *</label>
                  <input
                    type="text"
                    value={profileData.profession}
                    onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
                    placeholder="e.g., Software Engineer, Product Manager"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio *</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about your background and expertise..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Areas of Expertise *</label>
                <input
                  type="text"
                  value={profileData.expertise.join(', ')}
                  onChange={(e) => setProfileData({...profileData, expertise: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                  placeholder="e.g., AI, Blockchain, E-commerce, Healthcare"
                />
                <small>Separate multiple areas with commas</small>
              </div>

              <div className="form-group">
                <label>LinkedIn Profile *</label>
                <input
                  type="url"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/username"
                  required
                />
                <small>Required for expert verification</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowProfileModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedIdea && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Review Idea</h2>
              <button 
                className="close-button"
                onClick={() => setShowReviewModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="idea-summary">
                <h3>{selectedIdea.title || selectedIdea.problem?.slice(0, 60) || 'Idea'}</h3>
                <p><strong>By:</strong> {selectedIdea.user?.name || selectedIdea.user?.email}</p>
              </div>
              
              {/* Expert Information Display */}
              {expertProfile && (
                <div className="expert-info-display">
                  <div className="expert-info-header">
                    <h4>Reviewing as:</h4>
                  </div>
                  <div className="expert-info-content">
                    <div className="expert-name-section">
                      <span className="expert-name">
                        {expertProfile.user?.name || user?.name || 'Expert'}
                        {expertProfile.isVerified && (
                          <span className="verified-badge" title="Verified Expert">✅</span>
                        )}
                      </span>
                    </div>
                    <div className="expert-details">
                      <div className="expert-specialization">
                        <strong>Specialization:</strong> {expertProfile.specialization}
                      </div>
                      <div className="expert-profession">
                        <strong>Profession:</strong> {expertProfile.profession}
                      </div>
                      {expertProfile.expertise && expertProfile.expertise.length > 0 && (
                        <div className="expert-expertise">
                          <strong>Expertise:</strong> 
                          <div className="expertise-tags">
                            {expertProfile.expertise.map((skill, idx) => (
                              <span key={idx} className="expertise-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${pendingReview.rating >= star ? 'active' : ''}`}
                      onClick={() => setPendingReview({...pendingReview, rating: star})}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">{pendingReview.rating} star{pendingReview.rating !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Review *</label>
                <textarea
                  value={pendingReview.review}
                  onChange={(e) => setPendingReview({...pendingReview, review: e.target.value})}
                  placeholder="Write your detailed review of this idea..."
                  rows="4"
                  required
                />
                <small className="review-note">
                  💡 Your name, verification status, and expertise will be automatically included with your review.
                </small>
              </div>
              
              <div className="form-group">
                <label>Feedback for Entrepreneur</label>
                <textarea
                  value={pendingReview.feedback}
                  onChange={(e) => setPendingReview({...pendingReview, feedback: e.target.value})}
                  placeholder="Provide constructive feedback and suggestions..."
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserProfile && (
        <UserProfile
          user={user}
          onProfileUpdate={handleUserProfileUpdate}
          onClose={() => setShowUserProfile(false)}
        />
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

export default ExpertDashboard;
