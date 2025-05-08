import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { ScanLine, ChevronLeft, XCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

export default function BoatScannerScreen() {
  const { associateBoat } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Animate the scan line
    if (!scanned) {
      const animationInterval = setInterval(() => {
        setScanLinePosition((prevPos) => {
          if (prevPos >= scannerSize - 2) {
            return 0;
          }
          return prevPos + 2;
        });
      }, 20);

      return () => clearInterval(animationInterval);
    }
  }, [scanned]);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    try {
      // Parse the QR code data
      let boatData;
      try {
        boatData = JSON.parse(data);
      } catch (error) {
        // If not JSON, try simple format
        boatData = { id: data };
      }
      
      if (!boatData || !boatData.id) {
        Alert.alert('Invalid QR Code', 'The scanned code does not contain valid boat information.');
        setScanned(false);
        setIsProcessing(false);
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Register the boat with the user account
      const success = await associateBoat(boatData.id);
      
      if (success) {
        Alert.alert(
          'Success', 
          'Boat successfully registered to your account!',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)/vessel') }]
        );
      } else {
        Alert.alert(
          'Registration Failed', 
          'Could not register the boat. Please try again.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      console.error('QR code processing error:', error);
      Alert.alert(
        'Error', 
        'An error occurred while processing the QR code.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <XCircle size={64} color={Colors.primary[600]} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Please grant camera access to scan boat QR codes.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.qr,
            BarCodeScanner.Constants.BarCodeType.pdf417
          ],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              {!scanned && (
                <View 
                  style={[
                    styles.scanLine, 
                    { top: scanLinePosition }
                  ]}
                >
                  <ScanLine size={20} color="#FFFFFF" />
                </View>
              )}
            </View>

            {isProcessing && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.processingText}>Processing QR Code...</Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>
              Scan Boat QR Code
            </Text>
            <Text style={styles.instructionsText}>
              Position the QR code from your boat registration document within the frame to register it to your account.
            </Text>
          </View>

          {scanned && !isProcessing && (
            <TouchableOpacity 
              style={styles.scanAgainButton} 
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainButtonText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 40,
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  processingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
  },
  processingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  instructions: {
    margin: 32,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  scanAgainButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  scanAgainButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  permissionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 