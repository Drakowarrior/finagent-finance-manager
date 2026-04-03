// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './Home.css';

const Home = ({ setCurrentPage }) => {
  const { expenses, budget, savings } = useFinance();
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const featuresRef = useRef(null);
  const heroRef = useRef(null);

  // Calculate real data from context
  useEffect(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && 
             expDate.getFullYear() === now.getFullYear();
    });
    
    const total = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setMonthlyExpenses(total);
    
    const balance = Math.max(0, budget - total + savings);
    setTotalBalance(balance);
    
    setCurrentSavings(savings);
  }, [expenses, budget, savings]);

  // Animate feature cards on scroll
  useEffect(() => {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => featureObserver.observe(card));

    return () => {
      featureObserver.disconnect();
    };
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setSelectedFeature(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const features = [
    { 
      title: "Smart Tracking", 
      desc: "Track expenses effortlessly with intelligent categorization",
      longDesc: "Our AI-powered tracking system automatically categorizes your expenses. It learns from your spending patterns and helps you understand where your money goes.",
      benefits: [
        "Automatic expense categorization",
        "Real-time spending alerts",
        "Visual spending reports",
        "Custom category creation"
      ]
    },
    { 
      title: "Budget Planning", 
      desc: "Set budgets and get real-time insights on your spending",
      longDesc: "Create personalized budgets for different categories and track your progress in real-time with FINAGENT's intelligent recommendations.",
      benefits: [
        "Custom budget limits per category",
        "Real-time budget tracking",
        "Spending alerts and notifications",
        "Monthly budget reports"
      ]
    },
    { 
      title: "Savings Goals", 
      desc: "Set and track your savings goals with visual progress",
      longDesc: "Define your savings targets and watch your progress grow. FINAGENT helps you stay motivated to reach your goals faster.",
      benefits: [
        "Multiple savings goals",
        "Progress tracking with charts",
        "Goal completion estimates",
        "Savings tips and recommendations"
      ]
    },
    { 
      title: "Analytics Dashboard", 
      desc: "Visualize your financial health with beautiful charts",
      longDesc: "Get a complete overview of your financial health with interactive charts and graphs powered by FINAGENT AI.",
      benefits: [
        "Interactive charts and graphs",
        "Spending trend analysis",
        "Income vs expense comparison",
        "Export reports feature"
      ]
    },
    { 
      title: "Secure & Private", 
      desc: "Your data stays on your device with local storage",
      longDesc: "Your financial data never leaves your device. FINAGENT ensures complete privacy with local storage.",
      benefits: [
        "100% local data storage",
        "No cloud uploads",
        "Your data, your control",
        "Privacy guaranteed"
      ]
    },
    { 
      title: "Real-time Sync", 
      desc: "Instant updates across all your financial activities",
      longDesc: "Changes are instantly reflected across all parts of FINAGENT. Experience seamless financial management.",
      benefits: [
        "Instant data updates",
        "Consistent across all pages",
        "No refresh needed",
        "Smooth user experience"
      ]
    }
  ];

  const handleLearnMore = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeature(null);
    document.body.style.overflow = 'unset';
  };

  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(exp => ({
      name: exp.name,
      amount: exp.amount,
      date: getRelativeDate(exp.date)
    }));

  function getRelativeDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  const budgetUsagePercent = budget > 0 ? Math.min((monthlyExpenses / budget) * 100, 100) : 0;

  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="home">
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`
          }}></div>
        ))}
      </div>

      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">
            <span>FINAGENT - Your AI Finance Manager</span>
          </div>
          <h1 className="hero-title">
            Take Control of 
            <span className="gradient-text"> Your Finances with FINAGENT</span>
          </h1>
          <p className="hero-subtitle">
            Track expenses, plan budgets, and achieve financial freedom with our intelligent AI-powered tools.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={() => setCurrentPage('Dashboard')}>
              Get Started Free
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="cta-button secondary" onClick={() => setCurrentPage('Calculators')}>
              Try Calculators
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="preview-title">FINAGENT Overview</span>
            </div>
            <div className="preview-balance">
              <p className="balance-label">Total Balance</p>
              <h3 className="balance-amount">{formatIndianCurrency(totalBalance)}</h3>
            </div>
            <div className="preview-stats">
              <div className="preview-stat">
                <span>Expenses</span>
                <strong>{formatIndianCurrency(monthlyExpenses)}</strong>
              </div>
              <div className="preview-stat">
                <span>Savings</span>
                <strong>{formatIndianCurrency(currentSavings)}</strong>
              </div>
            </div>
            <div className="preview-progress">
              <div className="progress-label">
                <span>Budget Used</span>
                <span>{budgetUsagePercent.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${budgetUsagePercent}%` }}></div>
              </div>
            </div>
            <div className="preview-transactions">
              {recentTransactions.length === 0 ? (
                <div className="preview-tx">
                  <span>No expenses yet</span>
                  <span className="tx-amount">Add your first</span>
                </div>
              ) : (
                recentTransactions.map((tx, i) => (
                  <div key={i} className="preview-tx">
                    <span>{tx.name}</span>
                    <span className="tx-amount">{formatIndianCurrency(tx.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features" ref={featuresRef}>
        <div className="section-header">
          <span className="section-badge">Why Choose FINAGENT</span>
          <h2 className="section-title">Powerful Features for <span className="gradient-text">Smart Finance</span></h2>
          <p className="section-subtitle">Everything you need to manage your finances in one AI-powered platform</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ transitionDelay: `${index * 0.1}s` }}>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <div className="feature-link" onClick={() => handleLearnMore(feature)}>
                <span>Learn more</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to take control of your finances with FINAGENT?</h2>
          <p>Start your journey towards financial freedom today</p>
          <button className="cta-button primary large" onClick={() => setCurrentPage('Dashboard')}>
            Start Your Journey with FINAGENT
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {showModal && selectedFeature && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedFeature.title}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedFeature.longDesc}</p>
              <div className="modal-benefits">
                <h3>Key Benefits</h3>
                <ul className="benefits-list">
                  {selectedFeature.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-action-btn" onClick={() => {
                closeModal();
                setCurrentPage('Dashboard');
              }}>
                Get Started with FINAGENT
              </button>
              <button className="modal-secondary-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;