import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, BarChart3, Users, Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: var(--accent-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const Navigation = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  width: 100%;
`;

const NavCard = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--accent-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const NavText = styled.div``;

const NavTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const NavDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ThemeToggle = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }
`;

const UserInfo = styled.div`
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
`;

const UserDetails = styled.div`
  font-size: 0.9rem;
`;

const UserName = styled.div`
  font-weight: 600;
`;

const UserRole = styled.div`
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--error-color);
    background: rgba(255, 107, 107, 0.1);
  }
`;

const HomePage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', !isDark ? 'dark' : 'light');
  };

  return (
    <Container>
      {isAuthenticated && user && (
        <UserInfo>
          <User size={20} />
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserRole>{user.role}</UserRole>
          </UserDetails>
          <LogoutButton onClick={logout} title="Logout">
            <LogOut size={18} />
          </LogoutButton>
        </UserInfo>
      )}
      
      <ThemeToggle onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </ThemeToggle>
      
      <Header>
        <Logo>B</Logo>
        <Title>Barback</Title>
        <Subtitle>
          Checkout-free bar tab platform. Streamline operations with QR codes, 
          real-time dashboards, and seamless payment processing.
        </Subtitle>
      </Header>

      <Navigation>
        <NavCard href="/admin/demo-venue">
          <NavContent>
            <NavIcon>
              <BarChart3 size={24} />
            </NavIcon>
            <NavText>
              <NavTitle>Admin Dashboard</NavTitle>
              <NavDescription>Venue management, staff, menu & analytics</NavDescription>
            </NavText>
          </NavContent>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </NavCard>

        <NavCard href="/bartender/demo-venue">
          <NavContent>
            <NavIcon>
              <Users size={24} />
            </NavIcon>
            <NavText>
              <NavTitle>Bartender Dashboard</NavTitle>
              <NavDescription>Manage active sessions & customer tabs</NavDescription>
            </NavText>
          </NavContent>
          <ChevronRight size={20} color="var(--text-secondary)" />
        </NavCard>
      </Navigation>
    </Container>
  );
};

export default HomePage;