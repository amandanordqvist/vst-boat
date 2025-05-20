import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type StatusType = 'ready' | 'attention' | 'critical';

interface StatusCardProps {
  type: StatusType;
  title: string;
  message: string;
}

export default function StatusCard({ type, title, message }: StatusCardProps) {
  const statusColors = {
    ready: Colors.status.success,
    attention: Colors.status.warning,
    critical: Colors.status.error,
  };
  
  const statusIcons = {
    ready: <CheckCircle color={statusColors.ready} size={24} />,
    attention: <AlertTriangle color={statusColors.attention} size={24} />,
    critical: <XCircle color={statusColors.critical} size={24} />,
  };
  
  const CardContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconContainer}>
        {statusIcons[type]}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View 
        style={[
          styles.indicator, 
          { backgroundColor: statusColors[type] }
        ]} 
      />
    </View>
  );
  
  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.regularContainer}>
        <CardContent />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  regularContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  message: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    lineHeight: 19.6, // ~1.4 line height
    color: Colors.neutral[600],
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});