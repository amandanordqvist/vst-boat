import { useCallback } from 'react';
import { router } from 'expo-router';

/**
 * Custom hook for profile navigation
 * This centralizes the logic for navigating to the profile screen
 */
export default function useProfileNavigation() {
  const navigateToProfile = useCallback(() => {
    router.push('/(tabs)/profile');
  }, []);

  return {
    navigateToProfile,
  };
} 