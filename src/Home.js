import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate(`/main/${user.name}`);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Your Tasks,
              <span className="hero-highlight"> Amplify Your Productivity</span>
            </h1>
            <p className="hero-subtitle">
              FocusWin is your ultimate task management companion. Organize, prioritize, and conquer your goals with our intuitive, feature-rich platform designed for modern productivity.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="hero-btn-primary">
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
              </button>
              <button onClick={() => navigate('/features')} className="hero-btn-secondary">
                Explore Features
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="task-preview">
                <div className="task-item">
                  <span className="task-checkbox">✓</span>
                  <span className="task-text">Complete project proposal</span>
                  <span className="task-priority high">🔥</span>
                </div>
                <div className="task-item">
                  <span className="task-checkbox">✓</span>
                  <span className="task-text">Review team feedback</span>
                  <span className="task-priority medium">⚡</span>
                </div>
                <div className="task-item">
                  <span className="task-checkbox">○</span>
                  <span className="task-text">Schedule client meeting</span>
                  <span className="task-priority low">📅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <div className="container">
          <h2 className="section-title">Why Choose FocusWin?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Prioritization</h3>
              <p>Rate tasks by importance and let our system help you focus on what matters most.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Analytics</h3>
              <p>Track your productivity with detailed insights and completion statistics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Never miss a deadline with intelligent reminders and due date alerts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏷️</div>
              <h3>Group Organization</h3>
              <p>Organize tasks into custom groups for better project management.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Cross-Platform</h3>
              <p>Access your tasks from anywhere with our responsive web application.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-standard security practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Productivity?</h2>
            <p>Join thousands of users who have already improved their task management with FocusWin.</p>
            <button onClick={handleGetStarted} className="cta-button">
              {isLoggedIn ? 'Go to Dashboard' : 'Start Your Free Journey'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
