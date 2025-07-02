import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph } from 'react-native-paper';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    activeSessions: 23,
    todayRevenue: 2847.50,
    averageTab: 41.25,
    pendingOrders: 8,
    recentActivity: [
      { id: 1, action: 'New session started', patron: 'John Doe', time: '2 min ago', table: 'Table 5' },
      { id: 2, action: 'Payment completed', patron: 'Jane Smith', time: '5 min ago', amount: '$67.50' },
      { id: 3, action: 'Item added', patron: 'Mike Johnson', time: '8 min ago', item: 'Craft IPA' },
      { id: 4, action: 'Session ended', patron: 'Sarah Wilson', time: '12 min ago', table: 'Table 3' },
    ]
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.statGradient}
      >
        <View style={styles.statHeader}>
          <Ionicons name={icon} size={24} color="#fcfcfc" />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={styles.activityContent}>
        <Text style={styles.activityAction}>{activity.action}</Text>
        <Text style={styles.activityDetails}>
          {activity.patron}
          {activity.table && ` • ${activity.table}`}
          {activity.amount && ` • ${activity.amount}`}
          {activity.item && ` • ${activity.item}`}
        </Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00D4AA"
            colors={['#00D4AA']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening</Text>
            <Text style={styles.venueName}>The Digital Tap</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fcfcfc" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Active Sessions"
            value={dashboardData.activeSessions}
            subtitle="23% from yesterday"
            icon="people"
            color="#00D4AA"
            onPress={() => navigation.navigate('Sessions')}
          />
          <StatCard
            title="Today's Revenue"
            value={`$${dashboardData.todayRevenue.toLocaleString()}`}
            subtitle="15% increase"
            icon="trending-up"
            color="#0091FF"
            onPress={() => navigation.navigate('Payments')}
          />
          <StatCard
            title="Average Tab"
            value={`$${dashboardData.averageTab}`}
            subtitle="Per session"
            icon="card"
            color="#FF6B6B"
          />
          <StatCard
            title="Pending Orders"
            value={dashboardData.pendingOrders}
            subtitle="Requires attention"
            icon="time"
            color="#FFD43B"
          />
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Sessions')}
              >
                <Ionicons name="people-outline" size={24} color="#00D4AA" />
                <Text style={styles.actionText}>View Sessions</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddItem')}
              >
                <Ionicons name="add-circle-outline" size={24} color="#00D4AA" />
                <Text style={styles.actionText}>Add Items</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="notifications-outline" size={24} color="#00D4AA" />
                <Text style={styles.actionText}>Send Alert</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Payments')}
              >
                <Ionicons name="card-outline" size={24} color="#00D4AA" />
                <Text style={styles.actionText}>Process Payment</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            <View style={styles.activityList}>
              {dashboardData.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Activity</Text>
              <Ionicons name="chevron-forward" size={16} color="#00D4AA" />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#32302f',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#B8B8B8',
    fontWeight: '400',
  },
  venueName: {
    fontSize: 24,
    color: '#fcfcfc',
    fontWeight: '700',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fcfcfc',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    marginRight: 16,
  },
  statGradient: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fcfcfc',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fcfcfc',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#fcfcfcCC',
    fontWeight: '400',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#403E3B',
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fcfcfc',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A4845',
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fcfcfc',
    marginTop: 8,
    textAlign: 'center',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4845',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D4AA',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fcfcfc',
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 13,
    color: '#B8B8B8',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
    marginRight: 4,
  },
});

export default DashboardScreen;