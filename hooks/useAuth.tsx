import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User role types
export type UserRole = 'owner' | 'captain' | 'crew';

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  boats: string[]; // Array of boat IDs the user has access to
}

// Authentication context interface
interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendVerificationCode: (phone: string) => Promise<boolean>;
  verifyPhoneAndLogin: (phone: string, code: string, name?: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  associateBoat: (boatId: string) => Promise<boolean>;
  updateRole: (userId: string, newRole: UserRole) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a mock database of users
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Owner',
    phone: '+46701234567',
    role: 'owner' as UserRole,
    verified: true,
    boats: ['boat1', 'boat2'],
  },
  {
    id: '2',
    name: 'Sarah Captain',
    phone: '+46701234568',
    role: 'captain' as UserRole,
    verified: true,
    boats: ['boat1'],
  },
  {
    id: '3',
    name: 'Mike Crew',
    phone: '+46701234569',
    role: 'crew' as UserRole,
    verified: true,
    boats: ['boat1'],
  },
];

// Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  
  // Check for existing session on load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Send verification code
  const sendVerificationCode = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the phone number for verification later
      setPendingPhone(phone);
      
      // In a real app, you would send an SMS with a verification code
      console.log(`Sending verification code to ${phone}`);
      
      return true;
    } catch (error) {
      console.error('Verification code error', error);
      Alert.alert('Error', 'Could not send verification code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify phone number and login/register
  const verifyPhoneAndLogin = async (
    phone: string, 
    code: string, 
    name?: string,
    role?: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate verification code - in a real app, this would verify with backend
      // Here we just accept any code with 6 digits
      if (code.length !== 6 || !/^\d+$/.test(code)) {
        Alert.alert('Verification Failed', 'Invalid verification code');
        return false;
      }
      
      // Find existing user by phone number
      const existingUser = MOCK_USERS.find(u => u.phone === phone);
      
      if (existingUser) {
        // Login existing user
        setUser(existingUser);
        await AsyncStorage.setItem('user', JSON.stringify(existingUser));
        return true;
      } else if (name && role) {
        // Register new user
        const newUser = {
          id: `user${MOCK_USERS.length + 1}`,
          name,
          phone,
          role,
          verified: true,
          boats: [],
        };
        
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        return true;
      } else {
        Alert.alert('Error', 'Phone number not registered. Please provide name and role to register.');
        return false;
      }
    } catch (error) {
      console.error('Phone verification error', error);
      Alert.alert('Verification Error', 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Associate boat function
  const associateBoat = async (boatId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if the boat is already associated
      if (user.boats.includes(boatId)) {
        return true;
      }
      
      // Add the boat to the user's list
      const updatedUser = {
        ...user,
        boats: [...user.boats, boatId],
      };
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Boat association error', error);
      return false;
    }
  };
  
  // Update role function (for owners to change roles of others)
  const updateRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    // In a real app, this would make an API call to update the user's role
    try {
      // Check if the current user is an owner (only owners can update roles)
      if (user?.role !== 'owner') {
        Alert.alert('Permission Denied', 'Only owners can update user roles');
        return false;
      }
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return success (in a real app, this would update the database)
      return true;
    } catch (error) {
      console.error('Role update error', error);
      return false;
    }
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    sendVerificationCode,
    verifyPhoneAndLogin,
    logout,
    associateBoat,
    updateRole,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 