import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface TripData {
  month: string;
  trips: number;
  distance: number;
  hours: number;
  fuel: number;
  cost: number;
}

interface AnalyticsDashboardProps {
  vesselName?: string;
  onExportData?: () => void;
  onBack?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  vesselName = "M/Y Seahawk",
  onExportData,
  onBack
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'trips' | 'distance' | 'fuel' | 'cost'>('trips');

  // Mock analytics data
  const monthlyData: TripData[] = [
    { month: 'Jan', trips: 4, distance: 125, hours: 18, fuel: 280, cost: 3200 },
    { month: 'Feb', trips: 3, distance: 98, hours: 14, fuel: 210, cost: 2800 },
    { month: 'Mar', trips: 6, distance: 178, hours: 26, fuel: 385, cost: 4100 },
    { month: 'Apr', trips: 8, distance: 245, hours: 35, fuel: 520, cost: 5650 },
    { month: 'May', trips: 12, distance: 356, hours: 48, fuel: 750, cost: 7200 },
    { month: 'Jun', trips: 15, distance: 425, hours: 58, fuel: 890, cost: 8900 },
    { month: 'Jul', trips: 18, distance: 512, hours: 72, fuel: 1050, cost: 10800 },
    { month: 'Aug', trips: 16, distance: 468, hours: 65, fuel: 950, cost: 9200 },
    { month: 'Sep', trips: 10, distance: 298, hours: 42, fuel: 680, cost: 6800 },
    { month: 'Oct', trips: 6, distance: 189, hours: 28, fuel: 420, cost: 4500 },
    { month: 'Nov', trips: 3, distance: 87, hours: 12, fuel: 195, cost: 2200 },
    { month: 'Dec', trips: 2, distance: 56, hours: 8, fuel: 125, cost: 1400 }
  ];

  const periods = [
    { key: 'month', label: '12 Months' },
    { key: 'quarter', label: '4 Quarters' },
    { key: 'year', label: '3 Years' }
  ];

  const metrics = [
    { key: 'trips', label: 'Trips', icon: 'boat', color: Colors.primary[600], unit: '' },
    { key: 'distance', label: 'Distance', icon: 'navigate', color: Colors.status.success, unit: 'nm' },
    { key: 'fuel', label: 'Fuel', icon: 'water', color: Colors.status.warning, unit: 'L' },
    { key: 'cost', label: 'Cost', icon: 'card', color: Colors.status.danger, unit: 'SEK' }
  ];

  const chartHeight = 200;
  const chartWidth = screenWidth - 80;
  const maxValue = Math.max(...monthlyData.map(d => d[selectedMetric] as number));

  const totalTrips = monthlyData.reduce((sum, d) => sum + d.trips, 0);
  const totalDistance = monthlyData.reduce((sum, d) => sum + d.distance, 0);
  const totalFuel = monthlyData.reduce((sum, d) => sum + d.fuel, 0);
  const totalCost = monthlyData.reduce((sum, d) => sum + d.cost, 0);

  const averageTripsPerMonth = totalTrips / 12;
  const fuelEfficiency = totalDistance / totalFuel;
  const costPerNM = totalCost / totalDistance;
  const costPerHour = totalCost / monthlyData.reduce((sum, d) => sum + d.hours, 0);

  const currentMetric = metrics.find(m => m.key === selectedMetric)!;

  const renderBarChart = () => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            {currentMetric.label} by Month
          </Text>
          <Text style={styles.chartSubtitle}>
            Total: {monthlyData.reduce((sum, d) => sum + (d[selectedMetric] as number), 0).toLocaleString()} {currentMetric.unit}
          </Text>
        </View>

