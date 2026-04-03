// src/components/SavingsInput.jsx
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './SavingsInput.css';

const SavingsInput = () => {
  const { savings, updateSavings } = useFinance();
  const [tempSavings, setTempSavings] = useState(savings.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Format Indian currency
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    const newSavings = parseFloat(tempSavings);
    if (!isNaN(newSavings) && newSavings >= 0) {
      updateSavings(newSavings);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempSavings(savings.toString());
    }
  };

  return (
    <div className="savings-input-container">
      <div className="savings-input-card">
        <div className="savings-input-header">
          <div className="savings-icon">🏦</div>
          <div>
            <h3 className="savings-input-title">Savings Goal</h3>
            <p className="savings-input-subtitle">Set your monthly savings target</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="savings-display">
            <div className="savings-amount">
              <span className="currency">{formatIndianCurrency(savings)}</span>
            </div>
            <button 
              className="edit-savings-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Goal
            </button>
          </div>
        ) : (
          <div className="savings-edit-mode">
            <div className="savings-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                className="savings-number-input"
                value={tempSavings}
                onChange={(e) => setTempSavings(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter savings goal"
                autoFocus
              />
            </div>
            <div className="savings-edit-actions">
              <button 
                className="cancel-edit-btn"
                onClick={() => {
                  setIsEditing(false);
                  setTempSavings(savings.toString());
                }}
              >
                Cancel
              </button>
              <button 
                className="save-savings-btn"
                onClick={handleSave}
              >
                Save Goal
              </button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="success-toast">
            ✓ Savings goal updated successfully!
          </div>
        )}

        <div className="savings-tip">
          <span className="tip-icon">💡</span>
          <span className="tip-text">
            Aim to save at least 20% of your monthly income for financial security.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavingsInput;