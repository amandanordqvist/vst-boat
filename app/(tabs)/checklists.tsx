import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Check, Camera, Clock, MessageCircle, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, Edit3, Plus, Upload } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DashboardHeader from '@/components/DashboardHeader';

// Checklist types
type ChecklistType = 'pre-departure' | 'post-use' | 'maintenance' | 'seasonal';

// Checklist item status
type ItemStatus = 'pass' | 'fail' | 'pending';

// Checklist item category
type ItemCategory = 'safety' | 'engine' | 'exterior' | 'interior' | 'systems' | 'documentation';

// Checklist item interface
interface ChecklistItem {
  id: string;
  category: ItemCategory;
  title: string;
  status: ItemStatus;
  comments: string;
  hasPhoto: boolean;
  photoUrl?: string;
}

// Checklist interface
interface Checklist {
  id: string;
  type: ChecklistType;
  title: string;
  date: string;
  items: ChecklistItem[];
  progress: number;
  completed: boolean;
  signature?: string;
}

// Sample checklist data
const checklists: Checklist[] = [
  {
    id: '1',
    type: 'pre-departure',
    title: 'Weekend Trip Pre-Departure Check',
    date: '2023-06-15',
    items: [
      { id: '1-1', category: 'safety', title: 'Life jackets present and accessible', status: 'pass', comments: 'All 8 life jackets accounted for', hasPhoto: false },
      { id: '1-2', category: 'safety', title: 'Fire extinguishers charged', status: 'pass', comments: 'Gauges in green zone', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1551419762-4a3d998f6292?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlyZSUyMGV4dGluZ3Vpc2hlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
      { id: '1-3', category: 'engine', title: 'Engine oil level', status: 'pass', comments: 'Topped off', hasPhoto: false },
      { id: '1-4', category: 'systems', title: 'Navigation lights operational', status: 'fail', comments: 'Starboard light intermittent', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1520383278046-37a90eb02d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdCUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
      { id: '1-5', category: 'documentation', title: 'Registration documents onboard', status: 'pending', comments: '', hasPhoto: false },
    ],
    progress: 80,
    completed: false,
  },
  {
    id: '2',
    type: 'post-use',
    title: 'Day Trip Post-Use Checklist',
    date: '2023-06-10',
    items: [
      { id: '2-1', category: 'exterior', title: 'Hull inspected for damage', status: 'pass', comments: 'No visible damage', hasPhoto: false },
      { id: '2-2', category: 'engine', title: 'Engine flushed with fresh water', status: 'pass', comments: 'Completed for 15 minutes', hasPhoto: false },
      { id: '2-3', category: 'interior', title: 'Cabin cleaned and secured', status: 'pass', comments: 'All items stowed properly', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9hdCUyMGNhYmlufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    ],
    progress: 100,
    completed: true,
    signature: 'Captain Mike',
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Monthly Maintenance Checklist',
    date: '2023-06-01',
    items: [
      { id: '3-1', category: 'engine', title: 'Change engine oil and filter', status: 'pass', comments: 'Used synthetic 10W-30', hasPhoto: false },
      { id: '3-2', category: 'systems', title: 'Inspect bilge pumps', status: 'pass', comments: 'Both pumps operational', hasPhoto: false },
      { id: '3-3', category: 'exterior', title: 'Clean and wax hull', status: 'pass', comments: 'Used marine grade wax', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1609439385030-303abc3e6786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdCUyMGh1bGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
      { id: '3-4', category: 'systems', title: 'Check and service battery', status: 'fail', comments: 'Battery #2 showing low voltage', hasPhoto: false },
    ],
    progress: 75,
    completed: false,
  },
  {
    id: '4',
    type: 'seasonal',
    title: 'Spring Preparation Checklist',
    date: '2023-04-15',
    items: [
      { id: '4-1', category: 'exterior', title: 'Remove winter cover', status: 'pass', comments: 'Cover stored in garage', hasPhoto: false },
      { id: '4-2', category: 'systems', title: 'Check all through-hull fittings', status: 'pass', comments: 'All secure with no corrosion', hasPhoto: false },
      { id: '4-3', category: 'engine', title: 'Replace impeller', status: 'pass', comments: 'New OEM part installed', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdCUyMGVuZ2luZXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60' },
      { id: '4-4', category: 'documentation', title: 'Renew insurance policy', status: 'pass', comments: 'Renewed for 12 months', hasPhoto: false },
      { id: '4-5', category: 'safety', title: 'Replace expired flares', status: 'pass', comments: 'New flares expire in 3 years', hasPhoto: false },
    ],
    progress: 100,
    completed: true,
    signature: 'Captain Mike',
  },
];

// Filter categories
const checklistTypes = ['All', 'Pre-Departure', 'Post-Use', 'Maintenance', 'Seasonal'];

// Category mapping for display
const categoryMapping = {
  safety: { title: 'Safety Equipment', icon: <AlertTriangle size={16} color={Colors.status.warning} /> },
  engine: { title: 'Engine & Mechanical', icon: <Clock size={16} color={Colors.primary[500]} /> },
  exterior: { title: 'Hull & Exterior', icon: <Check size={16} color={Colors.primary[700]} /> },
  interior: { title: 'Cabin & Interior', icon: <Check size={16} color={Colors.accent[500]} /> },
  systems: { title: 'Electrical & Systems', icon: <Check size={16} color={Colors.status.info} /> },
  documentation: { title: 'Documentation', icon: <MessageCircle size={16} color={Colors.status.success} /> },
};

export default function ChecklistsScreen() {
  const [selectedType, setSelectedType] = useState('All');
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const insets = useSafeAreaInsets();
  
  // Filter checklists based on selected type
  const filteredChecklists = selectedType === 'All' 
    ? checklists 
    : checklists.filter(checklist => {
        if (selectedType === 'Pre-Departure') return checklist.type === 'pre-departure';
        if (selectedType === 'Post-Use') return checklist.type === 'post-use';
        if (selectedType === 'Maintenance') return checklist.type === 'maintenance';
        if (selectedType === 'Seasonal') return checklist.type === 'seasonal';
        return true;
      });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Toggle checklist expansion
  const toggleChecklistExpansion = (id: string) => {
    setExpandedChecklist(expandedChecklist === id ? null : id);
  };
  
  // Toggle category expansion
  const toggleCategoryExpansion = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Get items grouped by category
  const getItemsByCategory = (items: ChecklistItem[]) => {
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
    
    return Object.entries(grouped)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        category: category as ItemCategory,
        items
      }));
  };
  
  // Render checklist item
  const renderChecklistItem = (item: ChecklistItem) => (
    <View key={item.id} style={styles.checklistItem}>
      <View style={styles.checklistItemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              item.status === 'pass' && styles.passButton
            ]}
          >
            <Text style={styles.statusButtonText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              item.status === 'fail' && styles.failButton
            ]}
          >
            <Text style={styles.statusButtonText}>Fail</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {item.comments ? (
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Comments:</Text>
          <Text style={styles.commentText}>{item.comments}</Text>
        </View>
      ) : (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add comments here..."
            placeholderTextColor={Colors.neutral[400]}
            multiline
          />
        </View>
      )}
      
      {item.hasPhoto && item.photoUrl && (
        <Image source={{ uri: item.photoUrl }} style={styles.itemPhoto} />
      )}
      
      {!item.hasPhoto && (
        <TouchableOpacity style={styles.photoButton}>
          <Camera size={16} color={Colors.primary[700]} />
          <Text style={styles.photoButtonText}>Add Photo</Text>
        </TouchableOpacity>
      )}
          </View>
  );
  
  // Render checklist category
  const renderCategory = (category: ItemCategory, items: ChecklistItem[], checklistId: string) => {
    const categoryKey = `${checklistId}-${category}`;
    const isExpanded = expandedCategories[categoryKey];
    
    return (
      <View key={categoryKey} style={styles.categoryContainer}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => toggleCategoryExpansion(categoryKey)}
        >
          <View style={styles.categoryTitleContainer}>
            {categoryMapping[category].icon}
            <Text style={styles.categoryTitle}>{categoryMapping[category].title}</Text>
          </View>
          <Text style={styles.categoryCount}>{items.length} items</Text>
          {isExpanded ? <ChevronUp size={20} color={Colors.neutral[500]} /> : <ChevronDown size={20} color={Colors.neutral[500]} />}
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.categoryItems}>
            {items.map(renderChecklistItem)}
          </View>
        )}
      </View>
    );
  };
  
  // Get checklist type icon
  const getChecklistTypeIcon = (type: ChecklistType) => {
    switch (type) {
      case 'pre-departure':
        return <Calendar size={24} color={Colors.primary[700]} />;
      case 'post-use':
        return <Check size={24} color={Colors.status.success} />;
      case 'maintenance':
        return <Clock size={24} color={Colors.status.info} />;
      case 'seasonal':
        return <Calendar size={24} color={Colors.accent[500]} />;
      default:
        return <Check size={24} color={Colors.primary[700]} />;
    }
  };
  
  return (
    <View style={styles.container}>
      <DashboardHeader username="Captain Mike" notifications={3} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 24 + (Platform.OS !== 'web' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Checklists</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#FFF" />
            <Text style={styles.addButtonText}>New Checklist</Text>
          </TouchableOpacity>
        </View>
        
        {/* Checklist Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typesContainer}
        >
          {checklistTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && styles.selectedType
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text 
                style={[
                  styles.typeText,
                  selectedType === type && styles.selectedTypeText
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Statistics Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Checklists</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>
        
        {/* Checklists */}
        <View style={styles.checklistsContainer}>
          {filteredChecklists.map((checklist) => (
            <View key={checklist.id} style={styles.checklistCard}>
            <TouchableOpacity 
                style={styles.checklistHeader}
                onPress={() => toggleChecklistExpansion(checklist.id)}
            >
                <View style={styles.checklistTitleSection}>
                  <View style={styles.iconContainer}>
                    {getChecklistTypeIcon(checklist.type)}
                  </View>
                  
                  <View style={styles.checklistTitleContainer}>
                    <Text style={styles.checklistTitle}>{checklist.title}</Text>
                    <Text style={styles.checklistDate}>{formatDate(checklist.date)}</Text>
                  </View>
                </View>
                
                <View style={styles.expandIconContainer}>
                  {expandedChecklist === checklist.id ? 
                    <ChevronUp size={20} color={Colors.neutral[400]} /> :
                    <ChevronDown size={20} color={Colors.neutral[400]} />
                  }
                </View>
              </TouchableOpacity>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${checklist.progress}%` },
                      checklist.progress === 100 ? styles.progressComplete : null
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{checklist.progress}% Complete</Text>
              </View>
              
              {expandedChecklist === checklist.id && (
                <View style={styles.checklistContent}>
                  {getItemsByCategory(checklist.items).map(group => 
                    renderCategory(group.category, group.items, checklist.id)
                  )}
                  
                  <View style={styles.checklistFooter}>
                    {!checklist.completed ? (
                      <>
                        <TouchableOpacity style={styles.signatureButton}>
                          <Edit3 size={16} color={Colors.primary[700]} />
                          <Text style={styles.signatureButtonText}>Sign & Complete</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.submitButton}>
                          <Upload size={16} color="#FFF" />
                          <Text style={styles.submitButtonText}>Generate Report</Text>
            </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.completedInfoContainer}>
                        <Text style={styles.completedByText}>Completed by:</Text>
                        <Text style={styles.signatureText}>{checklist.signature}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary[100],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  screenTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  typesContainer: {
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: Colors.secondary[200],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedType: {
    backgroundColor: Colors.primary[700],
  },
  typeText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  selectedTypeText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary[700],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  checklistsContainer: {
    marginBottom: 20,
  },
  checklistCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  checklistTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checklistTitleContainer: {
    flex: 1,
  },
  checklistTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  checklistDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  expandIconContainer: {
    padding: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: Colors.status.success,
  },
  progressText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[600],
    textAlign: 'right',
  },
  checklistContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.secondary[100],
  },
  categoryTitleContainer: {
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
  categoryCount: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
    marginRight: 8,
  },
  categoryItems: {
    padding: 12,
  },
  checklistItem: {
    marginBottom: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  checklistItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[900],
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 4,
    backgroundColor: Colors.neutral[300],
  },
  passButton: {
    backgroundColor: Colors.status.success,
  },
  failButton: {
    backgroundColor: Colors.status.error,
  },
  statusButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.background,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commentLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  commentText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[700],
  },
  commentInputContainer: {
    marginBottom: 8,
  },
  commentInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
  },
  itemPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginTop: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: Colors.secondary[200],
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary[400],
  },
  photoButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  checklistFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[200],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  signatureButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[700],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  completedInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedByText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
    marginRight: 6,
  },
  signatureText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
    fontStyle: 'italic',
  },
});