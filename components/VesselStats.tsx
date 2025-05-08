import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
            icon={<Droplets size={20} color={Colors.primary[500]} />}
            title="Fuel Level"
            value={`${fuelLevel}%`}
            backgroundColor={Colors.primary[100]}
          />
          <StatItem 
            icon={<Gauge size={20} color={Colors.secondary[500]} />}
            title="Engine Hours"
            value={`${engineHours}h`}
            backgroundColor={Colors.secondary[100]}
          />
        </View>
        <View style={styles.statsRow}>
          <StatItem 
            icon={<Calendar size={20} color={Colors.accent[500]} />}
            title="Last Service"
            value={lastService}
            backgroundColor={Colors.accent[100]}
          />
          <StatItem 
            icon={<Clock size={20} color={Colors.water.deep} />}
            title="Next Service"
            value={nextService}
            backgroundColor={Colors.water.light}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});