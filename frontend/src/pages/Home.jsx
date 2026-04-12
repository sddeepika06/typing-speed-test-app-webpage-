import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ResultModal from '../components/ResultModal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const TEXT_SAMPLES = {
  easy: [
    "The sun is bright today. We can see many birds in the sky. Children are playing in the park. Life is good when we are happy.",
    "I like to read books. My cat is sleeping on the chair. The weather is nice and warm. We should go for a walk soon.",
    "Flowers bloom in spring. Trees are green and tall. Water flows in the river. People smile and laugh together.",
    "Music makes me happy. Friends are very important. Food tastes better when shared. Home is where love lives.",
    "Dogs are loyal pets. Cars drive on roads. Stars shine at night. Morning brings new hope and joy."
  ],
  medium: [
    "Technology has transformed the way we communicate with each other. Social media platforms allow us to connect instantly with people around the world, but they also present challenges for privacy and authentic relationships.",
    "Environmental conservation requires collective effort from governments, businesses, and individuals. Climate change affects weather patterns, biodiversity, and economic systems across the globe in complex ways.",
    "Education systems must adapt to prepare students for rapidly changing job markets. Critical thinking, creativity, and digital literacy have become essential skills for success in the modern workplace.",
    "Scientific research drives innovation in medicine, engineering, and technology. Collaboration between institutions accelerates discoveries that improve quality of life for millions of people worldwide.",
    "Economic policies influence employment rates, inflation, and social welfare programs. Understanding these relationships helps citizens make informed decisions about their financial futures."
  ],
  hard: [
    "Quantum mechanics fundamentally challenges our intuitive understanding of reality by demonstrating that particles can exist in superposition states until observed, suggesting that consciousness might play a crucial role in determining physical phenomena.",
    "Philosophical epistemology examines the nature of knowledge itself, questioning whether absolute truth exists or if all understanding is contextual, culturally constructed, and inherently subjective to human cognitive limitations and biases.",
    "Neuroplasticity research indicates that the brain continuously reorganizes neural pathways throughout life, contradicting previous assumptions about fixed cognitive capacity and suggesting unprecedented potential for rehabilitation and enhancement.",
    "Cryptographic algorithms ensure digital security through mathematical complexity that would require exponential computational resources to break, yet quantum computing threatens to render current encryption methods obsolete within decades.",
    "Bioethical considerations surrounding genetic engineering raise profound questions about human enhancement, equitable access to treatments, and the potential consequences of altering evolutionary processes through technological intervention."
  ]
};

const DIFFICULTY_INFO = {
  easy: "Simple words and common phrases — Perfect for beginners",
  medium: "Complex sentences and technical terms — Good for intermediate typists",
  hard: "Advanced vocabulary and challenging concepts — For expert typists"
};

