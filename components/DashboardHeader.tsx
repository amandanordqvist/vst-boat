import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import VesselSelector from './VesselSelector';

interface DashboardHeaderProps {
  username: string;
  notifications: number;
}

export default function DashboardHeader({ username, notifications }: DashboardHeaderProps) {
  const isWeb = Platform.OS === 'web';
  
  return (
    <LinearGradient
      colors={[Colors.primary[700], Colors.primary[500]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Heart color="#fff" size={22} />
            </View>
            <View style={styles.iconWrapper}>
              <MessageCircle color="#fff" size={22} />
            </View>
            <View style={styles.notificationWrapper}>
              <Bell color="#fff" size={22} />
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notifications}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        
        {isWeb ? (
          <View style={styles.selectorContainer}>
            <VesselSelector />
          </View>
        ) : (
          <BlurView intensity={20} tint="light" style={styles.selectorContainer}>
            <VesselSelector />
          </BlurView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: Platform.OS === 'web' ? 16 : 0,
  },
  safeArea: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'column',
  },
  greeting: {
    color: Colors.primary[100],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  username: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: Colors.status.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  selectorContainer: {
    marginHorizontal: 16,
    marginBottom: -24,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1,
  },
});