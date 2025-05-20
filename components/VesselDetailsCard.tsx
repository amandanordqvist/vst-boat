import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ship, FileText, Info, Calendar, Ruler, Anchor, Layers, Heart, Gauge, Navigation2, Droplets, LifeBuoy, RefreshCw, Shield, Home } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DetailItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface VesselDetailsCardProps {
  section: string;
  details: DetailItem[];
  onViewAll?: () => void;
}

export default function VesselDetailsCard({ section, details, onViewAll }: VesselDetailsCardProps) {
  // Map section names to user-friendly titles
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'basic': return 'Basic Information';
      case 'physical': return 'Physical Specifications';
      case 'systems': return 'Systems';
      case 'documentation': return 'Documentation';
      default: return section;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getSectionTitle(section)}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        {details.map((detail, index) => (
          <View 
            key={index} 
            style={[
              styles.detailRow,
              index === details.length - 1 ? null : styles.borderBottom
            ]}
          >
            <View style={styles.iconContainer}>
              {detail.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{detail.label}</Text>
              <Text style={styles.value}>{detail.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  viewAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.primary[600],
  },
  content: {
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
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
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.neutral[900],
  },
}); 