import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Platform,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState
} from 'react-native';
import { 
  ChevronLeft, 
  Camera, 
  CheckCircle2, 
  XCircle,
  CircleMinus,
  Info,
  CheckCircle, 
  Clock,
  User,
  PenLine
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

export type CheckItemStatus = 'passed' | 'failed' | 'not_applicable' | 'not_checked';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  status: CheckItemStatus;
  requiresPhoto: boolean;
  photoUri?: string;
  comment?: string;
  timestamp?: string;
  userId?: string;
  categoryId: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistDetailProps {
  id: string;
  title: string;
  description: string;
  categories: ChecklistCategory[];
  onBack: () => void;
  onSave: (categories: ChecklistCategory[]) => void;
  onComplete: (categories: ChecklistCategory[]) => void;
}

export default function ChecklistDetail({
  id,
  title,
  description,
  categories: initialCategories,
  onBack,
  onSave,
  onComplete
}: ChecklistDetailProps) {
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialCategories);
  const [signature, setSignature] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<Record<string, boolean>>({});
  const [activeSwipeItem, setActiveSwipeItem] = useState<string | null>(null);
  const swipeAnimations = React.useRef<{[key: string]: Animated.Value}>({}).current;
  
  // Calculate completion stats
  const totalItems = categories.reduce((sum, category) => sum + category.items.length, 0);
  const checkedItems = categories.reduce((sum, category) => {
    return sum + category.items.filter(item => item.status !== 'not_checked').length;
  }, 0);
  const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  // Initialize swipe animation for a new item if needed
  const getSwipeAnimation = (itemId: string) => {
    if (!swipeAnimations[itemId]) {
      swipeAnimations[itemId] = new Animated.Value(0);
    }
    return swipeAnimations[itemId];
  };
  
  // Create pan responder for swipe gestures
  const createPanResponder = (itemId: string, categoryId: string) => {
    const animation = getSwipeAnimation(itemId);
    
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderGrant: () => {
        setActiveSwipeItem(itemId);
      },
      onPanResponderMove: (_, gestureState) => {
        // Limit the drag to a reasonable distance
        const { dx } = gestureState;
        const x = Math.min(200, Math.max(-200, dx));
        animation.setValue(x);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        
        // Determine the status based on swipe direction and distance
        if (dx > 100) {
          // Right swipe - pass
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          updateItemStatus(categoryId, itemId, 'passed');
          Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
          }).start();
        } else if (dx < -100) {
          // Left swipe - fail
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          updateItemStatus(categoryId, itemId, 'failed');
          Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
          }).start();
        } else {
          // Not far enough, reset position
          Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: false,
            friction: 5
          }).start();
        }
        
        setActiveSwipeItem(null);
      }
    });
  };
  
  const toggleInstructions = (itemId: string) => {
    setShowInstructions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const updateItemStatus = (categoryId: string, itemId: string, status: CheckItemStatus) => {
    const now = new Date().toISOString();
    const userId = 'current-user'; // In a real app, get this from authentication
    
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      if (status === 'passed') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (status === 'failed') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  status,
                  timestamp: now,
                  userId
                };
              }
              return item;
            })
          };
        }
        return category;
      })
    );
  };
  
  const updateItemComment = (categoryId: string, itemId: string, comment: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  comment
                };
              }
              return item;
            })
          };
        }
        return category;
      })
    );
  };
  
  const addItemPhoto = (categoryId: string, itemId: string, photoUri: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return {
                  ...item,
                  photoUri
                };
              }
              return item;
            })
          };
        }
        return category;
      })
    );
  };
  
  const getStatusColor = (status: CheckItemStatus) => {
    switch (status) {
      case 'passed':
        return Colors.status.success;
      case 'failed':
        return Colors.status.error;
      case 'not_applicable':
        return Colors.neutral[400];
      default:
        return Colors.secondary[300];
    }
  };
  
  const getStatusIcon = (status: CheckItemStatus) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 size={24} color={Colors.status.success} />;
      case 'failed':
        return <XCircle size={24} color={Colors.status.error} />;
      case 'not_applicable':
        return <CircleMinus size={24} color={Colors.neutral[400]} />;
      default:
        return <CheckCircle size={24} color={Colors.secondary[300]} stroke="#e5e5e5" strokeWidth={1.5} />;
    }
  };
  
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const handleSave = () => {
    onSave(categories);
  };
  
  const handleComplete = () => {
    if (completionPercentage === 100) {
      onComplete(categories);
    } else {
      // Show warning that not all items are completed
      alert("Please complete all items before submitting.");
    }
  };
  
  const renderChecklistItem = (item: ChecklistItem, categoryId: string) => {
    const panResponder = createPanResponder(item.id, categoryId);
    const swipeAnim = getSwipeAnimation(item.id);
    
    // Determine background colors for swipe feedback
    const bgColorInterpolate = swipeAnim.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [Colors.status.error + '30', 'transparent', Colors.status.success + '30']
    });
    
    // Determine text hint for swipe feedback
    const leftActionOpacity = swipeAnim.interpolate({
      inputRange: [-200, -50, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp'
    });
    
    const rightActionOpacity = swipeAnim.interpolate({
      inputRange: [0, 50, 200],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp'
    });
    
    return (
      <View key={item.id} style={styles.checklistItemContainer}>
        <Animated.View 
          style={[
            styles.swipeContainer, 
            { backgroundColor: bgColorInterpolate }
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View 
            style={[
              styles.swipeHintLeft, 
              { opacity: leftActionOpacity }
            ]}
          >
            <XCircle size={24} color={Colors.status.error} />
            <Text style={styles.swipeHintText}>Failed</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.swipeHintRight, 
              { opacity: rightActionOpacity }
            ]}
          >
            <CheckCircle2 size={24} color={Colors.status.success} />
            <Text style={styles.swipeHintText}>Passed</Text>
          </Animated.View>
          
          <View style={styles.itemHeader}>
            <View style={styles.titleRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.instructions && (
                <TouchableOpacity 
                  onPress={() => toggleInstructions(item.id)}
                  style={styles.infoButton}
                >
                  <Info size={16} color={Colors.primary[700]} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          
          {/* Instructions (expandable) */}
          {item.instructions && showInstructions[item.id] && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>{item.instructions}</Text>
            </View>
          )}
          
          {/* Status Selector (Segmented Control) */}
          <View style={styles.statusSelector}>
            <TouchableOpacity 
              style={[
                styles.statusSegment,
                styles.statusSegmentLeft,
                item.status === 'passed' && styles.statusSegmentActive,
                item.status === 'passed' && { backgroundColor: Colors.status.success }
              ]}
              onPress={() => updateItemStatus(categoryId, item.id, 'passed')}
            >
              <CheckCircle2 
                size={16} 
                color={item.status === 'passed' ? '#fff' : Colors.status.success} 
              />
              <Text 
                style={[
                  styles.statusSegmentText,
                  item.status === 'passed' && styles.statusSegmentTextActive
                ]}
              >
                Pass
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusSegment,
                item.status === 'failed' && styles.statusSegmentActive,
                item.status === 'failed' && { backgroundColor: Colors.status.error }
              ]}
              onPress={() => updateItemStatus(categoryId, item.id, 'failed')}
            >
              <XCircle 
                size={16} 
                color={item.status === 'failed' ? '#fff' : Colors.status.error} 
              />
              <Text 
                style={[
                  styles.statusSegmentText,
                  item.status === 'failed' && styles.statusSegmentTextActive
                ]}
              >
                Fail
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusSegment,
                styles.statusSegmentRight,
                item.status === 'not_applicable' && styles.statusSegmentActive,
                item.status === 'not_applicable' && { backgroundColor: Colors.neutral[400] }
              ]}
              onPress={() => updateItemStatus(categoryId, item.id, 'not_applicable')}
            >
              <CircleMinus 
                size={16} 
                color={item.status === 'not_applicable' ? '#fff' : Colors.neutral[400]} 
              />
              <Text 
                style={[
                  styles.statusSegmentText,
                  item.status === 'not_applicable' && styles.statusSegmentTextActive
                ]}
              >
                N/A
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Photo Section */}
          {(item.requiresPhoto || item.photoUri) && (
            <View style={styles.photoSection}>
              {item.photoUri ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: item.photoUri }} style={styles.photoPreview} />
                  <TouchableOpacity 
                    style={styles.retakeButton}
                    onPress={() => {
                      // In a real app, open the camera
                      alert('Camera would open here');
                      // For demo, we'll just simulate a new photo
                      addItemPhoto(categoryId, item.id, 'https://picsum.photos/200/300');
                    }}
                  >
                    <Camera size={16} color="#fff" />
                    <Text style={styles.retakeButtonText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={() => {
                    // In a real app, open the camera
                    alert('Camera would open here');
                    // For demo, we'll just simulate a new photo
                    addItemPhoto(categoryId, item.id, 'https://picsum.photos/200/300');
                  }}
                >
                  <Camera size={20} color={Colors.primary[700]} />
                  <Text style={styles.addPhotoText}>
                    {item.requiresPhoto ? 'Add Required Photo' : 'Add Photo (Optional)'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Comment Section */}
          <View style={styles.commentSection}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add comment (optional)"
              value={item.comment}
              onChangeText={(text) => updateItemComment(categoryId, item.id, text)}
              multiline
            />
          </View>
          
          {/* Timestamp and User */}
          {item.timestamp && (
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={12} color={Colors.neutral[500]} />
                <Text style={styles.metaText}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              {item.userId && (
                <View style={styles.metaItem}>
                  <User size={12} color={Colors.neutral[500]} />
                  <Text style={styles.metaText}>{item.userId}</Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.neutral[800]} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerDescription}>{description}</Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${completionPercentage}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>{completionPercentage}% Complete</Text>
      </View>
      
      {/* Checklist Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item) => renderChecklistItem(item, category.id))}
          </View>
        ))}
        
        {/* Digital Signature */}
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureTitle}>Digital Signature</Text>
          <TextInput
            style={styles.signatureInput}
            placeholder="Type your full name to sign"
            value={signature}
            onChangeText={setSignature}
          />
          <Text style={styles.signatureDisclaimer}>
            By signing, you confirm that all checks have been properly completed
            and the information provided is accurate.
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <PenLine size={20} color={Colors.neutral[800]} />
            <Text style={styles.saveButtonText}>Save Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.completeButton,
              completionPercentage < 100 && styles.disabledButton
            ]}
            onPress={handleComplete}
            disabled={completionPercentage < 100}
          >
            <CheckCircle2 size={20} color="#FFF" />
            <Text style={styles.completeButtonText}>Complete & Submit</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary[200],
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  headerDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.secondary[200],
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[700],
    borderRadius: 2,
  },
  progressText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[600],
    textAlign: 'right',
  },
  scrollContainer: {
    flex: 1,
  },
  categoryContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  checklistItemContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  itemHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    flex: 1,
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  itemDescription: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  instructionsContainer: {
    backgroundColor: Colors.secondary[200],
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  instructionsText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[800],
    lineHeight: 20,
  },
  statusSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  statusSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderRightWidth: 1,
    borderRightColor: Colors.neutral[300],
  },
  statusSegmentLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  statusSegmentRight: {
    borderRightWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  statusSegmentActive: {
    backgroundColor: Colors.primary[700],
  },
  statusSegmentText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[800],
    marginLeft: 6,
    fontWeight: '500',
  },
  statusSegmentTextActive: {
    color: '#FFFFFF',
  },
  photoSection: {
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  retakeButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[700],
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 16,
    backgroundColor: Colors.secondary[100],
  },
  addPhotoText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 8,
  },
  commentSection: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: 4,
    padding: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  signatureContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  signatureTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    marginBottom: 12,
  },
  signatureInput: {
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: 4,
    padding: 10,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    marginBottom: 8,
  },
  signatureDisclaimer: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    color: Colors.neutral[600],
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 32,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.secondary[200],
  },
  saveButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[800],
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: Colors.primary[700],
  },
  completeButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: Colors.neutral[400],
  },
  swipeContainer: {
    position: 'relative',
    padding: 16,
  },
  swipeHintLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  swipeHintRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  swipeHintText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
}); 