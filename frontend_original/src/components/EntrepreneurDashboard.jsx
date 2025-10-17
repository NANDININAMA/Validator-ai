import React, { useState, useEffect } from "react";
import { getUserIdeas, getIdeaById, updateIdea, deleteIdea } from "../services/ideaService";
import { useTheme } from "../contexts/ThemeContext";
import RadarChart from "./RadarChart";
import EnhancedChatbot from "./EnhancedChatbot";
import MultiStepIdeaForm from "./MultiStepIdeaForm";
import UserProfile from "./UserProfile";

function EntrepreneurDashboard({ user, onLogout, onUserUpdate }) {
  const { theme, toggleTheme } = useTheme();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prefillForChat, setPrefillForChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState("");
  const [detailsIdea, setDetailsIdea] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState(null);
  const [aiAnalysisData, setAiAnalysisData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const userIdeas = await getUserIdeas();
      setIdeas(userIdeas);
    } catch (err) {
      setError("Failed to load ideas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatbotIdeaSubmit = (idea) => {
    setIdeas([idea, ...ideas]);
    setShowChatbot(false);
    setShowForm(false);
  };

  const openDetails = async (ideaId) => {
    try {
      const idea = await getIdeaById(ideaId);
      setDetailsIdea(idea);
    } catch (err) {
      setError("Failed to load details: " + err.message);
    }
  };

  const closeDetails = () => setDetailsIdea(null);

  const downloadPdf = async (ideaId) => {
    try {
      const res = await fetch(`http://localhost:5002/api/ideas/${ideaId}/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser') || '{}').token}`
        }
      });
      if (!res.ok) throw new Error('Failed to export PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idea-${ideaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Export failed: " + err.message);
    }
  };

  const onDelete = async (ideaId) => {
    try {
      await deleteIdea(ideaId);
      setIdeas(ideas.filter(i => i._id !== ideaId));
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  const onSaveEdit = async () => {
    try {
      const payload = {
        title: detailsIdea.title,
        problem: detailsIdea.problem,
        solution: detailsIdea.solution,
        market: detailsIdea.market,
        revenueModel: detailsIdea.revenueModel,
        team: detailsIdea.team
      };
      const res = await updateIdea(detailsIdea._id, payload);
      const updated = res.idea;
      setIdeas(ideas.map(i => i._id === updated._id ? updated : i));
      setDetailsIdea(updated);
      setEditing(false);
    } catch (err) {
      setError('Update failed: ' + err.message);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    setShowProfile(false);
  };

  const generateAiAnalysis = (idea) => {
    setLoadingAi(true);
    setShowAiAnalysis(idea._id);
    
    // Simulate AI analysis generation
    setTimeout(() => {
      const analysis = {
        marketTrends: {
          score: Math.floor(Math.random() * 30) + 70,
          insights: [
            `Market size for ${idea.market || 'this sector'} is projected to grow 15-25% annually`,
            "Emerging technologies are creating new opportunities in this space",
            "Consumer behavior shifts favor solutions like this",
            "Regulatory environment is becoming more favorable"
          ]
        },
        competitiveIntelligence: {
          score: Math.floor(Math.random() * 25) + 65,
          insights: [
            "3-5 direct competitors identified in the market",
            "Market leader has 35% market share, leaving room for disruption",
            "Most competitors focus on enterprise, consumer market underserved",
            "Average funding for similar startups: $2.5M in seed rounds"
          ]
        },
        riskAssessment: {
          score: Math.floor(Math.random() * 20) + 60,
          risks: [
            { level: "Medium", description: "Market adoption may be slower than expected" },
            { level: "Low", description: "Technical implementation challenges" },
            { level: "High", description: "Regulatory changes could impact business model" },
            { level: "Medium", description: "Competition from established players" }
          ],
          mitigations: [
            "Develop strong customer validation before full launch",
            "Build strategic partnerships for market entry",
            "Maintain regulatory compliance and monitoring",
            "Focus on unique value proposition and differentiation"
          ]
        },
        growthOpportunities: {
          score: Math.floor(Math.random() * 25) + 75,
          opportunities: [
            "International expansion potential in 3-5 markets",
            "Adjacent product lines could increase revenue by 40%",
            "B2B partnerships could accelerate customer acquisition",
            "Platform approach could create network effects"
          ]
        },
        recommendations: [
          "Focus on customer discovery and validation in first 6 months",
          "Build MVP with core features to test market response",
          "Establish key partnerships early for distribution",
          "Consider freemium model to accelerate user adoption",
          "Invest in strong technical team for scalable architecture"
        ]
      };
      
      setAiAnalysisData(analysis);
      setLoadingAi(false);
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#10b981"; // green
    if (score >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "High": return "#10b981";
      case "Moderate": return "#f59e0b";
      case "Low": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your ideas...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>💡 Entrepreneur Dashboard</h1>
          <p>Welcome back, {user?.name || user?.email}! Manage your startup ideas here.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            🧾 Submit New Idea
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="btn-secondary"
          >
            👤 Profile
          </button>
          <button onClick={onLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showChatbot && (
        <div className="chatbot-modal" onClick={(e) => { if (e.target === e.currentTarget) setShowChatbot(false); }}>
          <div className="chatbot-modal-content" onClick={(e) => e.stopPropagation()}>
            <EnhancedChatbot
              user={user}
              onIdeaSubmitted={handleChatbotIdeaSubmit}
              onClose={() => setShowChatbot(false)}
              initialIdeaData={prefillForChat}
              autoAnalyze={!!prefillForChat}
            />
          </div>
        </div>
      )}

      {showForm && (
        <MultiStepIdeaForm
          onCancel={() => setShowForm(false)}
          onSubmit={(data) => {
            setPrefillForChat(data);
            setShowForm(false);
            setShowChatbot(true);
          }}
        />
      )}

      <div className="ideas-section">
        <h2>Your Ideas ({ideas.length})</h2>

        {ideas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h3>No ideas yet</h3>
            <p>Start a conversation to submit your first idea.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Submit New Idea
            </button>
          </div>
        ) : (
          <div className="ideas-grid">
            {ideas.map((idea) => (
              <div key={idea._id} className="idea-card modern-card">
                <div className="card-header">
                  <div className="idea-title-section">
                    <h3 className="idea-title">{idea.problem || "Untitled Idea"}</h3>
                    <div className="idea-meta">
                      <span className="created-date">
                        📅 {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="idea-score-section">
                    <div className="score-circle" style={{ backgroundColor: getScoreColor(idea.score) }}>
                      <span className="score-number">{idea.score}</span>
                      <span className="score-total">/100</span>
                    </div>
                    <div className="classification-wrapper">
                      <span
                        className="classification-tag"
                        style={{ backgroundColor: getClassificationColor(idea.classification) }}
                      >
                        {idea.classification} Potential
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="idea-preview">
                    <div className="preview-section">
                      <div className="section-icon">🎯</div>
                      <div className="section-content">
                        <h4>Problem</h4>
                        <p>{idea.problem?.substring(0, 120)}...</p>
                      </div>
                    </div>
                    
                    <div className="preview-section">
                      <div className="section-icon">💡</div>
                      <div className="section-content">
                        <h4>Solution</h4>
                        <p>{idea.solution?.substring(0, 120)}...</p>
                      </div>
                    </div>
                  </div>

                  {idea.breakdown && (
                    <div className="mini-chart-section">
                      <h4>Analysis Breakdown</h4>
                      <div className="mini-chart">
                        <RadarChart breakdown={idea.breakdown} size={150} showLabels={true} showValues={false} />
                      </div>
                    </div>
                  )}

                  {idea.expertReviews && idea.expertReviews.length > 0 && (
                    <div className="expert-reviews-preview">
                      <h4>Expert Reviews ({idea.totalExpertReviews})</h4>
                      <div className="reviews-summary">
                        <div className="average-rating">
                          <span className="rating-stars">
                            {'★'.repeat(Math.round(idea.averageExpertRating))}
                            {'☆'.repeat(5 - Math.round(idea.averageExpertRating))}
                          </span>
                          <span className="rating-text">
                            {idea.averageExpertRating.toFixed(1)}/5
                          </span>
                        </div>
                      </div>
                      <div className="individual-reviews">
                        {idea.expertReviews.slice(0, 2).map((review, idx) => (
                          <div key={idx} className="review-item">
                            <div className="review-header">
                              <div className="expert-info">
                                <span className="expert-name">
                                  {review.expert?.user?.name || review.expert?.specialization || 'Expert'}
                                  {review.expert?.isVerified && (
                                    <span className="verified-badge" title="Verified Expert">✅</span>
                                  )}
                                </span>
                                {review.expert?.expertise && review.expert.expertise.length > 0 && (
                                  <div className="expert-expertise">
                                    <span className="expertise-label">Expertise:</span>
                                    <div className="expertise-tags">
                                      {review.expert.expertise.slice(0, 3).map((skill, skillIdx) => (
                                        <span key={skillIdx} className="expertise-tag">{skill}</span>
                                      ))}
                                      {review.expert.expertise.length > 3 && (
                                        <span className="expertise-more">+{review.expert.expertise.length - 3} more</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <span className="review-rating">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                              </span>
                            </div>
                            <p className="review-text">{review.review}</p>
                          </div>
                        ))}
                        {idea.expertReviews.length > 2 && (
                          <div className="more-reviews">
                            +{idea.expertReviews.length - 2} more reviews
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div className="idea-actions">
                    <button 
                      className="btn-action primary" 
                      onClick={() => openDetails(idea._id)}
                      title="View full details"
                    >
                      <span className="btn-icon">👁️</span>
                      View Details
                    </button>
                    <button 
                      className="btn-action secondary" 
                      onClick={() => generateAiAnalysis(idea)}
                      title="AI Analysis"
                    >
                      <span className="btn-icon">🧠</span>
                      AI Analysis
                    </button>
                    <button 
                      className="btn-action secondary" 
                      onClick={() => downloadPdf(idea._id)}
                      title="Export as PDF"
                    >
                      <span className="btn-icon">📄</span>
                      Export
                    </button>
                    <button 
                      className="btn-action danger" 
                      onClick={() => onDelete(idea._id)}
                      title="Delete idea"
                    >
                      <span className="btn-icon">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {detailsIdea && (
        <div className="chatbot-modal">
          <div className="details-modal-content">
            <button className="close-button" onClick={closeDetails}>✕</button>
            <h2 className="details-title">{detailsIdea.title || 'Idea Details'}</h2>
            <div className="details-grid">
              <div>
                <strong>Problem</strong>
                {editing ? (
                  <textarea value={detailsIdea.problem} onChange={(e)=> setDetailsIdea({...detailsIdea, problem: e.target.value})} />
                ) : (<p>{detailsIdea.problem}</p>)}
              </div>
              <div>
                <strong>Solution</strong>
                {editing ? (
                  <textarea value={detailsIdea.solution} onChange={(e)=> setDetailsIdea({...detailsIdea, solution: e.target.value})} />
                ) : (<p>{detailsIdea.solution}</p>)}
              </div>
              <div>
                <strong>Market</strong>
                {editing ? (
                  <textarea value={detailsIdea.market} onChange={(e)=> setDetailsIdea({...detailsIdea, market: e.target.value})} />
                ) : (<p>{detailsIdea.market}</p>)}
              </div>
              <div>
                <strong>Revenue Model</strong>
                {editing ? (
                  <textarea value={detailsIdea.revenueModel} onChange={(e)=> setDetailsIdea({...detailsIdea, revenueModel: e.target.value})} />
                ) : (<p>{detailsIdea.revenueModel}</p>)}
              </div>
              <div>
                <strong>Team</strong>
                {editing ? (
                  <textarea value={detailsIdea.team} onChange={(e)=> setDetailsIdea({...detailsIdea, team: e.target.value})} />
                ) : (<p>{detailsIdea.team}</p>)}
              </div>
              <div>
                <strong>Score</strong>
                <p>{detailsIdea.score} / 100 ({detailsIdea.classification})</p>
              </div>
              {detailsIdea.breakdown && (
                <div className="details-feedback">
                  <strong>Score Breakdown</strong>
                  <RadarChart breakdown={detailsIdea.breakdown} size={300} showLabels={true} showValues={true} />
                </div>
              )}

              {detailsIdea.suggestions && detailsIdea.suggestions.length > 0 && (
                <div className="details-feedback">
                  <strong>Suggestions</strong>
                  <ul>
                    {detailsIdea.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              )}

              {detailsIdea.expertReviews && detailsIdea.expertReviews.length > 0 && (
                <div className="details-expert-reviews">
                  <strong>Expert Reviews ({detailsIdea.totalExpertReviews})</strong>
                  <div className="expert-reviews-list">
                    {detailsIdea.expertReviews.map((review, idx) => (
                      <div key={idx} className="expert-review-card">
                        <div className="review-header">
                            <div className="expert-info">
                              <div className="expert-name-section">
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
                              {review.expert?.expertise && review.expert.expertise.length > 0 && (
                                <div className="expert-expertise">
                                  <span className="expertise-label">Expertise:</span>
                                  <div className="expertise-tags">
                                    {review.expert.expertise.map((skill, skillIdx) => (
                                      <span key={skillIdx} className="expertise-tag">{skill}</span>
                                    ))}
                                  </div>
                                </div>
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
            <div className="details-actions">
              <button className="btn-secondary" onClick={() => downloadPdf(detailsIdea._id)}>Export PDF</button>
              {editing ? (
                <>
                  <button className="btn-secondary" onClick={()=> setEditing(false)}>Cancel</button>
                  <button className="btn-primary" onClick={onSaveEdit}>Save</button>
                </>
              ) : (
                <>
                  <button className="btn-secondary" onClick={()=> setEditing(true)}>Edit</button>
                  <button className="btn-primary" onClick={closeDetails}>Close</button>
                </>
              )}
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

      {/* AI Analysis Modal */}
      {showAiAnalysis && (
        <div className="chatbot-modal">
          <div className="ai-analysis-modal">
            <button className="close-button" onClick={() => setShowAiAnalysis(null)}>✕</button>
            <div className="ai-analysis-header">
              <h2>🧠 AI Analysis Report</h2>
              <p>Comprehensive AI-powered insights for your startup idea</p>
            </div>
            
            {loadingAi ? (
              <div className="ai-loading">
                <div className="ai-spinner"></div>
                <h3>Analyzing your idea...</h3>
                <p>Our AI is processing market trends, competitive landscape, and growth opportunities</p>
              </div>
            ) : aiAnalysisData && (
              <div className="ai-analysis-content">
                <div className="analysis-section">
                  <h3>📈 Market Trends Analysis</h3>
                  <div className="analysis-score">
                    <span className="score-badge">{aiAnalysisData.marketTrends.score}/100</span>
                    <span className="score-label">Market Opportunity</span>
                  </div>
                  <ul className="insights-list">
                    {aiAnalysisData.marketTrends.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>🎯 Competitive Intelligence</h3>
                  <div className="analysis-score">
                    <span className="score-badge">{aiAnalysisData.competitiveIntelligence.score}/100</span>
                    <span className="score-label">Competitive Position</span>
                  </div>
                  <ul className="insights-list">
                    {aiAnalysisData.competitiveIntelligence.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h3>⚠️ Risk Assessment</h3>
                  <div className="analysis-score">
                    <span className="score-badge">{aiAnalysisData.riskAssessment.score}/100</span>
                    <span className="score-label">Risk Management</span>
                  </div>
                  <div className="risk-grid">
                    <div className="risks-column">
                      <h4>Identified Risks</h4>
                      {aiAnalysisData.riskAssessment.risks.map((risk, idx) => (
                        <div key={idx} className={`risk-item ${risk.level.toLowerCase()}`}>
                          <span className="risk-level">{risk.level}</span>
                          <span className="risk-desc">{risk.description}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mitigations-column">
                      <h4>Mitigation Strategies</h4>
                      <ul>
                        {aiAnalysisData.riskAssessment.mitigations.map((mitigation, idx) => (
                          <li key={idx}>{mitigation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="analysis-section">
                  <h3>🚀 Growth Opportunities</h3>
                  <div className="analysis-score">
                    <span className="score-badge">{aiAnalysisData.growthOpportunities.score}/100</span>
                    <span className="score-label">Growth Potential</span>
                  </div>
                  <ul className="insights-list">
                    {aiAnalysisData.growthOpportunities.opportunities.map((opportunity, idx) => (
                      <li key={idx}>{opportunity}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section recommendations">
                  <h3>💡 AI Recommendations</h3>
                  <div className="recommendations-grid">
                    {aiAnalysisData.recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-card">
                        <span className="rec-number">{idx + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

export default EntrepreneurDashboard;