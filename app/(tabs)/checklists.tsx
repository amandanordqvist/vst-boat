import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClipboardCheck, Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  type: 'pre-departure' | 'post-trip' | 'maintenance' | 'safety';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

const checklists: ChecklistItem[] = [
  {
    id: '1',
    title: 'Pre-Departure Safety Check',
    description: 'Essential safety checks before departure',
    type: 'pre-departure',
    status: 'pending',
    dueDate: 'Required before next departure',
  },
  {
    id: '2',
    title: 'Engine Maintenance',
    description: 'Regular engine maintenance checklist',
    type: 'maintenance',
    status: 'in-progress',
    dueDate: 'Due in 3 days',
  },
  {
    id: '3',
    title: 'Safety Equipment Inspection',
    description: 'Monthly safety equipment verification',
    type: 'safety',
    status: 'completed',
    dueDate: 'Completed on May 15',
  },
];

const ChecklistCard = ({ item }: { item: ChecklistItem }) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'pending':
        return Colors.status.warning;
      case 'in-progress':
        return Colors.primary[500];
      case 'completed':
        return Colors.status.success;
    }
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'pending':
        return <AlertCircle size={20} color={getStatusColor()} />;
      case 'in-progress':
        return <Clock size={20} color={getStatusColor()} />;
      case 'completed':
        return <CheckCircle2 size={20} color={getStatusColor()} />;
    }
  };

  return (
    <TouchableOpacity>
      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.checklistCard}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <ClipboardCheck size={24} color={Colors.neutral[700]} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
          {getStatusIcon()}
        </View>
        
        <Text style={styles.cardDescription}>{item.description}</Text>
        
        <View style={styles.cardFooter}>
          <View style={[styles.typeBadge, { backgroundColor: Colors.primary[50] }]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <Text style={styles.dueDate}>{item.dueDate}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ChecklistsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredChecklists = selectedFilter === 'all' 
    ? checklists 
    : checklists.filter(item => item.status === selectedFilter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Checklists</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Checklist</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filters}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredChecklists.map((item) => (
          <ChecklistCard key={item.id} item={item} />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  filtersContainer: {
    maxHeight: 48,
    marginBottom: 16,
  },
  filters: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  checklistCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginLeft: 12,
    flex: 1,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary[700],
    textTransform: 'capitalize',
  },
  dueDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
});