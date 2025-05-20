import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CheckSquare } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ChecklistButton() {
  const goToChecklists = () => {
    // Force navigate to the checklists tab
    router.replace('/(tabs)/checklists');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={goToChecklists}>
      <CheckSquare size={18} color="#FFFFFF" />
      <Text style={styles.buttonText}>Go to Checklists</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 