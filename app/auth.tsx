import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ColorValue,
  TextInputProps,
  Pressable,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Shield, ChevronRight, Lock, User, ShieldCheck, Anchor, Users, Waves, QrCode, Info, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth, UserRole } from '@/hooks/useAuth';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

// Add this responsive scaling function
const scale = (size: number, factor = 0.3) => {
  return size + (isSmallScreen ? -size * factor : 21);
};

// Interface for animated input props
interface AnimatedInputProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

// Animated Input component with cleaner styling
const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType, 
  autoFocus, 
  secureTextEntry,
  maxLength,
  autoCapitalize = 'none'
}) => {
  const isFocused = useSharedValue(0);
  
  const containerStyle = useAnimatedStyle(() => {
    const borderColorValue = interpolate(
      isFocused.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      borderColor: borderColorValue === 0 ? Colors.neutral[200] : Colors.primary[400],
      backgroundColor: interpolate(
        isFocused.value,
        [0, 1],
        [Colors.neutral[50], Colors.primary[50]]
      ),
      transform: [{ scale: interpolate(
        isFocused.value,
        [0, 1],
        [1, 1.01],
        Extrapolation.CLAMP
      )}],
      shadowOpacity: interpolate(
        isFocused.value,
        [0, 1],
        [0.05, 0.1]
      )
    };
  });
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        isFocused.value,
        [0, 1],
        [0.7, 1]
      ),
      transform: [{ scale: interpolate(
        isFocused.value,
        [0, 1],
        [1, 1.05],
        Extrapolation.CLAMP
      )}]
    };
  });
  
  const handleFocus = () => {
    isFocused.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    isFocused.value = withTiming(0, { duration: 200 });
  };
  
  return (
    <Animated.View style={[styles.inputContainer, containerStyle]}>
      <Animated.View style={iconStyle}>
        {icon}
      </Animated.View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  );
};

// Interface for animated button props
interface AnimatedButtonProps {
  text: string;
  icon?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  secondary?: boolean;
}

