import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Settings, 
  Users, 
  Menu, 
  Bell, 
  BarChart3, 
  Wifi,
  ArrowLeft,
  Home
} from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  padding: var(--spacing-lg);
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: var(--accent-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const SidebarTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props => props.active ? 'var(--accent-primary)' : 'none'};
  border: none;
  border-radius: var(--radius-md);
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-hover)' : 'var(--bg-hover)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const MainContent = styled.div`
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const BackButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const MetricCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
`;

const ContentSection = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
`;

const FeatureItem = styled.div`
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
`;

const FeatureTitle = styled.h4`
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('venue');

  const navigationItems = [
    { id: 'venue', label: 'Venue Settings', icon: Settings },
    { id: 'beacons', label: 'Beacons', icon: Wifi },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'menu', label: 'Menu Items', icon: Menu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'venue':
        return (
          <ContentSection>
            <SectionTitle>
              <Settings size={20} />
              Venue Settings
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Basic Information</FeatureTitle>
                <FeatureDescription>
                  Venue name, address, contact details, and subscription tier management.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Tab Configuration</FeatureTitle>
                <FeatureDescription>
                  Auto-close timing, maximum tab amounts, tip suggestions, and payment settings.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Notification Settings</FeatureTitle>
                <FeatureDescription>
                  Configure customer alerts, staff notifications, and beverage ready messages.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
      case 'menu':
        return (
          <ContentSection>
            <SectionTitle>
              <Menu size={20} />
              Menu Management
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Beverage Library</FeatureTitle>
                <FeatureDescription>
                  Access 300+ preset beverages including beer, wine, spirits, and cocktails with automatic pricing.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Custom Items</FeatureTitle>
                <FeatureDescription>
                  Add custom menu items, set prices, descriptions, and manage availability.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Categories</FeatureTitle>
                <FeatureDescription>
                  Organize items into categories for easy browsing and ordering.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
      case 'staff':
        return (
          <ContentSection>
            <SectionTitle>
              <Users size={20} />
              Staff Management
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Role-Based Access</FeatureTitle>
                <FeatureDescription>
                  Owner, Manager, Bartender, and Server roles with customizable permissions.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Staff Accounts</FeatureTitle>
                <FeatureDescription>
                  Create and manage staff accounts with individual access controls.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Activity Tracking</FeatureTitle>
                <FeatureDescription>
                  Monitor staff login times, actions performed, and performance metrics.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
      case 'notifications':
        return (
          <ContentSection>
            <SectionTitle>
              <Bell size={20} />
              Notification System
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Customer Alerts</FeatureTitle>
                <FeatureDescription>
                  Send "drink ready" notifications and custom messages to customers.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Bulk Messaging</FeatureTitle>
                <FeatureDescription>
                  Send notifications to multiple customers with session filtering.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Message Templates</FeatureTitle>
                <FeatureDescription>
                  Quick-action templates for common notifications and custom messaging.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
      case 'reports':
        return (
          <ContentSection>
            <SectionTitle>
              <BarChart3 size={20} />
              Advanced Reports
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Revenue Analytics</FeatureTitle>
                <FeatureDescription>
                  Track daily, weekly, and monthly revenue with trend analysis.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Custom Filters</FeatureTitle>
                <FeatureDescription>
                  Filter reports by date range, staff member, payment method, and more.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Export Options</FeatureTitle>
                <FeatureDescription>
                  Export data in CSV, XLSX formats for external analysis.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
      default:
        return (
          <ContentSection>
            <SectionTitle>
              <Wifi size={20} />
              Beacon Management
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureTitle>Entry/Exit Detection</FeatureTitle>
                <FeatureDescription>
                  Configure beacons for automatic customer entry and exit detection.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Battery Monitoring</FeatureTitle>
                <FeatureDescription>
                  Track beacon battery levels and receive low battery alerts.
                </FeatureDescription>
              </FeatureItem>
              <FeatureItem>
                <FeatureTitle>Status Management</FeatureTitle>
                <FeatureDescription>
                  Monitor beacon connectivity and manage active/inactive status.
                </FeatureDescription>
              </FeatureItem>
            </FeatureList>
          </ContentSection>
        );
    }
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <Logo>B</Logo>
          <SidebarTitle>Admin Panel</SidebarTitle>
        </SidebarHeader>
        <NavMenu>
          {navigationItems.map(item => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                active={activeTab === item.id}
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
          <HeaderLeft>
            <PageTitle>
              {navigationItems.find(item => item.id === activeTab)?.label}
            </PageTitle>
            <PageDescription>
              Manage your venue settings and configuration
            </PageDescription>
          </HeaderLeft>
          <BackButton href="/">
            <Home size={16} />
            Back to Home
          </BackButton>
        </Header>

        <MetricsGrid>
          <MetricCard>
            <MetricValue>156</MetricValue>
            <MetricLabel>Menu Items</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>8</MetricValue>
            <MetricLabel>Staff Members</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>2</MetricValue>
            <MetricLabel>Active Beacons</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>23</MetricValue>
            <MetricLabel>Active Sessions</MetricLabel>
          </MetricCard>
        </MetricsGrid>

        {renderContent()}
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;