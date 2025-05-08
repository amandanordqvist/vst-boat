import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Bell, Anchor, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import useProfileNavigation from '@/hooks/useProfileNavigation';

interface DashboardHeaderProps {
  username: string;
  notifications: number;
  vesselName?: string;
  vesselStatus?: string;
  vesselLocation?: string;
}

export default function DashboardHeader({ 
  username, 
  notifications, 
  vesselName = 'Sea Breeze', 
  vesselStatus = 'Docked', 
  vesselLocation = 'Marina Bay' 
}: DashboardHeaderProps) {
  const isWeb = Platform.OS === 'web';
  const { navigateToProfile } = useProfileNavigation();
  
  const handleVesselPress = () => {
    router.push('/(tabs)/vessel');
  };
  
  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#0A3355', '#1A5F9C', '#3D7AB3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <View style={styles.userInfoContainer}>
              <TouchableOpacity 
                onPress={navigateToProfile}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>{username}</Text>
              </View>
            </View>
            
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconWrapper}>
                <MessageCircle color="#fff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationWrapper}>
                <Bell color="#fff" size={22} />
                {notifications > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.vesselStripContainer} 
            onPress={handleVesselPress}
            activeOpacity={0.8}
          >
            <View style={styles.vesselStripContent}>
              <View style={styles.vesselIcon}>
                <Anchor size={16} color="#FFF" />
              </View>
              <Text style={styles.vesselText}>
                {vesselName} • {vesselStatus} at {vesselLocation}
              </Text>
              <View style={styles.chevronContainer}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <ChevronRight size={16} color="#FFF" style={styles.chevron} />
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  userInfo: {
    flexDirection: 'column',
  },
  greeting: {
    color: '#E5F2FF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '400',
  },
  username: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20,
    fontWeight: '600',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontWeight: '600',
  },
  vesselStripContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  vesselStripContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  vesselIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  vesselText: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontWeight: '500',
    marginRight: 4,
  },
  chevron: {
    opacity: 0.8,
  },
});