import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/results/${user.id}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bestWpm = results.length ? Math.max(...results.map(r => r.wpm)) : 0;
  const avgWpm = results.length ? Math.round(results.reduce((a, r) => a + r.wpm, 0) / results.length) : 0;
  const avgAcc = results.length ? Math.round(results.reduce((a, r) => a + r.accuracy, 0) / results.length) : 0;
  const bestScore = results.length ? Math.max(...results.map(r => r.score || 0)).toFixed(1) : 0;

  // Difficulty breakdown
  const byDiff = { easy: 0, medium: 0, hard: 0 };
  results.forEach(r => { if (byDiff[r.difficulty] !== undefined) byDiff[r.difficulty]++; });

  const getLevel = (wpm) => {
    if (wpm >= 80) return { label: 'Expert', color: '#4CAF50', icon: '🏆' };
    if (wpm >= 60) return { label: 'Advanced', color: '#2196F3', icon: '🌟' };
    if (wpm >= 40) return { label: 'Intermediate', color: '#FF9800', icon: '👍' };
    if (wpm >= 20) return { label: 'Beginner', color: '#9C27B0', icon: '🌱' };
    return { label: 'Novice', color: '#9E9E9E', icon: '💪' };
  };

  const level = getLevel(bestWpm);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="app-header">
          <Navbar />
          <h1><i className="fas fa-user-circle" style={{ marginRight: 12 }}></i>My Profile</h1>
          <p>Your typing stats and achievements</p>
        </div>

        <div className="main-content">
          {/* Profile card */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '30px',
            marginBottom: 25,
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              background: 'var(--primary-grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              fontSize: '2.2rem',
              fontWeight: 700,
              flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#333', marginBottom: 4 }}>{user?.name}</h2>
              <p style={{ color: '#888', marginBottom: 8 }}>{user?.email}</p>
              <span style={{
                background: level.color + '22',
                color: level.color,
                padding: '4px 14px',
                borderRadius: 20,
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {level.icon} {level.label} Typist
              </span>
            </div>
            <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '10px 22px' }}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: 7 }}></i>Logout
            </button>
          </div>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">Total Tests</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{bestWpm}</div>
              <div className="stat-label">Best WPM</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgWpm}</div>
              <div className="stat-label">Avg WPM</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgAcc}%</div>
              <div className="stat-label">Avg Accuracy</div>
            </div>
          </div>

          {!loading && results.length > 0 && (
            <>
              {/* Best Score */}
              <div style={{
                background: 'var(--primary-grad)',
                color: 'white',
                borderRadius: 14,
                padding: '22px 28px',
                marginBottom: 25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <div style={{ opacity: 0.85, fontSize: '0.9rem', marginBottom: 4 }}>Your Best Score</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{bestScore}</div>
                  <div style={{ opacity: 0.75, fontSize: '0.8rem' }}>Score = (WPM × 0.7) + (Accuracy × 0.3)</div>
                </div>
                <i className="fas fa-trophy" style={{ fontSize: '3.5rem', opacity: 0.3 }}></i>
              </div>

              {/* Difficulty breakdown */}
              <div className="section-card" style={{ marginTop: 0 }}>
                <div className="section-header">
                  <h2>Difficulty Breakdown</h2>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { key: 'easy', label: 'Easy', color: '#4CAF50' },
                    { key: 'medium', label: 'Medium', color: '#FF9800' },
                    { key: 'hard', label: 'Hard', color: '#F44336' }
                  ].map(d => (
                    <div key={d.key} style={{
                      flex: 1, minWidth: 140,
                      background: d.color + '15',
                      border: `2px solid ${d.color}40`,
                      borderRadius: 12, padding: '18px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: d.color }}>
                        {byDiff[d.key]}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: 4 }}>{d.label} tests</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent tests */}
              <div className="section-card">
                <div className="section-header">
                  <h2>Recent Tests</h2>
                  <button className="btn btn-secondary" onClick={() => navigate('/history')} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                    View All
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Difficulty</th>
                        <th>WPM</th>
                        <th>Accuracy</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 5).map(r => {
                        const d = new Date(r.createdAt);
                        const diffColor = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' }[r.difficulty];
                        return (
                          <tr key={r._id}>
                            <td style={{ fontSize: '0.88rem', color: '#555' }}>
                              {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>
                              <span style={{
                                background: diffColor + '22', color: diffColor,
                                padding: '2px 9px', borderRadius: 20,
                                fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize'
                              }}>
                                {r.difficulty}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.wpm}</td>
                            <td style={{ fontWeight: 600, color: r.accuracy >= 90 ? '#4CAF50' : r.accuracy >= 75 ? '#FF9800' : '#F44336' }}>
                              {r.accuracy}%
                            </td>
                            <td>
                              <span style={{
                                background: 'var(--primary-grad)', color: 'white',
                                padding: '2px 9px', borderRadius: 20,
                                fontSize: '0.85rem', fontWeight: 600
                              }}>
                                {r.score?.toFixed(1) ?? '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!loading && results.length === 0 && (
            <div className="section-card" style={{ marginTop: 0 }}>
              <div className="empty-state">
                <i className="fas fa-keyboard" style={{ fontSize: '3rem', color: '#ddd', marginBottom: 16, display: 'block' }}></i>
                <p>You haven't completed any tests yet.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
                  Start Typing Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
