import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  Plus, 
  Bell, 
  CreditCard, 
  Clock,
  Home,
  Search,
  Filter
} from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: var(--spacing-lg);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  background: var(--accent-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
`;

const HeaderText = styled.div``;

const PageTitle = styled.h1`
  color: var(--text-primary);
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
`;

const VenueName = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const BackButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const StatCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: var(--accent-primary);
    color: white;
    
    &:hover {
      background: var(--accent-hover);
    }
  ` : `
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--bg-hover);
      border-color: var(--accent-primary);
    }
  `}
`;

const SessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
`;

const SessionCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const CustomerInfo = styled.div``;

const CustomerName = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const TableInfo = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: rgba(81, 207, 102, 0.1);
          color: var(--success-color);
        `;
      case 'pending':
        return `
          background: rgba(255, 212, 59, 0.1);
          color: var(--warning-color);
        `;
      default:
        return `
          background: var(--bg-secondary);
          color: var(--text-secondary);
        `;
    }
  }}
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  font-size: 0.9rem;
`;

const DetailItem = styled.div`
  color: var(--text-secondary);
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const SessionActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const SmallButton = styled.button<{ variant?: 'primary' | 'secondary' | 'warning' }>`
  flex: 1;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: var(--accent-primary);
          color: white;
          &:hover { background: var(--accent-hover); }
        `;
      case 'warning':
        return `
          background: var(--warning-color);
          color: black;
          &:hover { background: #ffd000; }
        `;
      default:
        return `
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          &:hover { background: var(--bg-hover); }
        `;
    }
  }}
`;

const BartenderDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockSessions = [
    {
      id: 1,
      customerName: 'John Doe',
      tableNumber: '5',
      status: 'active',
      totalAmount: 47.50,
      itemCount: 3,
      duration: '45m',
      lastOrder: '5m ago'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      tableNumber: '3',
      status: 'active',
      totalAmount: 23.75,
      itemCount: 1,
      duration: '20m',
      lastOrder: '2m ago'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      tableNumber: '7',
      status: 'pending',
      totalAmount: 89.25,
      itemCount: 6,
      duration: '1h 15m',
      lastOrder: '15m ago'
    },
    {
      id: 4,
      customerName: 'Sarah Wilson',
      tableNumber: '12',
      status: 'active',
      totalAmount: 156.00,
      itemCount: 8,
      duration: '2h 30m',
      lastOrder: '8m ago'
    }
  ];

  const getTimeElapsed = (duration: string) => duration;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Logo>B</Logo>
          <HeaderText>
            <PageTitle>Bartender Dashboard</PageTitle>
            <VenueName>The Digital Tap</VenueName>
          </HeaderText>
        </HeaderLeft>
        <BackButton href="/">
          <Home size={16} />
          Back to Home
        </BackButton>
      </Header>

      <QuickStats>
        <StatCard>
          <StatValue>23</StatValue>
          <StatLabel>Active Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>$2,847</StatValue>
          <StatLabel>Today's Revenue</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>8</StatValue>
          <StatLabel>Pending Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>$41.25</StatValue>
          <StatLabel>Average Tab</StatLabel>
        </StatCard>
      </QuickStats>

      <ActionsBar>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by customer name or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <ActionButtons>
          <ActionButton variant="secondary">
            <Filter size={16} />
            Filter
          </ActionButton>
          <ActionButton variant="primary">
            <Plus size={16} />
            New Session
          </ActionButton>
        </ActionButtons>
      </ActionsBar>

      <SessionsGrid>
        {mockSessions
          .filter(session => 
            session.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.tableNumber.includes(searchTerm)
          )
          .map(session => (
            <SessionCard key={session.id}>
              <SessionHeader>
                <CustomerInfo>
                  <CustomerName>{session.customerName}</CustomerName>
                  <TableInfo>Table {session.tableNumber}</TableInfo>
                </CustomerInfo>
                <StatusBadge status={session.status}>
                  {session.status.toUpperCase()}
                </StatusBadge>
              </SessionHeader>

              <SessionDetails>
                <DetailItem>
                  <DetailLabel>Total:</DetailLabel> ${session.totalAmount.toFixed(2)}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Items:</DetailLabel> {session.itemCount}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Duration:</DetailLabel> {session.duration}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Last Order:</DetailLabel> {session.lastOrder}
                </DetailItem>
              </SessionDetails>

              <SessionActions>
                <SmallButton variant="primary">
                  <Plus size={14} />
                  Add Items
                </SmallButton>
                <SmallButton variant="secondary">
                  <Bell size={14} />
                  Notify
                </SmallButton>
                {session.status === 'pending' && (
                  <SmallButton variant="warning">
                    <CreditCard size={14} />
                    Payment
                  </SmallButton>
                )}
              </SessionActions>
            </SessionCard>
          ))}
      </SessionsGrid>
    </Container>
  );
};

export default BartenderDashboard;