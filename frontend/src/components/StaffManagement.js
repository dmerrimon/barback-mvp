import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const StaffContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const StaffHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const StaffStats = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background-color: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  text-align: center;
  min-width: 120px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
`;

const StaffCard = styled.div`
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

const StaffCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const StaffInfo = styled.div`
  flex: 1;
`;

const StaffName = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
`;

const StaffEmail = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.8rem;
  font-weight: 500;
  
  &.owner {
    background-color: rgba(255, 215, 0, 0.1);
    color: #ffd700;
  }
  
  &.manager {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--accent-primary);
  }
  
  &.bartender {
    background-color: rgba(0, 145, 255, 0.1);
    color: var(--accent-secondary);
  }
  
  &.server {
    background-color: rgba(139, 69, 19, 0.1);
    color: #8b4513;
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

const StaffDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
`;

const StaffActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const PermissionsList = styled.div`
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`;

const PermissionsTitle = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PermissionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const PermissionTag = styled.span`
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
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
  padding: var(--spacing-md);
`;

const ModalContent = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ModalTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  
  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
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
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const PermissionCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--bg-hover);
  }
  
  input {
    margin: 0;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
`;

const StaffManagement = () => {
  const { success, error: showError } = useToast();
  
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Role definitions with permissions
  const roleDefinitions = {
    owner: {
      name: 'Owner',
      permissions: ['all']
    },
    manager: {
      name: 'Manager',
      permissions: [
        'view_analytics', 'manage_staff', 'manage_menu', 'manage_beacons',
        'view_sessions', 'manage_sessions', 'process_payments', 'send_notifications'
      ]
    },
    bartender: {
      name: 'Bartender',
      permissions: [
        'view_sessions', 'manage_sessions', 'add_items', 'send_notifications'
      ]
    },
    server: {
      name: 'Server',
      permissions: [
        'view_sessions', 'add_items'
      ]
    }
  };

  const allPermissions = [
    'view_analytics', 'manage_staff', 'manage_menu', 'manage_beacons',
    'view_sessions', 'manage_sessions', 'add_items', 'process_payments',
    'send_notifications', 'manage_venue_settings'
  ];

  // Mock staff data
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 'staff-1',
      name: 'Sarah Martinez',
      email: 'sarah@digitaltap.com',
      phone: '+1 (555) 123-4567',
      role: 'manager',
      isActive: true,
      joinDate: new Date('2023-01-15'),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: roleDefinitions.manager.permissions
    },
    {
      id: 'staff-2',
      name: 'Mike Johnson',
      email: 'mike@digitaltap.com',
      phone: '+1 (555) 987-6543',
      role: 'bartender',
      isActive: true,
      joinDate: new Date('2023-03-20'),
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      permissions: roleDefinitions.bartender.permissions
    },
    {
      id: 'staff-3',
      name: 'Emily Chen',
      email: 'emily@digitaltap.com',
      phone: '+1 (555) 456-7890',
      role: 'server',
      isActive: true,
      joinDate: new Date('2023-06-10'),
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      permissions: roleDefinitions.server.permissions
    },
    {
      id: 'staff-4',
      name: 'David Wilson',
      email: 'david@digitaltap.com',
      phone: '+1 (555) 321-9876',
      role: 'bartender',
      isActive: false,
      joinDate: new Date('2023-02-28'),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      permissions: roleDefinitions.bartender.permissions
    }
  ]);

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'bartender',
    isActive: true,
    permissions: []
  });

  useEffect(() => {
    // Update permissions when role changes
    if (staffForm.role && roleDefinitions[staffForm.role]) {
      setStaffForm(prev => ({
        ...prev,
        permissions: [...roleDefinitions[staffForm.role].permissions]
      }));
    }
  }, [staffForm.role]);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      role: 'bartender',
      isActive: true,
      permissions: [...roleDefinitions.bartender.permissions]
    });
    setShowStaffModal(true);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      isActive: staff.isActive,
      permissions: [...staff.permissions]
    });
    setShowStaffModal(true);
  };

  const handleSaveStaff = async () => {
    if (!staffForm.name || !staffForm.email || !staffForm.role) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const newStaff = {
        id: editingStaff?.id || `staff-${Date.now()}`,
        name: staffForm.name,
        email: staffForm.email,
        phone: staffForm.phone,
        role: staffForm.role,
        isActive: staffForm.isActive,
        permissions: staffForm.permissions,
        joinDate: editingStaff?.joinDate || new Date(),
        lastLogin: editingStaff?.lastLogin || null
      };

      if (editingStaff) {
        setStaffMembers(prev => prev.map(staff => 
          staff.id === editingStaff.id ? newStaff : staff
        ));
      } else {
        setStaffMembers(prev => [...prev, newStaff]);
      }

      success(editingStaff ? 'Staff member updated successfully!' : 'Staff member added successfully!');
      setShowStaffModal(false);
      setEditingStaff(null);
    } catch (err) {
      showError('Failed to save staff member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(prev => prev.filter(staff => staff.id !== staffId));
      success('Staff member deleted successfully!');
    }
  };

  const handleToggleActive = (staffId) => {
    setStaffMembers(prev => prev.map(staff => 
      staff.id === staffId ? { ...staff, isActive: !staff.isActive } : staff
    ));
    success('Staff status updated successfully!');
  };

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setStaffForm(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setStaffForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const activeStaff = staffMembers.filter(staff => staff.isActive).length;
  const totalStaff = staffMembers.length;
  const managerCount = staffMembers.filter(staff => staff.role === 'manager').length;
  const bartenderCount = staffMembers.filter(staff => staff.role === 'bartender').length;

  return (
    <StaffContainer>
      <StaffHeader>
        <StaffStats>
          <StatCard>
            <StatNumber>{activeStaff}</StatNumber>
            <StatLabel>Active Staff</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{totalStaff}</StatNumber>
            <StatLabel>Total Staff</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{managerCount}</StatNumber>
            <StatLabel>Managers</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{bartenderCount}</StatNumber>
            <StatLabel>Bartenders</StatLabel>
          </StatCard>
        </StaffStats>
        
        <ActionButton className="primary" onClick={handleAddStaff}>
          <Plus size={16} />
          Add Staff Member
        </ActionButton>
      </StaffHeader>

      <StaffGrid>
        {staffMembers.map(staff => (
          <StaffCard key={staff.id}>
            <StaffCardHeader>
              <StaffInfo>
                <StaffName>{staff.name}</StaffName>
                <StaffEmail>{staff.email}</StaffEmail>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <RoleBadge className={staff.role}>
                    <Shield size={12} />
                    {roleDefinitions[staff.role]?.name || staff.role}
                  </RoleBadge>
                  <StatusBadge className={staff.isActive ? 'active' : 'inactive'}>
                    {staff.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </div>
              </StaffInfo>
            </StaffCardHeader>

            <StaffDetails>
              {staff.phone && (
                <DetailRow>
                  <Phone size={14} />
                  {staff.phone}
                </DetailRow>
              )}
              <DetailRow>
                <Calendar size={14} />
                Joined {staff.joinDate.toLocaleDateString()}
              </DetailRow>
              {staff.lastLogin && (
                <DetailRow>
                  <Clock size={14} />
                  Last login {staff.lastLogin.toLocaleString()}
                </DetailRow>
              )}
            </StaffDetails>

            <PermissionsList>
              <PermissionsTitle>
                <Key size={12} />
                Permissions
              </PermissionsTitle>
              <PermissionTags>
                {staff.permissions.includes('all') ? (
                  <PermissionTag>All Permissions</PermissionTag>
                ) : (
                  staff.permissions.slice(0, 3).map(permission => (
                    <PermissionTag key={permission}>
                      {permission.replace('_', ' ')}
                    </PermissionTag>
                  ))
                )}
                {staff.permissions.length > 3 && !staff.permissions.includes('all') && (
                  <PermissionTag>+{staff.permissions.length - 3} more</PermissionTag>
                )}
              </PermissionTags>
            </PermissionsList>

            <StaffActions>
              <ActionButton 
                className="secondary" 
                style={{ padding: '0.5rem' }}
                onClick={() => handleToggleActive(staff.id)}
              >
                {staff.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
              </ActionButton>
              <ActionButton 
                className="secondary" 
                style={{ padding: '0.5rem' }}
                onClick={() => handleEditStaff(staff)}
              >
                <Edit size={14} />
              </ActionButton>
              <ActionButton 
                className="danger" 
                style={{ padding: '0.5rem' }}
                onClick={() => handleDeleteStaff(staff.id)}
              >
                <Trash2 size={14} />
              </ActionButton>
            </StaffActions>
          </StaffCard>
        ))}
      </StaffGrid>

      {/* Staff Modal */}
      {showStaffModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </ModalTitle>
              <CloseButton onClick={() => setShowStaffModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormGrid>
              <FormField>
                <Label>Full Name *</Label>
                <Input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </FormField>
              
              <FormField>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </FormField>
              
              <FormField>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </FormField>
              
              <FormField>
                <Label>Role *</Label>
                <Select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                    <option key={roleKey} value={roleKey}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </FormGrid>
            
            <FormField>
              <Label>
                <input
                  type="checkbox"
                  checked={staffForm.isActive}
                  onChange={(e) => setStaffForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Active (can access the system)
              </Label>
            </FormField>
            
            <FormField>
              <Label>Permissions</Label>
              <PermissionsGrid>
                {allPermissions.map(permission => (
                  <PermissionCheckbox key={permission}>
                    <input
                      type="checkbox"
                      checked={staffForm.permissions.includes(permission) || staffForm.permissions.includes('all')}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                      disabled={staffForm.permissions.includes('all')}
                    />
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </PermissionCheckbox>
                ))}
              </PermissionsGrid>
            </FormField>
            
            <ModalActions>
              <ActionButton className="secondary" onClick={() => setShowStaffModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton className="primary" onClick={handleSaveStaff} disabled={isSaving}>
                <Save size={16} />
                {isSaving ? 'Saving...' : editingStaff ? 'Update Staff' : 'Add Staff'}
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </StaffContainer>
  );
};

export default StaffManagement;