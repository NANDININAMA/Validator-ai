import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../services/profileService';
import { useTheme } from '../contexts/ThemeContext';

function UserProfile({ user, onProfileUpdate, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [themeMessage, setThemeMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateProfile(profileData);
      onProfileUpdate(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const generateAvatar = (name) => {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials;
  };

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {generateAvatar(profileData.name)}
            </div>
          </div>
          <div className="profile-info">
            <h2>{profileData.name || 'User Profile'}</h2>
            <p>{profileData.email}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Password
          </button>
          <button
            className={`tab-button ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            🎨 Theme
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {success && (
          <div className="success-message">{success}</div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="password-input">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'theme' && (
          <div className="theme-settings">
            <div className="theme-preview">
              <h3>Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</h3>
              <div className={`theme-demo ${theme}`}>
                <div className="demo-card">
                  <div className="demo-header">
                    <div className="demo-avatar"></div>
                    <div className="demo-text">
                      <div className="demo-line short"></div>
                      <div className="demo-line medium"></div>
                    </div>
                  </div>
                  <div className="demo-content">
                    <div className="demo-line long"></div>
                    <div className="demo-line medium"></div>
                    <div className="demo-line short"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="theme-options">
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => {
                  if (theme !== 'light') {
                    toggleTheme();
                    setThemeMessage('Theme changed to Light Mode');
                    setTimeout(() => setThemeMessage(''), 3000);
                  }
                }}
              >
                <div className="theme-icon">☀️</div>
                <span>Light Mode</span>
              </button>
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  if (theme !== 'dark') {
                    toggleTheme();
                    setThemeMessage('Theme changed to Dark Mode');
                    setTimeout(() => setThemeMessage(''), 3000);
                  }
                }}
              >
                <div className="theme-icon">🌙</div>
                <span>Dark Mode</span>
              </button>
            </div>

            {themeMessage && (
              <div className="success-message">{themeMessage}</div>
            )}

            <div className="form-actions">
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
