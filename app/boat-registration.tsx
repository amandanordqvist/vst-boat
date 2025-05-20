import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import VesselRegistrationForm from '../components/VesselRegistrationForm';

export default function BoatRegistrationScreen() {
  // Handle form submission
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    // In a real app, you would save this data to an API/database
    router.back();
  };
  
  // Handle cancel button press
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <VesselRegistrationForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
}); 