import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type FormSection = 'basic' | 'physical' | 'systems' | 'documentation';

interface VesselRegistrationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function VesselRegistrationForm({ onSubmit, onCancel }: VesselRegistrationFormProps) {
  const [currentSection, setCurrentSection] = useState<FormSection>('basic');
  
  // State for form data
  const [formData, setFormData] = useState({
    // Basic information
    vesselName: '',
    registrationNumber: '',
    vesselType: '',
    manufacturer: '',
    model: '',
    yearBuilt: '',
    
    // Physical specifications
    lengthOverall: '',
    beam: '',
    draft: '',
    displacement: '',
    hullMaterial: '',
    maxCapacity: '',
    
    // Systems
    engines: '',
    horsepower: '',
    maxSpeed: '',
    fuelCapacity: '',
    freshWaterCapacity: '',
    generator: '',
    
    // Documentation
    insurancePolicy: '',
    insuranceExpiry: '',
    homePort: '',
    registrationExpiry: '',
  });
  
  // Update form field
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Navigate to the next section
  const goToNextSection = () => {
    switch (currentSection) {
      case 'basic':
        setCurrentSection('physical');
        break;
      case 'physical':
        setCurrentSection('systems');
        break;
      case 'systems':
        setCurrentSection('documentation');
        break;
      case 'documentation':
        // Submit form on last section
        handleSubmit();
        break;
    }
  };
  
  // Navigate to the previous section
  const goToPreviousSection = () => {
    switch (currentSection) {
      case 'physical':
        setCurrentSection('basic');
        break;
      case 'systems':
        setCurrentSection('physical');
        break;
      case 'documentation':
        setCurrentSection('systems');
        break;
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  // Render input field with label
  const renderField = (label: string, field: keyof typeof formData) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </View>
  );
  
  // Render current section
  const renderSection = () => {
    switch (currentSection) {
      case 'basic':
        return (
          <>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {renderField('Vessel Name', 'vesselName')}
            {renderField('Registration Number', 'registrationNumber')}
            {renderField('Vessel Type', 'vesselType')}
            {renderField('Manufacturer', 'manufacturer')}
            {renderField('Model', 'model')}
            {renderField('Year Built', 'yearBuilt')}
          </>
        );
      case 'physical':
        return (
          <>
            <Text style={styles.sectionTitle}>Physical Specifications</Text>
            {renderField('Length Overall (ft/m)', 'lengthOverall')}
            {renderField('Beam (ft/m)', 'beam')}
            {renderField('Draft (ft/m)', 'draft')}
            {renderField('Displacement (tons)', 'displacement')}
            {renderField('Hull Material', 'hullMaterial')}
            {renderField('Maximum Capacity (passengers)', 'maxCapacity')}
          </>
        );
      case 'systems':
        return (
          <>
            <Text style={styles.sectionTitle}>Systems & Performance</Text>
            {renderField('Main Engines', 'engines')}
            {renderField('Horsepower', 'horsepower')}
            {renderField('Maximum Speed (knots)', 'maxSpeed')}
            {renderField('Fuel Capacity (gallons)', 'fuelCapacity')}
            {renderField('Fresh Water Capacity (gallons)', 'freshWaterCapacity')}
            {renderField('Generator', 'generator')}
          </>
        );
      case 'documentation':
        return (
          <>
            <Text style={styles.sectionTitle}>Documentation & Compliance</Text>
            {renderField('Insurance Policy Number', 'insurancePolicy')}
            {renderField('Insurance Expiry Date', 'insuranceExpiry')}
            {renderField('Home Port', 'homePort')}
            {renderField('Registration Expiry Date', 'registrationExpiry')}
          </>
        );
      default:
        return null;
    }
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentSection) {
      case 'basic': return 25;
      case 'physical': return 50;
      case 'systems': return 75;
      case 'documentation': return 100;
      default: return 0;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Your Vessel</Text>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{`${getProgressPercentage()}%`}</Text>
      </View>
      
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderSection()}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {currentSection !== 'basic' && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={goToPreviousSection}
          >
            <ChevronLeft size={20} color={Colors.primary[700]} />
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={goToNextSection}
        >
          <Text style={styles.primaryButtonText}>
            {currentSection === 'documentation' ? 'Submit' : 'Next'}
          </Text>
          {currentSection !== 'documentation' && (
            <ChevronRight size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primary[700],
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    width: 40,
    textAlign: 'right',
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    fontFamily: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: Colors.primary[600],
    marginLeft: 'auto',
  },
  secondaryButton: {
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  primaryButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.background,
    marginRight: 6,
  },
  secondaryButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 12,
  },
  cancelButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[600],
  },
}); 