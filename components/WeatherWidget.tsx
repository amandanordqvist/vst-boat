import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { MapPin, Wind, Droplets, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

interface WeatherWidgetProps {
  temperature: number;
  condition: string;
  location: string;
  windSpeed: number;
  humidity: number;
  iconUrl: string;
}

export default function WeatherWidget({ 
  temperature, 
  condition, 
  location, 
  windSpeed, 
  humidity, 
  iconUrl 
}: WeatherWidgetProps) {
  const handleViewForecast = () => {
    // Navigate to forecast screen when implemented
    // router.push('/(tabs)/weather');
    console.log('View forecast');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather Conditions</Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={Colors.primary[600]} />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
      
      <View style={styles.weatherInfo}>
        <View style={styles.tempContainer}>
          <Text style={styles.temperature}>{temperature}°</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>
        <Image
          source={{ uri: iconUrl }}
          style={styles.weatherIcon}
        />
      </View>
      
      <View style={styles.weatherDetails}>
        <View style={styles.detailItem}>
          <Wind size={16} color="#fff" />
          <Text style={styles.detailText}>{windSpeed} kn</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Droplets size={16} color="#fff" />
          <Text style={styles.detailText}>{humidity}%</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.forecastLink}
        onPress={handleViewForecast}
        activeOpacity={0.7}
      >
        <Text style={styles.forecastText}>View Forecast</Text>
        <ChevronRight size={16} color={Colors.primary[600]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: Colors.background,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: Colors.neutral[900],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: Colors.neutral[600],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    marginLeft: 4,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempContainer: {
    flexDirection: 'column',
  },
  temperature: {
    color: Colors.primary[700],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 36,
    fontWeight: '700',
  },
  condition: {
    color: Colors.neutral[700],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    lineHeight: 20,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  weatherDetails: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[600],
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  forecastLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.secondary[200],
  },
  forecastText: {
    color: Colors.primary[600],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});