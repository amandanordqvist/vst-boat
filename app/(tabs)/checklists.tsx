import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, Navigation, Map, Wind, Droplets, Sun, Plus, Flag, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DashboardHeader from '@/components/DashboardHeader';

type LogType = 'voyage' | 'weather' | 'maintenance' | 'fuel';

interface LogEntry {
  id: string;
  type: LogType;
  title: string;
  date: string;
  details: string;
  location?: string;
  weatherCondition?: string;
  distance?: number;
  duration?: string;
  image?: string;
}

// Sample log data
const logEntries: LogEntry[] = [
  {
    id: '1',
    type: 'voyage',
    title: 'Weekend Cruise to Angel Island',
    date: '2023-05-20',
    details: 'Departed Marina Bay at 09:30, arrived at Angel Island at 11:45. Smooth sailing with light winds.',
    location: 'Angel Island',
    distance: 12.5,
    duration: '2h 15m',
    image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
  },
  {
    id: '2',
    type: 'weather',
    title: 'Storm Warning',
    date: '2023-05-18',
    details: 'Strong wind conditions recorded (25-30 knots). Decision made to postpone scheduled voyage.',
    weatherCondition: 'Stormy',
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Engine Maintenance',
    date: '2023-05-15',
    details: 'Completed routine engine maintenance. Oil changed, filters replaced, and cooling system inspected.',
  },
  {
    id: '4',
    type: 'fuel',
    title: 'Refueling',
    date: '2023-05-14',
    details: 'Added 75 gallons of fuel. Average consumption rate: 2.8 gal/hour during last voyage.',
  },
  {
    id: '5',
    type: 'voyage',
    title: 'Day Trip to Sausalito',
    date: '2023-05-10',
    details: 'Perfect conditions for sailing. Anchored at Richardson Bay for lunch before returning.',
    location: 'Sausalito',
    distance: 18.3,
    duration: '4h 30m',
    image: 'https://images.unsplash.com/photo-1548515943-42406673a316?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
  },
];

// Filter categories
const categories = ['All', 'Voyages', 'Weather', 'Maintenance', 'Fuel'];

export default function LogbookScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const insets = useSafeAreaInsets();
  
  // Filter log entries based on selected category
  const filteredLogs = selectedCategory === 'All' 
    ? logEntries 
    : logEntries.filter(log => {
        if (selectedCategory === 'Voyages') return log.type === 'voyage';
        if (selectedCategory === 'Weather') return log.type === 'weather';
        if (selectedCategory === 'Maintenance') return log.type === 'maintenance';
        if (selectedCategory === 'Fuel') return log.type === 'fuel';
        return true;
      });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get icon for log type
  const getLogIcon = (type: LogType) => {
    switch (type) {
      case 'voyage':
        return <Navigation size={24} color={Colors.primary[700]} />;
      case 'weather':
        return <Wind size={24} color={Colors.status.info} />;
      case 'maintenance':
        return <Calendar size={24} color={Colors.accent[500]} />;
      case 'fuel':
        return <Droplets size={24} color={Colors.status.success} />;
      default:
        return <Flag size={24} color={Colors.primary[700]} />;
    }
  };
  
  const renderVoyageDetails = (log: LogEntry) => {
    if (log.type !== 'voyage') return null;
    
    return (
      <View style={styles.voyageDetailsContainer}>
        {log.image && (
          <Image 
            source={{ uri: log.image }} 
            style={styles.voyageImage}
          />
        )}
        
        <View style={styles.voyageStats}>
          <View style={styles.voyageStatItem}>
            <Map size={16} color={Colors.neutral[500]} />
            <Text style={styles.voyageStatText}>{log.location}</Text>
          </View>
          
          <View style={styles.voyageStatItem}>
            <Navigation size={16} color={Colors.neutral[500]} />
            <Text style={styles.voyageStatText}>{log.distance} nautical miles</Text>
          </View>
          
          <View style={styles.voyageStatItem}>
            <Clock size={16} color={Colors.neutral[500]} />
            <Text style={styles.voyageStatText}>{log.duration}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <DashboardHeader username="Captain Mike" notifications={3} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 + (Platform.OS !== 'web' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Logbook</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FFF" />
            <Text style={styles.addButtonText}>New Entry</Text>
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
        
        {/* Statistics Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Total Voyages</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>968</Text>
            <Text style={styles.statLabel}>Nautical Miles</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>186</Text>
            <Text style={styles.statLabel}>Engine Hours</Text>
          </View>
        </View>
        
        {/* Log Entries */}
        <View style={styles.logsContainer}>
          {filteredLogs.map((log) => (
            <TouchableOpacity 
              key={log.id}
              style={styles.logCard}
              activeOpacity={0.7}
            >
              <View style={styles.logHeader}>
                <View style={styles.logTitleSection}>
                  <View style={styles.iconContainer}>
                    {getLogIcon(log.type)}
                  </View>
                  
                  <View style={styles.logTitleContainer}>
                    <Text style={styles.logTitle}>{log.title}</Text>
                    <Text style={styles.logDate}>{formatDate(log.date)}</Text>
                  </View>
                </View>
                
                <ChevronRight size={20} color={Colors.neutral[400]} />
              </View>
              
              <Text style={styles.logDetails}>{log.details}</Text>
              
              {renderVoyageDetails(log)}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  categoriesContainer: {
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
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20, // H2 size
    fontWeight: '700',
    color: Colors.primary[700],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // Label text
    color: Colors.neutral[500],
  },
  logsContainer: {
    marginBottom: 20,
  },
  logCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logTitleContainer: {
    flex: 1,
  },
  logTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  logDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // Label text
    color: Colors.neutral[500],
  },
  logDetails: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    lineHeight: 20, // 1.4 line height
    color: Colors.neutral[700],
    marginBottom: 12,
  },
  voyageDetailsContainer: {
    marginTop: 8,
  },
  voyageImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  voyageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary[100],
    borderRadius: 8,
    padding: 12,
  },
  voyageStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voyageStatText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // Label text
    color: Colors.neutral[800],
    marginLeft: 6,
  },
});