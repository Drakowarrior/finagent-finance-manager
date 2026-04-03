// src/pages/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  const features = [
    {
      title: "AI-Powered Tracking",
      description: "FINAGENT uses artificial intelligence to automatically categorize and track your expenses.",
      icon: "🤖"
    },
    {
      title: "Smart Budget Planning",
      description: "Get intelligent recommendations for budget allocation based on your spending patterns.",
      icon: "📊"
    },
    {
      title: "Real-time Analytics",
      description: "Visualize your financial health with beautiful charts powered by FINAGENT AI.",
      icon: "📈"
    },
    {
      title: "Privacy First",
      description: "Your data stays on your device. FINAGENT never stores your financial information in the cloud.",
      icon: "🔒"
    },
    {
      title: "Goal Tracking",
      description: "Set and track progress towards your financial goals with AI-powered insights.",
      icon: "🎯"
    },
    {
      title: "24/7 Access",
      description: "Access your financial dashboard anytime, anywhere with FINAGENT.",
      icon: "⏰"
    }
  ];

  return (
    <div className="about">
      <div className="about-header">
        <h1 className="about-title">About FINAGENT</h1>
        <p className="about-subtitle">Your intelligent AI-powered finance management companion</p>
      </div>

      <div className="about-grid">
        <div className="about-card mission-card">
          <h2>Our Mission</h2>
          <p>
            FINAGENT was created to democratize financial intelligence, making powerful money management 
            tools accessible to everyone. We believe that managing finances should be simple, intuitive, 
            and even enjoyable with the power of artificial intelligence.
          </p>
        </div>

        <div className="about-card vision-card">
          <h2>Our Vision</h2>
          <p>
            To become the most trusted AI finance companion that helps millions achieve financial freedom 
            through intelligent technology, beautiful design, and actionable insights powered by FINAGENT.
          </p>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">What FINAGENT Offers</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card-about">
              <div className="feature-icon-about">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section-about">
        <div className="stat-item-about">
          <div className="stat-number">100%</div>
          <div className="stat-label">Privacy Guaranteed</div>
        </div>
        <div className="stat-item-about">
          <div className="stat-number">24/7</div>
          <div className="stat-label">AI Access</div>
        </div>
        <div className="stat-item-about">
          <div className="stat-number">0</div>
          <div className="stat-label">Hidden Fees</div>
        </div>
        <div className="stat-item-about">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free to Use</div>
        </div>
      </div>

      <div className="tech-section">
        <h2 className="section-title">Built With FINAGENT AI Technology</h2>
        <div className="tech-stack-about">
          <div className="tech-item">
            <div className="tech-name">React + AI</div>
            <div className="tech-desc">Modern UI Framework</div>
          </div>
          <div className="tech-item">
            <div className="tech-name">FINAGENT Core</div>
            <div className="tech-desc">Intelligent Engine</div>
          </div>
          <div className="tech-item">
            <div className="tech-name">Local Storage</div>
            <div className="tech-desc">Secure Data Storage</div>
          </div>
          <div className="tech-item">
            <div className="tech-name">Context API</div>
            <div className="tech-desc">State Management</div>
          </div>
        </div>
      </div>

      <div className="commitment-section">
        <h2>FINAGENT's Commitment to You</h2>
        <p>
          FINAGENT is committed to providing a secure, private, and intelligent platform that helps you 
          take control of your financial future. Your data never leaves your device, and we will never 
          charge for essential features. FINAGENT is and always will be free.
        </p>
      </div>
    </div>
  );
};

export default About;