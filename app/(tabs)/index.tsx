import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherWidget from '@/components/WeatherWidget';
import VesselStats from '@/components/VesselStats';
import MaintenanceAlerts from '@/components/MaintenanceAlerts';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import WeatherForecast from '@/components/WeatherForecast';
import VesselSummaryCard from '@/components/VesselSummaryCard';
import CriticalAlerts from '@/components/CriticalAlerts';
import MaintenanceProgressBar from '@/components/MaintenanceProgressBar';
import MaintenanceScheduleTimeline from '@/components/MaintenanceScheduleTimeline';
import { DocumentCardList } from '@/components/DocumentCard';
import { useUserRole } from '@/contexts/UserRoleContext';
import Colors from '@/constants/Colors';

// Sample data
const maintenanceAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    title: 'Engine Service Overdue',
    message: 'Service is 45 days overdue. Schedule immediately.',
    route: '/(tabs)/maintenance',
  },
  {
    id: '2',
    type: 'attention' as const,
    title: 'Hull Cleaning Reminder',
    message: 'Recommended cleaning in 7 days.',
    route: '/(tabs)/maintenance',
  },
  {
    id: '3',
    type: 'ready' as const,
    title: 'Safety Equipment Check',
    message: 'All safety equipment is up-to-date.',
    route: '/(tabs)/maintenance',
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

// Weather forecast data
const weatherForecast = [
  {
    id: '1',
    day: 'Today',
    date: 'May 24',
    temperature: 24,
    condition: 'Partly Cloudy',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
    windSpeed: 12,
    precipitation: 0,
  },
  {
    id: '2',
    day: 'Tomorrow',
    date: 'May 25',
    temperature: 26,
    condition: 'Sunny',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
    windSpeed: 8,
    precipitation: 0,
  },
  {
    id: '3',
    day: 'Saturday',
    date: 'May 26',
    temperature: 23,
    condition: 'Cloudy',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/119.png',
    windSpeed: 10,
    precipitation: 0,
  },
  {
    id: '4',
    day: 'Sunday',
    date: 'May 27',
    temperature: 22,
    condition: 'Light Rain',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/296.png',
    windSpeed: 15,
    precipitation: 2.3,
  },
  {
    id: '5',
    day: 'Monday',
    date: 'May 28',
    temperature: 20,
    condition: 'Rain',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/308.png',
    windSpeed: 18,
    precipitation: 5.7,
  },
];

// Weather alerts data
const weatherAlerts = [
  {
    id: 'wa1',
    severity: 'watch' as const,
    title: 'Small Craft Advisory',
    description: 'Wind speeds of 15-20 knots expected. Small vessels should exercise caution.',
    validUntil: 'May 25, 8:00 PM',
  }
];

// Maintenance schedule
const maintenanceSchedule = [
  {
    id: 'm1',
    title: 'Engine Service',
    description: 'Regular engine maintenance including oil change and filter replacement',
    date: 'June 3, 2023',
    isCompleted: false,
    isUpcoming: true,
    type: 'service' as const,
    route: '/(tabs)/maintenance',
  },
  {
    id: 'm2',
    title: 'Hull Inspection',
    description: 'Underwater hull inspection and cleaning',
    date: 'June 15, 2023',
    isCompleted: false,
    isUpcoming: true,
    type: 'inspection' as const,
    route: '/(tabs)/maintenance',
  },
  {
    id: 'm3',
    title: 'Safety Equipment Check',
    description: 'Inspection of all safety equipment onboard',
    date: 'May 12, 2023',
    isCompleted: true,
    isUpcoming: false,
    type: 'inspection' as const,
    route: '/(tabs)/maintenance',
  }
];

// Vessel documents
const vesselDocuments = [
  {
    id: 'd1',
    title: 'Vessel Registration',
    documentType: 'pdf' as const,
    dateAdded: 'Jan 15, 2023',
    size: '1.2 MB',
    category: 'Legal',
    onView: () => console.log('View document'),
  },
  {
    id: 'd2',
    title: 'Insurance Policy',
    documentType: 'pdf' as const,
    dateAdded: 'Mar 10, 2023',
    size: '2.4 MB',
    category: 'Legal',
    onView: () => console.log('View document'),
  },
  {
    id: 'd3',
    title: 'Engine Manual',
    documentType: 'pdf' as const,
    dateAdded: 'Feb 22, 2023',
    size: '4.7 MB',
    category: 'Manuals',
    onView: () => console.log('View document'),
  }
];

const vesselData = {
  name: 'Sea Breeze',
  type: 'Yacht',
  length: '42 ft',
  registration: 'FL-1234-AB',
  status: 'docked',
  location: 'Marina Bay, Slip #42',
  nextTrip: {
    destination: 'Catalina Island',
    date: 'May 28, 2023',
    time: '9:00 AM',
  },
  image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
};

// Standardized corner radius for all elements
const CORNER_RADIUS = 18;
// Tab bar height + extra safety margin
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  // We'll default to 'owner' for now, but in a real app this would come from context
  // const { role } = useUserRole();
  const role = 'owner';
  
  // Get only critical and attention alerts
  const criticalAlerts = maintenanceAlerts.filter(
    alert => alert.type === 'critical' || alert.type === 'attention'
  );
  
  // Determine which components to show based on user role
  const showDocuments = ['owner', 'captain'].includes(role);
  const showMaintenanceSchedule = ['owner', 'captain', 'maintenance'].includes(role);
  
  return (
    <View style={styles.container}>
      <DashboardHeader 
        username="Captain Mike" 
        notifications={3}
        vesselName={vesselData.name}
        vesselStatus="Docked"
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
        {/* Content with padding */}
        <View style={styles.contentSection}>
          {/* Scroll indicator */}
          <View style={styles.scrollIndicator}>
            <ChevronDown size={20} color={Colors.primary[400]} />
          </View>
          
          {/* Critical Alerts - Only shown if there are critical alerts */}
          {criticalAlerts.length > 0 && (
            <CriticalAlerts alerts={criticalAlerts} />
          )}
          
          {/* Vessel Summary Card */}
          <VesselSummaryCard 
            vesselName={vesselData.name}
            vesselType={vesselData.type}
            status="docked"
            location={vesselData.location}
            nextTrip={vesselData.nextTrip}
            imageUrl={vesselData.image}
          />
          
          {/* Quick Actions Section */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.headingLine} />
          </View>
          
          <QuickActions />
          
          {/* Vessel Stats */}
          <VesselStats 
            fuelLevel={75}
            engineHours={1250}
            lastService="May 15, 2023"
            nextService="Aug 15, 2023"
          />
          
          {/* Weather Section */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Weather</Text>
            <View style={styles.headingLine} />
          </View>
          
          {/* Weather Widget */}
          <WeatherWidget 
            temperature={24}
            condition="Partly Cloudy"
            location="Marina Bay"
            windSpeed={12}
            humidity={65}
            iconUrl="https://cdn.weatherapi.com/weather/64x64/day/116.png"
          />
          
          {/* Weather Forecast with Alerts */}
          <WeatherForecast 
            forecast={weatherForecast} 
            alerts={weatherAlerts}
          />
          
          {/* Maintenance Progress Section */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Maintenance Status</Text>
            <View style={styles.headingLine} />
          </View>
          
          {/* Maintenance Progress Bars */}
          <MaintenanceProgressBar
            label="Engine Service"
            completed={8}
            total={10}
            dueDate="June 20, 2023"
            onPress={() => console.log('Navigate to maintenance')}
          />
          
          <MaintenanceProgressBar
            label="Hull Cleaning"
            completed={2}
            total={6}
            dueDate="July 15, 2023"
            onPress={() => console.log('Navigate to maintenance')}
          />
          
          {/* Maintenance Schedule */}
          {showMaintenanceSchedule && (
            <MaintenanceScheduleTimeline 
              events={maintenanceSchedule}
              title="Upcoming Maintenance"
            />
          )}
          
          {/* Documents Section - Only shown for owner and captain */}
          {showDocuments && (
            <>
              <View style={styles.sectionHeading}>
                <View style={styles.headingLine} />
                <Text style={styles.sectionTitle}>Documents</Text>
                <View style={styles.headingLine} />
              </View>
              
              <DocumentCardList 
                documents={vesselDocuments}
                title="Recent Documents"
              />
            </>
          )}
          
          {/* Activity Section */}
          <View style={styles.sectionHeading}>
            <View style={styles.headingLine} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.headingLine} />
          </View>
          
          {/* Recent Activity */}
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
  contentSection: {
    paddingHorizontal: 16,
    marginTop: -20, // Adjusted to match VesselStats marginTop
  },
  scrollIndicator: {
    alignItems: 'center',
    marginBottom: 12,
    height: 24,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
    marginHorizontal: 16,
    letterSpacing: 0.2, // Slight letter spacing for better readability
  },
});