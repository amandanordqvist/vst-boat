import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  SafeAreaView,
  Pressable
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Shield, 
  Award, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  Upload
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeIn,
  SlideInUp 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

// Interface for tab props
interface TabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

// Tab component
const Tab: React.FC<TabProps> = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.tab, isActive && styles.activeTab]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
      {isActive && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );
};

// Interface for section header props
interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

// Section header component
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconContainer}>
        {icon}
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};

// Interface for form field props
interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  completed?: boolean;
}

// Form field component
const FormField: React.FC<FormFieldProps> = ({ label, value, placeholder, completed }) => {
  return (
    <View style={styles.formField}>
      <View style={styles.formFieldHeader}>
        <Text style={styles.formFieldLabel}>{label}</Text>
        {completed && <View style={styles.completedIndicator} />}
      </View>
      <View style={styles.formFieldInput}>
        <Text style={value ? styles.formFieldValue : styles.formFieldPlaceholder}>
          {value || placeholder}
        </Text>
        <ChevronRight size={18} color={Colors.neutral[400]} />
      </View>
    </View>
  );
};

export default function ProfileCreationScreen() {
  const [activeTab, setActiveTab] = useState<'personal' | 'boating' | 'preferences'>('personal');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  // Mock data for profile fields
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Amanda Nordqvist',
    phone: '+46 700 123 456',
    email: '',
    dob: '',
    address: '',
    emergencyContact: ''
  });
  
  const [boatingInfo, setBoatingInfo] = useState({
    experience: '',
    license: '',
    certifications: '',
    preferredWaters: ''
  });
  
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    units: 'Metric',
    language: 'English'
  });
  
  // Track which fields have been "completed" for the mock
  const getCompletionStatus = (field: string, section: 'personal' | 'boating' | 'preferences') => {
    if (section === 'personal') {
      return !!personalInfo[field as keyof typeof personalInfo];
    } else if (section === 'boating') {
      return !!boatingInfo[field as keyof typeof boatingInfo];
    }
    return true;
  };
  
  // Animate content when tab changes
  useEffect(() => {
    contentOpacity.value = 0;
    contentTranslateY.value = 20;
    
    setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 300 });
      contentTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }, 50);
  }, [activeTab]);
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }]
    };
  });
  
  const renderPersonalInfo = () => (
    <Animated.View style={[styles.tabContent, contentAnimatedStyle]}>
      <View style={styles.profileImageSection}>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <User size={40} color={Colors.neutral[400]} />
            </View>
          )}
          <View style={styles.cameraButton}>
            <Camera size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.uploadPhotoText}>Upload Photo</Text>
      </View>
      
      <SectionHeader 
        title="Personal Information" 
        icon={<User size={20} color={Colors.primary[700]} />} 
      />
      
      <FormField 
        label="Full Name" 
        value={personalInfo.name} 
        placeholder="Enter your full name" 
        completed={getCompletionStatus('name', 'personal')}
      />
      
      <FormField 
        label="Phone Number" 
        value={personalInfo.phone} 
        placeholder="Enter your phone number" 
        completed={getCompletionStatus('phone', 'personal')}
      />
      
      <FormField 
        label="Email Address" 
        value={personalInfo.email} 
        placeholder="Enter your email address" 
        completed={getCompletionStatus('email', 'personal')}
      />
      
      <FormField 
        label="Date of Birth" 
        value={personalInfo.dob} 
        placeholder="Select your date of birth" 
        completed={getCompletionStatus('dob', 'personal')}
      />
      
      <SectionHeader 
        title="Contact Information" 
        icon={<MapPin size={20} color={Colors.primary[700]} />} 
      />
      
      <FormField 
        label="Address" 
        value={personalInfo.address} 
        placeholder="Enter your address" 
        completed={getCompletionStatus('address', 'personal')}
      />
      
      <FormField 
        label="Emergency Contact" 
        value={personalInfo.emergencyContact} 
        placeholder="Add emergency contact" 
        completed={getCompletionStatus('emergencyContact', 'personal')}
      />
    </Animated.View>
  );
  
  const renderBoatingInfo = () => (
    <Animated.View style={[styles.tabContent, contentAnimatedStyle]}>
      <SectionHeader 
        title="Boating Experience" 
        icon={<Award size={20} color={Colors.primary[700]} />} 
      />
      
      <FormField 
        label="Experience Level" 
        value={boatingInfo.experience} 
        placeholder="Select your experience level" 
        completed={getCompletionStatus('experience', 'boating')}
      />
      
      <FormField 
        label="Boating License" 
        value={boatingInfo.license} 
        placeholder="Add license information" 
        completed={getCompletionStatus('license', 'boating')}
      />
      
      <FormField 
        label="Certifications" 
        value={boatingInfo.certifications} 
        placeholder="Add relevant certifications" 
        completed={getCompletionStatus('certifications', 'boating')}
      />
      
      <FormField 
        label="Preferred Waters" 
        value={boatingInfo.preferredWaters} 
        placeholder="Select preferred water types" 
        completed={getCompletionStatus('preferredWaters', 'boating')}
      />
      
      <SectionHeader 
        title="Safety Information" 
        icon={<Shield size={20} color={Colors.primary[700]} />} 
      />
      
      <View style={styles.safetyInfoBox}>
        <Text style={styles.safetyInfoText}>
          Please ensure your safety information is up to date. This information will be used in case of emergencies.
        </Text>
      </View>
    </Animated.View>
  );
  
  const renderPreferences = () => (
    <Animated.View style={[styles.tabContent, contentAnimatedStyle]}>
      <SectionHeader 
        title="App Preferences" 
        icon={<Settings size={20} color={Colors.primary[700]} />} 
      />
      
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Notifications</Text>
        <View style={[styles.preferenceToggle, preferences.notifications && styles.preferenceToggleActive]}>
          <View style={[styles.preferenceToggleCircle, preferences.notifications && styles.preferenceToggleCircleActive]} />
        </View>
      </View>
      
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Dark Mode</Text>
        <View style={[styles.preferenceToggle, preferences.darkMode && styles.preferenceToggleActive]}>
          <View style={[styles.preferenceToggleCircle, preferences.darkMode && styles.preferenceToggleCircleActive]} />
        </View>
      </View>
      
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Measurement Units</Text>
        <View style={styles.preferenceSelector}>
          <Text style={styles.preferenceSelectorText}>{preferences.units}</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </View>
      </View>
      
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Language</Text>
        <View style={styles.preferenceSelector}>
          <Text style={styles.preferenceSelectorText}>{preferences.language}</Text>
          <ChevronRight size={18} color={Colors.neutral[400]} />
        </View>
      </View>
      
      <View style={styles.privacySection}>
        <TouchableOpacity style={styles.privacyButton}>
          <Text style={styles.privacyButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.privacyButton}>
          <Text style={styles.privacyButtonText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
  
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'boating':
        return renderBoatingInfo();
      case 'preferences':
        return renderPreferences();
      default:
        return renderPersonalInfo();
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>60% complete</Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <Tab 
            title="Personal" 
            isActive={activeTab === 'personal'} 
            onPress={() => setActiveTab('personal')} 
          />
          <Tab 
            title="Boating" 
            isActive={activeTab === 'boating'} 
            onPress={() => setActiveTab('boating')} 
          />
          <Tab 
            title="Preferences" 
            isActive={activeTab === 'preferences'} 
            onPress={() => setActiveTab('preferences')} 
          />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderActiveTabContent()}
        </ScrollView>

        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.neutral[700]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[100] || '#F8FAFC',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 6,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  skipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[600],
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: Colors.primary[500],
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  activeTabText: {
    color: Colors.primary[700],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary[500],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  tabContent: {
    padding: 16,
  },
  profileImageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadPhotoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  formField: {
    marginBottom: 16,
  },
  formFieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  formFieldLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  completedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  formFieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formFieldValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    flex: 1,
  },
  formFieldPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[400],
    flex: 1,
  },
  safetyInfoBox: {
    backgroundColor: Colors.primary[100],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  safetyInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary[700],
    lineHeight: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  preferenceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.neutral[800],
  },
  preferenceToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    padding: 2,
  },
  preferenceToggleActive: {
    backgroundColor: Colors.primary[500],
  },
  preferenceToggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  preferenceToggleCircleActive: {
    alignSelf: 'flex-end',
  },
  preferenceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceSelectorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[700],
    marginRight: 8,
  },
  privacySection: {
    marginTop: 24,
  },
  privacyButton: {
    paddingVertical: 12,
  },
  privacyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.primary[600],
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.primary[500],
  },
  saveButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 