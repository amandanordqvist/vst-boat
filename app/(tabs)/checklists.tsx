import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextInput, Switch, Modal, Alert, Animated, RefreshControl, useColorScheme, Dimensions, Share, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Check, Camera, Clock, MessageCircle, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, Edit3, Plus, Upload, X, Search, Filter, Grid, List, Heart, Star, FileText, Moon, Sun, MoreVertical, Download, Trash, Bookmark, BookmarkCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { CameraInterface } from '@/components/CameraInterface';

// Checklist types
type ChecklistType = 'pre-departure' | 'post-use' | 'maintenance' | 'seasonal';

// Checklist item status
type ItemStatus = 'pass' | 'fail' | 'pending';

// Checklist item category
type ItemCategory = 'safety' | 'engine' | 'exterior' | 'interior' | 'systems' | 'documentation';

// Checklist View Type
type ViewType = 'standard' | 'compact' | 'timeline';

// Checklist item interface
interface ChecklistItem {
  id: string;
  category: ItemCategory;
  title: string;
  status: ItemStatus;
  comments: string;
  hasPhoto: boolean;
  photoUrl?: string;
  order?: number;
  isMandatory?: boolean; // NEW: Mark items as mandatory vs optional
  photoTimestamp?: string; // NEW: When photo was taken
  requiresPhoto?: boolean; // NEW: Item requires photo for completion
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
  isPinned?: boolean;
  isScheduled?: boolean;
  scheduledDate?: string;
  isFavorite?: boolean;
}

