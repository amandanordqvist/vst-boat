import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Navigation, Anchor, History, Compass, LocateFixed, Clock, MoreHorizontal, ChevronRight, Activity, Wind } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
  date: string;
  status: string;
  coordinates: string;
}

const locationHistory: LocationHistory[] = [
  {
    id: '1',
    location: 'Marina Bay',
    timestamp: '2 hours ago',
    date: 'May 23, 2025',
    status: 'Docked',
    coordinates: '1°17\'N 103°51\'E',
  },
  {
    id: '2',
    location: 'Open Waters',
    timestamp: '5 hours ago',
    date: 'May 23, 2025',
    status: 'Cruising',
    coordinates: '1°20\'N 103°55\'E',
  },
  {
    id: '3',
    location: 'Sunset Harbor',
    timestamp: '1 day ago',
    date: 'May 22, 2025',
    status: 'Anchored',
    coordinates: '1°15\'N 103°48\'E',
  },
  {
    id: '4',
    location: 'Ocean Point',
    timestamp: '2 days ago',
    date: 'May 21, 2025',
    status: 'Moored',
    coordinates: '1°22\'N 103°59\'E',
  },
];

const NEARBY_LOCATIONS = [
  {
    id: '1',
    name: 'Marina Bay Fuel Station',
    distance: '0.3 nm',
    type: 'fuel',
  },
  {
    id: '2',
    name: 'Seafood Restaurant',
    distance: '0.5 nm',
    type: 'restaurant',
  },
  {
    id: '3',
    name: 'Mechanics Workshop',
    distance: '0.7 nm',
    type: 'service',
  },
];

// Dynamic import for react-native-maps
let MapView: any;
let Marker: any;
let Callout: any;
let PROVIDER_GOOGLE: any;

async function loadMap() {
  if (Platform.OS !== 'web') {
    try {
      const maps = await import('react-native-maps');
      MapView = maps.default;
      Marker = maps.Marker;
      Callout = maps.Callout;
      PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
      return true;
    } catch (error) {
      console.error("Error loading maps:", error);
      return false;
    }
  }
  return false;
}

