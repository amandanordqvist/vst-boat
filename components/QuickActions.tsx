import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { ClipboardCheck, PenTool as Tool, MapPin, CircleGauge as GaugeCircle } from 'lucide-react-native';
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
    if (Platform.OS !== 'web') {
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
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <QuickAction 
          icon={<ClipboardCheck size={24} color={Colors.primary[500]} />}
          title="Checklists"
          onPress={() => handleAction('Checklists')}
        />
        <QuickAction 
          icon={<Tool size={24} color={Colors.secondary[500]} />}
          title="Service"
          onPress={() => handleAction('Service')}
        />
        <QuickAction 
          icon={<MapPin size={24} color={Colors.accent[500]} />}
          title="Location"
          onPress={() => handleAction('Location')}
        />
        <QuickAction 
          icon={<GaugeCircle size={24} color={Colors.water.deep} />}
          title="Fuel"
          onPress={() => handleAction('Fuel')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
    textAlign: 'center',
  },
});