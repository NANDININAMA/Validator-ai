import React, { useState } from "react";

function Home({ onGetStarted, onAdminLogin, onExpertLogin }) {
  const [showDemo, setShowDemo] = useState(false);
  const [showCardPopup, setShowCardPopup] = useState(null);

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-content">
          <div className="brand">
            <div className="brand-icon">🚀</div>
            <span className="brand-text">Startup Validator</span>
          </div>
          <div className="nav-actions">
            <button className="nav-btn secondary" onClick={onAdminLogin}>
              Admin Portal
            </button>
            <button className="nav-btn secondary" onClick={onExpertLogin}>
              Expert Portal
            </button>
            <button className="nav-btn primary" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Validation</span>
          </div>
          <h1 className="hero-title">
            Transform Your <span className="gradient-text">Startup Idea</span> into Success
          </h1>
          <p className="hero-description">
            Get instant validation, expert feedback, and actionable insights to refine your startup idea. 
            Our AI-powered platform helps you make data-driven decisions and increase your chances of success.
          </p>
          <div className="hero-actions">
            <button className="btn-primary large" onClick={onGetStarted}>
              <span>Start Validating</span>
              <span className="btn-icon">→</span>
            </button>
            <button className="btn-secondary large" onClick={() => setShowDemo(true)}>
              <span>View Demo</span>
              <span className="btn-icon">▶</span>
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1" onClick={() => setShowCardPopup('scoring')}>
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h4>Real-time Scoring</h4>
              <p>Instant feedback on your</p>
            </div>
          </div>
          <div className="floating-card card-2" onClick={() => setShowCardPopup('ai')}>
            <div className="card-icon">🧠</div>
            <div className="card-content">
              <h4>AI Analysis</h4>
              <p>Smart insights and recommendations</p>
            </div>
          </div>
          <div className="floating-card card-3" onClick={() => setShowCardPopup('expert')}>
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h4>Expert Network</h4>
              <p>Industry professionals review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Ideas Validated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Expert Reviews</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Startup Validator?</h2>
          <p>Comprehensive validation tools designed for modern entrepreneurs</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span>💬</span>
            </div>
            <h3>Conversational Intake</h3>
            <p>Answer smart, guided questions that capture the essence of your startup idea with ease and clarity.</p>
            <div className="feature-highlight">Interactive & User-Friendly</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>📊</span>
            </div>
            <h3>Objective Scoring</h3>
            <p>Get transparent, data-driven scores across problem validation, solution fit, market potential, and more.</p>
            <div className="feature-highlight">Data-Driven Insights</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>🧠</span>
            </div>
            <h3>Expert Feedback</h3>
            <p>Receive detailed reviews and ratings from industry professionals who understand your market.</p>
            <div className="feature-highlight">Professional Validation</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>📈</span>
            </div>
            <h3>Market Analysis</h3>
            <p>Comprehensive market research and competitive analysis to understand your positioning.</p>
            <div className="feature-highlight">Market Intelligence</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>🧾</span>
            </div>
            <h3>Professional Reports</h3>
            <p>Generate detailed PDF reports perfect for sharing with investors, mentors, and stakeholders.</p>
            <div className="feature-highlight">Investor-Ready</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>🔄</span>
            </div>
            <h3>Iterative Improvement</h3>
            <p>Track your progress over time and see how your idea evolves with each iteration.</p>
            <div className="feature-highlight">Continuous Growth</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get validated in three simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Share Your Idea</h3>
              <p>Answer our guided questions about your startup concept, target market, and business model.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Get Instant Analysis</h3>
              <p>Our AI analyzes your responses and provides immediate scoring across key validation criteria.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Expert Review</h3>
              <p>Industry experts review your idea and provide detailed feedback and recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Validate Your Startup Idea?</h2>
          <p>Join thousands of entrepreneurs who have successfully validated their ideas with our platform.</p>
          <div className="cta-actions">
            <button className="btn-primary large" onClick={onGetStarted}>
              <span>Start Your Validation</span>
              <span className="btn-icon">🚀</span>
            </button>
            <button className="btn-outline large" onClick={onGetStarted}>
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-icon">🚀</div>
              <span className="brand-text">Startup Validator</span>
            </div>
            <p>Empowering entrepreneurs with data-driven validation tools.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#demo">Demo</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#blog">Blog</a>
              <a href="#guides">Guides</a>
              <a href="#support">Support</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#careers">Careers</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Startup Validator. All rights reserved.</p>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemo && (
        <div className="demo-modal" onClick={() => setShowDemo(false)}>
          <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="demo-close" onClick={() => setShowDemo(false)}>✕</button>
            <div className="demo-header">
              <h3>🎥 How Startup Validator Works</h3>
              <p>See our platform in action</p>
            </div>
            <div className="video-container">
              <div className="animated-demo">
                <div className="demo-step step-1">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <div className="mock-form">
                      <div className="form-field">
                        <div className="field-label">Problem</div>
                        <div className="field-input typing">Finding parking in busy areas is frustrating...</div>
                      </div>
                      <div className="form-field">
                        <div className="field-label">Solution</div>
                        <div className="field-input typing delay-1">Smart parking app with real-time availability...</div>
                      </div>
                      <div className="form-field">
                        <div className="field-label">Market</div>
                        <div className="field-input typing delay-2">Urban drivers, delivery services, businesses...</div>
                      </div>
                      <div className="form-field">
                        <div className="field-label">Revenue</div>
                        <div className="field-input typing delay-3">Subscription model + commission from parking...</div>
                      </div>
                      <div className="form-field">
                        <div className="field-label">Team</div>
                        <div className="field-input typing delay-4">Tech founder + business co-founder...</div>
                      </div>
                      <div className="submit-btn pulse delay-5">Submit Idea</div>
                    </div>
                    <div className="step-title">📝 Submit Your Complete Idea</div>
                  </div>
                </div>
                
                <div className="demo-step step-2">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="mock-analysis">
                      <div className="analysis-header">🤖 AI Analysis in Progress</div>
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                      <div className="score-display">
                        <div className="score-item fade-in">
                          <span>Problem</span>
                          <span className="score animate-score">8/10</span>
                        </div>
                        <div className="score-item fade-in delay-1">
                          <span>Solution</span>
                          <span className="score animate-score">7/10</span>
                        </div>
                        <div className="score-item fade-in delay-2">
                          <span>Market</span>
                          <span className="score animate-score">9/10</span>
                        </div>
                        <div className="score-item fade-in delay-3">
                          <span>Revenue</span>
                          <span className="score animate-score">6/10</span>
                        </div>
                        <div className="score-item fade-in delay-4">
                          <span>Team</span>
                          <span className="score animate-score">8/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="step-title">⚡ AI Analyzing All 5 Factors</div>
                  </div>
                </div>
                
                <div className="demo-step step-3">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="mock-results">
                      <div className="final-score bounce">76/100</div>
                      <div className="classification high pulse">High Potential</div>
                      
                      <div className="demo-chart">
                        <div className="chart-title">Analysis Breakdown</div>
                        <div className="mini-radar">
                          <div className="radar-point p1" style={{"--delay": "0s"}}></div>
                          <div className="radar-point p2" style={{"--delay": "0.2s"}}></div>
                          <div className="radar-point p3" style={{"--delay": "0.4s"}}></div>
                          <div className="radar-point p4" style={{"--delay": "0.6s"}}></div>
                          <div className="radar-point p5" style={{"--delay": "0.8s"}}></div>
                          <div className="radar-lines"></div>
                          <div className="radar-line line2"></div>
                          <div className="radar-line line3"></div>
                          <div className="radar-line line4"></div>
                          <div className="radar-line line5"></div>
                          <div className="factor-label l1">Problem</div>
                          <div className="factor-label l2">Solution</div>
                          <div className="factor-label l3">Market</div>
                          <div className="factor-label l4">Revenue</div>
                          <div className="factor-label l5">Team</div>
                        </div>
                      </div>
                      
                      <div className="expert-reviews">
                        <div className="review slide-up">
                          <div className="expert">👨💼 Tech Expert</div>
                          <div className="rating">⭐⭐⭐⭐⭐</div>
                        </div>
                        <div className="review slide-up delay-1">
                          <div className="expert">👩💼 Business Expert</div>
                          <div className="rating">⭐⭐⭐⭐</div>
                        </div>
                        <div className="review slide-up delay-2">
                          <div className="expert">👨💼 Market Expert</div>
                          <div className="rating">⭐⭐⭐⭐⭐</div>
                        </div>
                      </div>
                    </div>
                    <div className="step-title">🎯 Complete Results with Chart & Reviews</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="demo-actions">
              <button className="btn-primary" onClick={() => { setShowDemo(false); onGetStarted(); }}>
                Start Your Validation
              </button>
              <button className="btn-secondary" onClick={() => setShowDemo(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Popups */}
      {showCardPopup && (
        <div className="card-popup-overlay" onClick={() => setShowCardPopup(null)}>
          <div className="card-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowCardPopup(null)}>✕</button>
            {showCardPopup === 'scoring' && (
              <div className="popup-body">
                <div className="popup-icon">📊</div>
                <h3>Real-time Scoring</h3>
                <p>Get instant, comprehensive feedback on your startup idea with our advanced scoring algorithm. Our system evaluates multiple dimensions including market potential, problem validation, solution feasibility, and competitive advantage.</p>
                <ul>
                  <li>Problem validation score (0-100)</li>
                  <li>Market size and opportunity assessment</li>
                  <li>Solution-market fit analysis</li>
                  <li>Competitive landscape evaluation</li>
                  <li>Revenue model viability</li>
                </ul>
              </div>
            )}
            {showCardPopup === 'ai' && (
              <div className="popup-body">
                <div className="popup-icon">🧠</div>
                <h3>AI Analysis</h3>
                <p>Leverage cutting-edge artificial intelligence to analyze your startup idea from multiple angles. Our AI provides detailed insights, identifies potential risks, and suggests improvements to maximize your chances of success.</p>
                <ul>
                  <li>Market trend analysis and predictions</li>
                  <li>Competitive intelligence gathering</li>
                  <li>Risk assessment and mitigation strategies</li>
                  <li>Growth opportunity identification</li>
                  <li>Personalized recommendations for improvement</li>
                </ul>
              </div>
            )}
            {showCardPopup === 'expert' && (
              <div className="popup-body">
                <div className="popup-icon">👥</div>
                <h3>Expert Network</h3>
                <p>Connect with industry professionals and experienced entrepreneurs who provide valuable feedback on your startup idea. Our expert network includes investors, successful founders, and domain specialists.</p>
                <ul>
                  <li>Verified industry professionals</li>
                  <li>Detailed expert reviews and ratings</li>
                  <li>Constructive feedback and suggestions</li>
                  <li>Networking opportunities</li>
                  <li>Mentorship connections</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;


