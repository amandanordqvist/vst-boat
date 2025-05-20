import { Tabs, Redirect } from 'expo-router';
import { Platform, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ship, CheckSquare, Wrench, MapPin, Fuel } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/hooks/useAuth';

// Extend the options type to include the href property
interface ExtendedTabOptions {
  href?: null;
  title?: string;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
}

// Define which tabs should be visible in the tab bar
const VISIBLE_TABS = ['index', 'checklists', 'location', 'maintenance', 'fuel'];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const { isAuthenticated, isLoading } = useAuth();
  
  // If not loading and not authenticated, redirect to auth
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/auth" />;
  }
  
  // Custom tab bar component for active indicators
  const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    // Filter only visible routes based on our VISIBLE_TABS list
    const visibleRoutes = state.routes.filter(route => VISIBLE_TABS.includes(route.name));
    
    return (
      <View style={[styles.tabBar, { paddingBottom: isIOS ? insets.bottom : 18 }]}>
        {isIOS && (
          <View style={styles.tabBarBackground}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgb(255, 255, 255)']}
              style={{ flex: 1 }}
            />
          </View>
        )}
        
        {visibleRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          // Cast options to our extended type
          const extendedOptions = options as unknown as ExtendedTabOptions;
          
          // Find the actual index in the original state.routes array
          const actualIndex = state.routes.findIndex(r => r.key === route.key);
          const isFocused = state.index === actualIndex;
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          
          return (
            <View key={route.key} style={styles.tabItem}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={extendedOptions.tabBarAccessibilityLabel}
                testID={extendedOptions.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive
                ]}
              >
                {extendedOptions.tabBarIcon && extendedOptions.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? Colors.primary[700] : Colors.neutral[500],
                  size: 24
                })}
                <Text style={[
                  styles.tabLabel,
                  isFocused ? styles.activeTabLabel : styles.inactiveTabLabel
                ]}>
                  {extendedOptions.title || route.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };
  
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ship strokeWidth={2} size={focused ? size + 2 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: 'Checklists',
          tabBarIcon: ({ color, size, focused }) => (
            <CheckSquare strokeWidth={2} size={focused ? size + 2 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: 'Location',
          tabBarIcon: ({ color, size, focused }) => (
            <MapPin strokeWidth={2} size={focused ? size + 2 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Service',
          tabBarIcon: ({ color, size, focused }) => (
            <Wrench strokeWidth={2} size={focused ? size + 2 : size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
          tabBarIcon: ({ color, size, focused }) => (
            <Fuel strokeWidth={2} size={focused ? size + 2 : size} color={color} />
          ),
        }}
      />
      
      {/* Hidden screens that are accessible from other navigation methods */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="vessel"
        options={{
          title: 'Vessel',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="voyage"
        options={{
          title: 'Voyage',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 16 : 0,
    left: Platform.OS === 'ios' ? 16 : 0,
    right: Platform.OS === 'ios' ? 16 : 0,
    height: Platform.OS === 'ios' ? 66 : 50,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 0.97)',
    flexDirection: 'row',
    borderRadius: Platform.OS === 'ios' ? 28 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 10,
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
    borderTopColor: Platform.OS === 'ios' ? 'transparent' : 'rgb(255, 255, 255)',
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    width: '100%',
  },
  tabButtonActive: {
    backgroundColor: `${Colors.primary[100]}`,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontWeight: '400',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: Colors.primary[700],
    fontSize: 10,
  },
  inactiveTabLabel: {
    color: Colors.neutral[500],
    fontSize: 10,
  }
});