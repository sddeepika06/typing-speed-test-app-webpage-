export default function ResultModal({ result, onClose }) {
  if (!result) return null;

  const { wpm, accuracy, time, chars } = result;

  let rating = '';
  let ratingClass = '';

  if (wpm >= 70 && accuracy >= 95) {
    rating = '🏆 Excellent! You\'re a typing master!';
    ratingClass = 'excellent';
  } else if (wpm >= 50 && accuracy >= 85) {
    rating = '🌟 Great job! Above average performance!';
    ratingClass = 'good';
  } else if (wpm >= 30 && accuracy >= 75) {
    rating = '👍 Good work! Keep practicing!';
    ratingClass = 'average';
  } else {
    rating = '💪 Keep going! You\'ll improve with time!';
    ratingClass = 'poor';
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Test Complete! 🎉</h2>
        <div className="result-grid">
          <div className="result-item">
            <div className="val">{wpm}</div>
            <div className="lbl">Words Per Minute</div>
          </div>
          <div className="result-item">
            <div className="val">{accuracy}%</div>
            <div className="lbl">Accuracy</div>
          </div>
          <div className="result-item">
            <div className="val">{time}s</div>
            <div className="lbl">Total Time</div>
          </div>
          <div className="result-item">
            <div className="val">{chars}</div>
            <div className="lbl">Characters</div>
          </div>
        </div>
        <div className={`perf-badge ${ratingClass}`}>{rating}</div>
        <button className="btn btn-primary" onClick={onClose}>Try Again</button>
      </div>
    </div>
  );
}
