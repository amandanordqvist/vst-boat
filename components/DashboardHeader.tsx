import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, Search, ChevronDown, MapPin, ChevronLeft, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import useProfileNavigation from '@/hooks/useProfileNavigation';
import { EnhancedNotificationCenter } from '@/components/EnhancedNotificationCenter';

interface DashboardHeaderProps {
  username?: string;
  notifications?: number;
  vesselName?: string;
  vesselStatus?: string;
  vesselLocation?: string;
  title?: string;
  showBackButton?: boolean;
}

// Consistent design values
const BORDER_RADIUS = 20;
const ICON_SIZE = 22;

export default function DashboardHeader({ 
  username, 
  notifications, 
  vesselName = 'Sea Breeze', 
  vesselStatus = 'Docked', 
  vesselLocation = 'Marina Bay',
  title,
  showBackButton = false
}: DashboardHeaderProps) {
  const isWeb = Platform.OS === 'web';
  const { navigateToProfile } = useProfileNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const handleVesselPress = () => {
    router.push('/(tabs)/vessel');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleNotificationPress = () => {
    setShowNotifications(true);
  };
  
  // If we have a title, show simplified header
  if (title) {
    return (
      <View style={styles.simplifiedContainer}>
        <View style={styles.simplifiedHeader}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={24} color={Colors.neutral[800]} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={showBackButton ? { width: 24 } : undefined} />
        </View>
      </View>
    );
  }
  
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
                style={styles.avatarContainer}
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
                <Search color="#fff" size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrapper} onPress={handleNotificationPress}>
                <Bell color="#fff" size={20} />
                {notifications && notifications > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.vesselSelectorWrapper}>
            <View style={styles.vesselSelector}>
              <View style={styles.vesselInfo}>
                <TouchableOpacity 
                  style={styles.vesselNameContainer}
                  onPress={handleVesselPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.vesselName}>{vesselName}</Text>
                  <ChevronDown size={14} color="rgba(255, 255, 255, 0.7)" style={styles.dropdownIcon} />
                </TouchableOpacity>
                {vesselLocation && (
                  <View style={styles.locationContainer}>
                    <MapPin size={12} color="rgba(255, 255, 255, 0.6)" />
                    <Text style={styles.locationText}>{vesselLocation}</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={handleVesselPress}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsText}>Details</Text>
                <ChevronRight size={14} color="rgba(255, 255, 255, 0.7)" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      <View style={styles.bottomCurve} />
      
      {/* Notification Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotifications(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowNotifications(false)}
              activeOpacity={0.7}
            >
              <X size={24} color={Colors.neutral[600]} />
            </TouchableOpacity>
          </View>
          <EnhancedNotificationCenter 
            onNotificationPress={(notification) => {
              // Close modal when notification is pressed for better UX
              setShowNotifications(false);
              console.log('Notification pressed:', notification);
            }}
          />
        </SafeAreaView>
      </Modal>
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
    paddingTop: 12,
    paddingBottom: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userInfo: {
    flexDirection: 'column',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '400',
  },
  username: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontWeight: '600',
  },
  vesselSelectorWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginTop: 8,
  },
  vesselSelector: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  vesselInfo: {
    flexDirection: 'column',
  },
  vesselNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginLeft: 6,
  },
  vesselName: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontWeight: '500',
    marginRight: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 10,
  },
  bottomCurve: {
    height: 12,
    backgroundColor: Colors.secondary[100],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
    zIndex: 1,
  },
  simplifiedContainer: {
    width: '100%',
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  simplifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
  },
  closeButton: {
    padding: 4,
  },
});