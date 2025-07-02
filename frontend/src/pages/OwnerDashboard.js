import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  CreditCard,
  Star,
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: var(--spacing-lg);
`;

const DashboardHeader = styled.div`
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
  flex-wrap: wrap;
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

const PremiumBadge = styled.div`
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeFilter = styled.select`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  color: var(--text-primary);
  cursor: pointer;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const MetricCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.revenue {
    background: linear-gradient(135deg, var(--success-color), #4ade80);
    color: white;
  }
  
  &.sessions {
    background: linear-gradient(135deg, var(--accent-primary), #06d6a0);
    color: white;
  }
  
  &.tips {
    background: linear-gradient(135deg, var(--accent-secondary), #0ea5e9);
    color: white;
  }
  
  &.time {
    background: linear-gradient(135deg, var(--warning-color), #fbbf24);
    color: white;
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MetricChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  
  &.positive {
    color: var(--success-color);
  }
  
  &.negative {
    color: var(--error-color);
  }
  
  &.neutral {
    color: var(--text-muted);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ChartTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ChartButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  &.active {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    border-color: var(--accent-primary);
  }
`;

const AnalyticsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const AnalyticsCard = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const Table = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  &.header {
    background-color: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  &:not(.header) {
    color: var(--text-secondary);
    
    &:hover {
      background-color: var(--bg-hover);
    }
  }
`;

const PremiumFeature = styled.div`
  position: relative;
  opacity: ${props => props.isPremium ? 1 : 0.6};
  
  ${props => !props.isPremium && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(0, 145, 255, 0.1));
      border-radius: var(--radius-xl);
      backdrop-filter: blur(2px);
      pointer-events: none;
    }
  `}
`;

const UpgradePrompt = styled.div`
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  text-align: center;
  margin-top: var(--spacing-lg);
`;

const UpgradeButton = styled.button`
  background: white;
  color: var(--accent-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: var(--spacing-md);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const OwnerDashboard = () => {
  const { venueId } = useParams();
  const [timeRange, setTimeRange] = useState('7d');
  const [isPremium, setIsPremium] = useState(false);
  const [activeChart, setActiveChart] = useState('revenue');

  // Mock data
  const venue = {
    name: "The Digital Tap",
    plan: isPremium ? 'Premium' : 'Basic'
  };

  const metrics = {
    revenue: {
      value: 15420.50,
      change: 12.5,
      trend: 'positive'
    },
    sessions: {
      value: 247,
      change: -3.2,
      trend: 'negative'
    },
    tips: {
      value: 2840.25,
      change: 8.7,
      trend: 'positive'
    },
    avgTime: {
      value: 78,
      change: 2.1,
      trend: 'positive'
    }
  };

  const revenueData = [
    { date: '12/25', revenue: 1200, sessions: 28 },
    { date: '12/26', revenue: 1450, sessions: 32 },
    { date: '12/27', revenue: 1680, sessions: 41 },
    { date: '12/28', revenue: 2100, sessions: 38 },
    { date: '12/29', revenue: 1890, sessions: 35 },
    { date: '12/30', revenue: 2340, sessions: 47 },
    { date: '12/31', revenue: 2760, sessions: 52 }
  ];

  const categoryData = [
    { name: 'Beer', value: 45, color: '#00d4aa' },
    { name: 'Cocktails', value: 30, color: '#0091ff' },
    { name: 'Food', value: 20, color: '#ffd93d' },
    { name: 'Wine', value: 5, color: '#ff6b6b' }
  ];

  const topItems = [
    { name: 'Craft IPA', sales: 156, revenue: 1248 },
    { name: 'Margherita Pizza', sales: 89, revenue: 1335 },
    { name: 'Old Fashioned', sales: 76, revenue: 912 },
    { name: 'Buffalo Wings', sales: 67, revenue: 804 },
    { name: 'Caesar Salad', sales: 54, revenue: 648 }
  ];

  const hourlyData = [
    { hour: '11AM', sessions: 2, revenue: 45 },
    { hour: '12PM', sessions: 8, revenue: 180 },
    { hour: '1PM', sessions: 15, revenue: 340 },
    { hour: '2PM', sessions: 12, revenue: 280 },
    { hour: '3PM', sessions: 6, revenue: 130 },
    { hour: '4PM', sessions: 4, revenue: 95 },
    { hour: '5PM', sessions: 18, revenue: 420 },
    { hour: '6PM', sessions: 25, revenue: 580 },
    { hour: '7PM', sessions: 28, revenue: 650 },
    { hour: '8PM', sessions: 32, revenue: 740 },
    { hour: '9PM', sessions: 29, revenue: 680 },
    { hour: '10PM', sessions: 22, revenue: 510 },
    { hour: '11PM', sessions: 8, revenue: 185 }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'positive':
        return <TrendingUp size={16} />;
      case 'negative':
        return <TrendingDown size={16} />;
      default:
        return null;
    }
  };

  const formatChange = (change, trend) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderLeft>
          <VenueName>{venue.name}</VenueName>
          <HeaderStats>
            <StatItem>
              <Calendar size={16} />
              Last 7 days
            </StatItem>
            <StatItem>
              <MapPin size={16} />
              Analytics Dashboard
            </StatItem>
            <StatItem>
              <Clock size={16} />
              Updated {new Date().toLocaleTimeString()}
            </StatItem>
          </HeaderStats>
        </HeaderLeft>
        
        <HeaderRight>
          <PremiumBadge>
            <Star size={16} />
            {venue.plan} Plan
          </PremiumBadge>
          
          <TimeFilter value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="1d">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </TimeFilter>
        </HeaderRight>
      </DashboardHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricHeader>
            <MetricIcon className="revenue">
              <DollarSign size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>${metrics.revenue.value.toLocaleString()}</MetricValue>
          <MetricLabel>Total Revenue</MetricLabel>
          <MetricChange className={metrics.revenue.trend}>
            {getTrendIcon(metrics.revenue.trend)}
            {formatChange(metrics.revenue.change, metrics.revenue.trend)}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricIcon className="sessions">
              <Users size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{metrics.sessions.value}</MetricValue>
          <MetricLabel>Total Sessions</MetricLabel>
          <MetricChange className={metrics.sessions.trend}>
            {getTrendIcon(metrics.sessions.trend)}
            {formatChange(metrics.sessions.change, metrics.sessions.trend)}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricIcon className="tips">
              <CreditCard size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>${metrics.tips.value.toLocaleString()}</MetricValue>
          <MetricLabel>Tips Collected</MetricLabel>
          <MetricChange className={metrics.tips.trend}>
            {getTrendIcon(metrics.tips.trend)}
            {formatChange(metrics.tips.change, metrics.tips.trend)}
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricIcon className="time">
              <Clock size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{metrics.avgTime.value}m</MetricValue>
          <MetricLabel>Avg. Dwell Time</MetricLabel>
          <MetricChange className={metrics.avgTime.trend}>
            {getTrendIcon(metrics.avgTime.trend)}
            {formatChange(metrics.avgTime.change, metrics.avgTime.trend)}
          </MetricChange>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <BarChart3 size={20} />
              Revenue & Sessions
            </ChartTitle>
            <ChartControls>
              <ChartButton 
                className={activeChart === 'revenue' ? 'active' : ''}
                onClick={() => setActiveChart('revenue')}
              >
                Revenue
              </ChartButton>
              <ChartButton 
                className={activeChart === 'sessions' ? 'active' : ''}
                onClick={() => setActiveChart('sessions')}
              >
                Sessions
              </ChartButton>
            </ChartControls>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke="var(--accent-primary)"
                fill="url(#gradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Revenue by Category</ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <AnalyticsSection>
        <AnalyticsCard>
          <TableHeader>
            <h3 style={{ color: 'var(--text-primary)' }}>Top Items</h3>
            <ChartButton>
              <Download size={16} />
            </ChartButton>
          </TableHeader>
          <Table>
            <TableRow className="header">
              <div>Item</div>
              <div>Sales</div>
              <div>Revenue</div>
            </TableRow>
            {topItems.map((item, index) => (
              <TableRow key={index}>
                <div>{item.name}</div>
                <div>{item.sales}</div>
                <div>${item.revenue}</div>
              </TableRow>
            ))}
          </Table>
        </AnalyticsCard>

        <PremiumFeature isPremium={isPremium}>
          <AnalyticsCard>
            <TableHeader>
              <h3 style={{ color: 'var(--text-primary)' }}>
                Hourly Breakdown
                {!isPremium && <Eye size={16} style={{ opacity: 0.5 }} />}
              </h3>
            </TableHeader>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="hour" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Bar dataKey="sessions" fill="var(--accent-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </PremiumFeature>
      </AnalyticsSection>

      {!isPremium && (
        <UpgradePrompt>
          <h3>Unlock Premium Analytics</h3>
          <p>Get detailed hourly breakdowns, customer journey insights, and advanced reporting.</p>
          <UpgradeButton onClick={() => setIsPremium(true)}>
            Upgrade to Premium
          </UpgradeButton>
        </UpgradePrompt>
      )}
    </DashboardContainer>
  );
};

export default OwnerDashboard;