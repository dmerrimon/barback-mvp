import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Plus, Minus, Clock, MapPin, Bluetooth, WifiOff } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';
import BeaconDetection from '../components/BeaconDetection';

const SessionContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
`;

const SessionHeader = styled.div`
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-lg);
`;

const VenueInfo = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-md);
`;

const VenueName = styled.h1`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const TableInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
`;

const StatusItem = styled.div`
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
  
  &.pending {
    background-color: rgba(255, 217, 61, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(255, 217, 61, 0.3);
  }
`;

const SessionContent = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const PaymentSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaymentButton = styled.button`
  width: 100%;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TabSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const TabTotal = styled.div`
  text-align: right;
`;

const TotalLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const TotalAmount = styled.div`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
`;

const TabItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const TabItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
`;

const ItemDetails = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const ItemPrice = styled.div`
  color: var(--text-primary);
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

const SessionPage = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socket, isConnected, joinSession, leaveSession } = useSocket();
  const { success, error: showError } = useToast();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [beaconStatus, setBeaconStatus] = useState('disconnected');

  // Mock data for demo
  const mockVenue = {
    name: "The Digital Tap",
    address: "123 Tech Street"
  };

  const mockTabItems = [
    {
      id: '1',
      itemName: 'Craft IPA',
      category: 'Beer',
      price: 8.50,
      quantity: 2,
      totalPrice: 17.00,
      addedAt: new Date()
    },
    {
      id: '2',
      itemName: 'Wings',
      category: 'Food',
      price: 12.00,
      quantity: 1,
      totalPrice: 12.00,
      addedAt: new Date()
    }
  ];

  useEffect(() => {
    // Initialize session
    const initSession = async () => {
      try {
        if (sessionId === 'new') {
          // Create new session
          const venueId = searchParams.get('venueId');
          const tableNumber = searchParams.get('table');
          
          const newSession = {
            id: `session-${Date.now()}`,
            venueId: venueId || 'demo-venue',
            tableNumber: tableNumber || '1',
            status: 'pending',
            subtotal: 0,
            tipAmount: 0,
            total: 0,
            tabItems: []
          };
          
          setSession(newSession);
          // Update URL to reflect actual session ID
          navigate(`/session/${newSession.id}`, { replace: true });
        } else {
          // Load existing session
          // In real app, fetch from API
          const existingSession = {
            id: sessionId,
            venueId: 'demo-venue',
            tableNumber: '5',
            status: 'active',
            subtotal: 29.00,
            tipAmount: 0,
            total: 29.00,
            tabItems: mockTabItems
          };
          
          setSession(existingSession);
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
        showError('Failed to load session. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [sessionId, searchParams, navigate, showError]);

  useEffect(() => {
    if (session?.id && isConnected) {
      joinSession(session.id);
      
      // Listen for real-time updates
      if (socket) {
        socket.on('item-added', (item) => {
          setSession(prev => ({
            ...prev,
            tabItems: [...prev.tabItems, item]
          }));
          success(`${item.itemName} added to your tab`);
        });

        socket.on('status-update', (update) => {
          setSession(prev => ({
            ...prev,
            status: update.status,
            entryTime: update.entryTime,
            exitTime: update.exitTime
          }));
        });
      }
    }

    return () => {
      if (session?.id) {
        leaveSession(session.id);
      }
    };
  }, [session?.id, isConnected, socket, joinSession, leaveSession, success]);

  const handleAddPayment = () => {
    if (session) {
      navigate(`/payment/${session.id}`);
    }
  };

  const handleBeaconStatusChange = (status) => {
    setBeaconStatus(status);
    if (status === 'connected') {
      success('Connected to venue - your tab is now active!');
    }
  };

  if (isLoading) {
    return (
      <SessionContainer>
        <SessionContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Loading session...
            </p>
          </div>
        </SessionContent>
      </SessionContainer>
    );
  }

  if (!session) {
    return (
      <SessionContainer>
        <SessionContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Session not found</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The session you're looking for doesn't exist.
            </p>
          </div>
        </SessionContent>
      </SessionContainer>
    );
  }

  const subtotal = session.tabItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <SessionContainer>
      <BeaconDetection 
        sessionId={session.id}
        onStatusChange={handleBeaconStatusChange}
      />
      
      <SessionHeader>
        <VenueInfo>
          <VenueName>{mockVenue.name}</VenueName>
          <TableInfo>
            <MapPin size={16} />
            Table {session.tableNumber}
          </TableInfo>
        </VenueInfo>
        
        <StatusIndicator>
          <StatusItem className={isConnected ? 'connected' : 'disconnected'}>
            {isConnected ? <WifiOff size={16} /> : <WifiOff size={16} />}
            {isConnected ? 'Connected' : 'Offline'}
          </StatusItem>
          
          <StatusItem className={beaconStatus}>
            <Bluetooth size={16} />
            {beaconStatus === 'connected' ? 'In Venue' : 'Searching...'}
          </StatusItem>
          
          <StatusItem className={session.status === 'active' ? 'connected' : 'pending'}>
            <Clock size={16} />
            {session.status === 'active' ? 'Tab Active' : 'Pending'}
          </StatusItem>
        </StatusIndicator>
      </SessionHeader>

      <SessionContent>
        {!hasPaymentMethod && (
          <PaymentSection>
            <SectionTitle>
              <CreditCard size={20} />
              Payment Method
            </SectionTitle>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
              Add a payment method to activate your tab
            </p>
            <PaymentButton onClick={handleAddPayment}>
              <Plus size={20} />
              Add Payment Method
            </PaymentButton>
          </PaymentSection>
        )}

        <TabSection>
          <TabHeader>
            <SectionTitle>Your Tab</SectionTitle>
            <TabTotal>
              <TotalLabel>Total</TotalLabel>
              <TotalAmount>${subtotal.toFixed(2)}</TotalAmount>
            </TabTotal>
          </TabHeader>

          <TabItems>
            {session.tabItems.length > 0 ? (
              session.tabItems.map((item) => (
                <TabItem key={item.id}>
                  <ItemInfo>
                    <ItemName>{item.itemName}</ItemName>
                    <ItemDetails>
                      {item.quantity > 1 && `${item.quantity}x `}
                      ${item.price.toFixed(2)}
                      {item.category && ` • ${item.category}`}
                    </ItemDetails>
                  </ItemInfo>
                  <ItemPrice>${item.totalPrice.toFixed(2)}</ItemPrice>
                </TabItem>
              ))
            ) : (
              <EmptyState>
                <p>No items on your tab yet</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Items will appear here when added by staff
                </p>
              </EmptyState>
            )}
          </TabItems>
        </TabSection>
      </SessionContent>
    </SessionContainer>
  );
};

export default SessionPage;