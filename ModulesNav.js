// src/components/ModulesNav.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModulesNav.css';

const ModulesNav = () => {
  const navigate = useNavigate();

  const modules = [
    
    { name: 'Transport', emoji: '🚗', route: '/transport' },
    { name: 'Waste', emoji: '🗑', route: '/waste' },
    { name: 'Diet', emoji: '🍽', route: '/diet' },
    { name: 'Energy', emoji: '⚡', route: '/energy' },
    { name: 'Electricity', emoji: '💡', route: '/electricity' },
    
  ];

  return (
    <div className="modules-nav-wrapper">
      <div className="modules-nav">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="module-card"
            onClick={() => navigate(mod.route)}
          >
            <div className="icon-circle">{mod.emoji}</div>
            <span className="label">{mod.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesNav;