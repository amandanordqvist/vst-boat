import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Modal, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Droplets, TrendingUp, History, Plus, CircleGauge as GaugeCircle, Calendar, DollarSign, 
  ChevronRight, AlertTriangle, Clock, Fuel, Filter, Search, MapPin, Camera, Receipt, 
  Target, PieChart, BarChart, Download, Settings, Wallet, TrendingDown, Navigation,
  Star, Phone, ExternalLink, Share, Archive, FileText
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import CameraInterface from '@/components/CameraInterface';

interface FuelLog {
  id: string;
  date: string;
  time: string;
  amount: number;
  cost: number;
  pricePerGallon: number;
  location: string;
  stationId?: string;
  engineHours?: number;
  isFullFill?: boolean;
  odometerReading?: number;
  receiptPhoto?: string;
  paymentMethod?: 'Cash' | 'Card' | 'Mobile';
  notes?: string;
  fuelType?: 'Regular' | 'Premium' | 'Diesel';
  weather?: string;
  tripPurpose?: string;
}

interface FuelStation {
  id: string;
  name: string;
  address: string;
  distance: number;
  currentPrice: number;
  rating: number;
  amenities: string[];
  phone?: string;
  isOpen: boolean;
  openHours: string;
}

const mockFuelStations: FuelStation[] = [
  {
    id: '1',
    name: 'Marina Bay Fuel Station',
    address: '123 Harbor Blvd, Marina Bay',
    distance: 0.8,
    currentPrice: 4.15,
    rating: 4.7,
    amenities: ['24/7', 'Restrooms', 'Snacks'],
    phone: '(555) 123-4567',
    isOpen: true,
    openHours: '24/7'
  },
  {
    id: '2',
    name: 'Coastal Marine Fueling',
    address: '456 Waterfront Ave',
    distance: 1.2,
    currentPrice: 4.08,
    rating: 4.5,
    amenities: ['Pump Station', 'Oil Changes'],
    phone: '(555) 234-5678',
    isOpen: true,
    openHours: '6 AM - 10 PM'
  },
  {
    id: '3',
    name: 'Harbor Point Gas',
    address: '789 Pier Street',
    distance: 2.1,
    currentPrice: 4.22,
    rating: 4.3,
    amenities: ['Restrooms', 'Marine Supplies'],
    phone: '(555) 345-6789',
    isOpen: false,
    openHours: '7 AM - 9 PM'
  }
];

const fuelLogs: FuelLog[] = [
  {
    id: '1',
    date: '2025-01-02',
    time: '14:30',
    amount: 80,
    cost: 332,
    pricePerGallon: 4.15,
    location: 'Marina Bay Fuel Station',
    stationId: '1',
    engineHours: 142.5,
    isFullFill: true,
    odometerReading: 1250,
    paymentMethod: 'Card',
    fuelType: 'Regular',
    notes: 'Full tank before weekend trip',
    weather: 'Sunny, 72°F'
  },
  {
    id: '2',
    date: '2024-12-28',
    time: '10:15',
    amount: 65,
    cost: 265.2,
    pricePerGallon: 4.08,
    location: 'Coastal Marine Fueling',
    stationId: '2',
    engineHours: 138.2,
    isFullFill: false,
    odometerReading: 1180,
    paymentMethod: 'Cash',
    fuelType: 'Regular',
    notes: 'Quick top-off'
  },
  {
    id: '3',
    date: '2024-12-20',
    time: '16:45',
    amount: 75,
    cost: 316.5,
    pricePerGallon: 4.22,
    location: 'Harbor Point Gas',
    stationId: '3',
    engineHours: 130.0,
    isFullFill: true,
    odometerReading: 1120,
    paymentMethod: 'Mobile',
    fuelType: 'Premium'
  }
];

interface BudgetData {
  monthlyBudget: number;
  currentSpent: number;
  projectedSpent: number;
  daysRemaining: number;
}

const budgetData: BudgetData = {
  monthlyBudget: 800,
  currentSpent: 597.2,
  projectedSpent: 750,
  daysRemaining: 12
};

const screenWidth = Dimensions.get('window').width;