// Enhanced map component with interactive markers and custom styling
function MapComponent({ mapHeight, onMarkerPress }: { 
  mapHeight: Animated.SharedValue<number>,
  onMarkerPress?: () => void
}) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    loadMap().then((success) => {
      if (success) setIsMapLoaded(true);
    });
  }, []);

  const handleMarkerPress = () => {
    if (onMarkerPress) onMarkerPress();
  };

  // For web, show a stylish placeholder instead of the map
  if (Platform.OS === 'web') {
    return (
      <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <Image 
            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/103.851959,1.290270,13,0/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2s4YzRraHBwMDBlbjNpcDM5ZDRnaHN6MCJ9.mVLb1pB3r8b8rdEqkOYA6g' }}
            style={[styles.webMapImage, { opacity: 0.9 }]}
            resizeMode="cover"
          />
          <View style={styles.webMapOverlay}>
            <View style={styles.markerContainer}>
              <View style={styles.markerPulse} />
              <View style={styles.markerDot}>
                <MapPin size={16} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.webMapText}>Marina Bay</Text>
            <Text style={styles.webMapCoordinates}>1°17'N 103°51'E</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // Loading state
  if (!isMapLoaded || !MapView) {
    return (
      <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
        <View style={[styles.map, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading Map...</Text>
          <Activity size={24} color={Colors.primary[500]} style={{ marginTop: 8 }} />
        </View>
      </Animated.View>
    );
  }

  // Render the actual map
  return (
    <Animated.View style={[styles.mapContainer, { height: mapHeight.value }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsCompass
        showsScale
        showsBuildings
        showsTraffic={false}
        showsIndoors
        mapType="standard"
      >
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude,
            longitude: INITIAL_REGION.longitude,
          }}
          title="Marina Bay"
          description="Current Location"
          onPress={handleMarkerPress}
        >
          <View style={styles.customMarker}>
            <View style={styles.markerPulse} />
            <View style={styles.markerDot}>
              <Anchor size={14} color="#FFFFFF" />
            </View>
          </View>
        </Marker>

        {/* Nearby fuel station */}
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude + 0.003,
            longitude: INITIAL_REGION.longitude + 0.003,
          }}
          title="Marina Bay Fuel Station"
          description="0.3 nm away"
        >
          <View style={[styles.smallMarker, { backgroundColor: Colors.accent[500] }]}>
            <View style={styles.smallMarkerDot} />
          </View>
        </Marker>

        {/* Nearby restaurant */}
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude - 0.002,
            longitude: INITIAL_REGION.longitude + 0.004,
          }}
          title="Seafood Restaurant"
          description="0.5 nm away"
        >
          <View style={[styles.smallMarker, { backgroundColor: Colors.status.success }]}>
            <View style={styles.smallMarkerDot} />
          </View>
        </Marker>

        {/* Nearby service */}
        <Marker
          coordinate={{
            latitude: INITIAL_REGION.latitude + 0.004,
            longitude: INITIAL_REGION.longitude - 0.002,
          }}
          title="Mechanics Workshop"
          description="0.7 nm away"
        >
          <View style={[styles.smallMarker, { backgroundColor: Colors.primary[500] }]}>
            <View style={styles.smallMarkerDot} />
          </View>
        </Marker>
      </MapView>
      
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.mapControlButton}>
          <Compass size={20} color={Colors.primary[700]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapControlButton}>
          <LocateFixed size={20} color={Colors.primary[700]} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const mapHeight = useSharedValue(300);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [activeFeed, setActiveFeed] = useState('history');
  
  const mapStyle = useAnimatedStyle(() => ({
    height: mapHeight.value,
  }));
  
  const expandMap = () => {
    setIsMapExpanded(true);
    mapHeight.value = withSpring(500, {
      damping: 15,
      stiffness: 100,
    });
  };
  
  const collapseMap = () => {
    setIsMapExpanded(false);
    mapHeight.value = withSpring(300, {
      damping: 15,
      stiffness: 100,
    });
  };
  
  const handleMarkerPress = () => {
    // When marker is pressed, expand the map
    if (!isMapExpanded) expandMap();
  };
  
  const handleRefresh = () => {
    // Simulate refreshing the location data
    console.log('Refreshing location data...');
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <LocateFixed size={16} color={Colors.primary[600]} style={{ marginRight: 6 }} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentLocation}>
          <MapComponent 
            mapHeight={mapHeight} 
            onMarkerPress={handleMarkerPress}
          />
          <TouchableOpacity 
            style={styles.mapToggle}
            onPress={() => isMapExpanded ? collapseMap() : expandMap()}
          >
            <Text style={styles.mapToggleText}>
              {isMapExpanded ? 'Collapse Map' : 'Expand Map'}
            </Text>
            <ChevronRight 
              size={16} 
              color={Colors.primary[600]}
              style={{ transform: [{ rotate: isMapExpanded ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(240, 247, 255, 0.9)']}
            style={styles.locationCard}
          >
            <View style={styles.locationHeader}>
              <View style={styles.locationHeaderLeft}>
                <MapPin size={20} color={Colors.primary[600]} />
                <Text style={styles.currentLocationTitle}>Current Location</Text>
              </View>
              <View style={styles.updateTimeBadge}>
                <Clock size={12} color={Colors.neutral[600]} />
                <Text style={styles.updateTimeText}>5m ago</Text>
              </View>
            </View>
            
            <Text style={styles.locationName}>Marina Bay</Text>
            <Text style={styles.coordinates}>1°17'N 103°51'E</Text>
            
            <View style={styles.statusBar}>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: Colors.status.success }]} />
                <Text style={styles.statusText}>Docked</Text>
              </View>
              
              <View style={styles.weatherInfo}>
                <Wind size={14} color={Colors.neutral[700]} style={{ marginRight: 4 }} />
                <Text style={styles.weatherText}>12 kts NE</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Navigation size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Navigate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                <Anchor size={18} color={Colors.primary[600]} />
                <Text style={styles.secondaryButtonText}>Set Anchor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={20} color={Colors.neutral[700]} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.feedSection}>
          <View style={styles.feedTabContainer}>
            <TouchableOpacity 
              style={[styles.feedTab, activeFeed === 'history' && styles.feedTabActive]}
              onPress={() => setActiveFeed('history')}
            >
              <History size={16} color={activeFeed === 'history' ? Colors.primary[600] : Colors.neutral[500]} />
              <Text style={[
                styles.feedTabText,
                activeFeed === 'history' && styles.feedTabTextActive
              ]}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.feedTab, activeFeed === 'nearby' && styles.feedTabActive]}
              onPress={() => setActiveFeed('nearby')}
            >
              <MapPin size={16} color={activeFeed === 'nearby' ? Colors.primary[600] : Colors.neutral[500]} />
              <Text style={[
                styles.feedTabText,
                activeFeed === 'nearby' && styles.feedTabTextActive
              ]}>Nearby</Text>
            </TouchableOpacity>
          </View>
          
          {activeFeed === 'history' ? (
            <View style={styles.historyFeed}>
              {locationHistory.map((item) => (
                <TouchableOpacity key={item.id} style={styles.historyCard}>
                  <View style={styles.historyCardLeft}>
                    <Text style={styles.historyLocation}>{item.location}</Text>
                    <View style={styles.historyTimestampContainer}>
                      <Clock size={12} color={Colors.neutral[500]} style={{ marginRight: 4 }} />
                      <Text style={styles.historyTimestamp}>{item.timestamp}</Text>
                      <Text style={styles.historyDate}> • {item.date}</Text>
                    </View>
                    <Text style={styles.historyCoordinates}>{item.coordinates}</Text>
                  </View>
                  <View style={styles.historyStatus}>
                    <View 
                      style={[
                        styles.statusBadge, 
                        item.status === 'Docked' && styles.statusDocked,
                        item.status === 'Cruising' && styles.statusCruising,
                        item.status === 'Anchored' && styles.statusAnchored,
                        item.status === 'Moored' && styles.statusMoored,
                      ]}
                    >
                      <Text style={styles.statusBadgeText}>{item.status}</Text>
                    </View>
                    <ChevronRight size={16} color={Colors.neutral[400]} style={{ marginTop: 12 }} />
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View Full History</Text>
                <ChevronRight size={16} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nearbyFeed}>
              {NEARBY_LOCATIONS.map((item) => (
                <TouchableOpacity key={item.id} style={styles.nearbyCard}>
                  <View style={[
                    styles.nearbyIcon,
                    item.type === 'fuel' && styles.nearbyIconFuel,
                    item.type === 'restaurant' && styles.nearbyIconRestaurant,
                    item.type === 'service' && styles.nearbyIconService,
                  ]}>
                    {item.type === 'fuel' && <Droplets size={16} color="#FFFFFF" />}
                    {item.type === 'restaurant' && <Utensils size={16} color="#FFFFFF" />}
                    {item.type === 'service' && <Tool size={16} color="#FFFFFF" />}
                  </View>
                  
                  <View style={styles.nearbyInfo}>
                    <Text style={styles.nearbyName}>{item.name}</Text>
                    <Text style={styles.nearbyDistance}>{item.distance}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.nearbyNavigateButton}>
                    <Navigation size={16} color={Colors.primary[600]} />
                    <Text style={styles.nearbyNavigateText}>Go</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.searchNearbyButton}>
                <Text style={styles.searchNearbyText}>Search Nearby</Text>
                <MapPin size={16} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Import icons dynamically to prevent undefined errors
let Utensils: any;
let Tool: any;
let Droplets: any;

// Import icons if not on web (web doesn't handle this dynamic import well)
if (Platform.OS !== 'web') {
  import('lucide-react-native').then((icons) => {
    Utensils = icons.Utensils;
    Tool = icons.Tool;
    Droplets = icons.Droplets;
  });
} else {
  // Mock components for web
  const MockIcon = ({ size, color }: any) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size/2 }} />;
  Utensils = MockIcon;
  Tool = MockIcon;
  Droplets = MockIcon;
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
  },
  refreshButton: {
    backgroundColor: Colors.primary[100],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  refreshText: {
    color: Colors.primary[600],
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  currentLocation: {
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  webMapImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  webMapOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPulse: {
    backgroundColor: 'rgba(26, 95, 156, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  markerDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  webMapText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  webMapCoordinates: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[700],
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  smallMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  mapToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  },
  locationCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginLeft: 8,
  },
  updateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  updateTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  locationName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  coordinates: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[200],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weatherText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    flex: 1,
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 8,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedSection: {
    paddingHorizontal: 16,
  },
  feedTabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.neutral[200],
    borderRadius: 12,
    padding: 4,
  },
  feedTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  feedTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  feedTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
    marginLeft: 6,
  },
  feedTabTextActive: {
    color: Colors.primary[600],
  },
  historyFeed: {
    marginBottom: 20,
  },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCardLeft: {
    flex: 1,
  },
  historyLocation: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  historyTimestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  historyDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  historyCoordinates: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  historyStatus: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Colors.neutral[200],
  },
  statusDocked: {
    backgroundColor: Colors.status.success + '30',
    borderWidth: 1,
    borderColor: Colors.status.success,
  },
  statusCruising: {
    backgroundColor: Colors.primary[500] + '30',
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  statusAnchored: {
    backgroundColor: Colors.accent[500] + '30',
    borderWidth: 1,
    borderColor: Colors.accent[500],
  },
  statusMoored: {
    backgroundColor: Colors.secondary[500] + '30',
    borderWidth: 1,
    borderColor: Colors.secondary[500],
  },
  statusBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[800],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 6,
  },
  nearbyFeed: {
    marginBottom: 20,
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    marginRight: 12,
  },
  nearbyIconFuel: {
    backgroundColor: Colors.accent[500],
  },
  nearbyIconRestaurant: {
    backgroundColor: Colors.status.success,
  },
  nearbyIconService: {
    backgroundColor: Colors.primary[500],
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  nearbyDistance: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  nearbyNavigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
  },
  nearbyNavigateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 4,
  },
  searchNearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  searchNearbyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 6,
  },
});