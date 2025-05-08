import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { MapPin, Wind, Droplets } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

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
  return (
    <LinearGradient
      colors={[Colors.primary[600], Colors.primary[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Weather Conditions</Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#FFFFFF" />
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
          <Wind size={16} color="#FFFFFF" />
          <Text style={styles.detailText}>{windSpeed} kn</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailItem}>
          <Droplets size={16} color="#FFFFFF" />
          <Text style={styles.detailText}>{humidity}%</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
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
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 36,
    fontWeight: '700',
  },
  condition: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  weatherDetails: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
});