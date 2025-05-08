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
import { Camera } from 'expo-camera';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { ScanLine, ChevronLeft, XCircle, LogIn, Ship } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

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
                <Text style={styles.processingText}>
                  {scanMode === 'login' ? 'Authenticating...' : 'Processing QR Code...'}
                </Text>
              </View>
            )}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(10, 31, 58, 0.5)', 'rgba(10, 31, 58, 0.9)']}
            style={styles.instructionsGradient}
          >
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>
                {scanMode === 'login' ? 'Scan Login QR Code' : 'Scan Boat QR Code'}
              </Text>
              <Text style={styles.instructionsText}>
                {scanMode === 'login' 
                  ? 'Position the login QR code within the frame to authenticate.' 
                  : 'Position the QR code from your boat registration document within the frame to register it to your account.'
                }
              </Text>
              
              {isAuthenticated && (
                <TouchableOpacity 
                  style={styles.switchModeButton} 
                  onPress={toggleScanMode}
                >
                  <Text style={styles.switchModeText}>
                    {scanMode === 'login' 
                      ? 'Switch to Boat Registration' 
                      : 'Switch to Login Mode'
                    }
                  </Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 40,
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
  modeToggleButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  processingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 12,
  },
  instructionsGradient: {
    paddingTop: 40,
    paddingBottom: 16,
  },
  instructions: {
    padding: 20,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  switchModeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  switchModeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[800],
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  permissionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.neutral[900],
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[700],
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 