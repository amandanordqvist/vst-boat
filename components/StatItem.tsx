import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';

interface StatItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  backgroundColor?: string;
  status?: 'good' | 'warning' | 'alert' | 'neutral';
}

export default function StatItem({ 
  icon, 
  title, 
  value, 
  backgroundColor = Colors.secondary[200],
  status // Status can be determined by the parent based on the value
}: StatItemProps) {
  // Get status color based on status prop
  const getStatusColor = () => {
    switch(status) {
      case 'good':
        return Colors.status.success;
      case 'warning':
        return Colors.status.warning;
      case 'alert':
        return Colors.status.error;
      case 'neutral':
      default:
        return Colors.neutral[400];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {status && (
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor() }
              ]} 
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 13,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginRight: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});