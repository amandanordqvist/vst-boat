import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Fuel, Gauge, MapPin, Clock, Battery, Thermometer } from 'lucide-react-native';
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
import PerformanceMetrics from '@/components/PerformanceMetrics';
import LiveStatusWidget from '@/components/LiveStatusWidget';
import SmartNotifications from '@/components/SmartNotifications';
import EmergencyDashboard from '@/components/EmergencyDashboard';
import ModernCard from '@/components/ModernCard';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import { ShimmerCard, ShimmerMetric } from '@/components/ShimmerLoader';
import { useUserRole } from '@/contexts/UserRoleContext';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

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

interface NextTrip {
  destination: string;
  date: string;
  time: string;
}

const getNextTripWeather = (nextTrip: NextTrip | undefined) => {
  if (!nextTrip) return {};
  // Try to find a matching forecast by date
  const forecast = weatherForecast.find(f => f.date === nextTrip.date);
  if (forecast) {
    return {
      weatherIconUrl: forecast.iconUrl,
      weatherCondition: forecast.condition,
    };
  }
  return {};
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  // We'll default to 'owner' for now, but in a real app this would come from context
  // const { role } = useUserRole();
  const role = 'owner';
  
  // Loading state for demo purposes
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values for staggered loading
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  
  useEffect(() => {
    // Simulate loading time and start animations
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);
    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim]);
  
  // Get only critical and attention alerts
  const criticalAlerts = maintenanceAlerts.filter(
    alert => alert.type === 'critical' || alert.type === 'attention'
  );
  
  // Determine which components to show based on user role
  const showDocuments = ['owner', 'captain'].includes(role);
  const showMaintenanceSchedule = ['owner', 'captain', 'maintenance'].includes(role);
  const showPerformanceMetrics = ['owner', 'captain'].includes(role);
  const showEmergencyDashboard = true; // Always show for safety
  
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
          <Animated.View 
            style={[
              styles.scrollIndicator,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
              }
            ]}
          >
            <View style={styles.scrollIndicatorDot} />
          </Animated.View>
          
          {/* Vessel Summary Card - Top Priority */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <ModernCard variant="default">
              <VesselSummaryCard 
                vesselName={vesselData.name}
                vesselType={vesselData.type}
                status="docked"
                location={vesselData.location}
                nextTrip={{
                  ...vesselData.nextTrip,
                  ...getNextTripWeather(vesselData.nextTrip),
                }}
                imageUrl={vesselData.image}
              />
            </ModernCard>
          </Animated.View>
          
          {/* Key Metrics - Vessel Stats */}
          {isLoading ? (
            <View style={styles.metricsGrid}>
              <ShimmerMetric />
              <ShimmerMetric />
              <ShimmerMetric />
              <ShimmerMetric />
            </View>
          ) : (
            <Animated.View 
              style={[
                styles.metricsGrid,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.metricCard}>
                <EnhancedMetricCard
                  title="Fuel Level"
                  value={75}
                  unit="%"
                  percentage={75}
                  status="good"
                  variant="minimal"
                  icon={<Fuel size={16} color={Colors.primary[600]} />}
                  onPress={() => router.push('/(tabs)/fuel')}
                  size="small"
                />
              </View>
              
              <View style={styles.metricCard}>
                <EnhancedMetricCard
                  title="Engine Temp"
                  value={92}
                  unit="°C"
                  status="normal"
                  variant="minimal"
                  icon={<Thermometer size={16} color={Colors.primary[600]} />}
                  size="small"
                />
              </View>
              
              <View style={styles.metricCard}>
                <EnhancedMetricCard
                  title="Battery"
                  value={87}
                  unit="%"
                  percentage={87}
                  status="good"
                  variant="minimal"
                  icon={<Battery size={16} color={Colors.primary[600]} />}
                  size="small"
                />
              </View>
              
              <View style={styles.metricCard}>
                <EnhancedMetricCard
                  title="RPM"
                  value="2,450"
                  status="normal"
                  variant="minimal"
                  icon={<Gauge size={16} color={Colors.primary[600]} />}
                  size="small"
                />
              </View>
            </Animated.View>
          )}
          
          {/* Weather Information - Critical for Maritime Operations */}
          <ModernCard variant="default">
            <WeatherWidget 
              temperature={24}
              condition="Partly Cloudy"
              location="Marina Bay"
              windSpeed={12}
              humidity={65}
              iconUrl="https://cdn.weatherapi.com/weather/64x64/day/116.png"
            />
          </ModernCard>
          
          {/* Smart Notifications - Important Alerts */}
          <SmartNotifications maxVisible={2} />
          
          {/* Quick Actions - Common Tasks */}
          <QuickActions />
          
          {/* Performance Metrics - Analytics */}
          {showPerformanceMetrics && (
            <ModernCard variant="default">
              <PerformanceMetrics 
                fuelEfficiency={8.5}
                engineLoad={65}
                avgSpeed={12.5}
                totalDistance={125}
                operatingHours={42}
                maintenanceScore={87}
              />
            </ModernCard>
          )}
          
          {/* Maintenance Overview - Service Tracking */}
          <MaintenanceProgressBar
            label="Engine Service"
            completed={8}
            total={10}
            dueDate="June 20, 2023"
            onPress={() => router.push('/(tabs)/maintenance')}
          />
          
          {/* Documents - Administrative */}
          {showDocuments && (
            <DocumentCardList 
              documents={vesselDocuments}
              title="Important Documents"
            />
          )}
          
          {/* Recent Activity - History */}
          <RecentActivity activities={recentActivities} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50], // Clean light background
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // No padding at top since vessel overview is full-width
  },
  contentSection: {
    paddingHorizontal: 16,
    marginTop: -12,
  },
  scrollIndicator: {
    alignItems: 'center',
    marginBottom: 8,
    height: 20,
  },
  scrollIndicatorDot: {
    width: 32,
    height: 4,
    backgroundColor: Colors.neutral[400],
    borderRadius: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 12,
  },
  metricCard: {
    width: '48%',
    minHeight: 100,
  },
});