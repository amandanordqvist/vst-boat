import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Ship,
  FileText,
  Layers,
  Info,
  Calendar,
  Ruler,
  Anchor,
  Gauge,
  Navigation2,
  Droplets,
  LifeBuoy,
  RefreshCw,
  Shield,
  Home
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface VesselInfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  section: string;
}

interface VesselDetailsOverviewProps {
  vesselData: VesselInfoItem[];
}

export default function VesselDetailsOverview({ vesselData }: VesselDetailsOverviewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    physical: false,
    systems: false,
    documentation: false
  });

  // Group vessel data by section
  const sectionGroups = vesselData.reduce((groups, item) => {
    if (!item.section) return groups;
    if (!groups[item.section]) {
      groups[item.section] = [];
    }
    groups[item.section].push(item);
    return groups;
  }, {} as Record<string, VesselInfoItem[]>);

  // Toggle section expanded state
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to get friendly section names
  const getSectionTitle = (section: string): string => {
    switch (section) {
      case 'basic': return 'Basic Information';
      case 'physical': return 'Physical Specifications';
      case 'systems': return 'Systems & Performance';
      case 'documentation': return 'Documentation & Compliance';
      default: return section.charAt(0).toUpperCase() + section.slice(1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Vessel Specifications</Text>

      {Object.keys(sectionGroups).map(section => (
        <View key={section} style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(section)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>{getSectionTitle(section)}</Text>
            {expandedSections[section] ? (
              <ChevronUp size={22} color={Colors.primary[600]} />
            ) : (
              <ChevronDown size={22} color={Colors.primary[600]} />
            )}
          </TouchableOpacity>

          {expandedSections[section] && (
            <View style={styles.sectionContent}>
              {sectionGroups[section].map((item, index) => (
                <View 
                  key={`${section}-${index}`} 
                  style={[
                    styles.detailItem,
                    index === sectionGroups[section].length - 1 ? styles.lastItem : null
                  ]}
                >
                  <View style={styles.iconContainer}>
                    {item.icon}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  mainTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  sectionContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary[700],
  },
  sectionContent: {
    padding: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  itemValue: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
});

// Sample vessel data with all possible fields
export const sampleVesselData: VesselInfoItem[] = [
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
    icon: <Ship size={20} color={Colors.neutral[600]} />,
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