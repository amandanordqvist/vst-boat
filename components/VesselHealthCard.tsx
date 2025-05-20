import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface VesselHealthCardProps {
  overallHealth: number;
  engineHealth?: number;
  hullHealth?: number;
  electricalHealth?: number;
  plumbingHealth?: number;
}

export default function VesselHealthCard({
  overallHealth,
  engineHealth = 95,
  hullHealth = 90,
  electricalHealth = 88,
  plumbingHealth = 96
}: VesselHealthCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine health color based on percentage
  const getHealthColor = (value: number) => {
    if (value > 80) return Colors.status.success;
    if (value > 60) return Colors.status.warning;
    return Colors.status.error;
  };

  // Get the overall health color
  const overallHealthColor = getHealthColor(overallHealth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Heart size={20} color={Colors.primary[500]} />
        </View>
        <Text style={styles.title}>Vessel Health</Text>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${overallHealth}%`, backgroundColor: overallHealthColor }
            ]} 
          />
        </View>
        <Text style={styles.percentage}>{overallHealth}%</Text>
      </View>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Engine</Text>
            <View style={styles.detailProgressBar}>
              <View 
                style={[
                  styles.detailProgressFill, 
                  { width: `${engineHealth}%`, backgroundColor: getHealthColor(engineHealth) }
                ]} 
              />
            </View>
            <Text style={styles.detailPercentage}>{engineHealth}%</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hull</Text>
            <View style={styles.detailProgressBar}>
              <View 
                style={[
                  styles.detailProgressFill, 
                  { width: `${hullHealth}%`, backgroundColor: getHealthColor(hullHealth) }
                ]} 
              />
            </View>
            <Text style={styles.detailPercentage}>{hullHealth}%</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Electrical</Text>
            <View style={styles.detailProgressBar}>
              <View 
                style={[
                  styles.detailProgressFill, 
                  { width: `${electricalHealth}%`, backgroundColor: getHealthColor(electricalHealth) }
                ]} 
              />
            </View>
            <Text style={styles.detailPercentage}>{electricalHealth}%</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plumbing</Text>
            <View style={styles.detailProgressBar}>
              <View 
                style={[
                  styles.detailProgressFill, 
                  { width: `${plumbingHealth}%`, backgroundColor: getHealthColor(plumbingHealth) }
                ]} 
              />
            </View>
            <Text style={styles.detailPercentage}>{plumbingHealth}%</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
    flex: 1,
  },
  detailsButton: {
    backgroundColor: Colors.neutral[100],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  detailsButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium', 
    fontSize: 13,
    color: Colors.primary[600],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.neutral[100],
    borderRadius: 6,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Bold' : 'Inter-Bold',
    fontSize: 20,
    color: Colors.neutral[900],
    width: 48,
    textAlign: 'right',
  },
  detailsContainer: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    width: 80,
  },
  detailProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  detailProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailPercentage: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[900],
    width: 40,
    textAlign: 'right',
  },
}); 