// Animated Button component with ripple effect
const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  text, 
  icon, 
  onPress, 
  disabled, 
  isLoading, 
  secondary = false 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.7 : opacity.value
    };
  });
  
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  };
  
  return (
    <Animated.View style={[buttonStyle, secondary ? {} : styles.buttonShadow]}>
      <TouchableOpacity 
        style={[
          secondary ? styles.secondaryButton : styles.primaryButton,
          disabled && styles.disabledButton
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={secondary ? Colors.primary[600] : "#FFFFFF"} size="small" />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>{text}</Text>
            {icon && <View style={styles.buttonIconContainer}>{icon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Interface for role option props
interface RoleOptionProps {
  icon: React.ReactNode;
  title: string;
  isSelected: boolean;
  onSelect: () => void;
}

// Role option component
const RoleOption: React.FC<RoleOptionProps> = ({ 
  icon, 
  title, 
  isSelected, 
  onSelect 
}) => {
  const scale = useSharedValue(1);
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };
  
  return (
    <Animated.View style={[containerStyle, styles.roleOptionContainer]}>
      <TouchableOpacity 
        style={[styles.roleOption, isSelected && styles.roleOptionSelected]} 
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={[styles.roleIconContainer, isSelected && styles.roleIconContainerSelected]}>
          {icon}
        </View>
        <Text style={[styles.roleText, isSelected && styles.roleTextSelected]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Country code type
interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
];

// Modify the AnimatedPhoneInput component to match the screenshot
const AnimatedPhoneInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}> = ({ value, onChangeText, autoFocus }) => {
  const isFocused = useSharedValue(0);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[2]); // Sweden by default
  
  const containerStyle = useAnimatedStyle(() => {
    const borderColorValue = interpolate(
      isFocused.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      borderColor: borderColorValue === 0 ? Colors.neutral[200] : Colors.primary[400],
      backgroundColor: interpolate(
        isFocused.value,
        [0, 1],
        [Colors.neutral[50], Colors.primary[50]]
      ),
      transform: [{ scale: interpolate(
        isFocused.value,
        [0, 1],
        [1, 1.01],
        Extrapolation.CLAMP
      )}],
      shadowOpacity: interpolate(
        isFocused.value,
        [0, 1],
        [0.05, 0.1]
      )
    };
  });
  
  const handleFocus = () => {
    isFocused.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    isFocused.value = withTiming(0, { duration: 200 });
    // Auto-close country picker when input loses focus
    setIsCountryPickerOpen(false);
  };

  const handleSelectCountry = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsCountryPickerOpen(false);
  };
  
  return (
    <>
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        <View style={styles.countryCodeSelector}>
          <Phone color={Colors.primary[600]} size={20} style={{marginRight: 8}} />
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <TouchableOpacity 
            style={styles.countryCodeButton}
            onPress={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
          >
            <Text style={styles.countryCode}>{selectedCountry.code}</Text>
            <ChevronDown size={14} color={Colors.neutral[500]} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputDivider} />
        <TextInput
          style={styles.phoneInput}
          placeholder="XXX XXX XXXX"
          placeholderTextColor={Colors.neutral[400]}
          value={value.replace(selectedCountry.code, '')}
          onChangeText={(text) => onChangeText(selectedCountry.code + text)}
          keyboardType="phone-pad"
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      
      {isCountryPickerOpen && (
        <Animated.View 
          entering={Animated.FadeInDown}
          style={styles.countryPickerContainer}
        >
          {COUNTRY_CODES.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryPickerItem,
                selectedCountry.code === country.code && styles.countryPickerItemSelected
              ]}
              onPress={() => handleSelectCountry(country)}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={styles.countryName}>{country.name}</Text>
              <Text style={styles.countryCode}>{country.code}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </>
  );
};

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { sendVerificationCode, verifyPhoneAndLogin, isLoading, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [step, setStep] = useState(1); // 1: Phone, 2: Verification, 3: New User Info
  const [isNewUser, setIsNewUser] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  
  // Add keyboard listener to adjust UI when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Platform.OS === 'ios' ? 
      Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true)) :
      Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
      
    const keyboardDidHideListener = Platform.OS === 'ios' ? 
      Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false)) :
      Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Animate form entrance
    formOpacity.value = withTiming(1, { duration: 500 });
    formTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1.7)) });
  }, []);
  
  // Handle step changes with animation
  useEffect(() => {
    // Reset and start animation when step changes
    formOpacity.value = 0;
    formTranslateY.value = 50;
    
    formOpacity.value = withTiming(1, { duration: 400 });
    formTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1.7)) });
  }, [step]);

  // Move navigation to useEffect instead of component body
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format with country code
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return `+${cleaned}`;
    if (cleaned.length <= 5) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const handleSendCode = async () => {
    if (phone.length < 8) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }
    
    const success = await sendVerificationCode(phone.replace(/\s/g, ''));
    if (success) {
      setStep(2);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
      return;
    }
    
    const cleanPhone = phone.replace(/\s/g, '');
    const success = await verifyPhoneAndLogin(cleanPhone, verificationCode);
    
    if (success) {
      // Success means the user exists, navigate to main app
      router.replace('/(tabs)');
    } else {
      // User doesn't exist, show registration screen
      setIsNewUser(true);
      setStep(3);
    }
  };

  const handleRegister = async () => {
    if (!name) {
      Alert.alert('Missing Information', 'Please enter your name');
      return;
    }
    
    const cleanPhone = phone.replace(/\s/g, '');
    const success = await verifyPhoneAndLogin(
      cleanPhone, 
      verificationCode,
      name,
      selectedRole
    );
    
    if (success) {
      // Navigate to profile creation for new users
      router.replace('/profile-creation');
    }
  };

  // Example phone number helper
  const fillTestCredentials = () => {
    setPhone('+46701234567'); // This is one of the mock users
    setStep(2); // Move to verification step
  };

  const handleAutoVerify = () => {
    setVerificationCode('123456');
    // Let's use setTimeout to ensure the state is updated before verification
    setTimeout(() => {
      handleVerifyCode();
    }, 100);
  };

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }]
    };
  });

  const renderPhoneInput = () => (
    <Animated.View style={[styles.formContent, formAnimatedStyle]}>
      {!keyboardOpen && (
        <View style={styles.boatIllustrationContainer}>
          <LinearGradient
            colors={[Colors.primary[100], Colors.primary[200]]}
            style={styles.boatIllustrationGradient}
          >
            <Anchor color={Colors.primary[700]} size={scale(48)} />
          </LinearGradient>
        </View>
      )}
      
      <Text style={styles.formTitle}>Let's get started</Text>
      <Text style={styles.formSubtitle}>Enter your phone number to continue</Text>
      
      <AnimatedPhoneInput
        value={phone}
        onChangeText={handlePhoneChange}
        autoFocus
      />
      
      <Text style={styles.privacyText}>
        We'll send a verification code to this number. Standard message rates may apply.
      </Text>
      
      <AnimatedButton
        text="Continue"
        icon={<ChevronRight size={20} color="#FFFFFF" />}
        onPress={handleSendCode}
        disabled={phone.length < 8}
        isLoading={isLoading}
      />

      {/* Quick Test Login Button */}
      <TouchableOpacity 
        style={styles.quickLoginButton}
        onPress={fillTestCredentials}
      >
        <Text style={styles.quickLoginText}>Quick Login (Development Only)</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider} />
      </View>
      
      <TouchableOpacity 
        style={styles.qrCodeContainer}
        onPress={() => router.push('/boat-scanner?mode=login')}
      >
        <View style={styles.qrCodeIconContainer}>
          <QrCode size={22} color={Colors.primary[600]} />
        </View>
        <View style={styles.qrTextContainer}>
          <Text style={styles.qrCodeTitle}>Scan QR Code</Text>
          <Text style={styles.qrCodeDescription}>
            Quick login by scanning your vessel's QR code
          </Text>
        </View>
        <View style={styles.qrArrowContainer}>
          <ChevronRight size={18} color={Colors.primary[500]} />
        </View>
      </TouchableOpacity>

      <Text style={styles.learnMoreText}>
        <Text style={styles.learnMoreLink} onPress={() => console.log('Learn more pressed')}>
          Learn more
        </Text> about VST Boat
      </Text>
    </Animated.View>
  );

  const renderVerificationInput = () => (
    <Animated.View style={[styles.formContent, formAnimatedStyle]}>
      <Text style={styles.formTitle}>Verification</Text>
      <Text style={styles.formSubtitle}>
        Enter the 6-digit code sent to {phone}
      </Text>
      
      <AnimatedInput
        icon={<Lock color={Colors.primary[600]} size={22} />}
        placeholder="123456"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />
      
      <AnimatedButton
        text="Verify"
        icon={<ChevronRight size={20} color="#FFFFFF" />}
        onPress={handleVerifyCode}
        disabled={verificationCode.length !== 6}
        isLoading={isLoading}
      />

      {/* Quick Verify Button */}
      <TouchableOpacity
        style={{
          padding: 12,
          alignItems: 'center',
          marginBottom: 12,
          backgroundColor: Colors.primary[100],
          borderRadius: 8,
        }}
        onPress={handleAutoVerify}
      >
        <Text style={{ color: Colors.primary[700], fontWeight: '500' }}>
          Quick Verify (Dev Only)
        </Text>
      </TouchableOpacity>
      
      <AnimatedButton
        text="Change phone number"
        onPress={() => setStep(1)}
        secondary
      />
    </Animated.View>
  );

  const renderRoleSelection = () => (
    <View style={styles.roleContainer}>
      <Text style={styles.roleLabel}>Select Your Role</Text>
      <View style={styles.roleOptions}>
        <RoleOption
          icon={<ShieldCheck size={24} color={selectedRole === 'owner' ? '#FFFFFF' : Colors.neutral[500]} />}
          title="Owner"
          isSelected={selectedRole === 'owner'}
          onSelect={() => setSelectedRole('owner')}
        />
        
        <RoleOption
          icon={<Anchor size={24} color={selectedRole === 'captain' ? '#FFFFFF' : Colors.neutral[500]} />}
          title="Captain"
          isSelected={selectedRole === 'captain'}
          onSelect={() => setSelectedRole('captain')}
        />
        
        <RoleOption
          icon={<Users size={24} color={selectedRole === 'crew' ? '#FFFFFF' : Colors.neutral[500]} />}
          title="Crew"
          isSelected={selectedRole === 'crew'}
          onSelect={() => setSelectedRole('crew')}
        />
      </View>
    </View>
  );

  const renderProfileInput = () => (
    <Animated.View style={[styles.formContent, formAnimatedStyle]}>
      <Text style={styles.formTitle}>Create Profile</Text>
      <Text style={styles.formSubtitle}>
        Looks like you're new here! Let's set up your profile.
      </Text>
      
      <AnimatedInput
        icon={<User color={Colors.primary[600]} size={22} />}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
      />
      
      {renderRoleSelection()}
      
      <AnimatedButton
        text="Complete Setup"
        icon={<ChevronRight size={20} color="#FFFFFF" />}
        onPress={handleRegister}
        disabled={!name}
        isLoading={isLoading}
      />
    </Animated.View>
  );

  const renderForm = () => {
    switch (step) {
      case 1:
        return renderPhoneInput();
      case 2:
        return renderVerificationInput();
      case 3:
        return renderProfileInput();
      default:
        return renderPhoneInput();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? (insets.bottom > 0 ? 20 : 40) : 0}
      >
        <LinearGradient
          colors={[Colors.primary[900], Colors.primary[700], Colors.primary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        >
          <View style={styles.wavesOverlay}>
            <Waves color="rgba(255,255,255,0.05)" size={width * 1.2} style={styles.waveLarge} />
            <Waves color="rgba(255,255,255,0.08)" size={width} style={styles.waveMedium} />
            <Waves color="rgba(255,255,255,0.12)" size={width * 0.8} style={styles.waveSmall} />
          </View>
          
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { 
                paddingBottom: Math.max(insets.bottom, 24),
                justifyContent: keyboardOpen ? 'flex-start' : 'center',
                paddingTop: keyboardOpen ? Math.max(insets.top + 20, 44) : Math.max(insets.top, 24)
              }
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {!keyboardOpen && (
              <View style={[styles.logoContainer, isSmallScreen && styles.logoContainerSmall]}>
                <View style={styles.logoWrapper}>
                  <MaskedView
                    style={[styles.maskView, isSmallScreen && styles.maskViewSmall]}
                    maskElement={
                      <View style={styles.maskContainer}>
                        <Shield size={isSmallScreen ? 60 : 72} color="black" />
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={['#6AAEF0', '#3D7AB3', '#FFFFFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientLogo}
                    />
                  </MaskedView>
                  
                  <Text style={[styles.appName, isSmallScreen && styles.appNameSmall]}>VST Boat</Text>
                  <Text style={[styles.tagline, isSmallScreen && styles.taglineSmall]}>Your Complete Marine Experience</Text>
                </View>
              </View>
            )}
            
            <Animated.View style={[
              styles.formContainer, 
              isSmallScreen && styles.formContainerSmall,
              keyboardOpen && styles.formContainerKeyboard
            ]}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.98)']}
                style={styles.formGradient}
              >
                {renderForm()}
              </LinearGradient>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary[900],
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wavesOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  waveLarge: {
    position: 'absolute',
    top: height * 0.05,
    left: -width * 0.2,
    transform: [{ rotate: '10deg' }],
  },
  waveMedium: {
    position: 'absolute',
    top: height * 0.2,
    right: -width * 0.1,
    transform: [{ rotate: '-5deg' }],
  },
  waveSmall: {
    position: 'absolute',
    bottom: height * 0.1,
    left: -width * 0.1,
    transform: [{ rotate: '15deg' }],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Math.min(24, width * 0.06), // Responsive horizontal padding
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainerSmall: {
    marginBottom: 24,
  },
  logoWrapper: {
    width: '80%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  maskView: {
    height: 170,
    width: 72,
    marginBottom: 20,
  },
  maskViewSmall: {
    height: 60,
    width: 60,
    marginBottom: 12,
  },
  maskContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientLogo: {
    height: '100%',
    width: '100%',
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: Math.min(32, width * 0.08), // Responsive font size
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  appNameSmall: {
    fontSize: Math.min(28, width * 0.07),
    marginBottom: 4,
  },
  tagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(16, width * 0.04),
    color: '#E5F2FF',
    opacity: 0.9,
    textAlign: 'center',
  },
  taglineSmall: {
    fontSize: Math.min(14, width * 0.035),
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  formContainerSmall: {
    borderRadius: 20,
  },
  formContainerKeyboard: {
    marginTop: 20,
    maxHeight: height * 0.8,
  },
  formGradient: {
    width: '100%',
    height: '100%',
  },
  formContent: {
    padding: 24,
  },
  formTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  formSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    paddingLeft: 6,
  },
  buttonShadow: {
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#6B8598', // This matches the screenshot's button color better
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
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
  buttonIconContainer: {
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary[600],
  },
  roleContainer: {
    marginBottom: 28,
  },
  roleLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.neutral[700],
    marginBottom: 16,
    marginLeft: 4,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOptionContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  roleOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 12 : 16,
    borderRadius: 16,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    shadowColor: Colors.primary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  roleOptionSelected: {
    borderColor: Colors.primary[400],
    backgroundColor: Colors.primary[100],
  },
  roleIconContainer: {
    width: isSmallScreen ? 40 : 48,
    height: isSmallScreen ? 40 : 48,
    borderRadius: isSmallScreen ? 20 : 24,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallScreen ? 8 : 10,
  },
  roleIconContainerSelected: {
    backgroundColor: Colors.primary[600],
  },
  roleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: isSmallScreen ? 12 : 13,
    color: Colors.neutral[600],
  },
  roleTextSelected: {
    color: Colors.primary[600],
    fontFamily: 'Poppins-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[300],
  },
  dividerText: {
    marginHorizontal: 12,
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.neutral[500],
  },
  boatIllustrationContainer: {
    width: '100%',
    height: 100,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boatIllustrationGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[500],
    marginBottom: 24,
    lineHeight: 18,
  },
  countryCodeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryCode: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.neutral[700],
    marginRight: 4,
  },
  inputDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.neutral[300],
    marginHorizontal: 8,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    paddingLeft: 6,
  },
  countryPickerContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginTop: -16,
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 200,
  },
  countryPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  countryName: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
    marginLeft: 8,
  },
  qrCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  qrCodeIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  qrTextContainer: {
    flex: 1,
  },
  qrCodeTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary[700],
    marginBottom: 2,
  },
  qrCodeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.primary[600],
    lineHeight: 18,
  },
  qrArrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  learnMoreLink: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary[600],
  },
  quickLoginButton: {
    padding: 12,
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quickLoginText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary[700],
  },
}); 