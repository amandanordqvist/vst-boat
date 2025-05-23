import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    weatherIconUrl?: string;
    weatherCondition?: string;
  };
  imageUrl?: string;
}

function getDaysLeft(tripDate: string) {
  const now = new Date();
  const date = new Date(tripDate);
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
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
  
  // Calculate countdown for next trip
  const daysLeft = useMemo(() => nextTrip?.date ? getDaysLeft(nextTrip.date) : null, [nextTrip]);
  
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
        <View style={styles.imageOverlay} />
        <View style={styles.locationBar}>
          <MapPin size={14} color={Colors.primary[600]} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
      
      {nextTrip && (
        <View style={styles.nextTripContainer}>
          <View style={styles.nextTripHeader}>
            <View style={styles.nextTripTitleContainer}>
              <Text style={styles.nextTripTitle}>Next Adventure</Text>
              <View style={styles.nextTripBadge}>
                <Text style={styles.nextTripBadgeText}>Upcoming</Text>
              </View>
              {daysLeft !== null && (
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownBadgeText}>{daysLeft} day{daysLeft === 1 ? '' : 's'} left</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/voyage')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={14} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>
          
          <LinearGradient
            colors={[Colors.primary[50], Colors.secondary[100]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tripCard}
          >
            <View style={styles.tripDestination}>
              {nextTrip.weatherIconUrl && (
                <Image source={{ uri: nextTrip.weatherIconUrl }} style={styles.weatherIcon} />
              )}
              <MapPin size={18} color={Colors.primary[600]} />
              <Text style={styles.destinationText}>{nextTrip.destination}</Text>
              {nextTrip.weatherCondition && (
                <Text style={styles.weatherConditionText}>{nextTrip.weatherCondition}</Text>
              )}
            </View>
            
            <View style={styles.tripMeta}>
              <View style={styles.tripMetaItem}>
                <Calendar size={14} color={Colors.neutral[500]} />
                <Text style={styles.tripMetaText}>{nextTrip.date}</Text>
              </View>
              
              <View style={styles.tripMetaItem}>
                <Clock size={14} color={Colors.neutral[500]} />
                <Text style={styles.tripMetaText}>{nextTrip.time}</Text>
              </View>
            </View>
          </LinearGradient>
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
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  vesselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
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
  nextTripTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextTripTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  nextTripBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  nextTripBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: Colors.primary[700],
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
  tripCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[500],
  },
  tripDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  destinationText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginLeft: 8,
  },
  tripMeta: {
    flexDirection: 'row',
    gap: 24,
  },
  tripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripMetaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 6,
  },
  countdownBadge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  countdownBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: Colors.primary[700],
  },
  weatherIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: Colors.neutral[100],
  },
  weatherConditionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.primary[600],
    marginLeft: 8,
  },
}); 