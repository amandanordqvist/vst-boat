import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, Plus, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DashboardHeader from '@/components/DashboardHeader';

type MaintenanceStatus = 'completed' | 'upcoming' | 'overdue';

type MaintenanceItem = {
  id: string;
  title: string;
  date: string;
  status: MaintenanceStatus;
  category: string;
  description: string;
};

// Sample maintenance data
const maintenanceData: MaintenanceItem[] = [
  {
    id: '1',
    title: 'Engine Oil Change',
    date: '2023-05-15',
    status: 'completed',
    category: 'Engine',
    description: 'Regular engine oil change after 100 hours of operation.'
  },
  {
    id: '2',
    title: 'Hull Cleaning',
    date: '2023-06-20',
    status: 'completed',
    category: 'Exterior',
    description: 'Complete hull cleaning and antifouling treatment.'
  },
  {
    id: '3',
    title: 'Fuel Filter Replacement',
    date: '2023-08-10',
    status: 'upcoming',
    category: 'Fuel System',
    description: 'Replace main and secondary fuel filters.'
  },
  {
    id: '4',
    title: 'Battery Check',
    date: '2023-07-05',
    status: 'overdue',
    category: 'Electrical',
    description: 'Check battery voltage and clean terminals.'
  },
  {
    id: '5',
    title: 'Propeller Inspection',
    date: '2023-09-15',
    status: 'upcoming',
    category: 'Propulsion',
    description: 'Inspect propeller for damage and balance.'
  },
  {
    id: '6',
    title: 'Safety Equipment Check',
    date: '2023-07-30',
    status: 'overdue',
    category: 'Safety',
    description: 'Check life jackets, fire extinguishers, and emergency signals.'
  },
];

// Categories for filtering
const categories = ['All', 'Engine', 'Electrical', 'Fuel System', 'Exterior', 'Propulsion', 'Safety'];

export default function MaintenanceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const insets = useSafeAreaInsets();
  
  // Filter maintenance items by category
  const filteredItems = selectedCategory === 'All' 
    ? maintenanceData 
    : maintenanceData.filter(item => item.category === selectedCategory);
  
  // Get status icon and color
  const getStatusIndicator = (status: MaintenanceStatus) => {
    switch (status) {
      case 'completed':
        return { 
          icon: <CheckCircle2 size={20} color={Colors.status.success} />,
          color: Colors.status.success
        };
      case 'upcoming':
        return { 
          icon: <Clock size={20} color={Colors.status.info} />,
          color: Colors.status.info
        };
      case 'overdue':
        return { 
          icon: <AlertCircle size={20} color={Colors.status.error} />,
          color: Colors.status.error
        };
      default:
        return { 
          icon: <XCircle size={20} color={Colors.neutral[400]} />,
          color: Colors.neutral[400]
        };
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <View style={styles.container}>
      <DashboardHeader username="Captain" notifications={3} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 16 + (Platform.OS !== 'web' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Maintenance</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Schedule Service</Text>
          </TouchableOpacity>
        </View>
        
        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Maintenance Timeline */}
        <View style={styles.timelineContainer}>
          {filteredItems.map((item, index) => {
            const { icon, color } = getStatusIndicator(item.status);
            
            return (
              <TouchableOpacity 
                key={item.id}
                style={styles.timelineItem}
                activeOpacity={0.7}
              >
                <View style={[styles.timelineIconContainer, { borderColor: color }]}>
                  {icon}
                </View>
                
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <ChevronRight size={16} color={Colors.neutral[400]} />
                  </View>
                  
                  <View style={styles.timelineDetails}>
                    <View style={styles.timelineDetailItem}>
                      <Calendar size={14} color={Colors.neutral[500]} />
                      <Text style={styles.timelineDetailText}>{formatDate(item.date)}</Text>
                    </View>
                    
                    <View style={styles.timelineDetailItem}>
                      <View style={[styles.statusDot, { backgroundColor: color }]} />
                      <Text style={styles.timelineDetailText}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                </View>
                
                {index < filteredItems.length - 1 && (
                  <View style={styles.timelineConnector} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Service Providers */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Service Providers</Text>
          
          <TouchableOpacity style={styles.serviceCard}>
            <View style={styles.serviceCardContent}>
              <Text style={styles.serviceCardTitle}>Marina Bay Boat Services</Text>
              <Text style={styles.serviceCardDescription}>Engine maintenance, hull repairs, electrical systems</Text>
              <View style={styles.serviceCardFooter}>
                <View style={styles.serviceCardRating}>
                  <Text style={styles.ratingText}>4.8</Text>
                  <Text style={styles.ratingLabel}> Rating</Text>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <View style={styles.serviceCardContent}>
              <Text style={styles.serviceCardTitle}>Ocean Mechanical</Text>
              <Text style={styles.serviceCardDescription}>Specialized in fuel systems and propulsion</Text>
              <View style={styles.serviceCardFooter}>
                <View style={styles.serviceCardRating}>
                  <Text style={styles.ratingText}>4.5</Text>
                  <Text style={styles.ratingLabel}> Rating</Text>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  screenTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 24, // H1 size
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.background,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    fontWeight: '500',
    marginLeft: 6,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: Colors.secondary[200],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: Colors.primary[700],
  },
  categoryText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[600],
  },
  selectedCategoryText: {
    color: Colors.background,
    fontWeight: '500',
  },
  timelineContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 24,
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 12,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  timelineDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDetailText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[600],
    marginLeft: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  timelineDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[600],
    lineHeight: 20, // ~1.4 line height
  },
  timelineConnector: {
    position: 'absolute',
    left: 20, // Half of the icon size (40/2)
    top: 40, // Height of the icon
    bottom: 0,
    width: 2,
    backgroundColor: Colors.neutral[200],
    zIndex: 0,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20, // H2 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceCardContent: {
    padding: 16,
  },
  serviceCardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  serviceCardDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[600],
    lineHeight: 20, // ~1.4 line height
    marginBottom: 12,
  },
  serviceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    fontWeight: '600',
    color: Colors.primary[700],
  },
  ratingLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[500],
  },
  contactButton: {
    backgroundColor: Colors.secondary[200],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  contactButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    fontWeight: '500',
    color: Colors.primary[700],
  },
});