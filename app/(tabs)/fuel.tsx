import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplets, TrendingUp, History, Plus, CircleGauge as GaugeCircle, Calendar, DollarSign, ChevronRight, AlertTriangle, Clock, Fuel, Filter, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface FuelLog {
  id: string;
  date: string;
  amount: number;
  cost: number;
  location: string;
  engineHours?: number;
  isFullFill?: boolean;
}

const fuelLogs: FuelLog[] = [
  {
    id: '1',
    date: 'May 20, 2025',
    amount: 80,
    cost: 320,
    location: 'Marina Bay Fuel Station',
    engineHours: 12.5,
    isFullFill: true,
  },
  {
    id: '2',
    date: 'May 15, 2025',
    amount: 65,
    cost: 260,
    location: 'Harbor Point Gas',
    engineHours: 8.2,
    isFullFill: false,
  },
  {
    id: '3',
    date: 'May 10, 2025',
    amount: 75,
    cost: 300,
    location: 'Coastal Fueling',
    engineHours: 10.0,
    isFullFill: true,
  },
  {
    id: '4',
    date: 'May 5, 2025',
    amount: 90,
    cost: 360,
    location: 'Sunset Marina',
    engineHours: 14.3,
    isFullFill: true,
  },
];

const screenWidth = Dimensions.get('window').width;

