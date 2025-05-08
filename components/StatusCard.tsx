import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type StatusType = 'ready' | 'attention' | 'critical';

interface StatusCardProps {
  type: StatusType;
  title: string;
  message: string;
}

export default function StatusCard({ type, title, message }: StatusCardProps) {
  const scale = useSharedValue(1);
  
  const statusColors = {
    ready: Colors.status.success,
    attention: Colors.status.warning,
    critical: Colors.status.error,
  };
  
  const statusIcons = {
    ready: <CheckCircle color={statusColors.ready} size={24} />,
    attention: <AlertTriangle color={statusColors.attention} size={24} />,
    critical: <XCircle color={statusColors.critical} size={24} />,
  };
  
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  const CardContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconContainer}>
        {statusIcons[type]}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View 
        style={[
          styles.indicator, 
          { backgroundColor: statusColors[type] }
        ]} 
      />
    </View>
  );
  
  return (
    <Animated.View 
      style={[styles.container, containerStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={70} tint="light" style={styles.blurContainer}>
          <CardContent />
        </BlurView>
      ) : (
        <View style={styles.regularContainer}>
          <CardContent />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  regularContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});