import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Bell,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Coffee,
  Wine,
  Users,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useToast } from '../contexts/ToastContext';

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const QuickActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &.beverage {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--accent-primary);
    border: 1px solid rgba(0, 212, 170, 0.3);
    
    &:hover {
      background-color: rgba(0, 212, 170, 0.2);
    }
  }
  
  &.food {
    background-color: rgba(255, 140, 0, 0.1);
    color: #ff8c00;
    border: 1px solid rgba(255, 140, 0, 0.3);
    
    &:hover {
      background-color: rgba(255, 140, 0, 0.2);
    }
  }
  
  &.custom {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
`;

const NotificationSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SessionSelector = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 200px;
  overflow-y: auto;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  &.selected {
    border-color: var(--accent-primary);
    background-color: rgba(0, 212, 170, 0.1);
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PatronName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
`;

const SessionDetails = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const SelectButton = styled.button`
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--accent-hover);
  }
`;

const MessageComposer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const MessageTemplates = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const TemplateButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const MessageInput = styled.textarea`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
  color: var(--text-primary);
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-end;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NotificationHistory = styled.div`
  margin-top: var(--spacing-xl);
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
`;

const HistoryInfo = styled.div`
  flex: 1;
`;

const HistoryMessage = styled.div`
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const HistoryDetails = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const HistoryStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  
  &.sent {
    color: var(--success-color);
  }
  
  &.pending {
    color: var(--warning-color);
  }
  
  &.failed {
    color: var(--error-color);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ModalTitle = styled.h2`
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const NotificationSystem = () => {
  const { socket, isConnected } = useSocket();
  const { success, error: showError } = useToast();
  
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Mock active sessions
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'session-1',
      patronName: 'John Doe',
      tableNumber: '5',
      itemsCount: 3,
      entryTime: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'session-2',
      patronName: 'Jane Smith',
      tableNumber: '3',
      itemsCount: 1,
      entryTime: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'session-3',
      patronName: 'Mike Johnson',
      tableNumber: '7',
      itemsCount: 5,
      entryTime: new Date(Date.now() - 45 * 60 * 1000),
      status: 'active'
    }
  ]);

  const messageTemplates = [
    "Your drink is ready! Please come to the bar to collect it.",
    "Your food order is ready for pickup.",
    "Thank you for your patience. Your order will be ready in 5 minutes.",
    "Last call for drinks - bar closing in 30 minutes.",
    "Happy hour special: 20% off all cocktails until 7 PM!"
  ];

  const quickNotifications = [
    {
      type: 'beverage',
      icon: Coffee,
      title: 'Beverage Ready',
      message: "Your drink is ready! Please come to the bar to collect it."
    },
    {
      type: 'food',
      icon: Wine,
      title: 'Food Ready',
      message: "Your food order is ready for pickup."
    }
  ];

  useEffect(() => {
    // Mock notification history
    setNotificationHistory([
      {
        id: 'notif-1',
        sessionId: 'session-1',
        patronName: 'John Doe',
        message: 'Your drink is ready!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'sent'
      },
      {
        id: 'notif-2',
        sessionId: 'session-2',
        patronName: 'Jane Smith',
        message: 'Your food order is ready for pickup.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: 'sent'
      }
    ]);
  }, []);

  const handleQuickNotification = (template) => {
    if (selectedSessions.length === 0) {
      showError('Please select at least one session to send notifications');
      return;
    }
    
    sendNotification(template.message);
  };

  const handleCustomNotification = () => {
    if (selectedSessions.length === 0) {
      showError('Please select at least one session to send notifications');
      return;
    }
    setShowCustomModal(true);
  };

  const sendNotification = async (messageText) => {
    if (!messageText.trim()) {
      showError('Please enter a message');
      return;
    }

    setIsSending(true);
    
    try {
      // In real app, send via API/WebSocket
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to notification history
      const newNotifications = selectedSessions.map(session => ({
        id: `notif-${Date.now()}-${session.id}`,
        sessionId: session.id,
        patronName: session.patronName,
        message: messageText,
        timestamp: new Date(),
        status: 'sent'
      }));
      
      setNotificationHistory(prev => [...newNotifications, ...prev]);
      
      // Emit real-time notification if socket connected
      if (socket && isConnected) {
        selectedSessions.forEach(session => {
          socket.emit('send-notification', {
            sessionId: session.id,
            message: messageText,
            type: 'info',
            timestamp: Date.now()
          });
        });
      }
      
      success(`Notification sent to ${selectedSessions.length} patron(s)`);
      
      // Reset form
      setSelectedSessions([]);
      setMessage('');
      setShowCustomModal(false);
      
    } catch (err) {
      showError('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleSessionSelect = (session) => {
    if (selectedSessions.some(s => s.id === session.id)) {
      setSelectedSessions(prev => prev.filter(s => s.id !== session.id));
    } else {
      setSelectedSessions(prev => [...prev, session]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === activeSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions([...activeSessions]);
    }
  };

  const handleTemplateSelect = (template) => {
    setMessage(template);
  };

  const filteredSessions = activeSessions.filter(session =>
    session.patronName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tableNumber.includes(searchTerm)
  );

  return (
    <NotificationContainer>
      <NotificationHeader>
        <QuickActions>
          {quickNotifications.map((template, index) => {
            const IconComponent = template.icon;
            return (
              <QuickActionButton
                key={index}
                className={template.type}
                onClick={() => handleQuickNotification(template)}
              >
                <IconComponent size={16} />
                {template.title}
              </QuickActionButton>
            );
          })}
          <QuickActionButton className="custom" onClick={handleCustomNotification}>
            <MessageSquare size={16} />
            Custom Message
          </QuickActionButton>
        </QuickActions>
      </NotificationHeader>

      <NotificationSection>
        <SectionTitle>
          <Users size={20} />
          Select Recipients ({selectedSessions.length} selected)
        </SectionTitle>
        
        <SessionSelector>
          <SearchInput
            type="text"
            placeholder="Search by patron name or table number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {filteredSessions.length} active sessions
            </span>
            <button
              onClick={handleSelectAll}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {selectedSessions.length === activeSessions.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <SessionsList>
            {filteredSessions.map(session => (
              <SessionItem
                key={session.id}
                className={selectedSessions.some(s => s.id === session.id) ? 'selected' : ''}
                onClick={() => handleSessionSelect(session)}
              >
                <SessionInfo>
                  <PatronName>{session.patronName}</PatronName>
                  <SessionDetails>
                    Table {session.tableNumber} • {session.itemsCount} items • 
                    {Math.floor((Date.now() - session.entryTime) / (1000 * 60))}m ago
                  </SessionDetails>
                </SessionInfo>
                <SelectButton>
                  {selectedSessions.some(s => s.id === session.id) ? 'Selected' : 'Select'}
                </SelectButton>
              </SessionItem>
            ))}
          </SessionsList>
        </SessionSelector>
      </NotificationSection>

      <NotificationHistory>
        <SectionTitle>
          <Clock size={20} />
          Recent Notifications
        </SectionTitle>
        
        <HistoryList>
          {notificationHistory.map(notification => (
            <HistoryItem key={notification.id}>
              <HistoryInfo>
                <HistoryMessage>{notification.message}</HistoryMessage>
                <HistoryDetails>
                  To: {notification.patronName} • {notification.timestamp.toLocaleString()}
                </HistoryDetails>
              </HistoryInfo>
              <HistoryStatus className={notification.status}>
                {notification.status === 'sent' && <CheckCircle size={14} />}
                {notification.status === 'pending' && <Clock size={14} />}
                {notification.status === 'failed' && <AlertCircle size={14} />}
                {notification.status}
              </HistoryStatus>
            </HistoryItem>
          ))}
          
          {notificationHistory.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-xl)', 
              color: 'var(--text-muted)' 
            }}>
              No notifications sent yet
            </div>
          )}
        </HistoryList>
      </NotificationHistory>

      {/* Custom Message Modal */}
      {showCustomModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Send Custom Notification</ModalTitle>
              <CloseButton onClick={() => setShowCustomModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <MessageComposer>
              <div>
                <label style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Quick Templates:
                </label>
                <MessageTemplates>
                  {messageTemplates.map((template, index) => (
                    <TemplateButton
                      key={index}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.substring(0, 30)}...
                    </TemplateButton>
                  ))}
                </MessageTemplates>
              </div>
              
              <div>
                <label style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Message:
                </label>
                <MessageInput
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your custom message here..."
                />
              </div>
              
              <div style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)',
                textAlign: 'center'
              }}>
                Sending to {selectedSessions.length} patron(s)
              </div>
              
              <SendButton 
                onClick={() => sendNotification(message)}
                disabled={isSending || !message.trim()}
              >
                <Send size={16} />
                {isSending ? 'Sending...' : 'Send Notification'}
              </SendButton>
            </MessageComposer>
          </ModalContent>
        </Modal>
      )}
    </NotificationContainer>
  );
};

export default NotificationSystem;