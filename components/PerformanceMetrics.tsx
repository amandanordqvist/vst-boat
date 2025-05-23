import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { TrendingUp, TrendingDown, Gauge, Droplets, Activity, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
}

function MetricCard({ title, value, unit, trend, trendValue, icon, color, onPress }: MetricCardProps) {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return <TrendingUp size={14} color={Colors.status.success} />;
      case 'down': return <TrendingDown size={14} color={Colors.status.error} />;
      default: return <Activity size={14} color={Colors.neutral[500]} />;
    }
  };

  const getTrendColor = () => {
    switch(trend) {
      case 'up': return Colors.status.success;
      case 'down': return Colors.status.error;
      default: return Colors.neutral[500];
    }
  };

  return (
    <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.metricHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <View style={styles.trendContainer}>
          {getTrendIcon()}
          <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {trendValue}
          </Text>
        </View>
      </View>
      
      <Text style={styles.metricTitle}>{title}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
    </TouchableOpacity>
  );
}

interface PerformanceMetricsProps {
  fuelEfficiency: number; // L/h
  engineLoad: number; // percentage
  avgSpeed: number; // knots
  totalDistance: number; // nautical miles
  operatingHours: number; // hours this month
  maintenanceScore: number; // percentage
}

export default function PerformanceMetrics({
  fuelEfficiency = 8.5,
  engineLoad = 65,
  avgSpeed = 12.5,
  totalDistance = 125,
  operatingHours = 42,
  maintenanceScore = 87
}: PerformanceMetricsProps) {
  
  const navigateToAnalytics = () => {
    router.push('/(tabs)/vessel');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={navigateToAnalytics}>
          <Text style={styles.viewAllText}>View Analytics</Text>
          <ChevronRight size={14} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Fuel Efficiency"
          value={fuelEfficiency.toString()}
          unit="L/h"
          trend="up"
          trendValue="+5%"
          icon={<Droplets size={20} color="#FFFFFF" />}
          color={Colors.status.success}
          onPress={() => router.push('/(tabs)/fuel')}
        />
        
        <MetricCard
          title="Engine Load"
          value={engineLoad.toString()}
          unit="%"
          trend="stable"
          trendValue="±2%"
          icon={<Gauge size={20} color="#FFFFFF" />}
          color={Colors.accent[600]}
          onPress={navigateToAnalytics}
        />
        
        <MetricCard
          title="Avg Speed"
          value={avgSpeed.toString()}
          unit="kts"
          trend="up"
          trendValue="+8%"
          icon={<Activity size={20} color="#FFFFFF" />}
          color={Colors.primary[600]}
          onPress={() => router.push('/(tabs)/voyage')}
        />
        
        <MetricCard
          title="Distance"
          value={totalDistance.toString()}
          unit="nm"
          trend="up"
          trendValue="+15%"
          icon={<TrendingUp size={20} color="#FFFFFF" />}
          color={Colors.secondary[600]}
          onPress={() => router.push('/(tabs)/voyage')}
        />
      </View>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Operating Hours</Text>
          <Text style={styles.summaryValue}>{operatingHours}h</Text>
          <Text style={styles.summarySubtext}>This month</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Health Score</Text>
          <Text style={[styles.summaryValue, { color: maintenanceScore >= 80 ? Colors.status.success : Colors.status.warning }]}>
            {maintenanceScore}%
          </Text>
          <Text style={styles.summarySubtext}>Overall</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  metricTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.neutral[900],
  },
  metricUnit: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.neutral[900],
    marginBottom: 2,
  },
  summarySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.neutral[500],
  },
}); 