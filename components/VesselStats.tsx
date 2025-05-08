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
          />
          <StatItem 
            icon={<Gauge size={20} color={Colors.primary[700]} />}
            title="Engine Hours"
            value={`${engineHours}h`}
            backgroundColor={Colors.secondary[200]}
          />
        </View>
        <View style={styles.statsRow}>
          <StatItem 
            icon={<Calendar size={20} color={Colors.primary[700]} />}
            title="Last Service"
            value={lastService}
            backgroundColor={Colors.secondary[200]}
          />
          <StatItem 
            icon={<Clock size={20} color={Colors.primary[700]} />}
            title="Next Service"
            value={nextService}
            backgroundColor={Colors.secondary[200]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20, // H2 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  statsContainer: {
    
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});