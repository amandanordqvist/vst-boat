import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import VesselOverview from './VesselOverview';
import Colors from '@/constants/Colors';

// Sample vessel data matching the data structure in vessel.tsx
const vessels = [
  {
    id: '1',
    name: 'Sea Breeze',
    type: 'Flybridge Motor Yacht',
    status: 'Active',
    location: 'Marina Bay Harbor',
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    manufacturer: 'Sunseeker',
    model: 'Manhattan 60',
    year: '2023',
  },
  {
    id: '2',
    name: 'Ocean Explorer',
    type: 'Motor Yacht',
    status: 'Maintenance',
    location: 'Port Royal Marina',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9hdCUyMGNhYmlufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    manufacturer: 'Azimut',
    model: 'Atlantis 43',
    year: '2022',
  },
  {
    id: '3',
    name: 'Coastal Cruiser',
    type: 'Sailboat',
    status: 'Inactive',
    location: 'Sunset Harbor',
    image: 'https://images.unsplash.com/photo-1520383278046-37a90eb02d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdCUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    manufacturer: 'Beneteau',
    model: 'Oceanis 45',
    year: '2024',
  }
];

interface VesselSummaryProps {
  showTitle?: boolean;
}

export default function VesselSummary({ showTitle = true }: VesselSummaryProps) {
  const router = useRouter();

  const handleVesselPress = (vesselId: string) => {
    // Navigate to vessel tab screen
    router.push('/(tabs)/vessel');
  };

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={styles.title}>My Vessels</Text>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {vessels.map(vessel => (
          <VesselOverview
            key={vessel.id}
            name={vessel.name}
            type={vessel.type}
            status={vessel.status}
            location={vessel.location}
            image={vessel.image}
            manufacturer={vessel.manufacturer}
            model={vessel.model}
            year={vessel.year}
            onPress={() => handleVesselPress(vessel.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
    marginBottom: 16,
  },
}); 