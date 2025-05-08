import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import StatusCard from './StatusCard';
import { ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface MaintenanceAlert {
  id: string;
  type: 'ready' | 'attention' | 'critical';
  title: string;
  message: string;
}

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
}

export default function MaintenanceAlerts({ alerts }: MaintenanceAlertsProps) {
  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePress = () => {
    triggerHapticFeedback();
    // Navigation would go here
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Maintenance Status</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={handlePress}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={16} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.alertsContainer}>
        {alerts.map((alert) => (
          <StatusCard
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
    marginRight: 4,
  },
  alertsContainer: {
    paddingHorizontal: 16,
  },
});