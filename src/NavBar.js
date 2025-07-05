import './App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMyPage = () => {
    if (user && user.name) {
      navigate(`/main/${user.name}`);
    }
  };

  const handleDashboard = () => {
    if (user && user.name) {
      navigate(`/dashboard/${user.name}`);
    }
  };

  return (
    <nav className="navbar-neon">
      <div className="nav-container">
        <div className="nav-brand-neon" style={{ fontFamily: "'Space Grotesk', sans-serif", height: '45px', textAlign: 'center', paddingTop: '1px', paddingBottom: '-1px', fontSize: '28px' }}><a href="/" className="nav-link-neon">FocusWin</a></div>
        <ul className="nav-menu">
          <li className="nav-item"><a href="/home" className="nav-link-neon">Home</a></li>
          <li className="nav-item"><a href="/features" className="nav-link-neon">Features</a></li>
          <li className="nav-item"><a href="/contact" className="nav-link-neon">Contact</a></li>

          {!isLoggedIn ? (
            <>
              <li className="nav-item"><a href="/login" className="nav-link-neon">Login</a></li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <button onClick={handleMyPage} className="nav-link-neon my-page-btn">
                  My Page
                </button>
              </li>
              <li className="nav-item">
                <button onClick={handleDashboard} className="nav-link-neon dashboard-btn">
                  Dashboard
                </button>
              </li>
              <li className="nav-item profile-dropdown">
                <div className="profile-circle-neon">{user?.name?.charAt(0).toUpperCase()}</div>
                <div className="dropdown-content-neon">
                  <button onClick={handleLogout} className="logout-btn-neon">Logout</button>
                </div>
              </li>
            </>
          )}
        </ul>

        {!isLoggedIn && (
          <button className="get-started-btn-neon" onClick={() => navigate('/signup')}>
            GET STARTED
            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 0l8 8-8 8-1.5-1.5L12 9H0V7h12L6.5 1.5z" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