        <View style={styles.chart}>
          <View style={styles.yAxis}>
            {[1, 0.75, 0.5, 0.25, 0].map(ratio => (
              <Text key={ratio} style={styles.yAxisLabel}>
                {Math.round(maxValue * ratio).toLocaleString()}
              </Text>
            ))}
          </View>

          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {monthlyData.map((data, index) => {
                const value = data[selectedMetric] as number;
                const barHeight = (value / maxValue) * chartHeight;
                
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barColumn}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: barHeight, 
                            backgroundColor: currentMetric.color,
                            marginBottom: chartHeight - barHeight
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.xAxisLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.gridLines}>
              {[0.25, 0.5, 0.75].map(ratio => (
                <View 
                  key={ratio} 
                  style={[
                    styles.gridLine, 
                    { bottom: ratio * chartHeight }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTrendChart = () => {
    const points = monthlyData.map((data, index) => {
      const value = data[selectedMetric] as number;
      const x = (index / (monthlyData.length - 1)) * chartWidth;
      const y = chartHeight - (value / maxValue) * chartHeight;
      return { x, y, value };
    });

    return (
      <View style={styles.trendContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>
            {currentMetric.label} Trend
          </Text>
          <Text style={styles.chartSubtitle}>
            Average: {(monthlyData.reduce((sum, d) => sum + (d[selectedMetric] as number), 0) / 12).toFixed(1)} {currentMetric.unit}
          </Text>
        </View>

        <View style={[styles.trendChart, { height: chartHeight }]}>
          <Text style={styles.chartPlaceholder}>
            📊 Trend Chart
          </Text>
          <Text style={styles.chartNote}>
            Interactive charts available in full version
          </Text>

          <View style={styles.xAxisLabels}>
            {monthlyData.map((data, index) => (
              <Text key={index} style={styles.trendXLabel}>
                {data.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[700]]}
        style={styles.header}
      >
        {onBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <Text style={styles.headerSubtitle}>{vesselName}</Text>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={onExportData}>
          <Ionicons name="download" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Performance Indicators */}
        <View style={styles.kpiContainer}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          
          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, { borderLeftColor: Colors.primary[600] }]}>
              <View style={styles.kpiHeader}>
                <Ionicons name="boat" size={20} color={Colors.primary[600]} />
                <Text style={styles.kpiValue}>{totalTrips}</Text>
              </View>
              <Text style={styles.kpiLabel}>Total Trips</Text>
              <Text style={styles.kpiSubtext}>
                Avg: {averageTripsPerMonth.toFixed(1)}/month
              </Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: Colors.status.success }]}>
              <View style={styles.kpiHeader}>
                <Ionicons name="navigate" size={20} color={Colors.status.success} />
                <Text style={styles.kpiValue}>{totalDistance.toLocaleString()}</Text>
              </View>
              <Text style={styles.kpiLabel}>Nautical Miles</Text>
              <Text style={styles.kpiSubtext}>
                {(totalDistance / 12).toFixed(0)} nm/month
              </Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: Colors.status.warning }]}>
              <View style={styles.kpiHeader}>
                <Ionicons name="speedometer" size={20} color={Colors.status.warning} />
                <Text style={styles.kpiValue}>{fuelEfficiency.toFixed(1)}</Text>
              </View>
              <Text style={styles.kpiLabel}>NM per Liter</Text>
              <Text style={styles.kpiSubtext}>
                Fuel Efficiency
              </Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: Colors.status.danger }]}>
              <View style={styles.kpiHeader}>
                <Ionicons name="card" size={20} color={Colors.status.danger} />
                <Text style={styles.kpiValue}>{costPerNM.toFixed(0)}</Text>
              </View>
              <Text style={styles.kpiLabel}>SEK per NM</Text>
              <Text style={styles.kpiSubtext}>
                Operating Cost
              </Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.key && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric Selector */}
        <View style={styles.metricContainer}>
          {metrics.map(metric => (
            <TouchableOpacity
              key={metric.key}
              style={[
                styles.metricButton,
                selectedMetric === metric.key && { backgroundColor: metric.color }
              ]}
              onPress={() => setSelectedMetric(metric.key as any)}
            >
              <Ionicons 
                name={metric.icon as any} 
                size={20} 
                color={selectedMetric === metric.key ? '#fff' : metric.color} 
              />
              <Text style={[
                styles.metricText,
                selectedMetric === metric.key && styles.metricTextActive
              ]}>
                {metric.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          {renderBarChart()}
          {renderTrendChart()}
        </View>

        {/* Detailed Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Detailed Statistics</Text>
          
          <View style={styles.statsList}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="time" size={20} color={Colors.primary[600]} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Average Trip Duration</Text>
                <Text style={styles.statValue}>
                  {(monthlyData.reduce((sum, d) => sum + d.hours, 0) / totalTrips).toFixed(1)} hours
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="water" size={20} color={Colors.status.warning} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Total Fuel Consumed</Text>
                <Text style={styles.statValue}>{totalFuel.toLocaleString()} liters</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="cash" size={20} color={Colors.status.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Operating Cost per Hour</Text>
                <Text style={styles.statValue}>{costPerHour.toFixed(0)} SEK/hour</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up" size={20} color={Colors.status.info} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Busiest Month</Text>
                <Text style={styles.statValue}>
                  {monthlyData.reduce((max, curr) => curr.trips > max.trips ? curr : max).month} 
                  ({Math.max(...monthlyData.map(d => d.trips))} trips)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costContainer}>
          <Text style={styles.sectionTitle}>Cost Breakdown (This Year)</Text>
          
          <View style={styles.costBreakdown}>
            <View style={styles.costItem}>
              <View style={[styles.costBar, { backgroundColor: Colors.status.warning }]}>
                <View style={[styles.costFill, { width: '60%' }]} />
              </View>
              <View style={styles.costInfo}>
                <Text style={styles.costLabel}>Fuel</Text>
                <Text style={styles.costValue}>60% • {(totalCost * 0.6).toLocaleString()} SEK</Text>
              </View>
            </View>

            <View style={styles.costItem}>
              <View style={[styles.costBar, { backgroundColor: Colors.status.danger }]}>
                <View style={[styles.costFill, { width: '25%' }]} />
              </View>
              <View style={styles.costInfo}>
                <Text style={styles.costLabel}>Maintenance</Text>
                <Text style={styles.costValue}>25% • {(totalCost * 0.25).toLocaleString()} SEK</Text>
              </View>
            </View>

            <View style={styles.costItem}>
              <View style={[styles.costBar, { backgroundColor: Colors.primary[600] }]}>
                <View style={[styles.costFill, { width: '10%' }]} />
              </View>
              <View style={styles.costInfo}>
                <Text style={styles.costLabel}>Docking & Fees</Text>
                <Text style={styles.costValue}>10% • {(totalCost * 0.1).toLocaleString()} SEK</Text>
              </View>
            </View>

            <View style={styles.costItem}>
              <View style={[styles.costBar, { backgroundColor: Colors.neutral[400] }]}>
                <View style={[styles.costFill, { width: '5%' }]} />
              </View>
              <View style={styles.costInfo}>
                <Text style={styles.costLabel}>Other</Text>
                <Text style={styles.costValue}>5% • {(totalCost * 0.05).toLocaleString()} SEK</Text>
              </View>
            </View>
          </View>

          <View style={styles.totalCost}>
            <Text style={styles.totalCostLabel}>Total Annual Cost</Text>
            <Text style={styles.totalCostValue}>{totalCost.toLocaleString()} SEK</Text>
          </View>
        </View>

        {/* Environmental Impact */}
        <View style={styles.environmentContainer}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          
          <View style={styles.environmentStats}>
            <View style={styles.environmentCard}>
              <Ionicons name="leaf" size={32} color={Colors.status.success} />
              <Text style={styles.environmentValue}>
                {(totalFuel * 2.31).toFixed(0)} kg
              </Text>
              <Text style={styles.environmentLabel}>CO₂ Emissions</Text>
              <Text style={styles.environmentSubtext}>
                {(totalFuel * 2.31 / totalDistance).toFixed(2)} kg/nm
              </Text>
            </View>

            <View style={styles.environmentCard}>
              <Ionicons name="water" size={32} color={Colors.primary[600]} />
              <Text style={styles.environmentValue}>
                {fuelEfficiency.toFixed(1)} nm/L
              </Text>
              <Text style={styles.environmentLabel}>Fuel Efficiency</Text>
              <Text style={styles.environmentSubtext}>
                Above average
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  kpiContainer: {
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  kpiGrid: {
    gap: 16,
  },
  kpiCard: {
    backgroundColor: Colors.neutral[50],
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  kpiLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  kpiSubtext: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  periodTextActive: {
    color: '#fff',
  },
  metricContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    gap: 6,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  metricTextActive: {
    color: '#fff',
  },
  chartsContainer: {
    gap: 20,
  },
  chartContainer: {
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxis: {
    width: 40,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: Colors.neutral[500],
  },
  chartArea: {
    flex: 1,
    height: 200,
    position: 'relative',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    justifyContent: 'space-around',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barColumn: {
    width: 16,
    height: 200,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 16,
    borderRadius: 2,
  },
  xAxisLabel: {
    fontSize: 10,
    color: Colors.neutral[500],
    marginTop: 8,
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: 200,
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: Colors.neutral[200],
  },
  trendContainer: {
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  trendChart: {
    position: 'relative',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  trendXLabel: {
    fontSize: 10,
    color: Colors.neutral[500],
  },
  statsContainer: {
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  statsList: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  costContainer: {
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  costBreakdown: {
    gap: 16,
    marginBottom: 20,
  },
  costItem: {
    gap: 8,
  },
  costBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[200],
    overflow: 'hidden',
  },
  costFill: {
    height: '100%',
    backgroundColor: 'inherit',
  },
  costInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  costValue: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  totalCost: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  totalCostValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  environmentContainer: {
    backgroundColor: Colors.background,
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  environmentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  environmentCard: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  environmentValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    marginTop: 8,
    marginBottom: 4,
  },
  environmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 4,
    textAlign: 'center',
  },
  environmentSubtext: {
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  chartPlaceholder: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.neutral[600],
    marginTop: 60,
  },
  chartNote: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.neutral[500],
    marginTop: 8,
  },
}); 