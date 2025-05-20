import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Anchor, Navigation2 as Navigation, MapPin, Ship, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface VesselOverviewProps {
  name: string;
  type: string;
  status: string;
  location: string;
  image: string;
  manufacturer?: string;
  model?: string;
  year?: string;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function VesselOverview({ 
  name, 
  type, 
  status, 
  location, 
  image,
  manufacturer = 'Sunseeker',
  model = 'Manhattan 60',
  year = '2023',
  onPress
}: VesselOverviewProps) {
  return (
    <TouchableOpacity 
      style={styles.outerContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
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

        <View style={styles.contentContainer}>
          <View style={styles.vesselDetails}>
            <Text style={styles.vesselName}>{name}</Text>
            <Text style={styles.vesselType}>{manufacturer} {model}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ship size={16} color="#FFFFFF" />
              <Text style={styles.infoText}>{type}</Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.infoText}>{location}</Text>
            </View>
          </View>

          <View style={styles.statusBar}>
            <View style={[
              styles.statusIndicator, 
              status.toLowerCase() === 'active' ? styles.statusActive : 
              status.toLowerCase() === 'maintenance' ? styles.statusMaintenance : 
              styles.statusInactive
            ]} />
            <Text style={styles.statusText}>{status}</Text>
            
            <View style={styles.yearContainer}>
              <Calendar size={14} color={Colors.neutral[300]} />
              <Text style={styles.yearText}>{year}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 16,
  },
  container: {
    width: '100%',
    height: 230,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 16,
    overflow: 'hidden',
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
    height: '60%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  vesselDetails: {
    marginBottom: 8,
  },
  vesselName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  vesselType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[200],
    marginLeft: 4,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusActive: {
    backgroundColor: Colors.status.success,
  },
  statusMaintenance: {
    backgroundColor: Colors.status.warning,
  },
  statusInactive: {
    backgroundColor: Colors.status.error,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[200],
    flex: 1,
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[300],
    marginLeft: 4,
  },
}); 