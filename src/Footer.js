import './App.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-neon">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-logo">FocusWin</h3>
              <p className="footer-tagline">
                Master your tasks, amplify your productivity
              </p>
            </div>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <span>💼</span>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <span>📚</span>
              </a>
              <a href="#" className="social-icon" aria-label="Discord">
                <span>🎮</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#integrations">Integrations</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#status">System Status</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} FocusWin. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#accessibility">Accessibility</a>
              <a href="#sitemap">Sitemap</a>
              <a href="#feedback">Feedback</a>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="footer-bg-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>
    </footer>
  );
}

export default Footer;
