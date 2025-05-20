import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { getStatusColor } from '@/constants/IconConfig';

interface MaintenanceProgressBarProps {
  label: string;
  completed: number;
  total: number;
  dueDate?: string;
  onPress?: () => void;
}

export default function MaintenanceProgressBar({
  label,
  completed,
  total,
  dueDate,
  onPress
}: MaintenanceProgressBarProps) {
  const percentage = Math.min(Math.round((completed / total) * 100), 100);
  
  const getStatusType = () => {
    if (percentage >= 100) return 'success';
    if (percentage >= 70) return 'default';
    if (percentage >= 30) return 'attention';
    return 'critical';
  };

  const progressColor = getStatusColor(getStatusType());
  
  return (
    <Pressable 
      style={styles.container} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {dueDate && (
          <Text style={styles.dueDate}>Due: {dueDate}</Text>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: progressColor
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.count}>
            {completed} of {total} complete
          </Text>
          <Text style={[styles.percentage, { color: progressColor }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  dueDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 12,
    backgroundColor: Colors.neutral[200],
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  count: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  percentage: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  }
}); 