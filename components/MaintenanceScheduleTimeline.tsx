import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { IconConfig } from '@/constants/IconConfig';
import { Wrench, Calendar, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface MaintenanceEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isUpcoming: boolean;
  type: 'service' | 'inspection' | 'replacement' | 'cleaning';
  route?: any;
}

interface MaintenanceScheduleTimelineProps {
  events: MaintenanceEvent[];
  title?: string;
  onSeeAll?: () => void;
}

export default function MaintenanceScheduleTimeline({
  events,
  title = "Maintenance Schedule",
  onSeeAll
}: MaintenanceScheduleTimelineProps) {
  
  if (!events || events.length === 0) {
    return null;
  }
  
  const handleEventPress = (event: MaintenanceEvent) => {
    if (event.route) {
      router.push(event.route);
    }
  };
  
  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    } else {
      router.push('/(tabs)/maintenance');
    }
  };
  
  const getStatusColor = (event: MaintenanceEvent) => {
    if (event.isCompleted) {
      return Colors.status.success;
    }
    if (event.isUpcoming) {
      return Colors.accent[500];
    }
    return Colors.status.error;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={handleSeeAll}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={IconConfig.size.small} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleEventPress(event)}
            activeOpacity={0.7}
          >
            <View style={styles.timelineContainer}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(event) }]} />
              {index < events.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            
            <View style={styles.eventContent}>
              <View style={styles.dateContainer}>
                <Calendar size={IconConfig.size.small} color={Colors.neutral[600]} />
                <Text style={styles.dateText}>{event.date}</Text>
              </View>
              
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription} numberOfLines={2}>
                {event.description}
              </Text>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event) }]}>
                <Text style={styles.statusText}>
                  {event.isCompleted ? 'Completed' : event.isUpcoming ? 'Upcoming' : 'Overdue'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[700],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  },
  scrollView: {
    marginLeft: -4,
  },
  scrollContent: {
    paddingLeft: 4,
    paddingBottom: 8,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    width: 280,
    marginRight: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.neutral[300],
  },
  eventContent: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 8,
  },
  eventTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  eventDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 12,
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.background,
  }
}); 