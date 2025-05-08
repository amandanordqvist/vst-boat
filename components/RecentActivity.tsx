import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { CalendarClock, PenTool as Tool, LocateFixed, Droplets } from 'lucide-react-native';

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
  const getIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return <CalendarClock size={20} color={Colors.primary[500]} />;
      case 'maintenance':
        return <Tool size={20} color={Colors.secondary[500]} />;
      case 'location':
        return <LocateFixed size={20} color={Colors.accent[500]} />;
      case 'fuel':
        return <Droplets size={20} color={Colors.water.deep} />;
      default:
        return <CalendarClock size={20} color={Colors.primary[500]} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <ScrollView 
        style={styles.scrollContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.iconContainer}>
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
  scrollContainer: {
    paddingLeft: 16,
  },
  activityCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  activityMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
});