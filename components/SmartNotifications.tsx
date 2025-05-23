import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MapPin, 
  Cloud, 
  Wrench,
  Fuel,
  Clock,
  X,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

export type NotificationType = 'critical' | 'warning' | 'info' | 'success';
export type NotificationCategory = 'weather' | 'maintenance' | 'location' | 'fuel' | 'safety' | 'system';

export interface SmartNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  isContextual: boolean;
  actionRoute?: string;
  actionText?: string;
  canDismiss: boolean;
  priority: number; // 1-5, 5 being highest
}

interface SmartNotificationsProps {
  maxVisible?: number;
  showDismissed?: boolean;
}

export default function SmartNotifications({ 
  maxVisible = 3, 
  showDismissed = false 
}: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: '1',
      type: 'critical',
      category: 'weather',
      title: 'Storm Warning',
      message: 'Severe weather approaching your current location. Consider seeking safe harbor.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      isContextual: true,
      actionRoute: '/(tabs)/weather',
      actionText: 'View Weather',
      canDismiss: false,
      priority: 5,
    },
    {
      id: '2',
      type: 'warning',
      category: 'fuel',
      title: 'Low Fuel Alert',
      message: 'Fuel level at 25%. Nearest marina is 8nm away.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isContextual: true,
      actionRoute: '/(tabs)/fuel',
      actionText: 'Find Fuel',
      canDismiss: true,
      priority: 4,
    },
    {
      id: '3',
      type: 'info',
      category: 'maintenance',
      title: 'Maintenance Reminder',
      message: 'Engine service is due in 5 days. Book your appointment now.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isContextual: false,
      actionRoute: '/(tabs)/maintenance',
      actionText: 'Schedule',
      canDismiss: true,
      priority: 2,
    },
    {
      id: '4',
      type: 'success',
      category: 'system',
      title: 'GPS Signal Strong',
      message: 'All navigation systems are functioning normally.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isContextual: false,
      canDismiss: true,
      priority: 1,
    },
  ]);

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const getNotificationIcon = (category: NotificationCategory, type: NotificationType) => {
    const iconSize = 16;
    const iconColor = '#FFFFFF';
    
    switch(category) {
      case 'weather': return <Cloud size={iconSize} color={iconColor} />;
      case 'maintenance': return <Wrench size={iconSize} color={iconColor} />;
      case 'location': return <MapPin size={iconSize} color={iconColor} />;
      case 'fuel': return <Fuel size={iconSize} color={iconColor} />;
      case 'safety': return <AlertTriangle size={iconSize} color={iconColor} />;
      default: return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch(type) {
      case 'critical': return Colors.status.error;
      case 'warning': return Colors.status.warning;
      case 'success': return Colors.status.success;
      default: return Colors.status.info;
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    const iconSize = 12;
    switch(type) {
      case 'critical': return <AlertTriangle size={iconSize} color={Colors.status.error} />;
      case 'warning': return <AlertTriangle size={iconSize} color={Colors.status.warning} />;
      case 'success': return <CheckCircle size={iconSize} color={Colors.status.success} />;
      default: return <Info size={iconSize} color={Colors.status.info} />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const dismissNotification = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  const handleNotificationAction = (notification: SmartNotification) => {
    if (notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  };

  const visibleNotifications = notifications
    .filter(n => showDismissed || !dismissedIds.includes(n.id))
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    })
    .slice(0, maxVisible);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={20} color={Colors.primary[700]} />
          <Text style={styles.title}>Smart Alerts</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{visibleNotifications.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {visibleNotifications.map((notification) => (
          <View 
            key={notification.id} 
            style={[
              styles.notificationCard,
              { borderLeftColor: getNotificationColor(notification.type) }
            ]}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationLeft}>
                <View style={[
                  styles.categoryIcon, 
                  { backgroundColor: getNotificationColor(notification.type) }
                ]}>
                  {getNotificationIcon(notification.category, notification.type)}
                </View>
                <View style={styles.notificationMeta}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                      {notification.title}
                    </Text>
                    {notification.isContextual && (
                      <View style={styles.contextualBadge}>
                        <Text style={styles.contextualText}>Smart</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.timestampRow}>
                    {getTypeIcon(notification.type)}
                    <Text style={styles.timestamp}>
                      {formatTimestamp(notification.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
              
              {notification.canDismiss && (
                <TouchableOpacity 
                  style={styles.dismissButton}
                  onPress={() => dismissNotification(notification.id)}
                >
                  <X size={16} color={Colors.neutral[500]} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>

            {notification.actionRoute && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleNotificationAction(notification)}
              >
                <Text style={styles.actionText}>
                  {notification.actionText || 'View Details'}
                </Text>
                <ChevronRight size={14} color={Colors.primary[600]} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primary[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  notificationCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
    flex: 1,
  },
  contextualBadge: {
    backgroundColor: Colors.accent[500],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  contextualText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 9,
    color: '#FFFFFF',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
  dismissButton: {
    padding: 4,
  },
  notificationMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.neutral[700],
    lineHeight: 18,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[600],
    marginRight: 4,
  },
}); 