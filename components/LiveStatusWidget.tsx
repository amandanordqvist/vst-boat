import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { 
  Zap, 
  Thermometer, 
  Gauge, 
  Battery, 
  Waves, 
  Signal,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react-native';

interface LiveDataPoint {
  value: string;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: Date;
}

interface LiveStatusData {
  engineTemp: LiveDataPoint;
  fuelLevel: LiveDataPoint;
  batteryLevel: LiveDataPoint;
  engineRPM: LiveDataPoint;
  speed: LiveDataPoint;
  depth: LiveDataPoint;
  gpsSignal: LiveDataPoint;
  position: LiveDataPoint;
}

interface LiveStatusWidgetProps {
  onViewDetails?: () => void;
}

export default function LiveStatusWidget({ onViewDetails }: LiveStatusWidgetProps) {
  const [liveData, setLiveData] = useState<LiveStatusData>({
    engineTemp: { value: '82', unit: '°C', status: 'normal', lastUpdated: new Date() },
    fuelLevel: { value: '75', unit: '%', status: 'normal', lastUpdated: new Date() },
    batteryLevel: { value: '88', unit: '%', status: 'normal', lastUpdated: new Date() },
    engineRPM: { value: '1,850', unit: 'RPM', status: 'normal', lastUpdated: new Date() },
    speed: { value: '12.5', unit: 'kts', status: 'normal', lastUpdated: new Date() },
    depth: { value: '15.2', unit: 'm', status: 'normal', lastUpdated: new Date() },
    gpsSignal: { value: '95', unit: '%', status: 'normal', lastUpdated: new Date() },
    position: { value: '33.7490° N, 118.2437° W', status: 'normal', lastUpdated: new Date() },
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const now = new Date();
        return {
          ...prev,
          engineTemp: { 
            ...prev.engineTemp, 
            value: (80 + Math.random() * 10).toFixed(0),
            lastUpdated: now 
          },
          fuelLevel: { 
            ...prev.fuelLevel, 
            value: Math.max(70, parseFloat(prev.fuelLevel.value) - 0.1).toFixed(1),
            lastUpdated: now 
          },
          speed: { 
            ...prev.speed, 
            value: (10 + Math.random() * 5).toFixed(1),
            lastUpdated: now 
          },
          engineRPM: { 
            ...prev.engineRPM, 
            value: (1800 + Math.random() * 200).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            lastUpdated: now 
          },
        };
      });
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch(status) {
      case 'critical': return Colors.status.error;
      case 'warning': return Colors.status.warning;
      default: return Colors.status.success;
    }
  };

  const getStatusIcon = (status: 'normal' | 'warning' | 'critical') => {
    if (status === 'critical' || status === 'warning') {
      return <AlertTriangle size={12} color={getStatusColor(status)} />;
    }
    return null;
  };

  const formatLastUpdate = () => {
    const diff = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  const LiveDataItem = ({ 
    icon, 
    label, 
    data, 
    color 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    data: LiveDataPoint; 
    color: string;
  }) => (
    <View style={styles.dataItem}>
      <View style={styles.dataHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        {getStatusIcon(data.status)}
      </View>
      <Text style={styles.dataLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.dataValue, { color: getStatusColor(data.status) }]}>
          {data.value}
        </Text>
        {data.unit && (
          <Text style={styles.dataUnit}>{data.unit}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.title}>System Status</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.lastUpdate}>{formatLastUpdate()}</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dataGrid}>
        <LiveDataItem
          icon={<Thermometer size={16} color="#FFFFFF" />}
          label="Engine Temp"
          data={liveData.engineTemp}
          color={Colors.status.warning}
        />
        
        <LiveDataItem
          icon={<Gauge size={16} color="#FFFFFF" />}
          label="Fuel Level"
          data={liveData.fuelLevel}
          color={Colors.primary[600]}
        />
        
        <LiveDataItem
          icon={<Battery size={16} color="#FFFFFF" />}
          label="Battery"
          data={liveData.batteryLevel}
          color={Colors.status.success}
        />
        
        <LiveDataItem
          icon={<Zap size={16} color="#FFFFFF" />}
          label="Engine RPM"
          data={liveData.engineRPM}
          color={Colors.accent[600]}
        />
        
        <LiveDataItem
          icon={<Waves size={16} color="#FFFFFF" />}
          label="Speed"
          data={liveData.speed}
          color={Colors.secondary[600]}
        />
        
        <LiveDataItem
          icon={<Waves size={16} color="#FFFFFF" />}
          label="Depth"
          data={liveData.depth}
          color={Colors.water.medium}
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.positionContainer}>
          <MapPin size={14} color={Colors.neutral[600]} />
          <Text style={styles.positionText} numberOfLines={1}>
            {liveData.position.value}
          </Text>
        </View>
        
        <View style={styles.signalContainer}>
          <Signal size={14} color={Colors.status.success} />
          <Text style={styles.signalText}>GPS {liveData.gpsSignal.value}{liveData.gpsSignal.unit}</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  liveText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  lastUpdate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[700],
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dataItem: {
    width: '32%',
    marginBottom: 16,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dataValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  dataUnit: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: Colors.neutral[600],
    marginLeft: 2,
  },
  bottomSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  positionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: Colors.neutral[700],
    marginLeft: 6,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: Colors.neutral[700],
    marginLeft: 4,
  },
}); 