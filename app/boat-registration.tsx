import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Keyboard,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Ship, 
  ChevronLeft, 
  Camera, 
  ArrowRight, 
  BookText, 
  Info, 
  CalendarDays, 
  Ruler, 
  PenLine, 
  Anchor, 
  Droplets, 
  Gauge, 
  Waves,
  Check
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInRight
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BoatDetails {
  name: string;
  model: string;
  year: string;
  length: string;
  registrationNumber: string;
  manufacturer: string;
  engineType: string;
  hullMaterial: string;
}

// Input component with animation
interface AnimatedInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'email-address' | 'phone-pad';
  maxLength?: number;
  required?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  label, 
  icon, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  maxLength,
  required = false
}) => {
  const focused = useSharedValue(0);
  const filled = value.length > 0;
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolate(
        focused.value,
        [0, 1],
        [filled ? Colors.neutral[300] : Colors.neutral[200], Colors.primary[400]]
      ),
      backgroundColor: interpolate(
        focused.value,
        [0, 1],
        [filled ? 'rgba(245, 247, 250, 0.8)' : 'rgba(255, 255, 255, 0.9)', 'rgba(230, 238, 245, 0.5)']
      ),
      transform: [{ scale: interpolate(
        focused.value,
        [0, 1],
        [1, 1.02],
        Extrapolation.CLAMP
      )}],
      shadowOpacity: interpolate(
        focused.value,
        [0, 1],
        [0.05, 0.1]
      )
    };
  });
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        focused.value,
        [0, 1],
        [0.7, 1]
      ),
      transform: [{ scale: interpolate(
        focused.value,
        [0, 1],
        [1, 1.1],
        Extrapolation.CLAMP
      )}]
    };
  });
  
  const handleFocus = () => {
    focused.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    focused.value = withTiming(0, { duration: 200 });
  };
  
  return (
    <Animated.View style={[styles.inputGroup, containerStyle]}>
      <Animated.View style={[styles.inputIcon, iconStyle]}>
        {icon}
      </Animated.View>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
      {filled && (
        <Animated.View 
          entering={FadeIn}
          style={styles.checkmarkContainer}
        >
          <Check size={16} color={Colors.primary[500]} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Button component with animation
interface AnimatedButtonProps {
  text: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  secondary?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  text, 
  onPress, 
  icon, 
  disabled = false, 
  isLoading = false,
  secondary = false
}) => {
  const scale = useSharedValue(1);
  
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.7 : 1
    };
  });
  
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };
  
  return (
    <Animated.View style={[buttonStyle, secondary ? {} : styles.buttonShadow]}>
      <TouchableOpacity
        style={[
          secondary ? styles.secondaryButton : styles.primaryButton,
          disabled && styles.disabledButton
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator color={secondary ? Colors.primary[600] : "#FFFFFF"} size="small" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>
              {text}
            </Text>
            {icon && <View style={styles.buttonIconContainer}>{icon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function BoatRegistrationScreen() {
  const { user, associateBoat } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'additional'>('basic');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [boatDetails, setBoatDetails] = useState<BoatDetails>({
    name: '',
    model: '',
    year: '',
    length: '',
    registrationNumber: '',
    manufacturer: '',
    engineType: '',
    hullMaterial: '',
  });

  // Animation values
  const tabIndicatorPosition = useSharedValue(0);
  
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value }]
    };
  });

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const updateBoatDetail = (field: keyof BoatDetails, value: string) => {
    setBoatDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScanQRCode = () => {
    // Navigate to camera screen for QR scanning
    router.push('/boat-scanner');
  };

  const handleTabChange = (tab: 'basic' | 'additional') => {
    setActiveTab(tab);
    // Animate the indicator based on screen width
    const indicatorWidth = (width - 48) / 2;
    tabIndicatorPosition.value = withTiming(
      tab === 'basic' ? 0 : indicatorWidth, 
      { duration: 250, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }
    );
  };

  const validateForm = () => {
    const { name, model, registrationNumber } = boatDetails;
    
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter the boat name');
      return false;
    }
    
    if (!model.trim()) {
      Alert.alert('Missing Information', 'Please enter the boat model');
      return false;
    }
    
    if (!registrationNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter the registration number');
      return false;
    }
    
    return true;
  };

  const handleRegisterBoat = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // In a real app, you would submit this data to your backend
      // Here we'll simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const boatId = `boat-${Math.floor(Math.random() * 10000)}`;
      const success = await associateBoat(boatId);
      
      if (success) {
        Alert.alert(
          'Success',
          'Your boat has been registered successfully!',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)/vessel') }]
        );
      } else {
        Alert.alert('Error', 'Failed to register boat. Please try again.');
      }
    } catch (error) {
      console.error('Boat registration error', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBasicInfoForm = () => (
    <Animated.View entering={FadeInRight.duration(300).delay(100)}>
      <AnimatedInput
        label="Boat Name"
        icon={<Ship size={22} color={Colors.primary[600]} />}
        value={boatDetails.name}
        onChangeText={(value) => updateBoatDetail('name', value)}
        placeholder="Enter boat name"
        maxLength={50}
        required
      />

      <AnimatedInput
        label="Boat Model"
        icon={<Anchor size={22} color={Colors.primary[600]} />}
        value={boatDetails.model}
        onChangeText={(value) => updateBoatDetail('model', value)}
        placeholder="Enter boat model"
        maxLength={50}
        required
      />

      <View style={styles.rowInputs}>
        <View style={[{ flex: 1, marginRight: 8 }]}>
          <AnimatedInput
            label="Year"
            icon={<CalendarDays size={22} color={Colors.primary[600]} />}
            value={boatDetails.year}
            onChangeText={(value) => updateBoatDetail('year', value)}
            placeholder="YYYY"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <View style={[{ flex: 1, marginLeft: 8 }]}>
          <AnimatedInput
            label="Length (ft)"
            icon={<Ruler size={22} color={Colors.primary[600]} />}
            value={boatDetails.length}
            onChangeText={(value) => updateBoatDetail('length', value)}
            placeholder="Length"
            keyboardType="decimal-pad"
            maxLength={5}
          />
        </View>
      </View>

      <AnimatedInput
        label="Registration Number"
        icon={<BookText size={22} color={Colors.primary[600]} />}
        value={boatDetails.registrationNumber}
        onChangeText={(value) => updateBoatDetail('registrationNumber', value)}
        placeholder="Official registration number"
        maxLength={20}
        required
      />

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScanQRCode}
      >
        <View style={styles.scanButtonIcon}>
          <Camera size={20} color={Colors.primary[600]} />
        </View>
        <View style={styles.scanButtonTextContainer}>
          <Text style={styles.scanButtonTitle}>Scan Boat QR Code</Text>
          <Text style={styles.scanButtonSubtitle}>
            Quickly register by scanning your vessel's QR code
          </Text>
        </View>
        <View style={styles.scanButtonArrow}>
          <ArrowRight size={18} color={Colors.primary[600]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderAdditionalInfoForm = () => (
    <Animated.View entering={FadeInRight.duration(300).delay(100)}>
      <AnimatedInput
        label="Manufacturer"
        icon={<Ship size={22} color={Colors.primary[600]} />}
        value={boatDetails.manufacturer}
        onChangeText={(value) => updateBoatDetail('manufacturer', value)}
        placeholder="Boat manufacturer"
      />

      <AnimatedInput
        label="Engine Type"
        icon={<Gauge size={22} color={Colors.primary[600]} />}
        value={boatDetails.engineType}
        onChangeText={(value) => updateBoatDetail('engineType', value)}
        placeholder="e.g. Outboard, Inboard"
      />

      <AnimatedInput
        label="Hull Material"
        icon={<Droplets size={22} color={Colors.primary[600]} />}
        value={boatDetails.hullMaterial}
        onChangeText={(value) => updateBoatDetail('hullMaterial', value)}
        placeholder="e.g. Fiberglass, Aluminum"
      />

      <View style={styles.noteContainer}>
        <View style={styles.noteIconContainer}>
          <Info size={20} color={Colors.primary[600]} />
        </View>
        <Text style={styles.noteText}>
          Additional information helps customize your boating experience. This information can be added or edited later.
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <LinearGradient
          colors={['#F0F4F8', '#FFFFFF']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.neutral[800]} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register Boat</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {!keyboardVisible && (
              <View style={styles.boatIllustration}>
                <LinearGradient
                  colors={[Colors.primary[100], Colors.primary[50]]}
                  style={styles.illustrationBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ship size={64} color={Colors.primary[600]} />
                </LinearGradient>
              </View>
            )}

            <Text style={styles.formTitle}>Vessel Information</Text>
            <Text style={styles.formSubtitle}>
              Please provide details about your boat to complete registration
            </Text>

            <View style={styles.tabContainer}>
              <View style={styles.tabBar}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
                  onPress={() => handleTabChange('basic')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'basic' && styles.activeTabText
                    ]}
                  >
                    Basic Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'additional' && styles.activeTab]}
                  onPress={() => handleTabChange('additional')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'additional' && styles.activeTabText
                    ]}
                  >
                    Additional
                  </Text>
                </TouchableOpacity>
                <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
              </View>

              <View style={styles.formContainer}>
                {activeTab === 'basic' ? renderBasicInfoForm() : renderAdditionalInfoForm()}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <AnimatedButton
              text={activeTab === 'basic' ? 'Continue to Additional' : 'Register Boat'}
              icon={<ArrowRight size={20} color="#FFFFFF" />}
              onPress={activeTab === 'basic' ? () => handleTabChange('additional') : handleRegisterBoat}
              isLoading={isLoading}
              disabled={activeTab === 'basic' ? 
                !(boatDetails.name && boatDetails.model && boatDetails.registrationNumber) : 
                false
              }
            />
            
            {activeTab === 'additional' && (
              <AnimatedButton
                text="Back to Basic Info"
                onPress={() => handleTabChange('basic')}
                secondary
              />
            )}
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  boatIllustration: {
    alignItems: 'center',
    marginVertical: 24,
  },
  illustrationBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 24,
    lineHeight: 22,
  },
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    zIndex: 1,
  },
  activeTab: {
    // Active styles are handled by the indicator
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    top: 4,
    left: 4,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  activeTabText: {
    color: Colors.primary[600],
  },
  formContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    padding: 0,
    height: 24,
  },
  requiredStar: {
    color: Colors.primary[500],
    marginLeft: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  scanButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scanButtonTextContainer: {
    flex: 1,
  },
  scanButtonTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary[700],
    marginBottom: 2,
  },
  scanButtonSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.primary[600],
    lineHeight: 18,
  },
  scanButtonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonShadow: {
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: Colors.primary[600],
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary[600],
  },
  buttonIconContainer: {
    marginLeft: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  noteIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
}); 