function getRandomText(difficulty) {
  const arr = TEXT_SAMPLES[difficulty];
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Home() {
  const { user, token } = useAuth();

  const [difficulty, setDifficulty] = useState('easy');
  const [testText, setTestText] = useState(getRandomText('easy'));
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [modalResult, setModalResult] = useState(null);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        const secs = (Date.now() - startTime) / 1000;
        setElapsed(secs);
        const mins = secs / 60;
        setWpm(mins > 0 ? Math.round((correctChars / 5) / mins) : 0);
      }, 200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, startTime, correctChars]);

  const changeDifficulty = (level) => {
    setDifficulty(level);
    setTestText(getRandomText(level));
    resetState();
  };

  const loadNewText = () => {
    setTestText(getRandomText(difficulty));
    resetState();
  };

  const resetState = () => {
    setIsActive(false);
    setInputValue('');
    setStartTime(null);
    setElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    clearInterval(timerRef.current);
  };

  const startTest = () => {
    resetState();
    setTimeout(() => {
      setIsActive(true);
      setStartTime(Date.now());
      inputRef.current?.focus();
    }, 50);
  };

  const handleInput = (e) => {
    if (!isActive) return;
    const val = e.target.value;
    setInputValue(val);

    let correct = 0;
    for (let i = 0; i < Math.min(val.length, testText.length); i++) {
      if (val[i] === testText[i]) correct++;
    }
    setCorrectChars(correct);

    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= testText.length) {
      finishTest(correct, val.length, acc);
    }
  };

  const finishTest = async (correct, total, acc) => {
    setIsActive(false);
    clearInterval(timerRef.current);

    const secs = (Date.now() - startTime) / 1000;
    const mins = secs / 60;
    const finalWpm = mins > 0 ? Math.round((correct / 5) / mins) : 0;
    const finalAcc = total > 0 ? Math.round((correct / total) * 100) : 100;

    setModalResult({ wpm: finalWpm, accuracy: finalAcc, time: Math.round(secs), chars: total });

    // Save to DB if logged in
    if (user && token) {
      try {
        await api.post('/results', {
          wpm: finalWpm,
          accuracy: finalAcc,
          time: Math.round(secs),
          difficulty
        });
      } catch (err) {
        console.error('Failed to save result:', err);
      }
    }
  };

  // Build highlighted display
  const renderText = () => {
    return testText.split('').map((char, i) => {
      let cls = '';
      if (i < inputValue.length) {
        cls = inputValue[i] === char ? 'correct' : 'incorrect';
      } else if (i === inputValue.length) {
        cls = 'current';
      }
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  const progress = Math.min((inputValue.length / testText.length) * 100, 100);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="app-header">
          <Navbar />
          <h1><i className="fas fa-keyboard" style={{ marginRight: 12 }}></i>TypingMaster Pro</h1>
          <p>Challenge yourself with different difficulty levels</p>
        </div>

        <div className="main-content">
          {/* Difficulty Selector */}
          <div className="difficulty-selector">
            {['easy', 'medium', 'hard'].map(level => (
              <button
                key={level}
                className={`difficulty-btn ${level} ${difficulty === level ? 'active' : ''}`}
                onClick={() => changeDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Difficulty Info */}
          <div className="difficulty-info">
            <strong>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode:</strong> {DIFFICULTY_INFO[difficulty]}
          </div>

          {/* Stats */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-value">{wpm}</div>
              <div className="stat-label">Words Per Minute</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{Math.round(elapsed)}s</div>
              <div className="stat-label">Time Elapsed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{inputValue.length}</div>
              <div className="stat-label">Characters Typed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Typing Area */}
          <div className="typing-area">
            <div className="text-display">{renderText()}</div>
            <textarea
              ref={inputRef}
              className="typing-input"
              value={inputValue}
              onChange={handleInput}
              onPaste={(e) => e.preventDefault()}
              placeholder={isActive ? 'Start typing...' : 'Click "Start Test" to begin'}
              disabled={!isActive}
            />
          </div>

          {/* Controls */}
          <div className="control-buttons">
            <button className="btn btn-primary" onClick={startTest} disabled={isActive}>
              <i className="fas fa-play" style={{ marginRight: 7 }}></i>
              {isActive ? 'Running...' : 'Start Test'}
            </button>
            <button className="btn btn-secondary" onClick={resetState}>
              <i className="fas fa-redo" style={{ marginRight: 7 }}></i>Reset
            </button>
            <button className="btn btn-secondary" onClick={loadNewText}>
              <i className="fas fa-sync-alt" style={{ marginRight: 7 }}></i>New Text
            </button>
          </div>

          {!user && (
            <p style={{ textAlign: 'center', marginTop: 20, color: '#888', fontSize: '0.9rem' }}>
              <i className="fas fa-info-circle"></i> <a href="/login" style={{ color: 'var(--primary)' }}>Log in</a> to save your results and track progress.
            </p>
          )}
        </div>
      </div>

      {modalResult && (
        <ResultModal
          result={modalResult}
          onClose={() => { setModalResult(null); resetState(); }}
        />
      )}
    </div>
  );
}
