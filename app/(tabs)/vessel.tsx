import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions, Share, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Anchor, Ship, Ruler, Calendar, PenTool as Tool, FileText, LifeBuoy, Gauge, PlusCircle, 
  Copy, MapPin, Navigation2, Home, Settings, RefreshCw, Shield, Heart, MessageSquare, 
  Edit3, Smartphone, Share2, Info, Wrench, Layers, Disc, Droplets, AlertTriangle,
  Cloud, Check, Rotate3D, Facebook, Twitter, Instagram, Wind, ThermometerSun, X
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import VesselHealthCard from '@/components/VesselHealthCard';
import WeatherAdvisories, { defaultWeatherAlerts } from '@/components/WeatherAdvisories';
import ActionMenu from '../../components/ActionMenu';
import VesselDocumentsSection, { sampleDocuments } from '../../components/VesselDocumentsSection';
import VesselMaintenanceSchedule, { sampleMaintenanceTasks } from '../../components/VesselMaintenanceSchedule';
import VesselDetailsOverview, { sampleVesselData } from '../../components/VesselDetailsOverview';

const { width } = Dimensions.get('window');

// Sample vessel image URL - replace with real image when available
const VESSEL_IMAGE = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

// Sample 3D model images (for demo)
const MODEL_IMAGES = [
  'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9hdCUyMGNhYmlufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
  'https://images.unsplash.com/photo-1520383278046-37a90eb02d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdCUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
];

interface VesselDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
  section?: string;
}

// Health status data
const healthStatus = {
  overall: 92,
  engine: 95,
  hull: 90,
  electrical: 88,
  plumbing: 96
};

