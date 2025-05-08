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
          <ArrowRight size={16} color={Colors.primary[700]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.alertsContainer}>
        {alerts.map((alert, index) => (
          <View 
            key={alert.id} 
            style={[
              styles.alertWrapper, 
              index < alerts.length - 1 && styles.alertWithMargin
            ]}
          >
            <StatusCard
              type={alert.type}
              title={alert.title}
              message={alert.message}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[200],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginRight: 4,
  },
  alertsContainer: {
    
  },
  alertWrapper: {
    
  },
  alertWithMargin: {
    marginBottom: 14,
  }
});