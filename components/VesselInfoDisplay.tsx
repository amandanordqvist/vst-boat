import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ship, FileText, Info, Calendar, Ruler, Anchor, Layers, Heart, 
  Gauge, Navigation2, Droplets, LifeBuoy, RefreshCw, Shield, Home } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import VesselOverview from './VesselOverview';
import VesselDetailsCard from './VesselDetailsCard';

// Sample vessel data
const vessel = {
  id: '1',
  name: 'Sea Breeze',
  type: 'Flybridge Motor Yacht',
  status: 'Active',
  location: 'Marina Bay Harbor',
  image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  manufacturer: 'Sunseeker',
  model: 'Manhattan 60',
  year: '2023',
};

// Create detail items with appropriate icons
const createDetailItem = (label: string, value: string, icon: React.ReactNode) => ({
  label,
  value,
  icon,
});

// Vessel data details organized by section
const vesselDetails = {
  basic: [
    createDetailItem('Vessel Name', 'Sea Breeze', <Ship size={20} color={Colors.primary[600]} />),
    createDetailItem('Registration Number', 'VST-2025-1234', <FileText size={20} color={Colors.primary[600]} />),
    createDetailItem('Vessel Type', 'Flybridge Motor Yacht', <Ship size={20} color={Colors.primary[600]} />),
    createDetailItem('Manufacturer', 'Sunseeker', <Layers size={20} color={Colors.primary[600]} />),
    createDetailItem('Model', 'Manhattan 60', <Info size={20} color={Colors.primary[600]} />),
    createDetailItem('Year Built', '2023', <Calendar size={20} color={Colors.primary[600]} />),
  ],
  physical: [
    createDetailItem('Length Overall', '45 feet (13.7m)', <Ruler size={20} color={Colors.neutral[600]} />),
    createDetailItem('Beam', '14 feet (4.3m)', <Ruler size={20} color={Colors.neutral[600]} />),
    createDetailItem('Draft', '3.9 feet (1.2m)', <Anchor size={20} color={Colors.neutral[600]} />),
    createDetailItem('Displacement', '29 tons', <Ruler size={20} color={Colors.neutral[600]} />),
    createDetailItem('Hull Material', 'Fiberglass', <Layers size={20} color={Colors.neutral[600]} />),
    createDetailItem('Max Capacity', '12 passengers', <Heart size={20} color={Colors.neutral[600]} />),
  ],
  systems: [
    createDetailItem('Main Engines', 'Twin Volvo Penta D6-440', <Gauge size={20} color={Colors.neutral[600]} />),
    createDetailItem('Horsepower', '2 x 440 HP', <Gauge size={20} color={Colors.neutral[600]} />),
    createDetailItem('Max Speed', '32 knots', <Navigation2 size={20} color={Colors.neutral[600]} />),
    createDetailItem('Fuel Capacity', '600 gallons', <Droplets size={20} color={Colors.neutral[600]} />),
    createDetailItem('Fresh Water', '150 gallons', <LifeBuoy size={20} color={Colors.neutral[600]} />),
    createDetailItem('Generator', 'Onan 17.5 kW', <RefreshCw size={20} color={Colors.neutral[600]} />),
  ],
  documentation: [
    createDetailItem('Insurance Policy', 'MAR-98765-2025', <Shield size={20} color={Colors.neutral[600]} />),
    createDetailItem('Insurance Expiry', 'March 15, 2026', <Calendar size={20} color={Colors.neutral[600]} />),
    createDetailItem('Home Port', 'Marina Bay Harbor', <Home size={20} color={Colors.neutral[600]} />),
    createDetailItem('Registration Expiry', 'January 30, 2026', <Calendar size={20} color={Colors.neutral[600]} />),
  ],
};

interface VesselInfoDisplayProps {
  showAllDetails?: boolean;
}

export default function VesselInfoDisplay({ showAllDetails = true }: VesselInfoDisplayProps) {
  // Handler for "View All" button
  const handleViewAll = (section: string) => {
    console.log(`View all ${section} details`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Vessel Overview Card */}
      <VesselOverview
        name={vessel.name}
        type={vessel.type}
        status={vessel.status}
        location={vessel.location}
        image={vessel.image}
        manufacturer={vessel.manufacturer}
        model={vessel.model}
        year={vessel.year}
      />
      
      {/* Basic Information */}
      <VesselDetailsCard 
        section="basic" 
        details={vesselDetails.basic}
        onViewAll={showAllDetails ? undefined : () => handleViewAll('basic')}
      />
      
      {/* Only show these sections if showAllDetails is true */}
      {showAllDetails && (
        <>
          {/* Physical Specifications */}
          <VesselDetailsCard 
            section="physical" 
            details={vesselDetails.physical}
          />
          
          {/* Systems */}
          <VesselDetailsCard 
            section="systems" 
            details={vesselDetails.systems}
          />
          
          {/* Documentation */}
          <VesselDetailsCard 
            section="documentation" 
            details={vesselDetails.documentation}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
    padding: 16,
  },
}); 