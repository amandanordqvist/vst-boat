import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Check,
  X
} from 'lucide-react-native';

interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  isVisible: boolean;
  order: number;
  userRole: string[];
}

interface DashboardCustomizationProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (widgets: DashboardWidget[]) => void;
  currentRole: string;
}

export default function DashboardCustomization({ 
  isVisible, 
  onClose, 
  onSave, 
  currentRole 
}: DashboardCustomizationProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'smart-notifications',
      name: 'Smart Alerts',
      description: 'AI-powered contextual notifications',
      isVisible: true,
      order: 1,
      userRole: ['owner', 'captain', 'crew']
    },
    {
      id: 'emergency-dashboard',
      name: 'Emergency Controls',
      description: 'Quick access to safety features',
      isVisible: true,
      order: 2,
      userRole: ['owner', 'captain', 'crew']
    },
    {
      id: 'vessel-summary',
      name: 'Vessel Overview',
      description: 'Current status and next trip info',
      isVisible: true,
      order: 3,
      userRole: ['owner', 'captain', 'crew']
    },
    {
      id: 'live-status',
      name: 'Live Systems Status',
      description: 'Real-time vessel data and sensors',
      isVisible: true,
      order: 4,
      userRole: ['owner', 'captain', 'engineer']
    },
    {
      id: 'performance-metrics',
      name: 'Performance Analytics',
      description: 'Fuel efficiency and engine metrics',
      isVisible: true,
      order: 5,
      userRole: ['owner', 'captain']
    },
    {
      id: 'weather',
      name: 'Weather Information',
      description: 'Current conditions and forecast',
      isVisible: true,
      order: 6,
      userRole: ['owner', 'captain', 'crew']
    },
    {
      id: 'maintenance',
      name: 'Maintenance Status',
      description: 'Service schedules and alerts',
      isVisible: true,
      order: 7,
      userRole: ['owner', 'captain', 'maintenance']
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Important vessel documentation',
      isVisible: true,
      order: 8,
      userRole: ['owner', 'captain']
    },
    {
      id: 'recent-activity',
      name: 'Recent Activity',
      description: 'Latest actions and updates',
      isVisible: true,
      order: 9,
      userRole: ['owner', 'captain', 'crew']
    }
  ]);

  if (!isVisible) return null;

  const availableWidgets = widgets.filter(widget => 
    widget.userRole.includes(currentRole)
  ).sort((a, b) => a.order - b.order);

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id 
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    ));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets(prev => {
      const sortedWidgets = [...prev].sort((a, b) => a.order - b.order);
      const index = sortedWidgets.findIndex(w => w.id === id);
      
      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === sortedWidgets.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = sortedWidgets[index].order;
      sortedWidgets[index].order = sortedWidgets[newIndex].order;
      sortedWidgets[newIndex].order = temp;

      return sortedWidgets;
    });
  };

  const resetToDefaults = () => {
    setWidgets(prev => prev.map((widget, index) => ({
      ...widget,
      isVisible: true,
      order: index + 1
    })));
  };

  const handleSave = () => {
    onSave(widgets);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Settings size={20} color={Colors.primary[700]} />
            <Text style={styles.title}>Customize Dashboard</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={20} color={Colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Personalize your dashboard by toggling widgets and reordering them to fit your workflow
        </Text>

        <ScrollView style={styles.widgetsList}>
          {availableWidgets.map((widget, index) => (
            <View key={widget.id} style={styles.widgetItem}>
              <View style={styles.widgetInfo}>
                <View style={styles.widgetHeader}>
                  <Text style={styles.widgetName}>{widget.name}</Text>
                  <Switch
                    value={widget.isVisible}
                    onValueChange={() => toggleWidgetVisibility(widget.id)}
                    trackColor={{ 
                      false: Colors.neutral[300], 
                      true: Colors.primary[200] 
                    }}
                    thumbColor={
                      widget.isVisible ? Colors.primary[600] : Colors.neutral[500]
                    }
                  />
                </View>
                <Text style={styles.widgetDescription}>{widget.description}</Text>
              </View>
              
              <View style={styles.widgetControls}>
                <TouchableOpacity 
                  style={[
                    styles.controlButton,
                    index === 0 && styles.controlButtonDisabled
                  ]}
                  onPress={() => moveWidget(widget.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp 
                    size={16} 
                    color={index === 0 ? Colors.neutral[400] : Colors.primary[600]} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.controlButton,
                    index === availableWidgets.length - 1 && styles.controlButtonDisabled
                  ]}
                  onPress={() => moveWidget(widget.id, 'down')}
                  disabled={index === availableWidgets.length - 1}
                >
                  <ArrowDown 
                    size={16} 
                    color={
                      index === availableWidgets.length - 1 
                        ? Colors.neutral[400] 
                        : Colors.primary[600]
                    } 
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetToDefaults}
          >
            <RotateCcw size={16} color={Colors.neutral[600]} />
            <Text style={styles.resetText}>Reset to Default</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 20,
    lineHeight: 20,
  },
  widgetsList: {
    maxHeight: 400,
  },
  widgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  widgetInfo: {
    flex: 1,
    marginRight: 12,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  widgetName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
    flex: 1,
  },
  widgetDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    lineHeight: 16,
  },
  widgetControls: {
    flexDirection: 'column',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
  },
  resetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
}); 