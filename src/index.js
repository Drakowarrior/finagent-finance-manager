// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Show loading screen immediately
const loadingDiv = document.createElement('div');
loadingDiv.id = 'initial-loading';
loadingDiv.innerHTML = `
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  ">
    <div style="text-align: center;">
      <div style="
        position: relative;
        display: inline-block;
        margin-bottom: 2rem;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.1);
          animation: ringPulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid rgba(79, 70, 229, 0.3);
          border-top: 2px solid #4F46E5;
          animation: ringSpin 1.5s linear infinite;
        "></div>
        <div style="
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #06B6D4 80%, #4F46E5 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: textGradient 3s ease infinite;
          letter-spacing: -1px;
          position: relative;
          z-index: 2;
        ">FINAGENT</div>
        <div style="
          position: absolute;
          top: -10px;
          right: -20px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 20px;
          animation: badgePulse 1.5s ease-in-out infinite;
          box-shadow: 0 2px 10px rgba(79, 70, 229, 0.4);
        ">AI</div>
      </div>
      <div style="
        width: 250px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin: 1.5rem auto;
      ">
        <div style="
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #4F46E5, #06B6D4);
          border-radius: 4px;
          animation: loading 2s ease forwards;
        "></div>
      </div>
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 1rem;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
      ">
        <span>🧠</span>
        <span>Initializing FINAGENT AI...</span>
      </div>
      <div style="
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 1.5rem;
      ">
        <span style="
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          border-radius: 50%;
          display: inline-block;
          animation: dotWave 1.2s ease-in-out infinite;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          border-radius: 50%;
          display: inline-block;
          animation: dotWave 1.2s ease-in-out infinite 0.1s;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          border-radius: 50%;
          display: inline-block;
          animation: dotWave 1.2s ease-in-out infinite 0.2s;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          border-radius: 50%;
          display: inline-block;
          animation: dotWave 1.2s ease-in-out infinite 0.3s;
        "></span>
        <span style="
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4F46E5, #06B6D4);
          border-radius: 50%;
          display: inline-block;
          animation: dotWave 1.2s ease-in-out infinite 0.4s;
        "></span>
      </div>
    </div>
  </div>
  <style>
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
    @keyframes loading {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    @keyframes ringPulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.5;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.8;
      }
    }
    @keyframes ringSpin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
    @keyframes textGradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes badgePulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 2px 10px rgba(79, 70, 229, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(79, 70, 229, 0.6);
      }
    }
    @keyframes dotWave {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.3;
      }
      30% {
        transform: translateY(-12px);
        opacity: 1;
      }
    }
  </style>
`;
document.body.appendChild(loadingDiv);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading screen after React mounts
setTimeout(() => {
  const loadingEl = document.getElementById('initial-loading');
  if (loadingEl) {
    loadingEl.style.opacity = '0';
    loadingEl.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      if (loadingEl && loadingEl.parentNode) {
        loadingEl.parentNode.removeChild(loadingEl);
      }
    }, 500);
  }
}, 2500);