import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';

function Features() {
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
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <h1 className="features-title">Powerful Features for Modern Productivity</h1>
          <p className="features-subtitle">
            Discover how FocusWin transforms the way you manage tasks and boost your productivity
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="core-features">
        <div className="container">
          <h2 className="section-title">Core Features</h2>
          <div className="features-grid-large">
            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📋</div>
                <h3>Smart Task Management</h3>
              </div>
              <p>Create, organize, and track tasks with our intuitive interface. Set priorities, due dates, and group tasks for better organization.</p>
              <ul className="feature-list">
                <li>✓ Priority-based task sorting</li>
                <li>✓ Due date management</li>
                <li>✓ Custom task groups</li>
                <li>✓ Quick task creation</li>
              </ul>
            </div>

            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📊</div>
                <h3>Analytics Dashboard</h3>
              </div>
              <p>Track your productivity with detailed insights, completion rates, and progress analytics to optimize your workflow.</p>
              <ul className="feature-list">
                <li>✓ Completion rate tracking</li>
                <li>✓ Productivity trends</li>
                <li>✓ Performance insights</li>
                <li>✓ Goal visualization</li>
              </ul>
            </div>

            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🔔</div>
                <h3>Smart Notifications</h3>
              </div>
              <p>Never miss important deadlines with intelligent notifications and reminders that keep you on track.</p>
              <ul className="feature-list">
                <li>✓ Due date alerts</li>
                <li>✓ Email notifications</li>
                <li>✓ Browser notifications</li>
                <li>✓ Customizable reminders</li>
              </ul>
            </div>

            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🎯</div>
                <h3>Priority System</h3>
              </div>
              <p>Focus on what matters most with our 10-level priority system that helps you make informed decisions.</p>
              <ul className="feature-list">
                <li>✓ 10-level priority scale</li>
                <li>✓ Visual priority indicators</li>
                <li>✓ Priority-based filtering</li>
                <li>✓ Smart task suggestions</li>
              </ul>
            </div>

            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">🏷️</div>
                <h3>Group Organization</h3>
              </div>
              <p>Organize tasks into custom groups for better project management and team collaboration.</p>
              <ul className="feature-list">
                <li>✓ Custom group creation</li>
                <li>✓ Group-based filtering</li>
                <li>✓ Project organization</li>
                <li>✓ Team workspace support</li>
              </ul>
            </div>

            <div className="feature-card-large">
              <div className="feature-header">
                <div className="feature-icon-large">📱</div>
                <h3>Cross-Platform Access</h3>
              </div>
              <p>Access your tasks from anywhere with our responsive web application that works on all devices.</p>
              <ul className="feature-list">
                <li>✓ Responsive design</li>
                <li>✓ Mobile optimization</li>
                <li>✓ Offline capability</li>
                <li>✓ Sync across devices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="advanced-features">
        <div className="container">
          <h2 className="section-title">Advanced Features</h2>
          <div className="advanced-features-grid">
            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>📈 Progress Tracking</h3>
                <p>Monitor your daily, weekly, and monthly progress with detailed analytics and visual charts.</p>
              </div>
              <div className="advanced-feature-visual">
                <div className="chart-preview">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '45%' }}></div>
                  <div className="chart-bar" style={{ height: '90%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>🔥 Streak Counter</h3>
                <p>Build momentum with our streak tracking system that motivates you to maintain consistent productivity.</p>
              </div>
              <div className="advanced-feature-visual">
                <div className="streak-preview">
                  <div className="streak-day active"></div>
                  <div className="streak-day active"></div>
                  <div className="streak-day active"></div>
                  <div className="streak-day active"></div>
                  <div className="streak-day active"></div>
                  <div className="streak-day"></div>
                  <div className="streak-day"></div>
                </div>
              </div>
            </div>

            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>📅 Calendar Integration</h3>
                <p>View your tasks in a calendar format with heatmap visualization showing your daily activity levels.</p>
              </div>
              <div className="advanced-feature-visual">
                <div className="calendar-preview">
                  <div className="calendar-day high"></div>
                  <div className="calendar-day medium"></div>
                  <div className="calendar-day low"></div>
                  <div className="calendar-day high"></div>
                  <div className="calendar-day medium"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="section-title">Why FocusWin Stands Out</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-feature">Feature</div>
              <div className="comparison-focuswin">FocusWin</div>
              <div className="comparison-others">Others</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Priority System</div>
              <div className="comparison-focuswin">✅ 10-level scale</div>
              <div className="comparison-others">❌ Basic (3-5 levels)</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Analytics</div>
              <div className="comparison-focuswin">✅ Advanced insights</div>
              <div className="comparison-others">❌ Limited or none</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Notifications</div>
              <div className="comparison-focuswin">✅ Smart alerts</div>
              <div className="comparison-others">❌ Basic reminders</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Grouping</div>
              <div className="comparison-focuswin">✅ Custom groups</div>
              <div className="comparison-others">❌ Fixed categories</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">UI/UX</div>
              <div className="comparison-focuswin">✅ Modern neon theme</div>
              <div className="comparison-others">❌ Outdated design</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience the Future of Task Management?</h2>
            <p>Join thousands of users who have transformed their productivity with FocusWin's powerful features.</p>
            <div className="cta-buttons">
              <button onClick={handleGetStarted} className="cta-button-primary">
                {isLoggedIn ? 'Go to Dashboard' : 'Start Free Trial'}
              </button>
              <button onClick={() => navigate('/contact')} className="cta-button-secondary">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features; 