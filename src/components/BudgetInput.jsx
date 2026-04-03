// src/components/BudgetInput.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import './BudgetInput.css';

const BudgetInput = ({ compact = false }) => {
  const { budget, updateBudget } = useFinance();
  const [tempBudget, setTempBudget] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Initialize tempBudget when budget changes or component mounts
  useEffect(() => {
    if (budget > 0) {
      setTempBudget(budget.toString());
    } else {
      setTempBudget('0');
    }
  }, [budget]);

  const handleSave = () => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      updateBudget(newBudget);
      setIsEditing(false);
      
      // Show warning if budget is too low
      if (newBudget > 0 && newBudget < 1000) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  // Format currency in Indian Rupees
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (compact) {
    return (
      <div className="budget-input-compact">
        <div className="compact-display">
          <span className="compact-label">Monthly Budget:</span>
          <span className="compact-value">{formatIndianCurrency(budget)}</span>
          <button 
            className="compact-edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
        
        {isEditing && (
          <div className="compact-edit-modal">
            <div className="compact-input-wrapper">
              <span className="compact-currency">₹</span>
              <input
                type="number"
                className="compact-input"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                placeholder="Enter budget amount"
              />
            </div>
            <div className="compact-actions">
              <button onClick={() => {
                setIsEditing(false);
                setTempBudget(budget.toString());
              }}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="budget-input-container">
      <div className="budget-input-card">
        <div className="budget-input-header">
          <div>
            <h3 className="budget-input-title">Monthly Budget</h3>
            <p className="budget-input-subtitle">Set your spending limit for the month</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="budget-display">
            <div className="budget-amount">
              <span className="currency">₹</span>
              <span className="amount">{budget.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="edit-budget-btn"
              onClick={() => setIsEditing(true)}
            >
              {budget === 0 ? 'Set Budget' : 'Edit Budget'}
            </button>
          </div>
        ) : (
          <div className="budget-edit-mode">
            <div className="budget-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                className="budget-number-input"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter monthly budget"
                autoFocus
              />
            </div>
            <div className="budget-presets">
              <button onClick={() => setTempBudget("5000")}>₹5,000</button>
              <button onClick={() => setTempBudget("10000")}>₹10,000</button>
              <button onClick={() => setTempBudget("20000")}>₹20,000</button>
              <button onClick={() => setTempBudget("50000")}>₹50,000</button>
            </div>
            <div className="budget-edit-actions">
              <button 
                className="cancel-edit-btn"
                onClick={() => {
                  setIsEditing(false);
                  setTempBudget(budget.toString());
                }}
              >
                Cancel
              </button>
              <button 
                className="save-budget-btn"
                onClick={handleSave}
              >
                Save Budget
              </button>
            </div>
          </div>
        )}

        {showWarning && (
          <div className="warning-toast">
            ⚠️ Warning: Your budget is very low. Please review your financial goals!
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetInput;