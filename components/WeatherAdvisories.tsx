import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ThermometerSun, Droplets, Wind, Cloud, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface WeatherAlert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  message: string;
  icon: React.ReactNode;
}

interface WeatherAdvisoriesProps {
  alerts: WeatherAlert[];
  onDismiss?: (id: string) => void;
}

export default function WeatherAdvisories({ alerts, onDismiss }: WeatherAdvisoriesProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Advisories</Text>
      <View style={styles.alertsContainer}>
        {alerts.map(alert => (
          <View 
            key={alert.id} 
            style={[
              styles.alertCard,
              alert.type === 'warning' ? styles.warningCard : styles.infoCard
            ]}
          >
            <View style={[
              styles.alertIconContainer,
              alert.type === 'warning' ? styles.warningIconContainer : styles.infoIconContainer
            ]}>
              {alert.icon}
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
            </View>
            {onDismiss && (
              <TouchableOpacity 
                style={styles.alertDismissButton}
                onPress={() => onDismiss(alert.id)}
                activeOpacity={0.7}
              >
                <X size={16} color={Colors.neutral[500]} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// Sample weather alerts that can be used as a default
export const defaultWeatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Temperatures',
    message: 'Check cooling systems more frequently in current heat conditions.',
    icon: <ThermometerSun size={20} color={Colors.status.warning} />
  },
  {
    id: '2', 
    type: 'info',
    title: 'Salt Buildup',
    message: 'High humidity may cause accelerated salt buildup. Consider additional rinsing.',
    icon: <Droplets size={20} color={Colors.status.info} />
  }
];

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  alertsContainer: {
    marginBottom: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  warningCard: {
    backgroundColor: 'rgba(255, 186, 8, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.status.warning,
  },
  infoCard: {
    backgroundColor: 'rgba(58, 160, 255, 0.08)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.status.info,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  warningIconContainer: {
    backgroundColor: 'rgba(255, 186, 8, 0.12)',
  },
  infoIconContainer: {
    backgroundColor: 'rgba(58, 160, 255, 0.12)',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  alertMessage: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  alertDismissButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
}); 