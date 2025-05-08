import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions, Share, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Anchor, Ship, Ruler, Calendar, PenTool as Tool, FileText, LifeBuoy, Gauge, PlusCircle, 
  Copy, MapPin, Navigation2, Home, Settings, RefreshCw, Shield, Heart, MessageSquare, 
  Edit3, Smartphone, Share2, Info, Wrench, Layers, Disc, Droplets
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample vessel image URL - replace with real image when available
const VESSEL_IMAGE = 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

interface VesselDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
  section?: string;
}

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
  
  const handleRegisterBoat = () => {
    router.push('/boat-registration');
  };

  const handleEditVessel = () => {
    // Navigate to edit vessel screen
    console.log('Edit vessel');
  };

  const handleViewDocuments = () => {
    // Navigate to documents screen
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
    // Contact manufacturer
    console.log('Contact manufacturer');
  };

  const copyRegistrationNumber = async () => {
    // Instead of using Clipboard API, show an alert for now
    // We'll need to install expo-clipboard package later
    Alert.alert(
      "Registration Number",
      "VST-2025-1234 (copied to clipboard)",
      [{ text: "OK" }]
    );
    console.log('Registration number copied to clipboard');
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleEditVessel}>
            <View style={styles.quickActionIcon}>
              <Edit3 size={20} color={Colors.primary[600]} />
            </View>
            <Text style={styles.quickActionText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleViewDocuments}>
            <View style={styles.quickActionIcon}>
              <FileText size={20} color={Colors.primary[600]} />
            </View>
            <Text style={styles.quickActionText}>Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleShareVessel}>
            <View style={styles.quickActionIcon}>
              <Share2 size={20} color={Colors.primary[600]} />
            </View>
            <Text style={styles.quickActionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleContactManufacturer}>
            <View style={styles.quickActionIcon}>
              <MessageSquare size={20} color={Colors.primary[600]} />
            </View>
            <Text style={styles.quickActionText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrContainer}>
          <View style={styles.qrContent}>
            <View style={styles.qrImagePlaceholder}>
              {/* Would replace with actual QR code image */}
              <Text style={styles.qrPlaceholderText}>QR</Text>
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.qrTitle}>Quick Access</Text>
              <Text style={styles.qrDescription}>Scan to view vessel details on any device</Text>
            </View>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.sectionContent}>
            {getVesselDataBySection('basic').map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  {detail.icon}
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
                {detail.label === 'Registration Number' && (
                  <TouchableOpacity style={styles.copyButton} onPress={copyRegistrationNumber}>
                    <Copy size={16} color={Colors.neutral[500]} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Physical Specifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Specifications</Text>
          <View style={styles.dimensionsCard}>
            <Text style={styles.dimensionsTitle}>Dimensions</Text>
            <View style={styles.dimensionsDiagram}>
              <View style={styles.lengthIndicator}>
                <Text style={styles.dimensionValue}>45ft</Text>
                <View style={styles.lengthLine} />
                <Text style={styles.dimensionLabel}>Length</Text>
              </View>
              <View style={styles.beamIndicator}>
                <Text style={styles.dimensionValue}>14ft</Text>
                <View style={styles.beamLine} />
                <Text style={styles.dimensionLabel}>Beam</Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionContent}>
            {getVesselDataBySection('physical').map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  {detail.icon}
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Systems Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Systems</Text>
          <View style={styles.sectionContent}>
            {getVesselDataBySection('systems').map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  {detail.icon}
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Documentation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentation</Text>
          <View style={styles.sectionContent}>
            {getVesselDataBySection('documentation').map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  {detail.icon}
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Documents and Manuals */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Documents & Manuals</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.documentsContainer}>
            <TouchableOpacity style={styles.documentCard}>
              <FileText size={24} color={Colors.primary[500]} />
              <Text style={styles.documentTitle}>Registration</Text>
              <Text style={styles.documentMeta}>PDF • 2.4 MB</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.documentCard}>
              <Tool size={24} color={Colors.primary[500]} />
              <Text style={styles.documentTitle}>Manual</Text>
              <Text style={styles.documentMeta}>PDF • 15.8 MB</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.documentCard}>
              <Shield size={24} color={Colors.primary[500]} />
              <Text style={styles.documentTitle}>Insurance</Text>
              <Text style={styles.documentMeta}>PDF • 1.2 MB</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.documentCard}>
              <Wrench size={24} color={Colors.primary[500]} />
              <Text style={styles.documentTitle}>Service</Text>
              <Text style={styles.documentMeta}>PDF • 3.5 MB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Maintenance Summary */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Maintenance Summary</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View History</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceHeader}>
              <View style={styles.maintenanceIconContainer}>
                <Wrench size={20} color={Colors.primary[600]} />
              </View>
              <View>
                <Text style={styles.maintenanceTitle}>Last Service</Text>
                <Text style={styles.maintenanceDate}>March 5, 2025</Text>
              </View>
            </View>
            <View style={styles.maintenanceDivider} />
            <View style={styles.maintenanceStats}>
              <View style={styles.maintenanceStatItem}>
                <Text style={styles.maintenanceStatValue}>352</Text>
                <Text style={styles.maintenanceStatLabel}>Engine Hours</Text>
              </View>
              <View style={styles.maintenanceStatItem}>
                <Text style={styles.maintenanceStatValue}>95%</Text>
                <Text style={styles.maintenanceStatLabel}>Health</Text>
              </View>
              <View style={styles.maintenanceStatItem}>
                <Text style={styles.maintenanceStatValue}>48</Text>
                <Text style={styles.maintenanceStatLabel}>Days to Next</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
    zIndex: 10,
  },
  screenTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  // Cover image styles
  coverContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
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
    height: '50%',
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  vesselName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  vesselType: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Quick action buttons
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
  },
  // QR code section
  qrContainer: {
    margin: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  qrPlaceholderText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.neutral[600],
  },
  qrInfo: {
    flex: 1,
  },
  qrTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  qrDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  // Section styles
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  viewAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[600],
  },
  sectionContent: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 12,
  },
  // Detail row styles
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.neutral[900],
  },
  copyButton: {
    padding: 8,
  },
  // Dimensions visualization
  dimensionsCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dimensionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  dimensionsDiagram: {
    position: 'relative',
    height: 100,
    alignItems: 'center',
  },
  lengthIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  beamIndicator: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dimensionValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.primary[600],
    marginBottom: 4,
  },
  dimensionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  lengthLine: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.primary[500],
  },
  beamLine: {
    width: '40%',
    height: 2,
    backgroundColor: Colors.primary[500],
  },
  // Documents section
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  documentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[800],
    marginTop: 8,
    marginBottom: 4,
  },
  documentMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  // Maintenance summary
  maintenanceCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  maintenanceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  maintenanceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  maintenanceDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  maintenanceDivider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginBottom: 16,
  },
  maintenanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintenanceStatItem: {
    alignItems: 'center',
  },
  maintenanceStatValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  maintenanceStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  // Spacer at the bottom
  spacer: {
    height: 40,
  },
  // Old styles maintained for compatibility
  vesselImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 22,
  },
});