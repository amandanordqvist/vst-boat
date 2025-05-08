import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  const handleLogout = () => {
    console.log('Logout pressed');
  };
  
  const menuItems: MenuItem[] = [
    {
      id: 'settings',
      icon: <Settings size={24} color={Colors.neutral[700]} />,
      title: 'Account Settings',
      subtitle: 'Manage your account details',
      action: () => console.log('Settings pressed'),
    },
    {
      id: 'notifications',
      icon: <Bell size={24} color={Colors.neutral[700]} />,
      title: 'Notifications',
      subtitle: 'Configure your notifications',
      action: () => console.log('Notifications pressed'),
    },
    {
      id: 'security',
      icon: <Shield size={24} color={Colors.neutral[700]} />,
      title: 'Security',
      subtitle: 'Manage your security settings',
      action: () => console.log('Security pressed'),
    },
    {
      id: 'payment',
      icon: <CreditCard size={24} color={Colors.neutral[700]} />,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      action: () => console.log('Payment pressed'),
    },
    {
      id: 'help',
      icon: <HelpCircle size={24} color={Colors.neutral[700]} />,
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      action: () => console.log('Help pressed'),
    },
  ];
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>CM</Text>
          </View>
          <Text style={styles.name}>Captain Mike</Text>
          <Text style={styles.email}>captain@example.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={24} color={Colors.status.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.primary[500],
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  menuSection: {
    backgroundColor: Colors.background,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  menuSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    marginTop: 16,
    padding: 16,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.status.error,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 16,
    marginBottom: 32,
  },
});