// Enhanced Fuel Gauge with animation and better visuals
const FuelGauge = ({ level }: { level: number }) => {
  const rotation = useSharedValue(0);
  const fillAnimation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withSpring((level / 100) * 360);
    fillAnimation.value = withSpring(level / 100);
  }, [level]);
  
  const gaugeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  const fillStyle = useAnimatedStyle(() => {
    const fillOpacity = interpolate(
      fillAnimation.value,
      [0, 0.3, 1],
      [0.3, 0.6, 0.85],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: fillOpacity,
    };
  });
  
  // Determine gauge color based on fuel level
  const getGaugeGradient = () => {
    if (level <= 20) return [Colors.status.error, '#FF8A65'];
    if (level <= 40) return ['#FFA726', Colors.accent[500]];
    return [Colors.primary[400], Colors.primary[600]];
  };
  
  const gradientColors = getGaugeGradient();
  
  // Determine text colors based on fuel level
  const getTextColor = () => {
    if (level <= 20) return Colors.status.error;
    if (level <= 40) return Colors.accent[500];
    return Colors.primary[600];
  };
  
  const textColor = getTextColor();
  
  // Last refuel date from most recent log
  const lastRefuelDate = fuelLogs.length > 0 ? fuelLogs[0].date : "N/A";
  
  // Calculate estimated range and time remaining
  const avgConsumption = 12.5; // gallons/hour
  const currentGallons = Math.round(level * 1.5); // Assuming 150 gallon tank
  const estimatedRange = Math.round(currentGallons * 2.8); // ~2.8 nm per gallon
  const estimatedTimeRemaining = Math.round(currentGallons / avgConsumption);
  
  return (
    <View style={styles.gaugeContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)']}
        style={styles.gaugeCard}
      >
        <View style={styles.gaugeHeader}>
          <View>
            <Text style={styles.gaugeTitle}>Current Fuel Level</Text>
            <View style={styles.lastRefuelContainer}>
              <Calendar size={12} color={Colors.neutral[500]} />
              <Text style={styles.lastRefuelText}>Last refuel: {lastRefuelDate}</Text>
            </View>
          </View>
          {level <= 20 && (
            <View style={styles.warningBadge}>
              <AlertTriangle size={12} color="#FFFFFF" />
              <Text style={styles.warningText}>Low Fuel</Text>
            </View>
          )}
        </View>
        
        <View style={styles.gaugeGraphic}>
          <View style={styles.gaugeCircle}>
            <View style={styles.gaugeBackground} />
            
            <Animated.View style={[styles.gaugeFill, { width: `${level}%` }]}>
              <LinearGradient
                colors={[gradientColors[0], gradientColors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
              />
            </Animated.View>
            
            <View style={styles.gaugeLabels}>
              <Text style={[styles.gaugeLabel, styles.emptyLabel]}>E</Text>
              <Text style={[styles.gaugeLabel, styles.quarterLabel]}>¼</Text>
              <Text style={[styles.gaugeLabel, styles.halfLabel]}>½</Text>
              <Text style={[styles.gaugeLabel, styles.threeQuarterLabel]}>¾</Text>
              <Text style={[styles.gaugeLabel, styles.fullLabel]}>F</Text>
            </View>
            
            <View style={styles.gaugeCenter}>
              <GaugeCircle size={32} color={textColor} />
              <Text style={[styles.gaugeText, { color: textColor }]}>{level}%</Text>
              <Text style={styles.gaugeEstimate}>{currentGallons} gallons</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.gaugeInfoSection}>
          <View style={styles.gaugeInfoItem}>
            <Navigation size={14} color={Colors.primary[700]} />
            <Text style={styles.gaugeInfoText}>Range: ~{estimatedRange} nm</Text>
          </View>
          <View style={styles.gaugeInfoDivider} />
          <View style={styles.gaugeInfoItem}>
            <Clock size={14} color={Colors.primary[700]} />
            <Text style={styles.gaugeInfoText}>Est. time: ~{estimatedTimeRemaining} hrs</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Budget Progress Component
const BudgetProgress = () => {
  const progressPercentage = (budgetData.currentSpent / budgetData.monthlyBudget) * 100;
  const isOverBudget = budgetData.projectedSpent > budgetData.monthlyBudget;
  
  return (
    <View style={styles.budgetContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)']}
        style={styles.budgetCard}
      >
        <View style={styles.budgetHeader}>
          <View style={styles.budgetTitleContainer}>
            <Wallet size={18} color={Colors.primary[600]} />
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
          </View>
          <TouchableOpacity style={styles.budgetSettingsButton}>
            <Settings size={16} color={Colors.neutral[600]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.budgetAmounts}>
          <View style={styles.budgetAmountItem}>
            <Text style={styles.budgetAmountLabel}>Spent</Text>
            <Text style={styles.budgetAmountValue}>${budgetData.currentSpent.toFixed(0)}</Text>
          </View>
          <View style={styles.budgetAmountDivider} />
          <View style={styles.budgetAmountItem}>
            <Text style={styles.budgetAmountLabel}>Budget</Text>
            <Text style={styles.budgetAmountValue}>${budgetData.monthlyBudget}</Text>
          </View>
          <View style={styles.budgetAmountDivider} />
          <View style={styles.budgetAmountItem}>
            <Text style={styles.budgetAmountLabel}>Remaining</Text>
            <Text style={[
              styles.budgetAmountValue, 
              { color: isOverBudget ? Colors.status.error : Colors.status.success }
            ]}>
              ${(budgetData.monthlyBudget - budgetData.currentSpent).toFixed(0)}
            </Text>
          </View>
        </View>
        
        <View style={styles.budgetProgressContainer}>
          <View style={styles.budgetProgressBar}>
            <View 
              style={[
                styles.budgetProgressFill, 
                { 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  backgroundColor: progressPercentage > 80 ? Colors.status.error : Colors.primary[500]
                }
              ]} 
            />
          </View>
          <Text style={styles.budgetProgressText}>{progressPercentage.toFixed(0)}% used</Text>
        </View>
        
        {isOverBudget && (
          <View style={styles.budgetWarning}>
            <AlertTriangle size={14} color={Colors.status.error} />
            <Text style={styles.budgetWarningText}>
              Projected to exceed budget by ${(budgetData.projectedSpent - budgetData.monthlyBudget).toFixed(0)}
            </Text>
          </View>
        )}
        
        <Text style={styles.budgetFooterText}>
          {budgetData.daysRemaining} days remaining in month
        </Text>
      </LinearGradient>
    </View>
  );
};

// Enhanced Stats with analytics
const FuelStats = () => {
  const avgPrice = fuelLogs.reduce((sum, log) => sum + log.pricePerGallon, 0) / fuelLogs.length;
  const totalSpent = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const avgConsumption = 12.5;
  const efficiencyTrend = "+5.2%";
  
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <TrendingUp size={18} color={Colors.primary[600]} />
          <Text style={styles.statTitle}>Efficiency</Text>
        </View>
        <Text style={styles.statValue}>{avgConsumption}</Text>
        <Text style={styles.statUnit}>gal/hour</Text>
        <View style={styles.statTrend}>
          <Text style={styles.statTrendText}>{efficiencyTrend} vs last month</Text>
        </View>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <DollarSign size={18} color={Colors.primary[600]} />
          <Text style={styles.statTitle}>Avg. Price</Text>
        </View>
        <Text style={styles.statValue}>${avgPrice.toFixed(2)}</Text>
        <Text style={styles.statUnit}>per gallon</Text>
        <View style={[styles.statTrend, styles.statTrendDown]}>
          <Text style={styles.statTrendTextDown}>-$0.08 this week</Text>
        </View>
      </View>
    </View>
  );
};

// Fuel Station Locator
const FuelStationLocator = ({ onSelectStation }: { onSelectStation: (station: FuelStation) => void }) => {
  const [showStations, setShowStations] = useState(false);
  
  return (
    <View style={styles.stationLocatorContainer}>
      <TouchableOpacity 
        style={styles.stationLocatorButton}
        onPress={() => setShowStations(!showStations)}
      >
    <LinearGradient
          colors={[Colors.accent[500], Colors.accent[600]]}
          style={styles.stationLocatorGradient}
        >
          <View style={styles.stationLocatorContent}>
            <View style={styles.stationLocatorIcon}>
              <MapPin size={24} color="#FFFFFF" />
        </View>
            <View style={styles.stationLocatorText}>
              <Text style={styles.stationLocatorTitle}>Find Fuel Stations</Text>
              <Text style={styles.stationLocatorDesc}>Nearby stations with current prices</Text>
        </View>
        <ChevronRight size={22} color="#FFFFFF" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
      
      {showStations && (
        <View style={styles.stationsList}>
          {mockFuelStations.map((station) => (
            <TouchableOpacity 
              key={station.id} 
              style={styles.stationCard}
              onPress={() => onSelectStation(station)}
            >
              <View style={styles.stationCardHeader}>
                <View>
                  <Text style={styles.stationName}>{station.name}</Text>
                  <Text style={styles.stationAddress}>{station.address}</Text>
                </View>
                <View style={styles.stationPrice}>
                  <Text style={styles.stationPriceText}>${station.currentPrice}</Text>
                  <Text style={styles.stationPriceUnit}>/gal</Text>
                </View>
              </View>
              
              <View style={styles.stationDetails}>
                <View style={styles.stationDetail}>
                  <MapPin size={12} color={Colors.neutral[500]} />
                  <Text style={styles.stationDetailText}>{station.distance} miles</Text>
                </View>
                <View style={styles.stationDetail}>
                  <Star size={12} color={Colors.accent[500]} />
                  <Text style={styles.stationDetailText}>{station.rating}</Text>
                </View>
                <View style={[styles.stationDetail, styles.stationStatus]}>
                  <View style={[
                    styles.stationStatusDot, 
                    { backgroundColor: station.isOpen ? Colors.status.success : Colors.status.error }
                  ]} />
                  <Text style={styles.stationDetailText}>
                    {station.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
              
              {station.phone && (
                <TouchableOpacity style={styles.stationPhoneButton}>
                  <Phone size={14} color={Colors.primary[600]} />
                  <Text style={styles.stationPhoneText}>Call Station</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Add Fuel Entry Modal
const AddFuelEntryModal = ({ 
  visible, 
  onClose, 
  onSave,
  selectedStation 
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSave: (entry: Partial<FuelLog>) => void;
  selectedStation?: FuelStation;
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    cost: '',
    pricePerGallon: selectedStation?.currentPrice.toString() || '',
    location: selectedStation?.name || '',
    engineHours: '',
    isFullFill: false,
    fuelType: 'Regular' as 'Regular' | 'Premium' | 'Diesel',
    paymentMethod: 'Card' as 'Cash' | 'Card' | 'Mobile',
    notes: '',
    receiptPhoto: ''
  });
  
  const handleSave = () => {
    if (!formData.amount || !formData.cost || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const entry: Partial<FuelLog> = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      amount: parseFloat(formData.amount),
      cost: parseFloat(formData.cost),
      pricePerGallon: parseFloat(formData.pricePerGallon),
      location: formData.location,
      stationId: selectedStation?.id,
      engineHours: formData.engineHours ? parseFloat(formData.engineHours) : undefined,
      isFullFill: formData.isFullFill,
      fuelType: formData.fuelType,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      receiptPhoto: formData.receiptPhoto
    };
    
    onSave(entry);
    onClose();
  };
  
  const handlePhotoTaken = (photoUri: string) => {
    setFormData(prev => ({ ...prev, receiptPhoto: photoUri }));
    setShowCamera(false);
  };
  
  return (
    <Modal
      visible={visible}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Fuel Entry</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Fuel Details</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formInputContainer}>
                <Text style={styles.formLabel}>Amount (gallons) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.amount}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                  placeholder="0.0"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formInputContainer}>
                <Text style={styles.formLabel}>Total Cost *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.cost}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, cost: text }))}
                  placeholder="$0.00"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.formInputContainer}>
              <Text style={styles.formLabel}>Price per Gallon</Text>
              <TextInput
                style={styles.formInput}
                value={formData.pricePerGallon}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pricePerGallon: text }))}
                placeholder="$0.00"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formInputContainer}>
              <Text style={styles.formLabel}>Location *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Fuel station name"
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Additional Details</Text>
            
            <View style={styles.formInputContainer}>
              <Text style={styles.formLabel}>Engine Hours</Text>
              <TextInput
                style={styles.formInput}
                value={formData.engineHours}
                onChangeText={(text) => setFormData(prev => ({ ...prev, engineHours: text }))}
                placeholder="0.0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formToggleContainer}>
              <Text style={styles.formLabel}>Full Tank Fill</Text>
              <TouchableOpacity
                style={[styles.formToggle, formData.isFullFill && styles.formToggleActive]}
                onPress={() => setFormData(prev => ({ ...prev, isFullFill: !prev.isFullFill }))}
              >
                <Text style={[styles.formToggleText, formData.isFullFill && styles.formToggleTextActive]}>
                  {formData.isFullFill ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formInputContainer}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder="Optional notes..."
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Receipt Photo</Text>
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={() => setShowCamera(true)}
            >
              <Camera size={24} color={Colors.primary[600]} />
              <Text style={styles.photoButtonText}>
                {formData.receiptPhoto ? 'Photo Captured' : 'Take Receipt Photo'}
              </Text>
            </TouchableOpacity>
            
            {formData.receiptPhoto && (
              <View style={styles.photoPreview}>
                <Receipt size={20} color={Colors.status.success} />
                <Text style={styles.photoPreviewText}>Receipt photo saved</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      
      {showCamera && (
        <CameraInterface
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
          context="fuel_receipt"
          title="Capture Receipt"
        />
      )}
    </Modal>
  );
};

