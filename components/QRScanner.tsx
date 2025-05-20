import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Modal,
  SafeAreaView
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface QRScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onCodeScanned: (data: string, type: string) => void;
}

export default function QRScanner({ isVisible, onClose, onCodeScanned }: QRScannerProps) {
  // Simplified mock function for a prototype
  const simulateScan = () => {
    onCodeScanned('MOCK-QR-CODE-123', 'qr');
  };
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.mockScannerContainer}>
          <Text style={styles.mockInstructions}>
            QR Scanner Mockup
          </Text>
          <Text style={styles.mockSubInstructions}>
            (Barcode scanner removed for prototype)
          </Text>
          
          <TouchableOpacity 
            style={styles.simulateButton}
            onPress={simulateScan}
          >
            <Text style={styles.simulateButtonText}>Simulate Scan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  closeButton: {
    padding: 4,
  },
  mockScannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.neutral[100],
  },
  mockInstructions: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.neutral[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  mockSubInstructions: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 40,
  },
  simulateButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  simulateButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  }
}); 