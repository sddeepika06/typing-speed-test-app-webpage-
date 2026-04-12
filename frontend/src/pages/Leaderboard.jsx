import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/leaderboard');
      setData(res.data);
    } catch (err) {
      setError('Failed to load leaderboard. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
    const icon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    return <span className={`rank-badge ${cls}`}>{icon}</span>;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="app-header">
          <Navbar />
          <h1><i className="fas fa-trophy" style={{ marginRight: 12 }}></i>Leaderboard</h1>
          <p>Top typists ranked by score = (WPM × 0.7) + (Accuracy × 0.3)</p>
        </div>

        <div className="main-content">
          {/* Score formula card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
            border: '1px solid rgba(102,126,234,0.2)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 25,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap'
          }}>
            <i className="fas fa-calculator" style={{ color: 'var(--primary)', fontSize: '1.3rem' }}></i>
            <div>
              <strong style={{ color: 'var(--primary)' }}>Ranking Formula:</strong>
              <span style={{ marginLeft: 8, color: '#555' }}>Score = (WPM × 0.7) + (Accuracy × 0.3) — Best score per user</span>
            </div>
          </div>

          <div className="section-card" style={{ marginTop: 0 }}>
            <div className="section-header">
              <h2>🏆 Top Typists</h2>
              <button className="btn btn-secondary" onClick={fetchLeaderboard} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                <i className="fas fa-sync-alt" style={{ marginRight: 6 }}></i>Refresh
              </button>
            </div>

            {loading && <div className="spinner"></div>}

            {error && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '14px 18px', borderRadius: 8, marginBottom: 16 }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>{error}
              </div>
            )}

            {!loading && !error && data.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-trophy" style={{ fontSize: '3rem', color: '#ddd', marginBottom: 16, display: 'block' }}></i>
                <p>No results yet. Be the first to complete a test!</p>
              </div>
            )}

            {!loading && !error && data.length > 0 && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Best WPM</th>
                    <th>Best Accuracy</th>
                    <th>Score</th>
                    <th>Tests Done</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, idx) => (
                    <tr key={entry.userId} style={idx < 3 ? { fontWeight: 600 } : {}}>
                      <td>{getRankBadge(idx + 1)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="user-avatar" style={{ width: 28, height: 28, fontSize: '0.8rem', background: 'var(--primary-grad)', color: 'white' }}>
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          {entry.name}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{entry.bestWpm}</span>
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}> wpm</span>
                      </td>
                      <td>
                        <span style={{
                          color: entry.bestAccuracy >= 90 ? '#4CAF50' : entry.bestAccuracy >= 75 ? '#FF9800' : '#F44336',
                          fontWeight: 600
                        }}>
                          {entry.bestAccuracy}%
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: 'var(--primary-grad)',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}>
                          {entry.bestScore.toFixed(1)}
                        </span>
                      </td>
                      <td style={{ color: '#888' }}>{entry.totalTests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
