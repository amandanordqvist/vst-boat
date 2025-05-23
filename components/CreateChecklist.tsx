import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert,
  Switch,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Plus, 
  X, 
  Save, 
  Calendar, 
  Clock, 
  Check, 
  AlertTriangle,
  Wrench,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Types from existing checklist system
type ChecklistType = 'pre-departure' | 'post-use' | 'maintenance' | 'seasonal';
type ItemCategory = 'safety' | 'engine' | 'exterior' | 'interior' | 'systems' | 'documentation';

interface ChecklistItem {
  id: string;
  category: ItemCategory;
  title: string;
  description?: string;
  isRequired: boolean;
  estimatedTime?: number; // minutes
}

interface ChecklistTemplate {
  id: string;
  name: string;
  type: ChecklistType;
  description: string;
  items: ChecklistItem[];
  isScheduled: boolean;
  scheduledDate?: string;
  createdBy: string;
  createdAt: Date;
}

interface CreateChecklistProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (checklist: ChecklistTemplate) => void;
  existingChecklist?: ChecklistTemplate; // For editing existing checklists
}

export default function CreateChecklist({ 
  isVisible, 
  onClose, 
  onSave, 
  existingChecklist 
}: CreateChecklistProps) {
  const insets = useSafeAreaInsets();
  
  // Form state
  const [checklistName, setChecklistName] = useState(existingChecklist?.name || '');
  const [checklistType, setChecklistType] = useState<ChecklistType>(existingChecklist?.type || 'pre-departure');
  const [description, setDescription] = useState(existingChecklist?.description || '');
  const [isScheduled, setIsScheduled] = useState(existingChecklist?.isScheduled || false);
  const [scheduledDate, setScheduledDate] = useState(existingChecklist?.scheduledDate || '');
  const [items, setItems] = useState<ChecklistItem[]>(existingChecklist?.items || []);
  
  // UI state
  const [expandedCategories, setExpandedCategories] = useState<Record<ItemCategory, boolean>>({
    safety: true,
    engine: false,
    exterior: false,
    interior: false,
    systems: false,
    documentation: false,
  });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Add item form state
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('safety');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemTime, setNewItemTime] = useState('');

  // Checklist types configuration
  const checklistTypes = [
    { 
      value: 'pre-departure', 
      label: 'Pre-Departure', 
      icon: <Calendar size={20} color={Colors.primary[700]} />,
      description: 'Before leaving the dock'
    },
    { 
      value: 'post-use', 
      label: 'Post-Use', 
      icon: <Check size={20} color={Colors.status.success} />,
      description: 'After returning to dock'
    },
    { 
      value: 'maintenance', 
      label: 'Maintenance', 
      icon: <Wrench size={20} color={Colors.status.info} />,
      description: 'Regular service and repairs'
    },
    { 
      value: 'seasonal', 
      label: 'Seasonal', 
      icon: <Clock size={20} color={Colors.accent[500]} />,
      description: 'Periodic seasonal tasks'
    },
  ];

  // Category configuration
  const categories = [
    { 
      value: 'safety', 
      label: 'Safety Equipment', 
      icon: <AlertTriangle size={16} color={Colors.status.warning} />,
      color: Colors.status.warning
    },
    { 
      value: 'engine', 
      label: 'Engine & Mechanical', 
      icon: <Wrench size={16} color={Colors.primary[500]} />,
      color: Colors.primary[500]
    },
    { 
      value: 'exterior', 
      label: 'Hull & Exterior', 
      icon: <Check size={16} color={Colors.primary[700]} />,
      color: Colors.primary[700]
    },
    { 
      value: 'interior', 
      label: 'Cabin & Interior', 
      icon: <Check size={16} color={Colors.accent[500]} />,
      color: Colors.accent[500]
    },
    { 
      value: 'systems', 
      label: 'Electrical & Systems', 
      icon: <Check size={16} color={Colors.status.info} />,
      color: Colors.status.info
    },
    { 
      value: 'documentation', 
      label: 'Documentation', 
      icon: <MessageCircle size={16} color={Colors.status.success} />,
      color: Colors.status.success
    },
  ];

  const resetForm = () => {
    setChecklistName('');
    setChecklistType('pre-departure');
    setDescription('');
    setIsScheduled(false);
    setScheduledDate('');
    setItems([]);
    setExpandedCategories({
      safety: true,
      engine: false,
      exterior: false,
      interior: false,
      systems: false,
      documentation: false,
    });
  };

  const resetAddItemForm = () => {
    setNewItemTitle('');
    setNewItemDescription('');
    setNewItemCategory('safety');
    setNewItemRequired(true);
    setNewItemTime('');
    setEditingItem(null);
  };

  const toggleCategory = (category: ItemCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const addOrUpdateItem = () => {
    if (!newItemTitle.trim()) {
      Alert.alert('Error', 'Item title is required');
      return;
    }

    const item: ChecklistItem = {
      id: editingItem?.id || `item_${Date.now()}`,
      category: newItemCategory,
      title: newItemTitle.trim(),
      description: newItemDescription.trim() || undefined,
      isRequired: newItemRequired,
      estimatedTime: newItemTime ? parseInt(newItemTime) : undefined,
    };

    if (editingItem) {
      // Update existing item
      setItems(prev => prev.map(i => i.id === editingItem.id ? item : i));
    } else {
      // Add new item
      setItems(prev => [...prev, item]);
    }

    resetAddItemForm();
    setShowAddItemModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const editItem = (item: ChecklistItem) => {
    setEditingItem(item);
    setNewItemTitle(item.title);
    setNewItemDescription(item.description || '');
    setNewItemCategory(item.category);
    setNewItemRequired(item.isRequired);
    setNewItemTime(item.estimatedTime?.toString() || '');
    setShowAddItemModal(true);
  };

  const deleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this checklist item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.filter(item => item.id !== itemId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const duplicateItem = (item: ChecklistItem) => {
    const newItem: ChecklistItem = {
      ...item,
      id: `item_${Date.now()}`,
      title: `${item.title} (Copy)`,
    };
    setItems(prev => [...prev, newItem]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const validateAndSave = () => {
    if (!checklistName.trim()) {
      Alert.alert('Error', 'Checklist name is required');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one checklist item');
      return;
    }

    const checklist: ChecklistTemplate = {
      id: existingChecklist?.id || `checklist_${Date.now()}`,
      name: checklistName.trim(),
      type: checklistType,
      description: description.trim(),
      items,
      isScheduled,
      scheduledDate: isScheduled ? scheduledDate : undefined,
      createdBy: 'Current User', // This would come from user context
      createdAt: existingChecklist?.createdAt || new Date(),
    };

    onSave(checklist);
    
    Alert.alert(
      'Success',
      `Checklist "${checklistName}" has been ${existingChecklist ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: () => {
        resetForm();
        onClose();
      }}]
    );
  };

  const getItemsByCategory = () => {
    const grouped: Record<ItemCategory, ChecklistItem[]> = {
      safety: [],
      engine: [],
      exterior: [],
      interior: [],
      systems: [],
      documentation: [],
    };
    
    items.forEach(item => {
      grouped[item.category].push(item);
    });
    
    return grouped;
  };

  const getTotalEstimatedTime = () => {
    return items.reduce((total, item) => total + (item.estimatedTime || 0), 0);
  };

  if (!isVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.neutral[600]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {existingChecklist ? 'Edit Checklist' : 'Create Checklist'}
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Text style={styles.fieldLabel}>Checklist Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter checklist name..."
              placeholderTextColor={Colors.neutral[400]}
              value={checklistName}
              onChangeText={setChecklistName}
            />

            <Text style={styles.fieldLabel}>Type *</Text>
            <TouchableOpacity 
              style={styles.typeSelector}
              onPress={() => setShowTypeSelector(true)}
            >
              <View style={styles.typeSelectorLeft}>
                {checklistTypes.find(t => t.value === checklistType)?.icon}
                <Text style={styles.typeSelectorText}>
                  {checklistTypes.find(t => t.value === checklistType)?.label}
                </Text>
              </View>
              <ChevronDown size={20} color={Colors.neutral[400]} />
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe the purpose of this checklist..."
              placeholderTextColor={Colors.neutral[400]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Scheduling */}
            <View style={styles.schedulingContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.fieldLabel}>Schedule this checklist</Text>
                <Switch
                  value={isScheduled}
                  onValueChange={setIsScheduled}
                  trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
                  thumbColor={isScheduled ? Colors.primary[600] : Colors.neutral[500]}
                />
              </View>
              
              {isScheduled && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter schedule (e.g., Every 30 days, Weekly, etc.)"
                  placeholderTextColor={Colors.neutral[400]}
                  value={scheduledDate}
                  onChangeText={setScheduledDate}
                />
              )}
            </View>
          </View>

          {/* Checklist Items */}
          <View style={styles.section}>
            <View style={styles.itemsHeader}>
              <Text style={styles.sectionTitle}>Checklist Items ({items.length})</Text>
              <TouchableOpacity 
                style={styles.addItemButton}
                onPress={() => {
                  resetAddItemForm();
                  setShowAddItemModal(true);
                }}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addItemButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {getTotalEstimatedTime() > 0 && (
              <View style={styles.estimatedTimeContainer}>
                <Clock size={16} color={Colors.primary[600]} />
                <Text style={styles.estimatedTimeText}>
                  Estimated total time: {getTotalEstimatedTime()} minutes
                </Text>
              </View>
            )}

            {/* Items by Category */}
            {categories.map(category => {
              const categoryItems = getItemsByCategory()[category.value as ItemCategory];
              if (categoryItems.length === 0 && !expandedCategories[category.value as ItemCategory]) {
                return null;
              }

              return (
                <View key={category.value} style={styles.categoryContainer}>
                  <TouchableOpacity 
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(category.value as ItemCategory)}
                  >
                    <View style={styles.categoryLeft}>
                      {category.icon}
                      <Text style={styles.categoryTitle}>{category.label}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{categoryItems.length}</Text>
                      </View>
                    </View>
                    {expandedCategories[category.value as ItemCategory] ? 
                      <ChevronUp size={20} color={Colors.neutral[400]} /> :
                      <ChevronDown size={20} color={Colors.neutral[400]} />
                    }
                  </TouchableOpacity>

                  {expandedCategories[category.value as ItemCategory] && (
                    <View style={styles.categoryItems}>
                      {categoryItems.map(item => (
                        <View key={item.id} style={styles.itemCard}>
                          <View style={styles.itemHeader}>
                            <View style={styles.itemTitleContainer}>
                              <Text style={styles.itemTitle}>{item.title}</Text>
                              {item.isRequired && (
                                <View style={styles.requiredBadge}>
                                  <Text style={styles.requiredText}>Required</Text>
                                </View>
                              )}
                            </View>
                            <View style={styles.itemActions}>
                              <TouchableOpacity 
                                style={styles.itemActionButton}
                                onPress={() => duplicateItem(item)}
                              >
                                <Copy size={16} color={Colors.neutral[600]} />
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.itemActionButton}
                                onPress={() => editItem(item)}
                              >
                                <MessageCircle size={16} color={Colors.primary[600]} />
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.itemActionButton}
                                onPress={() => deleteItem(item.id)}
                              >
                                <Trash2 size={16} color={Colors.status.error} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          
                          {item.description && (
                            <Text style={styles.itemDescription}>{item.description}</Text>
                          )}
                          
                          {item.estimatedTime && (
                            <View style={styles.itemTimeContainer}>
                              <Clock size={12} color={Colors.neutral[500]} />
                              <Text style={styles.itemTimeText}>~{item.estimatedTime} min</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {items.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No items added yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Add checklist items to create your custom checklist
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Type Selector Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTypeSelector}
          onRequestClose={() => setShowTypeSelector(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.typeModal}>
              <View style={styles.typeModalHeader}>
                <Text style={styles.typeModalTitle}>Select Checklist Type</Text>
                <TouchableOpacity onPress={() => setShowTypeSelector(false)}>
                  <X size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>
              </View>
              
              {checklistTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    checklistType === type.value && styles.typeOptionSelected
                  ]}
                  onPress={() => {
                    setChecklistType(type.value as ChecklistType);
                    setShowTypeSelector(false);
                  }}
                >
                  {type.icon}
                  <View style={styles.typeOptionContent}>
                    <Text style={styles.typeOptionLabel}>{type.label}</Text>
                    <Text style={styles.typeOptionDescription}>{type.description}</Text>
                  </View>
                  {checklistType === type.value && (
                    <Check size={20} color={Colors.primary[600]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Add/Edit Item Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddItemModal}
          onRequestClose={() => setShowAddItemModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addItemModal}>
              <View style={styles.addItemHeader}>
                <Text style={styles.addItemTitle}>
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </Text>
                <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
                  <X size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.addItemContent}>
                <Text style={styles.fieldLabel}>Title *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter item title..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newItemTitle}
                  onChangeText={setNewItemTitle}
                />

                <Text style={styles.fieldLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categorySelector}>
                    {categories.map(category => (
                      <TouchableOpacity
                        key={category.value}
                        style={[
                          styles.categorySelectorItem,
                          newItemCategory === category.value && styles.categorySelectorItemSelected
                        ]}
                        onPress={() => setNewItemCategory(category.value as ItemCategory)}
                      >
                        {category.icon}
                        <Text style={[
                          styles.categorySelectorText,
                          newItemCategory === category.value && styles.categorySelectorTextSelected
                        ]}>
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Add detailed description..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newItemDescription}
                  onChangeText={setNewItemDescription}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.fieldLabel}>Estimated Time (minutes)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter estimated time..."
                  placeholderTextColor={Colors.neutral[400]}
                  value={newItemTime}
                  onChangeText={setNewItemTime}
                  keyboardType="numeric"
                />

                <View style={styles.switchContainer}>
                  <Text style={styles.fieldLabel}>Required Item</Text>
                  <Switch
                    value={newItemRequired}
                    onValueChange={setNewItemRequired}
                    trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
                    thumbColor={newItemRequired ? Colors.primary[600] : Colors.neutral[500]}
                  />
                </View>
              </ScrollView>

              <View style={styles.addItemActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddItemModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={addOrUpdateItem}
                >
                  <Text style={styles.confirmButtonText}>
                    {editingItem ? 'Update' : 'Add'} Item
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    color: Colors.neutral[900],
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  typeSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeSelectorText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    color: Colors.neutral[900],
    marginLeft: 8,
  },
  schedulingContainer: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addItemButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  estimatedTimeText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.neutral[50],
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginLeft: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.primary[200],
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  categoryBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  categoryItems: {
    padding: 8,
  },
  itemCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  requiredBadge: {
    backgroundColor: Colors.status.error,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  requiredText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemActions: {
    flexDirection: 'row',
  },
  itemActionButton: {
    padding: 4,
    marginLeft: 4,
  },
  itemDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  itemTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTimeText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 11,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeModal: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  typeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeModalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.neutral[50],
  },
  typeOptionSelected: {
    backgroundColor: Colors.primary[100],
    borderWidth: 1,
    borderColor: Colors.primary[300],
  },
  typeOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  typeOptionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
  },
  typeOptionDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  addItemModal: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  addItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  addItemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  addItemContent: {
    padding: 20,
    maxHeight: 400,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categorySelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  categorySelectorItemSelected: {
    backgroundColor: Colors.primary[200],
  },
  categorySelectorText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[700],
    marginLeft: 4,
  },
  categorySelectorTextSelected: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  addItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary[700],
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 