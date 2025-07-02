import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Clock, 
  DollarSign, 
  Wifi, 
  WifiOff,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: grid;
  grid-template-columns: 300px 1fr;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MainContent = styled.div`
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const VenueName = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  
  &.connected {
    background-color: rgba(81, 207, 102, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(81, 207, 102, 0.3);
  }
  
  &.disconnected {
    background-color: rgba(255, 107, 107, 0.1);
    color: var(--error-color);
    border: 1px solid rgba(255, 107, 107, 0.3);
  }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: var(--spacing-lg);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
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

const FilterBar = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
    border-color: var(--border-hover);
  }
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    border-color: var(--accent-primary);
  }
`;

const SessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
`;

const SessionCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
  
  &.pending {
    border-left: 4px solid var(--warning-color);
  }
  
  &.active {
    border-left: 4px solid var(--success-color);
  }
  
  &.closed {
    border-left: 4px solid var(--text-muted);
    opacity: 0.7;
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const SessionInfo = styled.div`
  flex: 1;
`;

const PatronName = styled.h3`
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
`;

const SessionDetails = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SessionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  
  &.pending {
    background-color: rgba(255, 217, 61, 0.1);
    color: var(--warning-color);
  }
  
  &.active {
    background-color: rgba(81, 207, 102, 0.1);
    color: var(--success-color);
  }
  
  &.closed {
    background-color: var(--bg-secondary);
    color: var(--text-muted);
  }
`;

const TabSummary = styled.div`
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
`;

const TabTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TabItems = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const SessionActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover {
      background-color: var(--accent-hover);
    }
  }
  
  &.secondary {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuickActions = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const QuickActionsTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin-bottom: var(--spacing-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--bg-hover);
    border-color: var(--accent-primary);
  }
