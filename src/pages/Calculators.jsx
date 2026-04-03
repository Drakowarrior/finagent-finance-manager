// src/pages/Calculators.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Calculators.css';

const Calculators = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Basic Calculator State
  const [basicDisplay, setBasicDisplay] = useState('');
  const [basicResult, setBasicResult] = useState('0');
  const [basicHistory, setBasicHistory] = useState([]);
  
  // Scientific Calculator State
  const [sciDisplay, setSciDisplay] = useState('');
  const [sciResult, setSciResult] = useState('0');
  const [sciHistory, setSciHistory] = useState([]);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanYears, setLoanYears] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipMaturity, setSipMaturity] = useState(0);
  const [sipInvested, setSipInvested] = useState(0);
  const [sipReturns, setSipReturns] = useState(0);
  
  // FD Calculator State
  const [fdAmount, setFdAmount] = useState(100000);
  const [fdYears, setFdYears] = useState(5);
  const [fdRate, setFdRate] = useState(7);
  const [fdMaturity, setFdMaturity] = useState(0);
  const [fdInterest, setFdInterest] = useState(0);

  // Basic Calculator Functions
  const handleBasicClick = useCallback((value) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(basicDisplay).toString();
        setBasicResult(result);
        setBasicHistory(prev => [{ expression: basicDisplay, result }, ...prev].slice(0, 10));
        setBasicDisplay(result);
      } catch {
        setBasicResult('Error');
        setBasicDisplay('');
      }
    } else if (value === 'C') {
      setBasicDisplay('');
      setBasicResult('0');
    } else if (value === '⌫') {
      setBasicDisplay(basicDisplay.slice(0, -1));
    } else if (value === '%') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(basicDisplay + '/100');
        setBasicDisplay(result.toString());
      } catch {
        setBasicDisplay('');
      }
    } else {
      setBasicDisplay(basicDisplay + value);
    }
  }, [basicDisplay]);

  // Scientific Calculator Functions
  const handleSciClick = useCallback((value) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(sciDisplay).toString();
        setSciResult(result);
        setSciHistory(prev => [{ expression: sciDisplay, result }, ...prev].slice(0, 10));
        setSciDisplay(result);
      } catch {
        setSciResult('Error');
        setSciDisplay('');
      }
    } else if (value === 'C') {
      setSciDisplay('');
      setSciResult('0');
    } else if (value === '⌫') {
      setSciDisplay(sciDisplay.slice(0, -1));
    } else if (value === 'sin') {
      setSciDisplay(`Math.sin(${sciDisplay || 0} * Math.PI / 180)`);
    } else if (value === 'cos') {
      setSciDisplay(`Math.cos(${sciDisplay || 0} * Math.PI / 180)`);
    } else if (value === 'tan') {
      setSciDisplay(`Math.tan(${sciDisplay || 0} * Math.PI / 180)`);
    } else if (value === 'log') {
      setSciDisplay(`Math.log10(${sciDisplay || 1})`);
    } else if (value === 'ln') {
      setSciDisplay(`Math.log(${sciDisplay || 1})`);
    } else if (value === '√') {
      setSciDisplay(`Math.sqrt(${sciDisplay || 0})`);
    } else if (value === 'π') {
      setSciDisplay(sciDisplay + Math.PI);
    } else if (value === 'e') {
      setSciDisplay(sciDisplay + Math.E);
    } else if (value === '^') {
      setSciDisplay(`${sciDisplay}**`);
    } else if (value === '(' || value === ')') {
      setSciDisplay(sciDisplay + value);
    } else {
      setSciDisplay(sciDisplay + value);
    }
  }, [sciDisplay]);

  // EMI Calculation
  const calculateEMI = useCallback(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanYears * 12;
    if (r === 0) {
      const emiValue = P / n;
      setEmi(emiValue);
      setTotalPayment(emiValue * n);
      setTotalInterest(0);
    } else {
      const emiValue = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      setEmi(emiValue);
      const total = emiValue * n;
      setTotalPayment(total);
      setTotalInterest(total - P);
    }
  }, [loanAmount, interestRate, loanYears]);

  // SIP Calculation
  const calculateSIP = useCallback(() => {
    const P = sipAmount;
    const r = sipReturn / 12 / 100;
    const n = sipYears * 12;
    const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setSipMaturity(maturity);
    setSipInvested(P * n);
    setSipReturns(maturity - (P * n));
  }, [sipAmount, sipYears, sipReturn]);

  // FD Calculation
  const calculateFD = useCallback(() => {
    const P = fdAmount;
    const r = fdRate / 100;
    const n = fdYears;
    const maturity = P * Math.pow(1 + r, n);
    setFdMaturity(maturity);
    setFdInterest(maturity - P);
  }, [fdAmount, fdYears, fdRate]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  useEffect(() => {
    calculateSIP();
  }, [calculateSIP]);

  useEffect(() => {
    calculateFD();
  }, [calculateFD]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeTab === 'basic') {
        if (e.key >= '0' && e.key <= '9') handleBasicClick(e.key);
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') handleBasicClick(e.key);
        if (e.key === '.') handleBasicClick('.');
        if (e.key === 'Enter') handleBasicClick('=');
        if (e.key === 'Escape') handleBasicClick('C');
        if (e.key === 'Backspace') handleBasicClick('⌫');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, handleBasicClick]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculators = [
    { id: 'basic', name: 'Basic'},
    { id: 'scientific', name: 'Scientific'},
    { id: 'emi', name: 'EMI'},
    { id: 'sip', name: 'SIP'},
    { id: 'fd', name: 'FD'}
  ];

  return (
    <div className="calculators">
      <div className="calculators-header">
        <div>
          <h1 className="calculators-title">Smart Calculators</h1>
          <p className="calculators-subtitle">Powerful financial tools at your fingertips</p>
        </div>
      </div>

      <div className="calculator-tabs">
        {calculators.map(calc => (
          <button
            key={calc.id}
            className={`tab-btn ${activeTab === calc.id ? 'active' : ''}`}
            onClick={() => setActiveTab(calc.id)}
          >
            <span className="tab-icon">{calc.icon}</span>
            <span>{calc.name}</span>
          </button>
        ))}
      </div>

      <div className="calculator-panel">
        {/* Basic Calculator */}
        {activeTab === 'basic' && (
          <div className="basic-calculator">
            <div className="calculator-display">
              <div className="calculator-expression">{basicDisplay || '0'}</div>
              <div className="calculator-result">{basicResult}</div>
            </div>
            
            {basicHistory.length > 0 && (
              <div className="calculator-history">
                <div className="history-header">Recent Calculations</div>
                {basicHistory.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="history-item" onClick={() => setBasicDisplay(item.expression)}>
                    {item.expression} = {item.result}
                  </div>
                ))}
              </div>
            )}
            
            <div className="calculator-buttons">
              <button className="calc-btn clear" onClick={() => handleBasicClick('C')}>C</button>
              <button className="calc-btn" onClick={() => handleBasicClick('⌫')}>⌫</button>
              <button className="calc-btn" onClick={() => handleBasicClick('%')}>%</button>
              <button className="calc-btn operator" onClick={() => handleBasicClick('/')}>÷</button>
              
              <button className="calc-btn" onClick={() => handleBasicClick('7')}>7</button>
              <button className="calc-btn" onClick={() => handleBasicClick('8')}>8</button>
              <button className="calc-btn" onClick={() => handleBasicClick('9')}>9</button>
              <button className="calc-btn operator" onClick={() => handleBasicClick('*')}>×</button>
              
              <button className="calc-btn" onClick={() => handleBasicClick('4')}>4</button>
              <button className="calc-btn" onClick={() => handleBasicClick('5')}>5</button>
              <button className="calc-btn" onClick={() => handleBasicClick('6')}>6</button>
              <button className="calc-btn operator" onClick={() => handleBasicClick('-')}>-</button>
              
              <button className="calc-btn" onClick={() => handleBasicClick('1')}>1</button>
              <button className="calc-btn" onClick={() => handleBasicClick('2')}>2</button>
              <button className="calc-btn" onClick={() => handleBasicClick('3')}>3</button>
              <button className="calc-btn operator" onClick={() => handleBasicClick('+')}>+</button>
              
              <button className="calc-btn" onClick={() => handleBasicClick('0')}>0</button>
              <button className="calc-btn" onClick={() => handleBasicClick('.')}>.</button>
              <button className="calc-btn equals" onClick={() => handleBasicClick('=')}>=</button>
            </div>
          </div>
        )}

        {/* Scientific Calculator */}
        {activeTab === 'scientific' && (
          <div className="scientific-calculator">
            <div className="calculator-display">
              <div className="calculator-expression">{sciDisplay || '0'}</div>
              <div className="calculator-result">{sciResult}</div>
            </div>
            
            {sciHistory.length > 0 && (
              <div className="calculator-history">
                <div className="history-header">Recent Calculations</div>
                {sciHistory.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="history-item" onClick={() => setSciDisplay(item.expression)}>
                    {item.expression} = {item.result}
                  </div>
                ))}
              </div>
            )}
            
            <div className="scientific-buttons">
              <button className="calc-btn sci" onClick={() => handleSciClick('sin')}>sin</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('cos')}>cos</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('tan')}>tan</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('log')}>log</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('ln')}>ln</button>
              
              <button className="calc-btn sci" onClick={() => handleSciClick('√')}>√</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('π')}>π</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('e')}>e</button>
              <button className="calc-btn sci" onClick={() => handleSciClick('^')}>xʸ</button>
              <button className="calc-btn clear" onClick={() => handleSciClick('C')}>C</button>
              
              <button className="calc-btn" onClick={() => handleSciClick('7')}>7</button>
              <button className="calc-btn" onClick={() => handleSciClick('8')}>8</button>
              <button className="calc-btn" onClick={() => handleSciClick('9')}>9</button>
              <button className="calc-btn operator" onClick={() => handleSciClick('/')}>÷</button>
              <button className="calc-btn" onClick={() => handleSciClick('⌫')}>⌫</button>
              
              <button className="calc-btn" onClick={() => handleSciClick('4')}>4</button>
              <button className="calc-btn" onClick={() => handleSciClick('5')}>5</button>
              <button className="calc-btn" onClick={() => handleSciClick('6')}>6</button>
              <button className="calc-btn operator" onClick={() => handleSciClick('*')}>×</button>
              <button className="calc-btn" onClick={() => handleSciClick('(')}>(</button>
              
              <button className="calc-btn" onClick={() => handleSciClick('1')}>1</button>
              <button className="calc-btn" onClick={() => handleSciClick('2')}>2</button>
              <button className="calc-btn" onClick={() => handleSciClick('3')}>3</button>
              <button className="calc-btn operator" onClick={() => handleSciClick('-')}>-</button>
              <button className="calc-btn" onClick={() => handleSciClick(')')}>)</button>
              
              <button className="calc-btn" onClick={() => handleSciClick('0')}>0</button>
              <button className="calc-btn" onClick={() => handleSciClick('.')}>.</button>
              <button className="calc-btn equals" onClick={() => handleSciClick('=')}>=</button>
              <button className="calc-btn operator" onClick={() => handleSciClick('+')}>+</button>
            </div>
          </div>
        )}

        {/* EMI Calculator */}
        {activeTab === 'emi' && (
          <div className="emi-calculator">
            <div className="calculator-input-group">
              <label>Loan Amount</label>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
              <div className="input-value">{formatCurrency(loanAmount)}</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Interest Rate (% p.a.)</label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <div className="input-value">{interestRate}%</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Loan Tenure (Years)</label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
              />
              <div className="input-value">{loanYears} years ({loanYears * 12} months)</div>
            </div>
            
            <div className="emi-results">
              <div className="result-card">
                <div className="result-label">Monthly EMI</div>
                <div className="result-value large">{formatCurrency(emi)}</div>
              </div>
              <div className="results-grid">
                <div className="result-card small">
                  <div className="result-label">Total Payment</div>
                  <div className="result-value">{formatCurrency(totalPayment)}</div>
                </div>
                <div className="result-card small">
                  <div className="result-label">Total Interest</div>
                  <div className="result-value">{formatCurrency(totalInterest)}</div>
                </div>
              </div>
            </div>
            
            <div className="loan-summary">
              <div className="summary-bar">
                <div className="bar-principal" style={{ width: `${(loanAmount / totalPayment) * 100}%` }}></div>
                <div className="bar-interest" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
              </div>
              <div className="summary-legend">
                <span><span className="legend-principal"></span> Principal</span>
                <span><span className="legend-interest"></span> Interest</span>
              </div>
            </div>
          </div>
        )}

        {/* SIP Calculator */}
        {activeTab === 'sip' && (
          <div className="sip-calculator">
            <div className="calculator-input-group">
              <label>Monthly Investment</label>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
              />
              <div className="input-value">{formatCurrency(sipAmount)}</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Time Period (Years)</label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
              />
              <div className="input-value">{sipYears} years</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Expected Return (% p.a.)</label>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={sipReturn}
                onChange={(e) => setSipReturn(Number(e.target.value))}
              />
              <div className="input-value">{sipReturn}%</div>
            </div>
            
            <div className="sip-results">
              <div className="result-card">
                <div className="result-label">Maturity Value</div>
                <div className="result-value large">{formatCurrency(sipMaturity)}</div>
              </div>
              <div className="results-grid">
                <div className="result-card small">
                  <div className="result-label">Total Invested</div>
                  <div className="result-value">{formatCurrency(sipInvested)}</div>
                </div>
                <div className="result-card small">
                  <div className="result-label">Wealth Gained</div>
                  <div className="result-value profit">{formatCurrency(sipReturns)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FD Calculator */}
        {activeTab === 'fd' && (
          <div className="fd-calculator">
            <div className="calculator-input-group">
              <label>Principal Amount</label>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={fdAmount}
                onChange={(e) => setFdAmount(Number(e.target.value))}
              />
              <div className="input-value">{formatCurrency(fdAmount)}</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Time Period (Years)</label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={fdYears}
                onChange={(e) => setFdYears(Number(e.target.value))}
              />
              <div className="input-value">{fdYears} years</div>
            </div>
            
            <div className="calculator-input-group">
              <label>Interest Rate (% p.a.)</label>
              <input
                type="range"
                min="3"
                max="12"
                step="0.25"
                value={fdRate}
                onChange={(e) => setFdRate(Number(e.target.value))}
              />
              <div className="input-value">{fdRate}%</div>
            </div>
            
            <div className="fd-results">
              <div className="result-card">
                <div className="result-label">Maturity Amount</div>
                <div className="result-value large">{formatCurrency(fdMaturity)}</div>
              </div>
              <div className="results-grid">
                <div className="result-card small">
                  <div className="result-label">Total Interest</div>
                  <div className="result-value">{formatCurrency(fdInterest)}</div>
                </div>
                <div className="result-card small">
                  <div className="result-label">Effective Yield</div>
                  <div className="result-value">{(((Math.pow(fdMaturity / fdAmount, 1/fdYears) - 1) * 100).toFixed(2))}%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculators;