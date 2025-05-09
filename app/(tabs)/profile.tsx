import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, Ship, Bell, Shield, LifeBuoy, LogOut, ChevronRight, Anchor } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

// Sample vessels data
const vessels = [
  {
    id: '1',
    name: 'Sea Breeze',
    type: 'Yacht',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
  },
  {
    id: '2',
    name: 'Ocean Explorer',
    type: 'Speedboat',
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
  }
];

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingItem = ({ 
  icon, 
  title, 
  value, 
  isSwitch = false, 
  switchValue = false, 
  onToggle, 
  onPress 
}: SettingItemProps) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
    disabled={isSwitch}
  >
    <View style={styles.settingIconContainer}>
      {icon}
    </View>
    
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.neutral[300], true: Colors.primary[600] }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={styles.settingValueContainer}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          <ChevronRight size={20} color={Colors.neutral[400]} />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = React.useState(true);
  const [locationSharing, setLocationSharing] = React.useState(false);
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 + (Platform.OS !== 'web' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.profileBadge}>
              <Anchor size={12} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Captain Mike Johnson</Text>
            <Text style={styles.profileEmail}>mike.johnson@example.com</Text>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => router.push('/profile-creation')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* My Vessels */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vessels</Text>
            <TouchableOpacity style={styles.addVesselButton}>
              <Text style={styles.addVesselText}>Add Vessel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.vesselsContainer}>
            {vessels.map(vessel => (
              <TouchableOpacity key={vessel.id} style={styles.vesselCard}>
                <Image 
                  source={{ uri: vessel.image }} 
                  style={styles.vesselImage} 
                />
                <View style={styles.vesselOverlay} />
                <View style={styles.vesselInfo}>
                  <Text style={styles.vesselName}>{vessel.name}</Text>
                  <Text style={styles.vesselType}>{vessel.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsCard}>
            <SettingItem 
              icon={<User size={20} color={Colors.primary[700]} />}
              title="Personal Information"
              onPress={() => router.push('/profile-creation')}
            />
            <SettingItem 
              icon={<Ship size={20} color={Colors.primary[700]} />}
              title="Vessel Documents"
              onPress={() => console.log('Vessel Documents pressed')}
            />
            <SettingItem 
              icon={<Settings size={20} color={Colors.primary[700]} />}
              title="Preferences"
              onPress={() => console.log('Preferences pressed')}
            />
          </View>
        </View>
        
        {/* Notification Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsCard}>
            <SettingItem 
              icon={<Bell size={20} color={Colors.primary[700]} />}
              title="Push Notifications"
              isSwitch
              switchValue={notifications}
              onToggle={setNotifications}
            />
            <SettingItem 
              icon={<Shield size={20} color={Colors.primary[700]} />}
              title="Share Location"
              isSwitch
              switchValue={locationSharing}
              onToggle={setLocationSharing}
            />
          </View>
        </View>
        
        {/* Support & Others */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            <SettingItem 
              icon={<LifeBuoy size={20} color={Colors.primary[700]} />}
              title="Help Center"
              onPress={() => console.log('Help Center pressed')}
            />
            <SettingItem 
              icon={<LogOut size={20} color={Colors.status.error} />}
              title="Log Out"
              onPress={handleLogout}
            />
          </View>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary[700],
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 12,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary[200],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editProfileText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary[700],
    marginBottom: 12,
  },
  addVesselButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addVesselText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  vesselsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vesselCard: {
    width: '48%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  vesselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  vesselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  vesselInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  vesselName: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vesselType: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  settingsCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary[200],
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[500],
    marginRight: 8,
  },
  versionText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: 16,
  },
});