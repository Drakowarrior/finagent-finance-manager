// src/pages/Budget.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import BudgetInput from '../components/BudgetInput';
import SavingsInput from '../components/SavingsInput';
import './Budget.css';

const Budget = () => {
  const { budget, expenses } = useFinance(); // Removed unused 'savings'
  
  const [monthlyBudget, setMonthlyBudget] = useState(budget);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [viewMode, setViewMode] = useState('monthly');
  const [weeklyBudget, setWeeklyBudget] = useState(budget / 4);
  const [dailySpending, setDailySpending] = useState(0);
  const [projectedEndBalance, setProjectedEndBalance] = useState(0);
  const [daysLeft, setDaysLeft] = useState(30);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempCategoryBudget, setTempCategoryBudget] = useState('');
  
  // Load category budgets from localStorage
  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const saved = localStorage.getItem('finova_category_budgets');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      Food: 1000,
      Transport: 500,
      Shopping: 500,
      Entertainment: 400,
      Bills: 1500,
      Health: 300,
      Education: 300,
      Other: 500
    };
  });
  
  const [categorySpending, setCategorySpending] = useState({});

  // Format currency in Indian Rupees
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Save category budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finova_category_budgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  // Update local state when context values change
  useEffect(() => {
    setMonthlyBudget(budget);
    setWeeklyBudget(budget / 4);
  }, [budget]);

  // Calculate expenses from context
  useEffect(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalExpenses(total);
    
    // Calculate category spending
    const spending = {};
    expenses.forEach(exp => {
      spending[exp.category] = (spending[exp.category] || 0) + exp.amount;
    });
    setCategorySpending(spending);
  }, [expenses]);

  useEffect(() => {
    setRemaining(monthlyBudget - totalExpenses);
    
    // Calculate daily spending allowance
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemaining = endOfMonth.getDate() - today.getDate();
    setDaysLeft(daysRemaining);
    const dailyAllowance = remaining / (daysRemaining + 1);
    setDailySpending(dailyAllowance > 0 ? dailyAllowance : 0);
    
    // Projected end balance
    const currentDay = today.getDate();
    const avgDailySpending = currentDay > 0 ? totalExpenses / currentDay : 0;
    const projectedTotal = totalExpenses + (avgDailySpending * daysRemaining);
    setProjectedEndBalance(monthlyBudget - projectedTotal);
    
  }, [monthlyBudget, totalExpenses, remaining]);

  const percentage = Math.min((totalExpenses / monthlyBudget) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage <= 70) return 'safe';
    if (percentage <= 90) return 'warning';
    return 'danger';
  };

  const getTip = () => {
    if (percentage <= 50) return "Excellent! You're spending less than half your budget. Consider increasing savings!";
    if (percentage <= 70) return "Great job! You're well within your budget. Keep up the smart spending!";
    if (percentage <= 90) return "You're getting close to your budget limit. Consider reviewing your expenses.";
    return "You've exceeded your budget! Time to review your spending habits.";
  };

  // Handle editing category budget
  const handleEditCategoryBudget = (categoryName, currentBudget) => {
    setEditingCategory(categoryName);
    setTempCategoryBudget(currentBudget.toString());
  };

  const handleSaveCategoryBudget = () => {
    if (editingCategory && tempCategoryBudget) {
      const newBudget = parseFloat(tempCategoryBudget);
      if (!isNaN(newBudget) && newBudget >= 0) {
        setCategoryBudgets(prev => ({
          ...prev,
          [editingCategory]: newBudget
        }));
      }
    }
    setEditingCategory(null);
    setTempCategoryBudget('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setTempCategoryBudget('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveCategoryBudget();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const categories = [
    { name: 'Food', icon: '🍔', color: '#F59E0B', bg: '#FEF3C7' },
    { name: 'Transport', icon: '🚗', color: '#10B981', bg: '#D1FAE5' },
    { name: 'Shopping', icon: '🛍️', color: '#EF4444', bg: '#FEE2E2' },
    { name: 'Entertainment', icon: '🎬', color: '#8B5CF6', bg: '#EDE9FE' },
    { name: 'Bills', icon: '💡', color: '#06B6D4', bg: '#CFFAFE' },
    { name: 'Health', icon: '🏥', color: '#EC4899', bg: '#FCE7F3' },
    { name: 'Education', icon: '📚', color: '#14B8A6', bg: '#CCFBF1' },
    { name: 'Other', icon: '💰', color: '#64748B', bg: '#F1F5F9' }
  ];

  return (
    <div className="budget">
      <div className="budget-header">
        <div>
          <h1 className="budget-title">Budget Planner</h1>
          <p className="budget-subtitle">Track and optimize your spending</p>
        </div>
        <div className="view-toggle">
          <button className={`toggle-btn ${viewMode === 'monthly' ? 'active' : ''}`} onClick={() => setViewMode('monthly')}>
            Monthly
          </button>
          <button className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`} onClick={() => setViewMode('weekly')}>
            Weekly
          </button>
        </div>
      </div>

      {/* Budget Input Component */}
      <BudgetInput />

      {/* Budget Stats */}
      <div className="budget-stats">
        <div className="budget-stat">
          <div className="budget-stat-label">
            {viewMode === 'monthly' ? 'Monthly Budget' : 'Weekly Budget'}
          </div>
          <div className="budget-stat-value">
            {formatIndianCurrency(viewMode === 'monthly' ? monthlyBudget : weeklyBudget)}
          </div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">Total Expenses</div>
          <div className="budget-stat-value expense">{formatIndianCurrency(totalExpenses)}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat-label">Remaining</div>
          <div className="budget-stat-value" style={{ color: remaining >= 0 ? '#10B981' : '#EF4444' }}>
            {formatIndianCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header-budget">
          <span>Budget Utilization</span>
          <span className="progress-percentage-budget">{percentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-budget">
          <div className={`progress-fill-budget ${getProgressColor()}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      {/* Daily Insights */}
      <div className="daily-insight">
        <div className="insight-item">
          <div>
            <div className="insight-label">Daily Spending Allowance</div>
            <div className="insight-value">{formatIndianCurrency(dailySpending)}/day</div>
          </div>
        </div>
        <div className="insight-item">
          <div>
            <div className="insight-label">Days Left in Month</div>
            <div className="insight-value">{daysLeft} days</div>
          </div>
        </div>
        <div className="insight-item">
          <div>
            <div className="insight-label">Projected End Balance</div>
            <div className="insight-value" style={{ color: projectedEndBalance >= 0 ? '#10B981' : '#EF4444' }}>
              {formatIndianCurrency(projectedEndBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tip */}
      <div className="budget-tip">
        <span>{getTip()}</span>
      </div>

      {/* Category Budget Allocation - Customizable */}
      <div className="category-budget-section">
        <div className="category-budget-header-main">
          <h3 className="section-title-budget">Category Budget Allocation</h3>
          <p className="category-budget-subtitle">Click on any budget amount to customize it</p>
        </div>
        <div className="category-budget-list">
          {categories.map(cat => {
            const spent = categorySpending[cat.name] || 0;
            const budgetAmount = categoryBudgets[cat.name];
            const catPercentage = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
            const isEditing = editingCategory === cat.name;
            
            return (
              <div key={cat.name} className="category-budget-item">
                <div className="category-budget-header">
                  <div className="category-budget-info">
                    <span className="category-icon" style={{ background: cat.bg }}>
                      {cat.icon}
                    </span>
                    <div>
                      <div className="category-name">{cat.name}</div>
                      <div className="category-spent">Spent: {formatIndianCurrency(spent)}</div>
                    </div>
                  </div>
                  <div className="category-budget-amount">
                    {isEditing ? (
                      <div className="category-budget-edit">
                        <div className="edit-input-wrapper">
                          <span className="edit-currency">₹</span>
                          <input
                            type="number"
                            className="edit-budget-input"
                            value={tempCategoryBudget}
                            onChange={(e) => setTempCategoryBudget(e.target.value)}
                            onKeyDown={handleKeyPress}
                            autoFocus
                          />
                        </div>
                        <div className="edit-actions">
                          <button className="save-edit-btn" onClick={handleSaveCategoryBudget}>
                            ✓
                          </button>
                          <button className="cancel-edit-btn" onClick={handleCancelEdit}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="budget-limit clickable"
                        onClick={() => handleEditCategoryBudget(cat.name, budgetAmount)}
                        title="Click to edit budget"
                      >
                        <span className="budget-label">Budget:</span>
                        <span className="budget-amount-value">{formatIndianCurrency(budgetAmount)}</span>
                      </div>
                    )}
                    <div className="remaining-budget" style={{ color: budgetAmount - spent >= 0 ? '#10B981' : '#EF4444' }}>
                      {formatIndianCurrency(budgetAmount - spent)} left
                    </div>
                  </div>
                </div>
                <div className="category-progress-bar">
                  <div 
                    className="category-progress-fill" 
                    style={{ 
                      width: `${catPercentage}%`, 
                      background: cat.color,
                      backgroundColor: catPercentage > 100 ? '#EF4444' : cat.color
                    }}
                  ></div>
                </div>
                {catPercentage > 100 && (
                  <div className="category-warning">
                    Exceeded budget by {formatIndianCurrency(spent - budgetAmount)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Reset All Categories Button */}
        <div className="category-actions">
          <button 
            className="reset-categories-btn"
            onClick={() => {
              if (window.confirm('Reset all category budgets to default values?')) {
                const defaultBudgets = {
                  Food: 1000,
                  Transport: 500,
                  Shopping: 500,
                  Entertainment: 400,
                  Bills: 1500,
                  Health: 300,
                  Education: 300,
                  Other: 500
                };
                setCategoryBudgets(defaultBudgets);
                localStorage.setItem('finova_category_budgets', JSON.stringify(defaultBudgets));
              }
            }}
          >
            Reset All Categories
          </button>
        </div>
      </div>

      {/* Savings Input Component */}
      <SavingsInput />

      {/* Spending Tips */}
      <div className="tips-section">
        <h3 className="section-title-budget">Smart Spending Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Food & Dining</h4>
            <p>Cook at home more often. You can save up to 60% compared to eating out.</p>
          </div>
          <div className="tip-card">
            <h4>Transportation</h4>
            <p>Consider public transport or carpooling to reduce fuel costs.</p>
          </div>
          <div className="tip-card">
            <h4>Shopping</h4>
            <p>Wait 24 hours before making non-essential purchases.</p>
          </div>
          <div className="tip-card">
            <h4>Bills & Utilities</h4>
            <p>Switch to energy-efficient appliances to lower electricity bills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;