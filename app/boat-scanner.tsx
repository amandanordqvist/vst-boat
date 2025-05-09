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
  Platform,
  Pressable
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ScanLine, ChevronLeft, XCircle, LogIn, Ship, QrCode } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  FadeIn,
  SlideInDown
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const scannerSize = width * 0.7;
const scannerBorderWidth = 2;

export default function BoatScannerScreen() {
  const { associateBoat, isAuthenticated, user, verifyPhoneAndLogin } = useAuth();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanMode, setScanMode] = useState<'login' | 'register'>('register');
  
  // Animation values
  const scanLineY = useSharedValue(0);
  const scannerScale = useSharedValue(1);
  const scannerOpacity = useSharedValue(1);
  const processingScale = useSharedValue(0.8);
  const processingOpacity = useSharedValue(0);

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

  // Start animations when component mounts
  useEffect(() => {
    if (!scanned) {
      // Animate scan line from top to bottom repeatedly
      scanLineY.value = withRepeat(
        withTiming(scannerSize - 2, { duration: 2000, easing: Easing.linear }),
        -1, // Infinite repeat
        true // Reverse
      );

      // Subtle scanner square pulse
      scannerScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [scanned]);

  // Update animation states when scanning/processing
  useEffect(() => {
    if (isProcessing) {
      // Shrink and fade out scanner
      scannerOpacity.value = withTiming(0.3, { duration: 400 });
      scannerScale.value = withTiming(0.9, { duration: 400 });
      
      // Show processing animation
      processingOpacity.value = withTiming(1, { duration: 400 });
      processingScale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back()) });
    } else {
      // Return to normal state
      scannerOpacity.value = withTiming(1, { duration: 400 });
      scannerScale.value = withTiming(1, { duration: 400 });
      
      processingOpacity.value = withTiming(0, { duration: 200 });
      processingScale.value = withTiming(0.8, { duration: 300 });
    }
  }, [isProcessing]);

  // Animated styles
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value }]
    };
  });

  const scannerFrameStyle = useAnimatedStyle(() => {
    return {
      opacity: scannerOpacity.value,
      transform: [{ scale: scannerScale.value }]
    };
  });

  const processingContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: processingOpacity.value,
      transform: [{ scale: processingScale.value }]
    };
  });

  const simulateScan = () => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      if (scanMode === 'login') {
        Alert.alert(
          'Success', 
          'You have been successfully logged in.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert(
          'Success', 
          'Boat successfully registered to your account!',
          [{ text: 'Continue', onPress: () => router.replace('/profile-creation') }]
        );
      }
      setIsProcessing(false);
    }, 2000);
  };

  const toggleScanMode = () => {
    setScanMode(prevMode => prevMode === 'login' ? 'register' : 'login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Mock camera background */}
      <View style={styles.mockCamera}>
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <LinearGradient
            colors={['rgba(10, 31, 58, 0.9)', 'rgba(10, 31, 58, 0.5)', 'transparent']}
            style={styles.headerGradient}
          >
            <Animated.View 
              entering={FadeIn.duration(300)}
              style={styles.header}
            >
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
            </Animated.View>
          </LinearGradient>

          {/* Scanner UI */}
          <Pressable style={styles.scannerContainer} onPress={simulateScan}>
            <Animated.View style={[styles.scannerFrameContainer, scannerFrameStyle]}>
              {/* Scanner corners */}
              <View style={[styles.scannerCorner, styles.topLeftCorner]} />
              <View style={[styles.scannerCorner, styles.topRightCorner]} />
              <View style={[styles.scannerCorner, styles.bottomLeftCorner]} />
              <View style={[styles.scannerCorner, styles.bottomRightCorner]} />
              
              {/* QR code icon in center */}
              {!scanned && (
                <View style={styles.qrIconContainer}>
                  <QrCode size={64} color="rgba(255, 255, 255, 0.2)" />
                </View>
              )}
              
              {/* Scan line */}
              {!scanned && (
                <Animated.View style={[styles.scanLine, scanLineStyle]}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(120, 179, 235, 0.8)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.scanLineGradient}
                  />
                </Animated.View>
              )}
            </Animated.View>

            {/* Processing indicator */}
            <Animated.View style={[styles.processingContainer, processingContainerStyle]}>
              <View style={styles.processingInner}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
                <Text style={styles.processingText}>
                  {scanMode === 'login' ? 'Logging in...' : 'Registering boat...'}
                </Text>
              </View>
            </Animated.View>
          </Pressable>

          {/* Footer with instructions */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 31, 58, 0.5)', 'rgba(10, 31, 58, 0.9)']}
            style={styles.footerGradient}
          >
            <Animated.View 
              entering={SlideInDown.duration(500).delay(300)}
              style={styles.instructionsContainer}
            >
              <View style={styles.instructionsIcon}>
                <QrCode size={24} color="#FFFFFF" />
              </View>
              <View style={styles.instructionsContent}>
                <Text style={styles.instructionsTitle}>
                  {scanMode === 'login' ? 'Quick Login' : 'Register Your Boat'}
                </Text>
                <Text style={styles.instructionsText}>
                  {scanMode === 'login' 
                    ? 'Position your phone to scan the QR code on your vessel or companion app for instant access'
                    : 'Scan the QR code located on your vessel documentation or hull to register it to your account'
                  }
                </Text>
              </View>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={simulateScan}
            >
              <Text style={styles.scanButtonText}>
                {isProcessing ? 'Processing...' : 'Tap to Simulate Scan'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mockCamera: {
    flex: 1,
    backgroundColor: '#111',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerCorner: {
    position: 'absolute',
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
    marginBottom: 16,
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
  scanButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  scanButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  }
}); 