import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MapPin, CheckSquare, Fuel, Navigation, ChevronRight, Clock, CalendarClock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

export default function VoyageScreen() {
  const insets = useSafeAreaInsets();
  
  const navigateTo = (screen: '/(tabs)/location' | '/(tabs)/checklists' | '/(tabs)/fuel' | '/(tabs)/vessel') => {
    router.push(screen);
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A3355', '#1A5F9C', '#3D7AB3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Voyage Management</Text>
          <Text style={styles.headerSubtitle}>Plan, track and manage your journeys</Text>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Journey</Text>
          <TouchableOpacity 
            style={styles.currentVoyageCard}
            onPress={() => navigateTo('/(tabs)/location')}
          >
            <View style={styles.voyageCardHeader}>
              <View style={styles.voyageStatusBadge}>
                <Text style={styles.voyageStatusText}>In Progress</Text>
              </View>
              <Text style={styles.voyageDate}>Started: Jul 15, 2023</Text>
            </View>
            <Text style={styles.voyageTitle}>Summer Coastal Cruise</Text>
            <View style={styles.voyageInfoRow}>
              <MapPin size={16} color={Colors.primary[700]} />
              <Text style={styles.voyageInfoText}>Marina Bay → Coral Island</Text>
            </View>
            <View style={styles.voyageProgressContainer}>
              <View style={styles.voyageProgress}>
                <View style={[styles.voyageProgressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.voyageProgressText}>65% Complete</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => navigateTo('/(tabs)/location')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.primary[100] }]}>
                <MapPin size={24} color={Colors.primary[700]} />
              </View>
              <Text style={styles.quickAccessText}>Location</Text>
              <Text style={styles.quickAccessSubtext}>Track position</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => router.push('/(tabs)/checklists')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: Colors.accent[100] }]}>
                <CheckSquare size={24} color={Colors.accent[700]} />
              </View>
              <Text style={styles.quickAccessText}>Checklists</Text>
              <Text style={styles.quickAccessSubtext}>Safety & logs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAccessItem}
              onPress={() => navigateTo('/(tabs)/fuel')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: '#E6F7ED' }]}>
                <Fuel size={24} color="#2E7D32" />
              </View>
              <Text style={styles.quickAccessText}>Fuel</Text>
              <Text style={styles.quickAccessSubtext}>Management</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Voyages</Text>
          
          <TouchableOpacity style={styles.upcomingVoyageItem}>
            <View style={styles.upcomingVoyageContent}>
              <View style={styles.upcomingVoyageDate}>
                <CalendarClock size={20} color={Colors.primary[700]} />
                <Text style={styles.upcomingVoyageDateText}>Aug 10-15, 2023</Text>
              </View>
              <Text style={styles.upcomingVoyageTitle}>Island Hopping Tour</Text>
              <View style={styles.upcomingVoyageDestination}>
                <MapPin size={14} color={Colors.neutral[500]} style={{ marginRight: 4 }} />
                <Text style={styles.upcomingVoyageDestinationText}>
                  Blue Harbor → Sunset Bay
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.upcomingVoyageItem}>
            <View style={styles.upcomingVoyageContent}>
              <View style={styles.upcomingVoyageDate}>
                <CalendarClock size={20} color={Colors.primary[700]} />
                <Text style={styles.upcomingVoyageDateText}>Sep 22-25, 2023</Text>
              </View>
              <Text style={styles.upcomingVoyageTitle}>Fishing Expedition</Text>
              <View style={styles.upcomingVoyageDestination}>
                <MapPin size={14} color={Colors.neutral[500]} style={{ marginRight: 4 }} />
                <Text style={styles.upcomingVoyageDestinationText}>
                  Marina Bay → Deep Water Reefs
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          
          <TouchableOpacity style={styles.recentTripItem}>
            <View style={styles.recentTripIcon}>
              <Clock size={18} color="#FFFFFF" />
            </View>
            <View style={styles.recentTripContent}>
              <Text style={styles.recentTripTitle}>Weekend Getaway</Text>
              <Text style={styles.recentTripDate}>Jun 24-26, 2023</Text>
            </View>
            <View style={styles.recentTripStats}>
              <Text style={styles.recentTripDistance}>124 nm</Text>
              <Text style={styles.recentTripDuration}>2d 8h</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recentTripItem}>
            <View style={[styles.recentTripIcon, { backgroundColor: Colors.accent[500] }]}>
              <Clock size={18} color="#FFFFFF" />
            </View>
            <View style={styles.recentTripContent}>
              <Text style={styles.recentTripTitle}>Day Cruise</Text>
              <Text style={styles.recentTripDate}>Jun 12, 2023</Text>
            </View>
            <View style={styles.recentTripStats}>
              <Text style={styles.recentTripDistance}>42 nm</Text>
              <Text style={styles.recentTripDuration}>10h</Text>
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
    backgroundColor: Colors.secondary[100],
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#E5F2FF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary[700],
    marginBottom: 12,
    marginLeft: 4,
  },
  currentVoyageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  voyageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voyageStatusBadge: {
    backgroundColor: Colors.accent[500],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  voyageStatusText: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
  },
  voyageDate: {
    color: Colors.neutral[500],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
  },
  voyageTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary[800],
    marginBottom: 8,
  },
  voyageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voyageInfoText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
    marginLeft: 6,
  },
  voyageProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voyageProgress: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.secondary[200],
    borderRadius: 3,
    marginRight: 12,
  },
  voyageProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 3,
  },
  voyageProgressText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  quickAccessSubtext: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  upcomingVoyageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  upcomingVoyageContent: {
    flex: 1,
  },
  upcomingVoyageDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  upcomingVoyageDateText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: '500',
    marginLeft: 6,
  },
  upcomingVoyageTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  upcomingVoyageDestination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingVoyageDestinationText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 13,
    color: Colors.neutral[500],
  },
  recentTripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentTripIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentTripContent: {
    flex: 1,
  },
  recentTripTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  recentTripDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 13,
    color: Colors.neutral[500],
  },
  recentTripStats: {
    alignItems: 'flex-end',
  },
  recentTripDistance: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  recentTripDuration: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 13,
    color: Colors.neutral[500],
  },
}); 