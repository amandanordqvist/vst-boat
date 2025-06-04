import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import DashboardHeader from '@/components/DashboardHeader';
import { EnhancedEmergencyInterface } from '@/components/EnhancedEmergencyInterface';
import { EnhancedNotificationCenter } from '@/components/EnhancedNotificationCenter';
import { CrewManagement } from '@/components/CrewManagement';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

function TabOneScreen() {
  const [selectedView, setSelectedView] = useState<'dashboard' | 'crew' | 'analytics'>('dashboard');

  if (selectedView === 'crew') {
    return (
      <CrewManagement 
        onCrewUpdated={() => {}} 
        onBack={() => setSelectedView('dashboard')}
      />
    );
  }

  if (selectedView === 'analytics') {
    return (
      <AnalyticsDashboard 
        onExportData={() => Alert.alert('Export', 'Analytics data exported successfully')} 
        onBack={() => setSelectedView('dashboard')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <DashboardHeader 
        username="Captain"
        notifications={4}
        vesselName="M/Y Seahawk"
        vesselStatus="Operational"
        vesselLocation="Stockholm Archipelago"
      />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Weather Widget */}
        <View style={styles.weatherCard}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.weatherGradient}
          >
            <View style={styles.weatherInfo}>
              <View>
                <Text style={styles.temperature}>18°C</Text>
                <Text style={styles.weatherDescription}>Partly Cloudy</Text>
              </View>
              <Ionicons name="partly-sunny" size={50} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Ionicons name="water" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>Wind: 8 kn SW</Text>
              </View>
              <View style={styles.weatherDetail}>
                <Ionicons name="eye" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherDetailText}>Visibility: 10+ km</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => setSelectedView('crew')}
            >
              <LinearGradient
                colors={[Colors.status.success, '#27AE60']}
                style={styles.actionGradient}
              >
                <Ionicons name="people" size={24} color="#fff" />
                <Text style={styles.actionText}>Crew</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => setSelectedView('analytics')}
            >
              <LinearGradient
                colors={[Colors.primary[600], Colors.primary[700]]}
                style={styles.actionGradient}
              >
                <Ionicons name="analytics" size={24} color="#fff" />
                <Text style={styles.actionText}>Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.actionGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.actionText}>Checklist</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.actionGradient}
              >
                <Ionicons name="map" size={24} color="#fff" />
                <Text style={styles.actionText}>Navigate</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Status */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="battery-charging" size={20} color={Colors.status.success} />
                <Text style={styles.statusTitle}>Battery</Text>
              </View>
              <Text style={styles.statusValue}>92%</Text>
              <Text style={styles.statusSubtext}>All systems operational</Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="water" size={20} color={Colors.primary[600]} />
                <Text style={styles.statusTitle}>Fuel</Text>
              </View>
              <Text style={styles.statusValue}>68%</Text>
              <Text style={styles.statusSubtext}>~280L remaining</Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="speedometer" size={20} color={Colors.status.warning} />
                <Text style={styles.statusTitle}>Engine</Text>
              </View>
              <Text style={styles.statusValue}>247h</Text>
              <Text style={styles.statusSubtext}>Service due: 253h</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.status.success }]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Pre-departure checklist completed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.primary[600] }]}>
                <Ionicons name="location" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Departed from Sandhamn Marina</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: Colors.status.warning }]}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Maintenance photo uploaded</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Crew Management Quick Access */}
        <View style={styles.crewQuickAccess}>
          <View style={styles.crewHeader}>
            <Text style={styles.sectionTitle}>Crew Status</Text>
            <TouchableOpacity onPress={() => setSelectedView('crew')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.crewList}>
            <View style={styles.crewMember}>
              <View style={styles.crewAvatar}>
                <Text style={styles.crewInitials}>JA</Text>
              </View>
              <View style={styles.crewInfo}>
                <Text style={styles.crewName}>John Anderson</Text>
                <Text style={styles.crewRole}>Owner • Active now</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: Colors.status.success }]} />
            </View>

            <View style={styles.crewMember}>
              <View style={styles.crewAvatar}>
                <Text style={styles.crewInitials}>SJ</Text>
              </View>
              <View style={styles.crewInfo}>
                <Text style={styles.crewName}>Sarah Johnson</Text>
                <Text style={styles.crewRole}>Captain • 2h ago</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: Colors.status.warning }]} />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <EnhancedNotificationCenter />

        {/* Emergency Interface */}
        <EnhancedEmergencyInterface />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  scrollView: {
    flex: 1,
  },

  weatherCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  weatherGradient: {
    padding: 20,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherDetailText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  statusSubtext: {
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'right',
    marginTop: 2,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  activityTime: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  crewQuickAccess: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  crewList: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  crewMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  crewInitials: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  crewRole: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TabOneScreen;