import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Notification {
  id: string;
  type: 'weather' | 'maintenance' | 'fuel' | 'safety' | 'document' | 'location' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = lowest, 5 = highest
  isRead: boolean;
  isDismissible: boolean;
  actionLabel?: string;
  actionRoute?: string;
  smartBadge?: boolean;
}

interface NotificationSettings {
  weather: boolean;
  maintenance: boolean;
  fuel: boolean;
  safety: boolean;
  document: boolean;
  location: boolean;
  system: boolean;
  quietHours: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

interface EnhancedNotificationCenterProps {
  onNotificationPress?: (notification: Notification) => void;
  onSettingsPress?: () => void;
}

export const EnhancedNotificationCenter: React.FC<EnhancedNotificationCenterProps> = ({
  onNotificationPress,
  onSettingsPress
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    weather: true,
    maintenance: true,
    fuel: true,
    safety: true,
    document: true,
    location: true,
    system: true,
    quietHours: false,
    pushEnabled: true,
    emailEnabled: false,
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Mock notifications for design prototype
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'weather',
        title: 'Weather Warning',
        message: 'Vindvarning för i morgon: Vindstyrka 8-10 m/s från sydväst. Rekommenderar att stanna i hamn.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        priority: 5,
        isRead: false,
        isDismissible: true,
        actionLabel: 'View Weather',
        smartBadge: true
      },
      {
        id: '2',
        type: 'maintenance',
        title: 'Service Påminnelse',
        message: 'Motorservice förfaller om 2 veckor. Boka tid hos din serviceverkstad.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 3,
        isRead: false,
        isDismissible: true,
        actionLabel: 'Boka service',
        smartBadge: true
      },
      {
        id: '3',
        type: 'safety',
            title: 'Safety Check',
    message: 'Your emergency flares expire in 3 months. Order new ones to ensure safety.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 4,
        isRead: true,
        isDismissible: true,
        actionLabel: 'Beställ bloss'
      },
      {
        id: '4',
        type: 'fuel',
            title: 'Low Fuel Level',
    message: 'Fuel tank is 15% full. Plan refueling before next trip.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 2,
        isRead: true,
        isDismissible: true,
        actionLabel: 'Hitta mackar'
      },
      {
        id: '5',
        type: 'document',
        title: 'Försäkring Förnyelse',
        message: 'Din båtförsäkring förfaller om 30 dagar. Kontakta din försäkringsgivare.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        priority: 3,
        isRead: false,
        isDismissible: true,
        actionLabel: 'Ring försäkring',
        smartBadge: true
      },
      {
        id: '6',
        type: 'location',
        title: 'Anchor Watch',
        message: 'Boat has moved 25 meters from anchor position. Check anchor.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        priority: 5,
        isRead: true,
        isDismissible: false,
        actionLabel: 'Visa karta'
      },
      {
        id: '7',
        type: 'system',
        title: 'App Uppdatering',
        message: 'Ny version av VST Boat tillgänglig med förbättrade kartor och prestanda.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        priority: 1,
        isRead: true,
        isDismissible: true,
        actionLabel: 'Uppdatera'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'weather': return 'cloud';
      case 'maintenance': return 'construct';
      case 'fuel': return 'water';
      case 'safety': return 'shield-checkmark';
      case 'document': return 'document-text';
      case 'location': return 'location';
      case 'system': return 'settings';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string, priority: number): string => {
    if (priority >= 4) return '#FF3B30';
    switch (type) {
      case 'weather': return '#007AFF';
      case 'maintenance': return '#FF9500';
      case 'fuel': return '#34C759';
      case 'safety': return '#FF3B30';
      case 'document': return '#5856D6';
      case 'location': return '#007AFF';
      case 'system': return '#8E8E93';
      default: return '#007AFF';
    }
  };

  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 5: return 'KRITISK';
      case 4: return 'HÖG';
      case 3: return 'MEDIUM';
      case 2: return 'LÅG';
      case 1: return 'INFO';
      default: return '';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just nu';
    if (diffMins < 60) return `${diffMins}m sedan`;
    if (diffHours < 24) return `${diffHours}t sedan`;
    return `${diffDays}d sedan`;
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    if (onNotificationPress) {
      onNotificationPress(notification);
    }
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getFilteredNotifications = (): Notification[] => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.isRead);
        break;
      case 'high':
        filtered = notifications.filter(n => n.priority >= 4);
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => {
      // Sort by priority first, then by timestamp
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  const getUnreadCount = (): number => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getHighPriorityCount = (): number => {
    return notifications.filter(n => n.priority >= 4 && !n.isRead).length;
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notifikationer</Text>
        <View style={styles.headerActions}>
          {getUnreadCount() > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{getUnreadCount()}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity 
          onPress={() => setFilter('all')}
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Alla ({notifications.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setFilter('unread')}
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Olästa ({getUnreadCount()})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setFilter('high')}
          style={[styles.filterTab, filter === 'high' && styles.activeFilterTab]}
        >
          <Text style={[styles.filterText, filter === 'high' && styles.activeFilterText]}>
            Viktiga ({getHighPriorityCount()})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {getFilteredNotifications().map(notification => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => handleNotificationPress(notification)}
            style={[
              styles.notificationCard,
              !notification.isRead && styles.unreadCard,
              notification.priority >= 4 && styles.highPriorityCard
            ]}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationLeft}>
                <View style={[
                  styles.iconContainer, 
                  { backgroundColor: getNotificationColor(notification.type, notification.priority) }
                ]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={20} 
                    color="#fff" 
                  />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadTitle]}>
                      {notification.title}
                    </Text>
                    {notification.smartBadge && (
                      <View style={styles.smartBadge}>
                        <Text style={styles.smartBadgeText}>Smart</Text>
                      </View>
                    )}
                    {notification.priority >= 4 && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityText}>{getPriorityLabel(notification.priority)}</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  
                  <View style={styles.notificationFooter}>
                    <Text style={styles.timestamp}>{formatTimestamp(notification.timestamp)}</Text>
                    {notification.actionLabel && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>{notification.actionLabel}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              
              {notification.isDismissible && (
                <TouchableOpacity 
                  onPress={() => handleDismiss(notification.id)}
                  style={styles.dismissButton}
                >
                  <Ionicons name="close" size={20} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
        
        {getFilteredNotifications().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Inga notifikationer</Text>
            <Text style={styles.emptyMessage}>
              {filter === 'unread' ? 'Alla notifikationer är lästa' : 'Du har inga notifikationer just nu'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.settingsContainer}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Notifikationsinställningar</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.doneText}>Klar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Notifikationstyper</Text>
              
              {Object.entries(settings).slice(0, 7).map(([key, value]) => (
                <View key={key} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons 
                      name={getNotificationIcon(key)} 
                      size={20} 
                      color="#666" 
                    />
                    <Text style={styles.settingLabel}>
                                              {key === 'weather' && 'Weather'}
                        {key === 'maintenance' && 'Maintenance'}
                        {key === 'fuel' && 'Fuel'}
                        {key === 'safety' && 'Safety'}
                        {key === 'document' && 'Documents'}
                        {key === 'location' && 'Location'}
                      {key === 'system' && 'System'}
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={() => toggleSetting(key as keyof NotificationSettings)}
                    trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
                    thumbColor={value ? '#fff' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Allmänt</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="moon" size={20} color="#666" />
                  <Text style={styles.settingLabel}>Tystnad 22:00-07:00</Text>
                </View>
                <Switch
                  value={settings.quietHours}
                  onValueChange={() => toggleSetting('quietHours')}
                  trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
                  thumbColor={settings.quietHours ? '#fff' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="phone-portrait" size={20} color="#666" />
                  <Text style={styles.settingLabel}>Push-notifikationer</Text>
                </View>
                <Switch
                  value={settings.pushEnabled}
                  onValueChange={() => toggleSetting('pushEnabled')}
                  trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
                  thumbColor={settings.pushEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="mail" size={20} color="#666" />
                  <Text style={styles.settingLabel}>E-post notifikationer</Text>
                </View>
                <Switch
                  value={settings.emailEnabled}
                  onValueChange={() => toggleSetting('emailEnabled')}
                  trackColor={{ false: '#e1e5e9', true: '#007AFF' }}
                  thumbColor={settings.emailEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f3f4',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftColor: '#007AFF',
    backgroundColor: '#f8fbff',
  },
  highPriorityCard: {
    borderLeftColor: '#FF3B30',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  smartBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  smartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priorityBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1d1d1f',
  },
}); 