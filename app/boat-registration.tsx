import React, { useState } from 'react';
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
  Image
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
  Waves
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

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
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: focused.value === 1 ? Colors.primary[400] : Colors.neutral[200],
      backgroundColor: focused.value === 1 ? 'rgba(230, 238, 245, 0.5)' : 'rgba(255, 255, 255, 0.9)',
      transform: [{ scale: focused.value === 1 ? 1.02 : 1 }]
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
      <View style={styles.inputIcon}>
        {icon}
      </View>
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
    </Animated.View>
  );
};

export default function BoatRegistrationScreen() {
  const { user, associateBoat } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'additional'>('basic');
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
    // Animate the indicator
    tabIndicatorPosition.value = withTiming(
      tab === 'basic' ? 0 : 150, 
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
    <>
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
            maxLength={6}
          />
        </View>
      </View>

      <AnimatedInput
        label="Registration Number"
        icon={<BookText size={22} color={Colors.primary[600]} />}
        value={boatDetails.registrationNumber}
        onChangeText={(value) => updateBoatDetail('registrationNumber', value)}
        placeholder="Enter registration number"
        maxLength={20}
        required
      />
    </>
  );

  const renderAdditionalInfoForm = () => (
    <>
      <AnimatedInput
        label="Manufacturer"
        icon={<PenLine size={22} color={Colors.primary[600]} />}
        value={boatDetails.manufacturer}
        onChangeText={(value) => updateBoatDetail('manufacturer', value)}
        placeholder="Enter manufacturer"
        maxLength={50}
      />

      <AnimatedInput
        label="Engine Type"
        icon={<Gauge size={22} color={Colors.primary[600]} />}
        value={boatDetails.engineType}
        onChangeText={(value) => updateBoatDetail('engineType', value)}
        placeholder="Enter engine type"
        maxLength={50}
      />

      <AnimatedInput
        label="Hull Material"
        icon={<Waves size={22} color={Colors.primary[600]} />}
        value={boatDetails.hullMaterial}
        onChangeText={(value) => updateBoatDetail('hullMaterial', value)}
        placeholder="Enter hull material"
        maxLength={50}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.primary[900], Colors.primary[700]]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register Your Boat</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Boat Information</Text>
              <Text style={styles.sectionDescription}>
                Enter your boat details manually or scan a QR code
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.tabsContainer}>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'basic' && styles.activeTab]} 
                  onPress={() => handleTabChange('basic')}
                >
                  <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
                    Basic Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'additional' && styles.activeTab]} 
                  onPress={() => handleTabChange('additional')}
                >
                  <Text style={[styles.tabText, activeTab === 'additional' && styles.activeTabText]}>
                    Additional Info
                  </Text>
                </TouchableOpacity>
                <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
              </View>

              <View style={styles.formContent}>
                {activeTab === 'basic' ? renderBasicInfoForm() : renderAdditionalInfoForm()}
              </View>
            </View>

            <View style={styles.qrSection}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              
              <TouchableOpacity style={styles.qrButton} onPress={handleScanQRCode}>
                <LinearGradient
                  colors={[Colors.primary[500], Colors.primary[700]]}
                  style={styles.qrButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Camera size={24} color="#FFFFFF" />
                  <Text style={styles.qrButtonText}>Scan QR Code Instead</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleRegisterBoat}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[700]]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Register Boat</Text>
                    <ArrowRight size={20} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary[900],
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  formContainer: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  activeTabText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary[700],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 150,
    height: 3,
    backgroundColor: Colors.primary[600],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  formContent: {
    padding: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(230, 238, 245, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  requiredStar: {
    color: Colors.accent[600],
    fontSize: 14,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[900],
    padding: 0,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrSection: {
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 16,
  },
  qrButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  qrButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  qrButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  submitButton: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 12,
  },
}); 