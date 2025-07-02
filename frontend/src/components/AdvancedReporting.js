import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  CreditCard,
  FileText,
  Eye,
  ChevronDown,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const ReportingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ReportingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const HeaderControls = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
`;

const DateRangeSelector = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  background-color: var(--bg-secondary);
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
`;

const DateInput = styled.input`
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const FilterDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
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

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 0.25rem;
  padding: 0.5rem;
  z-index: 100;
  box-shadow: var(--shadow-lg);
  min-width: 200px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  input {
    margin: 0;
  }
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
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const MetricTitle = styled.h3`
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  
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

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const MetricSubtitle = styled.div`
  color: var(--text-muted);
  font-size: 0.8rem;
`;

const ReportSection = styled.div`
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
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

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--bg-secondary);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.8rem;
  font-weight: 500;
  
  &.completed {
    background-color: rgba(81, 207, 102, 0.1);
    color: var(--success-color);
  }
  
  &.active {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--accent-primary);
  }
  
  &.cancelled {
    background-color: rgba(255, 107, 107, 0.1);
    color: var(--error-color);
  }
`;

const SearchInput = styled.input`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  color: var(--text-primary);
  width: 250px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const AdvancedReporting = () => {
  const { success, error: showError } = useToast();
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [filters, setFilters] = useState({
    staff: [],
    status: [],
    paymentMethod: [],
    sessionType: []
  });
  
  const [showFilters, setShowFilters] = useState({
    staff: false,
    status: false,
    paymentMethod: false,
    sessionType: false
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const [reportData, setReportData] = useState({
    metrics: {
      totalRevenue: { value: 24750.50, change: 12.5, trend: 'positive' },
      totalSessions: { value: 456, change: -3.2, trend: 'negative' },
      averageSessionValue: { value: 54.28, change: 8.7, trend: 'positive' },
      activePatrons: { value: 1247, change: 15.3, trend: 'positive' }
    },
    transactions: [
      {
        id: 'txn-001',
        sessionId: 'sess-123',
        patronName: 'John Doe',
        staffName: 'Mike Johnson',
        amount: 47.50,
        paymentMethod: 'card',
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        items: 3
      },
      {
        id: 'txn-002',
        sessionId: 'sess-124',
        patronName: 'Jane Smith',
        staffName: 'Sarah Martinez',
        amount: 31.25,
        paymentMethod: 'card',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        items: 2
      },
      {
        id: 'txn-003',
        sessionId: 'sess-125',
        patronName: 'Mike Wilson',
        staffName: 'Emily Chen',
        amount: 78.00,
        paymentMethod: 'cash',
        status: 'active',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        items: 5
      }
    ]
  });

  const staffOptions = [
    'Sarah Martinez',
    'Mike Johnson',
    'Emily Chen',
    'David Wilson'
  ];

  const statusOptions = [
    'active',
    'completed',
    'cancelled'
  ];

  const paymentMethodOptions = [
    'card',
    'cash',
    'mobile'
  ];

  const sessionTypeOptions = [
    'dine-in',
    'quick-service',
    'event'
  ];

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (category, option, checked) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], option]
        : prev[category].filter(item => item !== option)
    }));
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // In real app, fetch data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Report data refreshed successfully!');
    } catch (err) {
      showError('Failed to refresh report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = (format) => {
    success(`Exporting report in ${format.toUpperCase()} format...`);
    // In real app, trigger download
  };

  const toggleFilterDropdown = (filterType) => {
    setShowFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const filteredTransactions = reportData.transactions.filter(transaction => {
    if (searchTerm && !transaction.patronName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.staffName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.staff.length > 0 && !filters.staff.includes(transaction.staffName)) {
      return false;
    }
    
    if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
      return false;
    }
    
    if (filters.paymentMethod.length > 0 && !filters.paymentMethod.includes(transaction.paymentMethod)) {
      return false;
    }
    
    return true;
  });

  return (
    <ReportingContainer>
      <ReportingHeader>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Advanced Reports
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Comprehensive analytics and transaction reporting
          </p>
        </div>
        
        <HeaderControls>
          <DateRangeSelector>
            <Calendar size={16} />
            <DateInput
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
            <span style={{ color: 'var(--text-secondary)' }}>to</span>
            <DateInput
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </DateRangeSelector>
          
          <FilterDropdown>
            <FilterButton 
              className={getActiveFiltersCount() > 0 ? 'active' : ''}
              onClick={() => toggleFilterDropdown('staff')}
            >
              <Filter size={16} />
              Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              <ChevronDown size={14} />
            </FilterButton>
            {showFilters.staff && (
              <DropdownContent>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Staff Members
                </div>
                {staffOptions.map(staff => (
                  <FilterOption key={staff}>
                    <input
                      type="checkbox"
                      checked={filters.staff.includes(staff)}
                      onChange={(e) => handleFilterChange('staff', staff, e.target.checked)}
                    />
                    {staff}
                  </FilterOption>
                ))}
                
                <div style={{ fontWeight: 500, margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>
                  Status
                </div>
                {statusOptions.map(status => (
                  <FilterOption key={status}>
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => handleFilterChange('status', status, e.target.checked)}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </FilterOption>
                ))}
                
                <div style={{ fontWeight: 500, margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>
                  Payment Method
                </div>
                {paymentMethodOptions.map(method => (
                  <FilterOption key={method}>
                    <input
                      type="checkbox"
                      checked={filters.paymentMethod.includes(method)}
                      onChange={(e) => handleFilterChange('paymentMethod', method, e.target.checked)}
                    />
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </FilterOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
          
          <ActionButton className="secondary" onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            Refresh
          </ActionButton>
          
          <ActionButton className="primary" onClick={() => handleExportReport('xlsx')}>
            <Download size={16} />
            Export
          </ActionButton>
        </HeaderControls>
      </ReportingHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricHeader>
            <MetricTitle>
              <DollarSign size={16} />
              Total Revenue
            </MetricTitle>
            <MetricTrend className={reportData.metrics.totalRevenue.trend}>
              {reportData.metrics.totalRevenue.trend === 'positive' ? 
                <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(reportData.metrics.totalRevenue.change)}%
            </MetricTrend>
          </MetricHeader>
          <MetricValue>${reportData.metrics.totalRevenue.value.toLocaleString()}</MetricValue>
          <MetricSubtitle>Last 30 days</MetricSubtitle>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricTitle>
              <Users size={16} />
              Total Sessions
            </MetricTitle>
            <MetricTrend className={reportData.metrics.totalSessions.trend}>
              {reportData.metrics.totalSessions.trend === 'positive' ? 
                <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(reportData.metrics.totalSessions.change)}%
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{reportData.metrics.totalSessions.value.toLocaleString()}</MetricValue>
          <MetricSubtitle>Completed sessions</MetricSubtitle>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricTitle>
              <BarChart3 size={16} />
              Average Session Value
            </MetricTitle>
            <MetricTrend className={reportData.metrics.averageSessionValue.trend}>
              {reportData.metrics.averageSessionValue.trend === 'positive' ? 
                <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(reportData.metrics.averageSessionValue.change)}%
            </MetricTrend>
          </MetricHeader>
          <MetricValue>${reportData.metrics.averageSessionValue.value}</MetricValue>
          <MetricSubtitle>Per session</MetricSubtitle>
        </MetricCard>

        <MetricCard>
          <MetricHeader>
            <MetricTitle>
              <TrendingUp size={16} />
              Active Patrons
            </MetricTitle>
            <MetricTrend className={reportData.metrics.activePatrons.trend}>
              {reportData.metrics.activePatrons.trend === 'positive' ? 
                <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(reportData.metrics.activePatrons.change)}%
            </MetricTrend>
          </MetricHeader>
          <MetricValue>{reportData.metrics.activePatrons.value.toLocaleString()}</MetricValue>
          <MetricSubtitle>Unique visitors</MetricSubtitle>
        </MetricCard>
      </MetricsGrid>

      <ReportSection>
        <SectionHeader>
          <SectionTitle>
            <FileText size={20} />
            Transaction Details
          </SectionTitle>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
            <SearchInput
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ActionButton className="secondary" onClick={() => handleExportReport('csv')}>
              <Download size={16} />
              CSV
            </ActionButton>
          </div>
        </SectionHeader>
        
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Patron</TableHeaderCell>
                <TableHeaderCell>Staff</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Payment</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Time</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                    {transaction.id}
                  </TableCell>
                  <TableCell style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {transaction.patronName}
                  </TableCell>
                  <TableCell>{transaction.staffName}</TableCell>
                  <TableCell style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell style={{ textTransform: 'capitalize' }}>
                    {transaction.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <StatusBadge className={transaction.status}>
                      {transaction.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{transaction.timestamp.toLocaleString()}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        
        {filteredTransactions.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: 'var(--text-muted)' 
          }}>
            No transactions found matching your criteria
          </div>
        )}
      </ReportSection>
    </ReportingContainer>
  );
};

export default AdvancedReporting;