import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Chrome as Home, ClipboardCheck, Droplets, MapPin, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Platform.OS === 'web' ? Colors.neutral[200] : Colors.neutral[100],
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
        },
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home strokeWidth={1.5} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: 'Checklists',
          tabBarIcon: ({ color, size }) => <ClipboardCheck strokeWidth={1.5} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
          tabBarIcon: ({ color, size }) => <Droplets strokeWidth={1.5} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'Location',
          tabBarIcon: ({ color, size }) => <MapPin strokeWidth={1.5} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User strokeWidth={1.5} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}