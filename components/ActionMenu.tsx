import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';

type ActionProps = {
  id: string;
  icon: React.ReactNode;
  label: string;
};

type ActionMenuProps = {
  actions: ActionProps[];
  onPress: (id: string) => void;
};

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, onPress }) => {
  return (
    <View style={styles.container}>
      {actions.map(action => (
        <TouchableOpacity 
          key={action.id}
          style={styles.actionButton}
          onPress={() => onPress(action.id)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            {action.icon}
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[800],
    textAlign: 'center',
  },
});

export default ActionMenu; 