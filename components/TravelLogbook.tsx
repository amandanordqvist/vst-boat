import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import CameraInterface from './CameraInterface';

interface Trip {
  id: string;
  startTime: Date;
  endTime?: Date;
  startLocation: string;
  endLocation?: string;
  distance: number;
  maxSpeed: number;
  avgSpeed: number;
  duration: number; // in minutes
  notes?: string;
  photos?: string[];
  weather?: string;
  status: 'active' | 'completed';
}

interface TravelLogbookProps {
  onStartTrip: () => void;
  onEndTrip: (tripData: Trip) => void;
  onViewTripHistory: () => void;
}

export const TravelLogbook: React.FC<TravelLogbookProps> = ({
  onStartTrip,
  onEndTrip,
  onViewTripHistory
}) => {
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [tripTimer, setTripTimer] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [tripPhotos, setTripPhotos] = useState<string[]>([]);

  // Mock active trip for design prototype
  useEffect(() => {
    // Simulate an active trip
    const mockActiveTrip: Trip = {
      id: 'trip_001',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      startLocation: 'Marina Bay',
      distance: 12.5,
      maxSpeed: 28,
      avgSpeed: 22,
      duration: 120,
      weather: 'Sunny, 4 kts SE',
      status: 'active'
    };
    // setActiveTrip(mockActiveTrip);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTrip) {
      interval = setInterval(() => {
        setTripTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTrip]);

  const handleStartTrip = () => {
    Alert.alert(
      'Start New Trip',
      'GPS tracking will be activated and the trip will be logged automatically.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            const newTrip: Trip = {
              id: `trip_${Date.now()}`,
              startTime: new Date(),
              startLocation: 'Current position',
              distance: 0,
              maxSpeed: 0,
              avgSpeed: 0,
              duration: 0,
              status: 'active'
            };
            setActiveTrip(newTrip);
            setTripTimer(0);
            onStartTrip();
          }
        }
      ]
    );
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;

    Alert.alert(
      'End Trip',
      'Do you want to end the active trip? Trip data will be saved to the logbook.',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'End Trip', 
          onPress: () => {
            const completedTrip: Trip = {
              ...activeTrip,
              endTime: new Date(),
              endLocation: 'Current position',
              duration: tripTimer / 60, // convert to minutes
              status: 'completed'
            };
            onEndTrip(completedTrip);
            setActiveTrip(null);
            setTripTimer(0);
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTakePhoto = () => {
    if (!activeTrip) {
      Alert.alert('No Active Trip', 'Please start a trip first to take photos.');
      return;
    }
    setShowCamera(true);
  };

  const handlePhotoTaken = (photoUri: string) => {
    setShowCamera(false);
    setTripPhotos(prev => [...prev, photoUri]);
    Alert.alert(
      'Photo Added! 📸',
      `Photo saved to trip log with GPS coordinates and timestamp:\n${new Date().toLocaleString()}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddNote = () => {
    if (!activeTrip) {
      Alert.alert('No Active Trip', 'Please start a trip first to add notes.');
      return;
    }
    setShowNotesModal(true);
  };

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      Alert.alert(
        'Note Added! 📝',
        `"${currentNote.trim()}" has been saved to your trip log with timestamp.`,
        [{ text: 'OK' }]
      );
      setCurrentNote('');
    }
    setShowNotesModal(false);
  };

  const recentTrips = [
    {
      id: '1',
      date: '2024-01-15',
      route: 'Marina Bay → Coral Island',
      distance: '18.2 nm',
      duration: '2h 45m',
      weather: '⛅ Cloudy, 6 kts',
      photos: 3
    },
    {
      id: '2',
      date: '2024-01-12',
      route: 'Coral Island → Sunset Bay',
      distance: '8.7 nm',
      duration: '1h 20m',
      weather: '☀️ Sunny, 2 kts',
      photos: 7
    },
    {
      id: '3',
      date: '2024-01-08',
      route: 'Sunset Bay → Marina Bay',
      distance: '12.3 nm',
      duration: '1h 55m',
      weather: '🌧️ Rainy, 10 kts',
      photos: 1
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Travel Logbook</Text>
        <TouchableOpacity onPress={onViewTripHistory}>
          <Ionicons name="calendar" size={24} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Active Trip Card */}
      {activeTrip ? (
        <LinearGradient
          colors={[Colors.primary[600], Colors.primary[700]]}
          style={styles.activeTripCard}
        >
          <View style={styles.activeTripHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>ACTIVE TRIP</Text>
            </View>
            <TouchableOpacity onPress={handleEndTrip} style={styles.endTripButton}>
              <Text style={styles.endTripText}>End Trip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tripTimer}>
            <Text style={styles.timerText}>{formatTime(tripTimer)}</Text>
            <Text style={styles.timerLabel}>Trip Time</Text>
          </View>

          <View style={styles.activeTripStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeTrip.distance.toFixed(1)}</Text>
              <Text style={styles.statLabel}>nm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeTrip.maxSpeed}</Text>
              <Text style={styles.statLabel}>max kts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeTrip.avgSpeed}</Text>
              <Text style={styles.statLabel}>avg kts</Text>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <Text style={styles.tripDetailText}>
              📍 From: {activeTrip.startLocation}
            </Text>
            <Text style={styles.tripDetailText}>
              🕐 Start: {activeTrip.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {activeTrip.weather && (
              <Text style={styles.tripDetailText}>
                ⛅ {activeTrip.weather}
              </Text>
            )}
          </View>

          {/* Trip Actions */}
          <View style={styles.tripActions}>
            <TouchableOpacity style={styles.tripActionButton} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.tripActionText}>Photo</Text>
              {tripPhotos.length > 0 && (
                <View style={styles.photoBadge}>
                  <Text style={styles.photoBadgeText}>{tripPhotos.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tripActionButton} onPress={handleAddNote}>
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.tripActionText}>Note</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tripActionButton} onPress={() => Alert.alert('Share Trip', 'Share current trip status')}>
              <Ionicons name="share" size={20} color="#fff" />
              <Text style={styles.tripActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        // Start Trip Card
        <TouchableOpacity onPress={handleStartTrip} style={styles.startTripCard}>
          <LinearGradient
            colors={[Colors.status.success, '#28A745']}
            style={styles.startTripContent}
          >
            <Ionicons name="play-circle" size={48} color="#fff" />
            <Text style={styles.startTripTitle}>Start New Trip</Text>
            <Text style={styles.startTripSubtitle}>
              GPS tracking will be activated automatically
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.statsRow}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>12</Text>
            <Text style={styles.quickStatLabel}>Trips</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>156.7</Text>
            <Text style={styles.quickStatLabel}>Nautical Miles</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>28.5</Text>
            <Text style={styles.quickStatLabel}>Hours</Text>
          </View>
        </View>
      </View>

      {/* Recent Trips */}
      <View style={styles.recentTrips}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <TouchableOpacity onPress={onViewTripHistory}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTrips.map(trip => (
          <TouchableOpacity key={trip.id} style={styles.tripItem}>
            <View style={styles.tripItemHeader}>
              <Text style={styles.tripRoute}>{trip.route}</Text>
              <Text style={styles.tripDate}>{trip.date}</Text>
            </View>
            
            <View style={styles.tripItemDetails}>
              <View style={styles.tripItemStat}>
                <Ionicons name="navigate" size={16} color={Colors.neutral[600]} />
                <Text style={styles.tripItemText}>{trip.distance}</Text>
              </View>
              <View style={styles.tripItemStat}>
                <Ionicons name="time" size={16} color={Colors.neutral[600]} />
                <Text style={styles.tripItemText}>{trip.duration}</Text>
              </View>
              <View style={styles.tripItemStat}>
                <Text style={styles.tripItemText}>{trip.weather}</Text>
              </View>
              {trip.photos > 0 && (
                <View style={styles.tripItemStat}>
                  <Ionicons name="camera" size={16} color={Colors.neutral[600]} />
                  <Text style={styles.tripItemText}>{trip.photos}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Manual Logging Option */}
      <TouchableOpacity style={styles.manualLogButton}>
        <Ionicons name="create" size={24} color={Colors.primary[600]} />
        <View style={styles.manualLogContent}>
          <Text style={styles.manualLogTitle}>Add trip manually</Text>
          <Text style={styles.manualLogSubtitle}>For trips without GPS tracking</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.neutral[600]} />
      </TouchableOpacity>

      {/* Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.notesModal}>
          <View style={styles.notesHeader}>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.notesTitle}>Add Trip Note</Text>
            <TouchableOpacity onPress={handleSaveNote}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.notesContent}>
            <Text style={styles.notesTimestamp}>
              📅 {new Date().toLocaleString()}
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Perfect day at Sandhamn. Light southerly wind..."
              multiline
              value={currentNote}
              onChangeText={setCurrentNote}
              autoFocus
            />
            <Text style={styles.notesHint}>
              💡 Tip: Include weather, destinations, or memorable moments
            </Text>
          </View>
        </View>
      </Modal>

      {/* Camera Interface */}
      {showCamera && (
        <CameraInterface
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setShowCamera(false)}
          context="trip_photo"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  activeTripCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  activeTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  liveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  endTripButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  endTripText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tripTimer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  activeTripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tripDetails: {
    gap: 8,
  },
  tripDetailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  startTripCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  startTripContent: {
    padding: 40,
    alignItems: 'center',
  },
  startTripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  startTripSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  quickStats: {
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  quickStatLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginTop: 4,
    textAlign: 'center',
  },
  recentTrips: {
    backgroundColor: Colors.background,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  tripItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tripItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
  },
  tripItemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tripItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripItemText: {
    fontSize: 14,
    color: '#666',
  },
  manualLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  manualLogContent: {
    flex: 1,
    marginLeft: 16,
  },
  manualLogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  manualLogSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  tripActionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
    position: 'relative',
  },
  tripActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  photoBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notesModal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  cancelText: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  saveText: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  notesContent: {
    flex: 1,
    padding: 20,
  },
  notesTimestamp: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  notesHint: {
    fontSize: 14,
    color: Colors.neutral[500],
    fontStyle: 'italic',
  },
}); 