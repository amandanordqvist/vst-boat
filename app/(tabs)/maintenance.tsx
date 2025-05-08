import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PenTool as Tool, Calendar, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface MaintenanceTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'completed';
  description: string;
}

const maintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Engine Oil Change',
    dueDate: 'June 15, 2025',
    status: 'upcoming',
    description: 'Regular engine oil change and filter replacement.',
  },
  {
    id: '2',
    title: 'Hull Inspection',
    dueDate: 'May 30, 2025',
    status: 'overdue',
    description: 'Complete hull inspection and cleaning if necessary.',
  },
  {
    id: '3',
    title: 'Safety Equipment Check',
    dueDate: 'July 1, 2025',
    status: 'upcoming',
    description: 'Inspect all safety equipment and replace expired items.',
  },
];

export default function MaintenanceScreen() {
  const insets = useSafeAreaInsets();
  
  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'upcoming':
        return Colors.primary[500];
      case 'overdue':
        return Colors.status.error;
      case 'completed':
        return Colors.status.success;
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Maintenance</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Tool size={24} color={Colors.primary[500]} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          
          <View style={styles.statCard}>
            <AlertTriangle size={24} color={Colors.status.error} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
          
          <View style={styles.statCard}>
            <Calendar size={24} color={Colors.status.success} />
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        
        {maintenanceTasks.map((task) => (
          <TouchableOpacity key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
            </View>
            
            <Text style={styles.taskDescription}>{task.description}</Text>
            
            <View style={styles.taskFooter}>
              <View style={styles.dateContainer}>
                <Clock size={16} color={Colors.neutral[500]} />
                <Text style={styles.dateText}>{task.dueDate}</Text>
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
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  taskCard: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
  },
});