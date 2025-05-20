import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Ship, Wrench, CircleAlert, Fuel } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

function QuickAction({ icon, title, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function QuickActions() {
  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAction = (action: string) => {
    triggerHapticFeedback();
    console.log(`${action} pressed`);
    // Navigation logic would go here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <View style={styles.actionsContainer}>
        <QuickAction 
          icon={<Ship size={24} color="#FFFFFF" />}
          title="Start Trip"
          onPress={() => handleAction('Start Trip')}
        />
        <QuickAction 
          icon={<Fuel size={24} color="#FFFFFF" />}
          title="Record Fuel"
          onPress={() => handleAction('Record Fuel')}
        />
        <QuickAction 
          icon={<Wrench size={24} color="#FFFFFF" />}
          title="Service"
          onPress={() => handleAction('Service')}
        />
        <QuickAction 
          icon={<CircleAlert size={24} color="#FFFFFF" />}
          title="Report Issue"
          onPress={() => handleAction('Report Issue')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 18,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12, // H2 size
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '26%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 10, // Label text
    fontWeight: '500',
    color: Colors.neutral[800],
    textAlign: 'center',
  },
});