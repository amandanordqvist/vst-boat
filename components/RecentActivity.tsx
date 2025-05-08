import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { ClipboardCheck, Wrench, MapPin, Fuel } from 'lucide-react-native';

interface Activity {
  id: string;
  type: 'checklist' | 'maintenance' | 'location' | 'fuel';
  title: string;
  time: string;
  user: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'checklist':
        return <ClipboardCheck size={20} color="#FFFFFF" />;
      case 'maintenance':
        return <Wrench size={20} color="#FFFFFF" />;
      case 'location':
        return <MapPin size={20} color="#FFFFFF" />;
      case 'fuel':
        return <Fuel size={20} color="#FFFFFF" />;
      default:
        return <ClipboardCheck size={20} color="#FFFFFF" />;
    }
  };

  const getIconBackground = (type: Activity['type']) => {
    switch (type) {
      case 'checklist':
        return Colors.primary[700];
      case 'maintenance':
        return Colors.accent[500];
      case 'location':
        return Colors.status.success;
      case 'fuel':
        return Colors.status.info;
      default:
        return Colors.primary[700];
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: getIconBackground(activity.type) }
            ]}
          >
            {getIcon(activity.type)}
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityMeta}>
              {activity.time} • {activity.user}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: -16, // Compensate for parent padding
    paddingLeft: 16,
    paddingBottom: 8, // Add padding to show shadow
  },
  activityCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4, // For shadow
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  activityMeta: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
});