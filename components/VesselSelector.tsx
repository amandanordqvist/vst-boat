import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Vessel = {
  id: string;
  name: string;
  type: string;
};

const vessels: Vessel[] = [
  { id: '1', name: 'Sea Breeze', type: 'Yacht' },
  { id: '2', name: 'Ocean Explorer', type: 'Speedboat' },
  { id: '3', name: 'Coastal Cruiser', type: 'Sailboat' },
];

export default function VesselSelector() {
  const [selected, setSelected] = useState(vessels[0]);
  const [open, setOpen] = useState(false);
  
  const rotation = useSharedValue(0);
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleDropdown = () => {
    setOpen(!open);
    rotation.value = withTiming(open ? 0 : 180, { duration: 300 });
  };

  const selectVessel = (vessel: Vessel) => {
    setSelected(vessel);
    setOpen(false);
    rotation.value = withTiming(0, { duration: 300 });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.selectedInfo}>
          <Text style={styles.vesselType}>{selected.type}</Text>
          <Text style={styles.vesselName}>{selected.name}</Text>
        </View>
        <Animated.View style={iconStyle}>
          <ChevronDown color="#1A5F9C" size={24} />
        </Animated.View>
      </TouchableOpacity>
      
      {open && (
        <View style={styles.dropdown}>
          {vessels.map((vessel) => (
            <TouchableOpacity
              key={vessel.id}
              style={[
                styles.option,
                selected.id === vessel.id && styles.selectedOption
              ]}
              onPress={() => selectVessel(vessel)}
            >
              <Text style={styles.vesselType}>{vessel.type}</Text>
              <Text 
                style={[
                  styles.vesselName,
                  selected.id === vessel.id && styles.selectedText
                ]}
              >
                {vessel.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2,
  },
  selector: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedInfo: {
    flexDirection: 'column',
  },
  vesselType: {
    color: '#667085', // Secondary text color
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '400',
  },
  vesselName: {
    color: '#1A5F9C', // Primary deep blue
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 3,
    overflow: 'hidden',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5F2FF', // Light blue from palette
  },
  selectedOption: {
    backgroundColor: '#E5F2FF', // Light blue from palette
  },
  selectedText: {
    color: '#1A5F9C', // Primary deep blue
  },
});