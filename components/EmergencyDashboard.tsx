import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import { 
  Shield, 
  Phone, 
  Radio, 
  LifeBuoy, 
  MapPin, 
  AlertTriangle,
  Zap,
  Users,
  MessageSquare,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface SafetyProtocol {
  id: string;
  title: string;
  description: string;
  urgency: 'immediate' | 'urgent' | 'standard';
}

interface EmergencyDashboardProps {
  isCompact?: boolean;
}

export default function EmergencyDashboard({ isCompact = false }: EmergencyDashboardProps) {
  const [emergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Coast Guard', role: 'Emergency', phone: '911' },
    { id: '2', name: 'Marina Emergency', role: 'Local', phone: '+1-555-0123' },
    { id: '3', name: 'Boat Insurance', role: 'Support', phone: '+1-555-0456' },
  ]);

  const [safetyProtocols] = useState<SafetyProtocol[]>([
    {
      id: '1',
      title: 'Man Overboard',
      description: 'Emergency response for person in water',
      urgency: 'immediate'
    },
    {
      id: '2',
      title: 'Engine Failure',
      description: 'Steps for engine malfunction',
      urgency: 'urgent'
    },
    {
      id: '3',
      title: 'Fire Emergency',
      description: 'Fire suppression procedures',
      urgency: 'immediate'
    },
  ]);

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Alert.alert(
      'Emergency Call',
      `Call ${contact.name} at ${contact.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would use Linking.openURL(`tel:${contact.phone}`)
            console.log(`Calling ${contact.name} at ${contact.phone}`);
          }
        }
      ]
    );
  };

  const handleSOSAlert = () => {
    Alert.alert(
      'SOS Alert',
      'This will broadcast an SOS signal with your current location to Coast Guard and emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SOS', 
          style: 'destructive',
          onPress: () => {
            console.log('SOS Alert sent');
            // In a real app, this would trigger actual emergency protocols
          }
        }
      ]
    );
  };

  const getProtocolColor = (urgency: string) => {
    switch(urgency) {
      case 'immediate': return Colors.status.error;
      case 'urgent': return Colors.status.warning;
      default: return Colors.status.info;
    }
  };

  if (isCompact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Shield size={20} color={Colors.status.error} />
          <Text style={styles.compactTitle}>Emergency</Text>
        </View>
        
        <View style={styles.compactActions}>
          <TouchableOpacity 
            style={[styles.compactButton, { backgroundColor: Colors.status.error }]}
            onPress={handleSOSAlert}
          >
            <AlertTriangle size={16} color="#FFFFFF" />
            <Text style={styles.compactButtonText}>SOS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.compactButton, { backgroundColor: Colors.primary[600] }]}
            onPress={() => handleEmergencyCall(emergencyContacts[0])}
          >
            <Phone size={16} color="#FFFFFF" />
            <Text style={styles.compactButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Shield size={20} color={Colors.status.error} />
          <Text style={styles.title}>Emergency & Safety</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => console.log('Navigate to full safety section')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={14} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Emergency Actions */}
      <View style={styles.emergencySection}>
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.emergencyActions}>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.status.error }]}
            onPress={handleSOSAlert}
          >
            <AlertTriangle size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Send SOS</Text>
            <Text style={styles.emergencyButtonSubtext}>Emergency Alert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.primary[600] }]}
            onPress={() => console.log('Open emergency radio')}
          >
            <Radio size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>VHF Radio</Text>
            <Text style={styles.emergencyButtonSubtext}>Channel 16</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.contactsSection}>
        <Text style={styles.sectionLabel}>Emergency Contacts</Text>
        <View style={styles.contactsList}>
          {emergencyContacts.slice(0, 2).map((contact) => (
            <TouchableOpacity 
              key={contact.id}
              style={styles.contactItem}
              onPress={() => handleEmergencyCall(contact)}
            >
              <View style={styles.contactIcon}>
                <Phone size={16} color={Colors.primary[600]} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
              </View>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Safety Protocols */}
      <View style={styles.protocolsSection}>
        <Text style={styles.sectionLabel}>Safety Protocols</Text>
        <View style={styles.protocolsList}>
          {safetyProtocols.slice(0, 2).map((protocol) => (
            <TouchableOpacity 
              key={protocol.id}
              style={styles.protocolItem}
              onPress={() => console.log(`Open protocol: ${protocol.title}`)}
            >
              <View style={[
                styles.protocolIndicator, 
                { backgroundColor: getProtocolColor(protocol.urgency) }
              ]} />
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolTitle}>{protocol.title}</Text>
                <Text style={styles.protocolDescription}>{protocol.description}</Text>
              </View>
              <ChevronRight size={16} color={Colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Status */}
      <View style={styles.statusSection}>
        <View style={styles.statusItem}>
          <MapPin size={14} color={Colors.status.success} />
          <Text style={styles.statusText}>GPS: Active</Text>
        </View>
        <View style={styles.statusItem}>
          <LifeBuoy size={14} color={Colors.status.success} />
          <Text style={styles.statusText}>Safety Equipment: OK</Text>
        </View>
        <View style={styles.statusItem}>
          <MessageSquare size={14} color={Colors.status.success} />
          <Text style={styles.statusText}>Communication: Online</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.status.error + '20', // 20% opacity
  },
  compactContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.status.error + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
    marginLeft: 8,
  },
  compactTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
    marginLeft: 6,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  },
  emergencySection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 12,
  },
  emergencyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactButton: {
    width: '48%',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emergencyButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  compactButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emergencyButtonSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  contactsSection: {
    marginBottom: 20,
  },
  contactsList: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    padding: 12,
    borderRadius: 12,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
  },
  contactRole: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  contactPhone: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
  },
  protocolsSection: {
    marginBottom: 20,
  },
  protocolsList: {
    gap: 8,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    padding: 12,
    borderRadius: 12,
  },
  protocolIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
  },
  protocolDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  statusSection: {
    backgroundColor: Colors.neutral[50],
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
}); 