// Enhanced Fuel Gauge with animation and better visuals
const FuelGauge = ({ level }: { level: number }) => {
  const rotation = useSharedValue(0);
  const fillAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withSpring((level / 100) * 360);
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
  const getGaugeGradient = () => {
    if (level <= 20) return [Colors.status.error, '#FF8A65'];
    if (level <= 40) return ['#FFA726', Colors.accent[500]];
    return [Colors.primary[400], Colors.primary[600]];
  };
  
  const gradientColors = getGaugeGradient();
  
  // Determine text colors based on fuel level
  const getTextColor = () => {
    if (level <= 20) return Colors.status.error;
    if (level <= 40) return Colors.accent[500];
    return Colors.primary[600];
  };
  
  const textColor = getTextColor();
  
  // Last refuel date
  const lastRefuelDate = "May 20, 2025";
  
  // Calculate estimated time remaining based on consumption rate
  const avgConsumption = 12.5; // gallons/hour
  const estimatedTimeRemaining = Math.round((level * 1.5) / avgConsumption); // hours
  
  return (
    <View style={styles.gaugeContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(240, 247, 255, 0.9)']}
        style={styles.gaugeCard}
      >
        <View style={styles.gaugeHeader}>
          <View>
            <Text style={styles.gaugeTitle}>Fuel Level</Text>
            <View style={styles.lastRefuelContainer}>
              <Calendar size={12} color={Colors.neutral[500]} />
              <Text style={styles.lastRefuelText}>Last refuel: {lastRefuelDate}</Text>
            </View>
          </View>
          {level <= 20 && (
            <View style={styles.warningBadge}>
              <AlertTriangle size={12} color="#FFFFFF" />
              <Text style={styles.warningText}>Low</Text>
            </View>
          )}
        </View>
        
        <View style={styles.gaugeGraphic}>
          {/* Full circular gauge */}
          <View style={styles.gaugeCircle}>
            {/* Background track */}
            <View style={styles.gaugeBackground} />
            
            {/* Colored fill */}
            <Animated.View style={[styles.gaugeFill, { width: `${level}%` }]}>
              <LinearGradient
                colors={[gradientColors[0], gradientColors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
              />
            </Animated.View>
            
            {/* Indicator labels */}
            <View style={styles.gaugeLabels}>
              <Text style={[styles.gaugeLabel, styles.emptyLabel]}>E</Text>
              <Text style={[styles.gaugeLabel, styles.quarterLabel]}>¼</Text>
              <Text style={[styles.gaugeLabel, styles.halfLabel]}>½</Text>
              <Text style={[styles.gaugeLabel, styles.threeQuarterLabel]}>¾</Text>
              <Text style={[styles.gaugeLabel, styles.fullLabel]}>F</Text>
            </View>
            
            {/* Center info */}
            <View style={styles.gaugeCenter}>
              <GaugeCircle size={32} color={textColor} />
              <Text style={[styles.gaugeText, { color: textColor }]}>{level}%</Text>
              <Text style={styles.gaugeEstimate}>~{Math.round(level * 1.5)} gallons</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.gaugeInfoSection}>
          <View style={styles.gaugeInfoItem}>
            <TrendingUp size={14} color={Colors.primary[700]} />
            <Text style={styles.gaugeInfoText}>Range: ~{Math.round(level * 2.8)} nm</Text>
          </View>
          <View style={styles.gaugeInfoDivider} />
          <View style={styles.gaugeInfoItem}>
            <Clock size={14} color={Colors.primary[700]} />
            <Text style={styles.gaugeInfoText}>Est. time: ~{estimatedTimeRemaining} hrs</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Enhanced Stats with better visual hierarchy and more information
const FuelStats = () => {
  // Add comparison with previous period
  const efficiencyChange = "+12%";
  
  return (
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
};

// New Trip Calculator component
const TripCalculator = () => (
  <TouchableOpacity style={styles.calculatorCard}>
    <LinearGradient
      colors={[Colors.primary[500], Colors.primary[700]]}
      style={styles.calculatorGradient}
    >
      <View style={styles.calculatorContent}>
        <View style={styles.calculatorIcon}>
          <Fuel size={24} color="#FFFFFF" />
        </View>
        <View style={styles.calculatorText}>
          <Text style={styles.calculatorTitle}>Trip Fuel Calculator</Text>
          <Text style={styles.calculatorDesc}>Plan your journey & estimate fuel needs</Text>
        </View>
        <ChevronRight size={22} color="#FFFFFF" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const FilterOptions = ["All", "Last Month", "Last 3 Months", "Year to Date"];

export default function FuelScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  
  const handleAddEntry = () => {
    // Would implement form to add new fuel entry
    console.log("Add new fuel entry");
  };
  
  // Calculate average and total for the selected period
  const periodTotal = fuelLogs.reduce((sum, log) => sum + log.amount, 0);
  const periodAvgCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0) / fuelLogs.length;
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Fuel size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FuelGauge level={22} />
        <FuelStats />
        <TripCalculator />
        
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <View style={styles.logsTitleRow}>
              <Text style={styles.sectionTitle}>Fuel Log</Text>
              <TouchableOpacity style={styles.searchButton}>
                <Search size={18} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.periodSummary}>
              <Text style={styles.periodSummaryText}>
                Period total: <Text style={styles.periodSummaryValue}>{periodTotal} gallons</Text> • 
                Avg. cost: <Text style={styles.periodSummaryValue}>${periodAvgCost.toFixed(2)}/gal</Text>
              </Text>
            </View>
            
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
                      {log.isFullFill && (
                        <View style={styles.fullFillBadge}>
                          <Text style={styles.fullFillText}>Full</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.logVisualIndicator}>
                    <View style={[styles.logAmountBar, { width: `${(log.amount / 100) * 100}%` }]} />
                  </View>
                  
                  <Text style={styles.logLocation}>{log.location}</Text>
                  
                  <View style={styles.logAdditionalInfo}>
                    <View style={styles.logEngineHours}>
                      <Clock size={14} color={Colors.neutral[500]} />
                      <Text style={styles.logEngineHoursText}>
                        {log.engineHours} engine hours
                      </Text>
                    </View>
                  </View>
                  
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
        
        {/* Fuel Efficiency Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Fuel Efficiency Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <TrendingUp size={20} color="#FFFFFF" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipHeading}>Maintain Optimal RPM</Text>
              <Text style={styles.tipText}>Your most efficient engine speed is 1800-2200 RPM based on your recent trips.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllTipsButton}>
            <Text style={styles.viewAllTipsText}>View All Tips</Text>
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  gaugeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  lastRefuelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastRefuelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
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
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  // New full circular gauge styles
  gaugeCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gaugeBackground: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: Colors.neutral[200],
  },
  gaugeFill: {
    position: 'absolute',
    height: 220,
    width: '22%', // This will be dynamically set based on level
    left: 0,
    overflow: 'hidden',
  },
  gradientFill: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: 'transparent', // Will be colored by gradient
  },
  gaugeLabels: {
    position: 'absolute',
    width: 220,
    height: 220,
  },
  gaugeLabel: {
    position: 'absolute',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  emptyLabel: {
    left: 8,
    top: 100,
  },
  quarterLabel: {
    left: 46,
    top: 40,
  },
  halfLabel: {
    left: 106,
    top: 8,
  },
  threeQuarterLabel: {
    right: 46,
    top: 40,
  },
  fullLabel: {
    right: 8,
    top: 100,
  },
  gaugeCenter: {
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
  gaugeInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  gaugeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeInfoDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[300],
  },
  gaugeInfoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 6,
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
  // New Trip Calculator styles
  calculatorCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calculatorGradient: {
    borderRadius: 20,
  },
  calculatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  calculatorIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calculatorText: {
    flex: 1,
  },
  calculatorTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  calculatorDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  logsSection: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  logsSectionHeader: {
    marginBottom: 16,
  },
  logsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: Colors.neutral[200],
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  periodSummary: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  periodSummaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  periodSummaryValue: {
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
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
    marginBottom: 12,
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
    marginRight: 4,
  },
  fullFillBadge: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  fullFillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  logVisualIndicator: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  logAmountBar: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  logLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    marginBottom: 10,
  },
  logAdditionalInfo: {
    marginBottom: 12,
  },
  logEngineHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logEngineHoursText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
    marginLeft: 6,
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
  // Fuel Efficiency Tips styles
  tipsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[600],
    lineHeight: 18,
  },
  viewAllTipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  viewAllTipsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.primary[700],
    marginRight: 6,
  },
});