// src/context/FinanceContext.jsx - Updated with default budget = 0
import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  
  // Budget and Savings states with default value 0
  const [budget, setBudget] = useState(0); // Default budget: ₹0
  const [savings, setSavings] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const storedExpenses = localStorage.getItem('finova_expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
    
    const storedIncomes = localStorage.getItem('finova_incomes');
    if (storedIncomes) {
      setIncomes(JSON.parse(storedIncomes));
    }
    
    const storedGoals = localStorage.getItem('finova_goals');
    if (storedGoals) {
      setSavingsGoals(JSON.parse(storedGoals));
    }
    
    // Load budget and savings from localStorage
    const storedBudget = localStorage.getItem('finova_budget');
    if (storedBudget) {
      setBudget(JSON.parse(storedBudget));
    } else {
      // If no budget in localStorage, set default 0
      setBudget(0);
      localStorage.setItem('finova_budget', JSON.stringify(0));
    }
    
    const storedSavings = localStorage.getItem('finova_savings');
    if (storedSavings) {
      setSavings(JSON.parse(storedSavings));
    } else {
      setSavings(0);
      localStorage.setItem('finova_savings', JSON.stringify(0));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finova_expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem('finova_incomes', JSON.stringify(incomes));
  }, [incomes]);
  
  useEffect(() => {
    localStorage.setItem('finova_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);
  
  // Save budget and savings
  useEffect(() => {
    localStorage.setItem('finova_budget', JSON.stringify(budget));
  }, [budget]);
  
  useEffect(() => {
    localStorage.setItem('finova_savings', JSON.stringify(savings));
  }, [savings]);

  // Calculate total income
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate net savings (income - expenses + saved amount)
  const netSavings = totalIncome - totalExpenses + savings;

  // Expense CRUD operations
  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Income CRUD operations
  const addIncome = (income) => {
    setIncomes([income, ...incomes]);
  };

  const updateIncome = (updatedIncome) => {
    setIncomes(incomes.map(inc => 
      inc.id === updatedIncome.id ? updatedIncome : inc
    ));
  };

  const deleteIncome = (id) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  // Savings Goals CRUD operations
  const addSavingsGoal = (goal) => {
    setSavingsGoals([goal, ...savingsGoals]);
  };

  const updateSavingsGoal = (updatedGoal) => {
    setSavingsGoals(savingsGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
  };

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  // Budget & Savings functions
  const updateBudget = (value) => {
    const newBudget = Number(value);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
    }
  };

  const updateSavings = (value) => {
    const newSavings = Number(value);
    if (!isNaN(newSavings) && newSavings >= 0) {
      setSavings(newSavings);
    }
  };

  const value = {
    // Existing
    expenses,
    incomes,
    savingsGoals,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    
    // Budget & Savings
    budget,
    savings,
    updateBudget,
    updateSavings,
    
    // Computed values
    totalIncome,
    totalExpenses,
    netSavings,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};