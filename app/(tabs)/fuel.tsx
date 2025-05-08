import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplets, TrendingUp, History, Plus, CircleGauge as GaugeCircle, Calendar, DollarSign, ChevronRight, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
  {
    id: '4',
    date: 'May 5, 2025',
    amount: 90,
    cost: 360,
    location: 'Sunset Marina',
  },
];

const screenWidth = Dimensions.get('window').width;

// Enhanced Fuel Gauge with animation and better visuals
const FuelGauge = ({ level }: { level: number }) => {
  const rotation = useSharedValue(0);
  const fillAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withSpring((level / 100) * 270);
    fillAnimation.value = withSpring(level / 100);
  }, [level]);
  
  const gaugeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  const fillStyle = useAnimatedStyle(() => {
    const fillOpacity = interpolate(
      fillAnimation.value,
      [0, 0.3, 1],
      [0.3, 0.6, 0.85],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: fillOpacity,
    };
  });
  
  // Determine gauge color based on fuel level
  const getGaugeColor = () => {
    if (level <= 20) return Colors.status.error;
    if (level <= 40) return Colors.accent[500];
    return Colors.primary[500];
  };
  
  const gaugeColor = getGaugeColor();
  
  return (
    <View style={styles.gaugeContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(240, 247, 255, 0.9)']}
        style={styles.gaugeCard}
      >
        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeTitle}>Fuel Level</Text>
          {level <= 20 && (
            <View style={styles.warningBadge}>
              <AlertTriangle size={12} color="#FFFFFF" />
              <Text style={styles.warningText}>Low</Text>
            </View>
          )}
        </View>
        
        <View style={styles.gaugeGraphic}>
          <View style={styles.gaugeBackground}>
            <Animated.View
              style={[styles.gaugeIndicator, gaugeStyle, { backgroundColor: gaugeColor }]}
            />
            <Animated.View
              style={[styles.gaugeFill, fillStyle, { backgroundColor: gaugeColor }]}
            />
          </View>
          <View style={styles.gaugeCenter}>
            <GaugeCircle size={32} color={gaugeColor} />
            <Text style={[styles.gaugeText, { color: gaugeColor }]}>{level}%</Text>
            <Text style={styles.gaugeEstimate}>~{Math.round(level * 1.5)} gallons</Text>
          </View>
        </View>
        
        <View style={styles.rangeBadge}>
          <TrendingUp size={14} color={Colors.primary[700]} style={{ marginRight: 4 }} />
          <Text style={styles.rangeText}>Range: ~{Math.round(level * 2.8)} nautical miles</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

// Enhanced Stats with better visual hierarchy and more information
const FuelStats = () => (
  <View style={styles.statsContainer}>
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <TrendingUp size={18} color={Colors.primary[600]} />
        <Text style={styles.statTitle}>Consumption</Text>
      </View>
      <Text style={styles.statValue}>12.5</Text>
      <Text style={styles.statUnit}>gallons/hour</Text>
      <View style={styles.statTrend}>
        <Text style={styles.statTrendText}>+0.8 from last trip</Text>
      </View>
    </View>
    
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <DollarSign size={18} color={Colors.primary[600]} />
        <Text style={styles.statTitle}>Cost</Text>
      </View>
      <Text style={styles.statValue}>$4.20</Text>
      <Text style={styles.statUnit}>avg. per gallon</Text>
      <View style={[styles.statTrend, styles.statTrendDown]}>
        <Text style={styles.statTrendTextDown}>-$0.15 this month</Text>
      </View>
    </View>
  </View>
);

const FilterOptions = ["All", "Last Month", "Last 3 Months", "Year to Date"];

export default function FuelScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  
  const handleAddEntry = () => {
    // Would implement form to add new fuel entry
    console.log("Add new fuel entry");
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FuelGauge level={22} />
        <FuelStats />
        
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text style={styles.sectionTitle}>Fuel Log</Text>
            <View style={styles.filterContainer}>
              {FilterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.logCards}>
            {fuelLogs.map((log) => (
              <TouchableOpacity key={log.id} style={styles.logCard}>
                <View style={styles.logCardContent}>
                  <View style={styles.logHeader}>
                    <View style={styles.logDateContainer}>
                      <Calendar size={14} color={Colors.neutral[500]} style={{ marginRight: 6 }} />
                      <Text style={styles.logDate}>{log.date}</Text>
                    </View>
                    <View style={styles.logAmount}>
                      <Droplets size={16} color={Colors.primary[600]} />
                      <Text style={styles.logAmountText}>{log.amount} gal</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.logLocation}>{log.location}</Text>
                  
                  <View style={styles.logFooter}>
                    <View style={styles.logCostContainer}>
                      <Text style={styles.logCostLabel}>Total</Text>
                      <Text style={styles.logCost}>${log.cost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.logPriceContainer}>
                      <Text style={styles.logPriceLabel}>Price</Text>
                      <Text style={styles.logPrice}>${(log.cost / log.amount).toFixed(2)}/gal</Text>
                    </View>
                    <View style={styles.logDetail}>
                      <Text style={styles.logDetailText}>Details</Text>
                      <ChevronRight size={16} color={Colors.primary[700]} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Fuel History</Text>
            <ChevronRight size={16} color={Colors.primary[700]} />
          </TouchableOpacity>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  gaugeContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  gaugeCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gaugeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  gaugeGraphic: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ translateY: 50 }],
    transformOrigin: 'center bottom',
  },
  gaugeFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    marginTop: 8,
  },
  gaugeEstimate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  rangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  rangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 6,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: Colors.neutral[900],
  },
  statUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  statTrend: {
    marginTop: 12,
    backgroundColor: '#E3F7ED',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statTrendDown: {
    backgroundColor: '#FFECE3',
  },
  statTrendText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#0C955A',
  },
  statTrendTextDown: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#E53935',
  },
  logsSection: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  logsSectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[700],
  },
  filterTextActive: {
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  logCards: {
    marginBottom: 16,
  },
  logCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  logCardContent: {
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  logAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  logAmountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  logLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    marginBottom: 14,
  },
  logFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
  },
  logCostContainer: {
    flex: 1,
  },
  logCostLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  logCost: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  logPriceContainer: {
    flex: 1,
  },
  logPriceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  logPrice: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  logDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  logDetailText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.primary[700],
    marginRight: 6,
  },
});