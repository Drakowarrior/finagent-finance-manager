// src/App.js
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import Calculators from './pages/Calculators';
import About from './pages/About';
import LoadingScreen from './components/LoadingScreen';
import './App.css';
import { FinanceProvider } from "./context/FinanceContext";

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [isLoading, setIsLoading] = useState(true);

  // Set document title for FINAGENT
  useEffect(() => {
    document.title = 'FINAGENT - AI Finance Manager';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'Home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Expenses':
        return <Expenses />;
      case 'Budget':
        return <Budget />;
      case 'Savings':
        return <Savings />;
      case 'Calculators':
        return <Calculators />;
      case 'About':
        return <About />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <FinanceProvider>
      <div className="App">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="page-transition">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </FinanceProvider>
  );
}

export default App;