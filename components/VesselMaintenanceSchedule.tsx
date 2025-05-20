import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Calendar, Clock, Wrench, AlertCircle, Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface MaintenanceTask {
  id: string;
  title: string;
  dueDate: string;
  system: string;
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'overdue' | 'completed';
  estimatedHours?: number;
  description?: string;
}

interface VesselMaintenanceScheduleProps {
  tasks: MaintenanceTask[];
  onTaskPress: (taskId: string) => void;
  onCompleteTask?: (taskId: string) => void;
}

export default function VesselMaintenanceSchedule({
  tasks,
  onTaskPress,
  onCompleteTask
}: VesselMaintenanceScheduleProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.status === selectedFilter;
  });
  
  // Get priority color
  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch(priority) {
      case 'high':
        return Colors.priority.high;
      case 'medium':
        return Colors.priority.medium;
      case 'low':
        return Colors.priority.low;
      default:
        return Colors.neutral[500];
    }
  };
  
  // Get status color
  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch(status) {
      case 'completed':
        return Colors.status.success;
      case 'upcoming':
        return Colors.status.info;
      case 'overdue':
        return Colors.status.error;
      default:
        return Colors.neutral[500];
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: MaintenanceTask['status']) => {
    switch(status) {
      case 'completed':
        return <Check size={16} color={Colors.status.success} />;
      case 'upcoming':
        return <Clock size={16} color={Colors.status.info} />;
      case 'overdue':
        return <AlertCircle size={16} color={Colors.status.error} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance Schedule</Text>
      
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[styles.filterText, selectedFilter === 'upcoming' && styles.activeFilterText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'overdue' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('overdue')}
        >
          <Text style={[styles.filterText, selectedFilter === 'overdue' && styles.activeFilterText]}>
            Overdue
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'completed' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text style={[styles.filterText, selectedFilter === 'completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Task list */}
      <View style={styles.taskList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskCard}
              onPress={() => onTaskPress(task.id)}
              activeOpacity={0.8}
            >
              {/* Priority indicator */}
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
              
              <View style={styles.taskContent}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
                    {getStatusIcon(task.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.taskDetails}>
                  <View style={styles.detailsRow}>
                    <Wrench size={14} color={Colors.neutral[500]} />
                    <Text style={styles.detailText}>{task.system}</Text>
                  </View>
                  
                  <View style={styles.detailsRow}>
                    <Calendar size={14} color={Colors.neutral[500]} />
                    <Text style={styles.detailText}>{task.dueDate}</Text>
                  </View>
                  
                  {task.estimatedHours !== undefined && (
                    <View style={styles.detailsRow}>
                      <Clock size={14} color={Colors.neutral[500]} />
                      <Text style={styles.detailText}>{task.estimatedHours}h</Text>
                    </View>
                  )}
                </View>
                
                {task.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {task.description}
                  </Text>
                )}
              </View>
              
              {/* Complete button for upcoming or overdue tasks */}
              {onCompleteTask && task.status !== 'completed' && (
                <TouchableOpacity 
                  style={styles.completeButton}
                  onPress={() => onCompleteTask(task.id)}
                >
                  <Check size={20} color={Colors.background} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {selectedFilter !== 'all' ? selectedFilter : ''} maintenance tasks.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

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
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.neutral[100],
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[100],
  },
  filterText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  activeFilterText: {
    color: Colors.primary[700],
  },
  taskList: {
    
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  priorityIndicator: {
    width: 5,
    height: '100%',
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  taskDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
    marginLeft: 6,
  },
  description: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
  },
});

// Sample maintenance task data that can be used for testing
export const sampleMaintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Engine Oil Change',
    dueDate: 'July 15, 2023',
    system: 'Propulsion',
    priority: 'high',
    status: 'upcoming',
    estimatedHours: 2,
    description: 'Regular engine oil change required. Use manufacturer-specified oil type.'
  },
  {
    id: '2',
    title: 'Hull Cleaning and Inspection',
    dueDate: 'June 28, 2023',
    system: 'Hull',
    priority: 'medium',
    status: 'overdue',
    estimatedHours: 4,
    description: 'Check for damage, clean marine growth, inspect zincs, and apply antifouling treatment.'
  },
  {
    id: '3',
    title: 'Navigation Equipment Calibration',
    dueDate: 'August 10, 2023',
    system: 'Electronics',
    priority: 'low',
    status: 'upcoming',
    estimatedHours: 1,
    description: 'Calibrate compass, radar, and GPS systems.'
  },
  {
    id: '4',
    title: 'Battery Replacement',
    dueDate: 'May 20, 2023',
    system: 'Electrical',
    priority: 'high',
    status: 'completed',
    estimatedHours: 1.5,
  },
]; 