// src/pages/Expenses.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from "../context/FinanceContext";
import './Expenses.css';

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useFinance();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

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

  // REMOVED: localStorage loading useEffect (Context handles this)
  
  // Filter, sort, and calculate statistics
  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...expenses];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.note && exp.note.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredExpenses(filtered);
    
    // Calculate statistics
    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalExpenses(total);
    setAverageExpense(filtered.length > 0 ? total / filtered.length : 0);
    
  }, [expenses, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    if (editingExpense) {
      // Edit existing expense - FIXED: Use updateExpense from Context
      updateExpense({
        ...newExpense,
        id: editingExpense.id,
        amount: parseFloat(newExpense.amount),
      });
      setEditingExpense(null);
    } else {
      // Add new expense - FIXED: Use addExpense from Context
      const expense = {
        ...newExpense,
        id: Date.now(),
        amount: parseFloat(newExpense.amount)
      };
      addExpense(expense);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      note: expense.note || ''
    });
    setShowModal(true);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const resetForm = () => {
    setNewExpense({
      name: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setEditingExpense(null);
  };

  const getCategoryDetails = (categoryName) => {
    return categories.find(c => c.name === categoryName) || categories[categories.length - 1];
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

  const getTotalByCategory = () => {
    const totals = {};
    filteredExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  return (
    <div className="expenses">
      <div className="expenses-header">
        <div>
          <h1 className="expenses-title">Expense Manager</h1>
          <p className="expenses-subtitle">Track and manage all your expenses</p>
        </div>
        <button className="add-expense-btn ripple" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <span>+</span> Add Expense
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="expense-stats">
        <div className="stat-card-mini">
          <div className="stat-info-mini">
            <span className="stat-label-mini">Total Expenses</span>
            <span className="stat-value-mini">{formatIndianCurrency(totalExpenses)}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-info-mini">
            <span className="stat-label-mini">Average Expense</span>
            <span className="stat-value-mini">{formatIndianCurrency(averageExpense)}</span>
          </div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-info-mini">
            <span className="stat-label-mini">Total Transactions</span>
            <span className="stat-value-mini">{filteredExpenses.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        
        <div className="filter-group">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          
          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="filter-select"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="category-filters">
        <button 
          className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.name}
            className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
            style={{ '--chip-color': cat.color }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Expenses List */}
      <div className="expenses-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state-expenses">
            <h3>No expenses found</h3>
            <p>{expenses.length === 0 ? 'Start by adding your first expense!' : 'Try changing your search or filters'}</p>
            {expenses.length === 0 && (
              <button className="add-first-btn" onClick={() => setShowModal(true)}>
                + Add Your First Expense
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Category Totals Summary */}
            {Object.keys(categoryTotals).length > 0 && selectedCategory === 'all' && (
              <div className="category-summary">
                <h4>Spending by Category</h4>
                <div className="summary-bars">
                  {Object.entries(categoryTotals).map(([cat, amount]) => {
                    const percentage = (amount / totalExpenses) * 100;
                    const catDetails = getCategoryDetails(cat);
                    return (
                      <div key={cat} className="summary-item">
                        <div className="summary-label">
                          <span>{catDetails.icon} {cat}</span>
                          <span>{formatIndianCurrency(amount)} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="summary-bar-bg">
                          <div className="summary-bar-fill" style={{ width: `${percentage}%`, background: catDetails.color }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Transaction List */}
            {filteredExpenses.map((expense, index) => {
              const category = getCategoryDetails(expense.category);
              return (
                <div key={expense.id} className="expense-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="expense-info">
                    <div className="category-badge" style={{ background: category.bg }}>
                      {category.icon}
                    </div>
                    <div className="expense-details">
                      <h3>{expense.name}</h3>
                      <div className="expense-meta">
                        <span className="expense-category" style={{ color: category.color }}>
                          {expense.category}
                        </span>
                        <span className="expense-date">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {expense.note && (
                          <span className="expense-note">📝 {expense.note}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="expense-actions">
                    <div className="expense-amount">-{formatIndianCurrency(expense.amount)}</div>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEditExpense(expense)}>
                        ✏️
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          resetForm();
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button className="modal-close" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>✕</button>
            </div>
            
            <div className="form-group">
              <label>Expense Name *</label>
              <input
                type="text"
                placeholder="e.g., Groceries, Uber, Netflix..."
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                autoFocus
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Amount *</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea
                placeholder="Add a note about this expense..."
                value={newExpense.note}
                onChange={(e) => setNewExpense({...newExpense, note: e.target.value})}
                rows="2"
              />
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>Cancel</button>
              <button className="submit-btn" onClick={handleAddExpense}>
                {editingExpense ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;