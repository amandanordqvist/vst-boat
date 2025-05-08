import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Navigation, Anchor, History } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const INITIAL_REGION = {
  latitude: 1.290270,
  longitude: 103.851959,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

interface LocationHistory {
  id: string;
  location: string;
  timestamp: string;
  status: string;
}

const locationHistory: LocationHistory[] = [
  {
    id: '1',
    location: 'Marina Bay',
    timestamp: '2 hours ago',
    status: 'Docked',
  },
  {
    id: '2',
    location: 'Open Waters',
    timestamp: '5 hours ago',
    status: 'Cruising',
  },
  {
    id: '3',
    location: 'Sunset Harbor',
    timestamp: '1 day ago',
    status: 'Anchored',
  },
];

// Dynamic import for react-native-maps
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

async function loadMap() {
  if (Platform.OS !== 'web') {
    const maps = await import('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  }
}

function MapComponent({ mapHeight }: { mapHeight: Animated.SharedValue<number> }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    loadMap().then(() => setIsMapLoaded(true));
  }, []);

  if (Platform.OS === 'web') {
    return (
      <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <MapPin size={48} color={Colors.primary[500]} />
          <Text style={styles.webMapText}>Marina Bay</Text>
          <Text style={styles.webMapCoordinates}>1°17'N 103°51'E</Text>
        </View>
      </Animated.View>
    );
  }

  if (!isMapLoaded || !MapView) {
    return (
      <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
        <View style={[styles.map, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading Map...</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
      >
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude,
            longitude: INITIAL_REGION.longitude,
          }}
          title="Marina Bay"
          description="Current Location"
        >
          <View style={styles.customMarker}>
            <MapPin size={24} color={Colors.primary[500]} />
          </View>
        </Marker>
      </MapView>
    </Animated.View>
  );
}

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const mapHeight = useSharedValue(300);
  
  const mapStyle = useAnimatedStyle(() => ({
    height: mapHeight.value,
  }));
  
  const expandMap = () => {
    mapHeight.value = withSpring(500);
  };
  
  const collapseMap = () => {
    mapHeight.value = withSpring(300);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentLocation}>
          <MapComponent mapHeight={mapHeight} />
          <TouchableOpacity 
            style={styles.mapToggle}
            onPress={() => mapHeight.value === 300 ? expandMap() : collapseMap()}
          >
            <Text style={styles.mapToggleText}>
              {mapHeight.value === 300 ? 'Expand Map' : 'Collapse Map'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.locationHeader}>
            <MapPin size={24} color={Colors.primary[500]} />
            <Text style={styles.currentLocationTitle}>Current Location</Text>
          </View>
          
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>Marina Bay</Text>
            <Text style={styles.coordinates}>1°17'N 103°51'E</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>Docked • Updated 5m ago</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Navigation size={20} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Navigate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Anchor size={20} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Anchor</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <History size={20} color={Colors.neutral[700]} />
            <Text style={styles.sectionTitle}>Location History</Text>
          </View>
          
          {locationHistory.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyLocation}>{item.location}</Text>
                <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
              </View>
              <View style={styles.historyStatus}>
                <Text style={styles.historyStatusText}>{item.status}</Text>
              </View>
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
  refreshButton: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: Colors.primary[500],
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginTop: 12,
  },
  webMapCoordinates: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  loadingContainer: {
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
  },
  customMarker: {
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  mapToggle: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mapToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  currentLocation: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentLocationTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  locationCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  coordinates: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.success,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
    marginLeft: 8,
  },
  historySection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  historyCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyLocation: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  historyTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  historyStatus: {
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  historyStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
  },
});