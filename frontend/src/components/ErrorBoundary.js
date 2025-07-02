import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
`;

const ErrorCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
`;

const ErrorIcon = styled.div`
  color: var(--error-color);
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: center;
`;

const ErrorTitle = styled.h1`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-bottom: var(--spacing-lg);
  text-align: left;
  
  summary {
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.9rem;
    margin-bottom: var(--spacing-sm);
    
    &:hover {
      color: var(--text-secondary);
    }
  }
  
  pre {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    font-size: 0.8rem;
    color: var(--text-muted);
    overflow-x: auto;
    white-space: pre-wrap;
  }
`;

const RefreshButton = styled.button`
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // TODO: Log error to monitoring service in production
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={48} />
            </ErrorIcon>
            
            <ErrorTitle>Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We're sorry, but something unexpected happened. The error has been logged 
              and we'll look into it. Try refreshing the page or come back later.
            </ErrorMessage>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Error details (development only)</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </ErrorDetails>
            )}
            
            <RefreshButton onClick={this.handleRefresh}>
              <RefreshCw size={16} />
              Refresh Page
            </RefreshButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;