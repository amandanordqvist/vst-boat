import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplets, TrendingUp, History, Plus, CircleGauge as GaugeCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface FuelLog {
  id: string;
  date: string;
  amount: number;
  cost: number;
  location: string;
}

const fuelLogs: FuelLog[] = [
  {
    id: '1',
    date: 'May 20, 2025',
    amount: 80,
    cost: 320,
    location: 'Marina Bay Fuel Station',
  },
  {
    id: '2',
    date: 'May 15, 2025',
    amount: 65,
    cost: 260,
    location: 'Harbor Point Gas',
  },
  {
    id: '3',
    date: 'May 10, 2025',
    amount: 75,
    cost: 300,
    location: 'Coastal Fueling',
  },
];

const FuelGauge = ({ level }: { level: number }) => {
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withSpring((level / 100) * 180);
  }, [level]);
  
  const gaugeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeBackground}>
        <Animated.View style={[styles.gaugeIndicator, gaugeStyle]} />
      </View>
      <View style={styles.gaugeCenter}>
        <GaugeCircle size={32} color={Colors.primary[500]} />
        <Text style={styles.gaugeText}>{level}%</Text>
        <Text style={styles.gaugeLabel}>Fuel Level</Text>
      </View>
    </View>
  );
};

const FuelStats = () => (
  <View style={styles.statsContainer}>
    <View style={styles.statCard}>
      <TrendingUp size={24} color={Colors.primary[500]} />
      <Text style={styles.statValue}>12.5</Text>
      <Text style={styles.statLabel}>Avg. Consumption (gal/h)</Text>
    </View>
    <View style={styles.statCard}>
      <History size={24} color={Colors.primary[500]} />
      <Text style={styles.statValue}>220</Text>
      <Text style={styles.statLabel}>Range (nm)</Text>
    </View>
  </View>
);

export default function FuelScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Management</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FuelGauge level={75} />
        <FuelStats />
        
        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>Fuel Log</Text>
          {fuelLogs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.logInfo}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <Text style={styles.logLocation}>{log.location}</Text>
                </View>
                <View style={styles.logAmount}>
                  <Droplets size={16} color={Colors.primary[500]} />
                  <Text style={styles.logAmountText}>{log.amount} gal</Text>
                </View>
              </View>
              <View style={styles.logFooter}>
                <Text style={styles.logCost}>${log.cost.toFixed(2)}</Text>
                <Text style={styles.logPrice}>${(log.cost / log.amount).toFixed(2)}/gal</Text>
              </View>
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  gaugeContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  gaugeBackground: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: Colors.neutral[200],
    overflow: 'hidden',
    transform: [{ rotate: '-90deg' }],
  },
  gaugeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: Colors.primary[500],
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ translateY: 50 }],
    transformOrigin: 'center bottom',
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginTop: 8,
  },
  gaugeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginVertical: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  logsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  logCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  logLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  logAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logAmountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  logCost: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  logPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
  },
});