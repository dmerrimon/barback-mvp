import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { email: string; password: string; role: string }) => void;
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: var(--accent-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const Title = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: var(--bg-card);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: var(--bg-card);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DemoCredentials = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
`;

const DemoTitle = styled.h3`
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const DemoRole = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({ email, password, role });
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoRole: string, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setRole(demoRole);
  };

  return (
    <Container>
      <LoginCard>
        <LogoContainer>
          <Logo>B</Logo>
          <Title>Barback</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </LogoContainer>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email Address</Label>
            <InputContainer>
              <InputIcon>
                <User size={18} />
              </InputIcon>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputContainer>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Role</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="bartender">Bartender</option>
              <option value="server">Server</option>
            </Select>
          </FormGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </LoginButton>
        </Form>

        <DemoCredentials>
          <DemoTitle>Demo Accounts (Click to use):</DemoTitle>
          <DemoRole onClick={() => handleDemoLogin('owner', 'owner@thedigitaltap.com')}>
            <span><strong>Owner:</strong> owner@thedigitaltap.com</span>
            <span>demo123</span>
          </DemoRole>
          <DemoRole onClick={() => handleDemoLogin('manager', 'manager@thedigitaltap.com')}>
            <span><strong>Manager:</strong> manager@thedigitaltap.com</span>
            <span>demo123</span>
          </DemoRole>
          <DemoRole onClick={() => handleDemoLogin('bartender', 'bartender@thedigitaltap.com')}>
            <span><strong>Bartender:</strong> bartender@thedigitaltap.com</span>
            <span>demo123</span>
          </DemoRole>
          <DemoRole onClick={() => handleDemoLogin('server', 'server@thedigitaltap.com')}>
            <span><strong>Server:</strong> server@thedigitaltap.com</span>
            <span>demo123</span>
          </DemoRole>
        </DemoCredentials>
      </LoginCard>
    </Container>
  );
};

export default LoginScreen;