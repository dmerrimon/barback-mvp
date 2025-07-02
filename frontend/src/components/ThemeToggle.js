import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--bg-hover);
    border-color: var(--accent-primary);
  }
  
  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
`;

const ThemeToggle = ({ size = 20, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton 
      onClick={toggleTheme}
      className={className}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={size} /> : <Moon size={size} />}
    </ToggleButton>
  );
};

export default ThemeToggle;