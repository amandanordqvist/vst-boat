import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Ship, Wrench, CircleAlert, Fuel, MapPin, Clipboard, Anchor, LifeBuoy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  color?: string;
}

function QuickAction({ icon, title, onPress, color = Colors.primary[700] }: QuickActionProps) {
  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
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

  const handleAction = (action: string, route?: any) => {
    triggerHapticFeedback();
    
    if (route) {
      router.push(route);
    } else {
      console.log(`${action} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          <QuickAction 
            icon={<Ship size={24} color="#FFFFFF" />}
            title="Start Trip"
            onPress={() => handleAction('Start Trip', '/(tabs)/voyage')}
            color={Colors.primary[600]}
          />
          <QuickAction 
            icon={<Fuel size={24} color="#FFFFFF" />}
            title="Record Fuel"
            onPress={() => handleAction('Record Fuel', '/(tabs)/fuel')}
            color={Colors.status.info}
          />
          <QuickAction 
            icon={<Wrench size={24} color="#FFFFFF" />}
            title="Maintenance"
            onPress={() => handleAction('Maintenance', '/(tabs)/maintenance')}
            color={Colors.accent[600]}
          />
          <QuickAction 
            icon={<CircleAlert size={24} color="#FFFFFF" />}
            title="Report Issue"
            onPress={() => handleAction('Report Issue')}
            color={Colors.status.error}
          />
        </View>
        
        <View style={styles.actionsRow}>
          <QuickAction 
            icon={<Clipboard size={24} color="#FFFFFF" />}
            title="Checklists"
            onPress={() => handleAction('Checklists', '/(tabs)/checklists')}
            color={Colors.primary[500]}
          />
          <QuickAction 
            icon={<MapPin size={24} color="#FFFFFF" />}
            title="Location"
            onPress={() => handleAction('Location', '/(tabs)/location')}
            color={Colors.status.success}
          />
          <QuickAction 
            icon={<Anchor size={24} color="#FFFFFF" />}
            title="Docking"
            onPress={() => handleAction('Docking')}
            color={Colors.secondary[600]}
          />
          <QuickAction 
            icon={<LifeBuoy size={24} color="#FFFFFF" />}
            title="Safety"
            onPress={() => handleAction('Safety')}
            color={Colors.status.warning}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsContainer: {
    gap: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '23%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[800],
    textAlign: 'center',
    marginTop: 4,
  },
});