import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { IconConfig } from '@/constants/IconConfig';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react-native';

export type WeatherAlertSeverity = 'warning' | 'watch' | 'advisory';

interface WeatherAlertProps {
  id: string;
  severity: WeatherAlertSeverity;
  title: string;
  description: string;
  validUntil: string;
  onPress?: () => void;
}

export default function WeatherAlert({
  severity,
  title,
  description,
  validUntil,
  onPress
}: WeatherAlertProps) {
  
  const getAlertIcon = () => {
    switch (severity) {
      case 'warning':
        return <AlertCircle size={IconConfig.size.medium} color={Colors.status.error} />;
      case 'watch':
        return <AlertTriangle size={IconConfig.size.medium} color={Colors.status.warning} />;
      case 'advisory':
        return <Info size={IconConfig.size.medium} color={Colors.status.info} />;
      default:
        return <Info size={IconConfig.size.medium} color={Colors.status.info} />;
    }
  };
  
  const getAlertBackgroundColor = () => {
    switch (severity) {
      case 'warning':
        return 'rgba(255, 59, 48, 0.1)'; // Light red
      case 'watch':
        return 'rgba(255, 149, 0, 0.1)'; // Light orange
      case 'advisory':
        return 'rgba(58, 160, 255, 0.1)'; // Light blue
      default:
        return 'rgba(58, 160, 255, 0.1)'; // Light blue
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getAlertBackgroundColor() }
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {getAlertIcon()}
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {onPress && (
          <ChevronRight size={IconConfig.size.small} color={Colors.neutral[500]} />
        )}
      </View>
      
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {description}
      </Text>
      
      <Text style={styles.validUntil}>Valid until: {validUntil}</Text>
    </TouchableOpacity>
  );
}

export function WeatherAlertList({ alerts, title }: {
  alerts: WeatherAlertProps[];
  title?: string;
}) {
  if (!alerts || alerts.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.listContainer}>
      {title && <Text style={styles.listTitle}>{title}</Text>}
      
      {alerts.map((alert) => (
        <WeatherAlert key={alert.id} {...alert} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginLeft: 12,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
    marginBottom: 12,
    lineHeight: 20,
  },
  validUntil: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  listContainer: {
    marginBottom: 24,
  },
  listTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[700],
    marginBottom: 16,
    marginHorizontal: 4,
  }
}); 