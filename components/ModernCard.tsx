import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ViewStyle,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  glow?: boolean;
  disabled?: boolean;
}

export default function ModernCard({ 
  children, 
  style, 
  onPress,
  variant = 'default',
  size = 'medium',
  glow = false,
  disabled = false
}: ModernCardProps) {
  const animatedValue = new Animated.Value(1);

  const handlePressIn = () => {
    if (!disabled && onPress) {
      Animated.spring(animatedValue, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[size]];
    
    switch (variant) {
      case 'glass':
        return [...baseStyle, styles.glassCard];
      case 'gradient':
        return [...baseStyle, styles.gradientCard];
      case 'elevated':
        return [...baseStyle, styles.elevatedCard];
      default:
        return [...baseStyle, styles.defaultCard];
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        getCardStyle(),
        glow && styles.glowEffect,
        disabled && styles.disabled,
        { transform: [{ scale: animatedValue }] },
        style,
      ]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </Animated.View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
        style={styles.touchable}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  small: {
    padding: 16,
    borderRadius: 16,
  },
  medium: {
    padding: 20,
    borderRadius: 20,
  },
  large: {
    padding: 24,
    borderRadius: 24,
  },
  defaultCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  gradientCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  elevatedCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: 20,
    padding: 0,
  },
  glowEffect: {
    shadowColor: Colors.primary[400],
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  disabled: {
    opacity: 0.6,
  },
}); 