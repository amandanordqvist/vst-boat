import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherWidget from '@/components/WeatherWidget';
import VesselStats from '@/components/VesselStats';
import MaintenanceAlerts from '@/components/MaintenanceAlerts';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import Colors from '@/constants/Colors';

// Sample data
const maintenanceAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    title: 'Engine Service Overdue',
    message: 'Service is 45 days overdue. Schedule immediately.',
  },
  {
    id: '2',
    type: 'attention' as const,
    title: 'Hull Cleaning Reminder',
    message: 'Recommended cleaning in 7 days.',
  },
  {
    id: '3',
    type: 'ready' as const,
    title: 'Safety Equipment Check',
    message: 'All safety equipment is up-to-date.',
  },
];

const recentActivities = [
  {
    id: '1',
    type: 'checklist',
    title: 'Pre-departure Checklist Completed',
    time: '2h ago',
    user: 'Captain Mike',
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Propeller Replacement Scheduled',
    time: '5h ago',
    user: 'Maintenance Team',
  },
  {
    id: '3',
    type: 'location',
    title: 'Vessel Docked at Marina Bay',
    time: '8h ago',
    user: 'GPS Tracking',
  },
  {
    id: '4',
    type: 'fuel',
    title: 'Fuel Tank Filled (80 gallons)',
    time: '1d ago',
    user: 'Captain Mike',
  },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <DashboardHeader username="Captain" notifications={3} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 16 + (Platform.OS !== 'web' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <WeatherWidget 
          temperature={24}
          condition="Partly Cloudy"
          location="Marina Bay"
          windSpeed={12}
          humidity={65}
          iconUrl="https://cdn.weatherapi.com/weather/64x64/day/116.png"
        />
        
        <VesselStats 
          fuelLevel={75}
          engineHours={1250}
          lastService="May 15, 2025"
          nextService="Aug 15, 2025"
        />
        
        <MaintenanceAlerts alerts={maintenanceAlerts} />
        
        <QuickActions />
        
        <RecentActivity activities={recentActivities} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
  },
});