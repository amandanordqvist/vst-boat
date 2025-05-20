import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  Alert
} from 'react-native';
import { 
  ChevronLeft, 
  Check, 
  Trash2, 
  Plus, 
  GripHorizontal,
  Camera
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ChecklistCategory, ChecklistItem } from './ChecklistDetail';

interface CreateChecklistProps {
  onBack: () => void;
  onSave: (title: string, description: string, categories: ChecklistCategory[]) => void;
}

export default function CreateChecklist({ onBack, onSave }: CreateChecklistProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<ChecklistCategory[]>([{
    id: '1',
    title: 'General',
    items: []
  }]);
  
  const addCategory = () => {
    const newId = String(categories.length + 1);
    setCategories([...categories, {
      id: newId,
      title: `Category ${newId}`,
      items: []
    }]);
  };
  
  const updateCategoryTitle = (id: string, newTitle: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id ? { ...category, title: newTitle } : category
      )
    );
  };
  
  const deleteCategory = (id: string) => {
    if (categories.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one category.');
      return;
    }
    
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== id)
    );
  };
  
  const addItem = (categoryId: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          const newItem: ChecklistItem = {
            id: `${categoryId}-${category.items.length + 1}`,
            title: '',
            description: '',
            instructions: '',
            status: 'not_checked',
            requiresPhoto: false,
            categoryId
          };
          
          return {
            ...category,
            items: [...category.items, newItem]
          };
        }
        return category;
      })
    );
  };
  
  const updateItem = (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          };
        }
        return category;
      })
    );
  };
  
  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter(item => item.id !== itemId)
          };
        }
        return category;
      })
    );
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a checklist title.');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a checklist description.');
      return false;
    }
    
    // Check if all categories have titles
    const invalidCategory = categories.find(category => !category.title.trim());
    if (invalidCategory) {
      Alert.alert('Error', 'All categories must have titles.');
      return false;
    }
    
    // Check if all items have titles and descriptions
    for (const category of categories) {
      for (const item of category.items) {
        if (!item.title.trim()) {
          Alert.alert('Error', `Item in ${category.title} is missing a title.`);
          return false;
        }
        if (!item.description.trim()) {
          Alert.alert('Error', `"${item.title}" is missing a description.`);
          return false;
        }
      }
    }
    
    // Check if at least one item exists across all categories
    const totalItems = categories.reduce((sum, category) => sum + category.items.length, 0);
    if (totalItems === 0) {
      Alert.alert('Error', 'Please add at least one item to your checklist.');
      return false;
    }
    
    return true;
  };
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(title, description, categories);
    }
  };
  
  const renderItem = (item: ChecklistItem, categoryId: string) => {
    return (
      <View key={item.id} style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <GripHorizontal size={20} color={Colors.neutral[400]} style={styles.dragHandle} />
          
          <View style={styles.itemTitleContainer}>
            <TextInput
              style={styles.itemTitleInput}
              placeholder="Item title"
              value={item.title}
              onChangeText={text => updateItem(categoryId, item.id, { title: text })}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteItem(categoryId, item.id)}
          >
            <Trash2 size={18} color={Colors.status.error} />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.descriptionInput}
          placeholder="Item description"
          value={item.description}
          onChangeText={text => updateItem(categoryId, item.id, { description: text })}
          multiline
        />
        
        <TextInput
          style={styles.instructionsInput}
          placeholder="Instructions (optional)"
          value={item.instructions}
          onChangeText={text => updateItem(categoryId, item.id, { instructions: text })}
          multiline
        />
        
        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <View style={styles.optionLabelContainer}>
              <Camera size={16} color={Colors.primary[700]} />
              <Text style={styles.optionLabel}>Require Photo</Text>
            </View>
            <Switch
              value={item.requiresPhoto}
              onValueChange={value => updateItem(categoryId, item.id, { requiresPhoto: value })}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
              thumbColor={item.requiresPhoto ? Colors.primary[700] : Colors.neutral[100]}
            />
          </View>
        </View>
      </View>
    );
  };
  
  const renderCategory = (category: ChecklistCategory, index: number) => {
    return (
      <View key={category.id} style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <TextInput
            style={styles.categoryTitleInput}
            placeholder="Category Title"
            value={category.title}
            onChangeText={text => updateCategoryTitle(category.id, text)}
          />
          
          {categories.length > 1 && (
            <TouchableOpacity 
              style={styles.deleteCategoryButton}
              onPress={() => deleteCategory(category.id)}
            >
              <Trash2 size={20} color={Colors.status.error} />
            </TouchableOpacity>
          )}
        </View>
        
        {category.items.map(item => renderItem(item, category.id))}
        
        <TouchableOpacity 
          style={styles.addItemButton}
          onPress={() => addItem(category.id)}
        >
          <Plus size={16} color={Colors.primary[700]} />
          <Text style={styles.addItemText}>Add Item</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Create New Checklist</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Check size={20} color="#FFF" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputWithLabel}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={[styles.titleInput, !title.trim() && styles.inputMissing]}
              placeholder="Enter checklist title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.inputWithLabel}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.descriptionInput, !description.trim() && styles.inputMissing]}
              placeholder="Enter a clear description of this checklist's purpose"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Tips for effective checklists:</Text>
            <Text style={styles.infoCardText}>• Use clear, actionable item titles</Text>
            <Text style={styles.infoCardText}>• Add detailed instructions for complex items</Text>
            <Text style={styles.infoCardText}>• Group similar items into categories</Text>
            <Text style={styles.infoCardText}>• Add photo requirements for visual verification</Text>
          </View>
        </View>
        
        {/* Categories */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Categories & Items</Text>
          
          {categories.map(renderCategory)}
          
          <TouchableOpacity 
            style={styles.addCategoryButton}
            onPress={addCategory}
          >
            <Plus size={16} color="#FFF" />
            <Text style={styles.addCategoryText}>Add Category</Text>
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
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary[200],
  },
  backButton: {
    padding: 4,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  titleInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  descriptionInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  inputWithLabel: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 6,
  },
  inputMissing: {
    borderColor: Colors.status.error + '60',
    backgroundColor: Colors.status.error + '10',
  },
  infoCard: {
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[700],
  },
  infoCardTitle: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
    marginBottom: 8,
  },
  infoCardText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[800],
    marginBottom: 4,
    lineHeight: 20,
  },
  categoryContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitleInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
    backgroundColor: Colors.secondary[100],
    borderRadius: 4,
    padding: 8,
  },
  deleteCategoryButton: {
    marginLeft: 12,
    padding: 4,
  },
  itemContainer: {
    backgroundColor: Colors.secondary[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dragHandle: {
    marginRight: 8,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitleInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    padding: 6,
    backgroundColor: Colors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondary[300],
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  instructionsInput: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.secondary[300],
    borderRadius: 4,
    padding: 8,
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  optionsContainer: {
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.primary[700],
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  addItemText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 8,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[700],
    paddingVertical: 12,
    borderRadius: 8,
  },
  addCategoryText: {
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
}); 