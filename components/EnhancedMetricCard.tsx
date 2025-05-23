import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ModernCard from './ModernCard';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'normal' | 'warning' | 'critical' | 'good';
  variant?: 'default' | 'circular' | 'gradient' | 'minimal';
  onPress?: () => void;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export default function EnhancedMetricCard({
  title,
  value,
  unit,
  subtitle,
  percentage,
  trend,
  trendValue,
  status = 'normal',
  variant = 'default',
  onPress,
  icon,
  size = 'medium'
}: EnhancedMetricCardProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: percentage || 0,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();
  }, [percentage]);

  const getStatusColor = () => {
    switch (status) {
      case 'good': return Colors.status.success;
      case 'warning': return Colors.status.warning;
      case 'critical': return Colors.status.error;
      default: return Colors.primary[500];
    }
  };

  const getTrendIcon = () => {
    const iconSize = size === 'small' ? 14 : 16;
    const color = trend === 'up' ? Colors.status.success : 
                  trend === 'down' ? Colors.status.error : Colors.neutral[500];

    switch (trend) {
      case 'up': return <TrendingUp size={iconSize} color={color} />;
      case 'down': return <TrendingDown size={iconSize} color={color} />;
      default: return <Minus size={iconSize} color={color} />;
    }
  };

  const renderCircularProgress = () => {
    if (!percentage) return null;

    const size = 80;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    
    // For now, we'll use a simple animated view instead of SVG for React Native compatibility
    return (
      <View style={styles.circularContainer}>
        <View style={[styles.circularBackground, { width: size, height: size, borderRadius: size / 2 }]}>
          <Animated.View
            style={[
              styles.circularProgress,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: getStatusColor(),
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.circularCenter}>
          <Text style={styles.circularValue}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (variant === 'circular') {
      return (
        <View style={styles.circularLayout}>
          {renderCircularProgress()}
          <View style={styles.circularInfo}>
            <Text style={[styles.title, styles[`${size}Title`]]}>{title}</Text>
            <Text style={[styles.value, styles[`${size}Value`]]}>{value}{unit && ` ${unit}`}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      );
    }

    if (variant === 'minimal') {
      return (
        <View style={styles.minimalLayout}>
          <View style={styles.minimalHeader}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.title, styles[`${size}Title`]]}>{title}</Text>
          </View>
          <Text style={[styles.value, styles[`${size}Value`]]}>{value}{unit && <Text style={styles.unit}>{unit}</Text>}</Text>
          {percentage !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                      backgroundColor: getStatusColor(),
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.title, styles[`${size}Title`]]}>{title}</Text>
                         {status === 'warning' && (
               <AlertTriangle size={16} color={Colors.status.warning} />
             )}
          </View>
          {(trend || trendValue) && (
            <View style={styles.trendContainer}>
              {getTrendIcon()}
              {trendValue && <Text style={styles.trendValue}>{trendValue}</Text>}
            </View>
          )}
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={[styles.value, styles[`${size}Value`]]}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
        
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        
                 {percentage !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: getStatusColor(),
                  },
                ]}
              />
            </View>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        )}
      </View>
    );
  };

  const getCardVariant = () => {
    if (variant === 'gradient') return 'gradient';
    if (status === 'critical') return 'elevated';
    return 'default';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <ModernCard
        variant={getCardVariant()}
        size={size}
        onPress={onPress}
        glow={status === 'critical'}
      >
        {variant === 'gradient' && (
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.95)',
              'rgba(248, 250, 252, 0.9)',
            ]}
            style={styles.gradientOverlay}
          >
            {renderContent()}
          </LinearGradient>
        )}
        {variant !== 'gradient' && renderContent()}
      </ModernCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    color: Colors.neutral[600],
    letterSpacing: 0.2,
  },
  smallTitle: {
    fontSize: 13,
  },
  mediumTitle: {
    fontSize: 14,
  },
  largeTitle: {
    fontSize: 16,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    marginLeft: 4,
    color: Colors.neutral[600],
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Poppins-Bold',
    color: Colors.neutral[900],
    letterSpacing: -0.5,
  },
  smallValue: {
    fontSize: 24,
  },
  mediumValue: {
    fontSize: 28,
  },
  largeValue: {
    fontSize: 36,
  },
  unit: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  percentageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.neutral[600],
    minWidth: 35,
    textAlign: 'right',
  },
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  circularProgress: {
    position: 'absolute',
    borderWidth: 8,
    backgroundColor: 'transparent',
  },
  circularCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  circularLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularInfo: {
    flex: 1,
    marginLeft: 20,
  },
  minimalLayout: {
    alignItems: 'flex-start',
  },
  minimalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: 20,
  },
}); 