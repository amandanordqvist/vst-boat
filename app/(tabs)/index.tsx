import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherWidget from '@/components/WeatherWidget';
import VesselStats from '@/components/VesselStats';
import MaintenanceAlerts from '@/components/MaintenanceAlerts';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import VesselOverview from '@/components/VesselOverview';
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
    type: 'checklist' as const,
    title: 'Pre-departure Checklist Completed',
    time: '2h ago',
    user: 'Captain Mike',
  },
  {
    id: '2',
    type: 'maintenance' as const,
    title: 'Propeller Replacement Scheduled',
    time: '5h ago',
    user: 'Maintenance Team',
  },
  {
    id: '3',
    type: 'location' as const,
    title: 'Vessel Docked at Marina Bay',
    time: '8h ago',
    user: 'GPS Tracking',
  },
  {
    id: '4',
    type: 'fuel' as const,
    title: 'Fuel Tank Filled (80 gallons)',
    time: '1d ago',
    user: 'Captain Mike',
  },
];

const vesselData = {
  name: 'Sea Breeze',
  type: 'Yacht',
  length: '42 ft',
  registration: 'FL-1234-AB',
  status: 'Docked',
  location: 'Marina Bay, Slip #42',
  nextTrip: 'Scheduled for May 28, 2023',
  image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
};

// Standardized corner radius for all elements
const CORNER_RADIUS = 16;
// Standardized vertical spacing between sections
const SECTION_SPACING = 24;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <DashboardHeader 
        username="Captain Mike" 
        notifications={3}
        vesselName={vesselData.name}
        vesselStatus={vesselData.status}
        vesselLocation="Marina Bay"
      />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 32 + (Platform.OS === 'ios' ? 100 : 80) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width vessel card */}
        <VesselOverview
          name={vesselData.name}
          type={vesselData.type}
          status={vesselData.status}
          location={vesselData.location}
          image={vesselData.image}
        />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          <WeatherWidget 
            temperature={24}
            condition="Partly Cloudy"
            location="Marina Bay"
            windSpeed={12}
            humidity={65}
            iconUrl="https://cdn.weatherapi.com/weather/64x64/day/116.png"
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vessel Status</Text>
          <VesselStats 
            fuelLevel={75}
            engineHours={1250}
            lastService="May 15, 2023"
            nextService="Aug 15, 2023"
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          <MaintenanceAlerts alerts={maintenanceAlerts} />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActions />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <RecentActivity activities={recentActivities} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100], // Light blue background
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // No padding at top since vessel overview is full-width
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: SECTION_SPACING, // Standardized vertical spacing
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[700],
    marginBottom: 12,
    marginLeft: 4,
    letterSpacing: 0.2, // Slight letter spacing for better readability
  },
});