// Sample checklist data
const checklists: Checklist[] = [
  {
    id: '1',
    type: 'pre-departure',
    title: '20-Point Pre-Departure Safety Check',
    date: '2023-06-15',
    items: [
      // SAFETY EQUIPMENT (Mandatory)
      { id: '1-1', category: 'safety', title: 'Life jackets present and accessible', status: 'pass', comments: 'All 8 life jackets accounted for', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '1-2', category: 'safety', title: 'Fire extinguishers charged and accessible', status: 'pass', comments: 'Gauges in green zone', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1551419762-4a3d998f6292?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlyZSUyMGV4dGluZ3Vpc2hlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', isMandatory: true, requiresPhoto: true },
      { id: '1-3', category: 'safety', title: 'Emergency flares (not expired)', status: 'pending', comments: '', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '1-4', category: 'safety', title: 'First aid kit complete', status: 'pass', comments: 'Checked and restocked', hasPhoto: false, isMandatory: true },
      { id: '1-5', category: 'safety', title: 'Emergency horn/whistle functional', status: 'pass', comments: 'Working properly', hasPhoto: false, isMandatory: true },
      
      // ENGINE & MECHANICAL (Mandatory)
      { id: '1-6', category: 'engine', title: 'Engine oil level check', status: 'pass', comments: 'Level good, topped off', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '1-7', category: 'engine', title: 'Coolant level check', status: 'pass', comments: 'Level normal', hasPhoto: false, isMandatory: true },
      { id: '1-8', category: 'engine', title: 'Belt condition inspection', status: 'pending', comments: '', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '1-9', category: 'engine', title: 'Fuel level and lines check', status: 'pass', comments: 'Tank 3/4 full, no leaks', hasPhoto: false, isMandatory: true },
      
      // SYSTEMS & ELECTRICAL (Mandatory)
      { id: '1-10', category: 'systems', title: 'Navigation lights operational', status: 'fail', comments: 'Starboard light intermittent', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1520383278046-37a90eb02d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdCUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', isMandatory: true, requiresPhoto: true },
      { id: '1-11', category: 'systems', title: 'Bilge pump functional', status: 'pass', comments: 'Both pumps tested', hasPhoto: false, isMandatory: true },
      { id: '1-12', category: 'systems', title: 'Battery charge level', status: 'pass', comments: 'All batteries 12.6V+', hasPhoto: false, isMandatory: true },
      { id: '1-13', category: 'systems', title: 'VHF radio operational', status: 'pass', comments: 'Clear communication on Ch16', hasPhoto: false, isMandatory: true },
      
      // HULL & EXTERIOR (Mandatory)
      { id: '1-14', category: 'exterior', title: 'Through-hull fittings secure', status: 'pass', comments: 'All seacocks operational', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '1-15', category: 'exterior', title: 'Anchor and rode inspection', status: 'pass', comments: 'Chain and rope in good condition', hasPhoto: false, isMandatory: true },
      { id: '1-16', category: 'exterior', title: 'Dock lines and fenders stowed', status: 'pending', comments: '', hasPhoto: false, isMandatory: true },
      
      // DOCUMENTATION (Mandatory)
      { id: '1-17', category: 'documentation', title: 'Registration documents onboard', status: 'pending', comments: '', hasPhoto: false, isMandatory: true },
      { id: '1-18', category: 'documentation', title: 'Insurance certificate current', status: 'pass', comments: 'Valid through Dec 2024', hasPhoto: false, isMandatory: true },
      
      // OPTIONAL CHECKS
      { id: '1-19', category: 'interior', title: 'Cabin ventilation adequate', status: 'pass', comments: 'All vents clear and functional', hasPhoto: false, isMandatory: false },
      { id: '1-20', category: 'systems', title: 'GPS/Chart plotter functional', status: 'pass', comments: 'Updated charts, GPS signal strong', hasPhoto: false, isMandatory: false },
    ],
    progress: 65,
    completed: false,
  },
  {
    id: '2',
    type: 'post-use',
    title: 'Day Trip Post-Use Checklist',
    date: '2023-06-10',
    items: [
      { id: '2-1', category: 'exterior', title: 'Hull inspected for damage', status: 'pass', comments: 'No visible damage', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '2-2', category: 'engine', title: 'Engine flushed with fresh water', status: 'pass', comments: 'Completed for 15 minutes', hasPhoto: false, isMandatory: true },
      { id: '2-3', category: 'interior', title: 'Cabin cleaned and secured', status: 'pass', comments: 'All items stowed properly', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9hdCUyMGNhYmlufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', isMandatory: false },
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
      { id: '3-1', category: 'engine', title: 'Change engine oil and filter', status: 'pass', comments: 'Used synthetic 10W-30', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '3-2', category: 'systems', title: 'Inspect bilge pumps', status: 'pass', comments: 'Both pumps operational', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '3-3', category: 'exterior', title: 'Clean and wax hull', status: 'pass', comments: 'Used marine grade wax', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1609439385030-303abc3e6786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdCUyMGh1bGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', isMandatory: false },
      { id: '3-4', category: 'systems', title: 'Check and service battery', status: 'fail', comments: 'Battery #2 showing low voltage', hasPhoto: false, isMandatory: true, requiresPhoto: true },
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
      { id: '4-1', category: 'exterior', title: 'Remove winter cover', status: 'pass', comments: 'Cover stored in garage', hasPhoto: false, isMandatory: true },
      { id: '4-2', category: 'systems', title: 'Check all through-hull fittings', status: 'pass', comments: 'All secure with no corrosion', hasPhoto: false, isMandatory: true, requiresPhoto: true },
      { id: '4-3', category: 'engine', title: 'Replace impeller', status: 'pass', comments: 'New OEM part installed', hasPhoto: true, photoUrl: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdCUyMGVuZ2luZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', isMandatory: true, requiresPhoto: true },
      { id: '4-4', category: 'documentation', title: 'Renew insurance policy', status: 'pass', comments: 'Renewed for 12 months', hasPhoto: false, isMandatory: true },
      { id: '4-5', category: 'safety', title: 'Replace expired flares', status: 'pass', comments: 'New flares expire in 3 years', hasPhoto: false, isMandatory: true },
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

// Add this component before the main ChecklistsScreen component
const DraggableItem = ({ item, category, onReorder }: { 
  item: ChecklistItem; 
  category: ItemCategory; 
  onReorder: (itemId: string, category: ItemCategory, newOrder: number) => void;
}) => {
  // Move hooks here - they will always be called in the same order
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  
  // Pan responder for drag gesture
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: Animated.event(
      [null, { dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gestureState) => {
      setIsDragging(false);
      
      // Calculate new position based on gesture
      const itemHeight = 100; // Approximate height of item
      const orderChange = Math.round(gestureState.dy / itemHeight);
      
      if (orderChange !== 0) {
        const newOrder = (item.order || 0) + orderChange * 10;
        onReorder(item.id, category, newOrder);
      }
      
      // Reset position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }).start();
    }
  });
  
  return (
    <Animated.View
      style={[
        { transform: pan.getTranslateTransform() },
        isDragging && { 
          zIndex: 999, 
          elevation: 5, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.3, 
          shadowRadius: 4 
        }
      ]}
      {...panResponder.panHandlers}
    >
      <ChecklistItemComponent item={item} />
    </Animated.View>
  );
};

// Add this component for the actual checklist item rendering
const ChecklistItemComponent = ({ item, onPhotoCapture, onStatusChange }: { 
  item: ChecklistItem;
  onPhotoCapture?: (itemId: string) => void;
  onStatusChange?: (itemId: string, status: ItemStatus) => void;
}) => (
  <View style={[
    styles.checklistItem, 
    { backgroundColor: Colors.background, borderColor: Colors.neutral[200] },
    item.isMandatory && styles.mandatoryItem
  ]}>
    <View style={styles.checklistItemHeader}>
      <View style={styles.itemTitleContainer}>
        <Text style={[styles.itemTitle, { color: Colors.neutral[900] }]}>
          {item.title}
        </Text>
        {item.isMandatory && (
          <View style={styles.mandatoryBadge}>
            <Text style={styles.mandatoryText}>REQUIRED</Text>
          </View>
        )}
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            item.status === 'pass' && styles.passButton,
            item.status === 'fail' && styles.enhancedFailButton,
            item.status === 'pending' && styles.enhancedPendingButton
          ]}
          onPress={() => onStatusChange && onStatusChange(item.id, 
            item.status === 'pending' ? 'pass' : 
            item.status === 'pass' ? 'fail' : 'pending'
          )}
        >
          <Text style={styles.statusButtonText}>Pass</Text>
          <Text style={[styles.statusButtonText, { 
            color: item.status === 'pass' ? '#fff' : 
                   item.status === 'fail' ? '#fff' : 
                   Colors.neutral[600] 
          }]}>
            {item.status === 'pass' ? 'Pass' : 
             item.status === 'fail' ? 'Fail' : 
             'Pending'}
          </Text>
        </TouchableOpacity>
        
        {/* Direct Photo Button - Messenger Style */}
        {(item.requiresPhoto || item.hasPhoto) && (
          <TouchableOpacity 
            style={[
              styles.directPhotoButton,
              item.hasPhoto && { backgroundColor: Colors.status.success }
            ]}
            onPress={() => onPhotoCapture && onPhotoCapture(item.id)}
          >
            <Camera size={16} color={item.hasPhoto ? '#fff' : Colors.primary[500]} />
            {item.hasPhoto && (
              <Text style={styles.photoCountText}>1</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
    
    {/* Comments Section */}
    {item.comments && (
      <View style={styles.commentContainer}>
        <Text style={[styles.commentLabel, { color: Colors.neutral[600] }]}>Comments:</Text>
        <Text style={[styles.commentText, { color: Colors.neutral[900] }]}>{item.comments}</Text>
      </View>
    )}
    
    {/* Photo Display with Timestamp */}
    {item.hasPhoto && item.photoUrl && (
      <View style={styles.photoContainer}>
        <Image source={{ uri: item.photoUrl }} style={styles.itemPhoto} />
        {item.photoTimestamp && (
          <View style={styles.photoTimestamp}>
            <Clock size={12} color={Colors.neutral[500]} />
            <Text style={styles.timestampText}>
              {new Date(item.photoTimestamp).toLocaleString('sv-SE')}
            </Text>
          </View>
        )}
      </View>
    )}
    
    {/* Required Photo Indicator */}
    {item.requiresPhoto && !item.hasPhoto && (
      <View style={styles.photoRequiredContainer}>
        <AlertTriangle size={14} color={Colors.status.warning} />
        <Text style={styles.photoRequiredText}>Foto krävs för verifiering</Text>
        <TouchableOpacity 
          style={styles.takePhotoButton}
          onPress={() => onPhotoCapture && onPhotoCapture(item.id)}
        >
          <Camera size={16} color="#fff" />
          <Text style={styles.takePhotoText}>Ta foto</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default function ChecklistsScreen() {
  const [selectedType, setSelectedType] = useState('All');
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [currentChecklistId, setCurrentChecklistId] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [editedChecklists, setEditedChecklists] = useState<Checklist[]>([...checklists]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('standard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailChecklist, setDetailChecklist] = useState<Checklist | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [pdfExportModalVisible, setPdfExportModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [currentCameraItemId, setCurrentCameraItemId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // Sample images for mock uploader
  const sampleImages = [
    'https://images.unsplash.com/photo-1542202229-7d93c33f5d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hdCUyMGVuZ2luZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hdCUyMGVuZ2luZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1615529328331-f8cc1d9323e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9hdCUyMGVuZ2luZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1554731340-e99b910b4255?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvYXQlMjBlbmdpbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  ];
  
  // Filter checklists based on selected type
  const filteredChecklists = selectedType === 'All' 
    ? editedChecklists 
    : editedChecklists.filter(checklist => {
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
  
  // Open modal for item
  const openItemModal = (itemId: string) => {
    const checklist = editedChecklists.find(c => c.items.some(item => item.id === itemId));
    if (checklist) {
      const item = checklist.items.find(item => item.id === itemId);
      if (item) {
        setCurrentItemId(itemId);
        setComment(item.comments || '');
        setSelectedImage(item.photoUrl || null);
        setModalVisible(true);
      }
    }
  };
  
  // Save changes
  const saveChanges = () => {
    if (!currentItemId) return;
    
    // In a real app, this would update backend data
    // For now we'll just show a success message
    Alert.alert(
      "Changes Saved",
      "Your changes have been saved successfully.",
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
  };
  
  // Select a mock image
  const selectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  // Open signature modal for checklist
  const openSignatureModal = (checklistId: string) => {
    setCurrentChecklistId(checklistId);
    setSignatureText('');
    setSignatureModalVisible(true);
  };
  
  // Complete checklist with signature
  const completeChecklist = () => {
    if (!currentChecklistId || !signatureText.trim()) {
      Alert.alert('Error', 'Please enter your signature');
      return;
    }
    
    const updatedChecklists = editedChecklists.map(checklist => {
      if (checklist.id === currentChecklistId) {
        return {
          ...checklist,
          completed: true,
          signature: signatureText.trim(),
          progress: 100
        };
      }
      return checklist;
    });
    
    setEditedChecklists(updatedChecklists);
    
    Alert.alert(
      "Checklist Completed",
      "The checklist has been signed and marked as complete.",
      [{ text: "OK", onPress: () => setSignatureModalVisible(false) }]
    );
  };

  // Generate report for checklist
  const generateReport = (checklistId: string) => {
    Alert.alert(
      "Report Generated",
      "The checklist report has been generated and is ready to share.",
      [{ text: "OK" }]
    );
  };
  
  // Render a single checklist item based on view type
  const renderChecklist = (checklist: Checklist, themeColors: any) => {
    if (viewType === 'compact') {
      // Compact view
      return (
        <TouchableOpacity 
          key={checklist.id}
          style={[
            styles.compactChecklistCard, 
            { backgroundColor: themeColors.card, borderColor: themeColors.border }
          ]}
          onPress={() => openDetailView(checklist)}
        >
          <View style={styles.compactChecklistHeader}>
            <View style={styles.iconContainer}>
              {getChecklistTypeIcon(checklist.type)}
            </View>
            <View style={styles.compactTitleContainer}>
              <Text 
                style={[styles.compactChecklistTitle, { color: themeColors.text }]} 
                numberOfLines={1}
              >
                {checklist.title}
              </Text>
              <Text style={styles.compactChecklistDate}>{formatDate(checklist.date)}</Text>
            </View>
            <View style={styles.compactActions}>
              {checklist.isFavorite && <Star size={16} color={Colors.status.warning} />}
              {checklist.isPinned && <BookmarkCheck size={16} color={Colors.primary[700]} />}
              <Text style={[
                styles.compactProgressText, 
                checklist.progress === 100 ? { color: Colors.status.success } : { color: Colors.primary[500] }
              ]}>
                {checklist.progress}%
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    // Standard view
    return (
      <View 
        key={checklist.id} 
        style={[
          styles.checklistCard, 
          { backgroundColor: themeColors.card, borderColor: themeColors.border }
        ]}
      >
        <TouchableOpacity 
          style={styles.checklistHeader}
          onPress={() => toggleChecklistExpansion(checklist.id)}
        >
          <View style={styles.checklistTitleSection}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}>
              {getChecklistTypeIcon(checklist.type)}
            </View>
            
            <View style={styles.checklistTitleContainer}>
              <Text style={[styles.checklistTitle, { color: themeColors.text }]}>{checklist.title}</Text>
              <Text style={[styles.checklistDate, { color: isDarkMode ? Colors.neutral[400] : Colors.neutral[500] }]}>
                {formatDate(checklist.date)}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(checklist.id);
              }}
            >
              {checklist.isFavorite ? 
                <Star size={20} color={Colors.status.warning} /> : 
                <Star size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
              }
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                togglePin(checklist.id);
              }}
            >
              {checklist.isPinned ? 
                <BookmarkCheck size={20} color={Colors.primary[700]} /> : 
                <Bookmark size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
              }
            </TouchableOpacity>
            
            <View style={styles.expandIconContainer}>
              {expandedChecklist === checklist.id ? 
                <ChevronUp size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[400]} /> :
                <ChevronDown size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[400]} />
              }
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#333333' : Colors.neutral[200] }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${checklist.progress}%` },
                checklist.progress === 100 ? { backgroundColor: Colors.status.success } : null
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: isDarkMode ? Colors.neutral[300] : Colors.neutral[600] }]}>
            {checklist.progress}% Complete
          </Text>
        </View>
        
        {expandedChecklist === checklist.id && (
          <View style={styles.checklistContent}>
            {getItemsByCategory(checklist.items).map(group => 
              renderCategory(group.category, group.items, checklist.id)
            )}
            
            <View style={styles.checklistFooter}>
              {!checklist.completed ? (
                <>
                  <TouchableOpacity 
                    style={[styles.signatureButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                    onPress={() => openSignatureModal(checklist.id)}
                  >
                    <Edit3 size={16} color={themeColors.accent} />
                    <Text style={[styles.signatureButtonText, { color: themeColors.accent }]}>Sign & Complete</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                      style={[styles.actionFooterButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                      onPress={() => exportToPDF(checklist.id)}
                    >
                      <FileText size={16} color={themeColors.accent} />
                      <Text style={[styles.actionButtonText, { color: themeColors.accent }]}>Export</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.submitButton}
                      onPress={() => generateReport(checklist.id)}
                    >
                      <Upload size={16} color="#FFF" />
                      <Text style={styles.submitButtonText}>Report</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.completedInfoContainer}>
                  <Text style={[styles.completedByText, { color: themeColors.text }]}>Completed by:</Text>
                  <Text style={[styles.signatureText, { color: themeColors.accent }]}>{checklist.signature}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };
  
  // Render checklist category
  const renderCategory = (category: ItemCategory, items: ChecklistItem[], checklistId: string) => {
    const categoryKey = `${checklistId}-${category}`;
    const isExpanded = expandedCategories[categoryKey];
    
    // Sort items by order if it exists
    const sortedItems = [...items].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    
    return (
      <View key={categoryKey} style={[styles.categoryContainer, { borderColor: themeColors.border }]}>
        <TouchableOpacity 
          style={[styles.categoryHeader, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[100] }]}
          onPress={() => toggleCategoryExpansion(categoryKey)}
        >
          <View style={styles.categoryTitleContainer}>
            {categoryMapping[category].icon}
            <Text style={[styles.categoryTitle, { color: themeColors.text }]}>{categoryMapping[category].title}</Text>
          </View>
          <View style={styles.categoryHeaderRight}>
            <Text style={[styles.categoryCount, { color: isDarkMode ? Colors.neutral[400] : Colors.neutral[500] }]}>
              {items.length} items
            </Text>
            {isExpanded ? (
              <ChevronUp size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
            ) : (
              <ChevronDown size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
            )}
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.categoryItems}>
            {sortedItems.map(item => {
              // Use regular rendering for compact view, draggable for standard view
              return viewType === 'standard' 
                ? renderDraggableItem(item, category)
                : <ChecklistItemComponent key={item.id} item={item} />;
            })}
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
  
  // Function to handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Apply animation when toggling dark mode
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  
  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    // In a real app, you would fetch updated data here
    setTimeout(() => {
      // Simulate a data refresh
      setEditedChecklists([...checklists]);
      setIsRefreshing(false);
      // Give haptic feedback on completion
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };
  
  // Function to toggle favorite status
  const toggleFavorite = (id: string) => {
    setEditedChecklists(prev => prev.map(checklist => 
      checklist.id === id 
        ? {...checklist, isFavorite: !checklist.isFavorite}
        : checklist
    ));
    // Give haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Function to toggle pinned status
  const togglePin = (id: string) => {
    setEditedChecklists(prev => prev.map(checklist => 
      checklist.id === id 
        ? {...checklist, isPinned: !checklist.isPinned}
        : checklist
    ));
    // Give haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Function to export to PDF
  const exportToPDF = (id: string) => {
    setPdfExportModalVisible(true);
    setCurrentChecklistId(id);
  };
  
  // Function to open detail view
  const openDetailView = (checklist: Checklist) => {
    setDetailChecklist(checklist);
    setDetailModalVisible(true);
  };

  // Handle direct photo capture for checklist items
  const handlePhotoCapture = (itemId: string) => {
    setCurrentCameraItemId(itemId);
    setCameraModalVisible(true);
  };

  // Handle photo taken from camera
  const handlePhotoTaken = (photoUri: string) => {
    if (!currentCameraItemId) return;
    
    const timestamp = new Date().toISOString();
    setEditedChecklists(prev => 
      prev.map(checklist => ({
        ...checklist,
        items: checklist.items.map(item => 
          item.id === currentCameraItemId 
            ? { 
                ...item, 
                hasPhoto: true, 
                photoUrl: photoUri,
                photoTimestamp: timestamp 
              }
            : item
        )
      }))
    );
    
    setCameraModalVisible(false);
    setCurrentCameraItemId(null);
    
    // Show success feedback
    Alert.alert('Foto sparad', 'Bilden har sparats med automatisk tidsstämpel', [{ text: 'OK' }]);
  };

  // Handle status changes for checklist items
  const handleStatusChange = (itemId: string, newStatus: ItemStatus) => {
    setEditedChecklists(prev => 
      prev.map(checklist => ({
        ...checklist,
        items: checklist.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      }))
    );
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Filter and search checklists
  const filteredAndSearchedChecklists = editedChecklists
    .filter(checklist => {
      // Filter by type
      if (selectedType !== 'All') {
        if (selectedType === 'Pre-Departure' && checklist.type !== 'pre-departure') return false;
        if (selectedType === 'Post-Use' && checklist.type !== 'post-use') return false;
        if (selectedType === 'Maintenance' && checklist.type !== 'maintenance') return false;
        if (selectedType === 'Seasonal' && checklist.type !== 'seasonal') return false;
      }
      
      // Filter by pinned status
      if (pinnedOnly && !checklist.isPinned) return false;
      
      // Filter by favorites
      if (favoritesOnly && !checklist.isFavorite) return false;
      
      // Filter by search query
      if (searchQuery) {
        const matchesSearch = 
          checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          checklist.items.some(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.comments.toLowerCase().includes(searchQuery.toLowerCase())
          );
        if (!matchesSearch) return false;
      }
      
      return true;
    });

  // Get theme-based colors
  const themeColors = {
    background: isDarkMode ? '#121212' : Colors.secondary[100],
    text: isDarkMode ? '#FFFFFF' : Colors.neutral[900],
    card: isDarkMode ? '#1E1E1E' : Colors.background,
    border: isDarkMode ? '#333333' : Colors.neutral[200],
    accent: isDarkMode ? Colors.primary[300] : Colors.primary[700],
  };
  
  // Render a draggable checklist item (now simplified)
  const renderDraggableItem = (item: ChecklistItem, category: ItemCategory) => {
    // Use regular rendering for compact view, draggable for standard view
    return viewType === 'standard' 
      ? <DraggableItemWithCallbacks key={item.id} item={item} category={category} onReorder={handleReorder} onPhotoCapture={handlePhotoCapture} onStatusChange={handleStatusChange} />
      : <ChecklistItemComponent key={item.id} item={item} onPhotoCapture={handlePhotoCapture} onStatusChange={handleStatusChange} />;
  };

  // Enhanced DraggableItem with callbacks
  const DraggableItemWithCallbacks = ({ item, category, onReorder, onPhotoCapture, onStatusChange }: { 
    item: ChecklistItem; 
    category: ItemCategory; 
    onReorder: (itemId: string, category: ItemCategory, newOrder: number) => void;
    onPhotoCapture: (itemId: string) => void;
    onStatusChange: (itemId: string, status: ItemStatus) => void;
  }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const [isDragging, setIsDragging] = useState(false);
    
    return (
      <ChecklistItemComponent 
        item={item} 
        onPhotoCapture={onPhotoCapture} 
        onStatusChange={onStatusChange} 
      />
    );
  };
  
  // Function for drag and drop reordering
  const handleReorder = (itemId: string, category: ItemCategory, newOrder: number) => {
    setEditedChecklists(prev => {
      return prev.map(checklist => {
        const items = [...checklist.items];
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
          // Set the new order
          const updatedItem = {...items[itemIndex], order: newOrder};
          
          // Remove the item from its current position
          items.splice(itemIndex, 1);
          
          // Find where to insert the item based on new order
          let insertIndex = 0;
          while (insertIndex < items.length && (items[insertIndex].order || 0) < newOrder) {
            insertIndex++;
          }
          
          // Insert the item at the new position
          items.splice(insertIndex, 0, updatedItem);
          
          // Update order values for all items in the same category
          const reorderedItems = items.map((item, index) => {
            if (item.category === category) {
              return {...item, order: index * 10};
            }
            return item;
          });
          
          return {...checklist, items: reorderedItems};
        }
        
        return checklist;
      });
    });
    
    // Give haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Animated.View 
        style={[
          styles.container, 
          { 
            backgroundColor: themeColors.background,
            opacity: fadeAnim 
          }
        ]}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={[
            styles.contentContainer,
            { 
              paddingTop: 16 + (Platform.OS !== 'web' ? insets.top : 0),
              paddingBottom: 24 + (Platform.OS !== 'web' ? insets.bottom : 0) 
            }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={onRefresh}
              colors={[Colors.primary[500]]}
              tintColor={themeColors.accent}
            />
          }
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            {showSearchBar ? (
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, { color: themeColors.text, borderColor: themeColors.border }]}
                  placeholder="Search checklists..."
                  placeholderTextColor={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]}
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus
                />
                <TouchableOpacity 
                  style={styles.searchCloseButton}
                  onPress={() => {
                    setShowSearchBar(false);
                    setSearchQuery('');
                  }}
                >
                  <X size={18} color={themeColors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={[styles.screenTitle, { color: themeColors.text }]}>Checklists</Text>
                <View style={styles.headerControls}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => setShowSearchBar(true)}
                  >
                    <Search size={22} color={themeColors.text} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={toggleDarkMode}
                  >
                    {isDarkMode ? 
                      <Sun size={22} color={themeColors.text} /> : 
                      <Moon size={22} color={themeColors.text} />
                    }
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.viewTypeButton, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
                    onPress={() => setViewType(viewType === 'standard' ? 'compact' : viewType === 'compact' ? 'timeline' : 'standard')}
                  >
                    {viewType === 'standard' ? 
                      <List size={22} color={themeColors.text} /> : 
                      viewType === 'compact' ? 
                        <Calendar size={22} color={themeColors.text} /> :
                        <Grid size={22} color={themeColors.text} />
                    }
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.addButton}>
                    <Plus size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>New</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          
          {/* Filters and View Options */}
          <View style={styles.filtersContainer}>
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
                    { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200], borderColor: themeColors.border },
                    selectedType === type && { backgroundColor: themeColors.accent }
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text 
                    style={[
                      styles.typeText,
                      { color: isDarkMode ? Colors.neutral[300] : Colors.neutral[600] },
                      selectedType === type && { color: '#FFFFFF', fontWeight: '500' }
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Advanced Filters */}
            <View style={styles.advancedFilters}>
              <TouchableOpacity
                style={[styles.filterButton, pinnedOnly && styles.activeFilterButton]}
                onPress={() => setPinnedOnly(!pinnedOnly)}
              >
                {pinnedOnly ? 
                  <BookmarkCheck size={16} color={Colors.primary[700]} /> : 
                  <Bookmark size={16} color={themeColors.text} />
                }
                <Text style={[
                  styles.filterButtonText, 
                  { color: pinnedOnly ? Colors.primary[700] : themeColors.text }
                ]}>Pinned</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, favoritesOnly && styles.activeFilterButton]}
                onPress={() => setFavoritesOnly(!favoritesOnly)}
              >
                {favoritesOnly ? 
                  <Star size={16} color={Colors.status.warning} /> : 
                  <Star size={16} color={themeColors.text} />
                }
                <Text style={[
                  styles.filterButtonText, 
                  { color: favoritesOnly ? Colors.status.warning : themeColors.text }
                ]}>Favorites</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, showTimeline && styles.activeFilterButton]}
                onPress={() => setShowTimeline(!showTimeline)}
              >
                <Calendar size={16} color={showTimeline ? Colors.status.info : themeColors.text} />
                <Text style={[
                  styles.filterButtonText, 
                  { color: showTimeline ? Colors.status.info : themeColors.text }
                ]}>Timeline</Text>
              </TouchableOpacity>
            </View>
          </View>
        
        {/* Statistics Summary */}
        <View style={[styles.statsContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: themeColors.accent }]}>
              {editedChecklists.length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>Total Checklists</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.status.success }]}>
              {editedChecklists.filter(c => c.completed).length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.primary[500] }]}>
              {editedChecklists.filter(c => !c.completed).length}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>In Progress</Text>
          </View>
        </View>
        
        {/* Timeline View */}
        {showTimeline && (
          <View style={[styles.timelineContainer, { borderColor: themeColors.border }]}>
            <Text style={[styles.timelineTitle, { color: themeColors.text }]}>Upcoming Checklists</Text>
            {editedChecklists
              .filter(checklist => !checklist.completed && checklist.isScheduled)
              .slice(0, 3)
              .map(checklist => (
                <View key={checklist.id} style={[styles.timelineItem, { borderColor: themeColors.border }]}>
                  <View style={styles.timelineDateContainer}>
                    <Calendar size={16} color={themeColors.accent} />
                    <Text style={[styles.timelineDate, { color: themeColors.text }]}>
                      {formatDate(checklist.date)}
                    </Text>
                  </View>
                  <Text style={[styles.timelineItemTitle, { color: themeColors.text }]}>
                    {checklist.title}
                  </Text>
                  <Text style={styles.timelineItemProgress}>
                    {checklist.progress}% Complete
                  </Text>
                </View>
              ))}
            
            {editedChecklists.filter(checklist => !checklist.completed && checklist.isScheduled).length === 0 && (
              <Text style={[styles.emptyTimelineText, { color: themeColors.text }]}>
                No upcoming scheduled checklists
              </Text>
            )}
          </View>
        )}
        
        {/* Checklists */}
        <View style={styles.checklistsContainer}>
          {/* Render pinned checklists first if not filtering by pinned */}
          {!pinnedOnly && filteredAndSearchedChecklists.some(c => c.isPinned) && (
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Pinned Checklists
              </Text>
              {filteredAndSearchedChecklists
                .filter(checklist => checklist.isPinned)
                .map(checklist => renderChecklist(checklist, themeColors))}
            </View>
          )}
          
          {/* Render regular checklists */}
          <View style={styles.sectionContainer}>
            {!pinnedOnly && filteredAndSearchedChecklists.some(c => c.isPinned) && (
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                All Checklists
              </Text>
            )}
            
            {filteredAndSearchedChecklists
              .filter(checklist => pinnedOnly ? checklist.isPinned : !checklist.isPinned)
              .map(checklist => renderChecklist(checklist, themeColors))}
          </View>
        </View>
      </ScrollView>
      
      {/* Image Upload and Comment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Photo & Comments</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionLabel}>Select a Photo</Text>
            <ScrollView 
              horizontal 
              style={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {sampleImages.map((image, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.imageThumbnailContainer,
                    selectedImage === image && styles.selectedImageContainer
                  ]}
                  onPress={() => selectImage(image)}
                >
                  <Image 
                    source={{ uri: image }} 
                    style={styles.imageThumbnail} 
                  />
                  {selectedImage === image && (
                    <View style={styles.selectedImageOverlay}>
                      <Check size={24} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.takePictureButton}>
                <Camera size={24} color={Colors.primary[700]} />
                <Text style={styles.takePictureText}>Take Picture</Text>
              </TouchableOpacity>
            </ScrollView>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
            )}
            
            <Text style={styles.sectionLabel}>Comments</Text>
            <TextInput
              style={styles.modalCommentInput}
              placeholder="Add detailed comments about this item..."
              placeholderTextColor={Colors.neutral[400]}
              multiline
              value={comment}
              onChangeText={setComment}
            />
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Signature Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={signatureModalVisible}
        onRequestClose={() => setSignatureModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sign & Complete Checklist</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSignatureModalVisible(false)}
              >
                <X size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionLabel}>Enter Your Name/Signature</Text>
            <TextInput
              style={styles.signatureInput}
              placeholder="Type your full name"
              placeholderTextColor={Colors.neutral[400]}
              value={signatureText}
              onChangeText={setSignatureText}
            />
            
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationText}>
                By signing, you confirm that all checklist items have been inspected and the information provided is accurate.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                !signatureText.trim() && styles.disabledButton
              ]}
              onPress={completeChecklist}
              disabled={!signatureText.trim()}
            >
              <Text style={styles.saveButtonText}>Complete Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Detail View Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Checklist Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <X size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            {detailChecklist && (
              <ScrollView style={styles.detailScrollView}>
                <View style={styles.detailHeaderSection}>
                  <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}>
                    {getChecklistTypeIcon(detailChecklist.type)}
                  </View>
                  <View style={styles.detailTitleContainer}>
                    <Text style={[styles.detailTitle, { color: themeColors.text }]}>{detailChecklist.title}</Text>
                    <Text style={[styles.detailDate, { color: isDarkMode ? Colors.neutral[400] : Colors.neutral[500] }]}>
                      {formatDate(detailChecklist.date)}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.detailProgressContainer, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[100] }]}>
                  <Text style={[styles.detailProgressLabel, { color: themeColors.text }]}>Completion Progress</Text>
                  <View style={[styles.detailProgressBar, { backgroundColor: isDarkMode ? '#444444' : Colors.neutral[200] }]}>
                    <View 
                      style={[
                        styles.detailProgressFill, 
                        { width: `${detailChecklist.progress}%` },
                        detailChecklist.progress === 100 ? { backgroundColor: Colors.status.success } : null
                      ]} 
                    />
                  </View>
                  <Text style={[styles.detailProgressText, { color: themeColors.text }]}>
                    {detailChecklist.progress}% Complete
                  </Text>
                </View>
                
                <View style={styles.detailActionsContainer}>
                  <TouchableOpacity 
                    style={[styles.detailActionButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                    onPress={() => toggleFavorite(detailChecklist.id)}
                  >
                    {detailChecklist.isFavorite ? 
                      <Star size={20} color={Colors.status.warning} /> : 
                      <Star size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
                    }
                    <Text style={[styles.detailActionText, { color: themeColors.text }]}>
                      {detailChecklist.isFavorite ? 'Favorited' : 'Favorite'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.detailActionButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                    onPress={() => togglePin(detailChecklist.id)}
                  >
                    {detailChecklist.isPinned ? 
                      <BookmarkCheck size={20} color={Colors.primary[700]} /> : 
                      <Bookmark size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
                    }
                    <Text style={[styles.detailActionText, { color: themeColors.text }]}>
                      {detailChecklist.isPinned ? 'Pinned' : 'Pin'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.detailActionButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                    onPress={() => {
                      setDetailModalVisible(false);
                      exportToPDF(detailChecklist.id);
                    }}
                  >
                    <FileText size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[500]} />
                    <Text style={[styles.detailActionText, { color: themeColors.text }]}>Export</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={[styles.detailSectionTitle, { color: themeColors.text }]}>Checklist Items</Text>
                
                {getItemsByCategory(detailChecklist.items).map(group => (
                  <View key={group.category} style={[styles.detailCategoryContainer, { borderColor: themeColors.border }]}>
                    <View style={[styles.detailCategoryHeader, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[100] }]}>
                      <View style={styles.categoryTitleContainer}>
                        {categoryMapping[group.category].icon}
                        <Text style={[styles.detailCategoryTitle, { color: themeColors.text }]}>
                          {categoryMapping[group.category].title}
                        </Text>
                      </View>
                      <Text style={[styles.categoryCount, { color: isDarkMode ? Colors.neutral[400] : Colors.neutral[500] }]}>
                        {group.items.length} items
                      </Text>
                    </View>
                    
                    {group.items.map(item => (
                      <View key={item.id} style={[styles.detailItem, { borderColor: themeColors.border }]}>
                        <View style={styles.detailItemHeader}>
                          <Text style={[styles.detailItemTitle, { color: themeColors.text }]}>{item.title}</Text>
                          <View style={[
                            styles.detailStatusBadge, 
                            item.status === 'pass' ? styles.passBadge : 
                            item.status === 'fail' ? styles.failBadge : 
                            styles.pendingBadge
                          ]}>
                            <Text style={styles.detailStatusText}>
                              {item.status === 'pass' ? 'Pass' : item.status === 'fail' ? 'Fail' : 'Pending'}
                            </Text>
                          </View>
                        </View>
                        
                        {item.comments && (
                          <Text style={[styles.detailItemComments, { color: isDarkMode ? Colors.neutral[300] : Colors.neutral[700] }]}>
                            {item.comments}
                          </Text>
                        )}
                        
                        {item.hasPhoto && item.photoUrl && (
                          <Image source={{ uri: item.photoUrl }} style={styles.detailItemPhoto} />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
                
                {detailChecklist.completed && (
                  <View style={[styles.detailCompletionSection, { borderColor: themeColors.border }]}>
                    <Text style={[styles.detailCompletionTitle, { color: themeColors.text }]}>Completion Information</Text>
                    <View style={styles.detailSignatureContainer}>
                      <Text style={[styles.detailCompletedByText, { color: isDarkMode ? Colors.neutral[300] : Colors.neutral[700] }]}>
                        Completed by:
                      </Text>
                      <Text style={[styles.detailSignatureText, { color: themeColors.accent }]}>
                        {detailChecklist.signature}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
            
            <TouchableOpacity 
              style={styles.closeDetailButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.closeDetailButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* PDF Export Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pdfExportModalVisible}
        onRequestClose={() => setPdfExportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Export PDF Report</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPdfExportModalVisible(false)}
              >
                <X size={20} color={isDarkMode ? Colors.neutral[400] : Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.exportOptionsContainer}>
              <Text style={[styles.exportDescription, { color: themeColors.text }]}>
                Choose export options for your checklist report:
              </Text>
              
              <View style={styles.exportOptionRow}>
                <Text style={[styles.exportOptionLabel, { color: themeColors.text }]}>Include Photos</Text>
                <Switch 
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                  thumbColor={Colors.background}
                />
              </View>
              
              <View style={styles.exportOptionRow}>
                <Text style={[styles.exportOptionLabel, { color: themeColors.text }]}>Include Comments</Text>
                <Switch 
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                  thumbColor={Colors.background}
                />
              </View>
              
              <View style={styles.exportOptionRow}>
                <Text style={[styles.exportOptionLabel, { color: themeColors.text }]}>Include Signature</Text>
                <Switch 
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                  thumbColor={Colors.background}
                />
              </View>
              
              <View style={styles.exportOptionRow}>
                <Text style={[styles.exportOptionLabel, { color: themeColors.text }]}>High Resolution</Text>
                <Switch 
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                  thumbColor={Colors.background}
                />
              </View>
            </View>
            
            <View style={styles.exportActionsContainer}>
              <TouchableOpacity 
                style={[styles.exportActionButton, { backgroundColor: isDarkMode ? '#333333' : Colors.secondary[200] }]}
                onPress={() => {
                  setPdfExportModalVisible(false);
                  
                  // In a real app, this would generate and save the PDF
                  setTimeout(() => {
                    Alert.alert(
                      "PDF Generated",
                      "Your PDF has been saved to Documents.",
                      [{ text: "OK" }]
                    );
                  }, 1000);
                }}
              >
                <Download size={20} color={themeColors.accent} />
                <Text style={[styles.exportActionText, { color: themeColors.accent }]}>Save to Device</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryExportButton}
                onPress={() => {
                  setPdfExportModalVisible(false);
                  
                  // In a real app, this would share the PDF
                  setTimeout(() => {
                    Share.share({
                      title: 'Checklist Report',
                      message: 'Please find attached the checklist report.',
                      url: 'file://checklist-report.pdf'
                    });
                  }, 500);
                }}
              >
                <Upload size={20} color="#FFFFFF" />
                <Text style={styles.primaryExportButtonText}>Share Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Camera Modal for Direct Photo Capture */}
      <Modal
        visible={cameraModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCameraModalVisible(false)}
      >
        <View style={styles.cameraModalContainer}>
          <View style={styles.cameraModalHeader}>
            <Text style={styles.cameraModalTitle}>Ta foto för verifiering</Text>
            <TouchableOpacity 
              onPress={() => setCameraModalVisible(false)}
              style={styles.cameraCloseButton}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <CameraInterface
            isVisible={cameraModalVisible}
            onPhotoTaken={(photoUri, timestamp) => handlePhotoTaken(photoUri)}
            onClose={() => setCameraModalVisible(false)}
            context="checklist"
          />
        </View>
      </Modal>
    </Animated.View>
  </GestureHandlerRootView>
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
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  searchCloseButton: {
    padding: 8,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  viewTypeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  filtersContainer: {
    marginBottom: 16,
  },
  advancedFilters: {
    flexDirection: 'row',
    marginTop: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.secondary[100],
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  activeFilterButton: {
    backgroundColor: Colors.secondary[200],
    borderColor: Colors.primary[300],
  },
  filterButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    marginLeft: 4,
  },
  typeText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
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
  categoryHeaderRight: {
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
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  closeButton: {
    padding: 4,
  },
  sectionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 12,
  },
  imageScrollContainer: {
    marginBottom: 16,
  },
  imageThumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  selectedImageContainer: {
    borderColor: Colors.primary[700],
    borderWidth: 2,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  selectedImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePictureButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.secondary[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary[400],
  },
  takePictureText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[700],
    marginTop: 4,
    textAlign: 'center',
  },
  selectedImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalCommentInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Additional styles for signature modal
  signatureInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    color: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmationContainer: {
    backgroundColor: Colors.secondary[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  confirmationText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  disabledButton: {
    backgroundColor: Colors.neutral[400],
  },
  
  // Timeline styles
  timelineContainer: {
    backgroundColor: 'transparent',
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
  },
  timelineTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timelineItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: Colors.neutral[200],
  },
  timelineDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  timelineItemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  timelineItemProgress: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[500],
  },
  emptyTimelineText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Section styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Compact card styles
  compactChecklistCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  compactChecklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  compactChecklistTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactChecklistDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  compactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactProgressText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Action buttons
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  actionFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary[200],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    marginLeft: 6,
  },
  
  // Detail View Modal styles
  detailScrollView: {
    flex: 1,
  },
  detailHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTitleContainer: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailDate: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  detailSectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 16,
  },
  detailItemComments: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  detailProgressContainer: {
    marginBottom: 16,
  },
  detailProgressLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailProgressBar: {
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  detailProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  detailProgressText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.primary[700],
  },
  detailActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  detailActionText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    marginLeft: 6,
  },
  detailCompletionSection: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 8,
  },
  detailCompletionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailSignatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailCompletedByText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
    marginRight: 6,
  },
  detailSignatureText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
    fontStyle: 'italic',
  },
  closeDetailButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeDetailButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailCategoryContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 8,
    overflow: 'hidden',
  },
  detailCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.secondary[100],
  },
  detailCategoryTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailItem: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  detailItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[900],
    flex: 1,
    marginRight: 8,
  },
  detailStatusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  passBadge: {
    backgroundColor: Colors.status.success,
  },
  failBadge: {
    backgroundColor: Colors.status.error,
  },
  pendingBadge: {
    backgroundColor: Colors.neutral[300],
  },
  detailStatusText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    color: Colors.background,
  },
  detailItemPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginTop: 8,
  },
  
  // Export PDF Modal styles
  exportOptionsContainer: {
    marginBottom: 20,
  },
  exportDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 12,
  },
  exportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exportOptionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[700],
    marginRight: 8,
  },
  exportActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  exportActionText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    marginLeft: 6,
  },
  primaryExportButton: {
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryExportButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // NEW STYLES FOR ENHANCED CHECKLIST FEATURES
  
  // Mandatory item styles
  mandatoryItem: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.status.warning,
  },
  itemTitleContainer: {
    flex: 1,
  },
  mandatoryBadge: {
    backgroundColor: Colors.status.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  mandatoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },

  // Enhanced status button styles (combined with existing styles above)
  enhancedPendingButton: {
    backgroundColor: Colors.neutral[300],
  },
  enhancedFailButton: {
    backgroundColor: Colors.status.error,
  },

  // Direct photo button (Messenger style)
  directPhotoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  photoCountText: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.status.success,
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    borderRadius: 8,
    width: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Photo display with timestamp
  photoContainer: {
    marginTop: 8,
  },
  photoTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  timestampText: {
    fontSize: 11,
    color: Colors.neutral[500],
    marginLeft: 4,
  },

  // Required photo indicator
  photoRequiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.warning + '20',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  photoRequiredText: {
    flex: 1,
    fontSize: 12,
    color: Colors.status.warning,
    marginLeft: 6,
  },
  takePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  takePhotoText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },

  // Camera modal styles
  cameraModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  cameraModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cameraModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cameraCloseButton: {
    padding: 8,
  },
});