import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      if (tab === 'login') {
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        login(res.data.user, res.data.token);
        navigate('/');
      } else {
        if (!formData.name.trim()) {
          setAlert({ type: 'error', msg: 'Name is required' });
          setLoading(false);
          return;
        }
        const res = await api.post('/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setAlert(null);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <i className="fas fa-keyboard" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
        </div>
        <h2>TypingMaster Pro</h2>
        <p className="subtitle">{tab === 'login' ? 'Welcome back! Sign in to continue.' : 'Create an account to track your progress.'}</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Login</div>
          <div className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</div>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Enter your password'}
              required
              minLength={tab === 'signup' ? 6 : undefined}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Please wait...</>
              : tab === 'login' ? 'Login' : 'Create Account'
            }
          </button>

          {alert && (
            <div className={`auth-alert ${alert.type}`}>
              <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} style={{ marginRight: 6 }}></i>
              {alert.msg}
            </div>
          )}
        </form>

        <div className="auth-switch">
          {tab === 'login'
            ? <>Don't have an account? <a onClick={() => switchTab('signup')}>Sign up</a></>
            : <>Already have an account? <a onClick={() => switchTab('login')}>Login</a></>
          }
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: '#aaa', fontSize: '0.85rem', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left" style={{ marginRight: 5 }}></i>Back to typing test
          </Link>
        </div>
      </div>
    </div>
  );
}
