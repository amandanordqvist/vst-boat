import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
}

interface GPSTrackingInterfaceProps {
  isTracking: boolean;
  onToggleTracking: (enabled: boolean) => void;
  onCenterMap?: () => void;
  onSharePosition?: () => void;
}

export const GPSTrackingInterface: React.FC<GPSTrackingInterfaceProps> = ({
  isTracking,
  onToggleTracking,
  onCenterMap,
  onSharePosition
}) => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [anchorWatch, setAnchorWatch] = useState(false);
  const [gpsSignalStrength, setGpsSignalStrength] = useState(4); // 0-4 bars
  
  // Mock GPS data for design prototype
  useEffect(() => {
    if (isTracking) {
      const mockPosition: Position = {
        latitude: 59.3293,
        longitude: 18.0686,
        accuracy: 3.2,
        speed: 12.5,
        heading: 125,
        timestamp: new Date()
      };
      setCurrentPosition(mockPosition);
      
      // Update position every 3 seconds for real-time feel
      const interval = setInterval(() => {
        setCurrentPosition(prev => ({
          ...mockPosition,
          latitude: prev!.latitude + (Math.random() - 0.5) * 0.0001,
          longitude: prev!.longitude + (Math.random() - 0.5) * 0.0001,
          speed: Math.random() * 25,
          heading: (prev!.heading + Math.random() * 10 - 5) % 360,
          timestamp: new Date()
        }));
        setGpsSignalStrength(Math.floor(Math.random() * 5));
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const formatCoordinate = (coord: number, type: 'lat' | 'lng'): string => {
    const degrees = Math.floor(Math.abs(coord));
    const minutes = (Math.abs(coord) - degrees) * 60;
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes.toFixed(3)}'${direction}`;
  };

  const formatSpeed = (speedMps?: number): string => {
    if (!speedMps) return '0.0 kn';
    const knots = speedMps * 1.94384; // Convert m/s to knots
    return `${knots.toFixed(1)} kn`;
  };

  const getSignalIcon = (strength: number): string => {
    switch (strength) {
      case 0: return 'cellular-outline';
      case 1: return 'cellular-outline';
      case 2: return 'cellular';
      case 3: return 'cellular';
      case 4: return 'cellular';
      default: return 'cellular-outline';
    }
  };

  const getSignalColor = (strength: number): string => {
    if (strength >= 3) return '#34C759';
    if (strength >= 2) return '#FF9500';
    return '#FF3B30';
  };

  const handleToggleAnchorWatch = () => {
    setAnchorWatch(!anchorWatch);
    if (!anchorWatch) {
      Alert.alert(
        'Anchor Watch Aktiverad',
        'Du får en varning om båten rör sig mer än 50 meter från nuvarande position.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSharePosition = () => {
    if (currentPosition && onSharePosition) {
      Alert.alert(
        'Dela Position',
        `Lat: ${formatCoordinate(currentPosition.latitude, 'lat')}\nLng: ${formatCoordinate(currentPosition.longitude, 'lng')}\n\nSkicka position via meddelande?`,
        [
          { text: 'Avbryt', style: 'cancel' },
          { text: 'Skicka', onPress: onSharePosition }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* GPS Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.gpsStatus}>
          <Ionicons 
            name={getSignalIcon(gpsSignalStrength)} 
            size={20} 
            color={getSignalColor(gpsSignalStrength)} 
          />
          <Text style={[styles.statusText, { color: getSignalColor(gpsSignalStrength) }]}>
            GPS {gpsSignalStrength > 2 ? 'Aktiv' : 'Svag signal'}
          </Text>
        </View>
        
        <View style={styles.trackingToggle}>
          <Text style={styles.toggleLabel}>Spårning</Text>
          <Switch
            value={isTracking}
            onValueChange={onToggleTracking}
            trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
            thumbColor={isTracking ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Current Position Card */}
      {currentPosition && (
        <View style={styles.positionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Aktuell Position</Text>
            <Text style={styles.timestamp}>
              {currentPosition.timestamp.toLocaleTimeString('sv-SE')}
            </Text>
          </View>

          <View style={styles.coordinates}>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Latitud:</Text>
              <Text style={styles.coordinateValue}>
                {formatCoordinate(currentPosition.latitude, 'lat')}
              </Text>
            </View>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Longitud:</Text>
              <Text style={styles.coordinateValue}>
                {formatCoordinate(currentPosition.longitude, 'lng')}
              </Text>
            </View>
          </View>

          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="speedometer" size={16} color="#666" />
              <Text style={styles.infoText}>{formatSpeed(currentPosition.speed)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="compass" size={16} color="#666" />
              <Text style={styles.infoText}>{currentPosition.heading?.toFixed(0)}°</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.infoText}>±{currentPosition.accuracy?.toFixed(1)}m</Text>
            </View>
          </View>
        </View>
      )}

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#ddd" />
          <Text style={styles.mapPlaceholderText}>Kartvy</Text>
          {currentPosition && (
            <View style={styles.boatMarker}>
              <Ionicons name="boat" size={24} color="#007AFF" />
            </View>
          )}
        </View>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity onPress={onCenterMap} style={styles.mapButton}>
            <Ionicons name="locate" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="layers" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity onPress={handleSharePosition} style={styles.actionButton}>
          <Ionicons name="share" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Dela Position</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggleAnchorWatch} style={styles.actionButton}>
          <Ionicons 
            name={anchorWatch ? "anchor" : "anchor-outline"} 
            size={20} 
            color={anchorWatch ? "#34C759" : "#007AFF"} 
          />
          <Text style={[styles.actionText, anchorWatch && { color: '#34C759' }]}>
            Anchor Watch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trail-sign" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Waypoints</Text>
        </TouchableOpacity>
      </View>

      {/* Anchor Watch Alert */}
      {anchorWatch && (
        <LinearGradient
          colors={['#34C759', '#28A745']}
          style={styles.anchorAlert}
        >
          <Ionicons name="anchor" size={20} color="#fff" />
          <Text style={styles.anchorAlertText}>
            Anchor Watch Aktiv - Övervakar position
          </Text>
          <View style={styles.anchorIndicator}>
            <View style={styles.pulseDot} />
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  trackingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#1d1d1f',
  },
  positionCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  coordinates: {
    gap: 12,
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coordinateLabel: {
    fontSize: 16,
    color: '#666',
  },
  coordinateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
    fontFamily: 'monospace',
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10,
  },
  boatMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  mapControls: {
    position: 'absolute',
    top: 15,
    right: 15,
    gap: 10,
  },
  mapButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  anchorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  anchorAlertText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  anchorIndicator: {
    position: 'relative',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
}); 