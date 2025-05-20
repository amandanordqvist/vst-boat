import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { ChevronRight, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { IconConfig } from '@/constants/IconConfig';
import WeatherAlert, { WeatherAlertSeverity } from './WeatherAlert';

// Sample data interface
interface ForecastDay {
  id: string;
  day: string;
  date: string;
  temperature: number;
  condition: string;
  iconUrl: string;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherAlertData {
  id: string;
  severity: WeatherAlertSeverity;
  title: string;
  description: string;
  validUntil: string;
}

interface WeatherForecastProps {
  location?: string;
  forecast: ForecastDay[];
  alerts?: WeatherAlertData[];
}

// Sample data
const defaultForecast: ForecastDay[] = [
  {
    id: '1',
    day: 'Today',
    date: 'May 24',
    temperature: 24,
    condition: 'Partly Cloudy',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
    windSpeed: 12,
    precipitation: 0,
  },
  {
    id: '2',
    day: 'Tomorrow',
    date: 'May 25',
    temperature: 26,
    condition: 'Sunny',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
    windSpeed: 8,
    precipitation: 0,
  },
  {
    id: '3',
    day: 'Saturday',
    date: 'May 26',
    temperature: 23,
    condition: 'Cloudy',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/119.png',
    windSpeed: 10,
    precipitation: 0,
  },
  {
    id: '4',
    day: 'Sunday',
    date: 'May 27',
    temperature: 22,
    condition: 'Light Rain',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/296.png',
    windSpeed: 15,
    precipitation: 2.3,
  },
  {
    id: '5',
    day: 'Monday',
    date: 'May 28',
    temperature: 20,
    condition: 'Rain',
    iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/308.png',
    windSpeed: 18,
    precipitation: 5.7,
  },
];

export default function WeatherForecast({ 
  location = 'Marina Bay',
  forecast = defaultForecast,
  alerts = []
}: WeatherForecastProps) {
  
  const navigateToWeather = () => {
    router.push('/(tabs)/weather');
  };
  
  const hasAlerts = alerts && alerts.length > 0;
  
  return (
    <View style={styles.container}>
      {/* Forecast Header */}
      <View style={styles.header}>
        <Text style={styles.title}>5-Day Forecast</Text>
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={navigateToWeather}
        >
          <Text style={styles.viewMoreText}>View More</Text>
          <ChevronRight size={16} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>
      
      {/* Weather Alerts Banner */}
      {hasAlerts && (
        <TouchableOpacity 
          style={styles.alertsBanner}
          onPress={navigateToWeather}
          activeOpacity={0.7}
        >
          <AlertTriangle size={IconConfig.size.small} color={Colors.status.warning} />
          <Text style={styles.alertsText}>
            {alerts.length} active weather alert{alerts.length > 1 ? 's' : ''}
          </Text>
          <ChevronRight size={IconConfig.size.small} color={Colors.status.warning} />
        </TouchableOpacity>
      )}
      
      {/* Daily Forecast */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {forecast.map((day) => (
          <View key={day.id} style={styles.forecastDay}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{day.day}</Text>
              <Text style={styles.date}>{day.date}</Text>
            </View>
            
            <View style={styles.weatherIconContainer}>
              <Image 
                source={{ uri: day.iconUrl }}
                style={styles.weatherIcon}
              />
              <Text style={styles.temperature}>{day.temperature}°C</Text>
            </View>
            
            <Text style={styles.condition}>{day.condition}</Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{day.windSpeed} km/h</Text>
              </View>
              
              <View style={styles.detailDivider} />
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Precip.</Text>
                <Text style={styles.detailValue}>{day.precipitation} mm</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Weather Alerts (showing only the first one) */}
      {hasAlerts && (
        <View style={styles.firstAlertContainer}>
          <WeatherAlert 
            {...alerts[0]} 
            onPress={navigateToWeather}
          />
          
          {alerts.length > 1 && (
            <TouchableOpacity 
              style={styles.viewAllAlertsButton}
              onPress={navigateToWeather}
            >
              <Text style={styles.viewAllAlertsText}>
                View all {alerts.length} alerts
              </Text>
              <ChevronRight size={IconConfig.size.small} color={Colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[600],
    marginRight: 4,
  },
  alertsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  alertsText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.status.warning,
    marginHorizontal: 8,
  },
  scrollView: {
    marginHorizontal: -8,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  forecastDay: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 16,
    padding: 16,
    width: 124,
    marginRight: 12,
    alignItems: 'center',
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  weatherIcon: {
    width: 48,
    height: 48,
  },
  temperature: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
    marginTop: 8,
  },
  condition: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
    marginTop: 4,
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[200],
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.neutral[800],
  },
  firstAlertContainer: {
    marginTop: 16,
  },
  viewAllAlertsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
  },
  viewAllAlertsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[600],
    marginRight: 4,
  }
}); 