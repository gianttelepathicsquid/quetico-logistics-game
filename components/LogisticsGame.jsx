import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, Star, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const LogisticsGame = () => {
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [animation, setAnimation] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const generatePackage = () => ({
    id: Math.random(),
    type: ['Standard', 'Fragile', 'Express'][Math.floor(Math.random() * 3)],
    correctBin: Math.floor(Math.random() * 3),
    color: ['#00B4D8', '#00D8B4', '#0096B4'][Math.floor(Math.random() * 3)]
  });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setCombo(1);
    setTimeLeft(60);
    setCurrentPackage(generatePackage());
  };

  const showFeedback = (isCorrect, points) => {
    setFeedback({
      text: isCorrect ? `+${points}` : '-5',
      color: isCorrect ? '#4CAF50' : '#FF4444',
      timestamp: Date.now()
    });

    setTimeout(() => setFeedback(null), 1000);
  };

  const handleBinClick = (binIndex) => {
    if (gameState !== 'playing') return;
    
    const isCorrect = currentPackage.correctBin === binIndex;
    
    // Set animation target
    setAnimation({
      from: { x: '50%', y: '40%' },
      to: { x: `${(binIndex * 33) + 16.5}%`, y: '100%' },
      isCorrect
    });

    // Process score after animation delay
    setTimeout(() => {
      if (isCorrect) {
        const points = 10 * combo;
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        setCombo(prev => Math.min(prev + 0.5, 4));
        showFeedback(true, points);
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setStreak(0);
        setCombo(1);
        showFeedback(false, 5);
      }
      
      // Clear animation and set new package
      setTimeout(() => {
        setAnimation(null);
        setCurrentPackage(generatePackage());
      }, 300);
    }, 500);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('ended');
            setHighScore(current => Math.max(current, score));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const getPackageStyle = () => {
    if (!animation) {
      return {
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s ease'
      };
    }

    return {
      position: 'absolute',
      left: animation.to.x,
      top: animation.to.y,
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.5s ease',
      opacity: 0
    };
  };

  return (
    <div style={{
      backgroundColor: '#0A192F',
      color: 'white',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#00B4D8'
        }}>
          3PL Operations Challenge
        </h1>

        {gameState === 'intro' && (
          <div>
            <p style={{ color: '#94A3B8', marginBottom: '24px' }}>
              Sort packages into the correct bins as quickly as possible!
              Build combos for bonus points and watch out for special handling requirements.
            </p>
            <button
              onClick={startGame}
              style={{
                backgroundColor: '#00B4D8',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              Start Sorting
            </button>
          </div>
        )}

        {gameState !== 'intro' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock style={{ color: '#00B4D8' }} />
              <div>{timeLeft}s</div>
            </div>
            <div style={{
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Star style={{ color: '#00B4D8' }} />
              <div>{score}</div>
            </div>
            <div style={{
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp style={{ color: '#00B4D8' }} />
              <div>x{combo.toFixed(1)}</div>
            </div>
            <div style={{
              backgroundColor: '#1E2A3B',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle style={{ color: '#00B4D8' }} />
              <div>{streak}</div>
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div style={{ 
          backgroundColor: '#1E2A3B',
          borderRadius: '8px',
          padding: '24px',
          minHeight: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {currentPackage && (
            <div style={getPackageStyle()}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Package 
                  size={48}
                  style={{
                    color: currentPackage.color,
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                  }}
                />
                <div style={{
                  backgroundColor: '#2A3B4D',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}>
                  {currentPackage.type}
                </div>
              </div>
            </div>
          )}

          {feedback && (
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: feedback.color,
              fontSize: '2rem',
              fontWeight: 'bold',
              animation: 'fadeUpAndOut 1s forwards'
            }}>
              {feedback.text}
            </div>
          )}

          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '0',
            right: '0',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '0 24px'
          }}>
            {[0, 1, 2].map((bin) => (
              <button
                key={bin}
                onClick={() => handleBinClick(bin)}
                style={{
                  backgroundColor: '#2A3B4D',
                  padding: '20px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                <Truck 
                  size={32}
                  style={{ color: '#00B4D8' }}
                />
                <span>Bin {bin + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Game Over!</h2>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '2rem', color: '#00B4D8', marginBottom: '8px' }}>
              {score}
            </div>
            <div style={{ color: '#94A3B8' }}>Final Score</div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '1.5rem', color: '#00B4D8', marginBottom: '8px' }}>
              {highScore}
            </div>
            <div style={{ color: '#94A3B8' }}>High Score</div>
          </div>
          <button
            onClick={startGame}
            style={{
              backgroundColor: '#00B4D8',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.125rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#0096B4'}
            onMouseLeave={e => e.target.style.backgroundColor = '#00B4D8'}
          >
            Play Again
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes fadeUpAndOut {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LogisticsGame;
