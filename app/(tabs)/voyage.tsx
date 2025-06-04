import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { TravelLogbook } from '@/components/TravelLogbook';

export default function VoyageScreen() {
  const insets = useSafeAreaInsets();
  
  const navigateTo = (screen: '/(tabs)/location' | '/(tabs)/checklists' | '/(tabs)/fuel' | '/(tabs)/vessel') => {
    router.push(screen);
  };

  const handleStartTrip = () => {
    console.log('Starting new trip...');
    // In real app, this would start GPS tracking
  };

  const handleEndTrip = (tripData: any) => {
    console.log('Trip ended:', tripData);
    // In real app, this would save trip data
  };

  const handleViewTripHistory = () => {
    console.log('View trip history');
    // In real app, this would navigate to trip history screen
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Travel Logbook</Text>
        <Text style={styles.headerSubtitle}>Track and manage your journeys</Text>
      </View>
      
      <TravelLogbook 
        onStartTrip={handleStartTrip}
        onEndTrip={handleEndTrip}
        onViewTripHistory={handleViewTripHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    color: Colors.neutral[900],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: Colors.neutral[600],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '400',
  },
}); 