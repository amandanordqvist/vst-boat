import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface VesselSummaryCardProps {
  vesselName: string;
  vesselType: string;
  status: 'docked' | 'at sea' | 'maintenance';
  location: string;
  nextTrip?: {
    destination: string;
    date: string;
    time: string;
  };
  imageUrl?: string;
}

export default function VesselSummaryCard({
  vesselName = 'Sea Breeze',
  vesselType = 'Yacht',
  status = 'docked',
  location = 'Marina Bay, Slip #42',
  nextTrip,
  imageUrl = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
}: VesselSummaryCardProps) {
  
  const getStatusColor = () => {
    switch(status) {
      case 'at sea': return Colors.status.info;
      case 'maintenance': return Colors.status.warning;
      default: return Colors.status.success;
    }
  };
  
  const getStatusLabel = () => {
    switch(status) {
      case 'at sea': return 'At Sea';
      case 'maintenance': return 'In Maintenance';
      default: return 'Docked';
    }
  };
  
  const navigateToVessel = () => {
    router.push('/(tabs)/vessel');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.vesselName}>{vesselName}</Text>
          <Text style={styles.vesselType}>{vesselType}</Text>
        </View>
        <TouchableOpacity 
          style={styles.statusBadge}
          onPress={navigateToVessel}
        >
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }}
          style={styles.vesselImage}
          resizeMode="cover"
        />
        <View style={styles.locationBar}>
          <MapPin size={14} color={Colors.primary[600]} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
      
      {nextTrip && (
        <View style={styles.nextTripContainer}>
          <View style={styles.nextTripHeader}>
            <Text style={styles.nextTripTitle}>Next Trip</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/voyage')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={14} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tripDetails}>
            <View style={styles.tripDetailItem}>
              <MapPin size={16} color={Colors.neutral[600]} />
              <Text style={styles.tripDetailText}>{nextTrip.destination}</Text>
            </View>
            
            <View style={styles.tripDetailItem}>
              <Calendar size={16} color={Colors.neutral[600]} />
              <Text style={styles.tripDetailText}>{nextTrip.date}</Text>
            </View>
            
            <View style={styles.tripDetailItem}>
              <Clock size={16} color={Colors.neutral[600]} />
              <Text style={styles.tripDetailText}>{nextTrip.time}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  vesselName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  vesselType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[800],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  vesselImage: {
    width: '100%',
    height: '100%',
  },
  locationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  locationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[800],
    marginLeft: 8,
  },
  nextTripContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  nextTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextTripTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[600],
    marginRight: 4,
  },
  tripDetails: {
    gap: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDetailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 12,
  },
}); 