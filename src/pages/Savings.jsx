// src/pages/Savings.jsx
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import SavingsInput from '../components/SavingsInput';
import StatsCard from '../components/StatsCard';
import './Savings.css';

const Savings = () => {
  const { savings, budget, expenses } = useFinance();
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const potentialSavings = budget - totalExpenses;
  const savingsRate = budget > 0 ? (savings / budget) * 100 : 0;

  return (
    <div className="savings-page">
      <div className="savings-page-header">
        <h1>Savings Tracker</h1>
        <p>Track and achieve your savings goals</p>
      </div>

      <div className="savings-stats-grid">
        <StatsCard
          title="Current Savings"
          value={savings}
          color="#8B5CF6"
          bgColor="#EDE9FE"
          change="Monthly goal"
          changeType="neutral"
          prefix="₹"
        />
        
        <StatsCard
          title="Potential Savings"
          value={Math.max(0, potentialSavings)}
          color="#10B981"
          bgColor="#D1FAE5"
          change="Based on budget vs expenses"
          changeType="positive"
          prefix="₹"
        />
        
        <StatsCard
          title="Savings Rate"
          value={savingsRate}
          color="#F59E0B"
          bgColor="#FEF3C7"
          suffix="%"
          change="Target: 20%"
          changeType={savingsRate >= 20 ? "positive" : "negative"}
        />
      </div>

      <SavingsInput />
      
      <div className="savings-tips">
        <h3>Tips to Increase Savings</h3>
        <ul>
          <li>Track all your expenses for one month</li>
          <li>Cook at home instead of eating out</li>
          <li>Use public transportation when possible</li>
          <li>Unplug electronics when not in use</li>
          <li>Automate your savings transfers</li>
        </ul>
      </div>
    </div>
  );
};

export default Savings;