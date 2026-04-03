// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-text">FINAGENT</span>
            <span className="footer-logo-dot"></span>
          </div>
          <p className="footer-description">
            Your intelligent finance companion for tracking expenses, 
            planning budgets, and achieving financial freedom.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Creator</h4>
          <p className="creator-name">Karan Garg</p>
          <div className="contact-info">
            <a href="mailto:Unisoldier2022@gmail.com" className="contact-link">
              📧 Unisoldier2022@gmail.com
            </a>
            <a 
              href="https://karanportfolio-indol.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link portfolio-link"
            >
              🌐 View Portfolio
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} FINAGENT. All rights reserved.
          </p>
          <p className="creator-credit">
            Made with ❤️ by <span className="creator-name-link">Karan Garg</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;