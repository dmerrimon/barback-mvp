import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB, Chip } from 'react-native-paper';

const SessionsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [sessions, setSessions] = useState([
    {
      id: 'sess-001',
      patronName: 'John Doe',
      tableNumber: '5',
      status: 'active',
      entryTime: new Date(Date.now() - 45 * 60 * 1000),
      totalAmount: 47.50,
      itemsCount: 3,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'sess-002',
      patronName: 'Jane Smith',
      tableNumber: '3',
      status: 'active',
      entryTime: new Date(Date.now() - 30 * 60 * 1000),
      totalAmount: 23.75,
      itemsCount: 1,
      lastActivity: new Date(Date.now() - 2 * 60 * 1000),
      phone: '+1 (555) 987-6543'
    },
    {
      id: 'sess-003',
      patronName: 'Mike Johnson',
      tableNumber: '7',
      status: 'pending_payment',
      entryTime: new Date(Date.now() - 90 * 60 * 1000),
      totalAmount: 89.25,
      itemsCount: 6,
      lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      phone: '+1 (555) 456-7890'
    },
    {
      id: 'sess-004',
      patronName: 'Sarah Wilson',
      tableNumber: '12',
      status: 'completed',
      entryTime: new Date(Date.now() - 120 * 60 * 1000),
      totalAmount: 156.00,
      itemsCount: 8,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      phone: '+1 (555) 321-9876'
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#00D4AA';
      case 'pending_payment': return '#FFD43B';
      case 'completed': return '#51CF66';
      default: return '#8A8A8A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'radio-button-on';
      case 'pending_payment': return 'time';
      case 'completed': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getTimeElapsed = (date) => {
    const minutes = Math.floor((Date.now() - date) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.patronName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.tableNumber.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSessionPress = (session) => {
    navigation.navigate('SessionDetail', { sessionId: session.id });
  };

  const handleAddItems = (session) => {
    navigation.navigate('AddItem', { sessionId: session.id });
  };

  const handleSendNotification = (session) => {
    Alert.alert(
      'Send Notification',
      `Send a notification to ${session.patronName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Order Ready', onPress: () => sendNotification(session, 'Order Ready') },
        { text: 'Custom Message', onPress: () => showCustomMessage(session) },
      ]
    );
  };

  const sendNotification = (session, message) => {
    // Implement notification sending logic
    Alert.alert('Notification Sent', `"${message}" sent to ${session.patronName}`);
  };

  const showCustomMessage = (session) => {
    // Navigate to custom message screen or show input modal
    console.log('Show custom message for', session.patronName);
  };

  const SessionCard = ({ session }) => (
    <TouchableOpacity onPress={() => handleSessionPress(session)}>
      <Card style={styles.sessionCard}>
        <Card.Content>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <Text style={styles.patronName}>{session.patronName}</Text>
              <Text style={styles.tableNumber}>Table {session.tableNumber}</Text>
            </View>
            <View style={styles.sessionStatus}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(session.status) }]}>
                <Ionicons name={getStatusIcon(session.status)} size={12} color="#fcfcfc" />
              </View>
              <Text style={[styles.statusText, { color: getStatusColor(session.status) }]}>
                {session.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.sessionDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#B8B8B8" />
              <Text style={styles.detailText}>Started {getTimeElapsed(session.entryTime)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="receipt-outline" size={16} color="#B8B8B8" />
              <Text style={styles.detailText}>{session.itemsCount} items • ${session.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="pulse-outline" size={16} color="#B8B8B8" />
              <Text style={styles.detailText}>Last activity {getTimeElapsed(session.lastActivity)}</Text>
            </View>
          </View>

          {session.status === 'active' && (
            <View style={styles.sessionActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.addButton]}
                onPress={() => handleAddItems(session)}
              >
                <Ionicons name="add" size={16} color="#fcfcfc" />
                <Text style={styles.actionButtonText}>Add Items</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.notifyButton]}
                onPress={() => handleSendNotification(session)}
              >
                <Ionicons name="notifications" size={16} color="#fcfcfc" />
                <Text style={styles.actionButtonText}>Notify</Text>
              </TouchableOpacity>
            </View>
          )}

          {session.status === 'pending_payment' && (
            <View style={styles.sessionActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.paymentButton]}
                onPress={() => navigation.navigate('Payments', { sessionId: session.id })}
              >
                <Ionicons name="card" size={16} color="#fcfcfc" />
                <Text style={styles.actionButtonText}>Process Payment</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const FilterChips = () => (
    <View style={styles.filterContainer}>
      {['all', 'active', 'pending_payment', 'completed'].map((filter) => (
        <Chip
          key={filter}
          selected={filterStatus === filter}
          onPress={() => setFilterStatus(filter)}
          style={[
            styles.filterChip,
            filterStatus === filter && styles.selectedChip
          ]}
          textStyle={[
            styles.chipText,
            filterStatus === filter && styles.selectedChipText
          ]}
        >
          {filter === 'all' ? 'All' : filter.replace('_', ' ').toUpperCase()}
        </Chip>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8A8A8A" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or table..."
            placeholderTextColor="#8A8A8A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FilterChips />

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionCard session={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00D4AA"
            colors={['#00D4AA']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={styles.fab}
        icon="qr-code-scanner"
        onPress={() => {
          // Navigate to QR scanner for new session
          console.log('Open QR scanner');
        }}
        color="#fcfcfc"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32302f',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#403E3B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fcfcfc',
    fontWeight: '400',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#4A4845',
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: '#00D4AA',
  },
  chipText: {
    color: '#B8B8B8',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fcfcfc',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sessionCard: {
    backgroundColor: '#403E3B',
    marginBottom: 12,
    borderRadius: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  patronName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fcfcfc',
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 14,
    color: '#B8B8B8',
    fontWeight: '500',
  },
  sessionStatus: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sessionDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#B8B8B8',
    marginLeft: 8,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButton: {
    backgroundColor: '#00D4AA',
  },
  notifyButton: {
    backgroundColor: '#0091FF',
  },
  paymentButton: {
    backgroundColor: '#FFD43B',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fcfcfc',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#00D4AA',
  },
});

export default SessionsScreen;