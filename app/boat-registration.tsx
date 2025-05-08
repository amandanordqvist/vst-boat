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
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ship, ChevronLeft, Camera, ArrowRight, BookText, Info, CalendarDays, Ruler, PenLine, Anchor } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

interface BoatDetails {
  name: string;
  model: string;
  year: string;
  length: string;
  registrationNumber: string;
}

export default function BoatRegistrationScreen() {
  const { user, associateBoat } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [boatDetails, setBoatDetails] = useState<BoatDetails>({
    name: '',
    model: '',
    year: '',
    length: '',
    registrationNumber: '',
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0A3355', '#1A5F9C']}
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
              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Ship size={22} color={Colors.primary[600]} />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Boat Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter boat name"
                    placeholderTextColor={Colors.neutral[400]}
                    value={boatDetails.name}
                    onChangeText={(value) => updateBoatDetail('name', value)}
                    maxLength={50}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <Anchor size={22} color={Colors.primary[600]} />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Boat Model</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter boat model"
                    placeholderTextColor={Colors.neutral[400]}
                    value={boatDetails.model}
                    onChangeText={(value) => updateBoatDetail('model', value)}
                    maxLength={50}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.halfInputGroup]}>
                  <View style={styles.inputIcon}>
                    <CalendarDays size={22} color={Colors.primary[600]} />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Year</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY"
                      placeholderTextColor={Colors.neutral[400]}
                      value={boatDetails.year}
                      onChangeText={(value) => updateBoatDetail('year', value)}
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, styles.halfInputGroup]}>
                  <View style={styles.inputIcon}>
                    <Ruler size={22} color={Colors.primary[600]} />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Length (ft)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Length"
                      placeholderTextColor={Colors.neutral[400]}
                      value={boatDetails.length}
                      onChangeText={(value) => updateBoatDetail('length', value)}
                      keyboardType="decimal-pad"
                      maxLength={6}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputIcon}>
                  <BookText size={22} color={Colors.primary[600]} />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Registration Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter registration number"
                    placeholderTextColor={Colors.neutral[400]}
                    value={boatDetails.registrationNumber}
                    onChangeText={(value) => updateBoatDetail('registrationNumber', value)}
                    maxLength={20}
                  />
                </View>
              </View>
            </View>

            <View style={styles.qrSection}>
              <TouchableOpacity style={styles.qrButton} onPress={handleScanQRCode}>
                <Camera size={24} color={Colors.primary[600]} />
                <Text style={styles.qrButtonText}>Scan QR Code Instead</Text>
              </TouchableOpacity>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleRegisterBoat}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Register Boat</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <Info size={16} color={Colors.neutral[400]} />
              <Text style={styles.infoText}>
                All registered boats will be associated with your account and can be managed from the Vessel screen.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A3355',
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
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  formContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  inputIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    paddingVertical: 8,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInputGroup: {
    width: '48%',
  },
  qrSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  qrButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  qrButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.primary[600],
    marginLeft: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 12,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[600],
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[400],
    marginLeft: 8,
    lineHeight: 18,
  },
}); 