`;

const BartenderDashboard = () => {
  const { venueId } = useParams();
  const { socket, isConnected, joinBartender, leaveBartender } = useSocket();
  const { success, warning } = useToast();

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockVenue = {
    name: "The Digital Tap",
    address: "123 Tech Street"
  };

  const mockSessions = [
    {
      id: 'session-1',
      patronName: 'John Doe',
      patronPhone: '+1 (555) 123-4567',
      tableNumber: '5',
      status: 'active',
      entryTime: new Date(Date.now() - 30 * 60 * 1000),
      subtotal: 29.50,
      hasPayment: true,
      tabItems: [
        { itemName: 'Craft IPA', quantity: 2, price: 8.50 },
        { itemName: 'Wings', quantity: 1, price: 12.50 }
      ]
    },
    {
      id: 'session-2',
      patronName: 'Jane Smith',
      patronPhone: '+1 (555) 987-6543',
      tableNumber: '3',
      status: 'pending',
      entryTime: new Date(Date.now() - 5 * 60 * 1000),
      subtotal: 0,
      hasPayment: false,
      tabItems: []
    },
    {
      id: 'session-3',
      patronName: 'Mike Johnson',
      patronPhone: null,
      tableNumber: '7',
      status: 'active',
      entryTime: new Date(Date.now() - 45 * 60 * 1000),
      subtotal: 67.25,
      hasPayment: true,
      tabItems: [
        { itemName: 'Whiskey', quantity: 3, price: 12.00 },
        { itemName: 'Burger', quantity: 1, price: 15.50 },
        { itemName: 'Fries', quantity: 2, price: 7.75 }
      ]
    }
  ];

  useEffect(() => {
    // Join bartender room for real-time updates
    if (isConnected) {
      joinBartender(venueId);
    }

    // Load initial data
    setSessions(mockSessions);
    setIsLoading(false);

    return () => {
      leaveBartender(venueId);
    };
  }, [venueId, isConnected, joinBartender, leaveBartender]);

  useEffect(() => {
    // Listen for real-time updates
    if (socket) {
      socket.on('new-session', (session) => {
        setSessions(prev => [session, ...prev]);
        success(`New session: ${session.patronName} at Table ${session.tableNumber}`);
      });

      socket.on('session-update', (updatedSession) => {
        setSessions(prev => prev.map(s => 
          s.id === updatedSession.id ? { ...s, ...updatedSession } : s
        ));
      });

      socket.on('tab-update', ({ sessionId, subtotal }) => {
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, subtotal } : s
        ));
      });
    }
  }, [socket, success]);

  useEffect(() => {
    // Filter sessions based on search and filter
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.patronName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tableNumber.includes(searchTerm) ||
        session.patronPhone?.includes(searchTerm)
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(session => session.status === activeFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, activeFilter]);

  const handleAddItem = (sessionId) => {
    // In real app, open add item modal
    console.log('Add item to session:', sessionId);
    warning('Add item feature coming soon!');
  };

  const handleCloseTab = (sessionId) => {
    // In real app, process tab closure
    console.log('Close tab for session:', sessionId);
    warning('Close tab feature coming soon!');
  };

  const getStatusIcon = (status, hasPayment) => {
    if (status === 'pending' || !hasPayment) {
      return <AlertCircle size={12} />;
    }
    return <CheckCircle size={12} />;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60)); // Minutes
    
    if (diff < 60) {
      return `${diff}m ago`;
    } else {
      const hours = Math.floor(diff / 60);
      return `${hours}h ${diff % 60}m ago`;
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const totalRevenue = sessions.reduce((sum, s) => sum + s.subtotal, 0);

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="loading-spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Loading dashboard...
          </p>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <QuickActions>
          <QuickActionsTitle>Quick Actions</QuickActionsTitle>
          
          <QuickActionButton>
            <Plus size={20} />
            Manual Session
          </QuickActionButton>
          
          <QuickActionButton>
            <Users size={20} />
            View All Patrons
          </QuickActionButton>
          
          <QuickActionButton>
            <DollarSign size={20} />
            Today's Revenue
          </QuickActionButton>
        </QuickActions>
      </Sidebar>

      <MainContent>
        <Header>
          <HeaderLeft>
            <VenueName>{mockVenue.name}</VenueName>
            <HeaderStats>
              <StatItem>
                <Users size={16} />
                {activeSessions} active
              </StatItem>
              <StatItem>
                <DollarSign size={16} />
                ${totalRevenue.toFixed(2)} today
              </StatItem>
              <StatItem>
                <Clock size={16} />
                {new Date().toLocaleTimeString()}
              </StatItem>
            </HeaderStats>
          </HeaderLeft>
          
          <HeaderRight>
            <ConnectionStatus className={isConnected ? 'connected' : 'disconnected'}>
              {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              {isConnected ? 'Connected' : 'Offline'}
            </ConnectionStatus>
          </HeaderRight>
        </Header>

        <SearchBar>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name, table, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterBar>
          <FilterButton
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All Sessions
          </FilterButton>
          <FilterButton
            className={activeFilter === 'pending' ? 'active' : ''}
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </FilterButton>
          <FilterButton
            className={activeFilter === 'active' ? 'active' : ''}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </FilterButton>
        </FilterBar>

        <SessionsGrid>
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} className={session.status}>
              <SessionHeader>
                <SessionInfo>
                  <PatronName>{session.patronName}</PatronName>
                  <SessionDetails>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={12} />
                      Table {session.tableNumber}
                    </div>
                    {session.patronPhone && (
                      <div>{session.patronPhone}</div>
                    )}
                    <div>Arrived {formatTime(session.entryTime)}</div>
                  </SessionDetails>
                </SessionInfo>
                
                <SessionStatus className={session.status}>
                  {getStatusIcon(session.status, session.hasPayment)}
                  {session.status}
                </SessionStatus>
              </SessionHeader>

              <TabSummary>
                <TabTotal>
                  <span>Tab Total</span>
                  <span>${session.subtotal.toFixed(2)}</span>
                </TabTotal>
                <TabItems>
                  {session.tabItems.length > 0 ? (
                    `${session.tabItems.length} items`
                  ) : (
                    'No items yet'
                  )}
                  {!session.hasPayment && (
                    <div style={{ color: 'var(--error-color)', marginTop: '0.25rem' }}>
                      ⚠️ No payment method
                    </div>
                  )}
                </TabItems>
              </TabSummary>

              <SessionActions>
                <ActionButton
                  className="primary"
                  onClick={() => handleAddItem(session.id)}
                >
                  <Plus size={14} />
                  Add Item
                </ActionButton>
                
                {session.status === 'active' && (
                  <ActionButton
                    className="secondary"
                    onClick={() => handleCloseTab(session.id)}
                  >
                    Close Tab
                  </ActionButton>
                )}
              </SessionActions>
            </SessionCard>
          ))}
        </SessionsGrid>

        {filteredSessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No sessions found</h3>
            <p>
              {searchTerm || activeFilter !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'New sessions will appear here when patrons scan QR codes'
              }
            </p>
          </div>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default BartenderDashboard;