const vesselData: VesselDetail[] = [
  // Basic Information
  {
    label: 'Vessel Name',
    value: 'Sea Breeze',
    icon: <Ship size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  {
    label: 'Registration Number',
    value: 'VST-2025-1234',
    icon: <FileText size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  {
    label: 'Vessel Type',
    value: 'Flybridge Motor Yacht',
    icon: <Ship size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  {
    label: 'Manufacturer',
    value: 'Sunseeker',
    icon: <Layers size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  {
    label: 'Model',
    value: 'Manhattan 60',
    icon: <Info size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  {
    label: 'Year Built',
    value: '2023',
    icon: <Calendar size={20} color={Colors.primary[600]} />,
    section: 'basic'
  },
  
  // Physical Specifications
  {
    label: 'Length Overall',
    value: '45 feet (13.7m)',
    icon: <Ruler size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },
  {
    label: 'Beam',
    value: '14 feet (4.3m)',
    icon: <Ruler size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },
  {
    label: 'Draft',
    value: '3.9 feet (1.2m)',
    icon: <Anchor size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },
  {
    label: 'Displacement',
    value: '29 tons',
    icon: <Ruler size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },
  {
    label: 'Hull Material',
    value: 'Fiberglass',
    icon: <Layers size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },
  {
    label: 'Max Capacity',
    value: '12 passengers',
    icon: <Heart size={20} color={Colors.neutral[600]} />,
    section: 'physical'
  },

  // Systems
  {
    label: 'Main Engines',
    value: 'Twin Volvo Penta D6-440',
    icon: <Gauge size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },
  {
    label: 'Horsepower',
    value: '2 x 440 HP',
    icon: <Gauge size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },
  {
    label: 'Max Speed',
    value: '32 knots',
    icon: <Navigation2 size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },
  {
    label: 'Fuel Capacity',
    value: '600 gallons',
    icon: <Droplets size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },
  {
    label: 'Fresh Water',
    value: '150 gallons',
    icon: <LifeBuoy size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },
  {
    label: 'Generator',
    value: 'Onan 17.5 kW',
    icon: <RefreshCw size={20} color={Colors.neutral[600]} />,
    section: 'systems'
  },

  // Documentation
  {
    label: 'Insurance Policy',
    value: 'MAR-98765-2025',
    icon: <Shield size={20} color={Colors.neutral[600]} />,
    section: 'documentation'
  },
  {
    label: 'Insurance Expiry',
    value: 'March 15, 2026',
    icon: <Calendar size={20} color={Colors.neutral[600]} />,
    section: 'documentation'
  },
  {
    label: 'Home Port',
    value: 'Marina Bay Harbor',
    icon: <Home size={20} color={Colors.neutral[600]} />,
    section: 'documentation'
  },
  {
    label: 'Registration Expiry',
    value: 'January 30, 2026',
    icon: <Calendar size={20} color={Colors.neutral[600]} />,
    section: 'documentation'
  },
];

// Group vessel data by section
const getVesselDataBySection = (section: string) => {
  return vesselData.filter(item => item.section === section);
};

export default function VesselScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [currentModelImage, setCurrentModelImage] = useState(0);
  const [weatherAlerts, setWeatherAlerts] = useState(defaultWeatherAlerts);
  
  const handleRegisterBoat = () => {
    router.push('/boat-registration');
  };

  const handleEditVessel = () => {
    console.log('Edit vessel');
  };

  const handleViewDocuments = () => {
    console.log('View documents');
  };

  const handleShareVessel = async () => {
    try {
      await Share.share({
        message: 'Check out my vessel "Sea Breeze" - a Sunseeker Manhattan 60',
        title: 'Sea Breeze Vessel Details',
      });
    } catch (error) {
      console.error('Error sharing vessel details:', error);
    }
  };

  const handleContactManufacturer = () => {
    console.log('Contact manufacturer');
  };

  // Dismiss a weather alert
  const dismissAlert = (id: string) => {
    setWeatherAlerts(weatherAlerts.filter(alert => alert.id !== id));
  };
  
  // Rotate 3D model images
  const rotateModel = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentModelImage((currentModelImage + 1) % MODEL_IMAGES.length);
    } else {
      setCurrentModelImage(currentModelImage === 0 ? MODEL_IMAGES.length - 1 : currentModelImage - 1);
    }
  };
  
  // Define quick actions
  const quickActions = [
    { id: 'edit', icon: <Edit3 size={22} color="#4D7FBF" />, label: 'Edit' },
    { id: 'documents', icon: <FileText size={22} color="#4D7FBF" />, label: 'Documents' },
    { id: 'share', icon: <Share2 size={22} color="#4D7FBF" />, label: 'Share' },
    { id: 'contact', icon: <MessageSquare size={22} color="#4D7FBF" />, label: 'Contact' }
  ];
  
  // Handle quick action press
  const handleActionPress = (actionId: string) => {
    switch (actionId) {
      case 'edit':
        handleEditVessel();
        break;
      case 'documents':
        handleViewDocuments();
        break;
      case 'share':
        handleShareVessel();
        break;
      case 'contact':
        handleContactManufacturer();
        break;
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <View style={styles.headerArea}>
      <View style={styles.headerBar}>
        <Text style={styles.screenTitle}>My Vessel</Text>
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegisterBoat}
        >
          <PlusCircle size={20} color={Colors.primary[600]} />
          <Text style={styles.registerButtonText}>Register Boat</Text>
        </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Cover Image and Vessel Name */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: VESSEL_IMAGE }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.coverGradient}
          />
          <View style={styles.coverContent}>
            <Text style={styles.vesselName}>Sea Breeze</Text>
            <Text style={styles.vesselType}>Sunseeker Manhattan 60</Text>
          </View>
        </View>

        {/* Vessel Health Card */}
        <VesselHealthCard 
          overallHealth={healthStatus.overall}
          engineHealth={healthStatus.engine}
          hullHealth={healthStatus.hull}
          electricalHealth={healthStatus.electrical}
          plumbingHealth={healthStatus.plumbing}
        />
        
        {/* Quick Action Menu */}
        <ActionMenu actions={quickActions} onPress={handleActionPress} />

        {/* Weather Advisories */}
        <WeatherAdvisories alerts={weatherAlerts} onDismiss={dismissAlert} />
        
        {/* Vessel Details Overview */}
        <VesselDetailsOverview vesselData={sampleVesselData} />
        
        {/* Vessel Documents Section */}
        <VesselDocumentsSection 
          documents={sampleDocuments}
          onViewDocument={(id) => console.log('View document:', id)}
          onDownloadDocument={(id) => console.log('Download document:', id)}
        />
        
        {/* Vessel Maintenance Schedule */}
        <VesselMaintenanceSchedule 
          tasks={sampleMaintenanceTasks}
          onTaskPress={(id) => console.log('Task pressed:', id)}
          onCompleteTask={(id) => console.log('Complete task:', id)}
        />
        
        {/* 3D Model Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>3D Model</Text>
          <View style={styles.modelContainer}>
              <Image 
                source={{ uri: MODEL_IMAGES[currentModelImage] }}
                style={styles.modelImage}
                resizeMode="cover"
              />
              <View style={styles.modelControls}>
                <TouchableOpacity 
                  style={styles.modelControlButton}
                  onPress={() => rotateModel('prev')}
                >
                  <Rotate3D size={16} color="#FFF" style={{transform: [{rotate: '-90deg'}]}} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modelControlButton}
                  onPress={() => rotateModel('next')}
                >
                  <Rotate3D size={16} color="#FFF" style={{transform: [{rotate: '90deg'}]}} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  headerArea: {
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 48 : 8,
    borderBottomWidth: 0,
    zIndex: 10,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  screenTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: Colors.neutral[900],
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFF4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  registerButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  // Cover image styles
  coverContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  vesselName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  vesselType: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Section container
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  // 3D model styles
  modelContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modelImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  modelControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
  },
  modelControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});