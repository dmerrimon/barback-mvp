import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled.div`
  width: ${props => props.size === 'large' ? '48px' : props.size === 'medium' ? '32px' : '24px'};
  height: ${props => props.size === 'large' ? '48px' : props.size === 'medium' ? '32px' : '24px'};
  background-image: var(--logo-url);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.3s ease;
`;

const LogoText = styled.span`
  font-size: ${props => props.size === 'large' ? '1.75rem' : props.size === 'medium' ? '1.25rem' : '1rem'};
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
`;

const Logo = ({ 
  size = 'medium', 
  showText = true, 
  className = '',
  onClick = null 
}) => {
  return (
    <LogoContainer className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <LogoImage size={size} className="logo" />
      {showText && <LogoText size={size}>Barback</LogoText>}
    </LogoContainer>
  );
};

export default Logo;