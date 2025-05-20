import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wind, Droplets, Compass, Calendar, Sun, Cloud } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Sample weather forecast data
const weatherForecast = [
  {
    day: 'Today',
    tempHigh: 26,
    tempLow: 18,
    condition: 'Partly Cloudy',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
    windSpeed: 12,
    windDirection: 'NE',
    precipitation: 10,
    humidity: 65,
  },
  {
    day: 'Tomorrow',
    tempHigh: 24,
    tempLow: 17,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
    windSpeed: 8,
    windDirection: 'E',
    precipitation: 0,
    humidity: 55,
  },
  {
    day: 'Wednesday',
    tempHigh: 23,
    tempLow: 16,
    condition: 'Light Rain',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/296.png',
    windSpeed: 15,
    windDirection: 'SE',
    precipitation: 40,
    humidity: 75,
  },
  {
    day: 'Thursday',
    tempHigh: 22,
    tempLow: 15,
    condition: 'Overcast',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/119.png',
    windSpeed: 18,
    windDirection: 'S',
    precipitation: 20,
    humidity: 70,
  },
  {
    day: 'Friday',
    tempHigh: 25,
    tempLow: 18,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
    windSpeed: 10,
    windDirection: 'SW',
    precipitation: 0,
    humidity: 60,
  },
];

// Marine conditions data
const marineConditions = {
  waveHeight: 0.8, // meters
  wavePeriod: 5, // seconds
  waterTemp: 18, // celsius
  visibility: 15, // kilometers
  tideTime: '16:45',
  tideType: 'High',
  tideHeight: 4.2, // meters
  sunrise: '06:30',
  sunset: '19:45',
};

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: 16 + (Platform.OS !== 'web' ? insets.top : 0),
            paddingBottom: 16 + (Platform.OS !== 'web' ? insets.bottom : 0) 
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Weather */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.currentMain}>
            <View>
              <Text style={styles.locationText}>Marina Bay</Text>
              <Text style={styles.dateText}>Today, {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}</Text>
              <Text style={styles.temperatureText}>24°</Text>
              <Text style={styles.conditionText}>Partly Cloudy</Text>
            </View>
            <Image 
              source={{ uri: 'https://cdn.weatherapi.com/weather/64x64/day/116.png' }}
              style={styles.weatherIcon}
            />
          </View>
          
          <View style={styles.conditionsRow}>
            <View style={styles.conditionItem}>
              <Wind size={16} color={Colors.primary[700]} />
              <Text style={styles.conditionLabel}>Wind</Text>
              <Text style={styles.conditionValue}>12 kn</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.conditionItem}>
              <Droplets size={16} color={Colors.primary[700]} />
              <Text style={styles.conditionLabel}>Humidity</Text>
              <Text style={styles.conditionValue}>65%</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.conditionItem}>
              <Compass size={16} color={Colors.primary[700]} />
              <Text style={styles.conditionLabel}>Wind Dir</Text>
              <Text style={styles.conditionValue}>NE</Text>
            </View>
          </View>
        </View>
        
        {/* Forecast */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>5-Day Forecast</Text>
          
          {weatherForecast.map((day, index) => (
            <View key={index} style={[
              styles.forecastItem,
              index < weatherForecast.length - 1 && styles.forecastDivider
            ]}>
              <View style={styles.forecastDay}>
                <Calendar size={16} color={Colors.neutral[500]} style={styles.dayIcon} />
                <Text style={styles.dayText}>{day.day}</Text>
              </View>
              
              <View style={styles.forecastCondition}>
                <Image source={{ uri: day.icon }} style={styles.forecastIcon} />
                <Text style={styles.conditionText}>{day.condition}</Text>
              </View>
              
              <View style={styles.forecastTemp}>
                <Text style={styles.tempHighText}>{day.tempHigh}°</Text>
                <Text style={styles.tempLowText}>{day.tempLow}°</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Marine Conditions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Marine Conditions</Text>
          
          <View style={styles.marineGrid}>
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Wind size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Wave Height</Text>
              <Text style={styles.marineValue}>{marineConditions.waveHeight} m</Text>
            </View>
            
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Wind size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Wave Period</Text>
              <Text style={styles.marineValue}>{marineConditions.wavePeriod} s</Text>
            </View>
            
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Droplets size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Water Temp</Text>
              <Text style={styles.marineValue}>{marineConditions.waterTemp}°C</Text>
            </View>
            
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Cloud size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Visibility</Text>
              <Text style={styles.marineValue}>{marineConditions.visibility} km</Text>
            </View>
            
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Wind size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Tide</Text>
              <Text style={styles.marineValue}>{marineConditions.tideType} {marineConditions.tideHeight}m</Text>
              <Text style={styles.marineSubvalue}>{marineConditions.tideTime}</Text>
            </View>
            
            <View style={styles.marineItem}>
              <View style={styles.marineIconContainer}>
                <Sun size={20} color={Colors.primary[700]} />
              </View>
              <Text style={styles.marineLabel}>Sunrise/Sunset</Text>
              <Text style={styles.marineValue}>{marineConditions.sunrise}</Text>
              <Text style={styles.marineSubvalue}>{marineConditions.sunset}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  currentWeatherCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20, // H2 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  dateText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[500],
    marginBottom: 16,
  },
  temperatureText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary[700],
    marginBottom: 4,
  },
  conditionText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    color: Colors.neutral[700],
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  conditionsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary[100],
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  conditionItem: {
    flex: 1,
    alignItems: 'center',
  },
  conditionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // Label text
    color: Colors.neutral[500],
    marginTop: 4,
  },
  conditionValue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    fontWeight: '500',
    color: Colors.neutral[800],
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.neutral[200],
  },
  sectionContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18, // Between H2 and H3
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  forecastDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  forecastDay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayIcon: {
    marginRight: 8,
  },
  dayText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[800],
  },
  forecastCondition: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  forecastTemp: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tempHighText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginRight: 8,
  },
  tempLowText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    color: Colors.neutral[400],
  },
  marineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  marineItem: {
    width: '48%',
    backgroundColor: Colors.secondary[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  marineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  marineLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // Label text
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  marineValue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16, // H3 size
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  marineSubvalue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14, // Body text
    color: Colors.neutral[700],
  },
}); 