import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ShimmerLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export default function ShimmerLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 12,
  style 
}: ShimmerLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    const startShimmer = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => startShimmer());
    };

    startShimmer();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View 
      style={[
        styles.container, 
        { width, height, borderRadius },
        style
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 0.1)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

// Preset shimmer components for common use cases
export function ShimmerCard() {
  return (
    <View style={styles.shimmerCard}>
      <ShimmerLoader height={24} width="60%" style={{ marginBottom: 12 }} />
      <ShimmerLoader height={16} width="40%" style={{ marginBottom: 8 }} />
      <ShimmerLoader height={16} width="80%" style={{ marginBottom: 8 }} />
      <ShimmerLoader height={16} width="50%" />
    </View>
  );
}

export function ShimmerMetric() {
  return (
    <View style={styles.shimmerMetric}>
      <ShimmerLoader height={32} width="70%" style={{ marginBottom: 8 }} />
      <ShimmerLoader height={14} width="50%" />
    </View>
  );
}

export function ShimmerList({ items = 3 }: { items?: number }) {
  return (
    <View>
      {Array.from({ length: items }).map((_, index) => (
        <View key={index} style={styles.shimmerListItem}>
          <ShimmerLoader height={16} width="30%" style={{ marginBottom: 6 }} />
          <ShimmerLoader height={12} width="80%" style={{ marginBottom: 4 }} />
          <ShimmerLoader height={12} width="60%" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  shimmerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
  },
  shimmerMetric: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    minWidth: 120,
  },
  shimmerListItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
}); 