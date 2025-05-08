import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Anchor, Ship, Ruler, Calendar, PenTool as Tool, FileText, LifeBuoy, Gauge } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface VesselDetail {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const vesselDetails: VesselDetail[] = [
  {
    label: 'Registration Number',
    value: 'VST-2025-1234',
    icon: <FileText size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Vessel Type',
    value: 'Motor Yacht',
    icon: <Ship size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Length',
    value: '45 feet',
    icon: <Ruler size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Year Built',
    value: '2023',
    icon: <Calendar size={20} color={Colors.neutral[600]} />,
  },
];

const specifications = [
  {
    label: 'Engine',
    value: 'Twin Volvo Penta D6-440',
    icon: <Gauge size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Max Speed',
    value: '32 knots',
    icon: <Gauge size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Fuel Capacity',
    value: '600 gallons',
    icon: <Gauge size={20} color={Colors.neutral[600]} />,
  },
  {
    label: 'Fresh Water',
    value: '150 gallons',
    icon: <LifeBuoy size={20} color={Colors.neutral[600]} />,
  },
];

export default function VesselScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.vesselImagePlaceholder}>
            <Ship size={48} color={Colors.primary[500]} />
          </View>
          <Text style={styles.vesselName}>Sea Breeze</Text>
          <Text style={styles.vesselType}>Luxury Motor Yacht</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vessel Information</Text>
          <View style={styles.detailsGrid}>
            {vesselDetails.map((detail, index) => (
              <View key={index} style={styles.detailCard}>
                <View style={styles.iconContainer}>
                  {detail.icon}
                </View>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Specifications</Text>
          <View style={styles.detailsGrid}>
            {specifications.map((spec, index) => (
              <View key={index} style={styles.detailCard}>
                <View style={styles.iconContainer}>
                  {spec.icon}
                </View>
                <Text style={styles.detailLabel}>{spec.label}</Text>
                <Text style={styles.detailValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
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
              <Anchor size={24} color={Colors.primary[500]} />
              <Text style={styles.documentTitle}>Insurance</Text>
              <Text style={styles.documentMeta}>PDF • 1.2 MB</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  vesselImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  vesselName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  vesselType: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
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
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  documentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[900],
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  documentMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});