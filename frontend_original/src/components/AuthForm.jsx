import React, { useState } from "react";
import { signup, login } from "../services/auth";

function AuthForm({ onAuthSuccess, preset }) {
  const [isLogin, setIsLogin] = useState(!(preset && preset.mode === 'signup'));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState(preset?.role || "user"); // user, expert, admin
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [expertData, setExpertData] = useState({
    specialization: "",
    experience: 0,
    bio: "",
    expertise: [],
    profession: "",
    linkedin: "",
    location: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      // Validate expert data if registering as expert
      if (!isLogin && userType === "expert") {
        if (!expertData.specialization || !expertData.experience || !expertData.bio || !expertData.profession) {
          setError("Please fill in all required expert fields");
          return;
        }
        if (!expertData.linkedin) {
          setError("LinkedIn profile is required for expert verification");
          return;
        }
        if (!expertData.expertise || expertData.expertise.length === 0) {
          setError("Please specify at least one area of expertise");
          return;
        }
      }

      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        const signupData = {
          name,
          email,
          password,
          role: userType
        };
        
        if (userType === "expert") {
          signupData.expertData = expertData;
        }
        
        result = await signup(signupData);
      }

      if (result && result.user && result.token) {
        const user = {
          ...result.user,
          token: result.token,
          role: result.user.role || 'user'
        };
        onAuthSuccess(user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExpertDataChange = (field, value) => {
    if (field === 'expertise') {
      setExpertData({
        ...expertData,
        [field]: value.split(',').map(s => s.trim()).filter(s => s)
      });
    } else {
      setExpertData({
        ...expertData,
        [field]: value
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header with Logo */}
        <div className="auth-header">
          <div className="logo-section">
            <span className="logo-icon">🚀</span>
            <h1 className="logo-text">Startup Validator</h1>
          </div>
          <p className="welcome-text">
            {isLogin ? "Welcome back! 👋" : "Join us and validate your startup ideas"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* User Type Selection (only for signup) */}
        {!isLogin && (
          <div className="user-type-selection">
            <h3>I want to register as:</h3>
            <div className="user-type-buttons">
              <button
                type="button"
                className={`user-type-btn ${userType === 'user' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('user');
                  setShowExpertForm(false);
                }}
              >
                👤 Entrepreneur
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'expert' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('expert');
                  setShowExpertForm(true);
                }}
              >
                🎯 Expert Reviewer
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('admin');
                  setShowExpertForm(false);
                }}
              >
                🛠️ Admin
              </button>
            </div>
            {userType === 'expert' && (
              <div className="expert-info-banner">
                <p>🔒 Expert registration requires LinkedIn profile for verification</p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        {/* Expert Registration Form */}
        {!isLogin && userType === 'expert' && showExpertForm && (
          <div className="expert-form-section">
            <h3>🎯 Professional Information</h3>
            <div className="expert-form-grid">
              <div className="form-group">
                <label>Specialization *</label>
                <input
                  type="text"
                  placeholder="e.g., Technology, Finance, Marketing"
                  value={expertData.specialization}
                  onChange={(e) => handleExpertDataChange('specialization', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profession *</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Product Manager"
                  value={expertData.profession}
                  onChange={(e) => handleExpertDataChange('profession', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Years of Experience *</label>
                <input
                  type="number"
                  min="0"
                  value={expertData.experience}
                  onChange={(e) => handleExpertDataChange('experience', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., San Francisco, CA"
                  value={expertData.location}
                  onChange={(e) => handleExpertDataChange('location', e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Professional Bio *</label>
                <textarea
                  placeholder="Tell us about your background and expertise..."
                  value={expertData.bio}
                  onChange={(e) => handleExpertDataChange('bio', e.target.value)}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Areas of Expertise *</label>
                <input
                  type="text"
                  placeholder="e.g., AI, Blockchain, E-commerce, Healthcare"
                  value={expertData.expertise.join(', ')}
                  onChange={(e) => handleExpertDataChange('expertise', e.target.value)}
                  required
                />
                <small>Separate multiple areas with commas</small>
              </div>

              <div className="form-group full-width">
                <label>LinkedIn Profile *</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={expertData.linkedin}
                  onChange={(e) => handleExpertDataChange('linkedin', e.target.value)}
                  required
                />
                <small>Required for expert verification</small>
              </div>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