// Enhanced Fuel Log with receipt photos
const FuelLogCard = ({ log }: { log: FuelLog }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <TouchableOpacity 
      style={styles.logCard}
      onPress={() => setShowDetails(!showDetails)}
    >
      <View style={styles.logCardContent}>
        <View style={styles.logHeader}>
          <View style={styles.logDateContainer}>
            <Calendar size={14} color={Colors.neutral[500]} />
            <Text style={styles.logDate}>{log.date} at {log.time}</Text>
          </View>
          <View style={styles.logAmount}>
            <Droplets size={16} color={Colors.primary[600]} />
            <Text style={styles.logAmountText}>{log.amount} gal</Text>
            {log.isFullFill && (
              <View style={styles.fullFillBadge}>
                <Text style={styles.fullFillText}>Full</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.logVisualIndicator}>
          <View style={[styles.logAmountBar, { width: `${(log.amount / 100) * 100}%` }]} />
        </View>
        
        <Text style={styles.logLocation}>{log.location}</Text>
        
        <View style={styles.logFooter}>
          <View style={styles.logCostContainer}>
            <Text style={styles.logCostLabel}>Total</Text>
            <Text style={styles.logCost}>${log.cost.toFixed(2)}</Text>
          </View>
          <View style={styles.logPriceContainer}>
            <Text style={styles.logPriceLabel}>Price</Text>
            <Text style={styles.logPrice}>${log.pricePerGallon.toFixed(2)}/gal</Text>
          </View>
          {log.receiptPhoto && (
            <View style={styles.logReceiptIndicator}>
              <Receipt size={14} color={Colors.status.success} />
              <Text style={styles.logReceiptText}>Receipt</Text>
            </View>
          )}
        </View>
        
        {showDetails && (
          <View style={styles.logDetails}>
            <View style={styles.logDetailRow}>
              <Text style={styles.logDetailLabel}>Engine Hours:</Text>
              <Text style={styles.logDetailValue}>{log.engineHours || 'N/A'}</Text>
            </View>
            <View style={styles.logDetailRow}>
              <Text style={styles.logDetailLabel}>Fuel Type:</Text>
              <Text style={styles.logDetailValue}>{log.fuelType || 'Regular'}</Text>
            </View>
            <View style={styles.logDetailRow}>
              <Text style={styles.logDetailLabel}>Payment:</Text>
              <Text style={styles.logDetailValue}>{log.paymentMethod || 'Card'}</Text>
            </View>
            {log.notes && (
              <View style={styles.logDetailRow}>
                <Text style={styles.logDetailLabel}>Notes:</Text>
                <Text style={styles.logDetailValue}>{log.notes}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Analytics Dashboard
const AnalyticsPanel = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' }
  ];
  
  // Calculate analytics data
  const totalSpent = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalGallons = fuelLogs.reduce((sum, log) => sum + log.amount, 0);
  const avgPrice = totalSpent / totalGallons;
  const lastMonthSpent = totalSpent * 0.85; // Mock data
  const changePercent = ((totalSpent - lastMonthSpent) / lastMonthSpent * 100);
  
  return (
    <View style={styles.analyticsContainer}>
      <View style={styles.analyticsHeader}>
        <Text style={styles.analyticsTitle}>Fuel Analytics</Text>
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.analyticsCards}>
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsCardHeader}>
            <BarChart size={18} color={Colors.primary[600]} />
            <Text style={styles.analyticsCardTitle}>Total Spent</Text>
          </View>
          <Text style={styles.analyticsCardValue}>${totalSpent.toFixed(0)}</Text>
          <View style={[
            styles.analyticsCardTrend,
            { backgroundColor: changePercent > 0 ? '#FFECE3' : '#E3F7ED' }
          ]}>
            <Text style={[
              styles.analyticsCardTrendText,
              { color: changePercent > 0 ? '#D97706' : '#0C955A' }
            ]}>
              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}% vs last period
            </Text>
          </View>
        </View>
        
        <View style={styles.analyticsCard}>
          <View style={styles.analyticsCardHeader}>
            <PieChart size={18} color={Colors.primary[600]} />
            <Text style={styles.analyticsCardTitle}>Avg. Price</Text>
          </View>
          <Text style={styles.analyticsCardValue}>${avgPrice.toFixed(2)}</Text>
          <View style={styles.analyticsCardTrend}>
            <Text style={styles.analyticsCardTrendText}>per gallon</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.exportButton}>
        <Download size={16} color={Colors.primary[600]} />
        <Text style={styles.exportButtonText}>Export Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const FilterOptions = ["All", "Last Week", "Last Month", "Last 3 Months", "Year to Date"];

export default function FuelScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<FuelStation | undefined>();
  const [fuelLevel] = useState(22); // This would come from vessel sensors
  
  const handleAddEntry = () => {
    setShowAddModal(true);
  };
  
  const handleStationSelect = (station: FuelStation) => {
    setSelectedStation(station);
    setShowAddModal(true);
  };
  
  const handleSaveEntry = (entry: Partial<FuelLog>) => {
    // Would save to database/state
    console.log('Saving fuel entry:', entry);
    setSelectedStation(undefined);
  };
  
  const filteredLogs = fuelLogs; // Would filter based on activeFilter
  const periodTotal = filteredLogs.reduce((sum, log) => sum + log.amount, 0);
  const periodAvgCost = filteredLogs.reduce((sum, log) => sum + log.cost, 0) / filteredLogs.length;
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Fuel Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FuelGauge level={fuelLevel} />
        <BudgetProgress />
        <FuelStats />
        <FuelStationLocator onSelectStation={handleStationSelect} />
        <AnalyticsPanel />
        
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <View style={styles.logsTitleRow}>
              <Text style={styles.sectionTitle}>Recent Fuel Log</Text>
              <TouchableOpacity style={styles.searchButton}>
                <Search size={18} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.periodSummary}>
              <Text style={styles.periodSummaryText}>
                Period total: <Text style={styles.periodSummaryValue}>{periodTotal} gallons</Text> • 
                Avg. cost: <Text style={styles.periodSummaryValue}>${periodAvgCost.toFixed(2)}/gal</Text>
              </Text>
            </View>
            
            <View style={styles.filterContainer}>
              {FilterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.logCards}>
            {filteredLogs.map((log) => (
              <FuelLogCard key={log.id} log={log} />
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Archive size={16} color={Colors.primary[700]} />
            <Text style={styles.viewAllText}>View Complete Fuel History</Text>
            <ChevronRight size={16} color={Colors.primary[700]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <AddFuelEntryModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStation(undefined);
        }}
        onSave={handleSaveEntry}
        selectedStation={selectedStation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.neutral[900],
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: Colors.primary[800],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  gaugeContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  gaugeCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  gaugeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  lastRefuelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastRefuelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  gaugeGraphic: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gaugeCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gaugeBackground: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: Colors.neutral[200],
  },
  gaugeFill: {
    position: 'absolute',
    height: 220,
    width: '22%',
    left: 0,
    overflow: 'hidden',
  },
  gradientFill: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: 'transparent',
  },
  gaugeLabels: {
    position: 'absolute',
    width: 220,
    height: 220,
  },
  gaugeLabel: {
    position: 'absolute',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  emptyLabel: {
    left: 8,
    top: 100,
  },
  quarterLabel: {
    left: 46,
    top: 40,
  },
  halfLabel: {
    left: 106,
    top: 8,
  },
  threeQuarterLabel: {
    right: 46,
    top: 40,
  },
  fullLabel: {
    right: 8,
    top: 100,
  },
  gaugeCenter: {
    alignItems: 'center',
  },
  gaugeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    marginTop: 8,
  },
  gaugeEstimate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  gaugeInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  gaugeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeInfoDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[300],
  },
  gaugeInfoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 6,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: Colors.neutral[900],
  },
  statUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  statTrend: {
    marginTop: 12,
    backgroundColor: '#E3F7ED',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statTrendDown: {
    backgroundColor: '#FFECE3',
  },
  statTrendText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#0C955A',
  },
  statTrendTextDown: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: '#E53935',
  },
  budgetContainer: {
    padding: 16,
    marginVertical: 8,
  },
  budgetCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginLeft: 6,
  },
  budgetSettingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.neutral[200],
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetAmountItem: {
    flex: 1,
  },
  budgetAmountDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[300],
  },
  budgetAmountLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  budgetAmountValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  budgetProgressContainer: {
    marginBottom: 12,
  },
  budgetProgressBar: {
    height: 20,
    backgroundColor: Colors.neutral[200],
    borderRadius: 10,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 10,
  },
  budgetProgressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
    marginTop: 4,
  },
  budgetWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.error,
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  budgetWarningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  budgetFooterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalCancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[900],
  },
  modalContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  formSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formInputContainer: {
    flex: 1,
  },
  formLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: Colors.neutral[200],
    padding: 12,
    borderRadius: 8,
  },
  formToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  formToggle: {
    backgroundColor: Colors.neutral[200],
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  formToggleActive: {
    backgroundColor: Colors.primary[100],
  },
  formToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[700],
  },
  formToggleTextActive: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary[700],
  },
  formTextArea: {
    height: 80,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.neutral[200],
  },
  photoButton: {
    backgroundColor: Colors.primary[100],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
  },
  photoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  photoPreviewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  logsSection: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  logsSectionHeader: {
    marginBottom: 16,
  },
  logsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: Colors.neutral[200],
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  periodSummary: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  periodSummaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  periodSummaryValue: {
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[600],
  },
  filterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.neutral[700],
  },
  filterTextActive: {
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  logCards: {
    marginBottom: 16,
  },
  logCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  logCardContent: {
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  logAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  logAmountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary[700],
    marginLeft: 6,
    marginRight: 4,
  },
  fullFillBadge: {
    backgroundColor: Colors.primary[600],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  fullFillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
  },
  logVisualIndicator: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  logAmountBar: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  logLocation: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.neutral[900],
    marginBottom: 10,
  },
  logFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
  },
  logCostContainer: {
    flex: 1,
  },
  logCostLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  logCost: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.neutral[900],
  },
  logPriceContainer: {
    flex: 1,
  },
  logPriceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  logPrice: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  logReceiptIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.status.success,
  },
  logReceiptText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  logDetails: {
    marginTop: 12,
  },
  logDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logDetailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[700],
  },
  logDetailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[900],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.primary[700],
    marginRight: 6,
  },
  stationLocatorContainer: {
    padding: 16,
    marginVertical: 8,
  },
  stationLocatorButton: {
    backgroundColor: Colors.accent[500],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stationLocatorGradient: {
    borderRadius: 8,
  },
  stationLocatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationLocatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stationLocatorText: {
    flex: 1,
  },
  stationLocatorTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stationLocatorDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stationsList: {
    marginTop: 12,
  },
  stationCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  stationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  stationAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  stationPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationPriceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[900],
  },
  stationPriceUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
    marginLeft: 4,
  },
  stationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  stationDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  stationPhoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary[100],
  },
  stationPhoneText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.primary[700],
    marginLeft: 4,
  },
  analyticsContainer: {
    padding: 16,
    marginVertical: 8,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.neutral[800],
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.neutral[200],
  },
  periodButtonActive: {
    backgroundColor: Colors.primary[100],
  },
  periodButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  periodButtonTextActive: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary[700],
  },
  analyticsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analyticsCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.neutral[800],
    marginLeft: 6,
  },
  analyticsCardValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: Colors.neutral[900],
    marginBottom: 12,
  },
  analyticsCardTrend: {
    marginTop: 12,
    backgroundColor: Colors.neutral[200],
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  analyticsCardTrendText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.neutral[700],
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 24,
  },
  exportButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  modalSaveText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[700],
  },
  stationStatus: {
    marginLeft: 8,
  },
  stationStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});