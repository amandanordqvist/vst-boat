import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Camera } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { ScanLine, ChevronLeft, XCircle, LogIn, Ship } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;
const scannerBorderWidth = 2;

export default function BoatScannerScreen() {
  const { associateBoat, isAuthenticated, user, verifyPhoneAndLogin } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [scanMode, setScanMode] = useState<'login' | 'register'>('register');
  const cameraRef = useRef(null);

  useEffect(() => {
    // Set scan mode based on query parameters or user authentication
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const mode = queryParams.get('mode');
      if (mode === 'login' || !isAuthenticated) {
        setScanMode('login');
      } else {
        setScanMode('register');
      }
    }
  }, [isAuthenticated]);

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
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch (error) {
        // If not JSON, try simple format
        qrData = { id: data };
      }
      
      if (!qrData) {
        Alert.alert('Invalid QR Code', 'The scanned code does not contain valid information.');
        setScanned(false);
        setIsProcessing(false);
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (scanMode === 'login') {
        // Handle login via QR code
        if (!qrData.authToken && !qrData.phone) {
          Alert.alert('Invalid Login QR', 'This QR code cannot be used for login.');
          setScanned(false);
          setIsProcessing(false);
          return;
        }
        
        try {
          // If QR contains auth token, use it directly
          if (qrData.authToken) {
            // Here you would implement direct token authentication
            // For now, we'll simulate success
            Alert.alert(
              'Success', 
              'Authenticated with token successfully.',
              [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
            );
          } 
          // If QR contains phone and verification code
          else if (qrData.phone && qrData.verificationCode) {
            const success = await verifyPhoneAndLogin(
              qrData.phone,
              qrData.verificationCode
            );
            
            if (success) {
              Alert.alert(
                'Success', 
                'You have been successfully logged in.',
                [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
              );
            } else {
              Alert.alert(
                'Login Failed', 
                'Could not authenticate with the provided QR code.',
                [{ text: 'OK', onPress: () => setScanned(false) }]
              );
            }
          } else {
            throw new Error('Invalid QR format');
          }
        } catch (error) {
          Alert.alert(
            'Authentication Error',
            'Failed to authenticate with QR code.',
            [{ text: 'OK', onPress: () => setScanned(false) }]
          );
        }
      } else {
        // Register the boat with the user account
        if (!qrData.id) {
          Alert.alert('Invalid Boat QR', 'This QR code doesn\'t contain valid boat information.');
          setScanned(false);
          setIsProcessing(false);
          return;
        }
        
        const success = await associateBoat(qrData.id);
        
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

  const toggleScanMode = () => {
    setScanMode(prevMode => prevMode === 'login' ? 'register' : 'login');
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
      <BarCodeScanner
        style={styles.camera}
        type={BarCodeScanner.Constants.Type.back}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.qr,
          BarCodeScanner.Constants.BarCodeType.pdf417
        ]}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          <LinearGradient
            colors={['rgba(10, 31, 58, 0.9)', 'rgba(10, 31, 58, 0.5)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {scanMode === 'login' ? 'Scan to Login' : 'Scan Boat QR'}
              </Text>
              {isAuthenticated && (
                <TouchableOpacity 
                  style={styles.modeToggleButton} 
                  onPress={toggleScanMode}
                >
                  {scanMode === 'login' ? 
                    <Ship size={20} color="#FFFFFF" /> : 
                    <LogIn size={20} color="#FFFFFF" />
                  }
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>

          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrameContainer}>
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
                <View style={styles.processingInner}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.processingText}>
                    {scanMode === 'login' ? 'Authenticating...' : 'Processing QR Code...'}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(10, 31, 58, 0.5)', 'rgba(10, 31, 58, 0.9)']}
            style={styles.footerGradient}
          >
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionsIcon}>
                {scanMode === 'login' ? (
                  <ScanLine size={24} color="#FFFFFF" />
                ) : (
                  <Ship size={24} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.instructionsContent}>
                <Text style={styles.instructionsTitle}>
                  {scanMode === 'login' ? 'Scan Login QR Code' : 'Scan Boat QR Code'}
                </Text>
                <Text style={styles.instructionsText}>
                  {scanMode === 'login' 
                    ? 'Position the login QR code within the frame to authenticate.' 
                    : 'Position the QR code from your boat registration document within the frame to register it to your account.'
                  }
                </Text>
              </View>
            </View>
          
            {scanned && !isProcessing && (
              <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </SafeAreaView>
      </BarCodeScanner>
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
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  modeToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerFrameContainer: {
    width: scannerSize,
    height: scannerSize,
    borderWidth: scannerBorderWidth,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
  },
  scannerCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.primary[400],
    width: 40,
    height: 40,
  },
  topLeftCorner: {
    top: -scannerBorderWidth,
    left: -scannerBorderWidth,
    borderTopWidth: scannerBorderWidth + 2,
    borderLeftWidth: scannerBorderWidth + 2,
    borderTopLeftRadius: 16,
  },
  topRightCorner: {
    top: -scannerBorderWidth,
    right: -scannerBorderWidth,
    borderTopWidth: scannerBorderWidth + 2,
    borderRightWidth: scannerBorderWidth + 2,
    borderTopRightRadius: 16,
  },
  bottomLeftCorner: {
    bottom: -scannerBorderWidth,
    left: -scannerBorderWidth,
    borderBottomWidth: scannerBorderWidth + 2,
    borderLeftWidth: scannerBorderWidth + 2,
    borderBottomLeftRadius: 16,
  },
  bottomRightCorner: {
    bottom: -scannerBorderWidth,
    right: -scannerBorderWidth,
    borderBottomWidth: scannerBorderWidth + 2,
    borderRightWidth: scannerBorderWidth + 2,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scanLineGradient: {
    height: '100%',
    width: '100%',
  },
  processingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 10,
  },
  processingInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  processingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
    marginTop: 12,
  },
  footerGradient: {
    paddingTop: 30,
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  scanAgainButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 16,
    alignSelf: 'center',
  },
  scanAgainButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[700],
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  permissionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: Colors.neutral[900],
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[700],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 