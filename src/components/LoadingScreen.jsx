// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    { text: "Initializing FINAGENT AI...", icon: "🧠" },
    { text: "Analyzing financial patterns...", icon: "📊" },
    { text: "Preparing smart insights...", icon: "✨" },
    { text: "Setting up your dashboard...", icon: "⚙️" },
    { text: "Almost ready...", icon: "🚀" },
    { text: "FINAGENT is ready!", icon: "🎉" }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 12;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              if (onLoadingComplete) onLoadingComplete();
            }, 600);
          }, 800);
          return 100;
        }
        return Math.min(newProgress, 100);
      });
    }, 180);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < loadingMessages.length - 1 && progress < 95) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onLoadingComplete, progress, loadingMessages.length]);

  const currentMessage = loadingMessages[currentMessageIndex];

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated Background */}
      <div className="loading-bg">
        <div className="loading-bg-gradient"></div>
        <div className="loading-bg-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="bg-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`
            }}></div>
          ))}
        </div>
      </div>

      <div className="loading-container">
        {/* Logo Section */}
        <div className="loading-logo-wrapper">
          <div className="loading-logo-ring">
            <div className="loading-logo-ring-inner"></div>
          </div>
          <div className="loading-logo">
            <span className="loading-logo-text">FINAGENT</span>
            <div className="loading-logo-dot"></div>
          </div>
          <div className="loading-logo-badge">AI</div>
        </div>

        {/* Progress Section */}
        <div className="loading-progress-section">
          <div className="loading-progress-container">
            <div className="loading-progress-bar">
              <div 
                className="loading-progress-fill" 
                style={{ width: `${progress}%` }}
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            <div className="loading-progress-stats">
              <span className="loading-progress-percent">{Math.round(progress)}%</span>
              <span className="loading-progress-label">Loading Complete</span>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="loading-message-section">
          <div className="loading-message-icon">{currentMessage?.icon}</div>
          <div className="loading-message-text">{currentMessage?.text}</div>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        {/* Tip Section */}
        <div className="loading-tip">
          <span className="tip-bulb">💡</span>
          <span className="tip-text">Did you know? FINAGENT keeps all your data private on your device.</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;