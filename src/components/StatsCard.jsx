// src/components/StatsCard.jsx
import React, { useState, useEffect } from 'react';
import './StatsCard.css';

const StatsCard = ({ 
  title, 
  value, 
  color, 
  bgColor, 
  change, 
  changeType = 'positive',
  prefix = '₹',
  suffix = '',
  animate = false,
  onClick = null
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  // Removed animation for cleaner look
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatValue = () => {
    if (suffix === '%') {
      return `${displayValue.toFixed(1)}${suffix}`;
    }
    if (prefix === '₹') {
      return `${prefix} ${displayValue.toLocaleString('en-IN')}${suffix}`;
    }
    return `${prefix}${displayValue.toLocaleString('en-IN')}${suffix}`;
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return '#10B981';
    if (changeType === 'negative') return '#EF4444';
    return '#64748B';
  };

  return (
    <div 
      className={`stats-card ${onClick ? 'clickable' : ''}`}
      style={{ 
        background: bgColor || 'white',
        borderLeft: `4px solid ${color}`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="stats-card-header">
        <h3 className="stats-title">{title}</h3>
      </div>
      
      <div className="stats-value" style={{ color: color }}>
        {formatValue()}
      </div>
      
      {change && (
        <div className="stats-change">
          <span style={{ color: getChangeColor() }}>{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;