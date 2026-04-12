import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="nav-bar">
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <i className="fas fa-keyboard"></i> Test
        </Link>
        <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`}>
          <i className="fas fa-trophy"></i> Leaderboard
        </Link>
        {user && (
          <>
            <Link to="/history" className={`nav-link ${isActive('/history')}`}>
              <i className="fas fa-chart-line"></i> History
            </Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
              <i className="fas fa-user"></i> Profile
            </Link>
          </>
        )}
      </div>
      {user ? (
        <div className="user-info-bar">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <span className="user-name">{user.name}</span>
          <button className="nav-link" onClick={logout} style={{ background: 'rgba(255,80,80,0.25)' }}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      ) : (
        <Link to="/login" className="nav-link">
          <i className="fas fa-sign-in-alt"></i> Login
        </Link>
      )}
    </div>
  );
}
