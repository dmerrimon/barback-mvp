import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  Settings,
  Users,
  Menu,
  Bell,
  BarChart3,
  Wifi,
  Plus,
  Edit,
  Trash2,
  Save,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import MenuManagement from '../components/MenuManagement';
import StaffManagement from '../components/StaffManagement';
import NotificationSystem from '../components/NotificationSystem';
import AdvancedReporting from '../components/AdvancedReporting';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: grid;
  grid-template-columns: 250px 1fr;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarTitle = styled.h2`
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 1.25rem;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
  }
`;

const MainContent = styled.div`
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const PageTitle = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const ContentSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &.primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    
    &:hover {
      background-color: var(--accent-hover);
    }
  }
  
  &.secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
  
  &.danger {
    background-color: var(--error-color);
    color: white;
    
    &:hover {
      background-color: #ff5252;
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const Select = styled.select`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const Table = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  background-color: var(--bg-secondary);
  padding: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--bg-hover);
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.8rem;
  font-weight: 500;
  
  &.active {
    background-color: rgba(81, 207, 102, 0.1);
    color: var(--success-color);
  }
  
  &.inactive {
    background-color: rgba(255, 107, 107, 0.1);
    color: var(--error-color);
  }
`;

const AdminDashboard = () => {
  const { venueId } = useParams();
  const { success, error: showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('venue');
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for demonstration
  const mockVenue = {
    id: venueId,
    name: 'The Digital Tap',
    address: '123 Tech Street, San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'contact@digitaltap.com',
    subscriptionTier: 'premium',
    settings: {
      autoCloseTabMinutes: 30,
      tipSuggestions: [15, 18, 20, 25],
      maxTabAmount: 500,
      requireTipBeforeClose: false,
      notifyBeverageReady: true
    }
  };

  const mockBeacons = [
    {
      id: 'beacon-1',
      name: 'Main Entrance',
      type: 'entry',
      batteryLevel: 85,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      isActive: true
    },
    {
      id: 'beacon-2', 
      name: 'Main Exit',
      type: 'exit',
      batteryLevel: 92,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      isActive: true
    }
  ];

  const mockStaff = [
    {
      id: 'staff-1',
      name: 'Sarah Martinez',
      email: 'sarah@digitaltap.com',
      role: 'manager',
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'staff-2',
      name: 'Mike Johnson', 
      email: 'mike@digitaltap.com',
      role: 'bartender',
      isActive: true,
      lastLogin: new Date(Date.now() - 30 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Load venue data
    setTimeout(() => {
      setVenue(mockVenue);
      setIsLoading(false);
    }, 1000);
  }, [venueId]);

  const handleSaveVenue = async () => {
    setIsSaving(true);
    try {
      // In real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Venue settings saved successfully!');
    } catch (err) {
      showError('Failed to save venue settings');
    } finally {
      setIsSaving(false);
    }
  };

  const navigationItems = [
    { id: 'venue', label: 'Venue Settings', icon: Settings },
    { id: 'beacons', label: 'Beacons', icon: Wifi },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'menu', label: 'Menu Items', icon: Menu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const renderVenueSettings = () => (
    <ContentSection>
      <SectionHeader>
        <SectionTitle>
          <Settings size={20} />
          Venue Information
        </SectionTitle>
        <ActionButton className="primary" onClick={handleSaveVenue} disabled={isSaving}>
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </ActionButton>
      </SectionHeader>
      
      <FormGrid>
        <FormField>
          <Label>Venue Name</Label>
          <Input
            type="text"
            value={venue?.name || ''}
            onChange={(e) => setVenue(prev => ({ ...prev, name: e.target.value }))}
          />
        </FormField>
        
        <FormField>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={venue?.phone || ''}
            onChange={(e) => setVenue(prev => ({ ...prev, phone: e.target.value }))}
          />
        </FormField>
        
        <FormField>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={venue?.email || ''}
            onChange={(e) => setVenue(prev => ({ ...prev, email: e.target.value }))}
          />
        </FormField>
        
        <FormField>
          <Label>Subscription Tier</Label>
          <Select
            value={venue?.subscriptionTier || 'basic'}
            onChange={(e) => setVenue(prev => ({ ...prev, subscriptionTier: e.target.value }))}
          >
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </Select>
        </FormField>
      </FormGrid>
      
      <FormGrid style={{ marginTop: 'var(--spacing-lg)' }}>
        <FormField>
          <Label>Auto-close tab after (minutes)</Label>
          <Input
            type="number"
            value={venue?.settings?.autoCloseTabMinutes || 30}
            onChange={(e) => setVenue(prev => ({
              ...prev,
              settings: { ...prev.settings, autoCloseTabMinutes: parseInt(e.target.value) }
            }))}
          />
        </FormField>
        
        <FormField>
          <Label>Maximum tab amount ($)</Label>
          <Input
            type="number"
            value={venue?.settings?.maxTabAmount || 500}
            onChange={(e) => setVenue(prev => ({
              ...prev,
              settings: { ...prev.settings, maxTabAmount: parseInt(e.target.value) }
            }))}
          />
        </FormField>
      </FormGrid>
      
      <FormField style={{ marginTop: 'var(--spacing-lg)' }}>
        <Label>Address</Label>
        <Input
          type="text"
          value={venue?.address || ''}
          onChange={(e) => setVenue(prev => ({ ...prev, address: e.target.value }))}
        />
      </FormField>
    </ContentSection>
  );

  const renderBeacons = () => (
    <ContentSection>
      <SectionHeader>
        <SectionTitle>
          <Wifi size={20} />
          Beacon Management
        </SectionTitle>
        <ActionButton className="primary">
          <Plus size={16} />
          Add Beacon
        </ActionButton>
      </SectionHeader>
      
      <Table>
        <TableHeader columns="2fr 1fr 1fr 1fr 150px">
          <div>Beacon Name</div>
          <div>Type</div>
          <div>Battery</div>
          <div>Last Seen</div>
          <div>Actions</div>
        </TableHeader>
        
        {mockBeacons.map(beacon => (
          <TableRow key={beacon.id} columns="2fr 1fr 1fr 1fr 150px">
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {beacon.name}
              </div>
              <StatusBadge className={beacon.isActive ? 'active' : 'inactive'}>
                {beacon.isActive ? 'Active' : 'Inactive'}
              </StatusBadge>
            </div>
            <div style={{ textTransform: 'capitalize' }}>{beacon.type}</div>
            <div>{beacon.batteryLevel}%</div>
            <div>{beacon.lastSeen.toLocaleTimeString()}</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ActionButton className="secondary" style={{ padding: '0.25rem' }}>
                <Edit size={14} />
              </ActionButton>
              <ActionButton className="danger" style={{ padding: '0.25rem' }}>
                <Trash2 size={14} />
              </ActionButton>
            </div>
          </TableRow>
        ))}
      </Table>
    </ContentSection>
  );

  const renderStaff = () => (
    <ContentSection>
      <SectionHeader>
        <SectionTitle>
          <Users size={20} />
          Staff Management
        </SectionTitle>
      </SectionHeader>
      <StaffManagement />
    </ContentSection>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'venue':
        return renderVenueSettings();
      case 'beacons':
        return renderBeacons();
      case 'staff':
        return renderStaff();
      case 'menu':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>
                <Menu size={20} />
                Menu Management
              </SectionTitle>
            </SectionHeader>
            <MenuManagement />
          </ContentSection>
        );
      case 'notifications':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>
                <Bell size={20} />
                Notification System
              </SectionTitle>
            </SectionHeader>
            <NotificationSystem />
          </ContentSection>
        );
      case 'reports':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>
                <BarChart3 size={20} />
                Advanced Reports
              </SectionTitle>
            </SectionHeader>
            <AdvancedReporting />
          </ContentSection>
        );
      default:
        return (
          <ContentSection>
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <h3>Coming Soon</h3>
              <p>{navigationItems.find(item => item.id === activeTab)?.label} feature is under development.</p>
            </div>
          </ContentSection>
        );
    }
  };

  if (isLoading) {
    return (
      <AdminContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="loading-spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Loading admin dashboard...
          </p>
        </div>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarTitle>Admin Panel</SidebarTitle>
        <NavMenu>
          {navigationItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                <IconComponent size={18} />
                {item.label}
              </NavItem>
            );
          })}
        </NavMenu>
      </Sidebar>

      <MainContent>
        <Header>
          <PageTitle>
            {navigationItems.find(item => item.id === activeTab)?.label}
          </PageTitle>
          <PageDescription>
            Manage your venue settings and configuration
          </PageDescription>
        </Header>

        {renderContent()}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminDashboard;