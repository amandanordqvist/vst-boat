import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { IconConfig } from '@/constants/IconConfig';
import { router } from 'expo-router';

interface Alert {
  id: string;
  type: 'critical' | 'attention' | 'ready';
  title: string;
  message: string;
  route?: any; // Route to navigate to when clicked
}

interface CriticalAlertsProps {
  alerts: Alert[];
}

export default function CriticalAlerts({ alerts }: CriticalAlertsProps) {
  // Only display critical and attention alerts
  const filteredAlerts = alerts.filter(alert => 
    alert.type === 'critical' || alert.type === 'attention'
  );
  
  if (filteredAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle size={IconConfig.size.medium} color={IconConfig.colors.critical} />;
      case 'attention':
        return <AlertTriangle size={IconConfig.size.medium} color={IconConfig.colors.warning} />;
      default:
        return <CheckCircle size={IconConfig.size.medium} color={IconConfig.colors.success} />;
    }
  };

  const getAlertBackgroundColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'rgba(255, 59, 48, 0.1)'; // Light red
      case 'attention':
        return 'rgba(255, 149, 0, 0.1)'; // Light orange
      default:
        return 'rgba(52, 199, 89, 0.1)'; // Light green
    }
  };

  const handleAlertPress = (alert: Alert) => {
    if (alert.route) {
      router.push(alert.route);
    }
  };

  return (
    <View style={styles.container}>
      {filteredAlerts.map((alert) => (
        <TouchableOpacity
          key={alert.id}
          style={[
            styles.alertCard,
            { backgroundColor: getAlertBackgroundColor(alert.type) }
          ]}
          onPress={() => handleAlertPress(alert)}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            {getAlertIcon(alert.type)}
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
          <ChevronRight size={IconConfig.size.small} color={Colors.neutral[500]} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  alertMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
  }
}); 