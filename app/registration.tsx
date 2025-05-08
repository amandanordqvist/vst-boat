import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ship, Phone, ChevronLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function RegistrationScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mockGeneratedCode, setMockGeneratedCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [timer, isResendDisabled]);

  const generateVerificationCode = () => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockGeneratedCode(code);
    
    // Display the code in an alert (simulating an SMS)
    Alert.alert(
      "Verification Code",
      `Your verification code is ${code}`,
      [{ text: "OK" }]
    );
    
    // Start the timer for resend button
    setTimer(60);
    setIsResendDisabled(true);
  };

  const handleSendVerificationCode = () => {
    // Remove any non-digit characters from the phone number
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if the cleaned number has at least 10 digits
    if (!cleanedNumber || cleanedNumber.length < 10) {
      Alert.alert(
        "Invalid Phone Number", 
        "Please enter a valid phone number with at least 10 digits. You entered " + cleanedNumber.length + " digits."
      );
      return;
    }
    
    // Store the cleaned number
    setPhoneNumber(cleanedNumber);
    generateVerificationCode();
    setCurrentStep(2);
  };

  const handleResendCode = () => {
    if (isResendDisabled) return;
    generateVerificationCode();
  };

  const handleVerifyCode = () => {
    if (verificationCode === mockGeneratedCode) {
      // Code is correct
      Alert.alert(
        "Success",
        "Phone number verified successfully!",
        [{ text: "Continue", onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      // Code is incorrect
      Alert.alert("Invalid Code", "The verification code you entered is incorrect. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderPhoneNumberStep = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Phone size={32} color={Colors.primary[700]} />
          </View>
        </View>
        
        <Text style={styles.stepTitle}>Phone Verification</Text>
        
        <Text style={styles.stepDescription}>
          Enter your phone number to receive a verification code for registration
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+1</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.neutral[400]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          <Text style={styles.helperText}>
            Example: 555-123-4567 or (555) 123-4567
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleSendVerificationCode}
        >
          <Text style={styles.actionButtonText}>Send Verification Code</Text>
          <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderVerificationStep = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={32} color={Colors.primary[700]} />
          </View>
        </View>
        
        <Text style={styles.stepTitle}>Verify Your Number</Text>
        
        <Text style={styles.stepDescription}>
          Enter the 6-digit verification code sent to <Text style={styles.highlightText}>+1 {phoneNumber}</Text>
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Verification Code</Text>
          <View style={styles.codeInputWrapper}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit code"
              placeholderTextColor={Colors.neutral[400]}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleVerifyCode}
        >
          <Text style={styles.actionButtonText}>Verify Code</Text>
          <Check size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={isResendDisabled}
          >
            <Text 
              style={[
                styles.resendButton, 
                isResendDisabled && styles.resendButtonDisabled
              ]}
            >
              {isResendDisabled ? `Resend in ${timer}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A3355' }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0A3355', '#1A5F9C']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Boat Registration</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: currentStep === 1 ? '50%' : '100%' }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep} of 2
            </Text>
          </View>

          {currentStep === 1 ? renderPhoneNumberStep() : renderVerificationStep()}
          
          <View style={styles.boatImageContainer}>
            <Ship size={120} color="rgba(255, 255, 255, 0.1)" />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
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
    flexGrow: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent[500],
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  stepTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  highlightText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary[700],
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5F0FF',
  },
  countryCode: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.primary[700],
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5F0FF',
  },
  input: {
    flex: 1,
    height: 54,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  codeInputWrapper: {
    backgroundColor: '#F7FAFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5F0FF',
  },
  codeInput: {
    height: 54,
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.neutral[800],
    textAlign: 'center',
    letterSpacing: 4,
  },
  actionButton: {
    backgroundColor: Colors.primary[700],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: Colors.primary[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  resendButton: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.primary[700],
  },
  resendButtonDisabled: {
    color: Colors.neutral[500],
  },
  boatImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  helperText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 4,
    marginLeft: 4,
  },
}); 