// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

const Dashboard = () => {
  const { expenses, budget, savings } = useFinance();
  
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(savings);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [categoryTotals, setCategoryTotals] = useState({});

  // Sync currentSavings with savings from context
  useEffect(() => {
    setCurrentSavings(savings);
  }, [savings]);

  // Calculate expenses based on selected period
  useEffect(() => {
    const now = new Date();
    const filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (selectedPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return expDate >= weekAgo;
      } else if (selectedPeriod === 'month') {
        return expDate.getMonth() === now.getMonth() &&
               expDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
    
    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    setMonthlyExpenses(total);
    
    // Calculate category totals for filtered expenses
    const totals = {};
    filtered.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    setCategoryTotals(totals);
    
    // Calculate total balance (simplified: income - expenses + savings)
    setTotalBalance(Math.max(0, budget - total + savings));
    
  }, [expenses, selectedPeriod, budget, savings]);

  // Format currency in Indian Rupees
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryStyle = (categoryName) => {
    const categories = [
      { name: 'Food', color: '#F59E0B', bg: '#FEF3C7' },
      { name: 'Transport', color: '#10B981', bg: '#D1FAE5' },
      { name: 'Shopping', color: '#EF4444', bg: '#FEE2E2' },
      { name: 'Entertainment', color: '#8B5CF6', bg: '#EDE9FE' },
      { name: 'Bills', color: '#06B6D4', bg: '#CFFAFE' },
      { name: 'Health', color: '#EC4899', bg: '#FCE7F3' },
      { name: 'Education', color: '#14B8A6', bg: '#CCFBF1' },
      { name: 'Other', color: '#64748B', bg: '#F1F5F9' }
    ];
    const cat = categories.find(c => c.name === categoryName);
    return cat || categories[categories.length - 1];
  };

  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const expensePercentage = budget > 0 ? Math.min((monthlyExpenses / budget) * 100, 100) : 0;
  const savingsPercentage = budget > 0 ? Math.min((currentSavings / budget) * 100, 100) : 0;
  const remaining = budget - monthlyExpenses;

  const spendingInsights = () => {
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > monthlyExpenses * 0.4) {
      return `Your ${topCategory[0]} spending is ${Math.round((topCategory[1] / monthlyExpenses) * 100)}% of total expenses. Consider reviewing this category.`;
    }
    if (savingsPercentage < 20 && budget > 0) {
      return "Your savings rate is below 20 percent. Try to reduce unnecessary expenses.";
    }
    if (remaining < 0) {
      return "Warning: You are overspending. Review your budget and expenses immediately.";
    }
    return "Great job. You are maintaining a healthy savings rate. Keep it up.";
  };

  // Simple chart without library
  const chartPercentage = budget > 0 ? (monthlyExpenses / budget) * 100 : 0;

  return (
    <div className="dashboard">
      {/* Header with period selector */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Financial Dashboard</h1>
          <p className="dashboard-subtitle">Track your finances at a glance</p>
        </div>
        <div className="period-selector">
          <button className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`} onClick={() => setSelectedPeriod('week')}>
            Week
          </button>
          <button className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`} onClick={() => setSelectedPeriod('month')}>
            Month
          </button>
          <button className={`period-btn ${selectedPeriod === 'all' ? 'active' : ''}`} onClick={() => setSelectedPeriod('all')}>
            All Time
          </button>
        </div>
      </div>

      {/* Main Stats Cards - Using StatsCard Component */}
      <div className="stats-grid-dash">
        <StatsCard
          title="Total Balance"
          value={totalBalance}
          color="#4F46E5"
          bgColor="#EEF2FF"
          change={`+${savingsPercentage.toFixed(1)}% savings rate`}
          changeType="positive"
          prefix="₹"
        />
        
        <StatsCard
          title="Monthly Expenses"
          value={monthlyExpenses}
          color="#EF4444"
          bgColor="#FEF2F2"
          change={`${expensePercentage.toFixed(1)}% of budget`}
          changeType="negative"
          prefix="₹"
        />
        
        <StatsCard
          title="Savings"
          value={currentSavings}
          color="#10B981"
          bgColor="#ECFDF5"
          change={`${savingsPercentage.toFixed(1)}% savings rate`}
          changeType="positive"
          prefix="₹"
        />
      </div>

      {/* Progress Section with Simple Chart */}
      <div className="progress-section-dash">
        <div className="progress-card">
          <div className="progress-header">
            <span>Budget Utilization</span>
            <span className="progress-percentage">{expensePercentage.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-fill-main" 
              style={{ 
                width: `${chartPercentage}%`, 
                background: chartPercentage > 100 ? '#EF4444' : '#4F46E5'
              }}
            ></div>
          </div>
          <div className="progress-footer">
            <span>Budget: {formatIndianCurrency(budget)}</span>
            <span style={{ color: remaining >= 0 ? '#10B981' : '#EF4444' }}>
              Remaining: {formatIndianCurrency(remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Warning System */}
      {remaining < 0 && (
        <div className="warning-card">
          <div className="warning-icon">!</div>
          <div>
            <h4 className="warning-title">Overspending Alert</h4>
            <p className="warning-message">
              You have exceeded your budget by {formatIndianCurrency(Math.abs(remaining))}. Review your expenses immediately.
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown & Recent Transactions */}
      <div className="dashboard-two-column">
        {/* Category Breakdown */}
        <div className="category-section">
          <h3 className="section-title-dash">Spending by Category</h3>
          <div className="category-list">
            {Object.keys(categoryTotals).length === 0 ? (
              <p className="empty-state">No expenses yet. Add some to see breakdown.</p>
            ) : (
              Object.entries(categoryTotals).map(([categoryName, amount]) => {
                const category = getCategoryStyle(categoryName);
                const percentage = monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0;
                return (
                  <div key={categoryName} className="category-item">
                    <div className="category-info">
                      <div className="category-details">
                        <span className="category-name">{categoryName}</span>
                        <span className="category-amount">{formatIndianCurrency(amount)}</span>
                      </div>
                      <span className="category-percent">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="category-bar">
                      <div className="category-bar-fill" style={{ width: `${percentage}%`, background: category.color }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h3 className="section-title-dash">Recent Transactions</h3>
            <button 
              className="view-all-btn" 
              onClick={() => {
                const expenseButtons = document.querySelectorAll('.nav-item');
                expenseButtons.forEach(btn => {
                  if (btn.textContent.includes('Expenses')) {
                    btn.click();
                  }
                });
              }}
            >
              View All →
            </button>
          </div>
          <div className="transaction-list-dash">
            {recentTransactions.length === 0 ? (
              <div className="empty-state-transactions">
                <p>No transactions yet</p>
                <button 
                  className="add-transaction-btn"
                  onClick={() => {
                    const addExpenseBtn = document.querySelector('.add-expense-btn');
                    if (addExpenseBtn) addExpenseBtn.click();
                  }}
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => {
                return (
                  <div key={transaction.id || index} className="transaction-item-dash">
                    <div className="transaction-details-dash">
                      <div className="transaction-name">{transaction.name}</div>
                      <div className="transaction-meta">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="transaction-amount-dash negative">
                      -{formatIndianCurrency(transaction.amount)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Insights Card */}
      <div className="insights-card">
        <div className="insights-content">
          <h4>Smart Insight</h4>
          <p>{spendingInsights()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn" onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          View Reports
        </button>
      </div>
    </div>
  );
};

export default Dashboard;