import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, QrCode } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const HeaderContainer = styled.header`
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-md) 0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.5rem;
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    gap: var(--spacing-sm);
  }
`;

const NavLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }
  
  &.active {
    color: var(--accent-primary);
    background-color: rgba(0, 212, 170, 0.1);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }
`;

const ScanButton = styled(Link)`
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    span {
      display: none;
    }
  }
`;

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>B</LogoIcon>
          <span>Barback</span>
        </Logo>
        
        <Nav>
          <NavLink 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </NavLink>
          
          <ThemeToggle onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggle>
          
          <ScanButton to="/scan">
            <QrCode size={20} />
            <span>Scan QR</span>
          </ScanButton>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;