import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${props => props.noPadding ? '0' : 'var(--spacing-md)'};
  
  @media (max-width: 768px) {
    padding: ${props => props.noPadding ? '0' : 'var(--spacing-sm)'};
  }
`;

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Routes that don't need header or padding
  const fullScreenRoutes = ['/scan', '/payment', '/receipt'];
  const isFullScreen = fullScreenRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  // Dashboard routes need different layout
  const isDashboard = location.pathname.includes('/bartender') || 
                     location.pathname.includes('/owner');

  return (
    <LayoutContainer>
      {!isFullScreen && <Header />}
      <MainContent noPadding={isFullScreen || isDashboard}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;