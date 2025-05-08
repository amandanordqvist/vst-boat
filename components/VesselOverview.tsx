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
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Image
          source={{ uri: image }}
          style={styles.vesselImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.overlay}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    height: 230,
    marginBottom: 0,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
    height: '40%',
  },
}); 