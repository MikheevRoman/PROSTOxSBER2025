import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, showBackButton = false, actionButton = null }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="header">
      <div className="header-left">
        {showBackButton && (
          <button className="back-button" onClick={handleBack}>
            ←
          </button>
        )}
        <h1 className="header-title">{title}</h1>
      </div>
      {actionButton && (
        <div className="header-right">
          {actionButton}
        </div>
      )}
    </header>
  );
};

export default Header; 