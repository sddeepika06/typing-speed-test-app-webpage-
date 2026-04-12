import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DIFF_COLORS = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/results/${user.id}`);
      setResults(res.data);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  // Summary stats
  const bestWpm = results.length ? Math.max(...results.map(r => r.wpm)) : 0;
  const avgWpm = results.length ? Math.round(results.reduce((a, r) => a + r.wpm, 0) / results.length) : 0;
  const avgAcc = results.length ? Math.round(results.reduce((a, r) => a + r.accuracy, 0) / results.length) : 0;

  // Chart data — last 10 tests in chronological order
  const chartTests = [...results].slice(0, 10).reverse();
  const chartData = {
    labels: chartTests.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: chartTests.map(r => r.wpm),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointRadius: 5
      },
      {
        label: 'Accuracy (%)',
        data: chartTests.map(r => r.accuracy),
        borderColor: 'rgba(118, 75, 162, 1)',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(118, 75, 162, 1)',
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, max: 120 }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="app-header">
          <Navbar />
          <h1><i className="fas fa-chart-line" style={{ marginRight: 12 }}></i>My Progress</h1>
          <p>Track your typing improvement over time</p>
        </div>

        <div className="main-content">
          {/* Summary stats */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">Tests Completed</div>
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

          {loading && <div className="spinner"></div>}

          {error && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '14px 18px', borderRadius: 8 }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }}></i>{error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Progress Chart */}
              {results.length > 1 && (
                <div className="section-card" style={{ marginTop: 0 }}>
                  <div className="section-header">
                    <h2>Progress Chart</h2>
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Last 10 tests</span>
                  </div>
                  <div className="chart-wrapper">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}

              {/* History Table */}
              <div className="section-card">
                <div className="section-header">
                  <h2>Test History</h2>
                  <button className="btn btn-secondary" onClick={fetchHistory} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                    <i className="fas fa-sync-alt" style={{ marginRight: 6 }}></i>Refresh
                  </button>
                </div>

                {results.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-history" style={{ fontSize: '3rem', color: '#ddd', marginBottom: 16, display: 'block' }}></i>
                    <p>No test history yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
                      Take Your First Test
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Date & Time</th>
                          <th>Difficulty</th>
                          <th>WPM</th>
                          <th>Accuracy</th>
                          <th>Time</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, idx) => {
                          const d = new Date(r.createdAt);
                          return (
                            <tr key={r._id}>
                              <td style={{ color: '#aaa' }}>{idx + 1}</td>
                              <td style={{ fontSize: '0.88rem', color: '#555' }}>
                                {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td>
                                <span style={{
                                  background: DIFF_COLORS[r.difficulty] + '22',
                                  color: DIFF_COLORS[r.difficulty],
                                  padding: '3px 10px',
                                  borderRadius: 20,
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  textTransform: 'capitalize'
                                }}>
                                  {r.difficulty}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.wpm}</td>
                              <td style={{
                                fontWeight: 600,
                                color: r.accuracy >= 90 ? '#4CAF50' : r.accuracy >= 75 ? '#FF9800' : '#F44336'
                              }}>
                                {r.accuracy}%
                              </td>
                              <td style={{ color: '#666' }}>{r.time}s</td>
                              <td>
                                <span style={{
                                  background: 'var(--primary-grad)',
                                  color: 'white',
                                  padding: '2px 9px',
                                  borderRadius: 20,
                                  fontSize: '0.85rem',
                                  fontWeight: 600
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
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
