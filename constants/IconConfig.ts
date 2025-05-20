import Colors from './Colors';

/**
 * Standardized icon configuration for consistent styling across the app
 */
export const IconConfig = {
  size: {
    xs: 14,
    small: 16,
    medium: 24,
    large: 32
  },
  style: 'stroke', // All icons should use stroke style for consistency
  weight: 2,
  // Standardized color tokens for different states
  colors: {
    default: Colors.neutral[700],
    active: Colors.primary[600],
    inactive: Colors.neutral[400],
    critical: Colors.status.error,
    warning: Colors.status.warning,
    attention: Colors.accent[500],
    success: Colors.status.success,
    info: Colors.status.info
  }
};

/**
 * Helper function to get the appropriate status color based on status type
 */
export const getStatusColor = (status: 'critical' | 'warning' | 'attention' | 'success' | 'info' | 'default') => {
  switch(status) {
    case 'critical': return IconConfig.colors.critical;
    case 'warning': return IconConfig.colors.warning;
    case 'attention': return IconConfig.colors.attention;
    case 'success': return IconConfig.colors.success;
    case 'info': return IconConfig.colors.info;
    default: return IconConfig.colors.default;
  }
}; 