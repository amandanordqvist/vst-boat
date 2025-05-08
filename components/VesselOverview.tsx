import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { Anchor, Navigation, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface VesselOverviewProps {
  name: string;
  type: string;
  status: string;
  location: string;
  image: string;
}

const { width } = Dimensions.get('window');

export default function VesselOverview({ 
  name, 
  type, 
  status, 
  location, 
  image 
}: VesselOverviewProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.vesselImage}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.vesselName}>{name}</Text>
            <Text style={styles.vesselType}>{type}</Text>
          </View>
          
          <View style={styles.statusBadge}>
            <Anchor size={16} color="#FFFFFF" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#FFFFFF" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    marginLeft: -16, // Compensate for the parent's padding
    height: 220, // Slightly taller
    marginBottom: 24, // Increased spacing
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  vesselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20, // Increased padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12, // Increased spacing
  },
  vesselName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26, // Larger size
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  vesselType: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15, // Slightly larger
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 95, 156, 0.85)', // Slightly more opaque
    paddingVertical: 8, // Increased padding
    paddingHorizontal: 14, // Increased padding
    borderRadius: 16, // Standardized radius
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14, 
    color: '#FFFFFF',
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15, // Slightly larger
    color: '#FFFFFF',
    marginLeft: 6,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
}); 