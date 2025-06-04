import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Animated, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'coast_guard' | 'family' | 'marina' | 'emergency';
}

interface EnhancedEmergencyInterfaceProps {
  currentPosition?: { latitude: number; longitude: number };
  onEmergencyActivated: (type: string) => void;
  isCompactMode?: boolean;
}

export const EnhancedEmergencyInterface: React.FC<EnhancedEmergencyInterfaceProps> = ({
  currentPosition,
  onEmergencyActivated,
  isCompactMode = false
}) => {
  const [showMOBConfirmation, setShowMOBConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Kustbevakningen', phone: '112', type: 'coast_guard' },
    { id: '2', name: 'Marina Service', phone: '+46 8 123 45 67', type: 'marina' },
    { id: '3', name: 'Anna Nordqvist', phone: '+46 70 123 45 67', type: 'family' },
    { id: '4', name: 'Emergency Contact', phone: '+46 70 987 65 43', type: 'emergency' },
  ];

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleMOBPress = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    setShowMOBConfirmation(true);
    setCountdown(5);
    
    // Start countdown
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-trigger emergency
          handleMOBConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMOBConfirm = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setShowMOBConfirmation(false);
    setEmergencyActive(true);
    startPulse();
    
    // Trigger emergency protocols
    onEmergencyActivated('man_overboard');
    
    // Show emergency active alert
    Alert.alert(
      '🚨 EMERGENCY SIGNAL ACTIVATED',
      `Man Overboard signal sent!\n\nPosition: ${formatPosition()}\nTime: ${new Date().toLocaleTimeString('en-US')}\n\nCoast Guard and emergency contacts notified.`,
      [
        { text: 'Cancel Alert', onPress: handleCancelEmergency, style: 'destructive' },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleMOBCancel = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setShowMOBConfirmation(false);
    setCountdown(5);
  };

  const handleCancelEmergency = () => {
    Alert.alert(
      'Cancel Emergency Signal',
      'Are you sure you want to cancel the emergency signal?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => {
            setEmergencyActive(false);
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
          }
        }
      ]
    );
  };

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Alert.alert(
      `Call ${contact.name}`,
      `Do you want to call ${contact.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${contact.phone}`) }
      ]
    );
  };

  const formatPosition = (): string => {
    if (!currentPosition) return 'Position unknown';
    
    const formatCoord = (coord: number, type: 'lat' | 'lng'): string => {
      const degrees = Math.floor(Math.abs(coord));
      const minutes = (Math.abs(coord) - degrees) * 60;
      const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
      return `${degrees}°${minutes.toFixed(3)}'${direction}`;
    };

    return `${formatCoord(currentPosition.latitude, 'lat')} ${formatCoord(currentPosition.longitude, 'lng')}`;
  };

  const getContactIcon = (type: string): string => {
    switch (type) {
      case 'coast_guard': return 'shield-checkmark';
      case 'marina': return 'boat';
      case 'family': return 'people';
      case 'emergency': return 'medical';
      default: return 'call';
    }
  };

  const getContactColor = (type: string): string => {
    switch (type) {
      case 'coast_guard': return '#FF3B30';
      case 'marina': return '#007AFF';
      case 'family': return '#34C759';
      case 'emergency': return '#FF9500';
      default: return '#666';
    }
  };

  if (isCompactMode) {
    return (
      <View style={styles.compactContainer}>
        <Animated.View style={[styles.compactMOB, { transform: [{ scale: emergencyActive ? pulseAnim : 1 }] }]}>
          <TouchableOpacity onPress={handleMOBPress} style={styles.compactMOBButton}>
            <LinearGradient
              colors={emergencyActive ? ['#FF6B6B', '#FF3B30'] : ['#FF3B30', '#DC2626']}
              style={styles.compactMOBContent}
            >
              <Ionicons name="warning" size={24} color="#fff" />
              <Text style={styles.compactMOBText}>SOS</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <TouchableOpacity style={styles.compactCallButton}>
          <Ionicons name="call" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Emergency Status */}
      {emergencyActive && (
        <LinearGradient
          colors={['#FF3B30', '#DC2626']}
          style={styles.emergencyBanner}
        >
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.emergencyTitle}>EMERGENCY ACTIVE</Text>
            <TouchableOpacity onPress={handleCancelEmergency} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.emergencyDetails}>
            Position: {formatPosition()}
          </Text>
          <Text style={styles.emergencyTime}>
            Activated: {new Date().toLocaleTimeString('en-US')}
          </Text>
        </LinearGradient>
      )}

      {/* Man Overboard Button */}
      <View style={styles.mobSection}>
        <Text style={styles.sectionTitle}>Emergency</Text>
        
        <Animated.View style={[styles.mobContainer, { transform: [{ scale: emergencyActive ? pulseAnim : 1 }] }]}>
          <TouchableOpacity onPress={handleMOBPress} style={styles.mobButton}>
            <LinearGradient
              colors={emergencyActive ? ['#FF6B6B', '#FF3B30'] : ['#FF3B30', '#DC2626']}
              style={styles.mobGradient}
            >
              <Ionicons name="warning" size={48} color="#fff" />
              <Text style={styles.mobTitle}>MAN OVERBOARD</Text>
              <Text style={styles.mobSubtitle}>
                {emergencyActive ? 'ACTIVE - Tap to cancel' : 'Press and hold for emergency signal'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        <View style={styles.contactsList}>
          {emergencyContacts.map(contact => (
            <TouchableOpacity 
              key={contact.id} 
              onPress={() => handleEmergencyCall(contact)}
              style={styles.contactItem}
            >
              <View style={[styles.contactIcon, { backgroundColor: getContactColor(contact.type) }]}>
                <Ionicons name={getContactIcon(contact.type)} size={20} color="#fff" />
              </View>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              
              <Ionicons name="call" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Safety Protocols */}
      <View style={styles.protocolsSection}>
        <Text style={styles.sectionTitle}>Safety Protocols</Text>
        
        <TouchableOpacity style={styles.protocolItem}>
          <Ionicons name="checkmark-circle" size={20} color="#34C759" />
          <Text style={styles.protocolText}>Man overboard procedure</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.protocolItem}>
          <Ionicons name="medical" size={20} color="#FF9500" />
          <Text style={styles.protocolText}>First aid</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.protocolItem}>
          <Ionicons name="boat" size={20} color="#007AFF" />
          <Text style={styles.protocolText}>Emergency signals and equipment</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* MOB Confirmation Modal */}
      <Modal visible={showMOBConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <LinearGradient
              colors={['#FF3B30', '#DC2626']}
              style={styles.modalContent}
            >
              <Ionicons name="warning" size={60} color="#fff" />
              <Text style={styles.modalTitle}>MAN OVERBOARD</Text>
              <Text style={styles.modalMessage}>
                Emergency signal will activate in
              </Text>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.modalSubtext}>seconds</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleMOBCancel} style={styles.cancelModalButton}>
                  <Text style={styles.cancelModalText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMOBConfirm} style={styles.confirmModalButton}>
                  <Text style={styles.confirmModalText}>SEND NOW</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  compactMOB: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  compactMOBButton: {
    borderRadius: 25,
  },
  compactMOBContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  compactMOBText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  compactCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyBanner: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emergencyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyDetails: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
  emergencyTime: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  mobSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  mobContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  mobButton: {
    borderRadius: 20,
  },
  mobGradient: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  mobTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  mobSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
  },
  contactsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  contactsList: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  protocolsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  protocolText: {
    flex: 1,
    fontSize: 16,
    color: '#1d1d1f',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModal: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 350,
  },
  modalContent: {
    alignItems: 'center',
    padding: 40,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  countdownText: {
    color: '#fff',
    fontSize: 72,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  modalSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmModalText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 