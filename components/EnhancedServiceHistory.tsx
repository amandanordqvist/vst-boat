import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { CameraInterface } from './CameraInterface';

interface ServiceRecord {
  id: string;
  type: 'maintenance' | 'repair' | 'inspection' | 'upgrade';
  title: string;
  description: string;
  cost: number;
  currency: string;
  date: Date;
  provider: string;
  engineHours: number;
  receiptPhoto?: string;
  parts: ServicePart[];
  status: 'completed' | 'pending' | 'scheduled';
  nextDue?: Date;
  category: string;
}

interface ServicePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  warrantyExpiry?: Date;
  inStock: number;
}

interface EnhancedServiceHistoryProps {
  vesselName?: string;
  onServiceUpdated?: (services: ServiceRecord[]) => void;
}

export const EnhancedServiceHistory: React.FC<EnhancedServiceHistoryProps> = ({
  vesselName = "M/Y Seahawk",
  onServiceUpdated
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPartsInventory, setShowPartsInventory] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [filterType, setFilterType] = useState<'all' | ServiceRecord['type']>('all');

  // Mock service data
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: '1',
      type: 'maintenance',
      title: 'Engine Oil Change',
      description: 'Changed engine oil and oil filter. Checked all fluid levels.',
      cost: 850,
      currency: 'SEK',
      date: new Date('2024-01-15'),
      provider: 'Marina Service Center',
      engineHours: 245,
      receiptPhoto: 'https://via.placeholder.com/300x400/4CAF50/white?text=Receipt',
      status: 'completed',
      nextDue: new Date('2024-07-15'),
      category: 'Engine',
      parts: [
        {
          id: 'p1',
          name: 'Engine Oil 15W-40',
          partNumber: 'YAM-15W40-4L',
          quantity: 4,
          unitCost: 120,
          supplier: 'Yamaha Parts',
          warrantyExpiry: new Date('2025-01-15'),
          inStock: 8
        },
        {
          id: 'p2',
          name: 'Oil Filter',
          partNumber: 'YAM-OF-001',
          quantity: 1,
          unitCost: 85,
          supplier: 'Yamaha Parts',
          warrantyExpiry: new Date('2025-01-15'),
          inStock: 3
        }
      ]
    },
    {
      id: '2',
      type: 'repair',
      title: 'Propeller Repair',
      description: 'Repaired damaged propeller blade and balanced.',
      cost: 2400,
      currency: 'SEK',
      date: new Date('2024-01-08'),
      provider: 'Prop Shop Stockholm',
      engineHours: 240,
      status: 'completed',
      category: 'Propulsion',
      parts: []
    },
    {
      id: '3',
      type: 'inspection',
      title: 'Annual Hull Inspection',
      description: 'Complete hull inspection including antifouling check.',
      cost: 1200,
      currency: 'SEK',
      date: new Date('2023-10-20'),
      provider: 'Marine Survey AB',
      engineHours: 180,
      status: 'completed',
      nextDue: new Date('2024-10-20'),
      category: 'Hull',
      parts: []
    }
  ]);

  const [newService, setNewService] = useState({
    type: 'maintenance' as ServiceRecord['type'],
    title: '',
    description: '',
    cost: '',
    provider: '',
    category: '',
    receiptPhoto: ''
  });

  // Mock parts inventory
  const [partsInventory, setPartsInventory] = useState<ServicePart[]>([
    {
      id: 'inv1',
      name: 'Engine Oil 15W-40',
      partNumber: 'YAM-15W40-4L',
      quantity: 8,
      unitCost: 120,
      supplier: 'Yamaha Parts',
      warrantyExpiry: new Date('2025-01-15'),
      inStock: 8
    },
    {
      id: 'inv2',
      name: 'Oil Filter',
      partNumber: 'YAM-OF-001',
      quantity: 3,
      unitCost: 85,
      supplier: 'Yamaha Parts',
      warrantyExpiry: new Date('2025-01-15'),
      inStock: 3
    },
    {
      id: 'inv3',
      name: 'Spark Plugs (Set of 4)',
      partNumber: 'YAM-SP-004',
      quantity: 2,
      unitCost: 320,
      supplier: 'Yamaha Parts',
      warrantyExpiry: new Date('2026-01-01'),
      inStock: 2
    },
    {
      id: 'inv4',
      name: 'Fuel Filter',
      partNumber: 'YAM-FF-002',
      quantity: 1,
      unitCost: 150,
      supplier: 'Yamaha Parts',
      warrantyExpiry: new Date('2025-06-15'),
      inStock: 1
    }
  ]);

  const serviceTypes = [
    { key: 'all', label: 'All', icon: 'list', color: Colors.neutral[600] },
    { key: 'maintenance', label: 'Maintenance', icon: 'settings', color: Colors.status.success },
    { key: 'repair', label: 'Repair', icon: 'hammer', color: Colors.status.warning },
    { key: 'inspection', label: 'Inspection', icon: 'search', color: Colors.primary[600] },
    { key: 'upgrade', label: 'Upgrade', icon: 'trending-up', color: Colors.status.info }
  ];

  const getServiceIcon = (type: ServiceRecord['type']) => {
    switch (type) {
      case 'maintenance': return 'settings';
      case 'repair': return 'hammer';
      case 'inspection': return 'search';
      case 'upgrade': return 'trending-up';
      default: return 'list';
    }
  };

  const getServiceColor = (type: ServiceRecord['type']) => {
    switch (type) {
      case 'maintenance': return Colors.status.success;
      case 'repair': return Colors.status.warning;
      case 'inspection': return Colors.primary[600];
      case 'upgrade': return Colors.status.info;
      default: return Colors.neutral[600];
    }
  };

  const getStatusColor = (status: ServiceRecord['status']) => {
    switch (status) {
      case 'completed': return Colors.status.success;
      case 'pending': return Colors.status.warning;
      case 'scheduled': return Colors.status.info;
      default: return Colors.neutral[400];
    }
  };

  const filteredServices = serviceRecords
    .filter(service => filterType === 'all' || service.type === filterType)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalCosts = serviceRecords.reduce((sum, service) => sum + service.cost, 0);
  const completedServices = serviceRecords.filter(s => s.status === 'completed').length;
  const pendingServices = serviceRecords.filter(s => s.status === 'pending').length;

  const handleCameraPhoto = (photoUri: string) => {
    setNewService({ ...newService, receiptPhoto: photoUri });
    setShowCameraModal(false);
  };

  const handleAddService = () => {
    if (!newService.title || !newService.provider || !newService.cost) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const service: ServiceRecord = {
      id: Date.now().toString(),
      title: newService.title,
      description: newService.description,
      type: newService.type,
      cost: parseFloat(newService.cost),
      currency: 'SEK',
      date: new Date(),
      provider: newService.provider,
      engineHours: 250 + Math.floor(Math.random() * 50),
      receiptPhoto: newService.receiptPhoto,
      status: 'completed',
      category: newService.category || 'General',
      parts: []
    };

    setServiceRecords([service, ...serviceRecords]);
    setNewService({
      type: 'maintenance',
      title: '',
      description: '',
      cost: '',
      provider: '',
      category: '',
      receiptPhoto: ''
    });
    setShowAddModal(false);
    
    Alert.alert('Success', 'Service record added successfully');
  };

  const isLowStock = (part: ServicePart) => part.inStock <= 2;
  const isExpiringSoon = (part: ServicePart) => {
    if (!part.warrantyExpiry) return false;
    const monthsToExpiry = (part.warrantyExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsToExpiry <= 6;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Service History</Text>
          <Text style={styles.headerSubtitle}>{vesselName}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowPartsInventory(true)}
          >
            <Ionicons name="cube" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedServices}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCosts.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Cost (SEK)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingServices}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {serviceTypes.map(type => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterTab,
                filterType === type.key && styles.filterTabActive
              ]}
              onPress={() => setFilterType(type.key as any)}
            >
              <Ionicons 
                name={type.icon as any} 
                size={16} 
                color={filterType === type.key ? '#fff' : type.color} 
              />
              <Text style={[
                styles.filterTabText,
                filterType === type.key && styles.filterTabTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Service Timeline</Text>
          
          {filteredServices.map((service, index) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.timelineItem}
              onPress={() => setSelectedService(service)}
            >
              <View style={styles.timelineIndicator}>
                <View style={[styles.timelineDot, { backgroundColor: getServiceColor(service.type) }]} />
                {index < filteredServices.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.timelineContent}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <View style={styles.serviceMeta}>
                      <View style={[styles.typeBadge, { backgroundColor: getServiceColor(service.type) }]}>
                        <Ionicons 
                          name={getServiceIcon(service.type) as any} 
                          size={12} 
                          color="#fff" 
                        />
                        <Text style={styles.typeText}>{service.type}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(service.status) }]}>
                        <Text style={styles.statusText}>{service.status}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.serviceCost}>
                    <Text style={styles.costAmount}>{service.cost.toLocaleString()}</Text>
                    <Text style={styles.costCurrency}>{service.currency}</Text>
                  </View>
                </View>

                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="business" size={14} color={Colors.neutral[500]} />
                    <Text style={styles.detailText}>{service.provider}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={14} color={Colors.neutral[500]} />
                    <Text style={styles.detailText}>{service.date.toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="speedometer" size={14} color={Colors.neutral[500]} />
                    <Text style={styles.detailText}>{service.engineHours}h</Text>
                  </View>
                </View>

                {service.receiptPhoto && (
                  <View style={styles.receiptContainer}>
                    <Image source={{ uri: service.receiptPhoto }} style={styles.receiptThumbnail} />
                    <Text style={styles.receiptText}>Receipt attached</Text>
                  </View>
                )}

                {service.parts.length > 0 && (
                  <View style={styles.partsContainer}>
                    <Text style={styles.partsTitle}>Parts Used ({service.parts.length})</Text>
                    <View style={styles.partsList}>
                      {service.parts.slice(0, 2).map(part => (
                        <Text key={part.id} style={styles.partItem}>
                          {part.name} x{part.quantity}
                        </Text>
                      ))}
                      {service.parts.length > 2 && (
                        <Text style={styles.moreParts}>+{service.parts.length - 2} more</Text>
                      )}
                    </View>
                  </View>
                )}

                {service.nextDue && (
                  <View style={styles.nextDueContainer}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.status.warning} />
                    <Text style={styles.nextDueText}>
                      Next due: {service.nextDue.toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Service Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Service Record</Text>
            <TouchableOpacity onPress={handleAddService}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Service Type</Text>
              <View style={styles.typeSelector}>
                {serviceTypes.slice(1).map(type => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeOption,
                      newService.type === type.key && styles.typeOptionSelected
                    ]}
                    onPress={() => setNewService({...newService, type: type.key as ServiceRecord['type']})}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={20} 
                      color={newService.type === type.key ? '#fff' : type.color} 
                    />
                    <Text style={[
                      styles.typeOptionText,
                      newService.type === type.key && styles.typeOptionTextSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newService.title}
                onChangeText={(text) => setNewService({...newService, title: text})}
                placeholder="Enter service title"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newService.description}
                onChangeText={(text) => setNewService({...newService, description: text})}
                placeholder="Describe the service performed..."
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cost (SEK) *</Text>
              <TextInput
                style={styles.input}
                value={newService.cost}
                onChangeText={(text) => setNewService({...newService, cost: text})}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Service Provider *</Text>
              <TextInput
                style={styles.input}
                value={newService.provider}
                onChangeText={(text) => setNewService({...newService, provider: text})}
                placeholder="Enter provider name"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.input}
                value={newService.category}
                onChangeText={(text) => setNewService({...newService, category: text})}
                placeholder="e.g., Engine, Hull, Electronics"
                placeholderTextColor={Colors.neutral[500]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Receipt Photo</Text>
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={() => setShowCameraModal(true)}
              >
                {newService.receiptPhoto ? (
                  <View style={styles.photoPreview}>
                    <Image source={{ uri: newService.receiptPhoto }} style={styles.photoThumbnail} />
                    <Text style={styles.photoText}>Receipt captured</Text>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera" size={24} color={Colors.neutral[500]} />
                    <Text style={styles.photoPlaceholderText}>Take photo of receipt</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal visible={showCameraModal} animationType="slide" presentationStyle="fullScreen">
        <CameraInterface
          context="service"
          onPhotoTaken={handleCameraPhoto}
          onClose={() => setShowCameraModal(false)}
        />
      </Modal>

      {/* Parts Inventory Modal */}
      <Modal visible={showPartsInventory} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPartsInventory(false)}>
              <Text style={styles.cancelButton}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Parts Inventory</Text>
            <TouchableOpacity>
              <Ionicons name="add" size={24} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inventoryStats}>
              <View style={styles.inventoryStat}>
                <Text style={styles.inventoryStatNumber}>{partsInventory.length}</Text>
                <Text style={styles.inventoryStatLabel}>Total Parts</Text>
              </View>
              <View style={styles.inventoryStat}>
                <Text style={styles.inventoryStatNumber}>
                  {partsInventory.filter(p => isLowStock(p)).length}
                </Text>
                <Text style={styles.inventoryStatLabel}>Low Stock</Text>
              </View>
              <View style={styles.inventoryStat}>
                <Text style={styles.inventoryStatNumber}>
                  {partsInventory.filter(p => isExpiringSoon(p)).length}
                </Text>
                <Text style={styles.inventoryStatLabel}>Expiring Soon</Text>
              </View>
            </View>

            <View style={styles.partsList}>
              {partsInventory.map(part => (
                <View key={part.id} style={styles.partCard}>
                  <View style={styles.partHeader}>
                    <Text style={styles.partName}>{part.name}</Text>
                    <View style={styles.partQuantity}>
                      <Text style={[
                        styles.quantityText,
                        isLowStock(part) && styles.lowStockText
                      ]}>
                        {part.inStock} in stock
                      </Text>
                      {isLowStock(part) && (
                        <Ionicons name="warning" size={16} color={Colors.status.warning} />
                      )}
                    </View>
                  </View>

                  <Text style={styles.partNumber}>P/N: {part.partNumber}</Text>
                  <Text style={styles.partSupplier}>Supplier: {part.supplier}</Text>
                  <Text style={styles.partCost}>Unit Cost: {part.unitCost} SEK</Text>

                  {part.warrantyExpiry && (
                    <View style={styles.warrantyContainer}>
                      <Ionicons 
                        name="shield-checkmark" 
                        size={14} 
                        color={isExpiringSoon(part) ? Colors.status.warning : Colors.status.success} 
                      />
                      <Text style={[
                        styles.warrantyText,
                        isExpiringSoon(part) && styles.expiringText
                      ]}>
                        Warranty: {part.warrantyExpiry.toLocaleDateString()}
                        {isExpiringSoon(part) && ' (Expiring Soon)'}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
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
    backgroundColor: Colors.secondary[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: Colors.primary[600],
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[700],
  },
  filterTabTextActive: {
    color: '#fff',
  },
  timelineContainer: {
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.neutral[200],
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  serviceMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  serviceCost: {
    alignItems: 'flex-end',
  },
  costAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
  },
  costCurrency: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  receiptThumbnail: {
    width: 30,
    height: 40,
    borderRadius: 4,
  },
  receiptText: {
    fontSize: 12,
    color: Colors.status.success,
    fontWeight: '500',
  },
  partsContainer: {
    marginBottom: 12,
  },
  partsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 4,
  },
  partsList: {
    gap: 12,
  },
  partItem: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  moreParts: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  nextDueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextDueText: {
    fontSize: 12,
    color: Colors.status.warning,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.neutral[600],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  saveButton: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral[900],
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    gap: 12,
  },
  typeOptionSelected: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  typeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[900],
    textTransform: 'capitalize',
  },
  typeOptionTextSelected: {
    color: '#fff',
  },
  photoButton: {
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreview: {
    alignItems: 'center',
    gap: 8,
  },
  photoThumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  photoText: {
    fontSize: 14,
    color: Colors.status.success,
    fontWeight: '500',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  inventoryStats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  inventoryStat: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  inventoryStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary[600],
  },
  inventoryStatLabel: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginTop: 4,
    textAlign: 'center',
  },
  partCard: {
    backgroundColor: Colors.neutral[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
  },
  partQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quantityText: {
    fontSize: 14,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  lowStockText: {
    color: Colors.status.warning,
  },
  partNumber: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  partSupplier: {
    fontSize: 12,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  partCost: {
    fontSize: 14,
    color: Colors.neutral[700],
    fontWeight: '500',
    marginBottom: 8,
  },
  warrantyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warrantyText: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  expiringText: {
    color: Colors.status.warning,
    fontWeight: '500',
  },
}); 