import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Droplets, Gauge, Clock, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import StatItem from './StatItem';

interface VesselStatsProps {
  fuelLevel: number;
  engineHours: number;
  lastService: string;
  nextService: string;
}

export default function VesselStats({ 
  fuelLevel, 
  engineHours, 
  lastService, 
  nextService 
}: VesselStatsProps) {
  // Determine fuel level status
  const getFuelStatus = () => {
    if (fuelLevel > 50) return 'good';
    if (fuelLevel > 25) return 'warning';
    return 'alert';
  };
  
  // Determine engine hours status (example threshold)
  const getEngineStatus = () => {
    if (engineHours < 1000) return 'good';
    if (engineHours < 1500) return 'warning';
    return 'alert';
  };
  
  // Simple date parsing for the service dates (assuming format like "May 15, 2023")
  const parseServiceDate = (dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch (e) {
      return null;
    }
  };
  
  // Determine service status
  const getNextServiceStatus = () => {
    const now = new Date();
    const nextServiceDate = parseServiceDate(nextService);
    
    if (!nextServiceDate) return 'neutral';
    
    // Calculate days until next service
    const diffTime = nextServiceDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) return 'good';
    if (diffDays > 7) return 'warning';
    return 'alert';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vessel Statistics</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatItem 
            icon={<Droplets size={20} color={Colors.primary[700]} />}
            title="Fuel Level"
            value={`${fuelLevel}%`}
            backgroundColor={Colors.secondary[200]}
            status={getFuelStatus()}
          />
          <StatItem 
            icon={<Gauge size={20} color={Colors.primary[700]} />}
            title="Engine Hours"
            value={`${engineHours}h`}
            backgroundColor={Colors.secondary[200]}
            status={getEngineStatus()}
          />
        </View>
        <View style={styles.statsRow}>
          <StatItem 
            icon={<Calendar size={20} color={Colors.primary[700]} />}
            title="Last Service"
            value={lastService}
            backgroundColor={Colors.secondary[200]}
            status="neutral"
          />
          <StatItem 
            icon={<Clock size={20} color={Colors.primary[700]} />}
            title="Next Service"
            value={nextService}
            backgroundColor={Colors.secondary[200]}
            status={getNextServiceStatus()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20, // Match the BORDER_RADIUS from DashboardHeader
    padding: 16,
    marginHorizontal: 0, // Remove horizontal margin to match vessel selector width
    marginTop: -20, // Slightly overlap with vessel image for better flow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1, // Ensure it's above the vessel image
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18, // Match section titles
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  statsContainer: {
    marginBottom: 4, // Add a little bottom space
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});