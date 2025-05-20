import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherWidget from '@/components/WeatherWidget';
import VesselStats from '@/components/VesselStats';
import MaintenanceAlerts from '@/components/MaintenanceAlerts';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import VesselOverview from '@/components/VesselOverview';
import ChecklistButton from '@/components/ChecklistButton';
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
const CORNER_RADIUS = 20;
// Standardized vertical spacing between sections
const SECTION_SPACING = 24;
// Tab bar height + extra safety margin
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

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
          { paddingBottom: TAB_BAR_HEIGHT + 24 } // Fixed bottom padding to prevent overlap
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Debug Navigation Button */}
        <View style={styles.debugButtonContainer}>
          <ChecklistButton />
        </View>
        
        {/* Vessel overview section */}
        <View style={styles.vesselImageSection}>
          <VesselOverview
            name={vesselData.name}
            type={vesselData.type}
            status={vesselData.status}
            location={vesselData.location}
            image={vesselData.image}
          />
        </View>
        
        {/* All remaining content with padding */}
        <View style={styles.contentSection}>
          {/* Scroll indicator */}
          <View style={styles.scrollIndicator}>
            <ChevronDown size={20} color={Colors.primary[400]} />
          </View>
          
          <VesselStats 
            fuelLevel={75}
            engineHours={1250}
            lastService="May 15, 2023"
            nextService="Aug 15, 2023"
          />
          
          {/* Section divider with heading */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Current Conditions</Text>
            <View style={styles.headingLine} />
          </View>
          
          <WeatherWidget 
            temperature={24}
            condition="Partly Cloudy"
            location="Marina Bay"
            windSpeed={12}
            humidity={65}
            iconUrl="https://cdn.weatherapi.com/weather/64x64/day/116.png"
          />
          
          {/* Section divider with heading */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Maintenance</Text>
            <View style={styles.headingLine} />
          </View>
          
          <MaintenanceAlerts alerts={maintenanceAlerts} />
          
          {/* Section divider with heading */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.headingLine} />
          </View>
          
          <QuickActions />
          
          {/* Section divider with heading */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.headingLine} />
          </View>
          
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
  },
  vesselImageSection: {
    width: '100%',
    overflow: 'hidden',
  },
  contentSection: {
    paddingHorizontal: 16,
    marginTop: -20, // Adjusted to match VesselStats marginTop
  },
  scrollIndicator: {
    alignItems: 'center',
    marginBottom: 8,
    height: 20,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  headingLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.primary[300],
    opacity: 0.5,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[700],
    marginHorizontal: 12,
    letterSpacing: 0.2, // Slight letter spacing for better readability
  },
  debugButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
});